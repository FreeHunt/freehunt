import { Test, TestingModule } from '@nestjs/testing';
import { FreelancesController } from './freelances.controller';
import { FreelancesService } from './freelances.service';

describe('FreelancesController', () => {
  let controller: FreelancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreelancesController],
      providers: [FreelancesService],
    }).compile();

    controller = module.get<FreelancesController>(FreelancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
