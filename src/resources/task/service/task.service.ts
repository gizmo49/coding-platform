import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { UserDto } from 'src/resources/user/dto/user.dto';
import { UserRepository } from 'src/resources/user/repository/user.repository';
import { TaskRepository } from '../repository/task.repository';
import { Task } from '../entity/task.entity';
import { UserService } from 'src/resources/user/service/user.service';

@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
        private readonly userService: UserService,

    ) {}

    async createTask(createTaskDto: CreateTaskDto, userDto: UserDto): Promise<Task> {
        const user = await this.userService.getUserProfile(userDto.userId);
        const task = await this.taskRepository.createTask(createTaskDto, user);
        return task;

    }

    async findAllTasks(userDto: UserDto): Promise<Task[]>{
        const tasks = await this.taskRepository.find({
            where: {
                user: {
                    userId: userDto.userId
                }
            },
            relations: ['user']
        });
        return tasks
    }

    async findSpecificTask(taskId: string, userId: string): Promise<Task>{
        const task = await this.taskRepository.findOne({
            where: {
                taskId,
                user: {
                    userId
                }
            },
            relations: ['user']
        });
        if(!task) {
            throw new HttpException(
                'Task not Found',
                HttpStatus.NOT_FOUND,
            );
        }
        return task
    }

    async updateTask(taskId: string, updateTaskDto: UpdateTaskDto, userDto: UserDto) {
        const task = await this.findSpecificTask(taskId, userDto.userId);

        task.title = task.title || updateTaskDto.title;
        task.description = task.description || updateTaskDto.description;
        task.taskStatus = task.taskStatus || updateTaskDto.taskStatus;
        task.dueDate = task.dueDate || updateTaskDto.dueDate;

        await this.taskRepository.save(task);
        return task;
    }

    async removeTask(taskId: string, userId: string) {
        const task = await this.findSpecificTask(taskId, userId);
        await this.taskRepository.delete(task);
    }

}
