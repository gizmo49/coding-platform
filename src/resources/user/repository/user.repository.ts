import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignupCredentialsDto } from '../../auth/dto/signup-credentials.dto';
import { generateRandomness } from '../../../common/utils/helper';
import { User } from '../entity/user.entity';
import { Injectable } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
   
    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    async createUser(
        signupCredentialsDto: SignupCredentialsDto,
        userImageUrl: string,
    ): Promise<User> {
        const { userType, firstName, lastName, email, password } = signupCredentialsDto;
        const user = new User();
        user.userId = generateRandomness(20);
        user.userType = userType;
        user.userImage = userImageUrl;
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        await this.save(user)
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        return await this.findOne({
            where: {
                email
            }
        });
    }

    async findByUserId(userId: string): Promise<User>{
       return await this.findOneOrFail({
            where: {userId}
        })
    }

}


