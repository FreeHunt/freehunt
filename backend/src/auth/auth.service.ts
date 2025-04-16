import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthentikService } from 'src/common/authentik/authentik.service';
import { RegisterDto } from './dto/register.dto';
import { AuthSuccessResponse } from './types/auth-success-response.interface';
import { AuthErrorResponse } from './types/auth-error-response.interface';
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
}
