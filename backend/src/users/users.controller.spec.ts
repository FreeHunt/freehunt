import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { PrismaServiceMock } from '../../test/mocks/prisma.mock';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: PrismaServiceMock,
        },
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  const createUserDto: CreateUserDto = {
    email: 'john.doe@freehunt.fr',
    role: 'FREELANCE',
  };

  const user: User = {
    ...createUserDto,
    id: '3246540a-3ecd-4912-a909-953c881816fc',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('create', () => {
    it('should create a user', async () => {
      jest.spyOn(usersService, 'create').mockResolvedValue(user);
      expect(await usersController.create(createUserDto)).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(usersService, 'findAll').mockResolvedValue([user]);
      expect(await usersController.findAll()).toEqual([user]);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      expect(await usersController.findOne(user.id)).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updatedUser: User = { ...user, role: 'COMPANY' };
      jest.spyOn(usersService, 'update').mockResolvedValue(updatedUser);
      expect(await usersController.update(user.id, updatedUser)).toEqual(
        updatedUser,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(usersService, 'remove').mockResolvedValue(user);
      expect(await usersController.remove(user.id)).toEqual(user);
    });
  });
});
