import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateFreelanceDto {
  @IsString()
  @ApiProperty({
    description: 'The first name of the freelance',
    example: 'John',
  })
  @Length(2, 25)
  firstName: string;

  @IsString()
  @ApiProperty({
    description: 'The last name of the freelance',
    example: 'Doe',
  })
  @Length(2, 25)
  lastName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The job title of the freelance',
    example: 'Full Stack Developer',
  })
  jobTitle: string;

  @IsPositive()
  @ApiProperty({
    description: 'The daily rate of the freelance',
    example: 50,
  })
  averageDailyRate: number;

  @IsPositive()
  @ApiProperty({
    description: 'The seniority of the freelance in years',
    example: 5,
  })
  seniority: number;

  @IsString()
  @ApiProperty({
    description: 'The location of the freelance',
    example: 'Paris, France',
  })
  location: string;

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

  @IsUUID()
  @ApiProperty({
    description:
      'The unique identifier for the user associated with the freelance',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description:
      'The unique identifier for the document associated with the freelance',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  documentIds: string[];
}
