import { ApiProperty } from '@nestjs/swagger';

export class TestCaseResultResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'input_example' })
  input: string;

  @ApiProperty({ example: 'expected_output_example' })
  expectedOutput: string;

  @ApiProperty({ example: 'actual_output_example' })
  actualOutput: string;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: '2023-06-18T15:35:20.123Z' })
  createdAt: Date;
}

export class CodingSolutionResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'javascript' })
  language: string;

  @ApiProperty({ example: 'console.log("Hello, world!");', required: false })
  code?: string;

  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Hello, world!', required: false })
  output?: string;

  @ApiProperty({ example: 'problem-id' })
  problemId: string;

  @ApiProperty({ example: 'user-id' })
  solvedById: string;

  @ApiProperty({ type: [TestCaseResultResponseDto] })
  testCaseResults: TestCaseResultResponseDto[];
}
