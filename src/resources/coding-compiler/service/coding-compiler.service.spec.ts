// coding-compiler.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CodingCompilerService } from './coding-compiler.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { ExecuteCodeDto } from '../dto/execute-code.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

jest.mock('fs');
jest.mock('path');
jest.mock('uuid', () => ({ v4: jest.fn() }));

describe('CodingCompilerService', () => {
    let service: CodingCompilerService;
    let httpService: HttpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CodingCompilerService,
                {
                    provide: HttpService,
                    useValue: {
                        post: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CodingCompilerService>(CodingCompilerService);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('executeCode', () => {
        it('should return execution result on success', async () => {
            const executeCodeDto: ExecuteCodeDto = {
                language: 'javascript',
                code: 'console.log("Hello, world!");',
            };
            const fileName = 'tempFile.js';
            const requestBody = {
                language: 'javascript',
                code: 'console.log("Hello, world!");',
            };
            const apiResponse = {
                data: { stdout: 'Hello, world!', stderr: '' },
            };

            (uuidv4 as jest.Mock).mockReturnValue('uuid');
            (path.join as jest.Mock).mockReturnValue(fileName);
            (fs.existsSync as jest.Mock).mockReturnValue(false);
            (fs.mkdirSync as jest.Mock).mockImplementation(() => { });
            (fs.writeFileSync as jest.Mock).mockImplementation(() => { });
            (fs.readFileSync as jest.Mock).mockReturnValue('console.log("Hello, world!");');
            (fs.unlinkSync as jest.Mock).mockImplementation(() => { });
            (httpService.post as jest.Mock).mockReturnValue(of(apiResponse));

            const result = await service.executeCode(executeCodeDto);

            expect(result).toEqual({ success: true, output: 'Hello, world!' });
        });

        it('should return error result on failure', async () => {
            const executeCodeDto: ExecuteCodeDto = {
                language: 'javascript',
                code: 'console.log("Hello, world!");',
            };
            const fileName = 'tempFile.js';
            const errorMessage = 'Some error occurred';

            (uuidv4 as jest.Mock).mockReturnValue('uuid');
            (path.join as jest.Mock).mockReturnValue(fileName);
            (fs.existsSync as jest.Mock).mockReturnValue(false);
            (fs.mkdirSync as jest.Mock).mockImplementation(() => { });
            (fs.writeFileSync as jest.Mock).mockImplementation(() => { });
            (fs.readFileSync as jest.Mock).mockReturnValue('console.log("Hello, world!");');
            (fs.unlinkSync as jest.Mock).mockImplementation(() => { });
            (httpService.post as jest.Mock).mockReturnValue(of(Promise.reject(new Error(errorMessage))));

            const result = await service.executeCode(executeCodeDto);

            expect(result).toEqual({ success: false, output: errorMessage });
        });
    });
});
