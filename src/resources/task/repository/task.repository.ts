import { EntityRepository, Repository } from 'typeorm';
import { generateRandomness } from '../../../common/utils/helper';
import { Task } from '../entity/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { User } from 'src/resources/user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTaskDto } from '../dto/update-task.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>
    ) {
        super();
    }

    public async createTask(
        createTaskDto: CreateTaskDto,
        user: User
    ): Promise<Task> {
        const { title, description, dueDate } = createTaskDto;
        const task = new Task();
        task.taskId = generateRandomness(20);
        task.title = title;
        task.description = description;
        task.dueDate = dueDate;
        task.createdBy = user;
        await this.taskRepository.save(task);
        return task;
    }

    async findUserTasks(user: User): Promise<Task[]>{
        const tasks = await this.taskRepository.find({
            where: {
                createdBy: user
            },
            relations: ['createdBy']
        });
        return tasks
    }

    async findUserTask(taskId: string, user: User): Promise<Task>{
        const task = await this.taskRepository.findOne({
            where: {
                taskId,
                createdBy: user
            },
            relations: ['createdBy']
        });
        return task
    }

    async updateTask(taskId: string, updateTaskDto: UpdateTaskDto, user: User) {
        const task = await this.findUserTask(taskId, user);

        task.title = updateTaskDto.title || task.title;
        task.description = updateTaskDto.description || task.description;
        task.taskStatus = updateTaskDto.taskStatus || task.taskStatus;
        task.dueDate = updateTaskDto.dueDate || task.dueDate;
        await this.taskRepository.save(task);
        return task;
    }

    async removeTask(taskId: string, user: User) {
        const task = await this.findUserTask(taskId, user);
        await this.taskRepository.delete(task);
    }

}


