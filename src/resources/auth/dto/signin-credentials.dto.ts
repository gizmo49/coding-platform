import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class SignInCredentialsDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        minimum: 6,
        maximum: 20,
        description: 'At least 1 capital, 1 small, 1 special character & 1 number',
    })
    @IsNotEmpty()
    @IsString()
    password: string;


}
