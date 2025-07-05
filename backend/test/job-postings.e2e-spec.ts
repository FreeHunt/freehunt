import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { JobPostingsModule } from '../src/job-postings/job-postings.module';
import { JobPostingResponseDto } from '../src/job-postings/dto/job-posting-response.dto';
import { JobPostingsService } from '../src/job-postings/job-postings.service';
import { JobPostingLocation } from '@prisma/client';
import { SearchJobPostingDto } from '../src/job-postings/dto/search-job-posting.dto';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { PrismaServiceMock } from './mocks/prisma.mock';

describe('JobPostingsController (e2e)', () => {
  let app: INestApplication<App>;

  const jobPostingResponse: JobPostingResponseDto = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Frontend Developer',
    description: 'We are looking for a Frontend Developer to join our team.',
    location: JobPostingLocation.REMOTE,
    isPromoted: true,
    averageDailyRate: 600,
    seniority: 3,
    totalAmount: 12000,
    status: 'PUBLISHED',
    company: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Tech Company',
      description: 'A leading tech company',
      address: '123 Tech Street',
      siren: '123456789',
    },
    skills: [
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'React',
        normalizedName: 'react',
        aliases: ['ReactJS'],
        type: 'TECHNICAL',
      },
    ],
  };

  const jobPostingsService = {
    findAll: jest.fn((): [JobPostingResponseDto] => [jobPostingResponse]),
    findOne: jest.fn((): JobPostingResponseDto => jobPostingResponse),
    create: jest.fn((): JobPostingResponseDto => jobPostingResponse),
    update: jest.fn((): JobPostingResponseDto => jobPostingResponse),
    remove: jest.fn((): JobPostingResponseDto => jobPostingResponse),
    search: jest.fn((): [JobPostingResponseDto] => [jobPostingResponse]),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [JobPostingsModule],
    })
      .overrideProvider(JobPostingsService)
      .useValue(jobPostingsService)
      .overrideProvider(PrismaService)
      .useValue(PrismaServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/job-postings (POST)', () => {
    return request(app.getHttpServer())
      .post('/job-postings')
      .send({
        title: 'Frontend Developer',
        description:
          'We are looking for a Frontend Developer to join our team.',
        location: JobPostingLocation.REMOTE,
        isPromoted: true,
        companyId: '550e8400-e29b-41d4-a716-446655440001',
        skillIds: ['550e8400-e29b-41d4-a716-446655440002'],
      })
      .expect(201)
      .expect(jobPostingResponse);
  });

  it('/job-postings (GET)', () => {
    return request(app.getHttpServer())
      .get('/job-postings')
      .expect(200)
      .expect([jobPostingResponse]);
  });

  it('/job-postings/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/job-postings/${jobPostingResponse.id}`)
      .expect(200)
      .expect(jobPostingResponse);
  });

  it('/job-postings/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/job-postings/${jobPostingResponse.id}`)
      .send({ title: 'Senior Frontend Developer' })
      .expect(200)
      .expect(jobPostingResponse);
  });

  it('/job-postings/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/job-postings/${jobPostingResponse.id}`)
      .expect(200)
      .expect(jobPostingResponse);
  });

  it('/job-postings/search (POST)', () => {
    const searchDto: SearchJobPostingDto = {
      title: 'Developer',
      skillNames: ['React'],
      location: JobPostingLocation.REMOTE,
      skip: 0,
      take: 10,
    };

    return request(app.getHttpServer())
      .post('/job-postings/search')
      .send(searchDto)
      .expect(200)
      .expect([jobPostingResponse]);
  });
});
