import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { ChatService } from '../common/chat/chat.service';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
@Module({
  imports: [HttpModule],
  controllers: [MessagesController, UsersController],
  providers: [MessagesService, ChatService, UsersService],
})
export class MessagesModule {}
