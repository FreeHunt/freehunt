import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ChatService } from 'src/common/chat/chat.service';
@ApiTags('conversations')
@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly chatService: ChatService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a conversation',
    description: 'Create a conversation',
  })
  @ApiResponse({
    status: 201,
    description: 'Conversation created successfully',
  })
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
  ) {
    const conversation = await this.conversationsService.createConversation(
      createConversationDto,
    );
    this.chatService.server.emit('newConversation', conversation);
    return conversation;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a conversation by its ID',
    description: 'Get a conversation by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation retrieved successfully',
  })
  async getConversation(@Param('id') id: string) {
    const conversation = await this.conversationsService.getConversation(id);
    this.chatService.server.emit('getConversation', conversation);
    return conversation;
  }

  @Get()
  @ApiOperation({
    summary: 'Get all conversations',
    description: 'Get all conversations',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
  })
  async getConversations() {
    const conversations = await this.conversationsService.getConversations();
    this.chatService.server.emit('getConversations', conversations);
    return conversations;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a conversation',
    description: 'Delete a conversation by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the conversation to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Conversation not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  async deleteConversation(@Param('id') id: string) {
    const conversation = await this.conversationsService.deleteConversation(id);
    this.chatService.server.emit('deleteConversation', conversation);
    return conversation;
  }
}
