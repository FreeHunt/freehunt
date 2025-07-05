import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { JobPostingsService } from './job-postings.service';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';
import { SearchJobPostingDto } from './dto/search-job-posting.dto';
import { JobPostingResponseDto } from './dto/job-posting-response.dto';
import { JobPostingSearchResult } from './dto/job-posting-search-result.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from '../common/decorators/currentUsers.decorators';
import { OptionalAuthInterceptor } from '../common/interceptors/optional-auth.interceptor';

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
  @UseInterceptors(OptionalAuthInterceptor)
  @ApiOperation({
    summary: 'Search job postings',
    description:
      'Search job postings by title, skills, location, daily rate, and/or seniority',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns job postings matching the search criteria',
    type: JobPostingSearchResult,
  })
  @HttpCode(200)
  search(
    @Body() searchJobPostingDto: SearchJobPostingDto,
    @CurrentUser() user?: User,
  ): Promise<JobPostingSearchResult> {
    return this.jobPostingsService.search(searchJobPostingDto, user);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get job postings by user ID',
    description: 'Retrieve all job postings created by a specific user',
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns job postings for the specified user',
    type: [JobPostingResponseDto],
  })
  getJobPostingsByUserId(
    @Param('userId') userId: string,
  ): Promise<JobPostingResponseDto[]> {
    return this.jobPostingsService.getJobPostingsByUserId(userId);
  }

  @Post(':id/payment')
  @ApiOperation({
    summary: 'Process payment for a job posting',
    description:
      'Process payment for a job posting to change status from PENDING_PAYMENT to PAID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the job posting (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The payment has been processed successfully',
    type: JobPostingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format or payment cannot be processed',
  })
  @ApiResponse({
    status: 404,
    description: 'Job posting not found',
  })
  processPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() paymentData?: any,
  ): Promise<JobPostingResponseDto> {
    return this.jobPostingsService.processPayment(id, paymentData);
  }

  @Post(':id/publish')
  @ApiOperation({
    summary: 'Publish a paid job posting',
    description:
      'Publish a job posting that has been paid (change status from PAID to PUBLISHED)',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the job posting (must be a valid UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The job posting has been published successfully',
    type: JobPostingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format or job posting cannot be published',
  })
  @ApiResponse({
    status: 404,
    description: 'Job posting not found',
  })
  publishJobPosting(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<JobPostingResponseDto> {
    return this.jobPostingsService.publishJobPosting(id);
  }

  @Get('user/:userId/status/:status')
  @ApiOperation({
    summary: 'Get job postings by user ID and status',
    description:
      'Retrieve job postings created by a specific user filtered by status',
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
  })
  @ApiParam({
    name: 'status',
    description:
      'The status to filter by (PENDING_PAYMENT, PAID, PUBLISHED, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns job postings for the specified user and status',
    type: [JobPostingResponseDto],
  })
  getJobPostingsByUserIdAndStatus(
    @Param('userId') userId: string,
    @Param('status') status: string,
  ): Promise<JobPostingResponseDto[]> {
    return this.jobPostingsService.getJobPostingsByUserIdAndStatus(
      userId,
      status,
    );
  }
}
