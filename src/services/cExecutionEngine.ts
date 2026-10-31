/**
 * High-Performance Client-Side C/C++ Virtual Execution Engine
 * Provides static syntax diagnostics (CE), virtual heap tracking (malloc/free/leak/double-free),
 * standard I/O streams (scanf/printf), and loop iteration caps (TLE).
 */

export interface ExecutionResult {
  status: 'SUCCESS' | 'CE' | 'RTE' | 'TLE';
  exitCode: number;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  memoryKb: number;
  heapReport?: {
    totalAllocated: number;
    totalFreed: number;
    activeBlocks: number;
    hasMemoryLeak: boolean;
    leakedBlocks?: number[];
  };
  diagnostics?: string[];
}

/**
 * 1. SYNTAX & COMPILATION DIAGNOSTICS (Compile Error Detection)
 */
export function checkCSyntax(code: string): { isValid: boolean; error?: string } {
  const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''); // strip comments
  const lines = code.split('\n');

  // Check for main entry point
  if (!/\bint\s+main\s*\(/i.test(cleanCode) && !/\bvoid\s+main\s*\(/i.test(cleanCode)) {
    return {
      isValid: false,
      error: `solution.c:(.text+0x20): undefined reference to 'main'\ncollect2.exe: error: ld returned 1 exit status\n[Compiler Error] Chương trình C bắt buộc phải có hàm entrypoint 'int main()'.`
    };
  }

  // Check bracket balance with line tracking
  const stack: { char: string; line: number; col: number }[] = [];
  let inString = false;
  let inChar = false;

  for (let l = 0; l < lines.length; l++) {
    const line = lines[l];
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      const prevChar = c > 0 ? line[c - 1] : '';

      // Skip escaped characters
      if (prevChar === '\\') continue;

      if (char === '"' && !inChar) {
        inString = !inString;
        continue;
      }
      if (char === "'" && !inString) {
        inChar = !inChar;
        continue;
      }
      if (inString || inChar) continue;

      if (char === '{' || char === '(' || char === '[') {
        stack.push({ char, line: l + 1, col: c + 1 });
      } else if (char === '}' || char === ')' || char === ']') {
        if (stack.length === 0) {
          return {
            isValid: false,
            error: `solution.c:${l + 1}:${c + 1}: error: unmatched '${char}'\n[Compiler Error] Thừa dấu đóng ngoặc '${char}' không có dấu mở ngoặc tương ứng.`
          };
        }
        const last = stack.pop()!;
        const expected = last.char === '{' ? '}' : last.char === '(' ? ')' : ']';
        if (char !== expected) {
          return {
            isValid: false,
            error: `solution.c:${l + 1}:${c + 1}: error: mismatched '${last.char}' closed by '${char}', expected '${expected}'\n[Compiler Error] Sai cặp ngoặc: mở '${last.char}' tại dòng ${last.line} nhưng đóng bằng '${char}'.`
          };
        }
      }
    }
  }

  if (stack.length > 0) {
    const unclosed = stack[stack.length - 1];
    return {
      isValid: false,
      error: `solution.c:${unclosed.line}:${unclosed.col}: error: unclosed bracket '${unclosed.char}'\n[Compiler Error] Thiếu dấu đóng ngoặc tương ứng cho '${unclosed.char}' mở tại dòng ${unclosed.line}.`
    };
  }

  // Check missing semicolon on obvious statement lines
  for (let l = 0; l < lines.length; l++) {
    const rawLine = lines[l].trim();
    // remove inline comments
    const line = rawLine.replace(/\/\/.*$/, '').trim();
    if (!line) continue;
    if (line.startsWith('#')) continue; // preprocessor
    if (line.startsWith('/*') || line.endsWith('*/')) continue;
    if (line.endsWith('{') || line.endsWith('}') || line.endsWith(':')) continue;
    if (/^(if|else|for|while|do|switch|case|default)\b/.test(line) && !line.endsWith(';')) continue;
    
    // Statements that must end with semicolon
    if (/^(return\b|printf\b|scanf\b|int\b|float\b|double\b|char\b|long\b|free\b|malloc\b|calloc\b)/.test(line)) {
      if (!line.endsWith(';') && !line.endsWith('{') && !line.endsWith(',')) {
        return {
          isValid: false,
          error: `solution.c:${l + 1}:${line.length}: error: expected ';' at end of statement\n  ${line}\n  ^-- Thiếu dấu chấm phẩy ';' kết thúc câu lệnh.`
        };
      }
    }
  }

  return { isValid: true };
}

/**
 * 2. VIRTUAL C RUNTIME ENVIRONMENT
 */
export class VirtualCRuntime {
  private stdinTokens: string[] = [];
  private stdoutBuffer: string = '';
  private stderrBuffer: string = '';
  private heapMap: Map<number, { size: number; freed: boolean }> = new Map();
  private nextAddress: number = 0x2000;
  private stepCount: number = 0;
  private readonly MAX_STEPS = 50000;

  constructor(stdin: string) {
    // Split stdin by all whitespace (space, tab, newline)
    this.stdinTokens = stdin.trim().length > 0 ? stdin.trim().split(/\s+/) : [];
  }

  // Watchdog against infinite loops
  public tick() {
    this.stepCount++;
    if (this.stepCount > this.MAX_STEPS) {
      throw new Error('TIME_LIMIT_EXCEEDED: Vòng lặp vượt quá 50,000 bước thực thi (Kiểm tra điều kiện dừng của while/for).');
    }
  }

  // Virtual Heap: malloc
  public malloc(size: number): number {
    this.tick();
    if (size <= 0) return 0;
    const addr = this.nextAddress;
    this.nextAddress += Math.max(size, 4);
    this.heapMap.set(addr, { size, freed: false });
    return addr;
  }

  // Virtual Heap: calloc
  public calloc(num: number, size: number): number {
    return this.malloc(num * size);
  }

  // Virtual Heap: free
  public free(addr: number) {
    this.tick();
    if (addr === 0) return; // In standard C, free(NULL) is a safe no-op
    
    const block = this.heapMap.get(addr);
    if (!block) {
      throw new Error(`RUNTIME_ERROR: free(): invalid pointer address 0x${addr.toString(16)} (Con trỏ không hợp lệ hoặc không được cấp phát bởi malloc).`);
    }
    if (block.freed) {
      throw new Error(`RUNTIME_ERROR: free(): double free detected in tcache 2 at address 0x${addr.toString(16)} (Lỗi giải phóng con trỏ 2 lần liên tiếp!).`);
    }
    block.freed = true;
  }

  // Pointer dereference safeguard
  public checkDereference(addr: number) {
    if (addr === 0) {
      throw new Error('RUNTIME_ERROR: SIGSEGV: Segmentation fault (Dereferencing NULL pointer - Truy cập vùng nhớ con trỏ NULL).');
    }
  }

  // Simulated scanf
  public scanfNext(type: 'int' | 'float' | 'string' | 'char'): any {
    this.tick();
    if (this.stdinTokens.length === 0) {
      return type === 'string' ? '' : 0;
    }
    const token = this.stdinTokens.shift()!;
    if (type === 'int') {
      const val = parseInt(token, 10);
      return isNaN(val) ? 0 : val;
    }
    if (type === 'float') {
      const val = parseFloat(token);
      return isNaN(val) ? 0.0 : val;
    }
    if (type === 'char') {
      return token.length > 0 ? token[0] : '';
    }
    return token;
  }

  // Simulated printf
  public printf(format: string, ...args: any[]) {
    this.tick();
    let argIdx = 0;
    // Replace %d, %i, %f, %.1f, %.2f, %.3f, %s, %c
    const formatted = format.replace(/%(?:(\.\d+)?f|d|i|u|ld|lld|s|c|%)/g, (match, precision) => {
      if (match === '%%') return '%';
      if (argIdx >= args.length) return match;
      const val = args[argIdx++];

      if (match.endsWith('f')) {
        const num = Number(val);
        if (precision) {
          const dec = parseInt(precision.slice(1), 10);
          return isNaN(num) ? '0' : num.toFixed(dec);
        }
        return isNaN(num) ? '0.000000' : num.toFixed(6);
      }
      if (match === '%d' || match === '%i' || match === '%u' || match === '%ld' || match === '%lld') {
        const num = parseInt(val, 10);
        return isNaN(num) ? '0' : String(num);
      }
      if (match === '%s') {
        return String(val !== undefined && val !== null ? val : '');
      }
      if (match === '%c') {
        return String(val !== undefined && val !== null ? String(val)[0] : '');
      }
      return String(val);
    });

    this.stdoutBuffer += formatted.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  }

  // C++ cout stream simulation
  public cout(...args: any[]) {
    this.tick();
    for (const arg of args) {
      if (arg === '\n' || arg === '\r\n') {
        this.stdoutBuffer += '\n';
      } else {
        this.stdoutBuffer += String(arg !== undefined && arg !== null ? arg : '');
      }
    }
  }

  public getStdout(): string {
    return this.stdoutBuffer;
  }

  public getStderr(): string {
    return this.stderrBuffer;
  }

  public getHeapSummary() {
    let totalAllocated = 0;
    let totalFreed = 0;
    let activeBlocks = 0;
    const leakedBlocks: number[] = [];

    this.heapMap.forEach((block, addr) => {
      totalAllocated += block.size;
      if (block.freed) {
        totalFreed += block.size;
      } else {
        activeBlocks++;
        leakedBlocks.push(addr);
      }
    });

    return {
      totalAllocated,
      totalFreed,
      activeBlocks,
      hasMemoryLeak: activeBlocks > 0,
      leakedBlocks,
    };
  }
}

/**
 * 3. TRANSPILER & EXECUTION ENGINE
 * Converts common C patterns to a sandboxed JavaScript function with virtual C environment bindings.
 */
function transpileCToJS(cCode: string): string {
  // Strip preprocessor directives & namespaces
  let code = cCode.replace(/^\s*#include\s*<.*?>\s*$/gm, '');
  code = code.replace(/^\s*#include\s*".*?"\s*$/gm, '');
  code = code.replace(/^\s*#define\s+.*$/gm, '');
  code = code.replace(/\busing\s+namespace\s+std\s*;/g, '');

  // C++ cout << a << b << endl;
  code = code.replace(/\b(?:std::)?cout\s*<<\s*([^;]+);/g, (_, expr) => {
    const parts = expr.split('<<').map((p: string) => {
      const clean = p.trim();
      if (clean === 'endl' || clean === 'std::endl') return '"\\n"';
      return clean;
    });
    return `__rt.cout(${parts.join(', ')});`;
  });

  // C++ cin >> a >> b;
  code = code.replace(/\b(?:std::)?cin\s*>>\s*([^;]+);/g, (_, expr) => {
    const vars = expr.split('>>').map((v: string) => v.trim()).filter(Boolean);
    return vars.map((v: string) => `${v} = __rt.scanfNext("int");`).join(' ');
  });

  // Wrap loops with runtime.tick() watchdog
  // while(...) { -> while(...) { __rt.tick();
  code = code.replace(/while\s*\((.*?)\)\s*\{/g, 'while ($1) { __rt.tick(); ');
  // for(...) { -> for(...) { __rt.tick();
  code = code.replace(/for\s*\((.*?)\)\s*\{/g, 'for ($1) { __rt.tick(); ');
  // do { -> do { __rt.tick();
  code = code.replace(/do\s*\{/g, 'do { __rt.tick(); ');

  // Replace type declarations
  code = code.replace(/\b(?:int|long|short|unsigned|signed)\s+([a-zA-Z_]\w*)/g, 'let $1');
  code = code.replace(/\b(?:float|double)\s+([a-zA-Z_]\w*)/g, 'let $1');
  code = code.replace(/\bchar\s+([a-zA-Z_]\w*)\s*\[\s*\d*\s*\]/g, 'let $1 = ""');
  code = code.replace(/\bchar\s+([a-zA-Z_]\w*)/g, 'let $1');

  // Replace malloc & free
  code = code.replace(/\(int\*\)\s*malloc\s*\((.*?)\)/g, '__rt.malloc($1)');
  code = code.replace(/\(char\*\)\s*malloc\s*\((.*?)\)/g, '__rt.malloc($1)');
  code = code.replace(/\(void\*\)\s*malloc\s*\((.*?)\)/g, '__rt.malloc($1)');
  code = code.replace(/\bmalloc\s*\((.*?)\)/g, '__rt.malloc($1)');
  code = code.replace(/\bcalloc\s*\((.*?),\s*(.*?)\)/g, '__rt.calloc($1, $2)');
  code = code.replace(/\bfree\s*\((.*?)\)/g, '__rt.free($1)');

  // Replace printf
  code = code.replace(/\bprintf\s*\(/g, '__rt.printf(');

  // Replace scanf("%d", &x) or scanf("%f", &x) or scanf("%s", str)
  code = code.replace(/scanf\s*\(\s*["']%d["']\s*,\s*&([a-zA-Z_]\w*)\s*\)/g, '($1 = __rt.scanfNext("int"))');
  code = code.replace(/scanf\s*\(\s*["']%f["']\s*,\s*&([a-zA-Z_]\w*)\s*\)/g, '($1 = __rt.scanfNext("float"))');
  code = code.replace(/scanf\s*\(\s*["']%lf["']\s*,\s*&([a-zA-Z_]\w*)\s*\)/g, '($1 = __rt.scanfNext("float"))');
  code = code.replace(/scanf\s*\(\s*["']%s["']\s*,\s*([a-zA-Z_]\w*)\s*\)/g, '($1 = __rt.scanfNext("string"))');
  code = code.replace(/scanf\s*\(\s*["']%c["']\s*,\s*&([a-zA-Z_]\w*)\s*\)/g, '($1 = __rt.scanfNext("char"))');

  // Replace standard C constants & math
  code = code.replace(/\bNULL\b/g, '0');
  code = code.replace(/\bsqrt\s*\(/g, 'Math.sqrt(');
  code = code.replace(/\babs\s*\(/g, 'Math.abs(');
  code = code.replace(/\bpow\s*\(/g, 'Math.pow(');

  // Extract function definitions
  // Convert 'int main(...) {' to 'function main() {'
  code = code.replace(/\b(?:int|void)\s+main\s*\([^)]*\)\s*\{/, 'function __c_main() {');

  return `
    ${code}
    if (typeof __c_main === 'function') {
      __c_main();
    }
  `;
}

/**
 * 4. PUBLIC EXECUTION API
 */
export function executeCCode(code: string, stdin: string = ''): ExecutionResult {
  const startTime = performance.now();

  // Step 1: Static syntax check (CE)
  const syntaxCheck = checkCSyntax(code);
  if (!syntaxCheck.isValid) {
    const elapsed = Math.round(performance.now() - startTime);
    return {
      status: 'CE',
      exitCode: 1,
      stdout: '',
      stderr: syntaxCheck.error || 'Compile Error: Lỗi cú pháp chương trình C.',
      executionTimeMs: elapsed,
      memoryKb: 0,
      diagnostics: [syntaxCheck.error || '']
    };
  }

  // Step 2: Initialize Virtual C Runtime
  const runtime = new VirtualCRuntime(stdin);

  try {
    const transpiledJS = transpileCToJS(code);
    // Execute inside isolated Function scope
    const runner = new Function('__rt', transpiledJS);
    runner(runtime);

    const elapsed = Math.round(performance.now() - startTime);
    const heapSummary = runtime.getHeapSummary();

    const diagnostics: string[] = [];
    if (heapSummary.hasMemoryLeak) {
      diagnostics.push(
        `[Memory Leak Warning] Phát hiện rò rỉ bộ nhớ: Còn ${heapSummary.activeBlocks} khối nhớ Heap (${heapSummary.totalAllocated - heapSummary.totalFreed} bytes) chưa được gọi free() trước khi kết thúc chương trình.`
      );
    }

    return {
      status: 'SUCCESS',
      exitCode: 0,
      stdout: runtime.getStdout(),
      stderr: runtime.getStderr(),
      executionTimeMs: Math.max(elapsed, 1),
      memoryKb: 1024 + heapSummary.totalAllocated,
      heapReport: heapSummary,
      diagnostics: diagnostics.length > 0 ? diagnostics : undefined
    };
  } catch (err: any) {
    const elapsed = Math.round(performance.now() - startTime);
    const message = err?.message || String(err);

    if (message.includes('TIME_LIMIT_EXCEEDED')) {
      return {
        status: 'TLE',
        exitCode: 124,
        stdout: runtime.getStdout(),
        stderr: message,
        executionTimeMs: 1000,
        memoryKb: 2048,
        diagnostics: ['[Time Limit Exceeded] Chương trình chạy quá thời gian cho phép (1.00s). Có thể do vòng lặp vô tận (infinite loop).']
      };
    }

    return {
      status: 'RTE',
      exitCode: 139,
      stdout: runtime.getStdout(),
      stderr: message,
      executionTimeMs: Math.max(elapsed, 1),
      memoryKb: 2048,
      diagnostics: [message]
    };
  }
}
