import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CancelJobPostingResponseDto {
  @ApiProperty({
    description: 'Whether the job posting was successfully canceled',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Status message about the cancellation',
    example: 'Job posting has been canceled successfully',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Stripe refund ID if a refund was processed',
    example: 're_1234567890abcdef',
  })
  refundId?: string;

  @ApiPropertyOptional({
    description: 'Amount refunded in euros',
    example: 49.99,
  })
  refundAmount?: number;

  @ApiPropertyOptional({
    description: 'Status of the refund',
    example: 'succeeded',
  })
  refundStatus?: string;
}
