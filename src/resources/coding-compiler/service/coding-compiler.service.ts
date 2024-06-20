import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ExecuteCodeDto } from '../dto/execute-code.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ExecutionResult, Guide0ApiRequest, Guide0ApiResponse } from '../interface';

@Injectable()
export class CodingCompilerService {

    constructor(private readonly httpService: HttpService) { }

    async executeCode(executeCodeDto: ExecuteCodeDto): Promise<ExecutionResult> {
        const { language, code } = executeCodeDto;

        // Save code to a temporary file
        const fileName = this.saveCodeToFile(language, code);

        try {
            const requestBody: Guide0ApiRequest = {
                language,
                code: fs.readFileSync(fileName, 'utf-8'),
            };

            // Send code to Guide0 API for execution
            const response = await lastValueFrom(
                this.httpService.post<Guide0ApiResponse>('https://api.guide0.com/execute', requestBody)
            );

            const { stdout, stderr } = response.data;

            return {
                success: !stderr,
                output: stdout || stderr,
            };
        } catch (error) {
            return {
                success: false,
                output: error.message,
            };
        } finally {
            this.cleanup(fileName);
        }
    }

    private saveCodeToFile(language: string, code: string): string {
        const tempDir = path.join(__dirname, '..', '..', 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        const fileName = path.join(tempDir, `${uuidv4()}.${this.getFileExtension(language)}`);
        fs.writeFileSync(fileName, code);
        return fileName;
    }

    private getFileExtension(language: string): string {
        switch (language) {
            case 'javascript':
                return 'js';
            case 'python':
                return 'py';
            case 'java':
                return 'java';
            // Add other languages as needed
            default:
                throw new Error('Unsupported language');
        }
    }

    private cleanup(fileName: string): void {
        if (fs.existsSync(fileName)) {
            fs.unlinkSync(fileName);
        }
    }
}