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

/**
 * Returns input format in selected language with fallback
 */
export function getProblemInputFormat(problem: Partial<Problem>, lang: 'vi' | 'en'): string {
  if (lang === 'en') {
    if (problem.inputFormatEn && problem.inputFormatEn.trim()) return problem.inputFormatEn;
    if (problem.inputFormat && problem.inputFormat.trim()) {
      let text = problem.inputFormat;
      text = text.replace(/Một dòng duy nhất chứa/g, 'A single line containing');
      text = text.replace(/Dữ liệu đầu vào chuẩn từ stdin theo từng dòng\./g, 'Standard input data from stdin on separate lines.');
      text = text.replace(/Dòng đầu tiên chứa/g, 'The first line contains');
      text = text.replace(/Dòng thứ hai chứa/g, 'The second line contains');
      text = text.replace(/số nguyên dương/g, 'positive integers');
      text = text.replace(/số nguyên/g, 'integers');
      return text;
    }
    return 'Standard input from stdin as specified in the problem statement.';
  }

  return problem.inputFormat || 'Dữ liệu đầu vào chuẩn từ bàn phím (stdin) theo từng dòng.';
}

/**
 * Returns output format in selected language with fallback
 */
export function getProblemOutputFormat(problem: Partial<Problem>, lang: 'vi' | 'en'): string {
  if (lang === 'en') {
    if (problem.outputFormatEn && problem.outputFormatEn.trim()) return problem.outputFormatEn;
    if (problem.outputFormat && problem.outputFormat.trim()) {
      let text = problem.outputFormat;
      text = text.replace(/Kết quả in ra stdout theo đúng định dạng kiểm thử\./g, 'Print formatted result to stdout matching the test specification.');
      text = text.replace(/In ra một số nguyên duy nhất/g, 'Print a single integer');
      text = text.replace(/In ra/g, 'Print');
      return text;
    }
    return 'Print formatted output to stdout matching expected sample output.';
  }

  return problem.outputFormat || 'Kết quả in ra màn hình (stdout) theo đúng định dạng kiểm thử.';
}

/**
 * Returns constraints in selected language with fallback
 */
export function getProblemConstraints(problem: Partial<Problem>, lang: 'vi' | 'en'): string {
  if (lang === 'en') {
    if (problem.constraintsEn && problem.constraintsEn.trim()) return problem.constraintsEn;
    if (problem.constraints && problem.constraints.trim()) {
      let text = problem.constraints;
      text = text.replace(/Thời gian thực thi tối đa:\s*([\d.]+)s/g, 'Time limit: $1s');
      text = text.replace(/Bộ nhớ:\s*(\d+)MB/g, 'Memory limit: $1MB');
      return text;
    }
    return 'Time limit: 1.0s • Memory limit: 128MB • GCC C11/C17 Sandbox';
  }

  return problem.constraints || 'Thời gian thực thi: 1.0s • Bộ nhớ tối đa: 128MB • GCC C11/C17 Sandbox';
}
