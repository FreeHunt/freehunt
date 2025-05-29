import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCheckpointDto } from './create-checkpoint.dto';
import { IsString } from 'class-validator';

export class UpdateCheckpointDto extends PartialType(CreateCheckpointDto) {
  @IsString()
  @ApiProperty({
    description: 'The freelance ID of the checkpoint',
    example: '123',
  })
  freelanceId: string;
}
