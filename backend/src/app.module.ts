import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { PrismaService } from './common/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
