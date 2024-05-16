import {
    Post,
    Body,
    Controller,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiHeader } from '@nestjs/swagger';
import { ResponseDto } from '../../common/dtos/response.dto';
import { TransformInterceptor } from '../../core/interceptors/responseTransformer.interceptors';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/entity/user.entity';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { AuthService } from './service/auth.service';
import { ApiCreatedResponseDto } from '../../core/interceptors/dtos/api-created-response.dto';
import { LoginSuperResponseDto } from './dto/login-super-response.dto';

@ApiTags('Auth')
@Controller('api/v1/auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/sign-up')
    @ApiCreatedResponseDto({
        model: UserDto,
        description:
            'User and specified workspace has been successfully created. Response will contain an auth token.',
    })
    async signUp(
        @Body() signupCredentialsDto: SignupCredentialsDto,
    ): Promise<ResponseDto<User>> {
        const data = await this.authService.signUp(signupCredentialsDto);
        return { message: 'User Account created', data };
    }

    @Post('/sign-in')
    @ApiCreatedResponse({
        type: LoginSuperResponseDto,
        description:
            'Agent logged in successfully, response will contain an auth token.',
    })
    async signIn(
        @Body() signinCredentialsDto: SignInCredentialsDto,
    ): Promise<ResponseDto<JwtPayloadDto>> {
        const data = await this.authService.signIn(signinCredentialsDto);
        return { message: 'Login Successful', data };
    }
}
