import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from '@/src/projects/projects.service';
import { CreateProjectDto } from '@/src/projects/dto/create-project.dto';
import { UpdateProjectDto } from '@/src/projects/dto/update-project.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProjectResponseDto } from '@/src/projects/dto/project-response.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a project',
    description: 'Create a new project',
  })
  @ApiResponse({
    status: 201,
    description: 'The project has been successfully created.',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  create(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all projects',
    description: 'Retrieve all projects',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all projects',
    type: [ProjectResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No projects found',
  })
  findAll(): Promise<ProjectResponseDto[]> {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find a project by ID',
    description: 'Retrieve a project by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the project (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Project found successfully',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a project',
    description: 'Update an existing project',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the project (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a project',
    description: 'Delete a project by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the project (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  remove(
    @Param('id') id: string,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.remove(id);
  }
}
