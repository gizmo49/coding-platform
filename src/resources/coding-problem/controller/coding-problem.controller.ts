import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CodingProblemService } from '../service/coding-problem.service';
import { CreateCodingProblemDto } from '../dto/create-coding-problem.dto';
import { UpdateCodingProblemDto } from '../dto/update-coding-problem.dto';
import { ApiProtectedHeaders } from 'src/common/decorators/api-headers';
import { JwtGuard } from 'src/resources/auth/guards/jwt.guard';
import { RolesGuard } from 'src/resources/auth/guards/roles.guard';
import { UserDecorator } from 'src/resources/auth/decorator/user.decorator';
import { User } from 'src/resources/user/entity/user.entity';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { CodingProblemResponseDto } from '../dto/coding-problem-response.dto';
import { CodingProblem } from '../entity/coding-problem.entity';
import { ApiDefaultResponse } from 'src/common/decorators/api-default';
import { ApiMappedResponse } from 'src/common/decorators/api-mapped';

@ApiProtectedHeaders('Coding Problem')
@Controller('api/v1')
@UseGuards(JwtGuard, RolesGuard)
export class CodingProblemController {
    constructor(private readonly codingProblemService: CodingProblemService) { }

    @ApiMappedResponse({
        model: CodingProblemResponseDto,
        description: 'Returns list of coding problems',
    })
    @Get('/coding-problems')
    async getCodingProblems(): Promise<ResponseDto<CodingProblem[]>>{
        const data = await this.codingProblemService.getCodingProblems();
        return {
            message: "",
            data
        }
    }

    @ApiDefaultResponse({
        model: CodingProblemResponseDto,
        description: 'Returns details of newly created Coding Challenge',
    })
    @Post('/coding-problem')
    async createCodingProblem(
        @UserDecorator() user: User,
        @Body() createCodingProblemDto: CreateCodingProblemDto
    ): Promise<ResponseDto<CodingProblem>> {
        const data = await this.codingProblemService.createCodingProblem(createCodingProblemDto, user);
        return {
            message: "Coding Challenge Created Successfully",
            data
        }
    }
    
    @ApiDefaultResponse({
        model: CodingProblemResponseDto,
        description: 'Returns details of a coding challenge',
    })
    @Get('/coding-problem/:codingProblemId')
    async getCodingProblem(
        @Param('codingProblemId') codingProblemId: string,
        @UserDecorator() user: User,
    ): Promise<ResponseDto<CodingProblem>> {
        const data = await this.codingProblemService.getCodingProblem(codingProblemId, user);
        return {
            message: "Details of Coding Challenge",
            data
        }
    }

    @ApiDefaultResponse({
        model: CodingProblemResponseDto,
        description: 'Returns details of updated Coding Challenge',
    })
    @Patch('/coding-problem/:codingProblemId')
    async updateCodingProblem(
        @Param('codingProblemId') codingProblemId: string,
        @Body() updateCodingProblemDto: CreateCodingProblemDto,
        @UserDecorator() user: User
    ): Promise<ResponseDto<CodingProblem>> {
        const data = await this.codingProblemService.updateCodingProblem(
                codingProblemId,
                updateCodingProblemDto,
                user
            );
        return {
            message: "Coding Challenge Created Successfully",
            data
        }
    }
    

}
