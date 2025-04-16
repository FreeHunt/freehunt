import { Test, TestingModule } from '@nestjs/testing';
import { FreelancesController } from './freelances.controller';
import { FreelancesService } from './freelances.service';
import { Freelance } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { PrismaServiceMock } from '../../test/mocks/prisma.mock';
import { CreateFreelanceDto } from './dto/create-freelance.dto';

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
});
