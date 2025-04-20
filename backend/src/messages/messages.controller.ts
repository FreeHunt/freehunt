import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ChatService } from 'src/common/chat/chat.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly chatService: ChatService,
  ) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.create(createMessageDto);
    this.chatService.server.emit('newMessage', message);
    return message;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const message = this.messagesService.findOne(id);
    this.chatService.server.emit('getMessage', message);
    return message;
  }

  @Get()
  async findAll() {
    const messages = await this.messagesService.findAll();
    this.chatService.server.emit('getMessages', messages);
    return messages;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    const message = await this.messagesService.update(id, updateMessageDto);
    this.chatService.server.emit('updateMessage', message);
    return message;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const message = await this.messagesService.delete(id);
    this.chatService.server.emit('deleteMessage', message);
    return message;
  }
}
