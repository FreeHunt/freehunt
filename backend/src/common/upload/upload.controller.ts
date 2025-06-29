import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('bucketName') bucketName: string,
  ) {
    return this.uploadService.uploadFile(file, bucketName);
  }

  @Get('')
  async getDocuments(
    @Query('userId') userId: string,
    @Query('type') type?: string,
  ) {
    return this.uploadService.getDocuments(userId, type);
  }

  @Patch('avatar/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.updateAvatar(userId, file);
  }
}