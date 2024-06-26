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
            userType: user.userType,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        const accessToken = this.jwtService.sign(
            JSON.parse(JSON.stringify(userPayload)),
        );


        const payload: JwtPayloadDto = {
            user,
            token: {
                accessToken,
                expiresIn: this.configService.get('JWT_TOKEN_EXPIRES'),
            },
        };
        return payload;
    }

    public async validateToken(authToken: any): Promise<User> {
        const decoded = await this.jwtService.verify(authToken, {
            secret: process.env.JWT_SECRET
        },) as any;
        const user = await this.userService.getUserProfile(decoded.userId)
        return user
    }

    async signUp(signupCredentialsDto: SignupCredentialsDto, file): Promise<JwtPayloadDto> {
        const user: User = await this.userService.createUser(
            signupCredentialsDto,
            file
        );
        return await this.generateAuthToken(user);
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
