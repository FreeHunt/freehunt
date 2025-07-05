import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty()
  projectId?: string | null;

  @IsUUID()
  @ApiProperty()
  receiverId: string;

  @IsUUID()
  @ApiProperty()
  senderId: string;
}
