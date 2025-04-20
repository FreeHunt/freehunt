import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { ChatService } from 'src/common/chat/chat.service';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
@Module({
  imports: [HttpModule],
  controllers: [MessagesController, UsersController],
  providers: [MessagesService, ChatService, UsersService],
})
export class MessagesModule {}
