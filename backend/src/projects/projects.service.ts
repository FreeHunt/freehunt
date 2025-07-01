import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from '@/src/projects/dto/create-project.dto';
import { UpdateProjectDto } from '@/src/projects/dto/update-project.dto';
import { PrismaService } from '@/src/common/prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';
import { CandidateAcceptedEvent } from '../job-postings/dto/candidate-accepted-event.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaService: PrismaService) {}

  @OnEvent('candidate.accepted')
  async handleCandidateAcceptedEvent(payload: CandidateAcceptedEvent) {
    const jobPosting = await this.prismaService.jobPosting.findUnique({
      where: { id: payload.jobPostingId },
    });
    if (!jobPosting) {
      throw new NotFoundException(
        `Job posting with id ${payload.jobPostingId} does not exist`,
      );
    }

    await this.create({
      freelanceId: payload.freelancerId,
      jobPostingId: payload.jobPostingId,
      companyId: jobPosting.companyId,
      name: jobPosting.title,
      description: jobPosting.description,
      startDate: new Date(),
      endDate: new Date(),
      amount: jobPosting.averageDailyRate,
    });
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
}
