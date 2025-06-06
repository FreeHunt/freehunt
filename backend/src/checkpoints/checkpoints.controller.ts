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
    if (
      (updateCheckpointDto.status as CheckpointStatus) === CheckpointStatus.DONE
    ) {
      const account = await this.stripeService.getAccountConnection(
        updateCheckpointDto.freelanceId,
      );
      if (account) {
        const checkpoint = await this.checkpointsService.findOne(id);
        if (checkpoint) {
          await this.stripeService.transferFundsToAccountStripe(
            account.id,
            checkpoint.amount * 100,
          );
        }
      } else {
        throw new BadRequestException('Freelance account not found');
      }
      return this.checkpointsService.update(id, updateCheckpointDto);
    }
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.checkpointsService.delete(id);
  }
}
