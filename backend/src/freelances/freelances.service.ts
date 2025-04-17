import { Injectable } from '@nestjs/common';
import { CreateFreelanceDto } from './dto/create-freelance.dto';
import { UpdateFreelanceDto } from './dto/update-freelance.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { Freelance } from '@prisma/client';

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
}
