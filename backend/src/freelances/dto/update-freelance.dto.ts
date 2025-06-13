import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class UpdateFreelanceDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The first name of the freelance',
    example: 'John',
    required: false,
  })
  @Length(2, 25)
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The last name of the freelance',
    example: 'Doe',
    required: false,
  })
  @Length(2, 25)
  lastName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The job title of the freelance',
    example: 'Full Stack Developer',
    required: false,
  })
  jobTitle?: string;

  @IsOptional()
  @IsPositive()
  @ApiProperty({
    description: 'The daily rate of the freelance',
    example: 50,
    required: false,
  })
  averageDailyRate?: number;

  @IsOptional()
  @IsPositive()
  @ApiProperty({
    description: 'The seniority of the freelance in years',
    example: 5,
    required: false,
  })
  seniority?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The location of the freelance',
    example: 'Paris, France',
    required: false,
  })
  location?: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  @ApiProperty({
    description: 'Array of skill IDs to associate with the freelance',
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ],
    required: false,
  })
  skillIds?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The Stripe ID associated with the freelance',
    example: 'cus_J5t2v1a2b3c4d5e6f7g8h9i0',
    required: false,
  })
  IdStripe?: string;
}
