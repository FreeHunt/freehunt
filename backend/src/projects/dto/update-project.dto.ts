import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from '@/src/projects/dto/create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
