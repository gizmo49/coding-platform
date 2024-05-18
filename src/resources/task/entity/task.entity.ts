import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    DeleteDateColumn,
    ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/resources/user/entity/user.entity';
import { TaskStatus } from '../enums';


@Entity()
export class Task extends BaseEntity {
    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    taskId: string;

    @Column({ type: 'varchar', nullable: false })
    title: string;
  
    @Column({ type: 'varchar', nullable: true })
    description: string;

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TO_DO })
    taskStatus: TaskStatus;

    @ManyToOne(() => User, (user) => user.tasks)
    createdBy: User;

    @Column({ type: 'timestamp', nullable: true})
    dueDate: Date;

    @Exclude()
    @DeleteDateColumn()
    public deletedAt: Date;
}
