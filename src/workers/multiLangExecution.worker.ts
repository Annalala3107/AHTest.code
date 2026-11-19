import { executeCCode } from '../services/cExecutionEngine.ts';
import {
  executePythonCode,
  executeJavaCode,
  executeSqlQuery
} from '../services/multiLangJudgeService.ts';
import type { ExecutionResult } from '../services/cExecutionEngine.ts';

export interface MultiLangWorkerRequest {
  id: string;
  language: string;
  code: string;
  stdin?: string;
  timeLimitMs?: number;
}

export interface MultiLangWorkerResponse {
  id: string;
  result: ExecutionResult;
}

self.onmessage = async (event: MessageEvent<MultiLangWorkerRequest>) => {
  const { id, language, code, stdin = '', timeLimitMs = 2000 } = event.data;
  const normalized = (language || 'c17').toLowerCase().trim();

  try {
    let result: ExecutionResult;
    if (
      normalized === 'c' ||
      normalized === 'c17' ||
      normalized === 'cpp' ||
      normalized === 'cpp17' ||
      normalized === 'cpp20'
    ) {
      result = executeCCode(code, stdin);
    } else if (normalized === 'py3' || normalized === 'python') {
      result = await executePythonCode(code, stdin, { timeoutMs: timeLimitMs });
    } else if (normalized === 'java') {
      result = await executeJavaCode(code, stdin, { timeoutMs: timeLimitMs });
    } else if (normalized === 'sql') {
      result = await executeSqlQuery(code, stdin);
    } else {
      result = {
        status: 'CE',
        exitCode: 1,
        stdout: '',
        stderr: `Ngôn ngữ '${language}' chưa được kích hoạt trong Multi-Language Worker Sandbox.`,
        executionTimeMs: 1,
        memoryKb: 0,
        diagnostics: [`Unsupported language '${language}' in sandbox.`]
      };
    }

    self.postMessage({ id, result } satisfies MultiLangWorkerResponse);
  } catch (err: any) {
    const fallbackResult: ExecutionResult = {
      status: 'RTE',
      exitCode: 1,
      stdout: '',
      stderr: String(err?.message || err),
      executionTimeMs: 0,
      memoryKb: 0,
      diagnostics: [String(err?.message || err)]
    };
    self.postMessage({ id, result: fallbackResult } satisfies MultiLangWorkerResponse);
  }
};
