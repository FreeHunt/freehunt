import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a project',
    description: 'Create a new project',
  })
  @ApiResponse({
    status: 201,
    description: 'The project has been successfully created.',
    type: CreateProjectDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  create(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<{ message: string; data: CreateProjectDto }> {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all projects',
    description: 'Retrieve all projects',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all projects',
    type: [CreateProjectDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No projects found',
  })
  findAll() {
    return this.projectService.findAll();
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
    type: CreateProjectDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
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
    type: UpdateProjectDto,
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
  ): Promise<{ message: string; data: UpdateProjectDto }> {
    return this.projectService.update(id, updateProjectDto);
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
    type: CreateProjectDto,
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
  ) {
    return this.projectService.remove(id);
  }
}
