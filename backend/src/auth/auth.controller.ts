import { Controller, Post, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { AuthSuccessResponse } from './types/auth-success-response.interface';
import { AuthErrorResponse } from './types/auth-error-response.interface';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthSuccessResponse | AuthErrorResponse> {
    const loginResponse = await this.authService.login(loginDto);
    const rawCookie = loginResponse.cookies[0].split(';')[0]; // Récupère le cookie brut
    const token = decodeURIComponent(rawCookie.split('=')[1]); // Décode le token
    response.cookie('authentik_session', token, {
      httpOnly: true,
    });
    return loginResponse;
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthSuccessResponse | AuthErrorResponse> {
    const registerResponse = await this.authService.register(registerDto);
    const rawCookie = registerResponse.cookies[0].split(';')[0]; // Récupère le cookie brut
    const token = decodeURIComponent(rawCookie.split('=')[1]); // Décode le token
    response.cookie('authentik_session', token, {
      httpOnly: true,
    });
    return registerResponse;
  }
}
