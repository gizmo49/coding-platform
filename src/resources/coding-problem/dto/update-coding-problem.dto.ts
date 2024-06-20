import { PartialType } from '@nestjs/mapped-types';
import { CreateCodingProblemDto } from './create-coding-problem.dto';

export class UpdateCodingProblemDto extends PartialType(CreateCodingProblemDto) {}
