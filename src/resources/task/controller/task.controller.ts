import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaskService } from '../service/task.service';
import { ApiDefaultResponse } from 'src/common/decorators/api-default';
import { UserDecorator } from 'src/resources/auth/decorator/user.decorator';
import { ApiMappedResponse } from 'src/common/decorators/api-mapped';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ApiMessageResponse } from 'src/common/decorators/api-message';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskDto } from '../dto/task.dto';
import { Task } from '../entity/task.entity';
import { ApiProtectedHeaders } from 'src/common/decorators/api-headers';
import { User } from 'src/resources/user/entity/user.entity';
import { JwtGuard } from 'src/resources/auth/jwt.guard';

@ApiProtectedHeaders('Task')
@Controller('api/v1')
@UseGuards(JwtGuard)
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @ApiDefaultResponse({
        model: TaskDto,
        description: 'Returns details of newly created task',
    })
    @Post('/task')
    async createTask(
        @UserDecorator() user: User,
        @Body() createTaskDto: CreateTaskDto
    ): Promise<ResponseDto<Task>> {
        const data = await this.taskService.createTask(createTaskDto, user);
        return { message: "Tasks fetched successfully", data }
    }


    @ApiMappedResponse({
        model: TaskDto,
        description: "Lists all Tasks for authenticated user"
    })
    @Get('/tasks')
    async findAllTasks(
        @UserDecorator() user: User,
    ): Promise<ResponseDto<Task[]>> {
        const data = await this.taskService.findUserTasks(user);
        return { message: "Tasks fetched successfully", data }
    }

    @ApiDefaultResponse({
        model: TaskDto,
        description: 'Returns details of a specific task',
    })
    @Get('/task/:taskId')
    async findSpecificTask(
        @Param('taskId') taskId: string,
        @UserDecorator() user: User,
    ): Promise<ResponseDto<Task>> {
        const data = await this.taskService.findUserTask(taskId, user);
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
        @UserDecorator() user: User,
    ): Promise<ResponseDto<Task>> {
        const data = await this.taskService.updateTask(taskId, updateTaskDto, user);
        return { message: "Task updated successfully", data }
    }

    @ApiMessageResponse({
        description: 'Delete a task',
    })
    @Delete('/task/:taskId')
    async removeTask(
        @Param('taskId') taskId: string,
        @UserDecorator() user: User,
    ) {
        await this.taskService.removeTask(taskId, user);
        return { message: "Task Deleted successfully", data: "" }
    }

}
