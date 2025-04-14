import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { JobPostingsModule } from './job-posting/job-postings.module';

@Module({
  imports: [PrismaModule, UsersModule, CompaniesModule, JobPostingsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
