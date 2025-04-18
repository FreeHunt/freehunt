import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString, Length } from 'class-validator';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { SkillResponseDto } from '../../skills/dto/skill-response.dto';

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

  @ApiProperty({
    description: 'The skills required for the job posting',
    type: [SkillResponseDto],
  })
  skills?: SkillResponseDto[];

  @ApiProperty({
    description: 'The user associated with the freelance',
    type: UserResponseDto,
  })
  user?: UserResponseDto;
}
