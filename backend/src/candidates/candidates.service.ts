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
          },
        },
      },
    });
  }

  async getCandidatesByCompanyId(companyId: string, userId: string) {
    // Vérifier que l'utilisateur appartient bien à cette entreprise
    const company = await this.prisma.company.findUnique({
      where: { id: companyId, userId },
    });

    if (!company) {
      throw new BadRequestException(
        'Unauthorized: You can only view candidates for your own company',
      );
    }

    return await this.prisma.candidate.findMany({
      where: {
        jobPosting: {
          companyId,
        },
      },
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
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
      include: {
        jobPosting: {
          include: {
            company: true,
          },
        },
      },
    });
    if (!existingCandidate) {
      throw new BadRequestException('Candidate not found');
    }

    // Vérifier s'il y a déjà une candidature acceptée seulement si on essaie d'accepter cette candidature
    if (data.status === 'ACCEPTED') {
      const acceptedCandidate = await this.prisma.candidate.findFirst({
        where: {
          jobPostingId: existingCandidate.jobPostingId,
          status: 'ACCEPTED',
        },
      });
      if (acceptedCandidate) {
        throw new BadRequestException(
          'A candidate has already been accepted for this job posting',
        );
      }
    }

    const updatedCandidate = await this.prisma.candidate.update({
      where: { id },
      data: {
        status: data.status,
      },
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
          },
        },
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

  async updateCandidateByCompany(
    id: string,
    data: UpdateCandidateDto,
    userId: string,
  ) {
    // Vérifier que l'utilisateur appartient bien à l'entreprise qui a posté l'offre
    const existingCandidate = await this.prisma.candidate.findUnique({
      where: { id },
      include: {
        jobPosting: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!existingCandidate) {
      throw new BadRequestException('Candidate not found');
    }

    if (existingCandidate.jobPosting.company.userId !== userId) {
      throw new BadRequestException(
        'Unauthorized: You can only update candidates for your own job postings',
      );
    }

    return this.updateCandidate(id, data);
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
