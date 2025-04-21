import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello, how are you?',
  })
  content: string;

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

  @IsUUID()
  @ApiProperty({
    description: 'The unique identifier for the document',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  documentId: string;
}
