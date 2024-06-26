import {
    Post,
    Body,
    Controller,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { ResponseDto } from '../../../common/dtos/response.dto';
import { UserDto } from '../../user/dto/user.dto';
import { User } from '../../user/entity/user.entity';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { SignInCredentialsDto } from '../dto/signin-credentials.dto';
import { SignupCredentialsDto } from '../dto/signup-credentials.dto';
import { AuthService } from '../service/auth.service';
import { LoginSuperResponseDto } from '../dto/login-super-response.dto';
import { ApiDefaultResponse } from 'src/common/decorators/api-default';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/util/file-upload.utils';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/sign-up')
    @ApiDefaultResponse({
        model: LoginSuperResponseDto,
        description: 'Registration endpoint for user',
    })
    @UseInterceptors(
        FileInterceptor('image', {
            fileFilter: imageFileFilter,
        }),
    )
    async signUp(
        @UploadedFile() file,
        @Body() signupCredentialsDto: SignupCredentialsDto,
    ): Promise<ResponseDto<JwtPayloadDto>> {
        const data = await this.authService.signUp(signupCredentialsDto, file);
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
