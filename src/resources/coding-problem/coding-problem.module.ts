import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodingProblemService } from './service/coding-problem.service';
import { CodingProblemController } from './controller/coding-problem.controller';
import { CodingProblemRepository } from './repository/coding-problem.repository';
import { CodingProblemExampleRepository } from './repository/coding-problem-example.repository';
import { CodingProblemTemplateRepository } from './repository/coding-problem-template.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CodingProblemRepository,
      CodingProblemExampleRepository,
      CodingProblemTemplateRepository
    ])
  ],
  controllers: [CodingProblemController],
  providers: [CodingProblemService],
  exports: [CodingProblemService]
})
export class CodingProblemModule {}
