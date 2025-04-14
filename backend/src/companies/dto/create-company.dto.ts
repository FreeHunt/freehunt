import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the company',
    example: 'Tech Innovations Inc.',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'The description of the company',
    example: 'A leading tech company specializing in innovative solutions.',
  })
  description: string;

  @IsString()
  @ApiProperty({
    description: 'The address of the company',
    example: '123 Tech Lane, Silicon Valley, CA',
  })
  address: string;

  @IsString()
  @Length(9)
  @ApiProperty({
    description: 'The unique identifier for the company (SIREN)',
    example: '123456789',
  })
  siren: string;

  @IsUUID()
  @ApiProperty({
    description:
      'The unique identifier for the user associated with the company',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;
}
