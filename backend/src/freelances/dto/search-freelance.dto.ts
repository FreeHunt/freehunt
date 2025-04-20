import { IsString, IsArray, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationParams {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Number of items to skip',
    example: 0,
    required: false,
  })
  skip?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: 'Number of items to take',
    example: 10,
    required: false,
  })
  take?: number = 10;
}

export class SearchFreelanceDto extends PaginationParams {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'Generic search query for firstName, lastName, jobTitle, and location',
    example: 'John Paris',
    required: false,
  })
  query?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Job title to search for',
    example: 'Full Stack Developer',
    required: false,
  })
  jobTitle?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Array of skill names to search for',
    example: ['JavaScript', 'React', 'Node.js'],
    required: false,
  })
  skillNames?: string[];

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
