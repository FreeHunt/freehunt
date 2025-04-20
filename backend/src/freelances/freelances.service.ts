import { Injectable } from '@nestjs/common';
import { CreateFreelanceDto } from './dto/create-freelance.dto';
import { UpdateFreelanceDto } from './dto/update-freelance.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { Freelance, Prisma } from '@prisma/client';
import { SearchFreelanceDto } from './dto/search-freelance.dto';

@Injectable()
export class FreelancesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFreelanceDto): Promise<Freelance> {
    const { skillIds, ...freelanceData } = data;

    return this.prisma.freelance.create({
      data: {
        ...freelanceData,
        skills: skillIds?.length
          ? {
              connect: skillIds?.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        user: true,
        skills: true,
      },
    });
  }

  async findAll(): Promise<Freelance[]> {
    return this.prisma.freelance.findMany({
      include: {
        user: true,
        skills: true,
      },
    });
  }

  async findOne(id: string): Promise<Freelance | null> {
    return this.prisma.freelance.findUnique({
      where: { id },
      include: {
        user: true,
        skills: true,
      },
    });
  }

  async update(id: string, data: UpdateFreelanceDto): Promise<Freelance> {
    const { skillIds, ...freelanceData } = data;

    return this.prisma.freelance.update({
      where: { id },
      data: {
        ...freelanceData,
        skills:
          skillIds !== undefined
            ? {
                set: [],
                connect: skillIds?.map((id) => ({ id })),
              }
            : { set: [] },
      },
      include: {
        user: true,
        skills: true,
      },
    });
  }

  async remove(id: string): Promise<Freelance> {
    return this.prisma.freelance.delete({
      where: { id },
      include: {
        user: true,
        skills: true,
      },
    });
  }

  async search(searchParams: SearchFreelanceDto): Promise<Freelance[]> {
    const {
      query,
      jobTitle,
      skillNames,
      minDailyRate,
      maxDailyRate,
      minSeniority,
      maxSeniority,
      skip,
      take,
    } = searchParams;

    // Build the where conditions
    const where: Prisma.FreelanceWhereInput = {};

    // Handle text search across multiple fields if query is provided
    if (query) {
      where.OR = [
        { firstName: { search: query, mode: 'insensitive' } },
        { lastName: { search: query, mode: 'insensitive' } },
        { location: { search: query, mode: 'insensitive' } },
        { jobTitle: { search: query, mode: 'insensitive' } },
      ];
    }

    // Keep specific job title filter if provided separately
    if (jobTitle) {
      where.jobTitle = { contains: jobTitle, mode: 'insensitive' };
    }

    // Skills filter
    if (skillNames && skillNames.length > 0) {
      where.skills = {
        some: {
          name: { in: skillNames, mode: 'insensitive' },
        },
      };
    }

    // Handle daily rate range
    if (minDailyRate !== undefined || maxDailyRate !== undefined) {
      where.averageDailyRate = {};

      if (minDailyRate !== undefined) {
        where.averageDailyRate.gte = minDailyRate;
      }

      if (maxDailyRate !== undefined) {
        where.averageDailyRate.lte = maxDailyRate;
      }
    }

    // Handle seniority range
    if (minSeniority !== undefined || maxSeniority !== undefined) {
      where.seniority = {};

      if (minSeniority !== undefined) {
        where.seniority.gte = minSeniority;
      }

      if (maxSeniority !== undefined) {
        where.seniority.lte = maxSeniority;
      }
    }

    // Execute the search query
    return this.prisma.freelance.findMany({
      where,
      include: {
        user: true,
        skills: true,
      },
      skip,
      take,
      // Order results by relevance if there's a query
      ...(query && {
        orderBy: {
          _relevance: {
            fields: ['firstName', 'lastName', 'location', 'jobTitle'],
            search: query,
            sort: 'desc',
          },
        },
      }),
    });
  }
}
