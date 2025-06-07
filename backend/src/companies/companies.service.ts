import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Company } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCompanyDto): Promise<Company> {
    return this.prisma.company.create({
      data,
      include: { user: true },
    });
  }

  async findAll(): Promise<Company[]> {
    return this.prisma.company.findMany({
      include: { user: true },
    });
  }

  async findOne(id: string): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: string): Promise<Company | null> {
    return this.prisma.company.findFirst({
      where: { userId },
      include: { user: true },
    });
  }

  async update(id: string, data: UpdateCompanyDto): Promise<Company> {
    return this.prisma.company.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  async remove(id: string): Promise<Company> {
    return this.prisma.company.delete({
      where: { id },
      include: { user: true },
    });
  }
}
