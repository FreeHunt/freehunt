import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<
      Request & { user: User; params: { id: string } }
    >();
    
    const user = request.user;
    const projectId = request.params.id;

    if (!user || !projectId) {
      throw new ForbiddenException('Unauthorized access');
    }

    // Récupérer le projet avec les informations nécessaires
    const project = await this.prismaService.project.findUnique({
      where: { id: projectId },
      include: {
        freelance: {
          include: {
            user: true,
          },
        },
        company: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${projectId} introuvable`);
    }

    // Vérifier si l'utilisateur a accès au projet
    const hasAccess = this.checkUserAccess(user, project);

    if (!hasAccess) {
      throw new ForbiddenException(
        'Vous n\'avez pas l\'autorisation d\'accéder à ce projet. Seuls les membres assignés au projet peuvent y accéder.',
      );
    }

    return true;
  }

  private checkUserAccess(user: User, project: any): boolean {
    if (project.freelance && project.freelance.user.id === user.id) {
      return true;
    }

    if (project.company && project.company.user.id === user.id) {
      return true;
    }

    return false;
  }
}
