import { ApiProperty } from '@nestjs/swagger';
import {
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

  @IsPositive()
  @ApiProperty({
    description: 'The daily rate of the freelance',
    example: 50,
  })
  averageDailyRate: number;

  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({
    description: 'The list of id skills of the freelance',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    type: 'array',
    items: {
      type: 'string',
      format: 'uuid',
    },
    isArray: true,
    nullable: true,
  })
  skills: number[];

  @IsUUID()
  @ApiProperty({
    description:
      'The unique identifier for the user associated with the company',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  // document: string;
}
