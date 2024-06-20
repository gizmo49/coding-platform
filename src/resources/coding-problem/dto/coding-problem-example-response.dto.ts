import { ApiProperty } from '@nestjs/swagger';

export class CodingProblemExampleResponseDto {

  @ApiProperty({ type: String })
  input: string;

  @ApiProperty({ type: String })
  output: string;

  @ApiProperty({ type: String, nullable: true })
  explanation?: string;
}
