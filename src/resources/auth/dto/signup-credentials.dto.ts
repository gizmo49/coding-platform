import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
    Matches,
    IsEmail,
} from 'class-validator';

export class SignupCredentialsDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsString()
    @MaxLength(50)
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        minimum: 6,
        maximum: 20,
        description: 'At least 1 capital, 1 small, 1 special character & 1 number',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'Password must be at least 1 capital, 1 small, 1 special character & 1 number',
    })
    password: string;


}
