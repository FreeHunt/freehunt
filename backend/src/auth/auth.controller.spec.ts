import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthentikService } from '../common/authentik/authentik.service';
import { HttpModule, HttpService } from '@nestjs/axios';

describe('AuthController', () => {
  let controller: AuthController;

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

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
