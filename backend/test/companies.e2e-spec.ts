import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { CompaniesModule } from '../src/companies/companies.module';
import { CompanyResponseDto } from '../src/companies/dto/company-response.dto';
import { CompaniesService } from '../src/companies/companies.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { PrismaServiceMock } from './mocks/prisma.mock';

describe('CompaniesController (e2e)', () => {
  let app: INestApplication<App>;

  const companyResponse: CompanyResponseDto = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Company Name',
    description: 'Company Description',
    address: '123 Company St, City, Country',
    siren: '123456789',
  };

  const companiesService = {
    findAll: jest.fn((): [CompanyResponseDto] => [companyResponse]),
    findOne: jest.fn((): CompanyResponseDto => companyResponse),
    update: jest.fn((): CompanyResponseDto => companyResponse),
    remove: jest.fn((): CompanyResponseDto => companyResponse),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CompaniesModule],
    })
      .overrideProvider(CompaniesService)
      .useValue(companiesService)
      .overrideProvider(PrismaService)
      .useValue(PrismaServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/companies (GET)', () => {
    return request(app.getHttpServer())
      .get('/companies')
      .expect(200)
      .expect([companyResponse]);
  });

  it('/companies/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/companies/${companyResponse.id}`)
      .expect(200)
      .expect(companyResponse);
  });

  it('/companies/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/companies/${companyResponse.id}`)
      .send(companyResponse)
      .expect(200)
      .expect(companyResponse);
  });

  it('/companies/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/companies/${companyResponse.id}`)
      .expect(200)
      .expect(companyResponse);
  });
});
