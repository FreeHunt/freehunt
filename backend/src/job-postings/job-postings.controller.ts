import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JobPostingsService } from './job-postings.service';
import { JobPosting } from '@prisma/client';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';
import { SearchJobPostingDto } from './dto/search-job-posting.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('job-postings')
@Controller('job-postings')
export class JobPostingsController {
  constructor(private readonly jobPostingsService: JobPostingsService) {}

  @Post()
  create(
    @Body() createJobPostingDto: CreateJobPostingDto,
  ): Promise<JobPosting> {
    return this.jobPostingsService.create(createJobPostingDto);
  }

  @Get()
  findAll(): Promise<JobPosting[]> {
    return this.jobPostingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<JobPosting | null> {
    return this.jobPostingsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobPostingDto: UpdateJobPostingDto,
  ): Promise<JobPosting> {
    return this.jobPostingsService.update(id, updateJobPostingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<JobPosting> {
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
  })
  search(
    @Body() searchJobPostingDto: SearchJobPostingDto,
  ): Promise<JobPosting[]> {
    return this.jobPostingsService.search(searchJobPostingDto);
  }
}
