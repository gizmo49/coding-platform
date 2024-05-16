import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { SignInCredentialsDto } from '../../auth/dto/signin-credentials.dto';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import { Request } from 'express';
import { SignupCredentialsDto } from 'src/resources/auth/dto/signup-credentials.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(
        @Inject(REQUEST) private readonly request: Request,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

    ) { }

    async createUser(signupCredentialsDto: SignupCredentialsDto): Promise<User> {
        const user: User = await this.userRepository.createUser(
            signupCredentialsDto,
        );
        return user
    }
  

    async validateUserLogin({
        email,
        password,
    }: SignInCredentialsDto): Promise<User> {
        const user: User = await this.userRepository.findOne({
            where: {
                email
            }
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const passwordIsValid = await user.validatePassword(password);

        if (!passwordIsValid) {
            throw new HttpException(
                'could not validate Login credentials supplied',
                HttpStatus.BAD_REQUEST,
            );

        }
        return user;
    }

    async getUserProfile(userId: string) {
        const user = await this.userRepository.findOneOrFail({
            where: {userId}
        })
        return user
    }

}
