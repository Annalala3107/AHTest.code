import type { Problem } from '../types';

/**
 * Common bilingual translation dictionary for PRF192 Lab Examination Problems
 */
const TITLE_DICTIONARY: [RegExp, string][] = [
  [/đổi vị trí số lẻ lớn nhất và nhỏ nhất/i, 'Swap the Largest and Smallest Odd Numbers'],
  [/hàm kiểm tra năm nhuận/i, 'Check Leap Year Function'],
  [/hàm kiểm tra số amstrong|kiểm tra số armstrong/i, 'Check Armstrong Number (Narcissistic Number)'],
  [/vẽ hình vuông bị rỗng dưới/i, 'Draw Inverted Hollow Square Pattern'],
  [/vẽ hình vuông rỗng|vẽ hình vuông/i, 'Draw Hollow Square Pattern'],
  [/vẽ tam giác cân đối xứng/i, 'Draw Symmetric Isosceles Triangle'],
  [/vẽ tam giác vuông cân rỗng/i, 'Draw Hollow Right-Angled Isosceles Triangle'],
  [/vẽ tam giác vuông ngược/i, 'Draw Inverted Right-Angled Triangle'],
  [/vẽ hình thoi rỗng viền sao/i, 'Draw Hollow Diamond Pattern'],
  [/vẽ tam giác số pascal/i, 'Draw Pascal Triangle Pattern'],
  [/loại bỏ phần tử trùng lặp/i, 'Remove Duplicate Elements in Array'],
  [/sắp xếp nổi bọt|bubble sort/i, 'Bubble Sort Ascending Order Implementation'],
  [/sắp xếp chèn|insertion sort/i, 'Insertion Sort Implementation'],
  [/sắp xếp chọn|selection sort/i, 'Selection Sort Implementation'],
  [/tìm ước số chung lớn nhất|ucln và bcnn/i, 'Find Greatest Common Divisor (GCD) and LCM'],
  [/kiểm tra số nguyên tố|hàm số nguyên tố/i, 'Check Prime Number Function'],
  [/kiểm tra số hoàn hảo|số hoàn hảo/i, 'Check Perfect Number'],
  [/kiểm tra số đối xứng|số palindrome/i, 'Check Palindromic Number'],
  [/đếm số nguyên âm và phụ âm/i, 'Count Vowels and Consonants in String'],
  [/đảo ngược chuỗi ký tự|đảo chuỗi/i, 'Reverse String In-Place'],
  [/chuẩn hóa họ tên|viết hoa chữ cái đầu/i, 'Capitalize and Format Full Name String'],
  [/tính tổng dãy số fibonacci|dãy fibonacci/i, 'Compute Fibonacci Sequence Number'],
  [/tính giai thừa/i, 'Compute Factorial of N'],
  [/ma trận chuyển vị/i, 'Compute Matrix Transpose'],
  [/tích hai ma trận/i, 'Matrix Multiplication'],
  [/đếm số từ trong chuỗi/i, 'Count Words in String'],
  [/tổng các chữ số/i, 'Sum of Digits of Integer']
];

/**
 * Returns translated title in selected language
 */
export function getProblemTitle(problem: Partial<Problem>, lang: 'vi' | 'en'): string {
  if (lang === 'vi') {
    return problem.title || 'Bài tập lập trình';
  }

  if (problem.titleEn && problem.titleEn.trim()) {
    return problem.titleEn;
  }

  const raw = problem.title || '';
  
  // Check dictionary
  for (const [pattern, translation] of TITLE_DICTIONARY) {
    if (pattern.test(raw)) {
      // If it has Source prefix (e.g. "Source 1: ...")
      const srcMatch = raw.match(/^(?:Source\s*(\d+)[:.\s]*)/i);
      if (srcMatch) {
        return `Source ${srcMatch[1]}: ${translation}`;
      }
      return translation;
    }
  }

  // Default fallback for Source problems
  const srcMatch = raw.match(/^(?:Source\s*(\d+)[:.\s]*)(.*)/i);
  if (srcMatch) {
    return `Source ${srcMatch[1]}: PRF192 Practical Problem ${srcMatch[1]}`;
  }

  return raw || 'Coding Challenge';
}

/**
 * Returns statement text in selected language with reliable fallback
 */
export function getProblemStatement(problem: Partial<Problem>, lang: 'vi' | 'en'): string {
  if (lang === 'en') {
    if (problem.statementEn && problem.statementEn.trim()) {
      return problem.statementEn;
    }

    if (problem.statement && problem.statement.trim()) {
      // Translate standard PRF192 boilerplate to English
      let statement = problem.statement;
      statement = statement.replace(/### Bài toán: (.*)/g, (_, title) => {
        return `### Problem: ${getProblemTitle({ title }, 'en')}`;
      });
      statement = statement.replace(
        /Viết chương trình C giải quyết bài toán theo chuẩn khảo thí PRF192\./g,
        'Write a complete C program to solve this problem according to standard PRF192 practical exam requirements.'
      );
      statement = statement.replace(/\*\*Yêu cầu kỹ thuật:\*\*/g, '**Technical Specifications:**');
      statement = statement.replace(/- Mã nguồn tuân thủ tiêu chuẩn C11\/C17\./g, '- Source code must strictly comply with C11/C17 standards.');
      statement = statement.replace(
        /- Không dùng các lệnh điều khiển màn hình như `system\("cls"\)` hay `system\("pause"\)`\./g,
        '- Do not invoke non-portable system calls like `system("cls")` or `system("pause")`.'
      );
      statement = statement.replace(
        /- Đảm bảo in đúng định dạng kết quả ra `stdout` để hệ thống tự động chấm điểm\./g,
        '- Print precise formatted output to `stdout` for automated test case evaluation.'
      );
      statement = statement.replace(/Cho số nguyên dương/g, 'Given a positive integer');
      statement = statement.replace(/Cho dãy/g, 'Given an array of');
      statement = statement.replace(/Hãy vẽ một hình/g, 'Draw a geometric shape of');
      statement = statement.replace(/Hãy in ra/g, 'Print out');

      return statement;
    }

    // Fallback if statement is empty or blank
    const enTitle = getProblemTitle(problem, 'en');
    const cat = (problem.category || '').toLowerCase();
    let categoryGuideEn = 'Analyze the sample test cases below, determine input parameters from `stdin`, and print the exact expected format to `stdout`.';
    if (cat.includes('hình') || cat.includes('shape') || cat.includes('pattern')) {
      categoryGuideEn = 'Use nested loops (for/while) to print the corresponding geometric character matrix based on input dimension N from `stdin`.';
    } else if (cat.includes('mảng') || cat.includes('array') || cat.includes('sort')) {
      categoryGuideEn = 'Process an array of integers: read dimension N, input elements, filter, transform or sort elements in ascending/descending order.';
    } else if (cat.includes('chuỗi') || cat.includes('string')) {
      categoryGuideEn = 'Manipulate character arrays (strings): ensure proper null-terminator `\\0` handling and avoid reading out of allocated memory bounds.';
    } else if (cat.includes('số') || cat.includes('math')) {
      categoryGuideEn = 'Implement standard mathematical algorithms or number-theoretic checks (e.g. prime numbers, Armstrong, palindrome, GCD/LCM) with fast runtime complexity.';
    }

    return `### Problem: ${enTitle}

Write an optimized C program to solve this challenge according to official PRF192 practical examination requirements.

**Algorithmic Objectives:**
- ${categoryGuideEn}

**Technical Specifications:**
- Comply strictly with GCC C11/C17 compiler standards.
- Read input from \`stdin\` and output the exact requested format to \`stdout\`.
- Handle corner cases (e.g. edge values, zero or negative numbers, trailing whitespace).`;
  }

  // Vietnamese Mode
  if (problem.statement && problem.statement.trim()) {
    return problem.statement;
  }

  // Fallback for Vietnamese if statement is empty
  const viTitle = problem.title || 'Bài tập PRF192';
  const cat = (problem.category || '').toLowerCase();
  let categoryGuideVi = 'Quan sát các ca kiểm thử mẫu bên dưới, đọc chính xác các tham số từ `stdin` và in kết quả đúng định dạng ra `stdout`.';
  if (cat.includes('hình') || cat.includes('shape') || cat.includes('pattern')) {
    categoryGuideVi = 'Sử dụng các vòng lặp lồng nhau (for/while) để vẽ hình ma trận ký tự tương ứng dựa trên kích thước N nhập từ bàn phím.';
  } else if (cat.includes('mảng') || cat.includes('array') || cat.includes('sort')) {
    categoryGuideVi = 'Xử lý mảng số nguyên: đọc số lượng phần tử N, nạp các phần tử, tiến hành duyệt, lọc điều kiện hoặc sắp xếp theo thứ tự yêu cầu.';
  } else if (cat.includes('chuỗi') || cat.includes('string')) {
    categoryGuideVi = 'Xử lý chuỗi ký tự: chú ý ký tự kết thúc chuỗi `\\0` trong ngôn ngữ C và tránh truy cập ngoài phạm vi bộ nhớ đã cấp phát.';
  } else if (cat.includes('số') || cat.includes('math')) {
    categoryGuideVi = 'Triển khai thuật toán số học hoặc kiểm tra tính chất số đặc biệt (số nguyên tố, Amstrong, đối xứng, UCLN/BCNN) tối ưu thời gian.';
  }

  return `### Yêu Cầu Bài Toán: ${viTitle}

Viết chương trình C hoàn chỉnh để giải quyết bài toán theo chuẩn khảo thí môn Lập trình C (PRF192).

**Định hướng thuật toán:**
- ${categoryGuideVi}

**Yêu cầu kỹ thuật:**
- Mã nguồn tuân thủ tiêu chuẩn trình biên dịch GCC C11/C17.
- Đọc dữ liệu từ \`stdin\` và in đúng định dạng kết quả ra \`stdout\` theo các testcases kiểm thử.
- Không dùng các lệnh dừng màn hình không tương thích như \`system("cls")\` hay \`system("pause")\`.`;
}

export function isGenericFormat(str?: string): boolean {
  if (!str || !str.trim()) return true;
  const s = str.trim().toLowerCase();
  return s.includes('dữ liệu đầu vào chuẩn từ stdin') ||
         s.includes('dữ liệu đầu vào chuẩn từ bàn phím') ||
         s.includes('dữ liệu đầu vào chuẩn') ||
         s.includes('kết quả in ra stdout theo đúng định dạng') ||
         s.includes('kết quả in ra màn hình (stdout)') ||
         s.includes('kết quả in ra stdout') ||
         s.includes('theo chuẩn đề bài') ||
         s.includes('standard input data from stdin') ||
         s.includes('standard input from stdin') ||
         s.includes('print formatted result to stdout') ||
         s.includes('print formatted output to stdout') ||
         s.includes('thời gian thực thi tối đa: 1.0') ||
         s.includes('thời gian thực thi: 1.0') ||
         s.includes('thời gian thực thi tối đa') ||
         (s.includes('1.0s') && s.includes('128mb')) ||
         (s.includes('1.0 giây') && s.includes('128mb'));
}

export function detectProblemDomain(problem: Partial<Problem>): 'array' | 'shape' | 'string' | 'math' {
  const cat = (problem.category || '').toLowerCase();
  const title = (problem.title || '').toLowerCase();
  const tags = (problem.tags || []).map(t => t.toLowerCase()).join(' ');

  if (
    cat.includes('mảng') || cat.includes('array') || cat.includes('sort') ||
    title.includes('mảng') || title.includes('dãy') || title.includes('sắp xếp') ||
    title.includes('đổi vị trí') || title.includes('hoán đổi') || title.includes('phần tử') ||
    tags.includes('array') || tags.includes('sort')
  ) {
    return 'array';
  }

  if (
    cat.includes('hình') || cat.includes('shape') || cat.includes('pattern') ||
    title.includes('vẽ') || title.includes('hình') || title.includes('tam giác') ||
    title.includes('vuông') || title.includes('ngôi nhà') || title.includes('bình hành') ||
    title.includes('thoi') || title.includes('kim cương') || tags.includes('shape')
  ) {
    return 'shape';
  }

  if (
    cat.includes('chuỗi') || cat.includes('string') || cat.includes('con trỏ') ||
    title.includes('chuỗi') || title.includes('xâu') || title.includes('string') ||
    title.includes('ký tự') || title.includes('từ') || title.includes('ascii') ||
    tags.includes('string')
  ) {
    return 'string';
  }

  return 'math';
}

/**
 * Returns input format in selected language with fallback
 */
export function getProblemInputFormat(problem: Partial<Problem>, lang: 'vi' | 'en'): string {
  if (lang === 'en') {
    if (problem.inputFormatEn && problem.inputFormatEn.trim() && !isGenericFormat(problem.inputFormatEn)) {
      return problem.inputFormatEn;
    }
    if (problem.inputFormat && problem.inputFormat.trim() && !isGenericFormat(problem.inputFormat)) {
      let text = problem.inputFormat;
      text = text.replace(/Một dòng duy nhất chứa/g, 'A single line containing');
      text = text.replace(/Dòng đầu tiên chứa/g, 'The first line contains');
      text = text.replace(/Dòng thứ hai chứa/g, 'The second line contains');
      text = text.replace(/số nguyên dương/g, 'positive integers');
      text = text.replace(/số nguyên/g, 'integers');
      return text;
    }

    const domain = detectProblemDomain(problem);
    if (domain === 'array') {
      return 'Line 1: A positive integer $N$ ($1 \\le N \\le 1000$) — the number of elements in the array.\nLine 2: $N$ space-separated integers representing the array elements.';
    }
    if (domain === 'shape') {
      return 'A single line containing a positive integer $N$ ($1 \\le N \\le 50$) — dimension or height of the geometric pattern.';
    }
    if (domain === 'string') {
      return 'A single line containing string $S$ ($1 \\le |S| \\le 1000$) to be processed, terminated by a newline.';
    }
    const sampleInput = problem.samples?.[0]?.input?.trim() || '';
    if (sampleInput.includes(' ') && !sampleInput.includes('\n')) {
      return 'A single line containing two space-separated integers $a, b$ ($1 \\le a, b \\le 10^7$).';
    }
    return 'A single line containing an integer $N$ ($1 \\le N \\le 10^7$).';
  }

  // Vietnamese
  if (problem.inputFormat && problem.inputFormat.trim() && !isGenericFormat(problem.inputFormat)) {
    return problem.inputFormat;
  }

  const domain = detectProblemDomain(problem);
  if (domain === 'array') {
    return 'Dòng 1: Số nguyên dương $N$ ($1 \\le N \\le 1000$) — số lượng phần tử của mảng.\nDòng 2: $N$ số nguyên cách nhau bởi dấu cách biểu diễn các phần tử của mảng.';
  }
  if (domain === 'shape') {
    return 'Một dòng duy nhất chứa số nguyên dương $N$ ($1 \\le N \\le 50$) — kích thước cạnh hoặc chiều cao của hình cần vẽ.';
  }
  if (domain === 'string') {
    return 'Một dòng chứa chuỗi ký tự $S$ ($1 \\le |S| \\le 1000$) cần xử lý, kết thúc bởi ký tự xuống dòng.';
  }
  const sampleInput = problem.samples?.[0]?.input?.trim() || '';
  if (sampleInput.includes(' ') && !sampleInput.includes('\n')) {
    return 'Một dòng duy nhất chứa hai số nguyên $a, b$ ($1 \\le a, b \\le 10^7$) cách nhau bởi dấu cách.';
  }
  return 'Một dòng duy nhất chứa số nguyên dương $N$ ($1 \\le N \\le 10^7$).';
}

/**
 * Returns output format in selected language with fallback
 */
export function getProblemOutputFormat(problem: Partial<Problem>, lang: 'vi' | 'en'): string {
  if (lang === 'en') {
    if (problem.outputFormatEn && problem.outputFormatEn.trim() && !isGenericFormat(problem.outputFormatEn)) {
      return problem.outputFormatEn;
    }
    if (problem.outputFormat && problem.outputFormat.trim() && !isGenericFormat(problem.outputFormat)) {
      let text = problem.outputFormat;
      text = text.replace(/In ra một số nguyên duy nhất/g, 'Print a single integer');
      text = text.replace(/In ra/g, 'Print');
      return text;
    }

    const domain = detectProblemDomain(problem);
    const title = (problem.title || '').toLowerCase();
    if (domain === 'shape') {
      return 'Print the corresponding pattern composed of `*` or digits according to the rules, each row separated by a newline. No trailing spaces.';
    }
    if (domain === 'array') {
      if (title.includes('sắp xếp') || title.includes('đổi vị trí') || title.includes('hoán đổi') || title.includes('đảo ngược') || title.includes('xóa')) {
        return 'Print the array elements after transformation on a single line, separated by a single space.';
      }
      return 'Print a single integer representing the calculated answer.';
    }
    if (domain === 'string') {
      if (title.includes('đếm') || title.includes('độ dài')) {
        return 'Print a single integer representing the counted characters or words.';
      }
      return 'Print the processed string on a separate line.';
    }
    if (title.includes('kiểm tra') || title.includes('check') || title.includes('năm nhuận') || title.includes('nguyên tố') || title.includes('chính phương') || title.includes('amstrong')) {
      return 'Print the verification result (`1` if true, `0` if false; or `YES`/`NO` matching sample format).';
    }
    return 'Print a single integer representing the calculated answer.';
  }

  // Vietnamese
  if (problem.outputFormat && problem.outputFormat.trim() && !isGenericFormat(problem.outputFormat)) {
    return problem.outputFormat;
  }

  const domain = detectProblemDomain(problem);
  const title = (problem.title || '').toLowerCase();
  if (domain === 'shape') {
    return 'In ra hình vẽ tương ứng gồm các ký tự sao `*` hoặc số theo đúng quy luật, mỗi dòng cách nhau bởi ký tự xuống dòng. Không in khoảng trắng thừa ở cuối dòng.';
  }
  if (domain === 'array') {
    if (title.includes('sắp xếp') || title.includes('đổi vị trí') || title.includes('hoán đổi') || title.includes('đảo ngược') || title.includes('xóa') || title.includes('bình phương')) {
      return 'In ra các phần tử của mảng sau khi xử lý trên một dòng, cách nhau bởi một khoảng trắng.';
    }
    return 'In ra một số nguyên duy nhất là kết quả tính toán của bài toán.';
  }
  if (domain === 'string') {
    if (title.includes('đếm') || title.includes('độ dài')) {
      return 'In ra một số nguyên duy nhất là số lượng ký tự hoặc từ đếm được.';
    }
    return 'In ra chuỗi ký tự sau khi xử lý ra màn hình trên một dòng riêng biệt.';
  }
  if (title.includes('kiểm tra') || title.includes('check') || title.includes('năm nhuận') || title.includes('nguyên tố') || title.includes('chính phương') || title.includes('amstrong') || title.includes('đối xứng')) {
    return 'In ra kết quả kiểm tra (ví dụ: `1` nếu thỏa mãn, `0` nếu không thỏa mãn; hoặc `YES`/`NO` theo mẫu kiểm thử).';
  }
  return 'In ra một số nguyên duy nhất là kết quả tính toán của bài toán.';
}

/**
 * Returns constraints in selected language with fallback
 */
export function getProblemConstraints(problem: Partial<Problem>, lang: 'vi' | 'en'): string {
  if (lang === 'en') {
    if (problem.constraintsEn && problem.constraintsEn.trim() && !isGenericFormat(problem.constraintsEn)) {
      return problem.constraintsEn;
    }
    if (problem.constraints && problem.constraints.trim() && !isGenericFormat(problem.constraints)) {
      let text = problem.constraints;
      text = text.replace(/Thời gian thực thi tối đa:\s*([\d.]+)s/g, 'Time limit: $1s');
      text = text.replace(/Bộ nhớ:\s*(\d+)MB/g, 'Memory limit: $1MB');
      return text;
    }

    const domain = detectProblemDomain(problem);
    if (domain === 'array') {
      return '$1 \\le N \\le 1000$; each element $-10^5 \\le A_i \\le 10^5$. Time limit: $1.0\\text{s}$, memory: $128\\text{MB}$.';
    }
    if (domain === 'shape') {
      return '$1 \\le N \\le 50$. Time limit: $1.0\\text{s}$, memory: $128\\text{MB}$. No trailing spaces at the end of lines.';
    }
    if (domain === 'string') {
      return 'String length $1 \\le |S| \\le 1000$. Printable ASCII characters. Time limit: $1.0\\text{s}$, memory: $128\\text{MB}$.';
    }
    return '$1 \\le N \\le 10^7$ (or standard 32-bit integer). Time limit: $1.0\\text{s}$, memory: $128\\text{MB}$.';
  }

  // Vietnamese
  if (problem.constraints && problem.constraints.trim() && !isGenericFormat(problem.constraints)) {
    return problem.constraints;
  }

  const domain = detectProblemDomain(problem);
  if (domain === 'array') {
    return '$1 \\le N \\le 1000$; mỗi phần tử mảng $-10^5 \\le A_i \\le 10^5$. Giới hạn thời gian: $1.0\\text{s}$, bộ nhớ: $128\\text{MB}$.';
  }
  if (domain === 'shape') {
    return '$1 \\le N \\le 50$. Giới hạn thời gian: $1.0\\text{s}$, bộ nhớ: $128\\text{MB}$. Không in khoảng trắng thừa ở cuối dòng.';
  }
  if (domain === 'string') {
    return 'Độ dài chuỗi $1 \\le |S| \\le 1000$. Ký tự thuộc bảng mã ASCII tiêu chuẩn (từ $32$ đến $126$). Giới hạn thời gian: $1.0\\text{s}$, bộ nhớ: $128\\text{MB}$.';
  }
  return '$1 \\le N \\le 10^7$ (hoặc số nguyên 32-bit). Giới hạn thời gian: $1.0\\text{s}$, bộ nhớ: $128\\text{MB}$.';
}
