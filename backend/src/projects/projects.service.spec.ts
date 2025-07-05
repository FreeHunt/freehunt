import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConversationsService } from '../conversations/conversations.service';
import { NotFoundException } from '@nestjs/common';
import { CandidateAcceptedEvent } from '../job-postings/dto/candidate-accepted-event.dto';
import { CandidateStatus } from '@prisma/client';
import { PrismaServiceMock } from '../../test/mocks/prisma.mock';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prismaService: any;
  let conversationsService: any;

  const mockJobPosting = {
    id: 'job-posting-id',
    title: 'Frontend Developer',
    description: 'Développer une application React',
    companyId: 'company-user-id',
    company: {
      user: {
        id: 'company-user-id',
      },
    },
    checkpoints: [
      {
        id: 'checkpoint-1',
        amount: 500,
        date: new Date('2024-02-01'),
      },
      {
        id: 'checkpoint-2',
        amount: 300,
        date: new Date('2024-02-15'),
      },
    ],
  };

  const mockFreelance = {
    id: 'freelance-id',
    user: {
      id: 'freelance-user-id',
    },
  };

  const mockConversation = {
    id: 'conversation-id',
    companyUserId: 'company-user-id',
    freelanceUserId: 'freelance-user-id',
  };

  const mockProject = {
    id: 'project-id',
    name: 'Frontend Developer',
    description: 'Développer une application React',
    conversationId: 'conversation-id',
  };

  beforeEach(async () => {
    const mockPrismaService = {
      jobPosting: {
        findUnique: jest.fn(),
      },
      freelance: {
        findUnique: jest.fn(),
      },
      project: {
        create: jest.fn(),
      },
      message: {
        create: jest.fn(),
      },
    };

    const mockConversationsService = {
      createConversation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: ConversationsService,
          useValue: mockConversationsService,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    prismaService = module.get(PrismaService);
    conversationsService = module.get(ConversationsService);
  });

  describe('handleCandidateAcceptedEvent', () => {
    it('should create project and conversation when candidate is accepted', async () => {
      // Arrange
      const candidateAcceptedEvent: CandidateAcceptedEvent = {
        candidateId: 'candidate-id',
        jobPostingId: 'job-posting-id',
        freelancerId: 'freelance-id',
        status: CandidateStatus.ACCEPTED,
      };

      prismaService.jobPosting.findUnique.mockResolvedValue(
        mockJobPosting as any,
      );
      prismaService.freelance.findUnique.mockResolvedValue(
        mockFreelance as any,
      );
      conversationsService.createConversation.mockResolvedValue(mockConversation as any);
      prismaService.project.create.mockResolvedValue(mockProject as any);
      prismaService.message.create.mockResolvedValue({} as any);

      // Act
      const result = await service.handleCandidateAcceptedEvent(
        candidateAcceptedEvent,
      );

      // Assert
      expect(prismaService.jobPosting.findUnique).toHaveBeenCalledWith({
        where: { id: 'job-posting-id' },
        include: {
          company: {
            include: {
              user: true,
            },
          },
          checkpoints: true,
        },
      });

      expect(prismaService.freelance.findUnique).toHaveBeenCalledWith({
        where: { id: 'freelance-id' },
        include: {
          user: true,
        },
      });

      expect(conversationsService.createConversation).toHaveBeenCalledWith({
        senderId: 'company-user-id',
        receiverId: 'freelance-user-id',
        projectId: undefined,
      });

      expect(prismaService.project.create).toHaveBeenCalledWith({
        data: {
          companyId: 'company-user-id',
          freelanceId: 'freelance-id',
          jobPostingId: 'job-posting-id',
          name: 'Frontend Developer',
          description: 'Développer une application React',
          startDate: expect.any(Date),
          endDate: expect.any(Date),
          amount: 800, // 500 + 300
          conversationId: 'conversation-id',
        },
        include: {
          freelance: true,
          jobPosting: true,
        },
      });

      expect(prismaService.message.create).toHaveBeenCalledWith({
        data: {
          conversationId: 'conversation-id',
          senderId: 'company-user-id',
          receiverId: 'freelance-user-id',
          content: expect.stringContaining('Félicitations'),
        },
      });

      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException when job posting does not exist', async () => {
      // Arrange
      const candidateAcceptedEvent: CandidateAcceptedEvent = {
        candidateId: 'candidate-id',
        jobPostingId: 'non-existent-job-posting',
        freelancerId: 'freelance-id',
        status: CandidateStatus.ACCEPTED,
      };

      prismaService.jobPosting.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.handleCandidateAcceptedEvent(candidateAcceptedEvent),
      ).rejects.toThrow(
        new NotFoundException(
          'Job posting with id non-existent-job-posting does not exist',
        ),
      );
    });

    it('should throw NotFoundException when freelance does not exist', async () => {
      // Arrange
      const candidateAcceptedEvent: CandidateAcceptedEvent = {
        candidateId: 'candidate-id',
        jobPostingId: 'job-posting-id',
        freelancerId: 'non-existent-freelance',
        status: CandidateStatus.ACCEPTED,
      };

      prismaService.jobPosting.findUnique.mockResolvedValue(
        mockJobPosting as any,
      );
      prismaService.freelance.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.handleCandidateAcceptedEvent(candidateAcceptedEvent),
      ).rejects.toThrow(
        new NotFoundException(
          'Freelance with id non-existent-freelance does not exist',
        ),
      );
    });
  });
});
