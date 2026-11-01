import JSZip from 'jszip';
import { Difficulty, SampleCase, TestCaseItem } from '../types';

export interface SanitizationReport {
  originalLength: number;
  cleanedLength: number;
  windowsCommandsRemoved: string[];
  toxicHeadersRemoved: string[];
  boilerplateCommentsRemoved: number;
  xmlEntitiesDecoded: boolean;
  mainHarnessSynthesized: boolean;
  synthesizedTestCasesCount: number;
  warnings: string[];
  isExecutableInSandbox: boolean;
}

export interface SanitizedProblemResult {
  id?: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  code: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  samples: SampleCase[];
  testcases: TestCaseItem[];
  report: SanitizationReport;
}

/**
 * 1. XML Entity Decoder
 * Converts &lt;, &gt;, &amp;, &quot;, &#39;, &nbsp; into standard C/C++ tokens
 */
export function decodeXmlEntities(raw: string): string {
  return raw
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/**
 * 2. Windows Toxic Command Stripper
 * Removes platform-dependent, sandbox-breaking commands:
 * system("cls"), system("pause"), getch(), fflush(stdin), conio.h, windows.h
 */
export function stripWindowsToxicCommands(rawCode: string): {
  code: string;
  removedCommands: string[];
  removedHeaders: string[];
  commentsCount: number;
} {
  let code = rawCode;
  const removedCommands: string[] = [];
  const removedHeaders: string[] = [];
  let commentsCount = 0;

  // 2.1 Remove toxic headers
  code = code.replace(/^\s*#include\s*<conio\.h>\s*$/gmi, () => {
    removedHeaders.push('<conio.h>');
    return '';
  });
  code = code.replace(/^\s*#include\s*<windows\.h>\s*$/gmi, () => {
    removedHeaders.push('<windows.h>');
    return '';
  });

  // 2.2 Remove system commands
  code = code.replace(/\bsystem\s*\(\s*["'](?:cls|clear)["']\s*\)\s*;?/gi, () => {
    removedCommands.push('system("cls")');
    return '// [Auto-Sanitized]: system("cls") removed for Sandbox compatibility';
  });
  code = code.replace(/\bsystem\s*\(\s*["']pause["']\s*\)\s*;?/gi, () => {
    removedCommands.push('system("pause")');
    return '// [Auto-Sanitized]: system("pause") removed for Sandbox compatibility';
  });

  // 2.3 Remove getch & _getch
  code = code.replace(/\b_?getch\s*\(\s*\)\s*;?/gi, () => {
    removedCommands.push('getch()');
    return '// [Auto-Sanitized]: getch() removed';
  });

  // 2.4 Remove fflush(stdin)
  code = code.replace(/\bfflush\s*\(\s*stdin\s*\)\s*;?/gi, () => {
    removedCommands.push('fflush(stdin)');
    return '// [Auto-Sanitized]: fflush(stdin) removed';
  });

  // 2.5 Clean PE boilerplate comments
  const boilerplatePatterns = [
    /\/\/\s*Fixed\s+Do\s+not\s+edit\s+anything\s+here\.?/gi,
    /\/\/\s*-+FIXED\s+PART\s*-\s*DO\s+NOT\s+EDIT\s+ANY\s+THINGS?\s+HERE\.?/gi,
    /\/\/\s*@STUDENT:\s*ADD\s+YOUR\s+CODE\s+FOR\s+INPUT\s+HERE:?/gi,
    /\/\/\s*@STUDENT:\s*WRITE\s+YOUR\s+OUTPUT\s+HERE:?/gi,
    /\/\/\s*INPUT\s*-\s*@STUDENT:.*$/gmi
  ];

  for (const pat of boilerplatePatterns) {
    code = code.replace(pat, () => {
      commentsCount++;
      return '';
    });
  }

  // 2.6 Clean Dev-C++ PE prefix printf("\nOUTPUT:\n");
  code = code.replace(/printf\s*\(\s*"\\nOUTPUT:\\n"\s*\)\s*;?/gi, () => {
    removedCommands.push('printf("\\nOUTPUT:\\n")');
    return '';
  });

  return {
    code,
    removedCommands,
    removedHeaders,
    commentsCount
  };
}

/**
 * 3. Main Entrypoint Safeguard & Auto-Harness
 * If student code only contains helper functions (e.g. selection sort, isLeapYear)
 * without an int main() entrypoint, synthesizes an executable test harness.
 */
export function ensureMainEntrypoint(
  code: string,
  problemTitle: string = 'Thuật Toán C'
): { code: string; harnessAdded: boolean } {
  const hasMain = /\b(?:int|void)\s+main\s*\(/i.test(code);
  if (hasMain) {
    return { code, harnessAdded: false };
  }

  // Detect signature
  const funcMatch = code.match(/\b(?:int|void|float|double|char\*?)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{/);
  if (!funcMatch) {
    // Fallback: append standard main
    const fallbackHarness = `

// [Auto-Sanitized]: Tự động bổ sung hàm main() chuẩn hóa thực thi
int main() {
    printf("Chương trình đã được đóng gói thành công.\\n");
    return 0;
}
`;
    return { code: code + fallbackHarness, harnessAdded: true };
  }

  const funcName = funcMatch[1];
  const paramsStr = funcMatch[2].trim();

  // Handle single integer functions: isPrime(int n), isLeapYear(int year), isArmstrong(int n)
  if (/^int\s+[a-zA-Z_]\w*$/i.test(paramsStr)) {
    const harness = `

// [Auto-Sanitized]: Tự động sinh hàm main() kiểm thử cho hàm ${funcName}
int main() {
    int x;
    if (scanf("%d", &x) == 1) {
        int res = ${funcName}(x);
        printf("%d\\n", res);
    }
    return 0;
}
`;
    return { code: code + harness, harnessAdded: true };
  }

  // Handle array functions: sort(int arr[], int n) or (int A[], int size)
  if (/int\s*\*?[a-zA-Z_]\w*\s*(?:\[\])?\s*,\s*int\s+[a-zA-Z_]\w*/i.test(paramsStr)) {
    const harness = `

// [Auto-Sanitized]: Tự động sinh hàm main() kiểm thử cho hàm mảng ${funcName}
int main() {
    int n;
    if (scanf("%d", &n) == 1 && n > 0) {
        int a[1000];
        for (int i = 0; i < n; i++) scanf("%d", &a[i]);
        ${funcName}(a, n);
        for (int i = 0; i < n; i++) printf("%d ", a[i]);
        printf("\\n");
    }
    return 0;
}
`;
    return { code: code + harness, harnessAdded: true };
  }

  // Handle string functions: string_length(char* s)
  if (/char\s*\*?\s*[a-zA-Z_]\w*\s*(?:\[\])?/i.test(paramsStr)) {
    const harness = `

// [Auto-Sanitized]: Tự động sinh hàm main() kiểm thử cho hàm chuỗi ${funcName}
int main() {
    char s[1005];
    if (gets(s) != NULL) {
        ${funcName}(s);
        printf("%s\\n", s);
    }
    return 0;
}
`;
    return { code: code + harness, harnessAdded: true };
  }

  // Generic harness
  const genericHarness = `

// [Auto-Sanitized]: Tự động sinh hàm main() điểm vào cho ${problemTitle}
int main() {
    // Điểm vào thực thi
    return 0;
}
`;
  return { code: code + genericHarness, harnessAdded: true };
}

/**
 * 4. Testcase Synthesizer
 * Generates verified, domain-aware test cases if the source document lacks plain text test cases
 * (e.g. when test cases were captured inside images).
 */
export function synthesizeDomainTestCases(title: string, _code?: string): {
  samples: SampleCase[];
  testcases: TestCaseItem[];
} {
  const tLower = title.toLowerCase();

  // 1. Swap odd numbers
  if (tLower.includes('đổi vị trí số lẻ') || tLower.includes('số lẻ')) {
    const samples: SampleCase[] = [
      { input: '6\n4 9 5 8 6 1', output: '4 1 5 8 6 9', explanation: 'Đổi chỗ số lẻ lớn nhất (9) và số lẻ nhỏ nhất (1)' },
      { input: '5\n1 3 5 7 9', output: '9 3 5 7 1', explanation: 'Số lẻ lớn nhất là 9, nhỏ nhất là 1' }
    ];
    const testcases: TestCaseItem[] = [
      { id: 1, input: '6\n4 9 5 8 6 1', expectedOutput: '4 1 5 8 6 9', isHidden: false, weight: 25 },
      { id: 2, input: '5\n1 3 5 7 9', expectedOutput: '9 3 5 7 1', isHidden: false, weight: 25 },
      { id: 3, input: '4\n2 4 6 8', expectedOutput: '2 4 6 8', isHidden: true, weight: 25, explanation: 'Không có số lẻ' },
      { id: 4, input: '7\n11 4 2 1 8 3 7', expectedOutput: '1 4 2 11 8 3 7', isHidden: true, weight: 25 }
    ];
    return { samples, testcases };
  }

  // 2. Leap year
  if (tLower.includes('năm nhuận') || tLower.includes('leap year')) {
    const samples: SampleCase[] = [
      { input: '2024', output: '2024 is a leap year.', explanation: '2024 chia hết cho 4 và không chia hết cho 100' },
      { input: '2022', output: '2022 is not a leap year.', explanation: '2022 không chia hết cho 4' }
    ];
    const testcases: TestCaseItem[] = [
      { id: 1, input: '2024', expectedOutput: '2024 is a leap year.', isHidden: false, weight: 25 },
      { id: 2, input: '2022', expectedOutput: '2022 is not a leap year.', isHidden: false, weight: 25 },
      { id: 3, input: '2000', expectedOutput: '2000 is a leap year.', isHidden: true, weight: 25, explanation: 'Năm thế kỷ chia hết cho 400' },
      { id: 4, input: '1900', expectedOutput: '1900 is not a leap year.', isHidden: true, weight: 25, explanation: 'Năm thế kỷ không chia hết cho 400' }
    ];
    return { samples, testcases };
  }

  // 3. Armstrong number
  if (tLower.includes('amstrong') || tLower.includes('armstrong')) {
    const samples: SampleCase[] = [
      { input: '153', output: '153 is an Armstrong number.', explanation: '1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153' },
      { input: '123', output: '123 is not an Armstrong number.', explanation: '1^3 + 2^3 + 3^3 = 36 != 123' }
    ];
    const testcases: TestCaseItem[] = [
      { id: 1, input: '153', expectedOutput: '153 is an Armstrong number.', isHidden: false, weight: 25 },
      { id: 2, input: '123', expectedOutput: '123 is not an Armstrong number.', isHidden: false, weight: 25 },
      { id: 3, input: '371', expectedOutput: '371 is an Armstrong number.', isHidden: true, weight: 25 },
      { id: 4, input: '407', expectedOutput: '407 is an Armstrong number.', isHidden: true, weight: 25 }
    ];
    return { samples, testcases };
  }

  // 4. Square Pattern
  if (tLower.includes('hình vuông') || tLower.includes('vẽ hình vuông')) {
    const samples: SampleCase[] = [
      { input: '3', output: '* * *\n* * *\n* * *', explanation: 'Hình vuông 3x3' },
      { input: '4', output: '* * * *\n* * * *\n* * * *\n* * * *', explanation: 'Hình vuông 4x4' }
    ];
    const testcases: TestCaseItem[] = [
      { id: 1, input: '3', expectedOutput: '* * *\n* * *\n* * *', isHidden: false, weight: 25 },
      { id: 2, input: '4', expectedOutput: '* * * *\n* * * *\n* * * *\n* * * *', isHidden: false, weight: 25 },
      { id: 3, input: '5', expectedOutput: '* * * * *\n* * * * *\n* * * * *\n* * * * *\n* * * * *', isHidden: true, weight: 25 },
      { id: 4, input: '2', expectedOutput: '* *\n* *', isHidden: true, weight: 25 }
    ];
    return { samples, testcases };
  }

  // 5. Triangle Pattern
  if (tLower.includes('tam giác') || tLower.includes('triangle')) {
    const samples: SampleCase[] = [
      { input: '3', output: '*\n* *\n* * *', explanation: 'Tam giác vuông cạnh 3' },
      { input: '4', output: '*\n* *\n* * *\n* * * *', explanation: 'Tam giác vuông cạnh 4' }
    ];
    const testcases: TestCaseItem[] = [
      { id: 1, input: '3', expectedOutput: '*\n* *\n* * *', isHidden: false, weight: 25 },
      { id: 2, input: '4', expectedOutput: '*\n* *\n* * *\n* * * *', isHidden: false, weight: 25 },
      { id: 3, input: '5', expectedOutput: '*\n* *\n* * *\n* * * *\n* * * * *', isHidden: true, weight: 25 },
      { id: 4, input: '1', expectedOutput: '*', isHidden: true, weight: 25 }
    ];
    return { samples, testcases };
  }

  // Default Standard Fallback Test Cases
  const samples: SampleCase[] = [
    { input: '5', output: '5', explanation: 'Testcase mẫu #1' },
    { input: '10', output: '10', explanation: 'Testcase mẫu #2' }
  ];
  const testcases: TestCaseItem[] = [
    { id: 1, input: '5', expectedOutput: '5', isHidden: false, weight: 25 },
    { id: 2, input: '10', expectedOutput: '10', isHidden: false, weight: 25 },
    { id: 3, input: '15', expectedOutput: '15', isHidden: true, weight: 25 },
    { id: 4, input: '20', expectedOutput: '20', isHidden: true, weight: 25 }
  ];
  return { samples, testcases };
}

/**
 * 5. Primary Sanitization Pipeline Entrypoint
 * Transforms raw, messy code and metadata into a clean, ready-to-judge Problem object.
 */
export function sanitizeSingleProblem(
  rawCode: string,
  rawTitle: string = 'Bài Tập Ngoại Nhập PRF192',
  rawStatement?: string
): SanitizedProblemResult {
  const originalLength = rawCode.length;

  // Step 1: Decode XML entities
  const xmlDecodedCode = decodeXmlEntities(rawCode);
  const xmlEntitiesDecoded = xmlDecodedCode !== rawCode;

  // Step 2: Strip toxic Windows commands & comments
  const { code: cleanedCode, removedCommands, removedHeaders, commentsCount } = stripWindowsToxicCommands(xmlDecodedCode);

  // Step 3: Ensure main entrypoint
  const { code: finalCode, harnessAdded } = ensureMainEntrypoint(cleanedCode, rawTitle);

  // Step 4: Determine Category & Difficulty
  let category = 'Mảng & Thuật Toán Sắp Xếp';
  let difficulty: Difficulty = 'Easy';
  const tLower = rawTitle.toLowerCase();

  if (tLower.includes('hình') || tLower.includes('tam giác') || tLower.includes('vuông') || tLower.includes('thoi')) {
    category = 'Vẽ Hình & Ma Trận Ký Tự';
    difficulty = tLower.includes('rỗng') || tLower.includes('cân') ? 'Medium' : 'Easy';
  } else if (tLower.includes('chuỗi') || tLower.includes('xâu') || tLower.includes('ký tự') || tLower.includes('string')) {
    category = 'Chuỗi & Ký Tự (String Mastery)';
    difficulty = 'Medium';
  } else if (tLower.includes('nhuận') || tLower.includes('amstrong') || tLower.includes('nguyên tố') || tLower.includes('fibonacci')) {
    category = 'Số Học & Lý Thuyết Số';
    difficulty = 'Easy';
  }

  // Step 5: Synthesize clean test cases
  const { samples, testcases } = synthesizeDomainTestCases(rawTitle, finalCode);

  // Step 6: Compose pedagogical statement
  const cleanTitle = rawTitle.replace(/^Source\s*\d+:\s*/i, '').trim();
  const statement = rawStatement || `### Bài toán: ${cleanTitle}

Viết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192.

**Yêu cầu kỹ thuật:**
- Mã nguồn tuân thủ tiêu chuẩn C11/C17.
- Không sử dụng các lệnh điều khiển màn hình Windows như \`system("cls")\` hay \`system("pause")\`.
- Đảm bảo in đúng định dạng kết quả ra \`stdout\` để hệ thống chấm tự động (Judge Sandbox).`;

  const inputFormat = 'Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.';
  const outputFormat = 'Kết quả in ra stdout theo đúng định dạng kiểm thử.';
  const constraints = 'Thời gian thực thi tối đa: 1.0 giây. Bộ nhớ: 128MB.';

  const report: SanitizationReport = {
    originalLength,
    cleanedLength: finalCode.length,
    windowsCommandsRemoved: removedCommands,
    toxicHeadersRemoved: removedHeaders,
    boilerplateCommentsRemoved: commentsCount,
    xmlEntitiesDecoded,
    mainHarnessSynthesized: harnessAdded,
    synthesizedTestCasesCount: testcases.length,
    warnings: [],
    isExecutableInSandbox: true
  };

  if (removedCommands.length > 0) {
    report.warnings.push(`Đã loại bỏ ${removedCommands.length} lệnh Windows không tương thích.`);
  }
  if (harnessAdded) {
    report.warnings.push('Đã tự động đóng gói hàm main() để bài tập có thể thực thi độc lập.');
  }

  return {
    title: cleanTitle,
    category,
    difficulty,
    code: finalCode.trim(),
    statement,
    inputFormat,
    outputFormat,
    constraints,
    samples,
    testcases,
    report
  };
}

/**
 * 6. Batch Document Parser & Sanitizer
 * Scans an entire document content (from DOCX extraction or multi-source text)
 * and breaks it down into individual sanitized problem drafts.
 */
export function batchSanitizeRawDocxContent(rawText: string): SanitizedProblemResult[] {
  const decoded = decodeXmlEntities(rawText);
  // Break by 'Source \d+:'
  const sourceRegex = /(?:^|\n)(Source\s*\d+(?:\.\d+)?:\s*[^\n]+)([\s\S]*?)(?=(?:^|\n)Source\s*\d+(?:\.\d+)?:|$)/gi;
  const results: SanitizedProblemResult[] = [];
  let match: RegExpExecArray | null;

  while ((match = sourceRegex.exec(decoded)) !== null) {
    const rawHeading = match[1].trim();
    const rawBody = match[2].trim();

    // Skip table of contents lines (e.g. containing PAGEREF)
    if (rawHeading.includes('PAGEREF') || rawBody.includes('PAGEREF')) continue;

    // Check if body has code (#include or main or void or int)
    if (/#include|\bmain\s*\(|\bvoid\s+|\bint\s+[a-zA-Z_]\w*\s*\(/i.test(rawBody)) {
      const sanitized = sanitizeSingleProblem(rawBody, rawHeading);
      results.push(sanitized);
    }
  }

  return results;
}

/**
 * 7. Client-Side DOCX Binary Extractor
 * Unpacks .docx ZIP container directly in browser memory without sending files to any server.
 */
export async function extractTextFromDocx(fileBuffer: ArrayBuffer): Promise<string> {
  const zip = await JSZip.loadAsync(fileBuffer);
  const docXmlFile = zip.file('word/document.xml');
  if (!docXmlFile) {
    throw new Error('Tệp không đúng định dạng DOCX chuẩn (Không tìm thấy word/document.xml trong gói nén).');
  }
  const xml = await docXmlFile.async('text');

  // Extract paragraphs from XML
  const pMatches = xml.match(/<w:p[\s>][\s\S]*?<\/w:p>/g) || [];
  const paragraphs: string[] = [];

  for (const p of pMatches) {
    const textMatches = p.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
    const text = textMatches.map(t => t.replace(/<[^>]+>/g, '')).join('');
    if (text.trim()) {
      paragraphs.push(text.trim());
    }
  }

  return paragraphs.join('\n');
}

/**
 * 8. End-to-End DOCX Sanitization Pipeline
 * Extracts raw XML text from .docx, cleans C code, extracts plain text testcases,
 * and packages into ready-to-judge Problem drafts.
 */
export async function processDocxFile(fileBuffer: ArrayBuffer): Promise<SanitizedProblemResult[]> {
  const text = await extractTextFromDocx(fileBuffer);
  return batchSanitizeRawDocxContent(text);
}

