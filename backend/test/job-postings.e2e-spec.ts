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
    cancel: jest.fn(),
    canBeCancelled: jest.fn(),
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

  it('/job-postings/:id/can-be-cancelled (GET)', () => {
    return request(app.getHttpServer())
      .get(`/job-postings/${jobPostingResponse.id}/can-be-cancelled`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('canBeCancelled');
        expect(
          typeof (res.body as { canBeCancelled: boolean }).canBeCancelled,
        ).toBe('boolean');
      });
  });

  describe('/job-postings/:id/cancel (POST)', () => {
    it('should successfully cancel a job posting without refund', () => {
      const cancelRequest = {
        reason: 'Job no longer needed',
      };

      const cancelResponse = {
        success: true,
        refunded: false,
        message: 'Job posting canceled successfully',
      };

      // Mock the service to return success without refund
      jobPostingsService.cancel = jest.fn().mockResolvedValue(cancelResponse);

      return request(app.getHttpServer())
        .post(`/job-postings/${jobPostingResponse.id}/cancel`)
        .send(cancelRequest)
        .expect(200)
        .expect(cancelResponse);
    });

    it('should successfully cancel a job posting with refund', () => {
      const cancelRequest = {
        reason: 'Change in project requirements',
      };

      const cancelResponse = {
        success: true,
        refunded: true,
        refundAmount: 12000,
        refundId: 're_test_123',
        message: 'Job posting canceled and refund processed successfully',
      };

      // Mock the service to return success with refund
      jobPostingsService.cancel = jest.fn().mockResolvedValue(cancelResponse);

      return request(app.getHttpServer())
        .post(`/job-postings/${jobPostingResponse.id}/cancel`)
        .send(cancelRequest)
        .expect(200)
        .expect(cancelResponse);
    });

    it('should fail to cancel when job posting has existing project', () => {
      const cancelRequest = {
        reason: 'No longer needed',
      };

      // Mock the service to throw an error for existing project
      jobPostingsService.cancel = jest
        .fn()
        .mockRejectedValue(
          new Error('Cannot cancel job posting: projects already exist'),
        );

      return request(app.getHttpServer())
        .post(`/job-postings/${jobPostingResponse.id}/cancel`)
        .send(cancelRequest)
        .expect(400);
    });

    it('should fail to cancel when job posting has accepted candidates', () => {
      const cancelRequest = {
        reason: 'Change of plans',
      };

      // Mock the service to throw an error for accepted candidates
      jobPostingsService.cancel = jest
        .fn()
        .mockRejectedValue(
          new Error('Cannot cancel job posting: candidates already accepted'),
        );

      return request(app.getHttpServer())
        .post(`/job-postings/${jobPostingResponse.id}/cancel`)
        .send(cancelRequest)
        .expect(400);
    });

    it('should fail to cancel when reason is missing', () => {
      return request(app.getHttpServer())
        .post(`/job-postings/${jobPostingResponse.id}/cancel`)
        .send({})
        .expect(400);
    });

    it('should fail to cancel when user is not authorized', () => {
      const cancelRequest = {
        reason: 'Unauthorized attempt',
      };

      // Mock the service to throw an unauthorized error
      jobPostingsService.cancel = jest
        .fn()
        .mockRejectedValue(
          new Error('Unauthorized to cancel this job posting'),
        );

      return request(app.getHttpServer())
        .post(`/job-postings/${jobPostingResponse.id}/cancel`)
        .send(cancelRequest)
        .expect(403);
    });
  });
});
