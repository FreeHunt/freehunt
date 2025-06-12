import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
@Injectable()
export class CandidatesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCandidate(data: CreateCandidateDto) {
    return await this.prisma.candidate.create({
      data: {
        ...data,
      },
      include: {
        jobPosting: true,
        freelance: true,
      },
    });
  }

  async getCandidatesByJobPostingId(jobPostingId: string) {
    return await this.prisma.candidate.findMany({
      where: {
        jobPostingId,
      },
    });
  }

  async getCandidateById(id: string) {
    return await this.prisma.candidate.findUnique({
      where: {
        id,
      },
    });
  }

  async updateCandidate(id: string, data: UpdateCandidateDto) {
    return await this.prisma.candidate.update({
      where: { id },
      data,
    });
  }
}
