import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class CandidatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createCandidate(data: CreateCandidateDto) {
    const checkPoint = await this.prisma.checkpoint.findFirst({
      where: {
        jobPostingId: data.jobPostingId,
      },
    });
    if (!checkPoint) {
      throw new BadRequestException('Job posting does not have a checkpoint');
    }
    const checkCandidate = await this.prisma.candidate.findFirst({
      where: {
        jobPostingId: data.jobPostingId,
        freelanceId: data.freelanceId,
      },
    });
    if (checkCandidate) {
      throw new BadRequestException('Candidate already exists');
    }
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

  async getCandidateByFreelanceIdAndJobPostingId(
    freelanceId: string,
    jobPostingId: string,
  ) {
    const candidate = await this.prisma.candidate.findFirst({
      where: {
        freelanceId,
        jobPostingId,
      },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    return candidate;
  }

  async updateCandidate(id: string, data: UpdateCandidateDto) {
    // Fetch the existing candidate by id
    const existingCandidate = await this.prisma.candidate.findUnique({
      where: { id },
    });
    if (!existingCandidate) {
      throw new BadRequestException('Candidate not found');
    }

    // Use the jobPostingId from the existing candidate for the acceptance check
    const candidate = await this.prisma.candidate.findFirst({
      where: {
        jobPostingId: existingCandidate.jobPostingId,
        status: {
          in: ['ACCEPTED', 'REJECTED'],
        },
      },
    });
    if (candidate) {
      throw new BadRequestException('Candidate already accepted');
    }

    const updatedCandidate = await this.prisma.candidate.update({
      where: { id },
      data: {
        status: data.status,
      },
    });
    if (updatedCandidate.status === 'ACCEPTED') {
      console.log(
        this.eventEmitter.emit('candidate.accepted', {
          candidateId: updatedCandidate.id,
          jobPostingId: existingCandidate.jobPostingId,
          freelancerId: existingCandidate.freelanceId,
          status: updatedCandidate.status,
        }),
      );
    }

    return updatedCandidate;
  }

  async deleteCandidate(id: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
    });
    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }
    return await this.prisma.candidate.delete({
      where: { id },
    });
  }
}
