import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation, Message, Project, User } from '@prisma/client';

// Type pour une conversation avec toutes ses relations
export type ConversationWithRelations = Conversation & {
  messages: Message[];
  project: Project | null;
  sender: User;
  receiver: User;
};

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(data: CreateConversationDto): Promise<Conversation> {
    const conversationData: {
      receiverId: string;
      senderId: string;
      project?: { connect: { id: string } };
    } = {
      receiverId: data.receiverId,
      senderId: data.senderId,
    };

    // Connecter le projet seulement si projectId est fourni
    if (data.projectId) {
      conversationData.project = {
        connect: {
          id: data.projectId,
        },
      };
    }

    return this.prisma.conversation.create({
      data: conversationData,
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

  // Nouvelle méthode pour trouver ou créer une conversation hors projet
  async findOrCreateConversation(
    senderId: string,
    receiverId: string,
    projectId?: string,
  ): Promise<ConversationWithRelations> {
    // Si c'est pour un projet, chercher la conversation spécifique du projet
    if (projectId) {
      let conversation = await this.prisma.conversation.findFirst({
        where: {
          project: { id: projectId },
          OR: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        },
        include: {
          messages: true,
          project: true,
          sender: true,
          receiver: true,
        },
      });

      if (!conversation) {
        const newConversation = await this.createConversation({
          senderId,
          receiverId,
          projectId,
        });
        
        // Récupérer la conversation complète avec les relations
        conversation = await this.prisma.conversation.findUnique({
          where: { id: newConversation.id },
          include: {
            messages: true,
            project: true,
            sender: true,
            receiver: true,
          },
        });

        if (!conversation) {
          throw new Error('Failed to create conversation');
        }
      }

      return conversation;
    }

    // Pour les conversations hors projet
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        project: null, // Conversation hors projet
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      include: {
        messages: true,
        project: true,
        sender: true,
        receiver: true,
      },
    });

    if (!conversation) {
      const newConversation = await this.createConversation({
        senderId,
        receiverId,
      });
      
      // Récupérer la conversation complète avec les relations
      conversation = await this.prisma.conversation.findUnique({
        where: { id: newConversation.id },
        include: {
          messages: true,
          project: true,
          sender: true,
          receiver: true,
        },
      });

      if (!conversation) {
        throw new Error('Failed to create conversation');
      }
    }

    return conversation;
  }

  // Méthode pour obtenir une conversation entre deux utilisateurs
  async getConversationBetweenUsers(
    senderId: string,
    receiverId: string,
    projectId?: string,
  ): Promise<ConversationWithRelations | null> {
    const whereClause: {
      OR: Array<{ senderId: string; receiverId: string }>;
      project?: { id: string } | null;
    } = {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    };

    if (projectId) {
      whereClause.project = { id: projectId };
    } else {
      whereClause.project = null;
    }

    return this.prisma.conversation.findFirst({
      where: whereClause,
      include: {
        messages: true,
        project: true,
        sender: true,
        receiver: true,
      },
    });
  }
}
