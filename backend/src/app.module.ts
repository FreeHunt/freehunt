import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { JobPostingsModule } from './job-postings/job-postings.module';
import { SkillsModule } from './skills/skills.module';
import { FreelancesModule } from './freelances/freelances.module';

import { AuthModule } from './auth/auth.module';
import { AuthentikModule } from './common/authentik/authentik.module';
import { ProjectModule } from './project/project.module';
@Module({
  imports: [
    PrismaModule,
    UsersModule,
    CompaniesModule,
    JobPostingsModule,
    SkillsModule,
    FreelancesModule,
    AuthModule,
    AuthentikModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
