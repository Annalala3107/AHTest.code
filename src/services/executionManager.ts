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
import {
  executePythonCode,
  executeJavaCode,
  executeSqlQuery,
} from './multiLangJudgeService.ts';

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
      diagnostics: [diag?.explanation || `Mã nguồn vượt quá giới hạn ${MAX_CODE_LENGTH.toLocaleString('vi-VN')} ký tự.`],
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

/**
 * Standard human-readable language labels for submissions and UI display
 */
export const LANGUAGE_LABELS: Record<string, string> = {
  c: 'C (GCC 11.4)',
  c17: 'C (GCC 11.4)',
  cpp: 'C++20 (G++ 13)',
  cpp17: 'C++17 (G++ 11)',
  cpp20: 'C++20 (G++ 13)',
  py3: 'Python 3.11',
  python: 'Python 3.11',
  java: 'Java 21 (OpenJDK)',
  sql: 'PostgreSQL 16 Dialect'
};

/**
 * Unified Multi-Language Sandbox Entry Point (Phase 2 & 3).
 * Dispatches C17, C++17/20, Python 3, Java 21 LTS, and SQL cleanly in background workers.
 */
export async function executeCodeAsync(
  language: string,
  code: string,
  stdin: string = '',
  options: ExecutionOptions = {}
): Promise<ExecutionResult> {
  const normalized = (language || 'c17').toLowerCase().trim();
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
  const startTime = performance.now();

  // 1. C / C++ family routes to executeCCodeAsync
  if (
    normalized === 'c' ||
    normalized === 'c17' ||
    normalized === 'cpp' ||
    normalized === 'cpp17' ||
    normalized === 'cpp20'
  ) {
    return executeCCodeAsync(code, stdin, options);
  }

  // 2. Validate supported language
  if (
    normalized !== 'py3' &&
    normalized !== 'python' &&
    normalized !== 'java' &&
    normalized !== 'sql'
  ) {
    return {
      status: 'CE',
      exitCode: 1,
      stdout: '',
      stderr: `Ngôn ngữ '${language}' chưa được kích hoạt trong Client Sandbox.`,
      executionTimeMs: 1,
      memoryKb: 0,
      diagnostics: [`Unsupported language '${language}' in sandbox.`]
    };
  }

  // 3. Browser Environment: Dispatch to Dedicated MultiLang Web Worker with Watchdog
  if (isWebWorkerSupported()) {
    return new Promise<ExecutionResult>((resolve) => {
      let isSettled = false;
      let worker: Worker | null = null;
      const taskId = `ml_task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

      try {
        worker = new Worker(new URL('../workers/multiLangExecution.worker.ts', import.meta.url), {
          type: 'module'
        });
      } catch (workerInitErr) {
        console.warn('MultiLang Worker init failed, falling back to synchronous runner:', workerInitErr);
        if (normalized === 'py3' || normalized === 'python') {
          resolve(executePythonCode(code, stdin, options));
        } else if (normalized === 'java') {
          resolve(executeJavaCode(code, stdin, options));
        } else {
          resolve(executeSqlQuery(code, stdin));
        }
        return;
      }

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
          resolve({
            status: 'TLE',
            exitCode: 124,
            stdout: '',
            stderr: rawErr,
            executionTimeMs: Math.max(elapsed, timeoutMs),
            memoryKb: 2048,
            diagnostics: [rawErr]
          });
        }
      }, timeoutMs);

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
          const rawErr = `RUNTIME_ERROR: Lỗi luồng thực thi trong MultiLang Worker: ${errEvent.message || 'Worker Crash'}`;
          resolve({
            status: 'RTE',
            exitCode: 139,
            stdout: '',
            stderr: rawErr,
            executionTimeMs: Math.max(elapsed, 1),
            memoryKb: 2048,
            diagnostics: [rawErr]
          });
        }
      };

      worker.postMessage({
        id: taskId,
        language: normalized,
        code,
        stdin,
        timeLimitMs: timeoutMs
      });
    });
  }

  // 4. Non-Browser / Test Runner Fallback (Node.js)
  if (normalized === 'py3' || normalized === 'python') {
    return executePythonCode(code, stdin, options);
  }
  if (normalized === 'java') {
    return executeJavaCode(code, stdin, options);
  }
  if (normalized === 'sql') {
    return executeSqlQuery(code, stdin);
  }

  return {
    status: 'CE',
    exitCode: 1,
    stdout: '',
    stderr: `Ngôn ngữ '${language}' không hợp lệ.`,
    executionTimeMs: 1,
    memoryKb: 0,
    diagnostics: []
  };
}

// Re-export core definitions for consumer convenience
export {
  executeCCode,
  checkCSyntax,
  generatePedagogicalDiagnosis
};
export type { ExecutionResult, PedagogicalDiagnosis } from './cExecutionEngine.ts';
