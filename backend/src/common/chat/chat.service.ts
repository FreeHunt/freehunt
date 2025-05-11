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

  private connectedUsers = new Map();

  handleConnection(client: Socket): void {
    console.log('client connected', client.id);
    client.broadcast.emit('userConnected', {
      message: `user connected ${client.id}`,
    });
  }

  handleDisconnect(client: Socket): void {
    console.log('client disconnected', client.id);
    // Remove user from connectedUsers
    this.connectedUsers.forEach((socketId, userId) => {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
      }
    });
    client.broadcast.emit('userDisconnected', {
      message: `user disconnected ${client.id}`,
    });
  }

  @SubscribeMessage('identifyUser')
  handleIdentifyUser(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Store user's socket id for direct messaging
    this.connectedUsers.set(data.userId, client.id);
    console.log(`User ${data.userId} identified with socket ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(data.roomId);
    console.log(`Client ${client.id} joined room ${data.roomId}`);
    client.emit('joinedRoom', { roomId: data.roomId });
    client.to(data.roomId).emit('userJoinedRoom', {
      message: `Un nouvel utilisateur a rejoint la conversation`,
      roomId: data.roomId,
    });
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.leave(data.roomId);
    console.log(`Client ${client.id} left room ${data.roomId}`);
    client.emit('leftRoom', { roomId: data.roomId });
    client.to(data.roomId).emit('userLeftRoom', {
      message: `Un utilisateur a quitté la conversation`,
      roomId: data.roomId,
    });
  }

  @SubscribeMessage('newConversation')
  handleNewConversation(@MessageBody() data: { conversation: Conversation }) {
    // Emit to all clients
    this.server.emit('newConversation', data.conversation);

    // Also create a room for this conversation
    const roomId = data.conversation.id;
    console.log(`Room created for conversation ${roomId}`);
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(@MessageBody() data: { message: Message }) {
    const conversationId = data.message.conversationId;

    // Emit to the specific conversation room
    this.server.to(conversationId).emit('newMessage', data.message);

    // Also emit to specific users if they're not in the room
    const senderId = data.message.senderId;
    const receiverId = data.message.receiverId;

    // Find sockets for these users if they're connected but not in the room
    const senderSocket = this.connectedUsers.get(senderId);
    const receiverSocket = this.connectedUsers.get(receiverId);

    if (senderSocket) {
      this.server.to(senderSocket).emit('newMessage', data.message);
    }

    if (receiverSocket) {
      this.server.to(receiverSocket).emit('newMessage', data.message);
    }

    console.log(`Message broadcast to conversation ${conversationId}`);
  }

  @SubscribeMessage('deleteMessage')
  handleDeleteMessage(@MessageBody() data: { message: Message }) {
    const conversationId = data.message.conversationId;
    this.server.to(conversationId).emit('deleteMessage', data.message);
  }

  @SubscribeMessage('updateMessage')
  handleUpdateMessage(@MessageBody() data: { message: Message }) {
    const conversationId = data.message.conversationId;
    this.server.to(conversationId).emit('updateMessage', data.message);
  }

  @SubscribeMessage('getMessages')
  handleGetMessages(
    @MessageBody() data: { messages: Message[]; conversationId: string },
  ) {
    // This is now a request from a client to broadcast messages to a specific room
    this.server.to(data.conversationId).emit('getMessages', data.messages);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody()
    data: { conversationId: string; userId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast typing status to the conversation room
    client.to(data.conversationId).emit('userTyping', {
      userId: data.userId,
      isTyping: data.isTyping,
    });
  }
}
