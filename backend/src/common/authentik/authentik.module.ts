import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthentikService } from './authentik.service';
import { EnvironmentService } from '../environment/environment.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [AuthentikService, EnvironmentService],
  exports: [AuthentikService],
})
export class AuthentikModule {}
