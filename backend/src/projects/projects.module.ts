import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectController } from './projects.controller';

@Module({
  controllers: [ProjectController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
