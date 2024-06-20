import { EntityRepository, Repository } from 'typeorm';
import { CodingProblem } from '../entity/coding-problem.entity';
import { CreateCodingProblemDto } from '../dto/create-coding-problem.dto';
import { User } from 'src/resources/user/entity/user.entity';
import { generateRandomness } from 'src/common/utils/helper';

@EntityRepository(CodingProblem)
export class CodingProblemRepository extends Repository<CodingProblem> {

    public async createCodingProblem(
        createCodingProblemDto: CreateCodingProblemDto,
        user: User
    ): Promise<CodingProblem> {
        const { title, description, constraints, hints, followUp } = createCodingProblemDto;
        const codingProblem = new CodingProblem();
        codingProblem.codingProblemId = generateRandomness(20);
        codingProblem.title = title;
        codingProblem.description = description;
        codingProblem.constraints = constraints;
        codingProblem.followUp = followUp;
        codingProblem.hints = hints;
        codingProblem.createdBy = user;
        await this.save(codingProblem);
        return codingProblem;
    }

}
