import { Test, TestingModule } from '@nestjs/testing';
import { CodingProblemController } from './coding-problem.controller';
import { CodingProblemService } from '../service/coding-problem.service';

describe('CodingProblemController', () => {
  let controller: CodingProblemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodingProblemController],
      providers: [CodingProblemService],
    }).compile();

    controller = module.get<CodingProblemController>(CodingProblemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
