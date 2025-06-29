import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from '@prisma/client';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(data: CreateConversationDto): Promise<Conversation> {
    return this.prisma.conversation.create({
      data: {
        receiverId: data.receiverId,
        senderId: data.senderId,
        project: {
          connect: {
            id: data.projectId,
          },
        },
      },
    });
  }

  async getConversation(id: string): Promise<Conversation | null> {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: true,
        project: true,
      },
    });
  }

  async getConversations(): Promise<Conversation[]> {
    return this.prisma.conversation.findMany({
      include: {
        messages: true,
        project: true,
      },
    });
  }

  async getConversationsByUser(id: string): Promise<Conversation[]> {
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ receiverId: id }, { senderId: id }],
      },
      include: {
        messages: true,
        project: true,
      },
    });
  }

  async getConversationByProject(id: string): Promise<Conversation | null> {
    return this.prisma.conversation.findFirst({
      where: { project: { id } },
      include: { messages: true },
    });
  }

  async deleteConversation(id: string): Promise<Conversation> {
    return this.prisma.conversation.delete({
      where: { id },
    });
  }
}
