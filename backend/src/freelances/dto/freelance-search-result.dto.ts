import { ApiProperty } from '@nestjs/swagger';
import { FreelanceResponseDto } from './freelance-response.dto';

export class FreelanceSearchResult {
  @ApiProperty({
    description: 'Array of freelances matching the search criteria',
    type: [FreelanceResponseDto],
  })
  data: FreelanceResponseDto[];

  @ApiProperty({
    description: 'Total number of freelances matching the search criteria',
    example: 42,
  })
  total: number;
}
