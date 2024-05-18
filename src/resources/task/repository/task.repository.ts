import { EntityRepository, Repository } from 'typeorm';
import { generateRandomness } from '../../../common/utils/helper';
import { Task } from '../entity/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { User } from 'src/resources/user/entity/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {


    public async createTask(
        createTaskDto: CreateTaskDto,
        createdBy: User
    ): Promise<Task> {
        const { title, description, dueDate } = createTaskDto;
        const task = new Task();
        task.taskId = generateRandomness(20);
        task.title = title;
        task.description = description;
        task.dueDate = dueDate;
        task.createdBy = createdBy;
        await this.save(Task);
        return task;
    }

}


