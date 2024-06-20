import { Injectable } from '@nestjs/common';
import { CreateCodingSolutionAttemptDto } from '../dto/create-coding-solution-attempt.dto';
import { User } from 'src/resources/user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CodingProblemRepository } from 'src/resources/coding-problem/repository/coding-problem.repository';
import { CodingSolutionRepository } from '../repository/coding-solution.repository';
import { CodingCompilerService } from 'src/resources/coding-compiler/service/coding-compiler.service';
import { TestCaseResultRepository } from '../repository/testcase-result.repository';
import { TestCaseResult } from '../entity/testcase-result.entity';
import { CodingSolution } from '../entity/coding-solution.entity';

@Injectable()
export class CodingSolutionService {

    constructor(
        @InjectRepository(CodingProblemRepository)
        private codingProblemRepository: CodingProblemRepository,

        @InjectRepository(CodingSolutionRepository)
        private codingSolutionRepository: CodingSolutionRepository,

        @InjectRepository(TestCaseResultRepository)
        private testCaseResultRepository: TestCaseResultRepository,

        private readonly codingCompilerService: CodingCompilerService

    ){}

    async createCodingSolutionAttempt(createCodingSolutionAttemptDto: CreateCodingSolutionAttemptDto, user: User) {
        const { problemId } = createCodingSolutionAttemptDto
        const problem = await this.codingProblemRepository.findOneOrFail({
            where:{
                codingProblemId: problemId
            },
            relations:['testCases']
        });

        const existingSolution = await this.codingSolutionRepository.findExistingCodingSolution(
            problem,
            user
        );

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

        const testCaseResults: TestCaseResult[] = [];
        let allPassed = true;
    
        for (const testCase of problem.testCases) {
          const executionResult = await this.codingCompilerService.executeCode({
            language: createCodingSolutionAttemptDto.language,
            code: `${createCodingSolutionAttemptDto.code}\nconsole.log(${testCase.input});`,
          });
    
          const testCaseResult = new TestCaseResult();
          testCaseResult.input = testCase.input;
          testCaseResult.expectedOutput = testCase.expectedOutput;
          testCaseResult.actualOutput = executionResult.output.trim();
          testCaseResult.success = testCaseResult.actualOutput === testCaseResult.expectedOutput;
          testCaseResult.codingSolution = codingSolution;
    
          if (!testCaseResult.success) {
            allPassed = false;
          }
    
          testCaseResults.push(testCaseResult);
        }
    
        codingSolution.success = allPassed;
        codingSolution.output = testCaseResults.map(result => result.actualOutput).join('\n');
    
        await this.codingSolutionRepository.save(codingSolution);
        await this.testCaseResultRepository.save(testCaseResults);


    }

   
}
