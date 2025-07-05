import { ApiProperty } from '@nestjs/swagger';
import { JobPostingLocation } from '@prisma/client';
import { CompanyResponseDto } from '../../companies/dto/company-response.dto';
import { SkillResponseDto } from '../../skills/dto/skill-response.dto';
import { CheckpointResponseDto } from '../../checkpoints/dto/checkpoint-response.dto';

export class JobPostingResponseDto {
  @ApiProperty({
    description: 'The unique identifier for the job posting',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the job posting',
    example: 'SEO Optimization Specialist',
  })
  title: string;

  @ApiProperty({
    description: 'The description of the job posting',
    example:
      "We are looking for an SEO Optimization Specialist to improve our website's search engine rankings.",
  })
  description: string;

  @ApiProperty({
    description: 'The location of the job posting',
    enum: JobPostingLocation,
    example: JobPostingLocation.ONSITE,
  })
  location: JobPostingLocation;

  @ApiProperty({
    description: 'Whether the job posting is promoted or not',
    example: false,
  })
  isPromoted: boolean;

  @ApiProperty({
    description: 'The average daily rate for the job posting',
    example: 500,
  })
  averageDailyRate: number;

  @ApiProperty({
    description: 'The seniority level required for the job posting (in years)',
    example: 5,
  })
  seniority: number;

  @ApiProperty({
    description: 'The total amount for the mission (TJM × number of days)',
    example: 12500,
    required: false,
  })
  totalAmount?: number | null;

  @ApiProperty({
    description: 'The status of the job posting',
    enum: [
      'PENDING_PAYMENT',
      'PAID',
      'PUBLISHED',
      'DRAFT',
      'EXPIRED',
      'REJECTED',
    ],
    example: 'PENDING_PAYMENT',
  })
  status: string;

  @ApiProperty({
    description: 'The company associated with the job posting',
    type: CompanyResponseDto,
  })
  company?: CompanyResponseDto;

  @ApiProperty({
    description: 'The skills required for the job posting',
    type: [SkillResponseDto],
  })
  skills?: SkillResponseDto[];

  @ApiProperty({
    description: 'The checkpoints associated with the job posting',
    type: [CheckpointResponseDto],
  })
  checkpoints?: CheckpointResponseDto[];

  @ApiProperty({
    description: 'Whether the job posting is recommended or not',
    example: false,
  })
  recommended?: boolean;
}
