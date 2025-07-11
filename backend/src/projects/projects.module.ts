import { Module } from '@nestjs/common';
import { ProjectsService } from '@/src/projects/projects.service';
import { ProjectController } from '@/src/projects/projects.controller';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from '../users/users.service';
import { EnvironmentService } from '../common/environment/environment.service';
import { ConversationsService } from '../conversations/conversations.service';

@Module({
  controllers: [ProjectController],
  providers: [
    ProjectsService,
    UsersService,
    EnvironmentService,
    ConversationsService,
  ],
  imports: [HttpModule],
})
export class ProjectsModule {}
