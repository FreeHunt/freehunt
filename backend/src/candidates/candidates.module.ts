import { Module } from '@nestjs/common';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  controllers: [CandidatesController],
  providers: [CandidatesService],
  imports: [PrismaModule],
})
export class CandidatesModule {}
