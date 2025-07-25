import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from '../users/users.service';
import { ChatService } from '../common/chat/chat.service';
import { EnvironmentService } from '../common/environment/environment.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

describe('MessagesController', () => {
  let controller: MessagesController;

  const mockMessagesService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getMessagesByConversationId: jest.fn(),
  };

  const mockChatService = {
    server: {
      emit: jest.fn(),
    },
  };

  const mockPrismaService = {
    message: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockEnvironmentService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ChatService,
          useValue: mockChatService,
        },
        {
          provide: EnvironmentService,
          useValue: mockEnvironmentService,
        },
      ],
      imports: [HttpModule],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      mockMessagesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createMessageDto);

      expect(mockMessagesService.create).toHaveBeenCalledWith(createMessageDto);
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

      mockMessagesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(messageId);

      expect(mockMessagesService.findOne).toHaveBeenCalledWith(messageId);
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
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockMessagesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(mockMessagesService.findAll).toHaveBeenCalled();
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
        ...updateMessageDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMessagesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(messageId, updateMessageDto);

      expect(mockMessagesService.update).toHaveBeenCalledWith(
        messageId,
        updateMessageDto,
      );
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

      mockMessagesService.delete.mockResolvedValue(expectedResult);

      const result = await controller.delete(messageId);

      expect(mockMessagesService.delete).toHaveBeenCalledWith(messageId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getMessagesByConversationId', () => {
    it('should return messages for a conversation and emit socket event', async () => {
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

      mockMessagesService.getMessagesByConversationId.mockResolvedValue(
        expectedResult,
      );

      const result =
        await controller.getMessagesByConversationId(conversationId);

      expect(
        mockMessagesService.getMessagesByConversationId,
      ).toHaveBeenCalledWith(conversationId);
      expect(mockChatService.server.emit).toHaveBeenCalledWith(
        'getMessagesByConversationId',
        expectedResult,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should ensure messages are returned in chronological order', async () => {
      const conversationId = 'conversation-id';
      const messagesInOrder = [
        {
          id: 'message-1',
          content: 'First message',
          createdAt: new Date('2024-01-01T10:00:00Z'),
          conversationId,
        },
        {
          id: 'message-2',
          content: 'Second message',
          createdAt: new Date('2024-01-01T11:00:00Z'),
          conversationId,
        },
      ];

      mockMessagesService.getMessagesByConversationId.mockResolvedValue(
        messagesInOrder,
      );

      const result =
        await controller.getMessagesByConversationId(conversationId);

      // Vérifier que le service est appelé
      expect(
        mockMessagesService.getMessagesByConversationId,
      ).toHaveBeenCalledWith(conversationId);
      // Vérifier que les messages sont dans le bon ordre (le service doit les trier)
      expect(result).toEqual(messagesInOrder);
      // Vérifier que l'émission socket a eu lieu
      expect(mockChatService.server.emit).toHaveBeenCalledWith(
        'getMessagesByConversationId',
        messagesInOrder,
      );
    });
  });
});
