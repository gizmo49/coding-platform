export interface TestCaseResult {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    explanation: string;
    result: string; // 'pass' or 'fail'
}
