import { ApiProperty } from '@nestjs/swagger';
import { ConversationResponseDto } from 'src/conversations/dto/conversation-response.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class MessageResponseDto {
  @ApiProperty({
    description: 'The unique identifier for the message',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello, how are you?',
  })
  content: string;

  @ApiProperty({
    description: 'The unique identifier for the document',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  documentId: string;

  @ApiProperty({
    description: 'The timestamp of the message',
    example: '2021-01-01T00:00:00Z',
  })
  timestamp: Date;

  @ApiProperty({
    description: 'The sender of the message',
    type: UserResponseDto,
  })
  sender: UserResponseDto;

  @ApiProperty({
    description: 'The receiver of the message',
    type: UserResponseDto,
  })
  receiver: UserResponseDto;

  @ApiProperty({
    description: 'The conversation associated with the message',
    type: ConversationResponseDto,
  })
  conversation: ConversationResponseDto;
}
