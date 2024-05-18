import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsDate,
} from 'class-validator';

export class CreateTaskDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    dueDate: Date


}
