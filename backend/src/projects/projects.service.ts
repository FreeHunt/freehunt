import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from '@/src/projects/dto/create-project.dto';
import { UpdateProjectDto } from '@/src/projects/dto/update-project.dto';
import { PrismaService } from '@/src/common/prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaService: PrismaService) {}

  // Create a new project
  async create(createProjectDto: CreateProjectDto) {
    return this.prismaService.project.create({ 
      data: createProjectDto,
      include: {
        freelance: true,
        jobPosting: true,
      }});
  }

  // Find all projects
  async findAll() {
    const projects = await this.prismaService.project.findMany({
      include: {
        freelance: true,
        jobPosting: true,
      }
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
      }
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
      }
    });
  }

  // Remove a project
  async remove(id: string) {
    return this.prismaService.project.delete({
      where: { id },
      include: {
        freelance: true,
        jobPosting: true,
      }
    });
  }
}
