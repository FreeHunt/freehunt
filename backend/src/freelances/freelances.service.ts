import { Injectable } from '@nestjs/common';
import { CreateFreelanceDto } from './dto/create-freelance.dto';
import { UpdateFreelanceDto } from './dto/update-freelance.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { Freelance } from '@prisma/client';

@Injectable()
export class FreelancesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFreelanceDto): Promise<Freelance> {
    return this.prisma.freelance.create({
      data,
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
    return this.prisma.freelance.update({
      where: { id },
      data,
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
