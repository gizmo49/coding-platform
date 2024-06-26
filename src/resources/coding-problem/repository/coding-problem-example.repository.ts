import { EntityRepository, Repository } from 'typeorm';
import { CodingProblem } from '../entity/coding-problem.entity';
import { CodingProblemExampleDto } from '../dto/create-coding-problem.dto';
import { CodingProblemExample } from '../entity/coding-problem-example.entity';

@EntityRepository(CodingProblemExample)
export class CodingProblemExampleRepository extends Repository<CodingProblemExample> {

    public async createCodingProblemExample(
        example: CodingProblemExampleDto,
        codingProblem: CodingProblem
    ): Promise<CodingProblemExample> {
        const codingProblemExample = new CodingProblemExample();
        codingProblemExample.input = example.input;
        codingProblemExample.output = example.output;
        codingProblemExample.explanation = example.explanation;
        codingProblemExample.codingProblem = codingProblem;
        await this.save(codingProblemExample);
        return codingProblemExample;
    }

}
