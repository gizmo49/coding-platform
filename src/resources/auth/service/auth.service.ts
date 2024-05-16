import {
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SignInCredentialsDto } from '../dto/signin-credentials.dto';
import { SignupCredentialsDto } from '../dto/signup-credentials.dto';
import { User } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { UserDto } from 'src/resources/user/dto/user.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,

    ) { }

    private async generateAuthToken(user: User): Promise<JwtPayloadDto> {
        const userPayload: UserDto = {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        const accessToken = this.jwtService.sign(
            JSON.parse(JSON.stringify(userPayload)),
        );

        const refreshToken = this.jwtService.sign(
            JSON.parse(JSON.stringify(userPayload)),
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: process.env.JWT_TOKEN_REFRESH_EXPIRES,
                algorithm: 'HS256',
            },
        );

        const payload: JwtPayloadDto = {
            user,
            token: {
                accessToken,
                refreshToken,
                expiresIn: this.configService.get('JWT_TOKEN_EXPIRES'),
            },
        };
        return payload;
    }

    async signUp(signupCredentialsDto: SignupCredentialsDto): Promise<User> {
        const user: User = await this.userService.createUser(
            signupCredentialsDto,
        );
        return user
    }

    async signIn(
        signInCredentialsDto: SignInCredentialsDto,
    ): Promise<JwtPayloadDto> {
        const user: User = await this.userService.validateUserLogin(
            signInCredentialsDto,
        );
        if (!user) {
            throw new HttpException(
                'Unable to process login',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        return await this.generateAuthToken(user);
    }

}
