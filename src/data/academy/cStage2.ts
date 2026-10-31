import { AcademyModule } from '../../types';

export const cStage2Module: AcademyModule = {
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
      };
