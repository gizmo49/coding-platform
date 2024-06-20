import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    BaseEntity,
} from 'typeorm';
import { CodingSolution } from './coding-solution.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class TestCaseResult extends BaseEntity {

    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    input: string;

    @Column('text')
    expectedOutput: string;

    @Column('text')
    actualOutput: string;

    @Column()
    success: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => CodingSolution, attempt => attempt.testCaseResults)
    codingSolution: CodingSolution;

}
