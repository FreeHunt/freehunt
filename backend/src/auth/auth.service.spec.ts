import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthentikService } from '../common/authentik/authentik.service';
import { HttpModule } from '@nestjs/axios';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AuthService, AuthentikService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
