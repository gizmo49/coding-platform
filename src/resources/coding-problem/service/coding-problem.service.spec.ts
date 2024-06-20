// coding-problem.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CodingProblemService } from './coding-problem.service';
import { CodingProblemRepository } from '../repository/coding-problem.repository';
import { CodingProblemExampleReposioty } from '../repository/coding-problem-example.repository';
import { CreateCodingProblemDto } from '../dto/create-coding-problem.dto';
import { UpdateCodingProblemDto } from '../dto/update-coding-problem.dto';
import { CodingProblem } from '../entity/coding-problem.entity';
import { User } from 'src/resources/user/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CodingProblemService', () => {
  let service: CodingProblemService;
  let codingProblemRepository: jest.Mocked<CodingProblemRepository>;
  let codingProblemExampleRepository: jest.Mocked<CodingProblemExampleReposioty>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodingProblemService,
        {
          provide: getRepositoryToken(CodingProblemRepository),
          useValue: {
            find: jest.fn(),
            findOneOrFail: jest.fn(),
            createCodingProblem: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CodingProblemExampleReposioty),
          useValue: {
            createCodingProblemExample: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CodingProblemService>(CodingProblemService);
    codingProblemRepository = module.get(getRepositoryToken(CodingProblemRepository));
    codingProblemExampleRepository = module.get(getRepositoryToken(CodingProblemExampleReposioty));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCodingProblems', () => {
    it('should return an array of coding problems', async () => {
      const result = [new CodingProblem()];
      codingProblemRepository.find.mockResolvedValue(result);

      expect(await service.getCodingProblems()).toBe(result);
    });
  });

  describe('findUserCodingProblem', () => {
    it('should return the user\'s coding problem', async () => {
      const codingProblemId = '1';
      const user = { userId: 'user1' } as User;
      const codingProblem = new CodingProblem();
      codingProblemRepository.findOneOrFail.mockResolvedValue(codingProblem);

      expect(await service.findUserCodingProblem(codingProblemId, user)).toBe(codingProblem);
      expect(codingProblemRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { codingProblemId, createdBy: { userId: user.userId } },
        relations: ['createdBy'],
      });
    });
  });

  describe('createCodingProblem', () => {
    it('should create and return a new coding problem', async () => {
      const createDto = { examples: [{ input: '1', output: '2' }] } as CreateCodingProblemDto;
      const user = { userId: 'user1' } as User;
      const codingProblem = new CodingProblem();
      codingProblemRepository.createCodingProblem.mockResolvedValue(codingProblem);

      expect(await service.createCodingProblem(createDto, user)).toBe(codingProblem);
      expect(codingProblemRepository.createCodingProblem).toHaveBeenCalledWith(createDto, user);
      expect(codingProblemExampleRepository.createCodingProblemExample).toHaveBeenCalledTimes(createDto.examples.length);
    });
  });

  describe('updateCodingProblem', () => {
    it('should update and return the updated coding problem', async () => {
      const codingProblemId = '1';
      const updateDto = {
        title: 'New Title',
        description: 'New Description',
        examples: [{ input: '1', output: '2' }],
        constraints: ['None'],
        followUp: ['Follow up'],
        hints: ['Hints'],
      } as UpdateCodingProblemDto;
      const user = { userId: 'user1' } as User;
      const codingProblem = new CodingProblem();
      codingProblemRepository.findOneOrFail.mockResolvedValue(codingProblem);

      expect(await service.updateCodingProblem(codingProblemId, updateDto, user)).toBe(codingProblem);
      expect(codingProblemRepository.save).toHaveBeenCalledWith(codingProblem);
      expect(codingProblemExampleRepository.createCodingProblemExample).toHaveBeenCalledTimes(updateDto.examples.length);
    });
  });

  describe('getCodingProblem', () => {
    it('should return the coding problem for the user', async () => {
      const codingProblemId = '1';
      const user = { userId: 'user1' } as User;
      const codingProblem = new CodingProblem();
      codingProblemRepository.findOneOrFail.mockResolvedValue(codingProblem);

      expect(await service.getCodingProblem(codingProblemId, user)).toBe(codingProblem);
      expect(codingProblemRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { codingProblemId, createdBy: { userId: user.userId } },
        relations: ['createdBy'],
      });
    });
  });
});
