import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthentikService } from '../common/authentik/authentik.service';
import { RegisterDto } from './dto/register.dto';
import { AuthSuccessResponse } from './types/auth-success-response.interface';
import { AuthErrorResponse } from './types/auth-error-response.interface';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly authentikService: AuthentikService) {}

  async login(
    loginDto: LoginDto,
  ): Promise<AuthSuccessResponse | AuthErrorResponse> {
    return await this.authentikService.login(loginDto);
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<AuthSuccessResponse | AuthErrorResponse> {
    return await this.authentikService.register(registerDto);
  }

  async getMe(cookies: string): Promise<User> {
    const user = await this.authentikService.getMe(cookies);
    return user;
  }
}
