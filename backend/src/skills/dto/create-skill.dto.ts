import { IsEnum, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SkillType } from '@prisma/client';

export class CreateSkillDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the skill',
    example: 'JavaScript',
  })
  name: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Aliases for the skill',
    example: ['JS', 'ECMAScript'],
  })
  aliases: string[];

  @IsEnum(SkillType)
  @ApiProperty({
    description: 'The type of the skill',
    enum: SkillType,
    example: SkillType.TECHNICAL,
  })
  type: SkillType;
}
