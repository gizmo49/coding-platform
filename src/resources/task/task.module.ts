import { Module } from '@nestjs/common';
import { TaskService } from './service/task.service';
import { TaskController } from './controller/task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { UsersModule } from '../user/user.module';
import { TaskRepository } from './repository/task.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    UsersModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
})
export class TaskModule { }
