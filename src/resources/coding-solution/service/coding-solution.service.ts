import { Injectable } from '@nestjs/common';
import { CreateCodingSolutionAttemptDto } from '../dto/create-coding-solution-attempt.dto';
import { User } from 'src/resources/user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CodingProblemRepository } from 'src/resources/coding-problem/repository/coding-problem.repository';
import { CodingSolutionRepository } from '../repository/coding-solution.repository';
import { TestCaseResultRepository } from '../repository/testcase-result.repository';
import { TestCaseResult as TestCaseResultEntity } from '../entity/testcase-result.entity';
import { CodingSolution } from '../entity/coding-solution.entity';
import { CodingProblemService } from 'src/resources/coding-problem/service/coding-problem.service';
import { TestCaseResult } from 'src/resources/coding-problem/interface';

@Injectable()
export class CodingSolutionService {

    constructor(
        @InjectRepository(CodingProblemRepository)
        private codingProblemRepository: CodingProblemRepository,

        @InjectRepository(CodingSolutionRepository)
        private codingSolutionRepository: CodingSolutionRepository,

        @InjectRepository(TestCaseResultRepository)
        private testCaseResultRepository: TestCaseResultRepository,

        private readonly codingProblemService: CodingProblemService

    ) { }

    async createCodingSolutionAttempt(createCodingSolutionAttemptDto: CreateCodingSolutionAttemptDto, user: User) {
        const { codingProblemId, code, language } = createCodingSolutionAttemptDto
        const problem = await this.codingProblemRepository.findOneOrFail({
            where: {
                codingProblemId
            },
            relations: ['examples', 'templates'],
        });

        const testCases: TestCaseResult[] = await this.codingProblemService.runTests(problem, code, language)

        const existingSolution = await this.codingSolutionRepository.findExistingCodingSolution(
            problem,
            user
        );

        if (existingSolution) {
            existingSolution.code = createCodingSolutionAttemptDto.code;
            existingSolution.language = createCodingSolutionAttemptDto.language;
            await this.codingSolutionRepository.save(existingSolution);
        }

        const codingSolution: CodingSolution = existingSolution ? existingSolution : await this.codingSolutionRepository.createCodingSolution(
            createCodingSolutionAttemptDto,
            problem,
            user
        );

        // find existing test cases results to be prepared for dumping, 
        // based on new solution entry
        const oldTestCaseResults = await this.testCaseResultRepository.find({
            where:{
                codingSolution
            }
        });

        if (oldTestCaseResults && oldTestCaseResults.length){
            await this.testCaseResultRepository.remove(oldTestCaseResults)
        }

        let allPassed = true;
        const testCaseResults = [];
        // here we assume examples are used for test case,
        // although this is limited but a short term solution
        for (const testCase of testCases) {
            const testCaseResult = new TestCaseResultEntity();
            testCaseResult.input = testCase.input;
            testCaseResult.expectedOutput = testCase.expectedOutput;
            testCaseResult.actualOutput = testCase.actualOutput;
            testCaseResult.success = testCase.result === 'pass';
            testCaseResult.codingSolution = codingSolution;
            testCaseResults.push(testCaseResult);

            if (!testCaseResult.success) {
                allPassed = false;
            }

        }

        codingSolution.success = allPassed;
        codingSolution.output = testCases.map(result => result.actualOutput).join('\n');

        await this.codingSolutionRepository.save(codingSolution);
        await this.testCaseResultRepository.save(testCaseResults);

        return testCases

    }


}
