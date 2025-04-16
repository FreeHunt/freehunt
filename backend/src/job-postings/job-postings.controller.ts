import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JobPostingsService } from './job-postings.service';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';
import { SearchJobPostingDto } from './dto/search-job-posting.dto';
import { JobPostingResponseDto } from './dto/job-posting-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('job-postings')
@Controller('job-postings')
export class JobPostingsController {
  constructor(private readonly jobPostingsService: JobPostingsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a job posting',
    description: 'Create a new job posting with optional skills',
  })
  @ApiResponse({
    status: 201,
    description: 'The job posting has been successfully created',
    type: JobPostingResponseDto,
  })
  create(
    @Body() createJobPostingDto: CreateJobPostingDto,
  ): Promise<JobPostingResponseDto> {
    return this.jobPostingsService.create(createJobPostingDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all job postings',
    description: 'Retrieve all job postings with their skills and company',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all job postings',
    type: [JobPostingResponseDto],
  })
  findAll(): Promise<JobPostingResponseDto[]> {
    return this.jobPostingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find a job posting by ID',
    description: 'Retrieve a job posting by its ID with skills and company',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the job posting (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the job posting with the specified ID',
    type: JobPostingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Job posting not found',
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<JobPostingResponseDto | null> {
    return this.jobPostingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a job posting',
    description: 'Update a job posting with optional skills modification',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the job posting (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The job posting has been successfully updated',
    type: JobPostingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Job posting not found',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateJobPostingDto: UpdateJobPostingDto,
  ): Promise<JobPostingResponseDto> {
    return this.jobPostingsService.update(id, updateJobPostingDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove a job posting',
    description: 'Delete a job posting by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the job posting (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The job posting has been successfully deleted',
    type: JobPostingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Job posting not found',
  })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<JobPostingResponseDto> {
    return this.jobPostingsService.remove(id);
  }

  @Post('search')
  @ApiOperation({
    summary: 'Search job postings',
    description: 'Search job postings by title, skills, and/or location',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns job postings matching the search criteria',
    type: [JobPostingResponseDto],
  })
  search(
    @Body() searchJobPostingDto: SearchJobPostingDto,
  ): Promise<JobPostingResponseDto[]> {
    return this.jobPostingsService.search(searchJobPostingDto);
  }
}
