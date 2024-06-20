import { IsString, IsNotEmpty } from 'class-validator';

export class ExecuteCodeDto {
  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
