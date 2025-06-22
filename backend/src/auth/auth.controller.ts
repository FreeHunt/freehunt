import {
  Controller,
  Post,
  Res,
  Body,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { AuthSuccessResponse } from './types/auth-success-response.interface';
import { AuthErrorResponse } from './types/auth-error-response.interface';
import { Role, User } from '@prisma/client';
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
    const rawCookie = loginResponse.cookies.find((cookie) =>
      cookie.startsWith('authentik_session='),
    ); // Search for the authentik_session cookie

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
    if (registerResponse.success === false) {
      return {
        success: false,
        cookies: [],
        response: registerResponse.response,
      } as AuthErrorResponse;
    }
    const loginResponse = await this.authService.login({
      email: registerDto.email,
      password: registerDto.password,
    });
    const rawCookie = loginResponse.cookies.find((cookie) =>
      cookie.startsWith('authentik_session='),
    );
    if (!rawCookie) {
      throw new Error('authentik_session cookie not found'); // Handle missing cookie
    }
    const token = decodeURIComponent(rawCookie.split('=')[1].split(';')[0]); // Decode the cookie value
    response.cookie('authentik_session', token, {
      httpOnly: true,
    }); // on va stocker un cookie avec le token
    if (registerDto.role === Role.FREELANCE) {
      await this.usersService.create({
        email: registerDto.email,
        username: registerDto.username,
        role: Role.FREELANCE,
      });
    } else if (registerDto.role === Role.COMPANY) {
      await this.usersService.create({
        email: registerDto.email,
        username: registerDto.username,
        role: Role.COMPANY,
      });
    }

    return registerResponse;
  }

  @Get('getme')
  async getMe(@Req() request: Request): Promise<User> {
    // get cookies in session
    const cookies = request.headers['cookie'] as string;
    try {
      const userAuthentik = await this.authService.getMe(cookies);
      const user = await this.usersService.getUserByEmail(userAuthentik.email);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error in getMe:', error);
      throw new UnauthorizedException('Unauthorized access');
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): boolean {
    response.clearCookie('authentik_csrf');
    response.clearCookie('authentik_session');
    return true;
  }
}
