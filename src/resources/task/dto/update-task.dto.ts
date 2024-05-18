import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from '../enums';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {

    @ApiProperty()
    @IsEnum(TaskStatus)
    taskStatus: TaskStatus;

}
