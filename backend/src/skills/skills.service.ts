import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma, Skill } from '@prisma/client';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeName(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }

  async create(data: CreateSkillDto): Promise<Skill> {
    return this.prisma.skill.create({
      data: {
        ...data,
        normalizedName: this.normalizeName(data.name),
      },
    });
  }

  async findAll(): Promise<Skill[]> {
    return this.prisma.skill.findMany();
  }

  async findOne(id: string): Promise<Skill | null> {
    return this.prisma.skill.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateSkillDto): Promise<Skill> {
    const updateData: Prisma.SkillUpdateInput = { ...data };

    // Add normalizedName if name is provided
    if (data.name !== undefined) {
      updateData.normalizedName = this.normalizeName(data.name);
    }

    return this.prisma.skill.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<Skill> {
    return this.prisma.skill.delete({ where: { id } });
  }

  async getSkillsByFreelanceId(freelanceId: string): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      where: {
        freelance: {
          some: {
            id: freelanceId,
          },
        },
      },
    });
  }
}
