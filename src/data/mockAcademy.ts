import { AcademyCourse } from '../types';
import { fptuAppliedExercises } from './fptuAppliedExercises';
import { academyEnTranslations } from './academyTranslations';

export const mockCourses: AcademyCourse[] = [
  {
    id: 'c-curriculum',
    slug: 'c-dev-cpp-full',
    title: 'Giáo Trình C/C++ Toàn Diện (Cơ Bản Đến Trung Cấp)',
    titleEn: 'Comprehensive C/C++ Curriculum (Beginner to Intermediate)',
    language: 'c',
    level: 'Beginner',
    description: 'Giáo trình chuẩn mực 2 giai đoạn: Giai đoạn 1 (Nền tảng lập trình & Giao tiếp với máy tính) và Giai đoạn 2 (Quản lý bộ nhớ, Con trỏ & Cấu trúc dữ liệu) theo môi trường Embarcadero Dev-C++ / GCC.',
    descriptionEn: 'Comprehensive 2-stage curriculum: Stage 1 (Core Programming & System I/O) and Stage 2 (Memory Management, Pointers & Advanced Structs) based on Embarcadero Dev-C++ / GCC.',
    totalLessons: 14,
    estimatedHours: 8,
    modules: [
      {
        id: 'c-giai-doan-1',
        title: 'Giai Đoạn 1: Nền Tảng Lập Trình & Giao Tiếp Máy Tính',
        titleEn: 'Stage 1: Core Programming & System I/O',
        description: 'Quá trình biên dịch 4 bước, bộ nhớ RAM, biến, kiểu dữ liệu, rẽ nhánh, vòng lặp và Mini-Project.',
        descriptionEn: '4-stage compilation process, RAM memory cells, variables, data types, branches, loops and Mini-Project.',
        lessons: [
          {
            id: 'c-1-compile',
            title: '1. Tổng quan & Quá trình biên dịch (Compilation Process)',
            durationMinutes: 6,
            summary: 'Khám phá 4 bước chuyển đổi mã nguồn thành file thực thi (.exe) trong môi trường Dev-C++ / GCC.',
            content: `### 1. Bản chất ngôn ngữ C & Quá trình biên dịch 4 bước
Ngôn ngữ C là ngôn ngữ bậc trung, là cầu nối tuyệt vời giữa tư duy con người và cách phần cứng máy tính (CPU, RAM) hoạt động. Mã nguồn bạn viết (\`Source Code\`) không thể chạy ngay lập tức mà phải trải qua **4 bước biên dịch**:

1. **Tiền xử lý (Preprocessing):** Trình biên dịch tìm các dòng bắt đầu bằng \`#\` (như \`#include <stdio.h>\`). Giai đoạn này loại bỏ chú thích (comments) và sao chép thư viện vào mã nguồn. Tạo ra file \`.i\`.
2. **Biên dịch (Compiling):** Mã nguồn được dịch sang mã **Hợp ngữ (Assembly)** – một ngôn ngữ bậc thấp sát với tập lệnh của CPU. Tạo ra file \`.s\`.
3. **Dịch hợp ngữ (Assembling):** Mã Assembly tiếp tục được chuyển hóa thành **Mã máy (Machine Code)** chứa toàn các số 0 và 1 (Object file). Tạo ra file \`.obj\` hoặc \`.o\`.
4. **Liên kết (Linking):** Các file \`.obj\` được liên kết lại với nhau và với các thư viện chuẩn (ví dụ thư viện chứa hàm \`printf\`) để tạo ra file thực thi cuối cùng (\`.exe\` trên Windows).

### 2. Thử thách:
Viết chương trình C hoàn chỉnh trong Dev-C++ sử dụng thư viện \`<stdio.h>\` để in ra thông điệp khởi động:
\`Chao mung den voi AHtest.code C Compiler!\``,
            initialCode: `#include <stdio.h>

int main() {
    // TODO: In ra: Chao mung den voi AHtest.code C Compiler!
    
    return 0;
}`,
            solutionCode: `#include <stdio.h>

int main() {
    printf("Chao mung den voi AHtest.code C Compiler!\n");
    return 0;
}`,
            hints: [
              'Sử dụng lệnh `printf("Chao mung den voi AHtest.code C Compiler!\\n");`',
              'Nhớ thêm ký tự xuống dòng `\\n` và dấu chấm phẩy `;`.'
            ],
            testcases: [
              { input: '', expectedOutput: 'Chao mung den voi AHtest.code C Compiler!' }
            ]
          },
          {
            id: 'c-1-variables',
            title: '2. Bộ nhớ RAM, Biến & Kiểu dữ liệu',
            durationMinutes: 8,
            summary: 'Mô hình chiếc hộp RAM, các kiểu dữ liệu char, int, float, double và bẫy ép kiểu (Type Casting).',
            content: `### 1. Mô hình chiếc hộp RAM
Hãy tưởng tượng bộ nhớ RAM của máy tính là một tập hợp hàng tỷ chiếc hộp trống:
* **Biến (Variable):** Tên của chiếc hộp.
* **Địa chỉ (Address):** Số nhà của chiếc hộp trong RAM.
* **Kiểu dữ liệu (Data Type):** Kích thước chiếc hộp (bao nhiêu Byte) và cách giải mã các số 0, 1 bên trong.

| Kiểu dữ liệu | Định dạng (Specifier) | Kích thước (Size) | Phạm vi biểu diễn / Ví dụ |
| :--- | :--- | :--- | :--- |
| \`char\` | \`%c\` | 1 byte | Ký tự ASCII (ví dụ: 'A', 'b', '9') |
| \`int\` | \`%d\` | 4 bytes | Số nguyên (ví dụ: 10, -500) |
| \`float\` | \`%f\` | 4 bytes | Số thực đơn (ví dụ: 3.14) |
| \`double\` | \`%lf\` | 8 bytes | Số thực kép (độ chính xác cao hơn) |

> [!TIP]
> **Góc nhìn Kỹ sư Dữ liệu:** Phép chia số nguyên \`5 / 2\` trong C sẽ cho ra \`2\` (phần thập phân bị cắt vứt bỏ). Muốn có kết quả \`2.5\`, bạn phải ép kiểu tường minh: \`(float)5 / 2\`.

### 2. Thử thách:
Nhập vào 2 số nguyên $A$ và $B$. Hãy in ra thương số chính xác dạng số thực \`float\` với 1 chữ số thập phân (ví dụ: 5 và 2 -> 2.5).`,
            initialCode: `#include <stdio.h>

int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) == 2) {
        // TODO: Ép kiểu float và in ra với định dạng %.1f
    }
    return 0;
}`,
            solutionCode: `#include <stdio.h>

int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) == 2) {
        float ans = (float)a / b;
        printf("%.1f\n", ans);
    }
    return 0;
}`,
            hints: [
              'Dùng ép kiểu: `float ans = (float)a / b;`',
              'In ra định dạng 1 chữ số thập phân: `printf("%.1f\\n", ans);`'
            ],
            testcases: [
              { input: '5 2', expectedOutput: '2.5' },
              { input: '10 4', expectedOutput: '2.5' }
            ]
          },
          {
            id: 'c-1-io',
            title: '3. Nhập / Xuất dữ liệu (I/O) & Toán tử &',
            durationMinutes: 7,
            summary: 'Giao tiếp thông qua printf() và scanf(). Tại sao bắt buộc phải có toán tử & khi nhập dữ liệu.',
            content: `### 1. Nhập xuất dữ liệu với \`printf()\` & \`scanf()\`
Chúng ta giao tiếp với máy tính thông qua:
* \`printf()\`: In ra màn hình console.
* \`scanf()\`: Nhận dữ liệu từ bàn phím.

\`\`\`c
int age;
printf("Nhap tuoi cua ban: ");
scanf("%d", &age); // Lưu dữ liệu vào ĐỊA CHỈ của biến age
\`\`\`

> [!WARNING]
> Khi sử dụng \`scanf()\`, hãy nhớ **luôn đặt dấu \`&\` trước tên biến** (trừ chuỗi ký tự) để chỉ định địa chỉ bộ nhớ ghi dữ liệu vào. Quên dấu \`&\` sẽ gây ra lỗi truy cập bộ nhớ bất hợp pháp (Segmentation Fault)!

### 2. Thử thách:
Viết chương trình đọc vào tuổi (\`int\`) và chiều cao (\`float\`). In ra dòng chữ theo định dạng:
\`Tuoi: <age>, Chieu cao: <height>m\``,
            initialCode: `#include <stdio.h>

int main() {
    int age;
    float height;
    // TODO: Dùng scanf với dấu & và printf kết quả
    
    return 0;
}`,
            solutionCode: `#include <stdio.h>

int main() {
    int age;
    float height;
    if (scanf("%d %f", &age, &height) == 2) {
        printf("Tuoi: %d, Chieu cao: %.2fm\n", age, height);
    }
    return 0;
}`,
            hints: [
              'Cú pháp nhập: `scanf("%d %f", &age, &height);`',
              'Cú pháp xuất: `printf("Tuoi: %d, Chieu cao: %.2fm\\n", age, height);`'
            ],
            testcases: [
              { input: '18 1.75', expectedOutput: 'Tuoi: 18, Chieu cao: 1.75m' }
            ]
          },
          {
            id: 'c-1-selection',
            title: '4. Cấu trúc Rẽ nhánh (If/Else & Switch-Case)',
            durationMinutes: 8,
            summary: 'Đánh giá biểu thức logic TRUE/FALSE trong C, bẫy Dangling Else và lỗi trôi mã fall-through.',
            content: `### 1. Bản chất Logic trong C
Trong C, không có kiểu boolean nguyên thủy ban đầu:
* Giá trị \`0\` biểu thị **FALSE**.
* Mọi giá trị khác \`0\` (thường là \`1\`) biểu thị **TRUE**.

### 2. Cấu trúc If / Else & Bẫy Dangling Else
\`\`\`c
if (mark >= 7) {
    printf("Passed\\n");
} else {
    printf("Failed\\n");
}
\`\`\`
> [!CAUTION]
> **Lỗi Dangling Else:** Một lệnh \`else\` sẽ luôn tự động bắt cặp với lệnh \`if\` gần nhất phía trên nó. Phong cách lập trình chuẩn: **Luôn sử dụng cặp ngoặc nhọn \`{}\`** ngay cả khi khối lệnh chỉ có 1 dòng!

### 3. Cấu trúc Switch-Case
\`\`\`c
switch(day) {
    case 1: printf("Monday"); break;
    case 2: printf("Tuesday"); break;
    default: printf("Invalid");
}
\`\`\`
*Lưu ý:* \`switch\` chỉ áp dụng với biến nguyên (\`int\`) hoặc ký tự (\`char\`). Thiếu lệnh \`break\` sẽ gây lỗi **trôi mã (fall-through)**.`,
            initialCode: `#include <stdio.h>

int main() {
    int score;
    if (scanf("%d", &score) == 1) {
        // TODO: In "Passed" nếu score >= 5, ngược lại in "Failed"
    }
    return 0;
}`,
            solutionCode: `#include <stdio.h>

int main() {
    int score;
    if (scanf("%d", &score) == 1) {
        if (score >= 5) {
            printf("Passed\n");
        } else {
            printf("Failed\n");
        }
    }
    return 0;
}`,
            hints: [
              'Dùng cấu trúc `if (score >= 5) { ... } else { ... }`'
            ],
            testcases: [
              { input: '8', expectedOutput: 'Passed' },
              { input: '4', expectedOutput: 'Failed' }
            ]
          },
          {
            id: 'c-1-loops',
            title: '5. Vòng lặp (for, while, do-while)',
            durationMinutes: 8,
            summary: 'So sánh cơ chế chạy của for, while và do-while; cách dùng break và continue tránh Spaghetti Code.',
            content: `### 1. Phân loại 3 vòng lặp chính
* **for:** Sử dụng khi biết trước số lần lặp (ví dụ: in các số từ 1 đến 10).
* **while:** Kiểm tra điều kiện trước khi chạy. Có thể không chạy lần nào nếu điều kiện ban đầu sai.
* **do-while:** Chạy khối lệnh trước, sau đó mới kiểm tra điều kiện. Đảm bảo khối lệnh **luôn được thực thi ít nhất 1 lần**.

### 2. So sánh cơ chế thực thi:
\`\`\`c
// Vòng lặp while: 5 < 5 là FALSE -> Bỏ qua hoàn toàn
int count = 5;
while (count < 5) {
    printf("%d", count);
    count++;
}

// Vòng lặp do-while: Chạy in ra 5 trước, sau đó mới kiểm tra điều kiện dừng
int count = 5;
do {
    printf("%d", count);
    count++;
} while (count < 5);
\`\`\`

> [!TIP]
> Sử dụng \`break;\` để phá vỡ và thoát ngay khỏi vòng lặp. Sử dụng \`continue;\` để bỏ qua phần còn lại của chu kỳ hiện tại.`,
            initialCode: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        // TODO: Dùng vòng lặp for in ra các số từ 1 đến n cách nhau dấu cách
    }
    return 0;
}`,
            solutionCode: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        for (int i = 1; i <= n; i++) {
            printf("%d ", i);
        }
        printf("\n");
    }
    return 0;
}`,
            hints: [
              'Khởi tạo vòng lặp: `for (int i = 1; i <= n; i++)`'
            ],
            testcases: [
              { input: '5', expectedOutput: '1 2 3 4 5' }
            ]
          },
          {
            id: 'c-1-project',
            title: '6. Thực hành: Bài tập vẽ hình & Máy tính CLI',
            durationMinutes: 10,
            summary: 'Áp dụng vòng lặp lồng nhau, kiểm tra tính hợp lệ dữ liệu và xử lý bộ đệm bàn phím (Buffer).',
            content: `### 1. Bài tập Vẽ hình chữ nhật bằng dấu \`*\`
Viết chương trình in ra hình chữ nhật bằng các dấu \`*\` có chiều dài (C) và chiều rộng (R) do người dùng nhập vào. Nếu người dùng nhập số âm hoặc 0, in thông báo lỗi \`Loi kich thuoc!\`.

### 2. Hướng dẫn thuật toán:
* Sử dụng cấu trúc \`if / else\` kiểm tra tính hợp lệ của C và R.
* Sử dụng 2 vòng lặp \`for\` lồng nhau: vòng ngoài đại diện cho hàng ($R$), vòng trong đại diện cho số lượng dấu sao trên một hàng ($C$).

### 3. Kiến thức mở rộng: Mini-Project Máy tính CLI
Kết hợp \`do-while\` và \`switch-case\`, sử dụng \`while (getchar() != '\\n');\` để xóa bộ đệm bàn phím trước khi nhận ký tự tiếp theo.`,
            initialCode: `#include <stdio.h>

int main() {
    int r, c;
    if (scanf("%d %d", &r, &c) == 2) {
        // TODO: Kiểm tra r, c > 0 và in hình chữ nhật sao
    }
    return 0;
}`,
            solutionCode: `#include <stdio.h>

int main() {
    int r, c;
    if (scanf("%d %d", &r, &c) == 2) {
        if (r <= 0 || c <= 0) {
            printf("Loi kich thuoc!\n");
        } else {
            for (int i = 0; i < r; i++) {
                for (int j = 0; j < c; j++) {
                    printf("*");
                }
                printf("\n");
            }
        }
    }
    return 0;
}`,
            hints: [
              'Vòng for lồng nhau: `for (int i = 0; i < r; i++) { for (int j = 0; j < c; j++) printf("*"); printf("\\n"); }`'
            ],
            testcases: [
              { input: '3 4', expectedOutput: '****\n****\n****' },
              { input: '-1 5', expectedOutput: 'Loi kich thuoc!' }
            ]
          },
          {
            id: 'c-1-quiz',
            title: '7. Quiz Trắc Nghiệm Nhận Diện Lỗi Logic',
            durationMinutes: 5,
            summary: 'Luyện mắt Code Review: Bẫy vòng lặp vô hạn và nhầm lẫn nguy hiểm giữa toán tử gán (=) và so sánh (==).',
            content: `### 1. Code Review Challenge 1: Vòng lặp vô hạn
\`\`\`c
int i = 0;
while (i < 10) {
    printf("Hello\\n");
}
\`\`\`
*Giải thích:* Thiếu câu lệnh tăng biến đếm \`i++\` khiến điều kiện \`i < 10\` luôn luôn đúng, dẫn đến treo máy vì tràn tài nguyên CPU!

### 2. Code Review Challenge 2: Bẫy \`if (mark = 10)\`

> [!WARNING]
> **Tình huống:** Nếu lập trình viên gõ \`if (mark = 10)\` thay vì \`if (mark == 10)\`, điều gì sẽ xảy ra?

* **Đáp án:** Lệnh so sánh bị biến thành lệnh Gán! Biến \`mark\` được gán giá trị 10, và biểu thức trả về giá trị 10 (khác 0 tức là **TRUE**). Do đó, khối lệnh bên trong \`if\` **luôn luôn được thực thi** một cách tai hại!

### 3. Thử thách:
Viết chương trình sửa lại câu lệnh gán nhầm thành câu lệnh so sánh điều kiện chính xác: Nhập số nguyên $X$, in \`BANG 10\` nếu $X == 10$, ngược lại in \`KHAC 10\`.`,
            initialCode: `#include <stdio.h>

int main() {
    int x;
    if (scanf("%d", &x) == 1) {
        // Sửa lỗi: đảm bảo dùng toán tử so sánh == thay vì =
        if (x == 10) {
            printf("BANG 10\n");
        } else {
            printf("KHAC 10\n");
        }
    }
    return 0;
}`,
            solutionCode: `#include <stdio.h>

int main() {
    int x;
    if (scanf("%d", &x) == 1) {
        if (x == 10) {
            printf("BANG 10\n");
        } else {
            printf("KHAC 10\n");
        }
    }
    return 0;
}`,
            hints: [
              'Luôn dùng `x == 10` để so sánh bằng trong ngôn ngữ C.'
            ],
            testcases: [
              { input: '10', expectedOutput: 'BANG 10' },
              { input: '7', expectedOutput: 'KHAC 10' }
            ]
          }
        ]
      },
      {
        id: 'c-giai-doan-2',
        title: 'Giai Đoạn 2: Quản Lý Bộ Nhớ, Con Trỏ & Cấu Trúc Dữ Liệu',
        titleEn: 'Stage 2: Memory Management, Pointers & Advanced Structs',
        description: 'Sơ đồ 4 phân vùng RAM, truyền con trỏ swap(), pointer arithmetic, malloc/free, struct và Mini-Project.',
        descriptionEn: '4-region RAM layout, pointer swap, pointer arithmetic, malloc/free, structs and Mini-Project.',
        lessons: [
          {
            id: 'c-2-memory-swap',
            title: '8. Sơ đồ Bộ nhớ & Cơ chế Truyền Hàm (Pass-by-value vs Pass-by-ref)',
            durationMinutes: 9,
            summary: '4 phân vùng bộ nhớ RAM và kỹ thuật hoán vị swap(&a, &b) bằng con trỏ.',
            content: `### 1. Bốn phân vùng bộ nhớ RAM của một chương trình C
Để trở thành một kỹ sư C thực thụ, bạn phải biết dữ liệu của mình đang "sống" ở đâu:
* **Code Segment:** Chứa mã máy (instructions) đã được biên dịch.
* **Data Segment:** Chứa các biến toàn cục (Global) và biến tĩnh (Static). Tồn tại suốt vòng đời chương trình.
* **Stack Segment:** Chứa các biến cục bộ (Local) khai báo trong hàm. Tự động tạo và tự động thu hồi khi hàm kết thúc.
* **Heap Segment:** Vùng nhớ linh hoạt, lập trình viên tự xin cấp phát và tự giải phóng khi chương trình đang chạy.

### 2. Truyền tham trị vs Truyền con trỏ
Ngôn ngữ C mặc định sử dụng cơ chế **Truyền tham trị (Pass-by-value)**: chỉ copy giá trị vào vùng nhớ mới trên Stack, mọi thay đổi trong hàm không ảnh hưởng đến biến gốc.

> [!NOTE]
> **So sánh trực quan giữa 2 cơ chế hoán vị (Swap):**

**❌ Sai lầm phổ biến: Truyền tham trị (Không đổi giá trị)**
\`\`\`c
void swap(int x, int y) {
    int temp = x;
    x = y;
    y = temp;
}
// Tại hàm main: hai biến a và b KHÔNG HỀ thay đổi!
\`\`\`

**✅ Giải pháp cốt lõi: Truyền con trỏ (Hoán vị thành công)**
\`\`\`c
void swap(int *px, int *py) {
    int temp = *px;
    *px = *py;
    *py = temp;
}
// Tại hàm main: gọi swap(&a, &b) -> a và b ĐÃ ĐƯỢC HOÁN VỊ!
\`\`\`

### 3. Thử thách:
Hãy hoàn thiện hàm \`swap(int *a, int *b)\` để hoán đổi giá trị 2 số nguyên được truyền vào từ hàm \`main\`.`,
            initialCode: `#include <stdio.h>

void swap(int *a, int *b) {
    // TODO: Hoán đổi giá trị tại địa chỉ *a và *b
}

int main() {
    int x, y;
    if (scanf("%d %d", &x, &y) == 2) {
        swap(&x, &y);
        printf("%d %d\n", x, y);
    }
    return 0;
}`,
            solutionCode: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x, y;
    if (scanf("%d %d", &x, &y) == 2) {
        swap(&x, &y);
        printf("%d %d\n", x, y);
    }
    return 0;
}`,
            hints: [
              'Dùng biến tạm: `int temp = *a; *a = *b; *b = temp;`'
            ],
            testcases: [
              { input: '10 20', expectedOutput: '20 10' },
              { input: '99 1', expectedOutput: '1 99' }
            ]
          },
          {
            id: 'c-2-pointers',
            title: '9. Thế giới Con trỏ & Số học Con trỏ (Pointer Arithmetic)',
            durationMinutes: 9,
            summary: 'Ý nghĩa toán tử & và *, bước nhảy con trỏ p + 1 nhảy theo kích thước kiểu dữ liệu.',
            content: `### 1. Con trỏ (Pointers) là gì?
Con trỏ là một biến dùng để lưu trữ địa chỉ bộ nhớ của một biến khác:
* **Toán tử \`&\` (Address-of):** "Địa chỉ của...". Ví dụ: \`&n\` trả về số nhà (địa chỉ RAM) của biến \`n\`.
* **Toán tử \`*\` (Dereference):** "Giá trị nằm tại...". Ví dụ: \`*p\` truy cập vào căn nhà mà con trỏ \`p\` đang giữ chìa khóa để đọc/sửa dữ liệu bên trong.

\`\`\`c
int n = 7;
int *pn = &n; // pn lưu địa chỉ của n
*pn = 100;    // Thay đổi giá trị TẠI địa chỉ đó thành 100. Lúc này n = 100!
\`\`\`

> [!TIP]
> **Góc nhìn Kỹ sư (Memory Arithmetic):** Cộng trừ con trỏ không giống cộng trừ số học. Nếu \`p\` là con trỏ kiểu \`int*\` (mỗi phần tử 4 bytes) đang trỏ tới địa chỉ 1000, khi bạn viết \`p + 1\`, địa chỉ mới sẽ là **1004** (nhảy một bước bằng \`sizeof(int)\`), không phải 1001! Khái niệm này kết nối chặt chẽ với Mảng.

### 2. Thử thách:
Cho con trỏ \`p\` trỏ vào phần tử đầu tiên của mảng 3 số nguyên. Sử dụng số học con trỏ \`*(p + 1)\` để sửa phần tử thứ hai thành \`888\` và in toàn bộ mảng.`,
            initialCode: `#include <stdio.h>

int main() {
    int arr[3] = {10, 20, 30};
    int *p = arr;
    
    // TODO: Gán phần tử thứ hai qua con trỏ: *(p + 1) = 888;
    
    printf("%d %d %d\n", arr[0], arr[1], arr[2]);
    return 0;
}`,
            solutionCode: `#include <stdio.h>

int main() {
    int arr[3] = {10, 20, 30};
    int *p = arr;
    *(p + 1) = 888;
    printf("%d %d %d\n", arr[0], arr[1], arr[2]);
    return 0;
}`,
            hints: [
              'Sử dụng: `*(p + 1) = 888;`'
            ],
            testcases: [
              { input: '', expectedOutput: '10 888 30' }
            ]
          },
          {
            id: 'c-2-dynamic-alloc',
            title: '10. Cấp phát Bộ nhớ Động (malloc, calloc, realloc, free)',
            durationMinutes: 10,
            summary: 'Giải phóng giới hạn kích thước mảng tĩnh bằng vùng nhớ Heap qua thư viện <stdlib.h>.',
            content: `### 1. Tại sao cần cấp phát động trên Heap?
Mảng tĩnh (như \`int arr[100];\`) được lưu trên Stack. Nhược điểm chí mạng: kích thước phải cố định từ lúc viết code, gây lãng phí nếu không dùng hết hoặc gây tràn bộ nhớ (**Stack Overflow**) nếu mảng quá lớn.

### 2. Bảng 4 hàm quản lý bộ nhớ trong \`<stdlib.h>\`

| Hàm | Cú pháp & Mục đích | Đặc điểm nổi bật |
| :--- | :--- | :--- |
| \`malloc()\` | \`(int*) malloc(n * sizeof(int));\` | Cấp phát bộ nhớ nhưng chứa toàn **giá trị rác**. Tốc độ thực thi rất nhanh. |
| \`calloc()\` | \`(int*) calloc(n, sizeof(int));\` | Cấp phát và tự động **gán bằng 0** toàn bộ ô nhớ. An toàn hơn nhưng chậm hơn đôi chút. |
| \`realloc()\` | \`(int*) realloc(arr, new_size);\` | Thay đổi kích thước của mảng động đã cấp phát mà vẫn giữ nguyên dữ liệu cũ. |
| \`free()\` | \`free(arr); arr = NULL;\` | **Bắt buộc gọi để trả lại RAM**. Nếu quên sẽ gây lỗi rò rỉ bộ nhớ (Memory Leak). |

### 3. Thử thách:
Nhập số nguyên $N$. Dùng \`malloc\` để cấp phát mảng động $N$ số nguyên, nhập các phần tử, tính tổng và gọi \`free()\` dọn dẹp trước khi kết thúc.`,
            initialCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1 || n <= 0) return 0;
    
    // TODO: Cấp phát động mảng n phần tử, tính tổng và giải phóng bộ nhớ
    
    return 0;
}`,
            solutionCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1 || n <= 0) return 0;
    int *arr = (int*)malloc(n * sizeof(int));
    if (arr == NULL) return 1;
    
    long long sum = 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
        sum += arr[i];
    }
    printf("%lld\n", sum);
    
    free(arr);
    arr = NULL;
    return 0;
}`,
            hints: [
              'Cấp phát: `int *arr = (int*)malloc(n * sizeof(int));`',
              'Giải phóng: `free(arr); arr = NULL;`'
            ],
            testcases: [
              { input: '3\n10 20 30', expectedOutput: '60' },
              { input: '4\n1 2 3 4', expectedOutput: '10' }
            ]
          },
          {
            id: 'c-2-memory-leak',
            title: '11. Cảnh báo: Memory Leak & Dangling Pointer',
            durationMinutes: 7,
            summary: 'Hiểu về lỗi rò rỉ RAM và con trỏ lửng lơ để xây dựng phần mềm an toàn chuẩn sản xuất.',
            content: `### 1. Memory Leak (Rò rỉ bộ nhớ)
Bộ nhớ cấp phát động trên Heap tồn tại vĩnh viễn cho đến khi tắt chương trình. Nếu bạn làm mất con trỏ (chứa địa chỉ) mà chưa gọi \`free()\`, đoạn RAM đó sẽ bị "kẹt" mãi mãi. Đối với các ứng dụng chạy 24/7 (Server, Game Engine, Hệ điều hành), Memory Leak sẽ ăn sạch RAM và làm sập toàn bộ hệ thống!

### 2. Dangling Pointer (Con trỏ lửng lơ)
Sau khi gọi \`free(ptr);\`, biến \`ptr\` **vẫn chứa địa chỉ cũ** trỏ vào vùng nhớ không còn thuộc quyền sở hữu của nó nữa. Vùng nhớ này có thể đã được hệ điều hành cấp cho tiến trình khác.

> [!CAUTION]
> **Quy tắc vàng của kỹ sư C:**
> Luôn gán \`ptr = NULL;\` ngay sau lệnh \`free(ptr);\` để bảo mật và tránh lỗi vô tình ghi đè dữ liệu rác!

### 3. Thử thách:
Viết đoạn code cấp phát 1 ô nhớ cho con trỏ \`int *p\`, gán giá trị \`500\`, in ra màn hình, sau đó gọi \`free(p)\` và gán \`p = NULL;\`. Cuối cùng kiểm tra nếu \`p == NULL\` thì in ra \`An toan\`.`,
            initialCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *p = (int*)malloc(sizeof(int));
    *p = 500;
    printf("%d\n", *p);
    
    // TODO: Giải phóng p, gán p = NULL và kiểm tra an toàn
    
    return 0;
}`,
            solutionCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *p = (int*)malloc(sizeof(int));
    if (p == NULL) return 1;
    *p = 500;
    printf("%d\n", *p);
    
    free(p);
    p = NULL;
    if (p == NULL) {
        printf("An toan\n");
    }
    return 0;
}`,
            hints: [
              'Gọi `free(p); p = NULL;` sau đó `if (p == NULL) printf("An toan\\n");`'
            ],
            testcases: [
              { input: '', expectedOutput: '500\nAn toan' }
            ]
          },
          {
            id: 'c-2-struct',
            title: '12. Kiểu dữ liệu Tự định nghĩa (Struct)',
            durationMinutes: 8,
            summary: 'Gom nhóm các kiểu dữ liệu khác nhau thành một thực thể duy nhất với typedef struct.',
            content: `### 1. Tại sao cần \`struct\`?
Mảng chỉ gom nhóm được các dữ liệu cùng kiểu. \`struct\` sinh ra để gom nhóm các dữ liệu khác kiểu lại thành một thực thể duy nhất, đặt nền móng cho Lập trình Hướng đối tượng (OOP) sau này.

\`\`\`c
typedef struct {
    int id;
    char name[40];
    double balance;
} Account;

int main() {
    Account acc1 = {101, "Nguyen Van A", 500.5}; // Khai báo và khởi tạo
    
    // Truy xuất trường dữ liệu bằng dấu chấm (.)
    printf("Ten khach hang: %s, So du: %.2lf\\n", acc1.name, acc1.balance);
    return 0;
}
\`\`\`

### 2. Thử thách:
Khai báo \`struct Point\` gồm 2 tọa độ \`int x, y;\`. Nhập vào tọa độ 1 điểm và in ra theo định dạng \`(x, y)\`.`,
            initialCode: `#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

int main() {
    Point p;
    // TODO: Nhập p.x, p.y và in ra (x, y)
    
    return 0;
}`,
            solutionCode: `#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

int main() {
    Point p;
    if (scanf("%d %d", &p.x, &p.y) == 2) {
        printf("(%d, %d)\n", p.x, p.y);
    }
    return 0;
}`,
            hints: [
              'Dùng `scanf("%d %d", &p.x, &p.y);`',
              'Dùng `printf("(%d, %d)\\n", p.x, p.y);`'
            ],
            testcases: [
              { input: '3 7', expectedOutput: '(3, 7)' }
            ]
          },
          {
            id: 'c-2-mini-project',
            title: '13. Mini-Project: Quản lý Danh bạ Nhân viên (Dynamic Struct Array)',
            durationMinutes: 12,
            summary: 'Xây dựng dự án kết hợp cấp phát mảng động cho struct Employee, tính lương và giải phóng RAM.',
            content: `### 1. Yêu cầu Dự án Mini-Project

Xây dựng hệ thống quản lý danh sách nhân viên động (ID, Tên, Lương cơ bản, Ngày công) theo quy trình chuẩn:

1. **Khởi tạo dữ liệu:** Nhập số lượng nhân viên ban đầu $N$.
2. **Cấp phát bộ nhớ Heap:** Khởi tạo mảng động chứa $N$ nhân viên:
\`Employee *list = (Employee*)malloc(n * sizeof(Employee));\`
3. **Tính toán chi trả:**
   * Lương ngày = $\\text{Lương cơ bản} / 26.0$
   * Lương thực nhận = $\\text{Lương ngày} \\times \\text{Ngày công}$
4. **Dọn dẹp an toàn:** Giải phóng tài nguyên trước khi kết thúc bằng: \`free(list); list = NULL;\`

\`\`\`c
typedef struct {
    char id[10];
    char name[30];
    float basicSalary;
    int workingDays;
} Employee;
\`\`\`

### 2. Thử thách:
Nhập vào 1 nhân viên gồm Tên (\`char[30]\`), Lương cơ bản (\`float\`), và Ngày công (\`int\`). Hãy tính và in ra:
\`NV: <ten> | Luong: <luong_thuc_nhan>\` (lấy 2 chữ số thập phân, công thức: \`(basicSalary / 26.0) * workingDays\`).`,
            initialCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    char name[30];
    float basicSalary;
    int workingDays;
} Employee;

int main() {
    Employee emp;
    if (scanf("%s %f %d", emp.name, &emp.basicSalary, &emp.workingDays) == 3) {
        // TODO: Tính lương thực nhận và in ra kết quả
    }
    return 0;
}`,
            solutionCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    char name[30];
    float basicSalary;
    int workingDays;
} Employee;

int main() {
    Employee emp;
    if (scanf("%s %f %d", emp.name, &emp.basicSalary, &emp.workingDays) == 3) {
        float daily = emp.basicSalary / 26.0;
        float total = daily * emp.workingDays;
        printf("NV: %s | Luong: %.2f\n", emp.name, total);
    }
    return 0;
}`,
            hints: [
              'Tính `float total = (emp.basicSalary / 26.0) * emp.workingDays;`',
              'In `printf("NV: %s | Luong: %.2f\\n", emp.name, total);`'
            ],
            testcases: [
              { input: 'Nam 2600 20', expectedOutput: 'NV: Nam | Luong: 2000.00' }
            ]
          },
          {
            id: 'c-2-code-review',
            title: '14. Quiz Code Review: Nhận diện Lỗi Vòng Đời Biến (Lifetime Bug)',
            durationMinutes: 7,
            summary: 'Mổ xẻ lỗi nghiêm trọng khi trả về con trỏ vùng nhớ Stack của hàm cục bộ.',
            content: `### 1. Phân tích đoạn code sau:
\`\`\`c
int* getArray() {
    int arr[5] = {1, 2, 3, 4, 5};
    return arr;
}
\`\`\`

### 2. Lỗ hổng nghiêm trọng ở đâu?
* **Đáp án: Lỗi Dangling Pointer do vi phạm Scope/Lifetime.**
* Biến mảng \`arr\` được cấp phát tĩnh trên phân vùng **Stack** bên trong hàm \`getArray()\`.
* Khi hàm \`getArray()\` kết thúc, toàn bộ vùng nhớ Stack của nó bị hệ điều hành **thu hồi ngay lập tức**!
* Trả về địa chỉ của \`arr\` ra bên ngoài sẽ dẫn đến việc con trỏ bên ngoài truy xuất vào một **vùng nhớ rác không còn hợp lệ** (hoặc bị tiến trình khác ghi đè).
* **Cách sửa chuẩn:** Phải dùng \`malloc\` để cấp phát mảng trên **Heap** nếu muốn trả địa chỉ ra ngoài hàm!

### 3. Thử thách:
Hãy sửa lại hàm để cấp phát động mảng 3 số nguyên trên Heap bằng \`malloc\`, gán giá trị 1, 2, 3 và trả về con trỏ an toàn ra hàm \`main\`.`,
            initialCode: `#include <stdio.h>
#include <stdlib.h>

int* getSafeArray() {
    // Sửa lỗi: Cấp phát trên Heap thay vì Stack
    int *arr = (int*)malloc(3 * sizeof(int));
    arr[0] = 1; arr[1] = 2; arr[2] = 3;
    return arr;
}

int main() {
    int *p = getSafeArray();
    printf("%d %d %d\n", p[0], p[1], p[2]);
    free(p);
    p = NULL;
    return 0;
}`,
            solutionCode: `#include <stdio.h>
#include <stdlib.h>

int* getSafeArray() {
    int *arr = (int*)malloc(3 * sizeof(int));
    arr[0] = 1; arr[1] = 2; arr[2] = 3;
    return arr;
}

int main() {
    int *p = getSafeArray();
    printf("%d %d %d\n", p[0], p[1], p[2]);
    free(p);
    p = NULL;
    return 0;
}`,
            hints: [
              'Vùng nhớ trên Heap được giữ lại cho đến khi lệnh free() được gọi tường minh.'
            ],
            testcases: [
              { input: '', expectedOutput: '1 2 3' }
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
    titleEn: 'Competitive C++: From Zero to Algorithms',
    language: 'cpp',
    level: 'Beginner',
    description: 'Khoá học tương tác thực chiến dành riêng cho học sinh chuyên Tin và sinh viên nhập môn. Không nhồi nhét lý thuyết suông: mỗi bài học chỉ 3 phút lý thuyết kèm 1 thử thách gõ code trực tiếp trên trình duyệt!',
    totalLessons: 12,
    estimatedHours: 4,
    modules: [
      {
        id: 'mod-1',
        title: 'Chương 1: Cấu Trúc Cơ Bản & Nhập Xuất Nhanh',
        titleEn: 'Chapter 1: Basic Structure & Fast I/O',
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
    titleEn: 'Ultra-Fast Python for Competitive Programming',
    language: 'python',
    level: 'Beginner',
    description: 'Bí kíp sử dụng Python hiệu quả trong các kỳ thi Tin học trẻ, Olympic Sinh viên và ICPC (Đang được đội ngũ chuyên môn biên soạn).',
    totalLessons: 0,
    estimatedHours: 0,
    isComingSoon: true,
    modules: []
  }
];

// Enrich C curriculum lessons with English translations and FPTU Applied Exercises
mockCourses.forEach(course => {
  course.modules.forEach(mod => {
    mod.lessons.forEach(lesson => {
      // Attach FPTU applied practical exercises
      if (fptuAppliedExercises[lesson.id]) {
        lesson.appliedExercises = fptuAppliedExercises[lesson.id];
      }
      // Attach English translations
      const trans = academyEnTranslations[lesson.id];
      if (trans) {
        lesson.titleEn = trans.titleEn;
        lesson.summaryEn = trans.summaryEn;
        lesson.contentEn = trans.contentEn;
        lesson.hintsEn = trans.hintsEn;
      }
      // Provide default explanations for test cases if missing
      if (lesson.testcases) {
        lesson.testcases.forEach(tc => {
          if (!tc.explanationVi) {
            tc.explanationVi = 'Đầu vào "' + (tc.input || 'mặc định') + '" tạo ra kết quả kỳ vọng "' + tc.expectedOutput + '".';
            tc.explanationEn = 'Input "' + (tc.input || 'default') + '" yields expected output "' + tc.expectedOutput + '".';
          }
        });
      }
    });
  });
});