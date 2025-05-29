import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  create(@Body() createQuoteDto: CreateQuoteDto) {
    return this.quoteService.create(createQuoteDto);
  }

  @Get('checkpoint/:checkpointId')
  findByCheckpointId(@Param('checkpointId') checkpointId: string) {
    return this.quoteService.findByCheckpointId(checkpointId);
  }
}
