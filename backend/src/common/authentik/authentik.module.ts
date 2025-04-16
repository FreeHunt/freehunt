import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthentikService } from './authentik.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [AuthentikService],
  exports: [AuthentikService],
})
export class AuthentikModule {}
