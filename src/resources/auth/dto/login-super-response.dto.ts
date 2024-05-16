import { ApiProperty } from '@nestjs/swagger';
import { JwtPayloadDto } from './jwt-payload.dto';

export class LoginSuperResponseDto {
  @ApiProperty()
  message: string;
  @ApiProperty()
  data: JwtPayloadDto;
}
