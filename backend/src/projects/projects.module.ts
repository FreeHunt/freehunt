import { Module } from '@nestjs/common';
import { ProjectsService } from '@/src/projects/projects.service';
import { ProjectController } from '@/src/projects/projects.controller';

@Module({
  controllers: [ProjectController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
