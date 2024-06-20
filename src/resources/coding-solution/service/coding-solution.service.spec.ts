// coding-solution.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CodingSolutionService } from './coding-solution.service';
import { CodingProblemRepository } from 'src/resources/coding-problem/repository/coding-problem.repository';
import { CodingSolutionRepository } from '../repository/coding-solution.repository';
import { TestCaseResultRepository } from '../repository/testcase-result.repository';
import { CodingCompilerService } from 'src/resources/coding-compiler/service/coding-compiler.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCodingSolutionAttemptDto } from '../dto/create-coding-solution-attempt.dto';
import { User } from 'src/resources/user/entity/user.entity';
import { CodingSolution } from '../entity/coding-solution.entity';

describe('CodingSolutionService', () => {
    let service: CodingSolutionService;
    let codingProblemRepository: jest.Mocked<CodingProblemRepository>;
    let codingSolutionRepository: jest.Mocked<CodingSolutionRepository>;
    let testCaseResultRepository: jest.Mocked<TestCaseResultRepository>;
    let codingCompilerService: jest.Mocked<CodingCompilerService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CodingSolutionService,
                {
                    provide: getRepositoryToken(CodingProblemRepository),
                    useValue: {
                        findOneOrFail: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(CodingSolutionRepository),
                    useValue: {
                        findExistingCodingSolution: jest.fn(),
                        createCodingSolution: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(TestCaseResultRepository),
                    useValue: {
                        find: jest.fn(),
                        remove: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: CodingCompilerService,
                    useValue: {
                        executeCode: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CodingSolutionService>(CodingSolutionService);
        codingProblemRepository = module.get(getRepositoryToken(CodingProblemRepository));
        codingSolutionRepository = module.get(getRepositoryToken(CodingSolutionRepository));
        testCaseResultRepository = module.get(getRepositoryToken(TestCaseResultRepository));
        codingCompilerService = module.get(CodingCompilerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createCodingSolutionAttempt', () => {
        it('should create a coding solution attempt', async () => {
            const createDto: CreateCodingSolutionAttemptDto = {
                problemId: '1',
                language: 'javascript',
                code: 'console.log("Hello World")',
            };
            const user: User = { userId: 'user1' } as User;
            const problem = { codingProblemId: '1', testCases: [{ input: '1', expectedOutput: '1' }] };
            const existingSolution = null;
            const newSolution: CodingSolution = new CodingSolution();
            const executionResult = { success: true, output: '1' };

            codingProblemRepository.findOneOrFail.mockResolvedValue(problem as any);
            codingSolutionRepository.findExistingCodingSolution.mockResolvedValue(existingSolution);
            codingSolutionRepository.createCodingSolution.mockResolvedValue(newSolution);
            testCaseResultRepository.find.mockResolvedValue([]);
            codingCompilerService.executeCode.mockResolvedValue(executionResult);

            await service.createCodingSolutionAttempt(createDto, user);

            expect(codingProblemRepository.findOneOrFail).toHaveBeenCalledWith({
                where: { codingProblemId: createDto.problemId },
                relations: ['testCases'],
            });
            expect(codingSolutionRepository.createCodingSolution).toHaveBeenCalledWith(createDto, problem, user);
            expect(testCaseResultRepository.save).toHaveBeenCalled();
            expect(codingSolutionRepository.save).toHaveBeenCalledWith(newSolution);
        });
    });
});
