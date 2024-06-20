import { Test, TestingModule } from '@nestjs/testing';
import { CodingSolutionController } from './coding-solution.controller';
import { CodingSolutionService } from '../service/coding-solution.service';

describe('CodingSolutionController', () => {
  let controller: CodingSolutionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodingSolutionController],
      providers: [CodingSolutionService],
    }).compile();

    controller = module.get<CodingSolutionController>(CodingSolutionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
