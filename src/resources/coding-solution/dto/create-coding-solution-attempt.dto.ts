import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCodingSolutionAttemptDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    problemId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    language: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;
}
