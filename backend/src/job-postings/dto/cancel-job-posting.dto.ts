import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CancelJobPostingDto {
  @ApiPropertyOptional({
    description: 'Reason for canceling the job posting',
    example: 'Mission requirements have changed',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
