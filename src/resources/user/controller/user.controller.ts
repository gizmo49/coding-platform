import {
    Controller,
    Get,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiResponseDto } from '../../../core/interceptors/dtos/api-default-response.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../service/user.service';
import { ApiProtectedHeaders } from '../../../common/decorators/api-headers';
import { UserDecorator } from 'src/resources/auth/decorator/user.decorator';
import { User } from '../entity/user.entity';
import { JwtGuard } from 'src/resources/auth/guards/jwt.guard';

@Controller('api/v1/user')
@ApiProtectedHeaders('User')
@UseGuards(JwtGuard)
export class UserController {

    constructor(private userService: UserService) { }

    @Get('/profile')
    @ApiResponseDto({
        model: UserDto,
        description: 'On Success return relevant user details',
    })
    async retrieveAuthUserProfile(
        @UserDecorator() user: User
    ): Promise<ResponseDto<User>> {
        console.log("user>>>", user);
        const data = await this.userService.getUserProfile(user.userId);
        return { message: 'Profile retrieved Successfully', data };
    }


}
