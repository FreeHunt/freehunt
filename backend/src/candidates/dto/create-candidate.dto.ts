import { CandidateStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCandidateDto {
  @IsNotEmpty()
  @IsUUID()
  jobPostingId: string;

  @IsNotEmpty()
  @IsUUID()
  freelanceId: string;

  @IsNotEmpty()
  @IsEnum(CandidateStatus)
  status: CandidateStatus;
}
