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
export class JobPostingAccessGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<
      Request & { user: User; params: { id: string } }
    >();
    
    const user = request.user;
    const jobPostingId = request.params.id;

    if (!user || !jobPostingId) {
      throw new ForbiddenException('Accès non autorisé');
    }

    const jobPosting = await this.prismaService.jobPosting.findUnique({
      where: { id: jobPostingId },
      include: {
        company: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!jobPosting) {
      throw new NotFoundException(`Annonce avec l'ID ${jobPostingId} introuvable`);
    }

    const hasAccess = this.checkUserAccess(user, jobPosting);

    if (!hasAccess) {
      throw new ForbiddenException(
        'Vous n\'avez pas l\'autorisation d\'accéder à cette annonce. Seule l\'entreprise propriétaire peut y accéder.',
      );
    }

    return true;
  }

  private checkUserAccess(user: User, jobPosting: any): boolean {
    if (jobPosting.company && jobPosting.company.user.id === user.id) {
      return true;
    }

    return false;
  }
}
