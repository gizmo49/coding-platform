import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CodingProblem } from './coding-problem.entity';

@Entity()
export class CodingProblemTestCase {

    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    input: string;

    @Column({ type: 'varchar', nullable: false })
    expectedOutput: string;

    @ManyToOne(() => CodingProblem, problem => problem.testCases)
    problem: CodingProblem;

}
