import { Test, TestingModule } from '@nestjs/testing';
import { CodingSolutionService } from '../service/coding-solution.service';

describe('CodingSolutionService', () => {
  let service: CodingSolutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodingSolutionService],
    }).compile();

    service = module.get<CodingSolutionService>(CodingSolutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
