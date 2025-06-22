import { ApiProperty } from '@nestjs/swagger';
import { CheckpointStatus } from '@prisma/client';

export class CheckpointResponseDto {
  @ApiProperty({
    description: 'The unique identifier for the checkpoint',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the checkpoint',
    example: 'Achieve the MVP of the project',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the checkpoint',
    example:
      'The MVP (Minimum Viable Product) is the first version of the project.',
  })
  description: string;

  @ApiProperty({
    description: 'The date of the checkpoint',
    example: '2025-01-01T00:00:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'The status of the checkpoint',
    enum: CheckpointStatus,
    example: CheckpointStatus.TODO,
  })
  status: CheckpointStatus;

  @ApiProperty({
    description: 'The ID of the job posting associated with the checkpoint',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  jobPostingId: string;

  @ApiProperty({
    description:
      'The ID of the quote associated with the checkpoint (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  quoteId?: string;

  @ApiProperty({
    description: 'The amount of funds to be transferred for the checkpoint',
    example: 1000,
  })
  amount: number;
}
