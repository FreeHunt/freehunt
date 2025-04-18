import { Test, TestingModule } from '@nestjs/testing';
import { FreelancesController } from './freelances.controller';
import { FreelancesService } from './freelances.service';
import { Freelance } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { PrismaServiceMock } from '../../test/mocks/prisma.mock';
import { CreateFreelanceDto } from './dto/create-freelance.dto';
import { SearchFreelanceDto } from './dto/search-freelance.dto';

describe('FreelancesController', () => {
  let freelancesController: FreelancesController;
  let freelancesService: FreelancesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FreelancesController],
      providers: [
        FreelancesService,
        {
          provide: PrismaService,
          useValue: PrismaServiceMock,
        },
      ],
    }).compile();

    freelancesController =
      moduleRef.get<FreelancesController>(FreelancesController);
    freelancesService = moduleRef.get<FreelancesService>(FreelancesService);
  });

  const createFreelanceDto: CreateFreelanceDto = {
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'Full Stack Developer',
    averageDailyRate: 500,
    userId: '550e8400-e29b-41d4-a716-446655440000',
    skillIds: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ],
  };

  const freelance: Freelance = {
    ...createFreelanceDto,
    id: '550e8400-e29b-41d4-a716-446655440000',
  };

  describe('create', () => {
    it('should create a freelance', async () => {
      jest.spyOn(freelancesService, 'create').mockResolvedValue(freelance);
      expect(await freelancesController.create(createFreelanceDto)).toEqual(
        freelance,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of freelances', async () => {
      jest.spyOn(freelancesService, 'findAll').mockResolvedValue([freelance]);
      expect(await freelancesController.findAll()).toEqual([freelance]);
    });
  });

  describe('findOne', () => {
    it('should return a freelance', async () => {
      jest.spyOn(freelancesService, 'findOne').mockResolvedValue(freelance);
      expect(await freelancesController.findOne(freelance.id)).toEqual(
        freelance,
      );
    });
  });

  describe('update', () => {
    it('should update a freelance', async () => {
      const updateFreelance = {
        ...freelance,
        firstName: 'Jane',
      };
      jest
        .spyOn(freelancesService, 'update')
        .mockResolvedValue(updateFreelance);
      expect(
        await freelancesController.update(freelance.id, { firstName: 'Jane' }),
      ).toEqual(updateFreelance);
    });
  });

  describe('remove', () => {
    it('should remove a freelance', async () => {
      jest.spyOn(freelancesService, 'remove').mockResolvedValue(freelance);
      expect(await freelancesController.remove(freelance.id)).toEqual(
        freelance,
      );
    });
  });

  describe('search', () => {
    const freelances: Freelance[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Full Stack Developer',
        averageDailyRate: 500,
        userId: '550e8400-e29b-41d4-a716-446655440000',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        firstName: 'Jane',
        lastName: 'Smith',
        jobTitle: 'Frontend Developer',
        averageDailyRate: 450,
        userId: '550e8400-e29b-41d4-a716-446655440001',
      },
    ];

    it('should search freelances by first name', async () => {
      const searchDto: SearchFreelanceDto = {
        firstName: 'John',
      };

      const searchSpy = jest.spyOn(freelancesService, 'search');
      searchSpy.mockResolvedValue([freelances[0]]);

      const result = await freelancesController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual([freelances[0]]);
    });

    it('should search freelances by last name', async () => {
      const searchDto: SearchFreelanceDto = {
        lastName: 'Smith',
      };

      const searchSpy = jest.spyOn(freelancesService, 'search');
      searchSpy.mockResolvedValue([freelances[1]]);

      const result = await freelancesController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual([freelances[1]]);
    });

    it('should search freelances by job title', async () => {
      const searchDto: SearchFreelanceDto = {
        jobTitle: 'Frontend',
      };

      const searchSpy = jest.spyOn(freelancesService, 'search');
      searchSpy.mockResolvedValue([freelances[1]]);

      const result = await freelancesController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual([freelances[1]]);
    });

    it('should search freelances by skill names', async () => {
      const searchDto: SearchFreelanceDto = {
        skillNames: ['React', 'TypeScript'],
      };

      const searchSpy = jest.spyOn(freelancesService, 'search');
      searchSpy.mockResolvedValue([freelances[0]]);

      const result = await freelancesController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual([freelances[0]]);
    });

    it('should search freelances by daily rate range', async () => {
      const searchDto: SearchFreelanceDto = {
        minDailyRate: 450,
        maxDailyRate: 550,
      };

      const searchSpy = jest.spyOn(freelancesService, 'search');
      searchSpy.mockResolvedValue(freelances);

      const result = await freelancesController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(freelances);
    });

    it('should search freelances with pagination parameters', async () => {
      const searchDto: SearchFreelanceDto = {
        skip: 1,
        take: 1,
      };

      const searchSpy = jest.spyOn(freelancesService, 'search');
      searchSpy.mockResolvedValue([freelances[1]]);

      const result = await freelancesController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual([freelances[1]]);
    });

    it('should search freelances with multiple search parameters', async () => {
      const searchDto: SearchFreelanceDto = {
        firstName: 'John',
        jobTitle: 'Developer',
        skillNames: ['JavaScript'],
        minDailyRate: 400,
        skip: 0,
        take: 10,
      };

      const searchSpy = jest.spyOn(freelancesService, 'search');
      searchSpy.mockResolvedValue([freelances[0]]);

      const result = await freelancesController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual([freelances[0]]);
    });

    it('should return all freelances when no search parameters are provided', async () => {
      const searchDto: SearchFreelanceDto = {};

      const searchSpy = jest.spyOn(freelancesService, 'search');
      searchSpy.mockResolvedValue(freelances);

      const result = await freelancesController.search(searchDto);

      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(freelances);
    });
  });
});
