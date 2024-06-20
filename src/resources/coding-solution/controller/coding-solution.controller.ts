import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CodingSolutionService } from '../service/coding-solution.service';
import { CreateCodingSolutionAttemptDto } from '../dto/create-coding-solution-attempt.dto';
import { UserDecorator } from 'src/resources/auth/decorator/user.decorator';
import { User } from 'src/resources/user/entity/user.entity';
import { ApiDefaultResponse } from 'src/common/decorators/api-default';
import { CodingSolutionResponseDto } from '../dto/coding-solution-response.dto';
import { ApiProtectedHeaders } from 'src/common/decorators/api-headers';
import { JwtGuard } from 'src/resources/auth/guards/jwt.guard';
import { RolesGuard } from 'src/resources/auth/guards/roles.guard';
import { Roles } from 'src/resources/auth/decorator/roles.decorator';
import { UserType } from 'src/resources/user/enums';

@ApiProtectedHeaders('Coding Solutions')
@Controller('/api/v1')
@UseGuards(JwtGuard, RolesGuard)
export class CodingSolutionController {

    constructor(private readonly codingSolutionService: CodingSolutionService) { }


    @ApiDefaultResponse({
        model: CodingSolutionResponseDto,
        description: 'Returns details of newly created Coding Challenge',
    })
    @Post('/attempt-problem')
    @Roles(UserType.DEFAULT)
    async createCodingSolutionAttempt(
        @UserDecorator() user: User,
        @Body() createCodingSolutionAttemptDto: CreateCodingSolutionAttemptDto
    ) {
        const data = await this.codingSolutionService.createCodingSolutionAttempt(createCodingSolutionAttemptDto, user);
        return {
            message: "Code Solution saved",
            data
        }
    }

    
}
