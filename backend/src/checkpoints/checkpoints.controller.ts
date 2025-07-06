import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';
import { CreateCheckpointDto } from './dto/create-checkpoint.dto';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';
import { ApiTags } from '@nestjs/swagger';
import { StripeService } from '../common/stripe/stripe.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { CheckpointStatus } from '@prisma/client';
import { QuoteService } from '../quote/quote.service';
import { CheckpointResponseDto } from './dto/checkpoint-response.dto';

@Controller('checkpoints')
@ApiTags('Checkpoints')
export class CheckpointsController {
  constructor(
    private readonly checkpointsService: CheckpointsService,
    private readonly stripeService: StripeService,
    private readonly quoteService: QuoteService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  create(
    @Body() createCheckpointDto: CreateCheckpointDto,
  ): Promise<CheckpointResponseDto> {
    return this.checkpointsService.create(createCheckpointDto);
  }

  @Get('job-posting/:jobPostingId')
  findByJobPostingId(@Param('jobPostingId') jobPostingId: string) {
    return this.checkpointsService.findByJobPostingId(jobPostingId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkpointsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCheckpointDto: UpdateCheckpointDto,
  ) {
    const checkpoint = await this.checkpointsService.findOne(id);
    if (!checkpoint) {
      throw new BadRequestException('Checkpoint not found');
    }

    // Récupérer les informations du projet et des utilisateurs
    const project = await this.prismaService.project.findFirst({
      where: { jobPostingId: checkpoint.jobPostingId },
      include: {
        freelance: { include: { user: true } },
        company: { include: { user: true } },
        jobPosting: true,
      },
    });

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    const newStatus = updateCheckpointDto.status as CheckpointStatus;
    const currentUser = updateCheckpointDto.userId;
    if (!currentUser) {
      throw new BadRequestException('User ID is required');
    }
    const isCompany = project.company?.user.id === currentUser;
    const isFreelance = project.freelance?.user.id === currentUser;

    // Logique de validation selon qui fait la demande
    if (newStatus === CheckpointStatus.DONE) {
      if (isFreelance) {
        // Freelance soumet pour validation
        updateCheckpointDto.status = CheckpointStatus.PENDING_COMPANY_APPROVAL;
        updateCheckpointDto.submittedAt = new Date().toISOString();
        updateCheckpointDto.submittedBy = currentUser;
        
        // TODO: Envoyer notification à la company
        console.log(`Freelance ${currentUser} submitted checkpoint ${id} for approval`);
        
      } else if (isCompany) {
        // Company valide directement
        updateCheckpointDto.status = CheckpointStatus.DONE;
        updateCheckpointDto.validatedAt = new Date().toISOString();
        updateCheckpointDto.validatedBy = currentUser;
        
        // Effectuer le transfert Stripe
        await this.processCheckpointPayment(checkpoint, project);
        
        // Vérifier si c'est le dernier checkpoint et finaliser le projet si nécessaire
        await this.checkProjectCompletion(project);
        
      } else {
        throw new BadRequestException('Unauthorized to validate checkpoint');
      }
    } else if (newStatus === CheckpointStatus.PENDING_COMPANY_APPROVAL && checkpoint.status === CheckpointStatus.PENDING_COMPANY_APPROVAL) {
      // Company confirme le checkpoint en attente
      if (isCompany) {
        updateCheckpointDto.status = CheckpointStatus.DONE;
        updateCheckpointDto.validatedAt = new Date().toISOString();
        updateCheckpointDto.validatedBy = currentUser;
        
        // Effectuer le transfert Stripe
        await this.processCheckpointPayment(checkpoint, project);
        
        // Vérifier si c'est le dernier checkpoint et finaliser le projet si nécessaire
        await this.checkProjectCompletion(project);
        
      } else {
        throw new BadRequestException('Only company can approve pending checkpoints');
      }
    }

    return this.checkpointsService.update(id, updateCheckpointDto);
  }

  private async processCheckpointPayment(checkpoint: any, project: any) {
    if (!project.freelance?.stripeAccountId) {
      throw new BadRequestException('Freelance Stripe account not found');
    }

    try {
      await this.stripeService.transferFundsToAccountStripe(
        project.freelance.stripeAccountId,
        checkpoint.amount,
      );
      console.log(`Payment transferred for checkpoint ${checkpoint.id}: ${checkpoint.amount}€`);
    } catch (error) {
      console.error('Payment transfer failed:', error);
      throw new BadRequestException('Payment transfer failed');
    }
  }

  private async checkProjectCompletion(project: any) {
    // Récupérer tous les checkpoints du projet
    const allCheckpoints = await this.checkpointsService.findByJobPostingId(project.jobPostingId);
    
    // Vérifier si tous les checkpoints sont terminés
    const allCompleted = allCheckpoints.every(cp => cp.status === CheckpointStatus.DONE);
    
    if (allCompleted && project.status !== 'COMPLETED') {
      // Marquer le projet comme terminé
      await this.prismaService.project.update({
        where: { id: project.id },
        data: { 
          status: 'COMPLETED',
          endDate: new Date(),
        },
      });
      
      console.log(`Project ${project.id} marked as COMPLETED`);
      
      // TODO: Envoyer notifications de fin de projet
      // TODO: Déclencher les processus de fin de projet (factures, évaluations, etc.)
    }
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.checkpointsService.delete(id);
  }
}
