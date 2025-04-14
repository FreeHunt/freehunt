import { IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  email: string;

  @IsEnum(Role)
  @ApiProperty({
    description: 'The role of the user',
    enum: Role,
    example: 'FREELANCE',
  })
  role: Role;
}
