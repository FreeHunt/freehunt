import { ApiProperty } from '@nestjs/swagger';
import { MessageResponseDto } from 'src/messages/dto/message-response.dto';

export class ConversationResponseDto {
  @ApiProperty({
    description: 'The unique identifier for the conversation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The messages in the conversation',
    type: [MessageResponseDto],
  })
  messages: MessageResponseDto[];

  //@ApiProperty({
  //  description: 'The project associated with the conversation',
  //  type: ProjectResponseDto,
  //})
  //project: ProjectResponseDto;
}
