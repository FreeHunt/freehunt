import { Get, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthentikAuthGuard } from '../auth/auth.guard';
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
@ApiTags('documents')
@Controller('documents')
@UseGuards(AuthentikAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@Body() data: CreateDocumentDto) {
    return this.documentsService.create(data);
  }

  @Get('/user/:id')
  findByUserId(@Param('id') id: string) {
    return this.documentsService.findByUserId(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.documentsService.delete(id);
  }
}
