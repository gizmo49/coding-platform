import { Injectable } from '@nestjs/common';
import { CreateCodingProblemDto } from '../dto/create-coding-problem.dto';
import { UpdateCodingProblemDto } from '../dto/update-coding-problem.dto';
import { CodingProblem } from '../entity/coding-problem.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CodingProblemRepository } from '../repository/coding-problem.repository';
import { User } from 'src/resources/user/entity/user.entity';
import { CodingProblemExampleReposioty } from '../repository/coding-problem-example.repository';

@Injectable()
export class CodingProblemService {
   
    constructor(
        @InjectRepository(CodingProblemRepository)
        private codingProblemRepository: CodingProblemRepository,

        @InjectRepository(CodingProblemExampleReposioty)
        private codingProblemExampleReposioty: CodingProblemExampleReposioty,
        
      ) {}
   

    async getCodingProblems() {
        // TODO make Provision for pagination
        return await this.codingProblemRepository.find();
    }
    
    async findUserCodingProblem(codingProblemId: string, user: User){
        const codingProblem = await this.codingProblemRepository.findOneOrFail({
            where:{
                codingProblemId, 
                createdBy: {
                    userId: user.userId
                }
            }, 
            relations: ['createdBy']
        });
        return codingProblem;
    }


    async createCodingProblem(createCodingProblemDto: CreateCodingProblemDto, user: User):Promise<CodingProblem> {
        const {examples} = createCodingProblemDto;
        const problem = await this.codingProblemRepository.createCodingProblem(createCodingProblemDto, user);

        if (examples && examples.length) {
            await (examples).map(async (example) => {
                await this.codingProblemExampleReposioty.createCodingProblemExample(example, problem)
            })
        }
        return problem;
    }
   
    async updateCodingProblem(codingProblemId: string, updateCodingProblemDto: UpdateCodingProblemDto, user: User){
            const { title, description, examples, constraints, followUp, hints } = updateCodingProblemDto;
        
            const problem = await this.findUserCodingProblem(codingProblemId, user);

            problem.title = title;
            problem.description = description;
            problem.constraints = constraints;
            problem.followUp = followUp;
            problem.hints = hints;
        
            await this.codingProblemRepository.save(problem);
        
            if (examples && examples.length > 0) {
                const existingExamples = await this.codingProblemExampleReposioty.find({
                    where: {
                        codingProblem: problem
                    }, 
                    relations: ['codingProblem']
                });

                await this.codingProblemExampleReposioty.remove(existingExamples);

                await (examples).map(async (example) => {
                    await this.codingProblemExampleReposioty.createCodingProblemExample(example, problem)
                })
        }
        return problem;
           
    }

    async getCodingProblem(codingProblemId: string, user: User) {
        return await this.codingProblemRepository.findOneOrFail({
            where:{
                codingProblemId, 
                createdBy: {
                    userId: user.userId
                }
            }, 
            relations: ['createdBy']
        });
    }

}
