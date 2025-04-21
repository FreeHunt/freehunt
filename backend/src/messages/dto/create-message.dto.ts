import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello, how are you?',
  })
  content: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'The unique identifier for the document',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  documentId: string;

  @IsUUID()
  @ApiProperty({
    description: 'The unique identifier for the conversation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  conversationId: string;

  @IsUUID()
  @ApiProperty({
    description: 'The unique identifier for the receiver of the message',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  receiverId: string;

  @IsUUID()
  @ApiProperty({
    description: 'The unique identifier for the sender of the message',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  senderId: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'The unique identifier for the project',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  projectId: string;
}
