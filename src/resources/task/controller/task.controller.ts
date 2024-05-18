import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from '../service/task.service';
import { ApiDefaultResponse } from 'src/common/decorators/api-default';
import { UserDecorator } from 'src/resources/auth/decorator/user.decorator';
import { UserDto } from 'src/resources/user/dto/user.dto';
import { ApiMappedResponse } from 'src/common/decorators/api-mapped';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ApiMessageResponse } from 'src/common/decorators/api-message';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskDto } from '../dto/task.dto';
import { Task } from '../entity/task.entity';
import { ApiProtectedHeaders } from 'src/common/decorators/api-headers';

@ApiProtectedHeaders('Task')
@Controller('api/v1')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @ApiDefaultResponse({
        model: TaskDto,
        description: 'Returns details of newly created task',
    })
    @Post('/task')
    async createTask(
        @UserDecorator() userDto: UserDto,
        @Body() createTaskDto: CreateTaskDto
    ): Promise<ResponseDto<Task>> {
        const data = await this.taskService.createTask(createTaskDto, userDto);
        return { message: "Tasks fetched successfully", data }
    }


    @ApiMappedResponse({
        model: TaskDto,
        description: "Lists all Tasks for authenticated user"
    })
    @Get('/tasks')
    async findAllTasks(
        @UserDecorator() userDto: UserDto,
    ): Promise<ResponseDto<Task[]>> {
        const data = await this.taskService.findAllTasks(userDto);
        return { message: "Tasks fetched successfully", data }
    }

    @ApiDefaultResponse({
        model: TaskDto,
        description: 'Returns details of a specific task',
    })
    @Get('/task/:taskId')
    async findSpecificTask(
        @Param('taskId') taskId: string,
        @UserDecorator() userDto: UserDto,
    ): Promise<ResponseDto<Task>> {
        const data = await this.taskService.findSpecificTask(taskId, userDto.userId);
        return { message: "Task fetched successfully", data }
    }

    @ApiDefaultResponse({
        model: TaskDto,
        description: 'Returns details of a specific task',
    })
    @Patch('/task/:taskId')
    async updateTask(
        @Param('taskId') taskId: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @UserDecorator() userDto: UserDto,
    ): Promise<ResponseDto<Task>> {
        const data = await this.taskService.updateTask(taskId, updateTaskDto, userDto);
        return { message: "Task updated successfully", data }
    }

    @ApiMessageResponse({
        description: 'Delete a task',
    })
    @Delete('/task/:taskId')
    async removeTask(
        @Param('taskId') taskId: string,
        @UserDecorator() userDto: UserDto,
    ) {
        await this.taskService.removeTask(taskId, userDto?.userId);
        return { message: "Task Deleted successfully", data: "" }
    }

}
