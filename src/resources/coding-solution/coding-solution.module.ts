import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodingSolutionService } from './service/coding-solution.service';
import { CodingSolutionController } from './controller/coding-solution.controller';
import { CodingProblemRepository } from '../coding-problem/repository/coding-problem.repository';
import { CodingCompilerModule } from '../coding-compiler/coding-compiler.module';
import { TestCaseResultRepository } from './repository/testcase-result.repository';
import { CodingSolutionRepository } from './repository/coding-solution.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CodingSolutionRepository,
      CodingProblemRepository,
      TestCaseResultRepository
    ]),
    CodingCompilerModule
  ],
  controllers: [CodingSolutionController],
  providers: [CodingSolutionService],
})
export class CodingSolutionModule {}
