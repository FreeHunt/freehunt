import { Test } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { PrismaServiceMock } from '../../test/mocks/prisma.mock';
import { CreateCompanyDto } from './dto/create-company.dto';

describe('CompaniesController', () => {
  let companiesController: CompaniesController;
  let companiesService: CompaniesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        CompaniesService,
        {
          provide: PrismaService,
          useValue: PrismaServiceMock,
        },
      ],
    }).compile();

    companiesController =
      moduleRef.get<CompaniesController>(CompaniesController);
    companiesService = moduleRef.get<CompaniesService>(CompaniesService);
  });

  const createCompanyDto: CreateCompanyDto = {
    name: 'FreeHunt',
    description: 'FreeHunt is a freelance platform',
    address: '242 Rue du Faubourg Saint-Antoine, 75012 Paris',
    siren: '123456789',
    userId: '3246540a-3ecd-4912-a909-953c881816fc',
  };

  const company: Company = {
    ...createCompanyDto,
    id: '3246540a-3ecd-4912-a909-953c881816fc',
  };

  describe('create', () => {
    it('should create a company', async () => {
      jest.spyOn(companiesService, 'create').mockResolvedValue(company);
      expect(await companiesController.create(createCompanyDto)).toEqual(
        company,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of companies', async () => {
      jest.spyOn(companiesService, 'findAll').mockResolvedValue([company]);
      expect(await companiesController.findAll()).toEqual([company]);
    });
  });

  describe('findOne', () => {
    it('should return a company', async () => {
      jest.spyOn(companiesService, 'findOne').mockResolvedValue(company);
      expect(await companiesController.findOne(company.id)).toEqual(company);
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const updatedCompany = { ...company, name: 'Updated Company' };
      jest.spyOn(companiesService, 'update').mockResolvedValue(updatedCompany);
      expect(
        await companiesController.update(company.id, {
          name: 'Updated Company',
        }),
      ).toEqual(updatedCompany);
    });
  });

  describe('remove', () => {
    it('should remove a company', async () => {
      jest.spyOn(companiesService, 'remove').mockResolvedValue(company);
      expect(await companiesController.remove(company.id)).toEqual(company);
    });
  });
});
