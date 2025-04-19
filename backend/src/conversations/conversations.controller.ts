import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@ApiTags('conversations')
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a conversation',
    description: 'Create a conversation',
  })
  @ApiResponse({
    status: 201,
    description: 'Conversation created successfully',
  })
  createConversation(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.createConversation(createConversationDto);
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
  getConversation(@Param('id') id: string) {
    return this.conversationsService.getConversation(id);
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
  getConversations() {
    return this.conversationsService.getConversations();
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
  deleteConversation(@Param('id') id: string) {
    return this.conversationsService.deleteConversation(id);
  }
}
