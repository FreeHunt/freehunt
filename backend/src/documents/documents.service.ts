import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDocumentDto): Promise<Document> {
    const { userId, freelanceId, invoiceId, quoteId, messageId } = data;

    return this.prisma.document.create({
      data: {
        name: data.name,
        url: data.url,
        type: data.type,
        userId: userId,
        freelanceId: freelanceId,
        invoiceId: invoiceId,
        quoteId: quoteId,
        messageId: messageId,
      },
    });
  }

  async findAll(): Promise<Document[]> {
    return this.prisma.document.findMany();
  }

  async findOne(id: string): Promise<Document | null> {
    return this.prisma.document.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Document[]> {
    return this.prisma.document.findMany({ where: { userId } });
  }

  async delete(id: string): Promise<Document> {
    return this.prisma.document.delete({ where: { id } });
  }
}
