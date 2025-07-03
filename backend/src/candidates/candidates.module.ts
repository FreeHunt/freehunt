import { Module } from '@nestjs/common';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { EnvironmentService } from '../common/environment/environment.service';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [CandidatesController],
  providers: [CandidatesService, EnvironmentService, UsersService],
  imports: [PrismaModule, HttpModule],
})
export class CandidatesModule {}
