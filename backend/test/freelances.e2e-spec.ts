import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { FreelancesModule } from '../src/freelances/freelances.module';
import { FreelanceResponseDto } from '../src/freelances/dto/freelance-response.dto';
import { FreelancesService } from '../src/freelances/freelances.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { PrismaServiceMock } from './mocks/prisma.mock';
import { SearchFreelanceDto } from '../src/freelances/dto/search-freelance.dto';
import { FreelanceSearchResult } from 'src/freelances/dto/freelance-search-result.dto';

describe('FreelancesController (e2e)', () => {
  let app: INestApplication<App>;

  const freelanceResponse: FreelanceResponseDto = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'Full Stack Developer',
    averageDailyRate: 500,
    seniority: 5,
    location: 'Paris, France',
    user: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'john.doe@example.com',
      role: 'FREELANCE',
    },
    skills: [
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'JavaScript',
        normalizedName: 'javascript',
        aliases: ['JS'],
        type: 'TECHNICAL',
      },
    ],
  };
  const freelanceSearchResult = {
    data: [freelanceResponse],
    total: 1,
  };

  const freelancesService = {
    findAll: jest.fn((): [FreelanceResponseDto] => [freelanceResponse]),
    findOne: jest.fn((): FreelanceResponseDto => freelanceResponse),
    create: jest.fn((): FreelanceResponseDto => freelanceResponse),
    update: jest.fn((): FreelanceResponseDto => freelanceResponse),
    remove: jest.fn((): FreelanceResponseDto => freelanceResponse),
    search: jest.fn((): FreelanceSearchResult => freelanceSearchResult),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FreelancesModule],
    })
      .overrideProvider(FreelancesService)
      .useValue(freelancesService)
      .overrideProvider(PrismaService)
      .useValue(PrismaServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/freelances (POST)', () => {
    return request(app.getHttpServer())
      .post('/freelances')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Full Stack Developer',
        averageDailyRate: 500,
        seniority: 5,
        location: 'Paris, France',
        userId: '550e8400-e29b-41d4-a716-446655440001',
        skillIds: ['550e8400-e29b-41d4-a716-446655440002'],
      })
      .expect(201)
      .expect(freelanceResponse);
  });

  it('/freelances (GET)', () => {
    return request(app.getHttpServer())
      .get('/freelances')
      .expect(200)
      .expect([freelanceResponse]);
  });

  it('/freelances/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/freelances/${freelanceResponse.id}`)
      .expect(200)
      .expect(freelanceResponse);
  });

  it('/freelances/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/freelances/${freelanceResponse.id}`)
      .send({ firstName: 'Jane', jobTitle: 'Senior Developer' })
      .expect(200)
      .expect(freelanceResponse);
  });

  it('/freelances/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/freelances/${freelanceResponse.id}`)
      .expect(200)
      .expect(freelanceResponse);
  });

  it('/freelances/search (POST)', () => {
    const searchDto: SearchFreelanceDto = {
      query: 'John Paris',
      skillNames: ['JavaScript'],
      minDailyRate: 400,
      maxDailyRate: 600,
      minSeniority: 3,
      maxSeniority: 7,
      skip: 0,
      take: 10,
    };

    return request(app.getHttpServer())
      .post('/freelances/search')
      .send(searchDto)
      .expect(200)
      .expect(freelanceSearchResult);
  });

  it('/freelances/search with jobTitle (POST)', () => {
    const searchDto: SearchFreelanceDto = {
      jobTitle: 'Full Stack Developer',
    };

    return request(app.getHttpServer())
      .post('/freelances/search')
      .send(searchDto)
      .expect(200)
      .expect(freelanceSearchResult);
  });

  it('/freelances/search with daily rate range (POST)', () => {
    const searchDto: SearchFreelanceDto = {
      minDailyRate: 400,
      maxDailyRate: 600,
    };

    return request(app.getHttpServer())
      .post('/freelances/search')
      .send(searchDto)
      .expect(200)
      .expect(freelanceSearchResult);
  });

  it('/freelances/search with seniority range (POST)', () => {
    const searchDto: SearchFreelanceDto = {
      minSeniority: 4,
      maxSeniority: 6,
    };

    return request(app.getHttpServer())
      .post('/freelances/search')
      .send(searchDto)
      .expect(200)
      .expect(freelanceSearchResult);
  });

  it('/freelances/search with just query (POST)', () => {
    const searchDto: SearchFreelanceDto = {
      query: 'John',
    };

    return request(app.getHttpServer())
      .post('/freelances/search')
      .send(searchDto)
      .expect(200)
      .expect(freelanceSearchResult);
  });
});
