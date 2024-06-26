import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { CodingProblem } from '../../coding-problem/entity/coding-problem.entity';
import { TestCaseResult } from './testcase-result.entity';
import { User } from 'src/resources/user/entity/user.entity';

@Entity()
export class CodingSolution extends BaseEntity {

    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    language: string;

    @Column({ type: 'text', nullable: true })
    code: string;

    @Column({ type: 'bool', default: false })
    success: boolean;

    @Column({ type: 'text', nullable: true })
    output: string;

    @ManyToOne(() => CodingProblem, problem => problem.solutions)
    problem: CodingProblem;

    @ManyToOne(() => User, user => user.codingSolution)
    solvedBy: User;

    @OneToMany(() =>  TestCaseResult, testCaseResult => testCaseResult.codingSolution) 
    testCaseResults: TestCaseResult[]
    
}
