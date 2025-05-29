import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from '../users/users.service';
import { ChatService } from '../common/chat/chat.service';
import { EnvironmentService } from '../common/environment/environment.service';
describe('MessagesController', () => {
  let controller: MessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        MessagesService,
        PrismaService,
        UsersService,
        ChatService,
        EnvironmentService,
      ],
      imports: [HttpModule],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
