import { IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAccountConnectionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'The unique identifier for the freelance associated with the account connection',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  freelanceId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'The email of the company associated with the account connection',
    example: 'test@test.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'The name of the company associated with the account connection',
    example: 'Test',
  })
  name: string;
}
