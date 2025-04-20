import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  // Create a new project
  async create(createProjectDto: CreateProjectDto) {
    const createdProject = await this.prismaService.project.create({ data: createProjectDto });

    return {
      message: 'Project created successfully',
      data: createdProject,
    };
  }

  // Find all projects
  async findAll() {
    const projects = await this.prismaService.project.findMany({
      include: {
        freelance: true,
        jobPosting: true,
      }
    });
    return { 
      message: 'Projects found successfully',
      data: projects,
    };
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

    return {
      message: 'Project found successfully',
      data: project,
    }
  }

  // Update a project
  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.prismaService.project.update({
      where: { id },
      data: updateProjectDto,
    });

    return {
      message: 'Project updated successfully',
      data: project,
    };
  }

  // Remove a project
  async remove(id: string) {
    const project = await this.prismaService.project.delete({
      where: { id },
    });

    return {
      message: `Project ${project.name} deleted successfully`,
      data: project,
    };
  }
}
