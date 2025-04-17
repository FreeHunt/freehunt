import { PartialType } from '@nestjs/swagger';
import { CreateFreelanceDto } from './create-freelance.dto';

export class UpdateFreelanceDto extends PartialType(CreateFreelanceDto) {}
