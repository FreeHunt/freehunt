import { Test } from '@nestjs/testing';
import { ProjectController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { JobPostingLocation } from '@prisma/client';
import { PrismaServiceMock } from '../../test/mocks/prisma.mock';
import { CreateProjectDto } from './dto/create-project.dto';

describe('ProjectController', () => {
  let projectController: ProjectController;
  let projectsService: ProjectsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: PrismaServiceMock,
        },
      ],
    }).compile();

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
  };

  const projectWithRelationsMock = {
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
    },
    freelance: null,
    company: null,
    conversation: null,
  };
  
  const updatedProjectWithRelations = {
    ...projectWithRelationsMock,
    name: 'Updated Project Title',
  };

  describe('create', () => {
    it('should create a project', async () => {
      jest.spyOn(projectsService, 'create').mockResolvedValue(projectWithRelationsMock);
      expect(await projectController.create(createProjectDto)).toEqual(projectWithRelationsMock);
    });
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      jest.spyOn(projectsService, 'findAll').mockResolvedValue([projectWithRelationsMock]);
      expect(await projectController.findAll()).toEqual([projectWithRelationsMock]);
    });
  });

  describe('findOne', () => {
    it('should return a project', async () => {
      jest.spyOn(projectsService, 'findOne').mockResolvedValue(projectWithRelationsMock);
      expect(await projectController.findOne(projectWithRelationsMock.id)).toEqual(projectWithRelationsMock);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      jest.spyOn(projectsService, 'update').mockResolvedValue(updatedProjectWithRelations);
      expect(
        await projectController.update(projectWithRelationsMock.id, {
          name: 'Updated Project Title',
        }),
      ).toEqual(updatedProjectWithRelations);
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      jest.spyOn(projectsService, 'remove').mockResolvedValue(projectWithRelationsMock);
      expect(await projectController.remove(projectWithRelationsMock.id)).toEqual(projectWithRelationsMock);
    });
  });
});
