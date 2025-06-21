import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { JobPosting, Prisma } from '@prisma/client';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';
import { SearchJobPostingDto } from './dto/search-job-posting.dto';
import { JobPostingSearchResult } from './dto/job-posting-search-result.dto';

@Injectable()
export class JobPostingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateJobPostingDto): Promise<JobPosting> {
    const { skillIds, ...jobPostingData } = data;

    return this.prisma.jobPosting.create({
      data: {
        ...jobPostingData,
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
  ): Promise<JobPostingSearchResult> {
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

    const where: Prisma.JobPostingWhereInput = {};

    if (title) {
      where.title = { contains: title, mode: 'insensitive' };
    }

    if (skillNames && skillNames.length > 0) {
      where.skills = {
        some: {
          name: { in: skillNames, mode: 'insensitive' },
        },
      };
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

    const total = await this.prisma.jobPosting.count({ where });

    const data = await this.prisma.jobPosting.findMany({
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
      skip,
      take,
      ...(title && {
        orderBy: {
          _relevance: {
            fields: ['title', 'description'],
            search: title,
            sort: 'desc',
          },
        },
      }),
    });

    return {
      data,
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
}
