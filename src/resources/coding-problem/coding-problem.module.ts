import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodingProblemService } from './service/coding-problem.service';
import { CodingProblemController } from './controller/coding-problem.controller';
import { CodingProblemRepository } from './repository/coding-problem.repository';
import { CodingProblemTestCaseRepository } from './repository/coding-problem-testcase.repository';
import { CodingProblemExampleReposioty } from './repository/coding-problem-example.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CodingProblemRepository,
      CodingProblemExampleReposioty,
      CodingProblemTestCaseRepository
    ])
  ],
  controllers: [CodingProblemController],
  providers: [CodingProblemService],
})
export class CodingProblemModule {}
