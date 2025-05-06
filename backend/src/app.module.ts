import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { JobPostingsModule } from './job-postings/job-postings.module';
import { SkillsModule } from './skills/skills.module';
import { FreelancesModule } from './freelances/freelances.module';
import { ChatModule } from './common/chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { AuthentikModule } from './common/authentik/authentik.module';
import { ProjectsModule } from './projects/projects.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/message.module';
import { UploadModule } from './common/upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { DocumentsModule } from './documents/documents.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UsersModule,
    CompaniesModule,
    JobPostingsModule,
    SkillsModule,
    FreelancesModule,
    ConversationsModule,
    AuthModule,
    AuthentikModule,
    ProjectsModule,
    ChatModule,
    MessagesModule,
    UploadModule,
    DocumentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
