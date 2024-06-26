import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { CodingProblemService } from '../service/coding-problem.service';
import { CreateCodingProblemDto } from '../dto/create-coding-problem.dto';
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
import { Roles } from 'src/resources/auth/decorator/roles.decorator';
import { UserType } from 'src/resources/user/enums';
import { CodingProblemTestCaseResultDto, RunCodingProblemTestDto } from '../dto/run-coding-problem-test.dto';
import { TestCaseResult } from '../interface';
import { OptionalJwtAuthGuard } from 'src/resources/auth/guards/optional-jwt.guard';

const { ADMIN, DEFAULT } = UserType;

@ApiProtectedHeaders('Coding Problem')
@Controller('api/v1')
export class CodingProblemController {
    constructor(private readonly codingProblemService: CodingProblemService) { }

    @ApiMappedResponse({
        model: CodingProblemResponseDto,
        description: 'Returns list of coding problems',
    })
    @Get('/coding-problems')
    async getCodingProblems(): Promise<ResponseDto<CodingProblem[]>> {
        const data = await this.codingProblemService.getCodingProblems();
        return {
            message: "",
            data
        }
    }

    @ApiMappedResponse({
        model: CodingProblemTestCaseResultDto,
        description: 'Returns list of coding problem test results based on code input',
    })
    @Post('/run/coding-problem')
    async runCodingProblemTestCases(
        @Body() runCodingProblemTestDto: RunCodingProblemTestDto
    ): Promise<ResponseDto<TestCaseResult[]>> {
        const data = await this.codingProblemService.runCodingProblemTestCases(runCodingProblemTestDto);
        return {
            message: "Coding Challenge Created Successfully",
            data
        }
    }

    @ApiDefaultResponse({
        model: CodingProblemResponseDto,
        description: 'Returns details of newly created Coding Challenge',
    })
    @Post('/coding-problem')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(ADMIN)
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
    @UseGuards(OptionalJwtAuthGuard)
    async getCodingProblem(
        @Param('codingProblemId') codingProblemId: string,
        @UserDecorator() user: User
    ){
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
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(ADMIN)
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
