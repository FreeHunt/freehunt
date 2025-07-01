import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { CandidateResponseDto } from './dto/candidate-response.dto';
import { AuthentikAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUsers.decorators';
import { User } from '@prisma/client';

@ApiTags('candidates')
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  async createCandidate(@Body() createCandidateDto: CreateCandidateDto) {
    return this.candidatesService.createCandidate(createCandidateDto);
  }

  @Get('company/:companyId')
  @UseGuards(AuthentikAuthGuard)
  @ApiOperation({
    summary: 'Get candidates by company ID',
    description:
      'Retrieve all candidates for job postings of a specific company',
  })
  @ApiParam({
    name: 'companyId',
    description: 'The ID of the company',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'List of candidates with freelance and job posting details',
    type: [CandidateResponseDto],
  })
  async getCandidatesByCompanyId(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @CurrentUser() user: User,
  ) {
    return this.candidatesService.getCandidatesByCompanyId(companyId, user.id);
  }

  @Get('job-posting/:jobPostingId')
  async getCandidatesByJobPostingId(
    @Param('jobPostingId') jobPostingId: string,
  ) {
    return this.candidatesService.getCandidatesByJobPostingId(jobPostingId);
  }

  @Get(':id')
  async getCandidateById(@Param('id') id: string) {
    return this.candidatesService.getCandidateById(id);
  }

  @Get('freelance/:freelanceId/job-posting/:jobPostingId')
  async getCandidateByFreelanceIdAndJobPostingId(
    @Param('freelanceId') freelanceId: string,
    @Param('jobPostingId') jobPostingId: string,
  ) {
    return this.candidatesService.getCandidateByFreelanceIdAndJobPostingId(
      freelanceId,
      jobPostingId,
    );
  }

  @Put(':id')
  async updateCandidate(
    @Param('id') id: string,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ) {
    return this.candidatesService.updateCandidate(id, updateCandidateDto);
  }

  @Put(':id/company')
  @UseGuards(AuthentikAuthGuard)
  @ApiOperation({
    summary: 'Update candidate status by company',
    description: 'Update a candidate status (accept/reject) by the company',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the candidate',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated candidate with details',
    type: CandidateResponseDto,
  })
  async updateCandidateByCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCandidateDto: UpdateCandidateDto,
    @CurrentUser() user: User,
  ) {
    return this.candidatesService.updateCandidateByCompany(
      id,
      updateCandidateDto,
      user.id,
    );
  }

  @Delete(':id')
  async deleteCandidate(@Param('id') id: string) {
    return this.candidatesService.deleteCandidate(id);
  }
}
