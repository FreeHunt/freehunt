import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [PrismaModule, UsersModule, CompaniesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
