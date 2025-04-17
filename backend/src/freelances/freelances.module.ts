import { Module } from '@nestjs/common';
import { FreelancesService } from './freelances.service';
import { FreelancesController } from './freelances.controller';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FreelancesController],
  providers: [FreelancesService],
})
export class FreelancesModule {}
