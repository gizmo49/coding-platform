import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiResponseDto } from '../../core/interceptors/dtos/api-default-response.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './service/user.service';
import { ApiProtectedHeaders } from '../../common/decorators/api-headers';
import { User } from './entity/user.entity';

@Controller('api/v1/user')
@ApiProtectedHeaders('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/profile')
  @ApiResponseDto({
    model: UserDto,
    description: 'On Success return relevant user details',
  })
  async retrieveAuthUserProfile(
    @Req() request: Request,
  ): Promise<ResponseDto<User>> {
    const userId = request.headers['userid'].toString();
    const data = await this.userService.getUserProfile(userId);
    return { message: 'Profile retrieved Successfully', data };
  }


}
