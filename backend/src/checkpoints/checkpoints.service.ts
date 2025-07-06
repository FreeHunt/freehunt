import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCheckpointDto } from './dto/create-checkpoint.dto';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';
import { Checkpoint } from '@prisma/client';

@Injectable()
export class CheckpointsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCheckpointDto: CreateCheckpointDto): Promise<Checkpoint> {
    return this.prisma.checkpoint.create({
      data: createCheckpointDto,
    });
  }

  async findAll() {
    return this.prisma.checkpoint.findMany();
  }

  async findOne(id: string) {
    return this.prisma.checkpoint.findUnique({ where: { id } });
  }

  async update(id: string, updateCheckpointDto: UpdateCheckpointDto) {
    return this.prisma.checkpoint.update({
      where: { id },
      data: {
        status: updateCheckpointDto.status,
        date: updateCheckpointDto.date,
        name: updateCheckpointDto.name,
        description: updateCheckpointDto.description,
        jobPostingId: updateCheckpointDto.jobPostingId,
        amount: updateCheckpointDto.amount,
        submittedAt: updateCheckpointDto.submittedAt
          ? new Date(updateCheckpointDto.submittedAt)
          : undefined,
        validatedAt: updateCheckpointDto.validatedAt
          ? new Date(updateCheckpointDto.validatedAt)
          : undefined,
        submittedBy: updateCheckpointDto.submittedBy,
        validatedBy: updateCheckpointDto.validatedBy,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.checkpoint.delete({ where: { id } });
  }

  async findByJobPostingId(jobPostingId: string) {
    return this.prisma.checkpoint.findMany({ where: { jobPostingId } });
  }
}
