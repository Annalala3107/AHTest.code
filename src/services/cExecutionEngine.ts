/**
 * High-Performance Client-Side C/C++ Virtual Execution Engine
 * Provides static syntax diagnostics (CE), virtual heap tracking (malloc/free/leak/double-free),
 * standard I/O streams (scanf/printf/cin/cout), and loop iteration caps (TLE).
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
  private heapMap: Map<number, any> = new Map();
  private nextAddress: number = 0x2000;
  private stepCount: number = 0;
  private readonly MAX_STEPS = 100000;

  constructor(stdin: string) {
    // Split stdin by all whitespace (space, tab, newline)
    this.stdinTokens = stdin.trim().length > 0 ? stdin.trim().split(/\s+/) : [];
  }

  // Watchdog against infinite loops
  public tick() {
    this.stepCount++;
    if (this.stepCount > this.MAX_STEPS) {
      throw new Error('TIME_LIMIT_EXCEEDED: Vòng lặp vượt quá 100,000 bước thực thi (Kiểm tra điều kiện dừng của while/for).');
    }
  }

  // Virtual Heap: malloc (Returns an indexable Array with address metadata)
  public malloc(size: number): any {
    this.tick();
    if (size <= 0) return null;
    const addr = this.nextAddress;
    this.nextAddress += Math.max(size, 4);

    const block: any = [];
    block.__addr = addr;
    block.__size = size;
    block.__freed = false;

    this.heapMap.set(addr, block);
    return block;
  }

  // Virtual Heap: calloc
  public calloc(num: number, size: number): any {
    const block = this.malloc(num * size);
    if (block) {
      for (let i = 0; i < num; i++) block[i] = 0;
    }
    return block;
  }

  // Virtual Heap: free
  public free(ptr: any) {
    this.tick();
    if (!ptr || ptr === 0) return; // In standard C, free(NULL) is a safe no-op
    
    const addr = typeof ptr === 'object' && ptr.__addr ? ptr.__addr : ptr;
    const block = this.heapMap.get(addr);
    if (!block) {
      throw new Error(`RUNTIME_ERROR: free(): invalid pointer address 0x${addr ? addr.toString(16) : '0'} (Con trỏ không hợp lệ hoặc không được cấp phát bởi malloc).`);
    }
    if (block.__freed) {
      throw new Error(`RUNTIME_ERROR: free(): double free detected in tcache at address 0x${addr.toString(16)} (Lỗi giải phóng con trỏ 2 lần liên tiếp!).`);
    }
    block.__freed = true;
  }

  // Pointer dereference safeguard
  public checkDereference(addr: number) {
    if (!addr || addr === 0) {
      throw new Error('RUNTIME_ERROR: SIGSEGV: Segmentation fault (Dereferencing NULL pointer - Truy cập vùng nhớ con trỏ NULL).');
    }
  }

  // Formatted scanf with setter callbacks: scanf("%d %d", (v) => a = v, (v) => b = v)
  public scanf(format: string, ...setterFns: ((val: any) => void)[]): number {
    this.tick();
    const specifiers = (format.match(/%(?:d|i|f|lf|s|c|lld|ld)/g) || []);
    let count = 0;

    for (let i = 0; i < specifiers.length; i++) {
      if (this.stdinTokens.length === 0) break;
      const token = this.stdinTokens.shift()!;
      const spec = specifiers[i];
      let val: any;

      if (spec.includes('f')) {
        val = parseFloat(token);
        if (isNaN(val)) val = 0.0;
      } else if (spec.includes('s')) {
        val = token;
      } else if (spec.includes('c')) {
        val = token.length > 0 ? token[0] : '';
      } else {
        val = parseInt(token, 10);
        if (isNaN(val)) val = 0;
      }

      if (setterFns[i] && typeof setterFns[i] === 'function') {
        setterFns[i](val);
        count++;
      }
    }
    return count;
  }

  // Single token consumer for C++ cin >> x
  public scanfNext(type: 'int' | 'float' | 'string' | 'char' = 'int'): any {
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

  // Simulated getchar()
  public getchar(): number {
    this.tick();
    if (this.stdinTokens.length === 0) return -1; // EOF
    const token = this.stdinTokens[0];
    if (token.length > 0) {
      const charCode = token.charCodeAt(0);
      this.stdinTokens[0] = token.slice(1);
      if (this.stdinTokens[0].length === 0) this.stdinTokens.shift();
      return charCode;
    }
    return 10; // '\n'
  }

  // String helpers
  public strlen(str: any): number {
    return String(str !== undefined && str !== null ? str : '').length;
  }

  public strcmp(s1: any, s2: any): number {
    const str1 = String(s1 || '');
    const str2 = String(s2 || '');
    if (str1 < str2) return -1;
    if (str1 > str2) return 1;
    return 0;
  }

  // Simulated printf
  public printf(format: string, ...args: any[]) {
    this.tick();
    let argIdx = 0;
    // Replace %d, %i, %f, %.1f, %.2f, %.3f, %s, %c
    const formatted = String(format).replace(/%(?:(\.\d+)?f|d|i|u|ld|lld|s|c|%)/g, (match, precision) => {
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
      totalAllocated += block.__size;
      if (block.__freed) {
        totalFreed += block.__size;
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
 * Robustly converts C/C++ source code into a sandboxed JavaScript function.
 */
function transpileCToJS(cCode: string): string {
  // Step 1: Protect string literals
  const stringLiterals: string[] = [];
  let code = cCode.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match) => {
    const idx = stringLiterals.length;
    stringLiterals.push(match);
    return `__STR_LITERAL_${idx}__`;
  });

  // Protect char literals
  const charLiterals: string[] = [];
  code = code.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, (match) => {
    const idx = charLiterals.length;
    charLiterals.push(match);
    return `__CHAR_LITERAL_${idx}__`;
  });

  // Step 2: Strip preprocessor directives & namespaces
  code = code.replace(/^\s*#include\s*<.*?>\s*$/gm, '');
  code = code.replace(/^\s*#include\s*".*?"\s*$/gm, '');
  code = code.replace(/^\s*#define\s+.*$/gm, '');
  code = code.replace(/\busing\s+namespace\s+std\s*;/g, '');

  // Step 3: Functions MUST be transformed BEFORE variable declarations!
  // Main entrypoint
  code = code.replace(/\b(?:int|void)\s+main\s*\((.*?)\)\s*\{/g, 'function __c_main() {');

  // Other function signatures: int add(int a, int b) -> function add(a, b)
  code = code.replace(/\b(?:int|void|float|double|char|long|short)\s*\*?\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{/g, (_, fnName, params) => {
    const cleanParams = params.split(',').map((p: string) => {
      const parts = p.trim().split(/\s+/);
      return parts[parts.length - 1].replace(/^\*+/, '');
    }).filter(Boolean).join(', ');
    return `function ${fnName}(${cleanParams}) {`;
  });

  // Step 4: C++ cout << a << b << endl;
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
    return vars.map((v: string) => `${v} = __rt.scanfNext("int");`).join('; ') + ';';
  });

  // Step 5: Wrap loops with runtime.tick() watchdog
  code = code.replace(/while\s*\((.*?)\)\s*\{/g, 'while ($1) { __rt.tick(); ');
  code = code.replace(/for\s*\((.*?)\)\s*\{/g, 'for ($1) { __rt.tick(); ');
  code = code.replace(/do\s*\{/g, 'do { __rt.tick(); ');

  // Step 6: Memory allocations & sizeof
  code = code.replace(/sizeof\s*\([^)]*\)/g, '4');
  code = code.replace(/\([a-zA-Z_]\w*\*+\)\s*/g, ''); // strip pointer casts like (int*)
  code = code.replace(/\bmalloc\s*\(/g, '__rt.malloc(');
  code = code.replace(/\bcalloc\s*\(/g, '__rt.calloc(');
  code = code.replace(/\bfree\s*\(/g, '__rt.free(');

  // Step 7: Formatted scanf with setter functions
  code = code.replace(/scanf\s*\(\s*(__STR_LITERAL_\d+__)\s*,\s*([^)]+)\)/g, (_, fmtPlaceholder, argsStr) => {
    const argTargets = argsStr.split(',').map((arg: string) => {
      const clean = arg.trim().replace(/^&/, '');
      return `(v) => { ${clean} = v; }`;
    });
    return `__rt.scanf(${fmtPlaceholder}, ${argTargets.join(', ')})`;
  });

  // Step 8: Replace type declarations
  // Strip pointer symbols in variable declarations: int *arr -> let arr
  code = code.replace(/\b(?:int|long\s+long|long|short|unsigned|signed|float|double|char|void)\s*\*+\s*([a-zA-Z_]\w*)/g, 'let $1');
  // Fixed size arrays: int arr[100]; -> let arr = new Array(100).fill(0)
  code = code.replace(/\b(?:int|long\s+long|long|short|unsigned|signed|float|double)\s+([a-zA-Z_]\w*)\s*\[\s*(\d+)\s*\]/g, 'let $1 = new Array($2).fill(0)');
  // Normal declarations: int a = 5;
  code = code.replace(/\b(?:int|long\s+long|long|short|unsigned|signed|float|double)\s+([a-zA-Z_]\w*)/g, 'let $1');
  // Char arrays
  code = code.replace(/\bchar\s+([a-zA-Z_]\w*)\s*\[\s*\d*\s*\]/g, 'let $1 = []');
  code = code.replace(/\bchar\s+([a-zA-Z_]\w*)/g, 'let $1');
  code = code.replace(/\bbool\s+([a-zA-Z_]\w*)/g, 'let $1');

  // Array literals: = { 1, 2, 3 } -> = [ 1, 2, 3 ]
  code = code.replace(/=\s*\{\s*([^{};]+?)\s*\}/g, '= [$1]');

  // Step 9: Replace printf, getchar, strlen, strcmp
  code = code.replace(/\bprintf\s*\(/g, '__rt.printf(');
  code = code.replace(/\bgetchar\s*\(\s*\)/g, '__rt.getchar()');
  code = code.replace(/\bstrlen\s*\(/g, '__rt.strlen(');
  code = code.replace(/\bstrcmp\s*\(/g, '__rt.strcmp(');

  // Step 10: Constants & Math
  code = code.replace(/\bNULL\b/g, 'null');
  code = code.replace(/\bsqrt\s*\(/g, 'Math.sqrt(');
  code = code.replace(/\babs\s*\(/g, 'Math.abs(');
  code = code.replace(/\bfabs\s*\(/g, 'Math.abs(');
  code = code.replace(/\bpow\s*\(/g, 'Math.pow(');
  code = code.replace(/\bfloor\s*\(/g, 'Math.floor(');
  code = code.replace(/\bceil\s*\(/g, 'Math.ceil(');
  code = code.replace(/\bmin\s*\(/g, 'Math.min(');
  code = code.replace(/\bmax\s*\(/g, 'Math.max(');

  // Step 11: Restore string and char literals
  code = code.replace(/__STR_LITERAL_(\d+)__/g, (_, idx) => stringLiterals[Number(idx)]);
  code = code.replace(/__CHAR_LITERAL_(\d+)__/g, (_, idx) => charLiterals[Number(idx)]);

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
