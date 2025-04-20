import { ApiProperty } from '@nestjs/swagger';
import { JobPostingResponseDto } from '../../job-postings/dto/job-posting-response.dto';
import { FreelanceResponseDto } from '../../freelances/dto/freelance-response.dto';

export class ProjectResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the project',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the project',
    example: 'Project Cheickla',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the project',
    example: 'This project involves the development of a new feature.',
  })
  description: string;

  @ApiProperty({
    description: 'The start date of the project',
    example: '2023-10-01T00:00:00Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'The end date of the project (optional)',
    example: '2023-12-01T00:00:00Z',
    required: false,
  })
  endDate?: Date | null;

  @ApiProperty({
    description: 'The job posting associated with the project',
    type: JobPostingResponseDto,
  })
  jobPosting: JobPostingResponseDto;

  @ApiProperty({
    description: 'The freelance assigned to the project (optional)',
    type: FreelanceResponseDto,
    required: false,
  })
  freelance?: FreelanceResponseDto | null;
}

