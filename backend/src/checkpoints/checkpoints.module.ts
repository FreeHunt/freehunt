import { Module } from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';
import { CheckpointsController } from './checkpoints.controller';
import { StripeService } from '../common/stripe/stripe.service';
import { QuoteService } from '../quote/quote.service';

@Module({
  controllers: [CheckpointsController],
  providers: [CheckpointsService, StripeService, QuoteService],
})
export class CheckpointsModule {}
