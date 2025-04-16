import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { JobPosting, Prisma } from '@prisma/client';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';
import { SearchJobPostingDto } from './dto/search-job-posting.dto';

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
        company: true,
      },
    });
  }

  async findAll(): Promise<JobPosting[]> {
    return this.prisma.jobPosting.findMany({
      include: {
        skills: true,
        company: true,
      },
    });
  }

  async findOne(id: string): Promise<JobPosting | null> {
    return this.prisma.jobPosting.findUnique({
      where: { id },
      include: {
        skills: true,
        company: true,
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
        company: true,
      },
    });
  }

  async remove(id: string): Promise<JobPosting> {
    return this.prisma.jobPosting.delete({
      where: { id },
      include: {
        skills: true,
        company: true,
      },
    });
  }

  async search(searchParams: SearchJobPostingDto): Promise<JobPosting[]> {
    const { title, skillNames, location, skip, take } = searchParams;

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

    return this.prisma.jobPosting.findMany({
      where,
      include: {
        skills: true,
        company: true,
      },
      skip,
      take,
    });
  }
}
