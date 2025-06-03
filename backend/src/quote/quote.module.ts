import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}
