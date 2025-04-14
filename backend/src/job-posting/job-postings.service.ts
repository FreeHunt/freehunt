import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { JobPosting } from '@prisma/client';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';

@Injectable()
export class JobPostingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateJobPostingDto): Promise<JobPosting> {
    return this.prisma.jobPosting.create({ data });
  }

  async findAll(): Promise<JobPosting[]> {
    return this.prisma.jobPosting.findMany();
  }

  async findOne(id: string): Promise<JobPosting | null> {
    return this.prisma.jobPosting.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateJobPostingDto): Promise<JobPosting> {
    return this.prisma.jobPosting.update({ where: { id }, data });
  }

  async remove(id: string): Promise<JobPosting> {
    return this.prisma.jobPosting.delete({ where: { id } });
  }
}
