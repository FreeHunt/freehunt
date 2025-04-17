import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { UsersModule } from '../src/users/users.module';
import { UserResponseDto } from '../src/users/dto/user-response.dto';
import { UsersService } from '../src/users/users.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;

  const userResponse: UserResponseDto = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'user@example.com',
    role: 'FREELANCE',
  };

  const usersService = {
    findAll: jest.fn((): [UserResponseDto] => [userResponse]),
    findOne: jest.fn((): UserResponseDto => userResponse),
    update: jest.fn((): UserResponseDto => userResponse),
    remove: jest.fn((): UserResponseDto => userResponse),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([userResponse]);
  });

  it('/users/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/users/${userResponse.id}`)
      .expect(200)
      .expect(userResponse);
  });

  it('/users/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/users/${userResponse.id}`)
      .send(userResponse)
      .expect(200)
      .expect(userResponse);
  });

  it('/users/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/users/${userResponse.id}`)
      .expect(200)
      .expect(userResponse);
  });
});
