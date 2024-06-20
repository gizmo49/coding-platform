import { ResponseDto } from './response.dto';
import { UserDto } from 'src/resources/user/dto/user.dto';
import { LoginSuperResponseDto } from 'src/resources/auth/dto/login-super-response.dto';
import { CodingProblemResponseDto } from 'src/resources/coding-problem/dto/coding-problem-response.dto';
import { CodingSolutionResponseDto } from 'src/resources/coding-solution/dto/coding-solution-response.dto';

export default [
  ResponseDto,
  UserDto,
  LoginSuperResponseDto,
  CodingProblemResponseDto,
  CodingSolutionResponseDto
];
