import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { JobPostingsModule } from './job-posting/job-postings.module';
import { SkillsModule } from './skills/skills.module';
import { AuthModule } from './auth/auth.module';
import { AuthentikModule } from './common/authentik/authentik.module';
@Module({
  imports: [
    PrismaModule,
    UsersModule,
    CompaniesModule,
    JobPostingsModule,
    SkillsModule,
    AuthModule,
    AuthentikModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
