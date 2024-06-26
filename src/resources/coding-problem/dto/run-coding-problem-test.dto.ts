import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class RunCodingProblemTestDto {
    @ApiProperty()
    @IsString()
    codingProblemId: string;

    @ApiProperty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsString()
    language: string;
}

export class CodingProblemTestCaseResultDto {
    @ApiProperty()
    @IsString()
    input: string;

    @ApiProperty()
    @IsString()
    expectedOutput: string;

    @ApiProperty()
    @IsString()
    actualOutput: string;

    @ApiProperty()
    @IsString()
    explanation: string;

    @ApiProperty()
    @IsString()
    result: string;
}
