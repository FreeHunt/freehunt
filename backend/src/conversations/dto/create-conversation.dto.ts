import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty()
  projectId: string;

  @IsUUID()
  @ApiProperty()
  receiverId: string;

  @IsUUID()
  @ApiProperty()
  senderId: string;
}
