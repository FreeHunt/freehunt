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
    description: 'First name to search for',
    example: 'John',
    required: false,
  })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Last name to search for',
    example: 'Doe',
    required: false,
  })
  lastName?: string;

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
}
