import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Injectable()
export class QuoteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuoteDto: CreateQuoteDto) {
    return this.prisma.quote.create({
      data: {
        amount: createQuoteDto.amount,
        stripeSessionId: createQuoteDto.stripeSessionId,
        devisLink: createQuoteDto.devisLink,
        document: {
          connect: {
            id: createQuoteDto.documentId,
          },
        },
        invoice: {
          connect: {
            id: createQuoteDto.invoiceId,
          },
        },
        checkpoint: {
          connect: {
            id: createQuoteDto.checkpointId,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.quote.findUnique({
      where: { id },
    });
  }

  async findByCheckpointId(checkpointId: string) {
    return this.prisma.quote.findMany({
      where: { checkpointId },
    });
  }
}
