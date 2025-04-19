import { Injectable } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
@Injectable()
@WebSocketGateway(3001, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('reply', message);
  }

  handleConnection(client: Socket): void {
    console.log('client connected', client.id);
    client.broadcast.emit('userConnected', {
      message: `user connected ${client.id}`,
    });

    client.to(client.id).emit('reply', 'bonjour Fayssal');
  }

  handleDisconnect(client: Socket): void {
    console.log('client disconnected', client.id);
    client.broadcast.emit('userDisconnected', {
      message: `user disconnected ${client.id}`,
    });
  }

  async handleJoinRoom(client: Socket, room: string): Promise<void> {
    try {
      await client.join(room);
      client.emit('reply', `you joined the room ${room}`);
    } catch (error) {
      client.emit('reply', `error joining the room ${room} : ${error}`);
    }
  }

  async handleLeaveRoom(client: Socket, room: string): Promise<void> {
    try {
      await client.leave(room);
      client.emit('reply', `you left the room ${room}`);
    } catch (error) {
      client.emit('reply', `error leaving the room ${room} : ${error}`);
    }
  }
}
