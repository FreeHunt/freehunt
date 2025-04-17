import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { SkillsModule } from '../src/skills/skills.module';
import { SkillResponseDto } from '../src/skills/dto/skill-response.dto';
import { SkillsService } from '../src/skills/skills.service';
import { SkillType } from '@prisma/client';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { PrismaServiceMock } from './mocks/prisma.mock';

describe('SkillsController (e2e)', () => {
  let app: INestApplication<App>;

  const skillResponse: SkillResponseDto = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'JavaScript',
    normalizedName: 'javascript',
    aliases: ['JS', 'ECMAScript'],
    type: SkillType.TECHNICAL,
  };

  const skillsService = {
    findAll: jest.fn((): [SkillResponseDto] => [skillResponse]),
    findOne: jest.fn((): SkillResponseDto => skillResponse),
    create: jest.fn((): SkillResponseDto => skillResponse),
    update: jest.fn((): SkillResponseDto => skillResponse),
    remove: jest.fn((): SkillResponseDto => skillResponse),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SkillsModule],
    })
      .overrideProvider(SkillsService)
      .useValue(skillsService)
      .overrideProvider(PrismaService)
      .useValue(PrismaServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/skills (POST)', () => {
    return request(app.getHttpServer())
      .post('/skills')
      .send({
        name: 'JavaScript',
        aliases: ['JS', 'ECMAScript'],
        type: SkillType.TECHNICAL,
      })
      .expect(201)
      .expect(skillResponse);
  });

  it('/skills (GET)', () => {
    return request(app.getHttpServer())
      .get('/skills')
      .expect(200)
      .expect([skillResponse]);
  });

  it('/skills/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/skills/${skillResponse.id}`)
      .expect(200)
      .expect(skillResponse);
  });

  it('/skills/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/skills/${skillResponse.id}`)
      .send({ name: 'TypeScript', aliases: ['TS'] })
      .expect(200)
      .expect(skillResponse);
  });

  it('/skills/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/skills/${skillResponse.id}`)
      .expect(200)
      .expect(skillResponse);
  });
});
