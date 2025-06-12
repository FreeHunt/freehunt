import { CreateCandidateDto } from './create-candidate.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateCandidateDto extends PartialType(CreateCandidateDto) {}
