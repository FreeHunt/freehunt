import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { ChatService } from 'src/common/chat/chat.service';
@Module({
  controllers: [MessagesController],
  providers: [MessagesService, ChatService],
})
export class MessagesModule {}
