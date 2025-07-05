import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { EnvironmentService } from '../environment/environment.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [StripeService, EnvironmentService],
  exports: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
