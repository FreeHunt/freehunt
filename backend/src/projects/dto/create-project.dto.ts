import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the project',
    example: 'Project Cheickla',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the project',
    example: 'This project involves the development of a new feature.',
  })
  description: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The start date of the project',
    example: '2023-10-01T00:00:00Z',
  })
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({
    description: 'The end date of the project (optional)',
    example: '2023-12-01T00:00:00Z',
    required: false,
  })
  endDate?: Date | null | undefined;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The unique identifier for the job posting associated with the project',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  jobPostingId: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description:
      'The unique identifier for the freelance associated with the project (optional)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  freelanceId?: string | null | undefined;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The unique identifier for the company associated with the project',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  companyId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The amount of the project',
    example: 1000,
  })
  amount: number;
}
