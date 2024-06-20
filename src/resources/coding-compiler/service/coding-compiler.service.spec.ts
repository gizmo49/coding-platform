import { Test, TestingModule } from '@nestjs/testing';
import { CodingCompilerService } from './coding-compiler.service';

describe('CodingCompilerService', () => {
  let service: CodingCompilerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodingCompilerService],
    }).compile();

    service = module.get<CodingCompilerService>(CodingCompilerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
