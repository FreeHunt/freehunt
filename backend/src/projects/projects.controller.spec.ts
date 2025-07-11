import { Test } from '@nestjs/testing';
import { ProjectsService } from '@/src/projects/projects.service';
import { PrismaService } from '@/src/common/prisma/prisma.service';
import { JobPostingLocation, Role } from '@prisma/client';
import { PrismaServiceMock } from '@/test/mocks/prisma.mock';
import { CreateProjectDto } from '@/src/projects/dto/create-project.dto';
import { ProjectController } from '@/src/projects/projects.controller';
import { AuthentikAuthGuard } from '../auth/auth.guard';
import { HttpService } from '@nestjs/axios';
import { UsersService } from '../users/users.service';
import { EnvironmentService } from '../common/environment/environment.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConversationsService } from '../conversations/conversations.service';

describe('ProjectController', () => {
  let projectController: ProjectController;
  let projectsService: ProjectsService;

  // Mock du guard pour les tests
  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  // Mocks des services pour les dépendances du guard
  const mockHttpService = {
    get: jest.fn(),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockEnvironmentService = {
    get: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  };

  const mockConversationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    username: 'testuser',
    role: 'USER' as Role,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: PrismaServiceMock,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: EnvironmentService,
          useValue: mockEnvironmentService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
        {
          provide: ConversationsService,
          useValue: mockConversationsService,
        },
      ],
    })
      .overrideGuard(AuthentikAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    projectController = moduleRef.get<ProjectController>(ProjectController);
    projectsService = moduleRef.get<ProjectsService>(ProjectsService);
  });

  const createProjectDto: CreateProjectDto = {
    name: 'Project Title',
    description: 'Project Description',
    startDate: new Date(),
    endDate: null,
    jobPostingId: 'job-posting-id',
    freelanceId: null,
    companyId: 'company-id',
    amount: 1000,
  };

  const simpleProjectMock = {
    id: 'project-id',
    name: 'Project Title',
    description: 'Project Description',
    startDate: new Date(),
    endDate: null,
    jobPostingId: 'job-posting-id',
    freelanceId: null,
    conversationId: null,
    companyId: 'company-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    jobPosting: {
      id: 'job-posting-id',
      description: 'Job description',
      companyId: 'company-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'Frontend Dev',
      location: JobPostingLocation.REMOTE,
      isPromoted: false,
      averageDailyRate: 600,
      seniority: 3,
      totalAmount: 5000,
      status: 'PUBLISHED',
      stripeSessionId: null,
      stripeRefundId: null,
      canceledAt: null,
      cancelReason: null,
    },
    freelance: null,
    company: null,
    conversation: null,
    amount: 1000,
  };

  const updatedProjectWithRelations = {
    ...simpleProjectMock,
    name: 'Updated Project Title',
  };

  describe('create', () => {
    it('should create a project', async () => {
      jest
        .spyOn(projectsService, 'create')
        .mockResolvedValue(simpleProjectMock as any);
      expect(await projectController.create(createProjectDto, mockUser)).toEqual(
        simpleProjectMock,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      jest
        .spyOn(projectsService, 'findAll')
        .mockResolvedValue([simpleProjectMock as any]);
      expect(await projectController.findAll(mockUser)).toEqual([simpleProjectMock]);
      expect(projectsService.findAll).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('findOne', () => {
    it('should return a project', async () => {
      jest
        .spyOn(projectsService, 'findOne')
        .mockResolvedValue(simpleProjectMock as any);
      expect(await projectController.findOne(simpleProjectMock.id, mockUser)).toEqual(
        simpleProjectMock,
      );
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      jest
        .spyOn(projectsService, 'update')
        .mockResolvedValue(updatedProjectWithRelations as any);
      expect(
        await projectController.update(simpleProjectMock.id, {
          name: 'Updated Project Title',
        }, mockUser),
      ).toEqual(updatedProjectWithRelations);
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      jest
        .spyOn(projectsService, 'remove')
        .mockResolvedValue(simpleProjectMock as any);
      expect(await projectController.remove(simpleProjectMock.id, mockUser)).toEqual(
        simpleProjectMock,
      );
    });
  });

  describe('findByCompanyId', () => {
    it('should return projects for a company', async () => {
      jest
        .spyOn(projectsService, 'findByCompanyId')
        .mockResolvedValue([simpleProjectMock] as any);

      expect(
        await projectController.findByCompanyId('company-id', mockUser),
      ).toEqual([simpleProjectMock]);
    });
  });

  describe('findByFreelanceId', () => {
    it('should return projects for a freelance', async () => {
      jest
        .spyOn(projectsService, 'findByFreelanceId')
        .mockResolvedValue([simpleProjectMock] as any);

      expect(
        await projectController.findByFreelanceId('freelance-id', mockUser),
      ).toEqual([simpleProjectMock]);
    });
  });
});
