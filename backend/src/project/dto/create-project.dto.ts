import { IsString, IsNotEmpty, IsDate, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectDto {
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
    endDate?: Date;
  
    @IsUUID()
    @IsNotEmpty()
    jobPostingId: string;
  
    @IsUUID()
    @IsOptional()
    freelanceId?: string;
}
