import { ApiProperty } from '@nestjs/swagger';
import { JobPostingResponseDto } from './job-posting-response.dto';

export class JobPostingSearchResult {
  @ApiProperty({
    description: 'Array of job postings matching the search criteria',
    type: [JobPostingResponseDto],
  })
  data: JobPostingResponseDto[];

  @ApiProperty({
    description: 'Total number of job postings matching the search criteria',
    example: 42,
  })
  total: number;
}
