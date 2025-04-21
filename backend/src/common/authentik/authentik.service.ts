import { Injectable } from '@nestjs/common';
import { LoginDto } from '../../auth/dto/login.dto';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { RegisterDto } from '../../auth/dto/register.dto';
import { AuthSuccessResponse } from '../../auth/types/auth-success-response.interface';
import { AuthFlowResponse } from '../../auth/types/auth-flow-response.interface';
import { AuthErrorResponse } from '../../auth/types/auth-error-response.interface';

@Injectable()
export class AuthentikService {
  constructor(private readonly httpService: HttpService) {}

  private readonly authentikUrl = 'http://localhost:9000';
  private readonly loginFlowUrl =
    '/api/v3/flows/executor/default-authentication-flow/';
  private readonly registerFlowUrl =
    '/api/v3/flows/executor/freehunt-enrollment/';

  private readonly axiosConfig: AxiosRequestConfig = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  async login(
    loginDto: LoginDto,
  ): Promise<AuthSuccessResponse | AuthErrorResponse> {
    try {
      const initialResponse = await this.httpService.axiosRef.get(
        `${this.authentikUrl}${this.loginFlowUrl}`,
        this.axiosConfig,
      );

      const cookies = initialResponse.headers['set-cookie'];

      const loginResponse = await this.httpService.axiosRef.post(
        `${this.authentikUrl}${this.loginFlowUrl}`,
        {
          uid_field: loginDto.email,
          password: loginDto.password,
        },
        {
          ...this.axiosConfig,
          headers: {
            ...this.axiosConfig.headers,
            Cookie: cookies?.join(';'),
          },
        },
      );

      const cookiesResponse = loginResponse.headers['set-cookie'];

      return {
        success:
          (loginResponse.data as AuthFlowResponse).component ===
          'xak-flow-redirect',
        cookies: cookiesResponse || [],
        response: loginResponse.data as AuthFlowResponse,
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<AuthSuccessResponse | AuthErrorResponse> {
    try {
      const initialResponse = await this.httpService.axiosRef.get(
        `${this.authentikUrl}${this.registerFlowUrl}`,
        this.axiosConfig,
      );

      const cookies = initialResponse.headers['set-cookie'];
      const registerResponse = await this.httpService.axiosRef.post(
        `${this.authentikUrl}${this.registerFlowUrl}`,
        {
          component: 'ak-stage-prompt',
          email: registerDto.email,
          password: registerDto.password,
          password_repeat: registerDto.password,
          username: registerDto.email,
        },
        {
          ...this.axiosConfig,
          headers: {
            ...this.axiosConfig.headers,
            Cookie: cookies?.join(';'),
          },
        },
      );

      const cookiesResponse = registerResponse.headers['set-cookie'];

      return {
        success:
          (registerResponse.data as AuthFlowResponse).component ===
          'xak-flow-redirect',
        cookies: cookiesResponse || [],
        response: registerResponse.data as AuthFlowResponse,
      };
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    }
  }
}
