import { Problem, ProgressiveHint } from '../types';

/**
 * Resolves 3-tier progressive hints for any problem.
 * Uses explicitly defined hints if present, or dynamically synthesizes
 * high-value pedagogical hints based on domain analysis (Strings, Math, Arrays, Shapes).
 */
export function resolveProgressiveHints(problem: Problem): ProgressiveHint[] {
  if (problem.progressiveHints && problem.progressiveHints.length === 3) {
    return problem.progressiveHints;
  }

  const tags = (problem.tags || []).map(t => t.toLowerCase());
  const category = (problem.category || '').toLowerCase();

  const isString = tags.some(t => /string|char|chuỗi|text|token/i.test(t)) || /chuỗi|xâu|string/i.test(category);
  const isPattern = tags.some(t => /pattern|shape|loop|sao|hình/i.test(t)) || /hình|vòng lặp/i.test(category);
  const isArray = tags.some(t => /array|sort|mảng|pointer|con trỏ/i.test(t)) || /mảng|array/i.test(category);

  // 1. Strings & Characters
  if (isString) {
    return [
      {
        tier: 1,
        title: 'Tư duy duyệt chuỗi & Điểm dừng Null-Terminator (Conceptual)',
        content: `Trong ngôn ngữ C, một chuỗi ký tự bản chất là một mảng \`char\` kết thúc bởi byte đặc biệt mang giá trị 0 (\`'\\0'\`). Để tính độ dài hoặc duyệt chuỗi, bạn dùng con trỏ hoặc vòng lặp: \`while (s[len] != '\\0') len++;\`. Không duyệt cố định bằng số lượng phần tử mảng vì sẽ đọc vào vùng nhớ rác.`
      },
      {
        tier: 2,
        title: 'Cảnh báo bẫy ngầm & Lỗi bộ nhớ C (Trap & Memory Pitfall)',
        content: `1. BẪY SCANF: Lệnh \`scanf("%s", s)\` sẽ dừng đọc ngay khi gặp khoảng trắng đầu tiên. Nếu đề yêu cầu đọc chuỗi có dấu cách, PHẢI dùng \`gets(s)\` hoặc \`fgets(s, sizeof(s), stdin)\`.
2. BẪY TRÀN MẢNG CHAR: Chuỗi có $N$ ký tự thì mảng char phải khai báo kích thước tối thiểu là $N + 1$ để chứa ký tự '\\0'.
3. BẪY CHUẨN HÓA: Khi biến đổi chữ hoa/thường, dùng thư viện \`<ctype.h>\` với \`tolower()\` hoặc \`toupper()\` để tránh sai lệch mã ASCII.`
      },
      {
        tier: 3,
        title: 'Khung mã giả định hướng (Pseudocode Scaffold)',
        content: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main() {
    char s[1005];
    // 1. Đọc dữ liệu cả dòng chứa khoảng trắng
    if (gets(s) == NULL) return 0;
    
    // 2. Tính độ dài chuỗi bằng ký tự '\\0'
    int len = 0;
    while (s[len] != '\\0') len++;
    
    // 3. Thực hiện biến đổi chuỗi
    for (int i = 0; i < len; i++) {
        // [Xử lý logic từng ký tự s[i] tại đây...]
    }
    
    // 4. In kết quả chuẩn xác
    printf("%s\\n", s);
    return 0;
}`
      }
    ];
  }

  // 2. Shape & Star Patterns
  if (isPattern) {
    return [
      {
        tier: 1,
        title: 'Tư duy 2 vòng lặp lồng nhau & Căn lề hình học (Conceptual)',
        content: `Các bài vẽ hình trong C luôn sử dụng 2 vòng lặp \`for\` lồng nhau:
* Vòng lặp ngoài (\`i\` chạy từ $1$ đến $N$): Điều khiển từng dòng (hàng ngang).
* Vòng lặp trong (\`j\` chạy theo cột): Quyết định in khoảng trắng căn lề trước rồi đến các ký tự sao \`*\`.
Tìm công thức toán học liên hệ giữa số khoảng trắng và chỉ số hàng \`i\`.`
      },
      {
        tier: 2,
        title: 'Cảnh báo bẫy ngầm trong phòng thi (Trap Warning)',
        content: `1. BẪY KHOẢNG TRẮNG CUỐI DÒNG: Các hệ thống chấm tự động thường bắt lỗi nghiêm ngặt nếu bạn in dấu cách thừa sau ký tự sao '*' cuối cùng của mỗi dòng.
2. BẪY XUỐNG DÒNG: Luôn đặt lệnh \`printf("\\n");\` ở cuối vòng lặp hàng ngoài, KHÔNG in xuống dòng trong vòng lặp cột trong.
3. BẪY ĐỐI XỨNG: Với hình thoi hoặc tam giác cân, điểm giữa là \`mid = (N + 1) / 2\`. Khoảng cách lệch tâm là \`abs(mid - i)\`.`
      },
      {
        tier: 3,
        title: 'Khung mã giả định hướng (Pseudocode Scaffold)',
        content: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    scanf("%d", &n);
    
    for (int i = 1; i <= n; i++) {
        // 1. In khoảng trắng căn lề trái
        int spaces = /* công thức tính khoảng trắng theo i */;
        for (int s = 0; s < spaces; s++) printf(" ");
        
        // 2. In các ký tự sao '*' hoặc số
        int stars = /* công thức tính số lượng sao theo i */;
        for (int st = 0; st < stars; st++) {
            printf("*");
        }
        
        // 3. Xuống dòng sau mỗi hàng
        printf("\\n");
    }
    return 0;
}`
      }
    ];
  }

  // 3. Array Manipulation & Sorting
  if (isArray) {
    return [
      {
        tier: 1,
        title: 'Tư duy mảng & Hoán vị biến tạm (Conceptual)',
        content: `Mảng trong C lưu các phần tử liên tiếp trong bộ nhớ RAM từ chỉ số $0$ đến $N - 1$.
Khi cần hoán đổi (swap) 2 giá trị $A[i]$ và $A[j]$, bắt buộc phải dùng 1 biến tạm:
\`int temp = a[i]; a[i] = a[j]; a[j] = temp;\`.
Khi cần sắp xếp, thuật toán Bubble Sort duyệt nhiều lượt và so sánh cặp liền kề.`
      },
      {
        tier: 2,
        title: 'Cảnh báo bẫy ngầm & Lỗi bộ nhớ C (Trap & Memory Pitfall)',
        content: `1. BẪY OUT-OF-BOUNDS (Tràn biên): Mảng kích thước $N$ chỉ có chỉ số hợp lệ từ $0$ đến $N - 1$. Truy cập $a[N]$ sẽ gây lỗi Undefined Behavior hoặc Runtime Error (RTE).
2. BẪY SỐ ÂM: Trong C, toán tử \`%\` với số âm có thể trả về số âm (ví dụ: \`-3 % 2 == -1\`). Do đó điều kiện kiểm tra số lẻ an toàn là: \`abs(a[i]) % 2 == 1\` hoặc \`a[i] % 2 != 0\`.
3. BẪY KHỞI TẠO MIN/MAX: Khi tìm Min/Max, gán \`min = a[0]\`, KHÔNG gán \`min = 0\` vì nếu mảng toàn số dương thì min sẽ luôn bị kẹt ở 0.`
      },
      {
        tier: 3,
        title: 'Khung mã giả định hướng (Pseudocode Scaffold)',
        content: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, a[1005];
    if (scanf("%d", &n) != 1) return 0;
    
    // 1. Nhập mảng
    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }
    
    // 2. Duyệt và xử lý mảng
    for (int i = 0; i < n; i++) {
        // [Xử lý logic theo yêu cầu...]
    }
    
    // 3. In mảng kết quả
    for (int i = 0; i < n; i++) {
        printf("%d%s", a[i], (i == n - 1 ? "" : " "));
    }
    printf("\\n");
    return 0;
}`
      }
    ];
  }

  // 4. Math, Primes & Number Theory
  return [
    {
      tier: 1,
      title: 'Tư duy tối ưu hóa thuật toán số học (Conceptual)',
      content: `Khi giải các bài toán số học (Số nguyên tố, ước số chung GCD, số chính phương):
* Kiểm tra số nguyên tố: Chỉ cần lặp đến $\\sqrt{N}$ (dùng điều kiện \`i * i <= n\`), giúp thuật toán đạt độ phức tạp $O(\\sqrt{N})$ thay vì $O(N)$ gây TLE.
* Ước chung lớn nhất $\\gcd(a, b)$: Áp dụng thuật toán Euclid \`while (b != 0) { int r = a % b; a = b; b = r; }\`.`
    },
    {
      tier: 2,
      title: 'Cảnh báo bẫy ngầm trong C (Trap Warning)',
      content: `1. BẪY ÉP KIỂU SỐ THỰC: Trong C, phép chia 2 số nguyên \`a / b\` luôn là phép chia lấy phần nguyên (vd: \`5 / 2 = 2\`). Muốn in số thực (vd: 2.5), bạn PHẢI ép kiểu: \`(float)a / b\` hoặc nhân với \`1.0 * a / b\`.
2. BẪY TRÀN SỐ INT 32-BIT: Bội chung nhỏ nhất $\\text{lcm}(a, b) = (a \\times b) / \\gcd(a, b)$. Tích $a \\times b$ có thể vượt quá $2 \\times 10^9$ gây tràn số âm! Khắc phục: chia trước nhân sau \`(a / gcd) * b\` hoặc ép kiểu sang \`long long\`.
3. BẪY SỐ 1: Số 1 KHÔNG PHẢI là số nguyên tố!`
    },
    {
      tier: 3,
      title: 'Khung mã giả định hướng (Pseudocode Scaffold)',
      content: `#include <stdio.h>
#include <math.h>

// Hàm kiểm tra số nguyên tố chuẩn O(sqrt(N))
int isPrime(long long n) {
    if (n < 2) return 0;
    for (long long i = 2; i * i <= n; i++) {
        if (n % i == 0) return 0;
    }
    return 1;
}

int main() {
    long long n;
    if (scanf("%lld", &n) == 1) {
        if (isPrime(n)) {
            printf("YES\\n");
        } else {
            printf("NO\\n");
        }
    }
    return 0;
}`
    }
  ];
}
