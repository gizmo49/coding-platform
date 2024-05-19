import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskRepository } from '../repository/task.repository';
import { Task } from '../entity/task.entity';
import { User } from 'src/resources/user/entity/user.entity';
import { WebsocketsGateway } from 'src/resources/socket/websockets.gateway';

@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
        private readonly webSocketGateway: WebsocketsGateway

    ) { }

    async findUserTask(taskId: string, user: User): Promise<Task> {
        const task = await this.taskRepository.findUserTask(taskId, user);

        if (!task) {
            throw new HttpException(
                'Task not Found',
                HttpStatus.NOT_FOUND,
            );
        }
        return task
    }


    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const task = await this.taskRepository.createTask(createTaskDto, user);
        await this.webSocketGateway.triggerNewTaskEvent(task)
        return task;
    }

    async findUserTasks(user: User): Promise<Task[]> {
        const tasks = await this.taskRepository.findUserTasks(user);
        return tasks
    }

    async updateTask(taskId: string, updateTaskDto: UpdateTaskDto, user: User) {
        const task = await this.taskRepository.updateTask(taskId, updateTaskDto, user);
        return task;
    }

    async removeTask(taskId: string, user: User) {
        await this.taskRepository.removeTask(taskId, user);
    }

}
