import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../enums';

export class UserDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  userType: UserType;

  @ApiProperty()
  email: string;

}
