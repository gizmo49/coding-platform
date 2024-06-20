import { EntityRepository, Repository } from 'typeorm';
import { CodingProblemTestCase } from '../entity/coding-problem-testcase.entity';

@EntityRepository(CodingProblemTestCase)
export class CodingProblemTestCaseRepository extends Repository<CodingProblemTestCase> {}
