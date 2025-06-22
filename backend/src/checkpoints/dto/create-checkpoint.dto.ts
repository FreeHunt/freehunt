import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CheckpointStatus } from '@prisma/client';

export class CreateCheckpointDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the checkpoint',
    example: 'SEO Optimization Specialist',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'The description of the checkpoint',
    example:
      'We are looking for an SEO Optimization Specialist to improve our website',
  })
  description: string;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: 'The date of the checkpoint',
    example: '2025-01-01',
  })
  date: Date;

  @IsEnum(CheckpointStatus)
  @ApiProperty({
    description: 'The status of the checkpoint',
    example: 'TODO',
  })
  status: CheckpointStatus;

  @IsUUID()
  @ApiProperty({
    description: 'The ID of the job posting',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  jobPostingId: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'The ID of the quote',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  quoteId?: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'The amount of the checkpoint',
    example: 100,
  })
  amount: number;
}
