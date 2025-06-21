import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  async createCandidate(@Body() createCandidateDto: CreateCandidateDto) {
    return this.candidatesService.createCandidate(createCandidateDto);
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

  @Delete(':id')
  async deleteCandidate(@Param('id') id: string) {
    return this.candidatesService.deleteCandidate(id);
  }
}
