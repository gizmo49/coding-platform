import { PartialType } from '@nestjs/mapped-types';
import { RunCodingProblemTestDto } from 'src/resources/coding-problem/dto/run-coding-problem-test.dto';

export class CreateCodingSolutionAttemptDto extends PartialType(RunCodingProblemTestDto) {

}
