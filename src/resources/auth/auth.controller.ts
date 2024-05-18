import {
    Post,
    Body,
    Controller,
} from '@nestjs/common';
import { ResponseDto } from '../../common/dtos/response.dto';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/entity/user.entity';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { AuthService } from './service/auth.service';
import { LoginSuperResponseDto } from './dto/login-super-response.dto';
import { ApiDefaultResponse } from 'src/common/decorators/api-default';
import { Public } from './public-strategy';

@Public()
@Controller('api/v1/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/sign-up')
    @ApiDefaultResponse({
        model: UserDto,
        description: 'Registration endpoint for user',
    })
    async signUp(
        @Body() signupCredentialsDto: SignupCredentialsDto,
    ): Promise<ResponseDto<User>> {
        const data = await this.authService.signUp(signupCredentialsDto);
        return { message: 'User Account created', data };
    }

    @Post('/sign-in')
    @ApiDefaultResponse({
        model: LoginSuperResponseDto,
        description: ' logged in successfully, response will contain an auth token.',
    })
    async signIn(
        @Body() signinCredentialsDto: SignInCredentialsDto,
    ): Promise<ResponseDto<JwtPayloadDto>> {
        const data = await this.authService.signIn(signinCredentialsDto);
        return { message: 'Login Successful', data };
    }
}
