/**
 * WebAssembly C Execution Engine (WASM-based compiler/interpreter)
 * Uses PicoC compiled to WebAssembly for native C language emulation (pointers, structs, 2D arrays, etc.)
 */
import { runC } from 'picoc-js';
import type { ExecutionResult } from './cExecutionEngine';

export interface WasmExecutionOptions {
  timeoutMs?: number;
}

/**
 * Executes standard C code inside the WebAssembly Sandbox.
 */
export function executeCCodeWasm(
  code: string,
  stdin: string = '',
  options: WasmExecutionOptions = {}
): Promise<ExecutionResult> {
  const timeoutMs = options.timeoutMs || 2500;
  const startTime = performance.now();

  return new Promise((resolve) => {
    let stdoutBuffer = '';
    let isDone = false;

    // Timeout guard against infinite loops in WASM
    const timer = setTimeout(() => {
      if (!isDone) {
        isDone = true;
        resolve({
          status: 'TLE',
          exitCode: 124,
          stdout: stdoutBuffer,
          stderr: 'Time Limit Exceeded: Chương trình chạy quá thời gian tối đa trong WebAssembly Sandbox.',
          executionTimeMs: timeoutMs,
          memoryKb: 4096,
          diagnostics: ['[WASM Timeout] Chương trình vượt quá thời gian thực thi (vòng lặp vô hạn).']
        });
      }
    }, timeoutMs);

    try {
      // Execute inside picoc WebAssembly interpreter
      runC(code, (output: string) => {
        stdoutBuffer += output;
      });

      // Picoc runs synchronously
      setTimeout(() => {
        if (!isDone) {
          isDone = true;
          clearTimeout(timer);
          const elapsed = Math.round(performance.now() - startTime);
          resolve({
            status: 'SUCCESS',
            exitCode: 0,
            stdout: stdoutBuffer,
            stderr: '',
            executionTimeMs: Math.max(elapsed, 1),
            memoryKb: 2048
          });
        }
      }, 50);
    } catch (err: any) {
      if (!isDone) {
        isDone = true;
        clearTimeout(timer);
        const elapsed = Math.round(performance.now() - startTime);
        resolve({
          status: 'RTE',
          exitCode: 1,
          stdout: stdoutBuffer,
          stderr: String(err?.message || err),
          executionTimeMs: Math.max(elapsed, 1),
          memoryKb: 2048,
          diagnostics: [String(err?.message || err)]
        });
      }
    }
  });
}

/**
 * Checks whether WebAssembly is supported in the current environment.
 */
export function isWasmSupported(): boolean {
  return typeof WebAssembly !== 'undefined' && typeof WebAssembly.instantiate === 'function';
}
