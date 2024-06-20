import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsArray, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

export class CodingProblemExampleDto {

    @ApiProperty()
    @IsString()
    input: string;

    @ApiProperty()
    @IsString()
    output: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    explanation?: string;

}

export class CreateCodingProblemDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CodingProblemExampleDto)
    examples: CodingProblemExampleDto[];

    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    constraints: string[];

    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    followUp: string[];

    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    hints: string[];

}
