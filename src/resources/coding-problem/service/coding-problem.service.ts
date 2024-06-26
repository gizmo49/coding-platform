import axios from 'axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCodingProblemDto } from '../dto/create-coding-problem.dto';
import { UpdateCodingProblemDto } from '../dto/update-coding-problem.dto';
import { CodingProblem } from '../entity/coding-problem.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CodingProblemRepository } from '../repository/coding-problem.repository';
import { User } from 'src/resources/user/entity/user.entity';
import { CodingProblemExampleRepository } from '../repository/coding-problem-example.repository';
import { CodingProblemTemplateRepository } from '../repository/coding-problem-template.repository';
import { RunCodingProblemTestDto } from '../dto/run-coding-problem-test.dto';
import { TestCaseResult } from '../interface';


@Injectable()
export class CodingProblemService {

    constructor(
        @InjectRepository(CodingProblemRepository)
        private codingProblemRepository: CodingProblemRepository,

        @InjectRepository(CodingProblemExampleRepository)
        private codingProblemExampleRepository: CodingProblemExampleRepository,

        @InjectRepository(CodingProblemTemplateRepository)
        private codingProblemTemplateRepository: CodingProblemTemplateRepository,

    ) { }


    async getCodingProblems() {
        // TODO make Provision for pagination
        return await this.codingProblemRepository.find();
    }

    async findUserCodingProblem(codingProblemId: string, user: User) {
        const codingProblem = await this.codingProblemRepository.findOneOrFail({
            where: {
                codingProblemId,
                createdBy: {
                    userId: user.userId
                }
            },
            relations: ['createdBy']
        });
        return codingProblem;
    }


    async createCodingProblem(createCodingProblemDto: CreateCodingProblemDto, user: User): Promise<CodingProblem> {

        const { examples, templates } = createCodingProblemDto;

        const problem = await this.codingProblemRepository.createCodingProblem(createCodingProblemDto, user);

        if (examples && examples.length) {
            try {
                for (const example of examples) {
                    await this.codingProblemExampleRepository.createCodingProblemExample(example, problem);
                }
            } catch (error) {
                console.error('Error creating examples:', error);
                throw error;
            }
        }

        // Create and save templates
        if (templates && templates.length) {
            try {
                const allTemplates = [];
                for (const template of templates) {
                    const createdTemplate = this.codingProblemTemplateRepository.create({
                        ...template,
                        codingProblem: problem,
                    });
                    await this.codingProblemTemplateRepository.save(createdTemplate);
                    allTemplates.push(createdTemplate);
                }
                problem.templates = allTemplates;
            } catch (error) {
                console.error('Error creating templates:', error);
                throw error;
            }
        }
        return problem;
    }

    async updateCodingProblem(codingProblemId: string, updateCodingProblemDto: UpdateCodingProblemDto, user: User) {
        const { title, description, examples, templates, constraints, followUp, hints } = updateCodingProblemDto;

        const problem = await this.findUserCodingProblem(codingProblemId, user);

        problem.title = title;
        problem.description = description;
        problem.constraints = constraints;
        problem.followUp = followUp;
        problem.hints = hints;

        await this.codingProblemRepository.save(problem);

        if (examples && examples.length > 0) {
            const existingExamples = await this.codingProblemExampleRepository.find({
                where: {
                    codingProblem: problem
                },
                relations: ['codingProblem']
            });

            await this.codingProblemExampleRepository.remove(existingExamples);

            await (examples).map(async (example) => {
                await this.codingProblemExampleRepository.createCodingProblemExample(example, problem)
            })
        }

        // Update templates
        if (templates && templates.length > 0) {
            const existingTemplates = await this.codingProblemTemplateRepository.find({
                where: {
                    codingProblem: problem,
                },
                relations: ['codingProblem'],
            });

            await this.codingProblemTemplateRepository.remove(existingTemplates);

            for (const template of templates) {
                const createdTemplate = this.codingProblemTemplateRepository.create({
                    ...template,
                    codingProblem: problem,
                });
                await this.codingProblemTemplateRepository.save(createdTemplate);
            }
        }

        return problem;

    }

    async getCodingProblem(codingProblemId: string, user?: User) {

        // Base query to get coding problem with related entities
        const queryBuilder = await this.codingProblemRepository.createQueryBuilder('codingProblem')
            .leftJoinAndSelect('codingProblem.examples', 'examples')
            .leftJoinAndSelect('codingProblem.createdBy', 'createdBy')
            .leftJoinAndSelect('codingProblem.templates', 'templates')
            .leftJoinAndSelect('codingProblem.solutions', 'solutions')
            .leftJoinAndSelect('solutions.solvedBy', 'solvedBy')
            .leftJoinAndSelect('solutions.testCaseResults', 'testCaseResults')
            .where('codingProblem.codingProblemId = :codingProblemId', { codingProblemId });


        const codingProblemWithDetails = await queryBuilder.getOne();

        // If a user is provided, filter to get a single solution object
        let singleSolution = null;
        if (user && codingProblemWithDetails && codingProblemWithDetails.solutions) {
            singleSolution = codingProblemWithDetails.solutions.find(
                solution => solution.solvedBy && solution.solvedBy.id === user.id
            );
        }

        return {
            ...codingProblemWithDetails,
            solution: singleSolution,
        };

    }

    private getLanguageId(language: string): number {
        const languageMap = {
            javascript: 63,
            python: 71,
            cpp: 53,
            java: 62,
            csharp: 51,
        };

        return languageMap[language.toLowerCase()] || 63; // Default to JavaScript
    }

    private async runTestCase(language: string, code: string, input: string, expectedOutput: string): Promise<TestCaseResult> {
        const data = {
            language_id: this.getLanguageId(language),
            source_code: code,
            stdin: input,
            expected_output: expectedOutput,
        };

        try {
            const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', data, {
                headers: {
                    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                    'content-type': 'application/json',
                },
            });

            const { token } = response.data;
            const result = await this.getSubmissionResult(token);

            return {
                input,
                expectedOutput,
                actualOutput: result.stdout.trim(),
                explanation: result.status.description,
                result: result.stdout.trim() === expectedOutput ? "pass" : "fail",
            };
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Error running the test case',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    private async getSubmissionResult(token: string): Promise<any> {
        try {
            const response = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
                headers: {
                    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                },
            });
            return response.data;
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Error fetching the submission result',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    async runTests(problem: CodingProblem, code: string, language: string): Promise<TestCaseResult[]> {

        const testResults = [];

        for (const example of problem.examples) {
            const result = await this.runTestCase(language, code, example.input, example.output);
            testResults.push(result);
        }

        return testResults;
    }

    async runCodingProblemTestCases(runCodingProblemTestDto: RunCodingProblemTestDto): Promise<TestCaseResult[]> {
        const { codingProblemId, code, language } = runCodingProblemTestDto;
        const problem = await this.codingProblemRepository.findOne({
            where: { codingProblemId },
            relations: ['examples', 'templates'],
        });

        if (!problem) {
            throw new HttpException('Problem not found', HttpStatus.NOT_FOUND);
        }

        return await this.runTests(problem, code, language)
    }


}
