import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from '@/src/projects/dto/create-project.dto';
import { UpdateProjectDto } from '@/src/projects/dto/update-project.dto';
import { PrismaService } from '@/src/common/prisma/prisma.service';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { CandidateAcceptedEvent } from '../job-postings/dto/candidate-accepted-event.dto';
import { ConversationsService } from '../conversations/conversations.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly conversationsService: ConversationsService,
  ) {}

  @OnEvent('candidate.accepted')
  async handleCandidateAcceptedEvent(payload: CandidateAcceptedEvent) {
    const jobPosting = await this.prismaService.jobPosting.findUnique({
      where: { id: payload.jobPostingId },
      include: {
        company: {
          include: {
            user: true,
          },
        },
        checkpoints: true,
      },
    });
    if (!jobPosting) {
      throw new NotFoundException(
        `Job posting with id ${payload.jobPostingId} does not exist`,
      );
    }

    // Récupérer les informations du freelance
    const freelance = await this.prismaService.freelance.findUnique({
      where: { id: payload.freelancerId },
      include: {
        user: true,
      },
    });
    if (!freelance) {
      throw new NotFoundException(
        `Freelance with id ${payload.freelancerId} does not exist`,
      );
    }

    // Calculer les dates du projet basées sur les checkpoints
    const checkpointDates = jobPosting.checkpoints.map(
      (cp) => new Date(cp.date),
    );
    const startDate =
      checkpointDates.length > 0
        ? new Date(Math.min(...checkpointDates.map((d) => d.getTime())))
        : new Date();
    const endDate =
      checkpointDates.length > 0
        ? new Date(Math.max(...checkpointDates.map((d) => d.getTime())))
        : null;

    // Calculer le montant total du projet
    const totalAmount = jobPosting.checkpoints.reduce(
      (sum, cp) => sum + cp.amount,
      0,
    );

    // Créer la conversation entre l'entreprise et le freelance
    const conversation = await this.conversationsService.createConversation({
      senderId: jobPosting.company.user.id,
      receiverId: freelance.user.id,
      projectId: undefined, // Pas de projectId dans le modèle Conversation
    });

    // Créer le projet avec la conversation
    const project = await this.create({
      freelanceId: payload.freelancerId,
      jobPostingId: payload.jobPostingId,
      companyId: jobPosting.companyId,
      name: jobPosting.title,
      description: jobPosting.description,
      startDate: startDate,
      endDate: endDate,
      amount: totalAmount,
      conversationId: conversation.id,
    });

    // Pas besoin de mettre à jour la conversation car la relation se fait via le projet

    // Créer un message de bienvenue automatique
    await this.prismaService.message.create({
      data: {
        conversationId: conversation.id,
        senderId: jobPosting.company.user.id,
        receiverId: freelance.user.id,
        content: `🎉 Félicitations ! Votre candidature pour le projet "${jobPosting.title}" a été acceptée. Cette conversation vous permettra de communiquer avec l'équipe tout au long du projet.`,
      },
    });

    console.log(
      `Project ${project.id} created for accepted candidate ${payload.candidateId}`,
    );
    console.log(
      `Conversation ${conversation.id} created between company ${jobPosting.company.user.id} and freelance ${freelance.user.id}`,
    );

    return project;
  }

  // Create a new project
  async create(createProjectDto: CreateProjectDto) {
    return this.prismaService.project.create({
      data: createProjectDto,
      include: {
        freelance: true,
        jobPosting: true,
      },
    });
  }

  // Find all projects
  async findAll() {
    const projects = await this.prismaService.project.findMany({
      include: {
        freelance: true,
        jobPosting: true,
      },
    });

    return projects;
  }

  // Find a project by ID
  async findOne(id: string) {
    const project = await this.prismaService.project.findUnique({
      where: { id },
      include: {
        freelance: true,
        jobPosting: true,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${id} does not exist`);
    }

    return project;
  }

  // Update a project
  async update(id: string, updateProjectDto: UpdateProjectDto) {
    return this.prismaService.project.update({
      where: { id },
      data: updateProjectDto,
      include: {
        freelance: true,
        jobPosting: true,
      },
    });
  }

  // Remove a project
  async remove(id: string) {
    return this.prismaService.project.delete({
      where: { id },
      include: {
        freelance: true,
        jobPosting: true,
      },
    });
  }

  // Find projects by company ID (for companies to view their projects)
  async findByCompanyId(companyId: string, userId: string) {
    // Vérifier que l'utilisateur appartient bien à cette entreprise
    const company = await this.prismaService.company.findUnique({
      where: { id: companyId, userId },
    });

    if (!company) {
      throw new NotFoundException(
        'Unauthorized: You can only view projects for your own company',
      );
    }

    return this.prismaService.project.findMany({
      where: { companyId },
      include: {
        freelance: {
          include: {
            user: true,
            skills: true,
          },
        },
        jobPosting: {
          include: {
            company: true,
            skills: true,
          },
        },
        conversation: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Find projects by freelance ID (for freelances to view their projects)
  async findByFreelanceId(freelanceId: string, userId: string) {
    // Vérifier que l'utilisateur est bien le propriétaire de ce profil freelance
    const freelance = await this.prismaService.freelance.findUnique({
      where: { id: freelanceId, userId },
    });

    if (!freelance) {
      throw new NotFoundException(
        'Unauthorized: You can only view your own projects',
      );
    }

    return this.prismaService.project.findMany({
      where: { freelanceId },
      include: {
        freelance: {
          include: {
            user: true,
            skills: true,
          },
        },
        jobPosting: {
          include: {
            company: true,
            skills: true,
          },
        },
        conversation: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async checkProjectExistsForJobPosting(
    jobPostingId: string,
  ): Promise<boolean> {
    const project = await this.prismaService.project.findFirst({
      where: {
        jobPostingId,
      },
    });
    return !!project;
  }
}
