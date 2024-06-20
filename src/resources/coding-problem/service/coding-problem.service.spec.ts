import { Test, TestingModule } from '@nestjs/testing';
import { CodingProblemService } from './coding-problem.service';

describe('CodingProblemService', () => {
  let service: CodingProblemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodingProblemService],
    }).compile();

    service = module.get<CodingProblemService>(CodingProblemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
