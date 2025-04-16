import { ApiProperty } from '@nestjs/swagger';
import { SkillType } from '@prisma/client';

export class SkillResponseDto {
  @ApiProperty({
    description: 'The unique identifier for the skill',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the skill',
    example: 'JavaScript',
  })
  name: string;

  @ApiProperty({
    description:
      'The normalized name of the skill (lowercase, no spaces, no special characters)',
    example: 'javascript',
  })
  normalizedName: string;

  @ApiProperty({
    description: 'Aliases for the skill (acronyms, synonyms, variations)',
    example: ['JS', 'ECMAScript'],
  })
  aliases: string[];

  @ApiProperty({
    description: 'The type of the skill',
    enum: SkillType,
    example: SkillType.TECHNICAL,
  })
  type: SkillType;
}
