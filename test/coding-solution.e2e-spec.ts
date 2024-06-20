// test/coding-solution.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/resources/app/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CodingProblemRepository } from '../src/resources/coding-problem/repository/coding-problem.repository';
import { CodingSolutionRepository } from '../src/resources/coding-solution/repository/coding-solution.repository';
import { TestCaseResultRepository } from '../src/resources/coding-solution/repository/testcase-result.repository';
import { CodingCompilerService } from '../src/resources/coding-compiler/service/coding-compiler.service';

describe('CodingSolutionController (e2e)', () => {
    let app: INestApplication;
    let codingProblemRepository: jest.Mocked<CodingProblemRepository>;
    let codingSolutionRepository: jest.Mocked<CodingSolutionRepository>;
    let testCaseResultRepository: jest.Mocked<TestCaseResultRepository>;
    let codingCompilerService: jest.Mocked<CodingCompilerService>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        codingProblemRepository = moduleFixture.get(getRepositoryToken(CodingProblemRepository));
        codingSolutionRepository = moduleFixture.get(getRepositoryToken(CodingSolutionRepository));
        testCaseResultRepository = moduleFixture.get(getRepositoryToken(TestCaseResultRepository));
        codingCompilerService = moduleFixture.get(CodingCompilerService);
    });

    afterAll(async () => {
        await app.close();
    });

    it('/POST coding-solution-attempt', async () => {
        const createDto = {
            problemId: '1',
            language: 'javascript',
            code: 'console.log("Hello World")',
        };
        const problem = {
            codingProblemId: '1',
            testCases: [{ input: '1', expectedOutput: '1' }],
        };
        const newSolution = { id: '1', problemId: '1' };
        const executionResult = { success: true, output: '1' };

        jest.spyOn(codingProblemRepository, 'findOneOrFail').mockResolvedValue(problem as any);
        jest.spyOn(codingSolutionRepository, 'findExistingCodingSolution').mockResolvedValue(null);
        jest.spyOn(codingSolutionRepository, 'createCodingSolution').mockResolvedValue(newSolution as any);
        jest.spyOn(testCaseResultRepository, 'find').mockResolvedValue([]);
        jest.spyOn(codingCompilerService, 'executeCode').mockResolvedValue(executionResult as any);

        const response = await request(app.getHttpServer())
            .post('/coding-solution-attempt')
            .send(createDto)
            .expect(201);

        expect(response.body).toEqual(expect.objectContaining({ success: true }));
    });
});
