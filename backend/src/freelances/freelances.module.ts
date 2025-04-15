import { Module } from '@nestjs/common';
import { FreelancesService } from './freelances.service';
import { FreelancesController } from './freelances.controller';

@Module({
  controllers: [FreelancesController],
  providers: [FreelancesService],
})
export class FreelancesModule {}
