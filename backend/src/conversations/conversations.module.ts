import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { ChatService } from '../common/chat/chat.service';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';

@Module({
  imports: [HttpModule],
  controllers: [ConversationsController, UsersController],
  providers: [ConversationsService, ChatService, UsersService],
})
export class ConversationsModule {}
