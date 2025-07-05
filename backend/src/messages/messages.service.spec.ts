import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

describe('MessagesService', () => {
  let service: MessagesService;

  const mockPrismaService = {
    message: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a message', async () => {
      const createMessageDto: CreateMessageDto = {
        content: 'Test message',
        senderId: 'sender-id',
        receiverId: 'receiver-id',
        conversationId: 'conversation-id',
        documentId: 'document-id',
        projectId: 'project-id',
      };

      const expectedResult = {
        id: 'message-id',
        ...createMessageDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.message.create.mockResolvedValue(expectedResult);

      const result = await service.create(createMessageDto);

      expect(mockPrismaService.message.create).toHaveBeenCalledWith({
        data: createMessageDto,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should find a message by id', async () => {
      const messageId = 'message-id';
      const expectedResult = {
        id: messageId,
        content: 'Test message',
        senderId: 'sender-id',
        receiverId: 'receiver-id',
        conversationId: 'conversation-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.message.findUnique.mockResolvedValue(expectedResult);

      const result = await service.findOne(messageId);

      expect(mockPrismaService.message.findUnique).toHaveBeenCalledWith({
        where: { id: messageId },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all messages', async () => {
      const expectedResult = [
        {
          id: 'message-1',
          content: 'Test message 1',
          senderId: 'sender-id',
          receiverId: 'receiver-id',
          conversationId: 'conversation-id',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 'message-2',
          content: 'Test message 2',
          senderId: 'sender-id',
          receiverId: 'receiver-id',
          conversationId: 'conversation-id',
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
      ];

      mockPrismaService.message.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(mockPrismaService.message.findMany).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a message', async () => {
      const messageId = 'message-id';
      const updateMessageDto: UpdateMessageDto = {
        content: 'Updated message',
        conversationId: 'conversation-id',
        receiverId: 'receiver-id',
        senderId: 'sender-id',
        documentId: 'document-id',
      };

      const expectedResult = {
        id: messageId,
        content: 'Updated message',
        senderId: 'sender-id',
        receiverId: 'receiver-id',
        conversationId: 'conversation-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.message.update.mockResolvedValue(expectedResult);

      const result = await service.update(messageId, updateMessageDto);

      expect(mockPrismaService.message.update).toHaveBeenCalledWith({
        where: { id: messageId },
        data: updateMessageDto,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete a message', async () => {
      const messageId = 'message-id';
      const expectedResult = {
        id: messageId,
        content: 'Test message',
        senderId: 'sender-id',
        receiverId: 'receiver-id',
        conversationId: 'conversation-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.message.delete.mockResolvedValue(expectedResult);

      const result = await service.delete(messageId);

      expect(mockPrismaService.message.delete).toHaveBeenCalledWith({
        where: { id: messageId },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getMessagesByConversationId', () => {
    it('should return messages for a conversation ordered by creation date', async () => {
      const conversationId = 'conversation-id';
      const expectedResult = [
        {
          id: 'message-1',
          content: 'First message',
          senderId: 'sender-id-1',
          receiverId: 'receiver-id-1',
          conversationId,
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
          sender: {
            id: 'sender-id-1',
            username: 'sender1',
            email: 'sender1@example.com',
          },
          receiver: {
            id: 'receiver-id-1',
            username: 'receiver1',
            email: 'receiver1@example.com',
          },
        },
        {
          id: 'message-2',
          content: 'Second message',
          senderId: 'sender-id-2',
          receiverId: 'receiver-id-2',
          conversationId,
          createdAt: new Date('2024-01-01T11:00:00Z'),
          updatedAt: new Date('2024-01-01T11:00:00Z'),
          sender: {
            id: 'sender-id-2',
            username: 'sender2',
            email: 'sender2@example.com',
          },
          receiver: {
            id: 'receiver-id-2',
            username: 'receiver2',
            email: 'receiver2@example.com',
          },
        },
      ];

      mockPrismaService.message.findMany.mockResolvedValue(expectedResult);

      const result = await service.getMessagesByConversationId(conversationId);

      expect(mockPrismaService.message.findMany).toHaveBeenCalledWith({
        where: { conversationId },
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          receiver: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no messages found for conversation', async () => {
      const conversationId = 'non-existent-conversation-id';
      const expectedResult = [];

      mockPrismaService.message.findMany.mockResolvedValue(expectedResult);

      const result = await service.getMessagesByConversationId(conversationId);

      expect(mockPrismaService.message.findMany).toHaveBeenCalledWith({
        where: { conversationId },
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          receiver: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should ensure messages are ordered chronologically (oldest first)', async () => {
      const conversationId = 'conversation-id';
      // Messages dans l'ordre inverse pour tester le tri
      const messagesFromDb = [
        {
          id: 'message-2',
          content: 'Second message',
          createdAt: new Date('2024-01-01T11:00:00Z'),
        },
        {
          id: 'message-1',
          content: 'First message',
          createdAt: new Date('2024-01-01T10:00:00Z'),
        },
        {
          id: 'message-3',
          content: 'Third message',
          createdAt: new Date('2024-01-01T12:00:00Z'),
        },
      ];

      mockPrismaService.message.findMany.mockResolvedValue(messagesFromDb);

      await service.getMessagesByConversationId(conversationId);

      // Vérifier que Prisma est appelé avec l'ordre croissant
      expect(mockPrismaService.message.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            createdAt: 'asc',
          },
        }),
      );
    });
  });
});
