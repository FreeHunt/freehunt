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
    // Vérifier que le freelance a un compte Stripe connecté
    const freelance = await this.prisma.freelance.findUnique({
      where: { id: data.freelanceId },
      select: { id: true, stripeAccountId: true },
    });

    if (!freelance) {
      throw new NotFoundException('Freelance not found');
    }

    if (!freelance.stripeAccountId) {
      throw new BadRequestException(
        'You must connect your Stripe account before applying to job postings. Please complete your profile setup.',
      );
    }

    const checkPoint = await this.prisma.checkpoint.findFirst({
      where: {
        jobPostingId: data.jobPostingId,
      },
    });
    if (!checkPoint) {
      throw new BadRequestException('Job posting does not have a checkpoint');
    }

    // Vérifier qu'aucun projet n'existe déjà pour ce job posting
    const existingProject = await this.prisma.project.findFirst({
      where: {
        jobPostingId: data.jobPostingId,
      },
    });
    if (existingProject) {
      throw new BadRequestException(
        'Cannot apply: A freelance has already been selected for this job posting',
      );
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

    let projectId: string | undefined;

    if (updatedCandidate.status === 'ACCEPTED') {
      // Refuser automatiquement toutes les autres candidatures en attente pour cette offre
      await this.prisma.candidate.updateMany({
        where: {
          jobPostingId: existingCandidate.jobPostingId,
          status: 'PENDING',
          id: {
            not: updatedCandidate.id, // Exclure la candidature qui vient d'être acceptée
          },
        },
        data: {
          status: 'REJECTED',
        },
      });

      // Émettre l'événement pour créer le projet
      this.eventEmitter.emit('candidate.accepted', {
        candidateId: updatedCandidate.id,
        jobPostingId: existingCandidate.jobPostingId,
        freelancerId: existingCandidate.freelanceId,
        status: updatedCandidate.status,
      });

      // Attendre un peu pour que le projet soit créé, puis le récupérer
      await new Promise((resolve) => setTimeout(resolve, 200));

      const project = await this.prisma.project.findFirst({
        where: {
          jobPostingId: existingCandidate.jobPostingId,
          freelanceId: existingCandidate.freelanceId,
        },
      });

      if (project) {
        projectId = project.id;
      }
    }

    return { ...updatedCandidate, projectId };

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
