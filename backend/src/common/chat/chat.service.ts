import { Injectable } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ConnectedSocket } from '@nestjs/websockets';
import { Conversation, Message } from '@prisma/client';
@Injectable()
@WebSocketGateway(3001, { cors: { origin: '*' } })
export class ChatService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): void {
    console.log('client connected', client.id);
    client.broadcast.emit('userConnected', {
      message: `user connected ${client.id}`,
    });
  }

  handleDisconnect(client: Socket): void {
    console.log('client disconnected', client.id);
    client.broadcast.emit('userDisconnected', {
      message: `user disconnected ${client.id}`,
    });
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(data.roomId);
    client.emit('joinedRoom', { roomId: data.roomId });
    this.server.to(data.roomId).emit('userConnected', {
      message: `Un nouvel utilisateur a rejoint la room ${data.roomId}`,
    });
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.leave(data.roomId);
    client.emit('leftRoom', { roomId: data.roomId });
  }

  @SubscribeMessage('newConversation')
  handleNewConversation(@MessageBody() data: { conversation: Conversation }) {
    this.server.emit('newConversation', data.conversation);
  }

  @SubscribeMessage('getConversation')
  handleGetConversation(@MessageBody() data: { conversation: Conversation }) {
    this.server.emit('getConversation', data.conversation);
  }

  @SubscribeMessage('getConversations')
  handleGetConversations(
    @MessageBody() data: { conversations: Conversation[] },
  ) {
    this.server.emit('getConversations', data.conversations);
  }

  @SubscribeMessage('deleteConversation')
  handleDeleteConversation(
    @MessageBody() data: { conversation: Conversation },
  ) {
    this.server.emit('deleteConversation', data.conversation);
  }

  @SubscribeMessage('updateConversation')
  handleUpdateConversation(
    @MessageBody() data: { conversation: Conversation },
  ) {
    this.server.emit('updateConversation', data.conversation);
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(@MessageBody() data: { message: Message }) {
    this.server.emit('newMessage', data.message);
  }

  @SubscribeMessage('deleteMessage')
  handleDeleteMessage(@MessageBody() data: { message: Message }) {
    this.server.emit('deleteMessage', data.message);
  }

  @SubscribeMessage('updateMessage')
  handleUpdateMessage(@MessageBody() data: { message: Message }) {
    this.server.emit('updateMessage', data.message);
  }

  @SubscribeMessage('getMessages')
  handleGetMessages(@MessageBody() data: { messages: Message[] }) {
    this.server.emit('getMessages', data.messages);
  }
}
