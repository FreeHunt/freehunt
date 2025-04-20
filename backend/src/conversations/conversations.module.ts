import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { ChatService } from 'src/common/chat/chat.service';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [HttpModule],
  controllers: [ConversationsController, UsersController],
  providers: [ConversationsService, ChatService, UsersService],
})
export class ConversationsModule {}
