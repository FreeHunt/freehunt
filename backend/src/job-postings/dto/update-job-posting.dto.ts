import { CreateJobPostingDto } from './create-job-posting.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateJobPostingDto extends PartialType(CreateJobPostingDto) {}
