import { Test, TestingModule } from '@nestjs/testing';
import { FreelancesService } from './freelances.service';

describe('FreelancesService', () => {
  let service: FreelancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreelancesService],
    }).compile();

    service = module.get<FreelancesService>(FreelancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
