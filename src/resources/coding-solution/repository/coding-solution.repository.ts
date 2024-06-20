import { EntityRepository, Repository } from 'typeorm';
import { CodingSolution } from '../entity/coding-solution.entity';
import { CodingProblem } from 'src/resources/coding-problem/entity/coding-problem.entity';
import { CreateCodingSolutionAttemptDto } from '../dto/create-coding-solution-attempt.dto';
import { User } from 'src/resources/user/entity/user.entity';

@EntityRepository(CodingSolution)
export class CodingSolutionRepository extends Repository<CodingSolution> {

    async createCodingSolution(createCodingSolutionAttemptDto: CreateCodingSolutionAttemptDto, problem: CodingProblem, user: User) {
        const codingSolution = new CodingSolution();
        codingSolution.language = createCodingSolutionAttemptDto.language;
        codingSolution.code = createCodingSolutionAttemptDto.code;
        codingSolution.problem = problem;
        codingSolution.solvedBy = user;
        await this.save(codingSolution);
        return codingSolution;
    }

    async findExistingCodingSolution(problem: CodingProblem, user: User){
        return await this.findOne({
            where: {
                problem,
                solvedBy: user
            },
            relations: ['problem', 'solvedBy']
        })
    }
}
