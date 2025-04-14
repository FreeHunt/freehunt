import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { JobPostingsService } from './job-postings.service';
import { JobPosting } from '@prisma/client';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';
import { ApiTags } from '@nestjs/swagger';

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
}
