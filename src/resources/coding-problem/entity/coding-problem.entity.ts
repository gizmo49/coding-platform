import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BaseEntity, JoinColumn } from 'typeorm';
import { User } from 'src/resources/user/entity/user.entity';
import { Exclude } from 'class-transformer';
import { CodingSolution } from '../../coding-solution/entity/coding-solution.entity';
import { CodingProblemExample } from './coding-problem-example.entity';
import { CodingProblemTemplate } from './coding-problem-template.entity';

@Entity()
export class CodingProblem extends BaseEntity {

    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    codingProblemId: string;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: "text", nullable: false })
    description: string;

    @Column({ type: 'simple-array'})
    constraints: string[];

    @Column({ type: 'simple-array'})
    followUp?: string[];

    @Column({ type: 'simple-array' })
    hints?: string[];

    @OneToMany(() => CodingProblemExample, exmaple => exmaple.codingProblem, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    examples: CodingProblemExample[];

    @OneToMany(() => CodingProblemTemplate, template => template.codingProblem, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    templates: CodingProblemTemplate[];

    @ManyToOne(() => User, user => user.codingProblems)
    createdBy: User;

    @OneToMany(() => CodingSolution, solution => solution.problem, {
        onDelete: 'CASCADE'
    })
    solutions: CodingSolution[];

}
