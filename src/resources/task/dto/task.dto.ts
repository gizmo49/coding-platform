import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../enums';

export class TaskDto {

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    taskStatus: TaskStatus;

    @ApiProperty()
    dueDate: Date

}
