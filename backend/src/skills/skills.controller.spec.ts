import { Test } from '@nestjs/testing';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { Skill } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { PrismaServiceMock } from '../../test/mocks/prisma.mock';
import { CreateSkillDto } from './dto/create-skill.dto';

describe('SkillsController', () => {
  let skillsController: SkillsController;
  let skillsService: SkillsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [
        SkillsService,
        {
          provide: PrismaService,
          useValue: PrismaServiceMock,
        },
      ],
    }).compile();

    skillsController = moduleRef.get<SkillsController>(SkillsController);
    skillsService = moduleRef.get<SkillsService>(SkillsService);
  });

  const createSkillDto: CreateSkillDto = {
    name: 'JavaScript',
    aliases: ['JS', 'ECMAScript'],
    type: 'TECHNICAL',
  };

  const skill: Skill = {
    ...createSkillDto,
    id: '3246540a-3ecd-4912-a909-953c881816fc',
    normalizedName: 'javascript',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('create', () => {
    it('should create a skill', async () => {
      jest.spyOn(skillsService, 'create').mockResolvedValue(skill);
      expect(await skillsController.create(createSkillDto)).toEqual(skill);
    });
  });

  describe('findAll', () => {
    it('should return an array of skills', async () => {
      jest.spyOn(skillsService, 'findAll').mockResolvedValue([skill]);
      expect(await skillsController.findAll()).toEqual([skill]);
    });
  });

  describe('findOne', () => {
    it('should return a skill', async () => {
      jest.spyOn(skillsService, 'findOne').mockResolvedValue(skill);
      expect(await skillsController.findOne(skill.id)).toEqual(skill);
    });
  });

  describe('update', () => {
    it('should update a skill', async () => {
      jest.spyOn(skillsService, 'update').mockResolvedValue(skill);
      expect(await skillsController.update(skill.id, createSkillDto)).toEqual(
        skill,
      );
    });
  });

  describe('remove', () => {
    it('should remove a skill', async () => {
      jest.spyOn(skillsService, 'remove').mockResolvedValue(skill);
      expect(await skillsController.remove(skill.id)).toEqual(skill);
    });
  });
});
