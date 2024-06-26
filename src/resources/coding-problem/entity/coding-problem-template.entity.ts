import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { CodingProblem } from './coding-problem.entity';

@Entity()
export class CodingProblemTemplate extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    language: string;

    @Column({ type: 'text', nullable: false })
    template: string;

    @ManyToOne(() => CodingProblem, problem => problem.templates, {
        onDelete: 'CASCADE'
    })
    codingProblem: CodingProblem;
}
