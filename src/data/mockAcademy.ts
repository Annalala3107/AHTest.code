import { AcademyCourse } from '../types';

export const mockCourses: AcademyCourse[] = [
  {
    id: 'c-fundamentals',
    slug: 'c-dev-cpp',
    title: 'Ngôn Ngữ C Chuẩn Dev-C++ (Embarcadero Dev-Cpp & GCC)',
    language: 'c',
    level: 'Beginner',
    description: 'Khoá học lập trình ngôn ngữ C căn bản đến nâng cao theo chuẩn môi trường Embarcadero Dev-C++ (TDM-GCC). Tối ưu cho sinh viên nhập môn Kỹ thuật lập trình và học sinh THPT.',
    totalLessons: 10,
    estimatedHours: 4,
    modules: [
      {
        id: 'c-mod-1',
        title: 'Chương 1: Cấu Trúc Ngôn Ngữ C & Nhập Xuất Chuẩn stdio.h',
        description: 'Làm quen với cú pháp C chuẩn ANSI/C17, hàm printf, scanf và cấu hình Dev-C++.',
        lessons: [
          {
            id: 'c-1-1',
            title: 'Bài 1: Khung chương trình C chuẩn Dev-C++ & printf()',
            durationMinutes: 5,
            summary: 'Cấu trúc file mã nguồn C kinh điển trong Dev-C++, thư viện stdio.h và hàm printf.',
            content: `### 1. Khung chương trình C trong Dev-C++
[Embarcadero Dev-C++](https://github.com/Embarcadero/Dev-Cpp) là IDE mã nguồn mở nổi tiếng sử dụng trình biên dịch MinGW / TDM-GCC. Mọi chương trình C tiêu chuẩn đều bắt đầu với:

\`\`\`c
#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("Chao mung ban den voi AHtest.code!\n");
    return 0;
}
\`\`\`

> [!NOTE]
> Trong ngôn ngữ C thuần, chúng ta dùng thư viện \`<stdio.h>\` và hàm \`printf()\` thay cho \`std::cout\` của C++.

### 2. Nhiệm vụ của bạn:
Hãy hoàn thiện chương trình C bên cạnh để in ra chính xác dòng chữ:
\`Hello Dev-Cpp & AHtest.code!\`
kèm theo một ký tự xuống dòng (\`\\n\`).`,
            initialCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // TODO: Dùng printf() in ra: Hello Dev-Cpp & AHtest.code!
    
    return 0;
}`,
            solutionCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("Hello Dev-Cpp & AHtest.code!\n");
    return 0;
}`,
            hints: [
              'Sử dụng lệnh `printf("Hello Dev-Cpp & AHtest.code!\\n");`',
              'Đừng quên dấu chấm phẩy `;` ở cuối câu lệnh.'
            ],
            testcases: [
              { input: '', expectedOutput: 'Hello Dev-Cpp & AHtest.code!' }
            ]
          },
          {
            id: 'c-1-2',
            title: 'Bài 2: Nhập dữ liệu định dạng với scanf()',
            durationMinutes: 7,
            summary: 'Làm chủ định dạng %d, %f, %s và toán tử lấy địa chỉ & trong hàm scanf.',
            content: `### 1. Hàm scanf() và toán tử địa chỉ \`&\`
Trong ngôn ngữ C, để đọc dữ liệu từ bàn phím, ta truyền **địa chỉ ô nhớ** của biến vào hàm \`scanf()\`:
\`\`\`c
int a, b;
// Truyền địa chỉ &a và &b
scanf("%d %d", &a, &b);
printf("Tong = %d\n", a + b);
\`\`\`

> [!WARNING]
> Quên dấu \`&\` trước tên biến trong \`scanf()\` là lỗi phổ biến nhất khiến chương trình bị crash (Segmentation Fault / Runtime Error)!

### 2. Thử thách:
Nhập vào 2 số nguyên $A$ và $B$. Tính và in ra tổng của chúng theo định dạng:
\`Tong = <gia_tri>\``,
            initialCode: `#include <stdio.h>

int main() {
    int a, b;
    // Nhập a, b và in ra: Tong = <ket_qua>
    
    return 0;
}`,
            solutionCode: `#include <stdio.h>

int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) == 2) {
        printf("Tong = %d\n", a + b);
    }
    return 0;
}`,
            hints: [
              'Sử dụng `scanf("%d %d", &a, &b);`',
              'In ra bằng `printf("Tong = %d\\n", a + b);`'
            ],
            testcases: [
              { input: '15 25', expectedOutput: 'Tong = 40' },
              { input: '100 -30', expectedOutput: 'Tong = 70' }
            ]
          },
          {
            id: 'c-1-3',
            title: 'Bài 3: Con trỏ (Pointers) & Bộ nhớ động (malloc / free)',
            durationMinutes: 10,
            summary: 'Trọng tâm của ngôn ngữ C: Hiểu bản chất con trỏ, toán tử giải tham chiếu * và cấp phát vùng nhớ động trên Heap.',
            content: `### 1. Con trỏ trong C
Con trỏ là biến lưu trữ địa chỉ của một biến khác:
\`\`\`c
int x = 42;
int *ptr = &x; // ptr chứa địa chỉ của x
printf("Gia tri: %d, Dia chi: %p\n", *ptr, (void*)ptr);
\`\`\`

### 2. Cấp phát động với \`malloc()\`
\`\`\`c
int *arr = (int*)malloc(n * sizeof(int));
// Luôn giải phóng vùng nhớ sau khi sử dụng:
free(arr);
\`\`\`

### 3. Nhiệm vụ:
Khai báo một con trỏ kiểu \`int*\`, trỏ tới biến \`val = 100\`, thay đổi giá trị của \`val\` thông qua con trỏ thành \`999\` và in ra giá trị mới của \`val\`.`,
            initialCode: `#include <stdio.h>

int main() {
    int val = 100;
    int *p = &val;
    
    // TODO: Gán giá trị 999 thông qua con trỏ *p
    
    printf("%d\n", val);
    return 0;
}`,
            solutionCode: `#include <stdio.h>

int main() {
    int val = 100;
    int *p = &val;
    *p = 999;
    printf("%d\n", val);
    return 0;
}`,
            hints: [
              'Dùng toán tử giải tham chiếu: `*p = 999;`'
            ],
            testcases: [
              { input: '', expectedOutput: '999' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cpp-fundamentals',
    slug: 'cpp-chuyen-tin',
    title: 'C++ Chuyên Tin: Từ Số 0 Đến Thuật Toán',
    language: 'cpp',
    level: 'Beginner',
    description: 'Khoá học tương tác thực chiến dành riêng cho học sinh chuyên Tin và sinh viên nhập môn. Không nhồi nhét lý thuyết suông: mỗi bài học chỉ 3 phút lý thuyết kèm 1 thử thách gõ code trực tiếp trên trình duyệt!',
    totalLessons: 12,
    estimatedHours: 4,
    modules: [
      {
        id: 'mod-1',
        title: 'Chương 1: Cấu Trúc Cơ Bản & Nhập Xuất Nhanh',
        description: 'Làm chủ cú pháp C++20 và kỹ thuật I/O FastIO tối quan trọng trong các kỳ thi.',
        lessons: [
          {
            id: 'cpp-1-1',
            title: 'Bài 1: Khung chương trình & Fast I/O',
            durationMinutes: 5,
            summary: 'Tìm hiểu hàm main() và kỹ thuật tắt đồng bộ luồng cin/cout để tránh lỗi TLE.',
            content: `### 1. Khung chương trình chuẩn thi đấu
Mọi bài thi lập trình C++ hiện đại đều bắt đầu bằng khung cơ bản sau:
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    // Tối ưu nhập xuất bắt buộc
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    cout << "Chao mung den voi AHtest.code!\n";
    return 0;
}
\`\`\`

> [!TIP]
> Luôn dùng \`'\\n'\` thay vì \`endl\` vì \`endl\` ép hệ điều hành flush buffer liên tục, có thể làm chương trình chạy chậm hơn tới 10 lần và dính TLE!

### 2. Nhiệm vụ của bạn:
Hãy viết chương trình in ra chính xác dòng chữ:
\`AHtest.code Academy 2026\`
kèm theo một ký tự xuống dòng.`,
            initialCode: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // TODO: In ra dòng chữ "AHtest.code Academy 2026"
    
    return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    cout << "AHtest.code Academy 2026\n";
    return 0;
}`,
            hints: [
              'Sử dụng lệnh `cout << "AHtest.code Academy 2026\\n";`',
              'Đảm bảo chữ hoa chữ thường chính xác từng ký tự.'
            ],
            testcases: [
              { input: '', expectedOutput: 'AHtest.code Academy 2026' }
            ]
          },
          {
            id: 'cpp-1-2',
            title: 'Bài 2: Kiểu dữ liệu & Bẫy tràn số (Integer Overflow)',
            durationMinutes: 7,
            summary: 'Hiểu rõ giới hạn của int (2.1 tỷ) và khi nào bắt buộc phải dùng long long (9 x 10^18).',
            content: `### 1. Bẫy tràn số $32$-bit
Kiểu \`int\` trong C++ thường có $32$ bit, chỉ chứa được giá trị trong khoảng:
$$-2^{31} \\le x \\le 2^{31}-1 \\approx [-2 \\times 10^9, 2 \\times 10^9]$$

Nếu một phép nhân $a \\times b$ với $a = 10^6, b = 10^6$, kết quả là $10^{12} > 2 \\times 10^9$, dẫn đến hiện tượng **Integer Overflow (Tràn số)** và sinh ra số âm!

### 2. Giải pháp: Kiểu \`long long\`
Dùng \`long long\` cho các giá trị lên tới $9 \\times 10^{18}$:
\`\`\`cpp
long long a, b;
cin >> a >> b;
long long ans = a * b;
cout << ans << "\\n";
\`\`\`

### 3. Nhiệm vụ của bạn:
Đọc vào 2 số nguyên $A$ và $B$ ($1 \\le A, B \\le 10^9$). In ra tích $A \\times B$. 
Chú ý: Bạn **bắt buộc** phải dùng kiểu \`long long\`.`,
            initialCode: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    long long a, b;
    // Đọc a và b, sau đó in ra tích a * b
    
    return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long a, b;
    if (cin >> a >> b) {
        cout << a * b << "\n";
    }
    return 0;
}`,
            hints: [
              'Nhập dữ liệu bằng `cin >> a >> b;`',
              'Xuất kết quả bằng `cout << (a * b) << "\\n";`'
            ],
            testcases: [
              { input: '1000000 2000000', expectedOutput: '2000000000000' },
              { input: '5 7', expectedOutput: '35' }
            ]
          },
          {
            id: 'cpp-1-3',
            title: 'Bài 3: Mảng cộng dồn (Prefix Sum)',
            durationMinutes: 8,
            summary: 'Trả lời truy vấn tổng đoạn con [L, R] trong độ phức tạp O(1).',
            content: `### 1. Thuật toán Prefix Sum
Cho mảng $A$ gồm $N$ phần tử. Ta cần trả lời nhiều truy vấn tính tổng từ vị trí $L$ đến $R$:
$$S(L, R) = \\sum_{i=L}^R A_i$$

Nếu dùng vòng lặp \`for\` cho mỗi truy vấn, độ phức tạp là $O(N)$ mỗi truy vấn -> TLE nếu có $Q = 10^5$ truy vấn.
Ta xây dựng mảng cộng dồn $P$ với:
$$P[i] = P[i-1] + A[i]$$
Khi đó tổng đoạn $[L, R]$ được tính ngay lập tức:
$$S(L, R) = P[R] - P[L - 1]$$

### 2. Thử thách:
Đọc vào mảng $N$ số. Tính mảng cộng dồn và in ra tổng của cả dãy.`,
            initialCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    long long sum = 0;
    for (int i = 0; i < n; ++i) {
        long long x;
        cin >> x;
        sum += x;
    }
    cout << sum << "\n";
    return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        long long sum = 0;
        for (int i = 0; i < n; ++i) {
            long long x;
            cin >> x;
            sum += x;
        }
        cout << sum << "\n";
    }
    return 0;
}`,
            hints: [
              'Đọc N trước, sau đó duyệt vòng lặp N lần để cộng dồn giá trị.'
            ],
            testcases: [
              { input: '5\n1 2 3 4 5', expectedOutput: '15' },
              { input: '3\n10 20 30', expectedOutput: '60' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'python-cp',
    slug: 'python-chuyen-tin',
    title: 'Python Siêu Tốc Cho Lập Trình Thi Đấu',
    language: 'python',
    level: 'Beginner',
    description: 'Bí kíp sử dụng Python hiệu quả trong các kỳ thi Tin học trẻ, Olympic Sinh viên và ICPC mà không lo bị dính TLE.',
    totalLessons: 8,
    estimatedHours: 3,
    modules: [
      {
        id: 'py-mod-1',
        title: 'Chương 1: Fast I/O & Xử Lý Chuỗi Siêu Tốc',
        description: 'Tăng tốc đọc ghi dữ liệu gấp 5 lần so với hàm input() mặc định.',
        lessons: [
          {
            id: 'py-1-1',
            title: 'Bài 1: Thay thế input() bằng sys.stdin.readline',
            durationMinutes: 5,
            summary: 'Lý do hàm input() của Python gây TLE trên Online Judge và cách khắc phục.',
            content: `### 1. Vấn đề của \`input()\`
Hàm \`input()\` trong Python thực hiện thêm bước xóa ký tự \`\\n\` và kiểm tra buffer tương tác, khiến nó rất chậm khi số lượng dòng lên tới $10^5$.

Thay vào đó, trong CP ta luôn import \`sys\`:
\`\`\`python
import sys
input = sys.stdin.readline

# Đọc nhiều số trên 1 dòng
a, b = map(int, input().split())
print(a + b)
\`\`\`

### 2. Nhiệm vụ:
Nhập vào 2 số nguyên $A$ và $B$. In ra tổng $A + B$.`,
            initialCode: `import sys
input = sys.stdin.readline

def solve():
    # Nhập a và b từ input() và in ra tổng
    pass

if __name__ == '__main__':
    solve()`,
            solutionCode: `import sys
input = sys.stdin.readline

def solve():
    line = input().strip()
    if line:
        a, b = map(int, line.split())
        print(a + b)

if __name__ == '__main__':
    solve()`,
            hints: [
              'Dùng `a, b = map(int, input().split())`',
              'In ra `print(a + b)`'
            ],
            testcases: [
              { input: '12 34', expectedOutput: '46' },
              { input: '999999999 1', expectedOutput: '1000000000' }
            ]
          }
        ]
      }
    ]
  }
];
