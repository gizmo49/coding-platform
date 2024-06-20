import { EntityRepository, Repository } from 'typeorm';
import { TestCaseResult } from '../entity/testcase-result.entity';

@EntityRepository(TestCaseResult)
export class TestCaseResultRepository extends Repository<TestCaseResult> {
    
}
