/**
 * High-Performance Client-Side C/C++ Virtual Execution Engine
 * Provides static syntax diagnostics (CE), virtual heap tracking (malloc/free/leak/double-free),
 * standard I/O streams (scanf/printf/cin/cout), and loop iteration caps (TLE).
 */

export const MAX_CODE_LENGTH = 5000;

export interface PedagogicalDiagnosis {
  category: 'SYNTAX' | 'RUNTIME' | 'TIMEOUT' | 'MEMORY_LEAK' | 'SIZE_LIMIT' | 'LOGIC';
  badge: string;
  title: string;
  explanation: string;
  suggestion: string;
  location?: string;
  codeSnippet?: string;
}

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
  pedagogicalDiagnosis?: PedagogicalDiagnosis;
}

/**
 * 0. PEDAGOGICAL ERROR EXPLAINER
 * Analyzes compiler output, runtime crashes, and system traps to provide
 * compassionate, student-friendly diagnostic explanations and concrete fixes.
 */
export function generatePedagogicalDiagnosis(
  status: 'SUCCESS' | 'CE' | 'RTE' | 'TLE',
  rawError: string,
  code: string,
  heapReport?: any
): PedagogicalDiagnosis | undefined {
  if (code.length > MAX_CODE_LENGTH) {
    return {
      category: 'SIZE_LIMIT',
      badge: 'Vượt quá 5,000 ký tự',
      title: 'Mã nguồn vượt quá dung lượng cho phép',
      explanation: `Hệ thống giới hạn mỗi bài tập tối đa 5,000 ký tự để rèn luyện tư duy tối ưu mã và đảm bảo hiệu năng. Mã của bạn hiện đang có ${code.length.toLocaleString('vi-VN')} ký tự (dư ${(code.length - MAX_CODE_LENGTH).toLocaleString('vi-VN')} ký tự).`,
      suggestion: 'Hãy xóa bớt các ghi chú (comment) rườm rà, các hàm không dùng đến, hoặc tối ưu lại cấu trúc thuật toán.'
    };
  }

  if (status === 'CE') {
    if (rawError.includes("undefined reference to 'main'") || rawError.includes('hàm entrypoint')) {
      return {
        category: 'SYNTAX',
        badge: 'Thiếu hàm main()',
        title: 'Chương trình thiếu hàm khởi đầu int main()',
        explanation: 'Trong ngôn ngữ C và C++, hệ điều hành luôn bắt đầu thực thi chương trình tại hàm main. Nếu không tìm thấy hàm này, trình biên dịch (GCC/Clang) sẽ dừng và báo lỗi tham chiếu chưa định nghĩa.',
        suggestion: 'Hãy thêm hàm: int main() { /* mã nguồn của bạn */ return 0; } làm điểm vào cho chương trình.'
      };
    }

    if (rawError.includes("expected ';'") || rawError.includes('Thiếu dấu chấm phẩy')) {
      const lineMatch = rawError.match(/solution\.c:(\d+):(\d+)/);
      const loc = lineMatch ? `Dòng ${lineMatch[1]}, cột ${lineMatch[2]}` : undefined;
      return {
        category: 'SYNTAX',
        badge: "Thiếu dấu ';'",
        title: "Thiếu dấu chấm phẩy ';' kết thúc câu lệnh",
        explanation: 'Trong ngôn ngữ C/C++, mỗi câu lệnh đơn (khai báo biến, gán giá trị, gọi hàm printf/scanf, return) bắt buộc phải kết thúc bằng dấu chấm phẩy (;).',
        suggestion: loc ? `Hãy kiểm tra tại ${loc} hoặc ngay trước dòng đó và bổ sung dấu ';'.` : "Hãy kiểm tra lại cuối câu lệnh và bổ sung dấu ';'.",
        location: loc
      };
    }

    if (rawError.includes('unmatched') || rawError.includes('mismatched') || rawError.includes('unclosed bracket') || rawError.includes('ngoặc')) {
      const lineMatch = rawError.match(/solution\.c:(\d+):(\d+)/);
      const loc = lineMatch ? `Dòng ${lineMatch[1]}` : undefined;
      return {
        category: 'SYNTAX',
        badge: 'Lỗi đóng mở ngoặc',
        title: 'Sai lệch cặp dấu ngoặc { }, ( ) hoặc [ ]',
        explanation: 'Số lượng hoặc thứ tự các dấu ngoặc không khớp nhau. Lỗi này thường do mở ngoặc nhọn { của hàm, if, while nhưng quên đóng lại ở cuối khối lệnh.',
        suggestion: 'Hãy kiểm tra lại toàn bộ các khối lệnh, đảm bảo mỗi dấu mở ngoặc đều có đúng một dấu đóng tương ứng.',
        location: loc
      };
    }

    return {
      category: 'SYNTAX',
      badge: 'Lỗi biên dịch cú pháp',
      title: 'Cú pháp mã nguồn không hợp lệ',
      explanation: 'Trình biên dịch phát hiện lỗi trong cách viết lệnh, từ khóa hoặc khai báo biến không tuân thủ quy chuẩn ngữ pháp của C/C++.',
      suggestion: 'Đọc kỹ thông báo lỗi chi tiết bên dưới, kiểm tra lại cú pháp khai báo kiểu dữ liệu, include thư viện và tên hàm.'
    };
  }

  if (status === 'TLE') {
    return {
      category: 'TIMEOUT',
      badge: 'Quá thời gian (TLE)',
      title: 'Vượt quá thời gian thực thi (Time Limit Exceeded)',
      explanation: 'Chương trình chạy quá số bước tính toán tối đa (> 100,000 bước lặp). Hầu hết trường hợp là do vòng lặp while hoặc for bị lặp vô tận (infinite loop).',
      suggestion: '1. Kiểm tra biến điều khiển vòng lặp: Đã có bước cập nhật biến đếm chưa (vd: i++, n--)?\n2. Kiểm tra điều kiện dừng: Điều kiện lặp có bao giờ trở thành sai (false) không?\n3. Khi dùng while(scanf(...) != -1), hãy chắc chắn chương trình dừng khi hết dữ liệu input.'
    };
  }

  if (status === 'RTE') {
    if (rawError.includes('double free')) {
      return {
        category: 'RUNTIME',
        badge: 'Lỗi bộ nhớ (Double Free)',
        title: 'Giải phóng vùng nhớ 2 lần (Double Free)',
        explanation: 'Hàm free() đã được gọi 2 lần trên cùng một địa chỉ con trỏ Heap. Điều này gây hỏng cấu trúc bộ nhớ của hệ thống.',
        suggestion: 'Chỉ giải phóng con trỏ một lần duy nhất. Sau khi free(ptr);, hãy gán ptr = NULL; để đảm bảo an toàn.'
      };
    }

    if (rawError.includes('invalid pointer') || rawError.includes('free(): invalid pointer')) {
      return {
        category: 'RUNTIME',
        badge: 'Con trỏ không hợp lệ',
        title: 'Giải phóng con trỏ không hợp lệ',
        explanation: 'Con trỏ được truyền vào hàm free() không phải là con trỏ được cấp phát bởi malloc()/calloc(), hoặc con trỏ đã bị dịch chuyển địa chỉ (ví dụ ptr++).',
        suggestion: 'Chỉ gọi free() trên đúng biến con trỏ ban đầu được trả về từ malloc(). Không di chuyển con trỏ trước khi giải phóng.'
      };
    }

    if (rawError.includes('NULL_TERMINATOR') || rawError.includes('out of bounds') || rawError.includes('out-of-bounds') || rawError.includes('tràn chuỗi')) {
      return {
        category: 'RUNTIME',
        badge: 'Lỗi chuỗi (Null-Terminator / Buffer Overflow)',
        title: 'Tràn bộ đệm chuỗi hoặc thiếu ký tự kết thúc \'\\0\'',
        explanation: 'Trong ngôn ngữ C, chuỗi ký tự phải luôn kết thúc bằng ký tự \'\\0\'. Khi duyệt mảng mà không có điều kiện dừng \'\\0\' hoặc khai báo mảng char không đủ kích thước cho ký tự kết thúc, chương trình sẽ crash hoặc sinh giá trị rác.',
        suggestion: '1. Luôn khai báo mảng char s[N+1] với N là độ dài tối đa để chừa 1 ô cho ký tự \'\\0\'.\n2. Khi lặp chuỗi, hãy dùng: while (s[i] != \'\\0\') thay vì số vòng lặp cố định.'
      };
    }

    if (rawError.includes('SIGSEGV') || rawError.includes('Segmentation fault') || rawError.includes('NULL pointer') || rawError.includes('undefined') || rawError.includes('null')) {
      return {
        category: 'RUNTIME',
        badge: 'Lỗi bộ nhớ (SIGSEGV)',
        title: 'Vi phạm truy cập bộ nhớ (Segmentation Fault / NULL Pointer)',
        explanation: 'Chương trình cố gắng đọc/ghi vào vùng nhớ không hợp lệ hoặc dereference con trỏ NULL (*ptr khi ptr == NULL). Thường do truy cập mảng ngoài phạm vi (out-of-bounds) hoặc con trỏ chưa trỏ vào ô nhớ hợp lệ.',
        suggestion: '1. Kiểm tra chỉ số mảng: Mảng N phần tử chỉ hợp lệ từ chỉ số 0 đến N - 1.\n2. Kiểm tra con trỏ: Đảm bảo con trỏ đã được malloc() hoặc gán địa chỉ trước khi truy cập.\n3. Kiểm tra lệnh scanf: Đảm bảo có toán tử & trước biến (ví dụ: &x).'
      };
    }

    if (rawError.includes('Maximum call stack') || rawError.includes('Stack overflow')) {
      return {
        category: 'RUNTIME',
        badge: 'Tràn ngăn xếp (Stack Overflow)',
        title: 'Tràn ngăn xếp bộ nhớ (Stack Overflow / Đệ quy vô tận)',
        explanation: 'Hàm tự gọi lại chính nó quá nhiều lần mà không chạm tới điều kiện dừng (base case), dẫn đến việc tràn bộ nhớ ngăn xếp Call Stack.',
        suggestion: 'Kiểm tra hàm đệ quy: Đảm bảo có lệnh if kiểm tra điều kiện cơ sở (vd: if (n <= 1) return 1;) ở ngay đầu hàm.'
      };
    }

    if (rawError.includes('SIGFPE') || rawError.includes('division by zero') || rawError.includes('chia cho 0')) {
      return {
        category: 'RUNTIME',
        badge: 'Lỗi số học (SIGFPE)',
        title: 'Phép toán số học không hợp lệ (Chia cho 0)',
        explanation: 'Chương trình thực hiện phép chia nguyên hoặc lấy dư (/ hoặc %) với mẫu số bằng 0.',
        suggestion: 'Kiểm tra mẫu số trước khi chia: if (mauSo != 0) { thuong = tuSo / mauSo; }'
      };
    }

    return {
      category: 'RUNTIME',
      badge: 'Lỗi thực thi (Runtime Error)',
      title: 'Chương trình bị dừng đột ngột (Crash)',
      explanation: 'Chương trình gặp sự cố trong quá trình chạy, có thể do thao tác dữ liệu không hợp lệ hoặc logic chưa xử lý các trường hợp ngoại lệ.',
      suggestion: 'Kiểm tra lại input kiểm thử, các giá trị biên (số âm, số 0, chuỗi rỗng) và các thao tác trên mảng/con trỏ.'
    };
  }

  // Memory leak in SUCCESS
  if (heapReport && heapReport.hasMemoryLeak) {
    return {
      category: 'MEMORY_LEAK',
      badge: 'Cảnh báo rò rỉ bộ nhớ Heap',
      title: 'Phát hiện bộ nhớ chưa được giải phóng (Memory Leak)',
      explanation: `Chương trình đã cấp phát ${heapReport.totalAllocated} bytes bộ nhớ động bằng malloc()/calloc() nhưng vẫn còn ${heapReport.activeBlocks} khối nhớ chưa được thu hồi bằng free().`,
      suggestion: 'Hãy thêm lệnh free(ptr); cho tất cả các vùng nhớ đã malloc trước khi lệnh return 0; kết thúc hàm main.'
    };
  }

  return undefined;
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
  private stdinLines: string[] = [];
  private stdoutBuffer: string = '';
  private stderrBuffer: string = '';
  private heapMap: Map<number, any> = new Map();
  private nextAddress: number = 0x2000;
  private stepCount: number = 0;
  private readonly MAX_STEPS = 100000;

  constructor(stdin: string) {
    this.stdinLines = stdin.replace(/\r\n/g, '\n').split('\n');
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

  // String & Character helpers (C-Standard Library)
  public strlen(str: any): number {
    this.tick();
    if (Array.isArray(str)) {
      const nullIdx = str.indexOf('\0');
      if (nullIdx !== -1) return nullIdx;
      return str.length;
    }
    return String(str !== undefined && str !== null ? str : '').length;
  }

  public strcmp(s1: any, s2: any): number {
    this.tick();
    const str1 = Array.isArray(s1) ? s1.join('') : String(s1 || '');
    const str2 = Array.isArray(s2) ? s2.join('') : String(s2 || '');
    if (str1 < str2) return -1;
    if (str1 > str2) return 1;
    return 0;
  }

  public strcpy(dest: any, src: any): any {
    this.tick();
    const s = Array.isArray(src) ? src.join('') : String(src || '');
    if (Array.isArray(dest)) {
      dest.length = 0;
      for (let i = 0; i < s.length; i++) dest.push(s[i]);
      dest.push('\0');
      return dest;
    }
    return s;
  }

  public strncpy(dest: any, src: any, n: number): any {
    this.tick();
    const s = Array.isArray(src) ? src.join('') : String(src || '');
    if (Array.isArray(dest)) {
      dest.length = 0;
      for (let i = 0; i < Math.min(s.length, n); i++) dest.push(s[i]);
      return dest;
    }
    return s.slice(0, n);
  }

  public strcat(dest: any, src: any): any {
    this.tick();
    const s = Array.isArray(src) ? src.join('') : String(src || '');
    if (Array.isArray(dest)) {
      const nullIdx = dest.indexOf('\0');
      if (nullIdx !== -1) dest.splice(nullIdx, 1);
      for (let i = 0; i < s.length; i++) dest.push(s[i]);
      dest.push('\0');
      return dest;
    }
    return String(dest) + s;
  }

  public strstr(haystack: any, needle: any): any {
    this.tick();
    const h = Array.isArray(haystack) ? haystack.join('') : String(haystack || '');
    const n = Array.isArray(needle) ? needle.join('') : String(needle || '');
    const idx = h.indexOf(n);
    return idx === -1 ? null : idx;
  }

  public strchr(str: any, ch: any): any {
    this.tick();
    const s = Array.isArray(str) ? str.join('') : String(str || '');
    const c = typeof ch === 'number' ? String.fromCharCode(ch) : String(ch || '');
    const idx = s.indexOf(c);
    return idx === -1 ? null : idx;
  }

  public strrev(str: any): any {
    this.tick();
    if (Array.isArray(str)) {
      return str.reverse();
    }
    return String(str || '').split('').reverse().join('');
  }

  public tolower(ch: any): any {
    if (typeof ch === 'number') {
      const char = String.fromCharCode(ch).toLowerCase();
      return char.charCodeAt(0);
    }
    return String(ch).toLowerCase();
  }

  public toupper(ch: any): any {
    if (typeof ch === 'number') {
      const char = String.fromCharCode(ch).toUpperCase();
      return char.charCodeAt(0);
    }
    return String(ch).toUpperCase();
  }

  public isalpha(ch: any): boolean {
    const c = typeof ch === 'number' ? String.fromCharCode(ch) : String(ch);
    return /^[a-zA-Z]$/.test(c);
  }

  public isdigit(ch: any): boolean {
    const c = typeof ch === 'number' ? String.fromCharCode(ch) : String(ch);
    return /^[0-9]$/.test(c);
  }

  public isalnum(ch: any): boolean {
    const c = typeof ch === 'number' ? String.fromCharCode(ch) : String(ch);
    return /^[a-zA-Z0-9]$/.test(c);
  }

  public isspace(ch: any): boolean {
    const c = typeof ch === 'number' ? String.fromCharCode(ch) : String(ch);
    return /\s/.test(c);
  }

  public readLine(): string {
    this.tick();
    if (this.stdinLines.length > 0) {
      return this.stdinLines.shift() || '';
    }
    if (this.stdinTokens.length > 0) {
      return this.stdinTokens.shift() || '';
    }
    return '';
  }

  public gets(target: any): any {
    const line = this.readLine();
    if (Array.isArray(target)) {
      target.length = 0;
      for (let i = 0; i < line.length; i++) target.push(line[i]);
      target.push('\0');
      return target;
    }
    return line;
  }

  public fgets(target: any, size: number, _stream?: any): any {
    const line = this.readLine().slice(0, size - 1);
    if (Array.isArray(target)) {
      target.length = 0;
      for (let i = 0; i < line.length; i++) target.push(line[i]);
      target.push('\0');
      return target;
    }
    return line;
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
  // Strip C-style pointer casts: (int*), (char**), (void*), etc.
  code = code.replace(/\(\s*(?:const\s+)?(?:int|long\s+long|long|short|unsigned(?:\s+int)?|signed(?:\s+int)?|float|double|char|void|bool|auto|\w+_t)\s*\*+\s*\)\s*/g, '');
  // Strip C-style primitive type casts: (float), (double), (int), (char), (long), etc.
  code = code.replace(/\(\s*(?:const\s+)?(?:int|long\s+long|long|short|unsigned(?:\s+int)?|signed(?:\s+int)?|float|double|char|void|bool|auto|\w+_t)\s*\)\s*/g, '');
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

  // Step 9: Replace printf, getchar, strlen, strcmp, and string suite
  code = code.replace(/\bprintf\s*\(/g, '__rt.printf(');
  code = code.replace(/\bgetchar\s*\(\s*\)/g, '__rt.getchar()');
  code = code.replace(/\bstrlen\s*\(/g, '__rt.strlen(');
  code = code.replace(/\bstrcmp\s*\(/g, '__rt.strcmp(');
  code = code.replace(/\bstrcpy\s*\(/g, '__rt.strcpy(');
  code = code.replace(/\bstrncpy\s*\(/g, '__rt.strncpy(');
  code = code.replace(/\bstrcat\s*\(/g, '__rt.strcat(');
  code = code.replace(/\bstrstr\s*\(/g, '__rt.strstr(');
  code = code.replace(/\bstrchr\s*\(/g, '__rt.strchr(');
  code = code.replace(/\bstrrev\s*\(/g, '__rt.strrev(');
  code = code.replace(/\bgets\s*\(/g, '__rt.gets(');
  code = code.replace(/\bfgets\s*\(/g, '__rt.fgets(');
  code = code.replace(/\btolower\s*\(/g, '__rt.tolower(');
  code = code.replace(/\btoupper\s*\(/g, '__rt.toupper(');
  code = code.replace(/\bisalpha\s*\(/g, '__rt.isalpha(');
  code = code.replace(/\bisdigit\s*\(/g, '__rt.isdigit(');
  code = code.replace(/\bisalnum\s*\(/g, '__rt.isalnum(');
  code = code.replace(/\bisspace\s*\(/g, '__rt.isspace(');

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

  // Step 0: Enforce code character limit (5,000 characters)
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

  // Step 1: Static syntax check (CE)
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

    const diag = generatePedagogicalDiagnosis('SUCCESS', '', code, heapSummary);

    return {
      status: 'SUCCESS',
      exitCode: 0,
      stdout: runtime.getStdout(),
      stderr: runtime.getStderr(),
      executionTimeMs: Math.max(elapsed, 1),
      memoryKb: 1024 + heapSummary.totalAllocated,
      heapReport: heapSummary,
      diagnostics: diagnostics.length > 0 ? diagnostics : undefined,
      pedagogicalDiagnosis: diag
    };
  } catch (err: any) {
    const elapsed = Math.round(performance.now() - startTime);
    const message = err?.message || String(err);

    if (message.includes('TIME_LIMIT_EXCEEDED')) {
      const diag = generatePedagogicalDiagnosis('TLE', message, code);
      return {
        status: 'TLE',
        exitCode: 124,
        stdout: runtime.getStdout(),
        stderr: message,
        executionTimeMs: 1000,
        memoryKb: 2048,
        diagnostics: ['[Time Limit Exceeded] Chương trình chạy quá thời gian cho phép (1.00s). Có thể do vòng lặp vô tận (infinite loop).'],
        pedagogicalDiagnosis: diag
      };
    }

    const diag = generatePedagogicalDiagnosis('RTE', message, code);
    return {
      status: 'RTE',
      exitCode: 139,
      stdout: runtime.getStdout(),
      stderr: message,
      executionTimeMs: Math.max(elapsed, 1),
      memoryKb: 2048,
      diagnostics: [message],
      pedagogicalDiagnosis: diag
    };
  }
}
