import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    BaseEntity,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';


@Entity()
export class User extends BaseEntity {
    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    userId;

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

    @Exclude()
    @Column({ type: 'varchar' })
    salt: string;

    @Exclude()
    @Column({ type: 'varchar' })
    password: string;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}
