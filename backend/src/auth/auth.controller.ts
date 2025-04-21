import { Controller, Post, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { AuthSuccessResponse } from './types/auth-success-response.interface';
import { AuthErrorResponse } from './types/auth-error-response.interface';
import { Role } from '@prisma/client';
import { UsersService } from '../users/users.service';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthSuccessResponse | AuthErrorResponse> {
    const loginResponse = await this.authService.login(loginDto);
    const rawCookie = loginResponse.cookies.find(cookie => cookie.startsWith('authentik_session=')); // Search for the authentik_session cookie
    if (!rawCookie) {
      throw new Error('authentik_session cookie not found'); // Handle missing cookie
    }
    const token = decodeURIComponent(rawCookie.split('=')[1].split(';')[0]); // Decode the cookie value
    response.cookie('authentik_session', token, {
      httpOnly: true,
    }); // on va stocker un cookie avec le token
    return loginResponse;
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthSuccessResponse | AuthErrorResponse> {
    const registerResponse = await this.authService.register(registerDto);
    const rawCookie = registerResponse.cookies[1].split(';')[0]; // Récupère le cookie brut authentik_session
    const token = decodeURIComponent(rawCookie.split('=')[1]); // Décode la valeur du cookie
    response.cookie('authentik_session', token, {
      httpOnly: true,
    }); // on va stocker un cookie avec le token
    await this.usersService.create({
      email: registerDto.email,
      username: registerDto.username,
      role: Role.FREELANCE,
    });
    return registerResponse;
  }
}
