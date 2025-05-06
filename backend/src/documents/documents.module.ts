import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [DocumentsController, UsersController],
  providers: [DocumentsService, UsersService],
})
export class DocumentsModule {}
