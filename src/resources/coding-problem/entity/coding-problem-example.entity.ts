import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BaseEntity } from 'typeorm';
import { Exclude } from 'class-transformer';
import { CodingProblem } from './coding-problem.entity';


@Entity()
export class CodingProblemExample extends BaseEntity {

    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    input: string;
  
    @Column({ type: 'varchar', nullable: false })
    output: string;
  
    @Column({ type: 'varchar', nullable: false })
    explanation: string;

    @ManyToOne(() => CodingProblem, codingProblem => codingProblem.examples, {
        onDelete: 'CASCADE'
    })
    codingProblem: CodingProblem;
}
