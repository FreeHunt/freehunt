import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JobPostingLocation } from '@prisma/client';

export class PaginationParams {
  @IsOptional()
  @ApiProperty({
    description: 'Number of items to skip',
    example: 0,
    required: false,
  })
  skip?: number = 0;

  @IsOptional()
  @ApiProperty({
    description: 'Number of items to take',
    example: 10,
    required: false,
  })
  take?: number = 10;
}

export class SearchJobPostingDto extends PaginationParams {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The title of the job posting to search for',
    example: 'Developer',
    required: false,
  })
  title?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Array of skill names to search for',
    example: ['JavaScript', 'React', 'Node.js'],
    required: false,
  })
  skillNames?: string[];

  @IsOptional()
  @IsEnum(JobPostingLocation)
  @ApiProperty({
    description: 'The location of the job posting',
    example: 'REMOTE',
    enum: JobPostingLocation,
    required: false,
  })
  location?: JobPostingLocation;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Minimum daily rate',
    example: 400,
    required: false,
  })
  minDailyRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Maximum daily rate',
    example: 800,
    required: false,
  })
  maxDailyRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Minimum seniority in years',
    example: 2,
    required: false,
  })
  minSeniority?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Maximum seniority in years',
    example: 10,
    required: false,
  })
  maxSeniority?: number;
}
