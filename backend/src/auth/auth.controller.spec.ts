import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthentikService } from '../common/authentik/authentik.service';
import { HttpModule, HttpService } from '@nestjs/axios';

import { LoginDto } from './dto/login.dto';
import { AuthSuccessResponse } from './types/auth-success-response.interface';
import { RegisterDto } from './dto/register.dto';
import { response } from 'express';
describe('AuthController', () => {
  let authController: AuthController;
  const mockHttpService = {
    axiosRef: {
      get: jest.fn(),
      post: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        AuthentikService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should login a user', async () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: 'test',
    };
    const authSuccessResponse: AuthSuccessResponse = {
      cookies: ['test_cookie'],
      success: true,
      response: {
        component: 'test',
        to: 'test',
      },
    };
    jest.spyOn(authController, 'login').mockResolvedValue(authSuccessResponse);
    const result = await authController.login(loginDto, response);
    expect(result).toEqual(authSuccessResponse);
  });

  it('should register a user', async () => {
    const registerDto: RegisterDto = {
      email: 'test@test.com',
      password: 'test',
      password_repeat: 'test',
      username: 'test',
    };
    const authSuccessResponse: AuthSuccessResponse = {
      cookies: ['test_cookie'],
      success: true,
      response: {
        component: 'test',
        to: 'test',
      },
    };
    jest
      .spyOn(authController, 'register')
      .mockResolvedValue(authSuccessResponse);
    const result = await authController.register(registerDto, response);
    expect(result).toEqual(authSuccessResponse);
  });
});
