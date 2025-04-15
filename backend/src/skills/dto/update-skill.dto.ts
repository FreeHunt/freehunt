import { CreateSkillDto } from './create-skill.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}
