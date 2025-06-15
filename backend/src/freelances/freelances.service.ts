import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFreelanceDto } from './dto/create-freelance.dto';
import { UpdateFreelanceDto } from './dto/update-freelance.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { Freelance, Prisma } from '@prisma/client';
import { SearchFreelanceDto } from './dto/search-freelance.dto';
import { FreelanceSearchResult } from './dto/freelance-search-result.dto';

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

  async findByUserId(userId: string): Promise<Freelance> {
    const freelance = await this.prisma.freelance.findFirst({
      where: { userId },
      include: {
        user: true,
        skills: true,
      },
    });

    if (!freelance) {
      throw new NotFoundException(
        `Freelance profile not found for user ID: ${userId}`,
      );
    }

    return freelance;
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

  async search(
    searchParams: SearchFreelanceDto,
  ): Promise<FreelanceSearchResult> {
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
      // Define search conditions for freelance fields
      const freelanceFieldsSearch = [
        { firstName: { contains: query, mode: Prisma.QueryMode.insensitive } },
        { lastName: { contains: query, mode: Prisma.QueryMode.insensitive } },
        { location: { contains: query, mode: Prisma.QueryMode.insensitive } },
        { jobTitle: { contains: query, mode: Prisma.QueryMode.insensitive } },
      ];

      // Add skill search to OR conditions
      const skillSearch = {
        skills: {
          some: {
            OR: [
              { name: { contains: query, mode: Prisma.QueryMode.insensitive } },
              {
                normalizedName: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              { aliases: { hasSome: [query] } },
            ],
          },
        },
      };

      where.OR = [...freelanceFieldsSearch, skillSearch];
    }

    // Keep specific job title filter if provided separately
    if (jobTitle) {
      where.jobTitle = { contains: jobTitle, mode: 'insensitive' };
    }

    // Skills filter (when specifically filtering by skill names)
    if (skillNames && skillNames.length > 0) {
      // If we already have a query with skills in OR condition, we need to combine with AND
      if (where.OR) {
        where.AND = [
          {
            skills: {
              some: {
                name: { in: skillNames, mode: 'insensitive' },
              },
            },
          },
        ];
      } else {
        where.skills = {
          some: {
            name: { in: skillNames, mode: 'insensitive' },
          },
        };
      }
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

    // Get total count for pagination
    const total = await this.prisma.freelance.count({ where });

    // Execute the search query
    const data = await this.prisma.freelance.findMany({
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

    return {
      data,
      total,
    };
  }
}
