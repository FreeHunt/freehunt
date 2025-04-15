import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { JobPostingsModule } from './job-posting/job-postings.module';
import { SkillsModule } from './skills/skills.module';
import { FreelancesModule } from './freelances/freelances.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    CompaniesModule,
    JobPostingsModule,
    SkillsModule,
    FreelancesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
