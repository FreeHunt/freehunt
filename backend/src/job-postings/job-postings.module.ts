import { Module } from '@nestjs/common';
import { JobPostingsController } from './job-postings.controller';
import { JobPostingsService } from './job-postings.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AuthentikAuthGuard } from '../auth/auth.guard';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { EnvironmentService } from '../common/environment/environment.service';
import { AuthController } from '../auth/auth.controller';
import { UsersController } from '../users/users.controller';
import { HttpModule } from '@nestjs/axios';
import { SkillsService } from '../skills/skills.service';
import { FreelancesService } from '../freelances/freelances.service';
import { StripeModule } from '../common/stripe/stripe.module';

@Module({
  imports: [PrismaModule, HttpModule, StripeModule],
  controllers: [JobPostingsController, AuthController, UsersController],
  providers: [
    JobPostingsService,
    AuthentikAuthGuard,
    UsersService,
    AuthService,
    EnvironmentService,
    SkillsService,
    FreelancesService,
  ],
})
export class JobPostingsModule {}
