import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class RegisterDto {
  @IsString()
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;

  @IsString()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password_repeat: string;

  @IsString()
  @ApiProperty({
    description: 'The role of the user',
    example: 'FREELANCE',
  })
  role: string;

  @IsString()
  @ApiProperty({
    description: 'The username of the user',
    example: 'John Doe',
  })
  username: string;
}
