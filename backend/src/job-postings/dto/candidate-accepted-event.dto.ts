import { CandidateStatus } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class CandidateAcceptedEvent {
  @IsUUID()
  candidateId: string;

  @IsUUID()
  jobPostingId: string;

  @IsUUID()
  freelancerId: string;

  @IsEnum(CandidateStatus)
  status: CandidateStatus;
}
