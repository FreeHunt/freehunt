import { ApiProperty } from '@nestjs/swagger';
import { CandidateStatus } from '@prisma/client';

export class FreelanceUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;
}

export class SkillResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;
}

export class FreelanceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  jobTitle: string;

  @ApiProperty()
  averageDailyRate: number;

  @ApiProperty()
  seniority: number;

  @ApiProperty()
  location: string;

  @ApiProperty({ type: FreelanceUserResponseDto })
  user: FreelanceUserResponseDto;

  @ApiProperty({ type: [SkillResponseDto] })
  skills: SkillResponseDto[];
}

export class CompanyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  siren: string;
}

export class JobPostingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  averageDailyRate: number;

  @ApiProperty()
  seniority: number;

  @ApiProperty({ type: CompanyResponseDto })
  company: CompanyResponseDto;
}

export class CandidateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  freelanceId: string;

  @ApiProperty()
  jobPostingId: string;

  @ApiProperty({ enum: CandidateStatus })
  status: CandidateStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: FreelanceResponseDto })
  freelance: FreelanceResponseDto;

  @ApiProperty({ type: JobPostingResponseDto })
  jobPosting: JobPostingResponseDto;
}
