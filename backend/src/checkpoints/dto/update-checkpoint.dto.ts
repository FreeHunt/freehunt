import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCheckpointDto } from './create-checkpoint.dto';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateCheckpointDto extends PartialType(CreateCheckpointDto) {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The freelance ID of the checkpoint',
    example: '123',
  })
  freelanceId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The user ID performing the action',
    example: '456',
  })
  userId?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'The submission date when freelance submits for approval',
    example: '2025-07-06T10:00:00Z',
  })
  submittedAt?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'The validation date when company approves',
    example: '2025-07-06T11:00:00Z',
  })
  validatedAt?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The user ID who submitted the checkpoint',
    example: '456',
  })
  submittedBy?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The user ID who validated the checkpoint',
    example: '789',
  })
  validatedBy?: string;
}
