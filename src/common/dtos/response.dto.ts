import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<TData> {
  @ApiProperty()
  message: string;
  @ApiProperty()
  data: TData;
}
