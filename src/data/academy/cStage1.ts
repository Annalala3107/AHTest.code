import { AcademyModule } from '../../types';

export const cStage1Module: AcademyModule = {
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
      };
