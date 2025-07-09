import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectsService } from '@/src/projects/projects.service';
import { CreateProjectDto } from '@/src/projects/dto/create-project.dto';
import { UpdateProjectDto } from '@/src/projects/dto/update-project.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProjectResponseDto } from '@/src/projects/dto/project-response.dto';
import { AuthentikAuthGuard } from '../auth/auth.guard';
import { ProjectAccessGuard } from '../auth/project-access.guard';
import { CurrentUser } from '../common/decorators/currentUsers.decorators';
import { User } from '@prisma/client';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(AuthentikAuthGuard)
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: User,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @UseGuards(AuthentikAuthGuard)
  @ApiOperation({
    summary: 'Find all projects',
    description: 'Retrieve all projects accessible to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of accessible projects',
    type: [ProjectResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'No projects found',
  })
  findAll(@CurrentUser() user: User): Promise<ProjectResponseDto[]> {
    return this.projectsService.findAll(user.id);
  }

  @Get(':id')
  @UseGuards(AuthentikAuthGuard, ProjectAccessGuard)
  @ApiOperation({
    summary: 'Find a project by ID',
    description: 'Retrieve a project by its ID (accessible only to assigned freelance and company)',
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
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You do not have access to this project',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(id, user.id);
  }

  @Patch(':id')
  @UseGuards(AuthentikAuthGuard, ProjectAccessGuard)
  @ApiOperation({
    summary: 'Update a project',
    description: 'Update an existing project (accessible only to assigned freelance and company)',
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
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You do not have access to this project',
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
    @CurrentUser() user: User,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(AuthentikAuthGuard, ProjectAccessGuard)
  @ApiOperation({
    summary: 'Delete a project',
    description: 'Delete a project by its ID (accessible only to assigned freelance and company)',
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
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You do not have access to this project',
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
    @CurrentUser() user: User,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.remove(id);
  }

  @Get('company/:companyId')
  @UseGuards(AuthentikAuthGuard)
  @ApiOperation({
    summary: 'Find projects by company ID',
    description: 'Retrieve all projects for a specific company',
  })
  @ApiParam({
    name: 'companyId',
    description: 'The ID of the company (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of projects for the company',
    type: [ProjectResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found or no projects found',
  })
  findByCompanyId(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @CurrentUser() user: User,
  ): Promise<ProjectResponseDto[]> {
    return this.projectsService.findByCompanyId(companyId, user.id);
  }

  @Get('freelance/:freelanceId')
  @UseGuards(AuthentikAuthGuard)
  @ApiOperation({
    summary: 'Find projects by freelance ID',
    description: 'Retrieve all projects for a specific freelance',
  })
  @ApiParam({
    name: 'freelanceId',
    description: 'The ID of the freelance (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of projects for the freelance',
    type: [ProjectResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Freelance not found or no projects found',
  })
  findByFreelanceId(
    @Param('freelanceId', ParseUUIDPipe) freelanceId: string,
    @CurrentUser() user: User,
  ): Promise<ProjectResponseDto[]> {
    return this.projectsService.findByFreelanceId(freelanceId, user.id);
  }

  @Get('exists/job-posting/:jobPostingId')
  @UseGuards(AuthentikAuthGuard)
  @ApiOperation({
    summary: 'Check if project exists for job posting',
    description:
      'Check if a project has already been created for a specific job posting',
  })
  @ApiParam({
    name: 'jobPostingId',
    description: 'The ID of the job posting (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Boolean indicating if project exists',
    schema: { type: 'boolean' },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  checkProjectExistsForJobPosting(
    @Param('jobPostingId', ParseUUIDPipe) jobPostingId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.projectsService.checkProjectExistsForJobPosting(jobPostingId);
  }
}
