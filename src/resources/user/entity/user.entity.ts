import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { UserType } from '../enums';
import { CodingProblem } from 'src/resources/coding-problem/entity/coding-problem.entity';
import { CodingSolution } from 'src/resources/coding-solution/entity/coding-solution.entity';


@Entity()
export class User extends BaseEntity {
    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    userId: string;

    @Column({ type: 'enum', enum: UserType, default: UserType.DEFAULT })
    userType: UserType;

    @Column({ type: 'varchar', nullable: true })
    userImage: string;

    @Column({ type: 'varchar', nullable: false })
    firstName: string;
  
    @Column({ type: 'varchar', nullable: false })
    lastName: string;

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
    @Column({ type: 'varchar', nullable: false, unique: true })
    email: string;

    @Exclude({ toPlainOnly: true })
    @Column({ type: 'varchar' })
    salt: string;

    @Exclude({ toPlainOnly: true })
    @Column({ type: 'varchar' })
    password: string;

    @OneToMany(() => CodingProblem, (codingProblem) => codingProblem.createdBy, {
        onDelete: 'CASCADE',
    })
    codingProblems: CodingProblem[];

    @OneToMany(() => CodingSolution, (codingProblem) => codingProblem.solvedBy, {
        onDelete: 'CASCADE',
    })
    codingSolution: CodingSolution[];

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}
