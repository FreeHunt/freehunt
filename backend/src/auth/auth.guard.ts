import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, mergeMap } from 'rxjs';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from '../users/users.service';
import { EnvironmentService } from '../common/environment/environment.service';

@Injectable()
export class AuthentikAuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly environmentService: EnvironmentService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { cookies?: { authentik_session?: string } }>();
    const authentikSessionCookie = request.cookies?.authentik_session;

    if (!authentikSessionCookie) {
      throw new UnauthorizedException('Cookie de session Authentik non trouvé');
    }

    try {
      // Appel à l'API Authentik pour vérifier l'utilisateur
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
                throw new UnauthorizedException('User not found');
              }
              return true;
            }),
            catchError((error) => {
              // Si l'API renvoie une erreur, l'utilisateur n'est pas authentifié
              throw new UnauthorizedException(
                'Utilisateur non authentifié dans Authentik : ' + error,
              );
            }),
          ),
      );

      return response;
    } catch (error) {
      throw new UnauthorizedException(
        "Échec de l'authentification Authentik : " + error,
      );
    }
  }
}
