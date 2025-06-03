import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthentikService } from '../common/authentik/authentik.service';
import { HttpModule } from '@nestjs/axios';
import { LoginDto } from './dto/login.dto';
import { AuthSuccessResponse } from './types/auth-success-response.interface';
import { RegisterDto } from './dto/register.dto';
import { AuthErrorResponse } from './types/auth-error-response.interface';
import { EnvironmentService } from '../common/environment/environment.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AuthService, AuthentikService, EnvironmentService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should login a user', async () => {
    // if success, return a AuthSuccessResponse
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
    jest.spyOn(authService, 'login').mockResolvedValue(authSuccessResponse);
    const result = await authService.login(loginDto);
    expect(result).toEqual(authSuccessResponse);
  });

  it('should register a user', async () => {
    const registerDto: RegisterDto = {
      email: 'test@test.com',
      password: 'test',
      password_repeat: 'test',
      username: 'test',
      role: 'FREELANCE',
    };
    const authSuccessResponse: AuthSuccessResponse = {
      cookies: ['test_cookie'],
      success: true,
      response: {
        component: 'test',
        to: 'test',
      },
    };
    jest.spyOn(authService, 'register').mockResolvedValue(authSuccessResponse);
    const result = await authService.register(registerDto);
    expect(result).toEqual(authSuccessResponse);
  });

  it('should return an error if the user is not found', async () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: 'test',
    };
    const authErrorResponse: AuthErrorResponse = {
      cookies: [],
      success: false,
      response: {
        component: 'test',
        flow_info: {
          title: 'test',
          background: 'test',
          cancel_url: 'test',
          layout: 'test',
        },
        response_errors: {
          non_field_errors: [{ string: 'test', code: 'test' }],
        },
        user_fields: [],
        password_fields: false,
        allow_show_password: false,
        flow_designation: 'test',
        show_source_labels: false,
        captcha_stage: null,
        enroll_url: 'test',
        primary_action: 'test',
        sources: [],
      },
    };
    jest.spyOn(authService, 'login').mockResolvedValue(authErrorResponse);
    const result = await authService.login(loginDto);
    expect(result).toEqual(authErrorResponse);
  });

  it('should return an error if the user is not found', async () => {
    const registerDto: RegisterDto = {
      email: 'test@test.com',
      password: 'test',
      password_repeat: 'test',
      username: 'test',
      role: 'FREELANCE',
    };
    const authErrorResponse: AuthErrorResponse = {
      cookies: [],
      success: false,
      response: {
        component: 'test',
        flow_info: {
          title: 'test',
          background: 'test',
          cancel_url: 'test',
          layout: 'test',
        },
        response_errors: {
          non_field_errors: [{ string: 'test', code: 'test' }],
        },
        user_fields: [],
        password_fields: false,
        allow_show_password: false,
        flow_designation: 'test',
        show_source_labels: false,
        captcha_stage: null,
        enroll_url: 'test',
        primary_action: 'test',
        sources: [],
      },
    };
    jest.spyOn(authService, 'register').mockResolvedValue(authErrorResponse);
    const result = await authService.register(registerDto);
    expect(result).toEqual(authErrorResponse);
  });
});
