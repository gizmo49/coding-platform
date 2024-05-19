import { EntityManager, QueryRunner, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignupCredentialsDto } from '../../auth/dto/signup-credentials.dto';
import { generateRandomness } from '../../../common/utils/helper';
import { User } from '../entity/user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Injectable, Optional } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
   
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {
        super();
    }


    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }


    async createUser(
        signupCredentialsDto: SignupCredentialsDto,
    ): Promise<User> {
        const { firstName, lastName, email, password } = signupCredentialsDto;
        const user = new User();
        user.userId = generateRandomness(20);
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        await this.userRepository.save(user)
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                email
            }
        });
    }

    async findByUserId(userId: string): Promise<User>{
       return await this.userRepository.findOneOrFail({
            where: {userId}
        })
    }

}


