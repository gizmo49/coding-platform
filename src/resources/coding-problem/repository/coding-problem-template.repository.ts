import { EntityRepository, Repository } from 'typeorm';
import { CodingProblemTemplate } from '../entity/coding-problem-template.entity';

@EntityRepository(CodingProblemTemplate)
export class CodingProblemTemplateRepository extends Repository<CodingProblemTemplate> {}
