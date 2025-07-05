import { Injectable, BadRequestException } from '@nestjs/common';
import { JobPosting, Prisma, Role, Skill, User } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { FreelancesService } from '../freelances/freelances.service';
import { SkillsService } from '../skills/skills.service';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { JobPostingSearchResult } from './dto/job-posting-search-result.dto';
import { SearchJobPostingDto } from './dto/search-job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';

@Injectable()
export class JobPostingsService {
  private readonly RECOMMENDED_THRESHOLD = 3;

  constructor(
    private readonly prisma: PrismaService,
    private readonly skillsService: SkillsService,
    private readonly freelancesService: FreelancesService,
  ) {}

  async create(data: CreateJobPostingDto): Promise<JobPosting> {
    const { skillIds, ...jobPostingData } = data;

    // Créer le job posting avec le statut PENDING_PAYMENT par défaut
    return this.prisma.jobPosting.create({
      data: {
        ...jobPostingData,
        status: 'PENDING_PAYMENT', // Statut par défaut nécessitant un paiement
        skills: skillIds?.length
          ? {
              connect: skillIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        skills: true,
        company: {
          include: {
            user: true,
          },
        },
        checkpoints: true,
      },
    });
  }

  async findAll(): Promise<JobPosting[]> {
    return this.prisma.jobPosting.findMany({
      where: {
        status: 'PUBLISHED', // Ne retourner que les annonces publiées
        candidates: {
          none: {
            status: 'ACCEPTED', // Exclure les annonces avec candidature acceptée
          },
        },
      },
      include: {
        skills: true,
        company: {
          include: {
            user: true,
          },
        },
        checkpoints: true,
      },
    });
  }

  async findOne(id: string): Promise<JobPosting | null> {
    return this.prisma.jobPosting.findUnique({
      where: { id },
      include: {
        skills: true,
        company: {
          include: {
            user: true,
          },
        },
        checkpoints: true,
      },
    });
  }

  async update(id: string, data: UpdateJobPostingDto): Promise<JobPosting> {
    const { skillIds, ...jobPostingData } = data;

    return this.prisma.jobPosting.update({
      where: { id },
      data: {
        ...jobPostingData,
        skills:
          skillIds !== undefined
            ? {
                set: [], // Rebuild list of skills
                connect: skillIds.map((id) => ({ id })),
              }
            : undefined,
      },
      include: {
        skills: true,
        company: {
          include: {
            user: true,
          },
        },
        checkpoints: true,
      },
    });
  }

  async remove(id: string): Promise<JobPosting> {
    // Vérifier qu'aucune candidature n'a été acceptée pour cette annonce
    const acceptedCandidate = await this.prisma.candidate.findFirst({
      where: {
        jobPostingId: id,
        status: 'ACCEPTED',
      },
    });

    if (acceptedCandidate) {
      throw new BadRequestException(
        'Cette annonce ne peut pas être supprimée car une candidature a déjà été acceptée.',
      );
    }

    // Supprimer d'abord les candidatures associées
    await this.prisma.candidate.deleteMany({
      where: { jobPostingId: id },
    });

    // Supprimer les checkpoints associés
    await this.prisma.checkpoint.deleteMany({
      where: { jobPostingId: id },
    });

    // Supprimer l'annonce
    return this.prisma.jobPosting.delete({
      where: { id },
      include: {
        skills: true,
        company: {
          include: {
            user: true,
          },
        },
        checkpoints: true,
      },
    });
  }

  async search(
    searchParams: SearchJobPostingDto,
    user?: User,
  ): Promise<JobPostingSearchResult> {
    let freelanceSkills: Skill[] = [];
    let freelanceSkillIds: string[] = [];

    if (user && user.role === Role.FREELANCE) {
      const freelance = await this.freelancesService.findByUserId(user.id);
      if (freelance) {
        freelanceSkills = await this.skillsService.getSkillsByFreelanceId(
          freelance.id,
        );
        freelanceSkillIds = freelanceSkills.map((skill) => skill.id);
      }
    }

    const {
      title,
      skillNames,
      location,
      minDailyRate,
      maxDailyRate,
      minSeniority,
      maxSeniority,
      skip,
      take,
    } = searchParams;

    const where: Prisma.JobPostingWhereInput = {
      status: 'PUBLISHED', // Ne rechercher que dans les annonces publiées
      candidates: {
        none: {
          status: 'ACCEPTED', // Exclure les annonces avec candidature acceptée
        },
      },
    };
    const andConditions: Prisma.JobPostingWhereInput[] = [];

    if (title) {
      andConditions.push({
        OR: [
          { title: { contains: title, mode: 'insensitive' } },
          {
            skills: {
              some: { name: { contains: title, mode: 'insensitive' } },
            },
          },
        ],
      });
    }

    if (skillNames && skillNames.length > 0) {
      andConditions.push({
        skills: {
          some: {
            name: { in: skillNames, mode: 'insensitive' },
          },
        },
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    if (location) {
      where.location = location;
    }

    // Handle daily rate range
    if (minDailyRate !== undefined || maxDailyRate !== undefined) {
      where.averageDailyRate = {
        ...(minDailyRate !== undefined && { gte: minDailyRate }),
        ...(maxDailyRate !== undefined && { lte: maxDailyRate }),
      } as Prisma.FloatFilter;
    }

    // Handle seniority range
    if (minSeniority !== undefined || maxSeniority !== undefined) {
      where.seniority = {
        ...(minSeniority !== undefined && { gte: minSeniority }),
        ...(maxSeniority !== undefined && { lte: maxSeniority }),
      } as Prisma.IntFilter;
    }

    // Récupérer tous les résultats sans pagination d'abord
    const allData = await this.prisma.jobPosting.findMany({
      where,
      include: {
        skills: true,
        company: {
          include: {
            user: true,
          },
        },
        checkpoints: true,
      },
    });

    // Calculer les recommandations et trier
    const dataWithRecommendations = allData.map((jobPosting) => {
      const jobSkillIds = jobPosting.skills.map((skill) => skill.id);
      const commonSkills = jobSkillIds.filter((skillId) =>
        freelanceSkillIds.includes(skillId),
      );
      const commonSkillsCount = commonSkills.length;
      const recommended = commonSkillsCount >= this.RECOMMENDED_THRESHOLD;

      return {
        ...jobPosting,
        recommended,
        commonSkillsCount, // Propriété temporaire pour le tri
      };
    });

    // Trier : recommended en premier, puis par nombre de skills en commun, puis par ordre original
    const sortedData = dataWithRecommendations.sort((a, b) => {
      // D'abord les recommended
      if (a.recommended && !b.recommended) return -1;
      if (!a.recommended && b.recommended) return 1;

      // Si les deux sont recommended ou non recommended, trier par nombre de skills en commun
      if (a.commonSkillsCount !== b.commonSkillsCount) {
        return b.commonSkillsCount - a.commonSkillsCount;
      }

      // Si égalité, garder l'ordre original (par pertinence si title search)
      return 0;
    });

    // retirer les job postings sans checkpoints
    const dataWithCheckpoints = sortedData.filter(
      (jobPosting) => jobPosting.checkpoints.length !== 0,
    );

    // Calculer le total après tous les filtres
    const total = dataWithCheckpoints.length;

    // Appliquer la pagination sur les données triées
    const paginatedData = dataWithCheckpoints
      .slice(skip || 0, (skip || 0) + (take || sortedData.length))
      .map(({ ...jobPosting }) => jobPosting); // Retirer la propriété temporaire

    return {
      data: paginatedData,
      total,
    };
  }

  async getJobPostingsByUserId(userId: string): Promise<JobPosting[]> {
    return this.prisma.jobPosting.findMany({
      where: { company: { userId } },
      include: {
        skills: true,
        company: {
          include: {
            user: true,
          },
        },
        checkpoints: true,
      },
    });
  }

  /**
   * Méthode pour traiter le paiement d'une annonce
   * @param jobPostingId - ID de l'annonce
   * @param paymentData - Données de paiement (à adapter selon le système de paiement choisi)
   */
  async processPayment(
    jobPostingId: string,
    paymentData?: any,
  ): Promise<JobPosting> {
    // Vérifier que l'annonce existe et est en attente de paiement
    const jobPosting = await this.prisma.jobPosting.findUnique({
      where: { id: jobPostingId },
    });

    if (!jobPosting) {
      throw new BadRequestException('Annonce introuvable');
    }

    if (jobPosting.status !== 'PENDING_PAYMENT') {
      throw new BadRequestException(
        "Cette annonce n'est pas en attente de paiement",
      );
    }

    // TODO: Ici, intégrer la logique de paiement (Stripe, PayPal, etc.)
    // For now, we'll simulate a successful payment
    // En attendant, on ignore paymentData
    console.log('Payment data:', paymentData);

    // Marquer l'annonce comme payée
    return this.prisma.jobPosting.update({
      where: { id: jobPostingId },
      data: {
        status: 'PAID',
      },
      include: {
        skills: true,
        company: {
          include: {
            user: true,
          },
        },
        checkpoints: true,
      },
    });
  }

  /**
   * Publier une annonce après paiement
   * @param jobPostingId - ID de l'annonce
   */
  async publishJobPosting(jobPostingId: string): Promise<JobPosting> {
    // Vérifier que l'annonce existe et est payée
    const jobPosting = await this.prisma.jobPosting.findUnique({
      where: { id: jobPostingId },
    });

    if (!jobPosting) {
      throw new BadRequestException('Annonce introuvable');
    }

    if (jobPosting.status !== 'PAID') {
      throw new BadRequestException(
        "Cette annonce doit être payée avant d'être publiée",
      );
    }

    // Publier l'annonce
    return this.prisma.jobPosting.update({
      where: { id: jobPostingId },
      data: {
        status: 'PUBLISHED',
      },
      include: {
        skills: true,
        company: {
          include: {
            user: true,
          },
        },
        checkpoints: true,
      },
    });
  }

  /**
   * Récupérer les annonces par statut pour une entreprise
   * @param userId - ID de l'utilisateur (entreprise)
   * @param status - Statut des annonces à récupérer (optionnel)
   */
  async getJobPostingsByUserIdAndStatus(
    userId: string,
    status?: string,
  ): Promise<JobPosting[]> {
    const where: Prisma.JobPostingWhereInput = {
      company: { userId },
    };

    if (status) {
      // Type-safe status assignment
      const validStatuses = [
        'PENDING_PAYMENT',
        'PAID',
        'PUBLISHED',
        'DRAFT',
        'EXPIRED',
        'REJECTED',
      ];
      if (validStatuses.includes(status)) {
        where.status = status as
          | 'PENDING_PAYMENT'
          | 'PAID'
          | 'PUBLISHED'
          | 'DRAFT'
          | 'EXPIRED'
          | 'REJECTED';
      }
    }

    return this.prisma.jobPosting.findMany({
      where,
      include: {
        skills: true,
        company: {
          include: {
            user: true,
          },
        },
        checkpoints: true,
      },
    });
  }

  async canBeCancelled(id: string): Promise<boolean> {
    // Vérifier qu'aucune candidature n'a été acceptée pour cette annonce
    const acceptedCandidate = await this.prisma.candidate.findFirst({
      where: {
        jobPostingId: id,
        status: 'ACCEPTED',
      },
    });

    return !acceptedCandidate;
  }

  async getProjectByJobPosting(jobPostingId: string) {
    return this.prisma.project.findUnique({
      where: {
        jobPostingId: jobPostingId,
      },
    });
  }
}
