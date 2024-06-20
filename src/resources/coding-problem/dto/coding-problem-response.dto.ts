import { ApiProperty } from '@nestjs/swagger';
import { CodingProblemExampleResponseDto } from './coding-problem-example-response.dto';

export class CodingProblemResponseDto {

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  codingProblemId: string;

  @ApiProperty({ type: [String] })
  constraints: string[];

  @ApiProperty({ type: [String] })
  followUp: string[];

  @ApiProperty({ type: [String] })
  hints: string[];

  @ApiProperty({ type: () => [CodingProblemExampleResponseDto] })
  examples: CodingProblemExampleResponseDto[];

}
