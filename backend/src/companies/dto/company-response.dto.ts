import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class CompanyResponseDto {
  @ApiProperty({
    description: 'The unique identifier for the company',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the company',
    example: 'Tech Innovations Inc.',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the company',
    example: 'A leading tech company specializing in innovative solutions.',
  })
  description: string;

  @ApiProperty({
    description: 'The address of the company',
    example: '123 Tech Lane, Silicon Valley, CA',
  })
  address: string;

  @ApiProperty({
    description: 'The unique identifier for the company (SIREN)',
    example: '123456789',
  })
  siren: string;

  @ApiProperty({
    description: 'The user associated with the company',
    type: UserResponseDto,
  })
  user?: UserResponseDto;
}
