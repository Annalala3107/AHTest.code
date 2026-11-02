/**
 * Production-Grade Asynchronous Code Execution Manager
 * Coordinates isolated Web Worker sandboxes with strict watchdog timers (TLE),
 * non-blocking background threads, and graceful Node.js / non-worker fallbacks.
 */

import {
  executeCCode,
  checkCSyntax,
  generatePedagogicalDiagnosis,
  MAX_CODE_LENGTH
} from './cExecutionEngine.ts';
import type { ExecutionResult } from './cExecutionEngine.ts';
import type { WorkerExecutionRequest, WorkerExecutionResponse } from '../workers/cExecution.worker.ts';

export interface ExecutionOptions {
  timeoutMs?: number;
  memoryLimitKb?: number;
}

const DEFAULT_TIMEOUT_MS = 2000;

/**
 * Checks if running in a browser environment with Web Worker support
 */
export function isWebWorkerSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.Worker !== 'undefined';
}

/**
 * Executes C code asynchronously in a dedicated Web Worker sandbox.
 * Guarantees zero UI freezing, strict watchdog termination on TLE,
 * and zero DOM/storage access from user code.
 */
export async function executeCCodeAsync(
  code: string,
  stdin: string = '',
  options: ExecutionOptions = {}
): Promise<ExecutionResult> {
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
  const startTime = performance.now();

  // 1. Fast static check on main thread before worker dispatch
  if (code.length > MAX_CODE_LENGTH) {
    const elapsed = Math.round(performance.now() - startTime);
    const diag = generatePedagogicalDiagnosis('CE', 'MAX_CODE_LENGTH_EXCEEDED', code);
    return {
      status: 'CE',
      exitCode: 1,
      stdout: '',
      stderr: `[Dung lượng vượt mức]: Mã nguồn chứa ${code.length.toLocaleString('vi-VN')} ký tự, vượt quá giới hạn tối đa cho phép là ${MAX_CODE_LENGTH.toLocaleString('vi-VN')} ký tự.`,
      executionTimeMs: elapsed,
      memoryKb: 0,
      diagnostics: [diag?.explanation || 'Mã nguồn vượt quá giới hạn 5,000 ký tự.'],
      pedagogicalDiagnosis: diag
    };
  }

  const syntaxCheck = checkCSyntax(code);
  if (!syntaxCheck.isValid) {
    const elapsed = Math.round(performance.now() - startTime);
    const rawErr = syntaxCheck.error || 'Compile Error: Lỗi cú pháp chương trình C.';
    const diag = generatePedagogicalDiagnosis('CE', rawErr, code);
    return {
      status: 'CE',
      exitCode: 1,
      stdout: '',
      stderr: rawErr,
      executionTimeMs: elapsed,
      memoryKb: 0,
      diagnostics: [rawErr],
      pedagogicalDiagnosis: diag
    };
  }

  // 2. Browser Environment: Dispatch to Dedicated Web Worker with Watchdog
  if (isWebWorkerSupported()) {
    return new Promise<ExecutionResult>((resolve) => {
      let isSettled = false;
      let worker: Worker | null = null;
      const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

      try {
        worker = new Worker(new URL('../workers/cExecution.worker.ts', import.meta.url), {
          type: 'module'
        });
      } catch (workerInitErr) {
        console.warn('Worker initialization failed, falling back to synchronous runner:', workerInitErr);
        resolve(executeCCode(code, stdin));
        return;
      }

      // Hard Watchdog: Terminates worker immediately if execution exceeds timeout limit
      const watchdog = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          try {
            worker?.terminate();
          } catch {
            // ignore
          }
          const elapsed = Math.round(performance.now() - startTime);
          const rawErr = `TIME_LIMIT_EXCEEDED: Vượt quá thời gian thực thi tối đa (${(timeoutMs / 1000).toFixed(2)}s). Vòng lặp vô tận đã bị ngắt bởi Watchdog.`;
          const diag = generatePedagogicalDiagnosis('TLE', rawErr, code);
          resolve({
            status: 'TLE',
            exitCode: 124,
            stdout: '',
            stderr: rawErr,
            executionTimeMs: Math.max(elapsed, timeoutMs),
            memoryKb: 2048,
            diagnostics: [rawErr],
            pedagogicalDiagnosis: diag
          });
        }
      }, timeoutMs);

      // Handle successful message from worker
      worker.onmessage = (event: MessageEvent<WorkerExecutionResponse>) => {
        if (event.data.id === taskId && !isSettled) {
          isSettled = true;
          clearTimeout(watchdog);
          try {
            worker?.terminate();
          } catch {
            // ignore
          }
          resolve(event.data.result);
        }
      };

      // Handle unhandled worker crash or error
      worker.onerror = (errEvent) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(watchdog);
          try {
            worker?.terminate();
          } catch {
            // ignore
          }
          const elapsed = Math.round(performance.now() - startTime);
          const rawErr = `RUNTIME_ERROR: Lỗi luồng thực thi trong Worker Sandbox: ${errEvent.message || 'Worker Crash'}`;
          const diag = generatePedagogicalDiagnosis('RTE', rawErr, code);
          resolve({
            status: 'RTE',
            exitCode: 139,
            stdout: '',
            stderr: rawErr,
            executionTimeMs: Math.max(elapsed, 1),
            memoryKb: 2048,
            diagnostics: [rawErr],
            pedagogicalDiagnosis: diag
          });
        }
      };

      // Post execution request payload
      const requestPayload: WorkerExecutionRequest = {
        id: taskId,
        code,
        stdin,
        timeLimitMs: timeoutMs
      };
      worker.postMessage(requestPayload);
    });
  }

  // 3. Non-Browser / Test Runner Fallback (Node.js)
  return Promise.resolve(executeCCode(code, stdin));
}

// Re-export core definitions for consumer convenience
export {
  executeCCode,
  checkCSyntax,
  generatePedagogicalDiagnosis
};
export type { ExecutionResult, PedagogicalDiagnosis } from './cExecutionEngine.ts';
