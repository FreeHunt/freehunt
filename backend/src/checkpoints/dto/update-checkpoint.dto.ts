import { PartialType } from '@nestjs/swagger';
import { CreateCheckpointDto } from './create-checkpoint.dto';

export class UpdateCheckpointDto extends PartialType(CreateCheckpointDto) {}
