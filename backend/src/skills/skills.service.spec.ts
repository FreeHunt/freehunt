import { Test } from '@nestjs/testing';
import { SkillsService } from './skills.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { PrismaServiceMock } from '../../test/mocks/prisma.mock';
import { Skill } from '@prisma/client';
import { UpdateSkillDto } from './dto/update-skill.dto';

describe('SkillsService', () => {
  let skillsService: SkillsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SkillsService,
        {
          provide: PrismaService,
          useValue: PrismaServiceMock,
        },
      ],
    }).compile();

    skillsService = moduleRef.get<SkillsService>(SkillsService);
  });

  describe('update', () => {
    it('should calculate normalizedName when updating a skill', async () => {
      const skillId = '3246540a-3ecd-4912-a909-953c881816fc';

      const updateSkillDto: UpdateSkillDto = {
        name: 'TypeScript',
        aliases: ['TS'],
        type: 'TECHNICAL',
      };

      const updatedSkill: Skill = {
        id: skillId,
        name: 'TypeScript',
        normalizedName: 'typescript',
        aliases: ['TS'],
        type: 'TECHNICAL',
      };

      PrismaServiceMock.skill.update.mockResolvedValue(updatedSkill);

      await skillsService.update(skillId, updateSkillDto);

      expect(PrismaServiceMock.skill.update).toHaveBeenCalledWith({
        where: { id: skillId },
        data: {
          ...updateSkillDto,
          normalizedName: 'typescript', // Check that the normalized name is calculated correctly
        },
      });
    });

    it('should maintain existing normalizedName if name is not updated', async () => {
      const skillId = '3246540a-3ecd-4912-a909-953c881816fc';

      const updateSkillDto: UpdateSkillDto = {
        aliases: ['JS', 'ECMAScript'],
        type: 'TECHNICAL',
      };

      const existingSkill: Skill = {
        id: skillId,
        name: 'JavaScript',
        normalizedName: 'javascript',
        aliases: ['JS'],
        type: 'TECHNICAL',
      };

      const updatedSkill = { ...existingSkill, aliases: ['JS', 'ECMAScript'] };

      PrismaServiceMock.skill.findUnique.mockResolvedValue(existingSkill);
      PrismaServiceMock.skill.update.mockResolvedValue(updatedSkill);

      await skillsService.update(skillId, updateSkillDto);

      // Check that normalizedName is not recalculated if name is not updated
      expect(PrismaServiceMock.skill.update).toHaveBeenCalledWith({
        where: { id: skillId },
        data: {
          ...updateSkillDto,
          // normalizedName should not be included in the update
        },
      });
    });
  });
});
