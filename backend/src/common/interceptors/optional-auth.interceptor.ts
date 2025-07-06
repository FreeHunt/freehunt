import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, Observable } from 'rxjs';
import { catchError, mergeMap, of } from 'rxjs';
import { User } from '@prisma/client';
import { EnvironmentService } from '../environment/environment.service';
import { UsersService } from '../../users/users.service';
import { UserResponseDto } from '../../auth/dto/user-response.dto';

@Injectable()
export class OptionalAuthInterceptor implements NestInterceptor {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly environmentService: EnvironmentService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<
      Request & { cookies?: { authentik_session?: string } } & {
        user?: User;
      }
    >();

    await this.tryAuthenticateUser(request);

    return next.handle();
  }

  private async tryAuthenticateUser(
    request: Request & {
      cookies?: { authentik_session?: string };
      user?: User;
    },
  ): Promise<void> {
    const authentikSessionCookie = request.cookies?.authentik_session as string;

    if (!authentikSessionCookie) {
      request.user = undefined;
      return;
    }

    try {
      const response = await firstValueFrom(
        this.httpService
          .get(
            this.environmentService.get('AUTHENTIK_URL') +
              '/api/v3/core/users/me/',
            {
              headers: {
                Cookie: `authentik_session=${authentikSessionCookie}`,
              },
            },
          )
          .pipe(
            mergeMap(async (res) => {
              const user = res.data as UserResponseDto;
              const userData = await this.usersService.getUserByEmail(
                user.user.email,
              );

              if (!userData || userData.email !== user.user.email) {
                return undefined;
              }

              request.user = userData;

              return userData;
            }),
            catchError((error) => {
              console.warn(
                'Erreur lors de la vérification Authentik:',
                (error as Error).message,
              );
              return of(undefined);
            }),
          ),
      );
      request.user = response;
    } catch (error) {
      console.warn("Erreur lors de l'authentification Authentik:", error);
      request.user = undefined;
    }
  }
}
