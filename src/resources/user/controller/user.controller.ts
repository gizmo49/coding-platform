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
import { RolesGuard } from 'src/resources/auth/guards/roles.guard';
import { Roles } from 'src/resources/auth/decorator/roles.decorator';
import { UserType } from 'src/resources/user/enums';

const { ADMIN, DEFAULT } = UserType;

@Controller('api/v1/user')
@ApiProtectedHeaders('User')
@UseGuards(JwtGuard, RolesGuard)
export class UserController {

    constructor(private userService: UserService) { }

    @ApiResponseDto({
        model: UserDto,
        description: 'On Success return relevant user details',
    })
    @Get('/profile')
    @Roles(ADMIN, DEFAULT)
    async retrieveAuthUserProfile(
        @UserDecorator() user: User
    ): Promise<ResponseDto<User>> {
        const data = await this.userService.getUserProfile(user.userId);
        return { message: 'Profile retrieved Successfully', data };
    }


}
