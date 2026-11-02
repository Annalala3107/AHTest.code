import { executeCCode } from '../services/cExecutionEngine.ts';
import type { ExecutionResult } from '../services/cExecutionEngine.ts';

export interface WorkerExecutionRequest {
  id: string;
  code: string;
  stdin?: string;
  timeLimitMs?: number;
}

export interface WorkerExecutionResponse {
  id: string;
  result: ExecutionResult;
}

// Dedicated Web Worker thread: receives task, executes in isolated background thread, returns result
self.onmessage = (event: MessageEvent<WorkerExecutionRequest>) => {
  const { id, code, stdin = '' } = event.data;
  try {
    const result = executeCCode(code, stdin);
    self.postMessage({ id, result } satisfies WorkerExecutionResponse);
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
    self.postMessage({ id, result: fallbackResult } satisfies WorkerExecutionResponse);
  }
};
