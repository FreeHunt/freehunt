import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class FreelanceResponseDto {
  @ApiProperty({
    description: 'The unique identifier for the freelance',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

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

  @ApiProperty({
    description: 'The user associated with the freelance',
    type: UserResponseDto,
  })
  user?: UserResponseDto;
}
