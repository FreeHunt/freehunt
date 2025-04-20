import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { ChatService } from 'src/common/chat/chat.service';
@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService, ChatService],
})
export class ConversationsModule {}
