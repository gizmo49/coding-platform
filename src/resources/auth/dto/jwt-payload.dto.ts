import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';

class TokenDTO {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  expiresIn: string;
}

export class JwtPayloadDto {
  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  token: TokenDTO;
}
