import { Module } from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';
import { CheckpointsController } from './checkpoints.controller';

@Module({
  controllers: [CheckpointsController],
  providers: [CheckpointsService],
})
export class CheckpointsModule {}
