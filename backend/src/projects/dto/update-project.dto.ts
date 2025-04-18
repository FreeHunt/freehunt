import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { IsString, IsNotEmpty, IsDate, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    startDate: Date;
  
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    endDate?: Date | null | undefined;
  
    @IsUUID()
    @IsNotEmpty()
    jobPostingId: string;
  
    @IsUUID()
    @IsOptional()
    freelanceId?: string | null | undefined;
}
