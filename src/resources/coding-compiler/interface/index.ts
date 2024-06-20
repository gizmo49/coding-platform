export interface ExecutionResult {
    success: boolean;
    output: string;
}

export interface Guide0ApiResponse {
    stdout: string;
    stderr: string;
}

export interface Guide0ApiRequest {
    language: string;
    code: string;
}
