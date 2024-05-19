import { TaskDto } from 'src/resources/task/dto/task.dto';
import { ResponseDto } from './response.dto';
import { UserDto } from 'src/resources/user/dto/user.dto';
import { LoginSuperResponseDto } from 'src/resources/auth/dto/login-super-response.dto';

export default [
  ResponseDto,
  UserDto,
  TaskDto,
  LoginSuperResponseDto
];
