import { AppliedExercise } from '../types';

export const fptuAppliedExercises: Record<string, AppliedExercise[]> = {
  // Giai đoạn 1 - Bài 1: Quá trình biên dịch & Basic I/O
  'c-1-compile': [
    {
      id: 'fptu-q1',
      questionCode: 'Q001',
      titleVi: '001. Tính tổng hai số nguyên',
      titleEn: '001. Sum of two integers',
      category: 'Basic I/O',
      difficulty: 'Easy',
      descriptionVi: 'Viết chương trình bằng ngôn ngữ C nhận vào hai số nguyên từ bàn phím và in ra tổng của chúng trên một dòng duy nhất.',
      descriptionEn: 'Write a program in C/C++ that accepts two integers as input and outputs their sum on a single line.',
      initialCode: `#include <stdio.h>

int main() {
    int a, b;
    // Nhập 2 số nguyên a và b
    if (scanf("%d %d", &a, &b) == 2) {
        // TODO: In ra tổng của a và b
        printf("%d\\n", a + b);
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) == 2) {
        printf("%d\\n", a + b);
    }
    return 0;
}`,
      testcases: [
        {
          input: '3 5',
          expectedOutput: '8',
          explanationVi: 'Đầu vào là 3 và 5, tổng 3 + 5 = 8.',
          explanationEn: 'Inputs are 3 and 5, sum 3 + 5 = 8.'
        },
        {
          input: '-10 25',
          expectedOutput: '15',
          explanationVi: 'Số âm và số dương: -10 + 25 = 15.',
          explanationEn: 'Negative and positive: -10 + 25 = 15.'
        }
      ],
      hintsVi: [
        'Sử dụng `scanf("%d %d", &a, &b);` để đọc 2 số.',
        'In kết quả bằng `printf("%d\\n", a + b);`.'
      ],
      hintsEn: [
        'Use `scanf("%d %d", &a, &b);` to read two integers.',
        'Print the result using `printf("%d\\n", a + b);`.'
      ]
    },
    {
      id: 'fptu-q2',
      questionCode: 'Q002',
      titleVi: '002. Bốn phép tính số học cơ bản',
      titleEn: '002. Four basic calculations',
      category: 'Arithmetic',
      difficulty: 'Easy',
      descriptionVi: 'Viết chương trình C nhận vào hai số nguyên a và b, in ra lần lượt tổng, hiệu, tích và thương (làm tròn 2 chữ số thập phân). Mỗi kết quả trên một dòng riêng biệt. Nếu số chia bằng 0, in ra "Divide by zero".',
      descriptionEn: 'Write a program in C/C++ that accepts two integers as input and outputs their sum, difference, product, and quotient (rounded to 2 decimal places). Each result must be printed on a separate line. If divisor is 0, print "Divide by zero".',
      initialCode: `#include <stdio.h>

int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) == 2) {
        // 1. Tổng
        printf("%d\\n", a + b);
        // 2. Hiệu
        printf("%d\\n", a - b);
        // 3. Tích
        printf("%d\\n", a * b);
        // 4. Thương (kiểm tra b == 0)
        if (b == 0) {
            printf("Divide by zero\\n");
        } else {
            printf("%.2f\\n", (float)a / b);
        }
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) == 2) {
        printf("%d\\n", a + b);
        printf("%d\\n", a - b);
        printf("%d\\n", a * b);
        if (b == 0) {
            printf("Divide by zero\\n");
        } else {
            printf("%.2f\\n", (float)a / b);
        }
    }
    return 0;
}`,
      testcases: [
        {
          input: '3 7',
          expectedOutput: '10\n-4\n21\n0.43',
          explanationVi: 'Tổng: 10, Hiệu: -4, Tích: 21, Thương: 3/7 ≈ 0.43.',
          explanationEn: 'Sum: 10, Diff: -4, Prod: 21, Quot: 3/7 ≈ 0.43.'
        },
        {
          input: '10 0',
          expectedOutput: '10\n10\n0\nDivide by zero',
          explanationVi: 'Số chia b = 0, in thông báo Divide by zero.',
          explanationEn: 'Divisor b = 0, outputs Divide by zero.'
        }
      ],
      hintsVi: [
        'Ép kiểu `(float)a / b` khi thực hiện phép chia để có kết quả thực.',
        'Định dạng làm tròn 2 chữ số thập phân bằng `%.2f`.'
      ],
      hintsEn: [
        'Cast explicit `(float)a / b` for float division.',
        'Format 2 decimal places using `%.2f`.'
      ]
    }
  ],

  // Giai đoạn 1 - Bài 2: RAM, Biến & Kiểu dữ liệu
  'c-1-variables': [
    {
      id: 'fptu-q82',
      questionCode: 'Q082',
      titleVi: '082. Tính chu vi, diện tích & đường chéo chữ nhật',
      titleEn: '082. Rectangle Information',
      category: 'Geometry & Types',
      difficulty: 'Easy',
      descriptionVi: 'Nhập vào 2 số thực đại diện cho chiều rộng (width) và chiều cao (height) của hình chữ nhật. Tính và in ra Diện tích (Area), Chu vi (Perimeter) và Đường chéo (Diagonal = sqrt(w*w + h*h)) làm tròn 2 chữ số thập phân theo mẫu: "Area: <val>\\nPerimeter: <val>\\nDiagonal: <val>".',
      descriptionEn: 'Read two floating-point numbers representing width and height of a rectangle. Calculate and display Area, Perimeter, and Diagonal length formatted to 2 decimal places (Area: <val>\\nPerimeter: <val>\\nDiagonal: <val>).',
      initialCode: `#include <stdio.h>
#include <math.h>

int main() {
    double w, h;
    if (scanf("%lf %lf", &w, &h) == 2) {
        double area = w * h;
        double perimeter = 2 * (w + h);
        double diagonal = sqrt(w * w + h * h);
        
        printf("Area: %.2f\\n", area);
        printf("Perimeter: %.2f\\n", perimeter);
        printf("Diagonal: %.2f\\n", diagonal);
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>
#include <math.h>

int main() {
    double w, h;
    if (scanf("%lf %lf", &w, &h) == 2) {
        printf("Area: %.2f\\n", w * h);
        printf("Perimeter: %.2f\\n", 2 * (w + h));
        printf("Diagonal: %.2f\\n", sqrt(w * w + h * h));
    }
    return 0;
}`,
      testcases: [
        {
          input: '6 8',
          expectedOutput: 'Area: 48.00\nPerimeter: 28.00\nDiagonal: 10.00',
          explanationVi: 'Diện tích 6*8=48, Chu vi 2*(6+8)=28, Đường chéo sqrt(36+64)=10.',
          explanationEn: 'Area 6*8=48, Perimeter 2*(6+8)=28, Diagonal sqrt(36+64)=10.'
        }
      ],
      hintsVi: ['Sử dụng thư viện `<math.h>` và hàm `sqrt()` để tính căn bậc hai.'],
      hintsEn: ['Include `<math.h>` and call `sqrt()` for square root calculation.']
    }
  ],

  // Giai đoạn 1 - Bài 3: I/O & Xử lý Buffer
  'c-1-io': [
    {
      id: 'fptu-q7',
      questionCode: 'Q007',
      titleVi: '007. Đánh giá kết quả môn học (Pass/Fail)',
      titleEn: '007. Score pass or fail',
      category: 'Range Check',
      difficulty: 'Easy',
      descriptionVi: 'Nhập vào điểm thi của sinh viên thang điểm từ 0.0 đến 10.0. In ra "Pass" nếu điểm >= 5.0, "Fail" nếu điểm < 5.0, và "Invalid score" nếu điểm nằm ngoài đoạn [0, 10].',
      descriptionEn: 'Read a student\'s score from 0 to 10. Display "Pass" if score >= 5, "Fail" if score < 5, and "Invalid score" if score is outside [0, 10].',
      initialCode: `#include <stdio.h>

int main() {
    float score;
    if (scanf("%f", &score) == 1) {
        if (score < 0.0 || score > 10.0) {
            printf("Invalid score\\n");
        } else if (score >= 5.0) {
            printf("Pass\\n");
        } else {
            printf("Fail\\n");
        }
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
    float score;
    if (scanf("%f", &score) == 1) {
        if (score < 0 || score > 10) printf("Invalid score\\n");
        else if (score >= 5) printf("Pass\\n");
        else printf("Fail\\n");
    }
    return 0;
}`,
      testcases: [
        {
          input: '7.5',
          expectedOutput: 'Pass',
          explanationVi: '7.5 nằm trong [5, 10], kết quả là Pass.',
          explanationEn: '7.5 is within [5, 10], result is Pass.'
        },
        {
          input: '3.2',
          expectedOutput: 'Fail',
          explanationVi: '3.2 nằm trong [0, 5), kết quả là Fail.',
          explanationEn: '3.2 is within [0, 5), result is Fail.'
        },
        {
          input: '11.5',
          expectedOutput: 'Invalid score',
          explanationVi: '11.5 vượt quá 10, in Invalid score.',
          explanationEn: '11.5 exceeds 10, prints Invalid score.'
        }
      ],
      hintsVi: ['Kiểm tra điều kiện biên `score < 0 || score > 10` trước tiên.'],
      hintsEn: ['Validate bounds `score < 0 || score > 10` first.']
    },
    {
      id: 'fptu-q10',
      questionCode: 'Q010',
      titleVi: '010. Xét duyệt hồ sơ trúng tuyển Đại học',
      titleEn: '010. University admission eligibility',
      category: 'Complex Logic',
      difficulty: 'Medium',
      descriptionVi: 'Đọc vào tuổi (age), điểm toán (math), tiếng anh (english), và lập trình (programming). Đủ điều kiện ("Eligible") nếu: 18 <= age <= 25, math >= 6.0, english >= 5.0, programming >= 6.5, và điểm trung bình >= 6.0. Ngược lại in "Not Eligible".',
      descriptionEn: 'Reads age, math, english, and programming. Eligible if: 18 <= age <= 25, math >= 6.0, english >= 5.0, programming >= 6.5, and average >= 6.0. Display "Eligible" or "Not Eligible".',
      initialCode: `#include <stdio.h>

int main() {
    int age;
    float math, english, programming;
    if (scanf("%d %f %f %f", &age, &math, &english, &programming) == 4) {
        float avg = (math + english + programming) / 3.0;
        if (age >= 18 && age <= 25 && math >= 6.0 && english >= 5.0 && programming >= 6.5 && avg >= 6.0) {
            printf("Eligible\\n");
        } else {
            printf("Not Eligible\\n");
        }
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
    int age;
    float m, e, p;
    if (scanf("%d %f %f %f", &age, &m, &e, &p) == 4) {
        float avg = (m + e + p) / 3.0;
        if (age >= 18 && age <= 25 && m >= 6.0 && e >= 5.0 && p >= 6.5 && avg >= 6.0) {
            printf("Eligible\\n");
        } else {
            printf("Not Eligible\\n");
        }
    }
    return 0;
}`,
      testcases: [
        {
          input: '19 7.0 6.5 8.0',
          expectedOutput: 'Eligible',
          explanationVi: 'Tuổi 19, điểm toán 7.0, anh 6.5, code 8.0, TB 7.17 -> Thỏa mãn.',
          explanationEn: 'Age 19, math 7.0, english 6.5, code 8.0, avg 7.17 -> Eligible.'
        },
        {
          input: '20 5.5 6.0 7.0',
          expectedOutput: 'Not Eligible',
          explanationVi: 'Toán 5.5 < 6.0 -> Không đạt.',
          explanationEn: 'Math 5.5 < 6.0 -> Not Eligible.'
        }
      ],
      hintsVi: ['Tính trung bình cộng `(math + english + programming) / 3.0`.'],
      hintsEn: ['Compute average with `(math + english + programming) / 3.0`.']
    }
  ],

  // Giai đoạn 1 - Bài 4: Cấu trúc rẽ nhánh & Switch-Case
  'c-1-selection': [
    {
      id: 'fptu-q4',
      questionCode: 'Q004',
      titleVi: '004. Tìm giá trị lớn nhất của ba số nguyên',
      titleEn: '004. Find maximum of three integers',
      category: 'Conditionals',
      difficulty: 'Easy',
      descriptionVi: 'Viết chương trình C nhận vào ba số nguyên a, b, c và in ra giá trị lớn nhất trong ba số.',
      descriptionEn: 'Write a program in C/C++ that accepts three integers a, b, and c as input and outputs the largest value among the three integers.',
      initialCode: `#include <stdio.h>

int main() {
    int a, b, c;
    if (scanf("%d %d %d", &a, &b, &c) == 3) {
        int max = a;
        if (b > max) max = b;
        if (c > max) max = c;
        printf("%d\\n", max);
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
    int a, b, c;
    if (scanf("%d %d %d", &a, &b, &c) == 3) {
        int max = a;
        if (b > max) max = b;
        if (c > max) max = c;
        printf("%d\\n", max);
    }
    return 0;
}`,
      testcases: [
        {
          input: '3 5 -7',
          expectedOutput: '5',
          explanationVi: 'Số lớn nhất giữa 3, 5 và -7 là 5.',
          explanationEn: 'Maximum among 3, 5, and -7 is 5.'
        },
        {
          input: '100 45 99',
          expectedOutput: '100',
          explanationVi: '100 lớn hơn 45 và 99.',
          explanationEn: '100 is greater than 45 and 99.'
        }
      ],
      hintsVi: ['Khởi tạo `max = a` rồi lần lượt so sánh với b và c.'],
      hintsEn: ['Initialize `max = a` then compare with b and c.']
    },
    {
      id: 'fptu-q11',
      questionCode: 'Q011',
      titleVi: '011. Xác định thứ trong tuần bằng Switch-Case',
      titleEn: '011. Day of the Week',
      category: 'Switch-Case',
      difficulty: 'Easy',
      descriptionVi: 'Nhập số nguyên đại diện cho thứ từ 1 đến 7 và in ra tên ngày trong tuần bằng tiếng Anh: 1 -> Monday, 2 -> Tuesday, 3 -> Wednesday, 4 -> Thursday, 5 -> Friday, 6 -> Saturday, 7 -> Sunday. Nếu ngoài khoảng 1-7 in "Invalid day".',
      descriptionEn: 'Read an integer day from 1 to 7 and display the corresponding day of the week: 1 -> Monday, 2 -> Tuesday, 3 -> Wednesday, 4 -> Thursday, 5 -> Friday, 6 -> Saturday, 7 -> Sunday. Outside 1-7 -> Invalid day.',
      initialCode: `#include <stdio.h>

int main() {
    int day;
    if (scanf("%d", &day) == 1) {
        switch (day) {
            case 1: printf("Monday\\n"); break;
            case 2: printf("Tuesday\\n"); break;
            case 3: printf("Wednesday\\n"); break;
            case 4: printf("Thursday\\n"); break;
            case 5: printf("Friday\\n"); break;
            case 6: printf("Saturday\\n"); break;
            case 7: printf("Sunday\\n"); break;
            default: printf("Invalid day\\n"); break;
        }
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
    int day;
    if (scanf("%d", &day) == 1) {
        switch (day) {
            case 1: printf("Monday\\n"); break;
            case 2: printf("Tuesday\\n"); break;
            case 3: printf("Wednesday\\n"); break;
            case 4: printf("Thursday\\n"); break;
            case 5: printf("Friday\\n"); break;
            case 6: printf("Saturday\\n"); break;
            case 7: printf("Sunday\\n"); break;
            default: printf("Invalid day\\n"); break;
        }
    }
    return 0;
}`,
      testcases: [
        {
          input: '4',
          expectedOutput: 'Thursday',
          explanationVi: 'Số 4 tương ứng với Thứ Năm (Thursday).',
          explanationEn: 'Day 4 corresponds to Thursday.'
        },
        {
          input: '8',
          expectedOutput: 'Invalid day',
          explanationVi: 'Số 8 ngoài khoảng 1-7, in Invalid day.',
          explanationEn: 'Day 8 is outside 1-7, prints Invalid day.'
        }
      ],
      hintsVi: ['Nhớ sử dụng lệnh `break;` sau mỗi nhánh `case`.'],
      hintsEn: ['Remember to place `break;` after each `case`.']
    },
    {
      id: 'fptu-q12',
      questionCode: 'Q012',
      titleVi: '012. Máy tính số học bỏ túi (Simple Calculator)',
      titleEn: '012. Simple Calculator',
      category: 'Switch-Case',
      difficulty: 'Medium',
      descriptionVi: 'Nhập vào hai số thực a, b và một ký tự toán tử (+, -, *, /). Thực hiện phép toán bằng switch-case. Nếu số chia b = 0 trong phép chia (/), in ra "Divide by zero". Nếu toán tử không được hỗ trợ, in ra "Invalid operator". Kết quả phép nhân in ra dạng số nguyên nếu là số nguyên hoặc làm tròn phù hợp.',
      descriptionEn: 'Reads two floating-point numbers a and b, followed by an arithmetic operator (+, -, *, /). Perform calculation using switch-case. If divisor is 0 in division (/), display "Divide by zero". If unsupported, display "Invalid operator".',
      initialCode: `#include <stdio.h>

int main() {
    double a, b;
    char op;
    if (scanf("%lf %lf %c", &a, &b, &op) == 3) {
        switch (op) {
            case '+': printf("%.0f\\n", a + b); break;
            case '-': printf("%.0f\\n", a - b); break;
            case '*': printf("%.0f\\n", a * b); break;
            case '/':
                if (b == 0) printf("Divide by zero\\n");
                else printf("%.2f\\n", a / b);
                break;
            default: printf("Invalid operator\\n"); break;
        }
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
    double a, b;
    char op;
    if (scanf("%lf %lf %c", &a, &b, &op) == 3) {
        switch (op) {
            case '+': printf("%.0f\\n", a + b); break;
            case '-': printf("%.0f\\n", a - b); break;
            case '*': printf("%.0f\\n", a * b); break;
            case '/':
                if (b == 0) printf("Divide by zero\\n");
                else printf("%.2f\\n", a / b);
                break;
            default: printf("Invalid operator\\n"); break;
        }
    }
    return 0;
}`,
      testcases: [
        {
          input: '15 4 *',
          expectedOutput: '60',
          explanationVi: '15 * 4 = 60.',
          explanationEn: '15 * 4 = 60.'
        },
        {
          input: '10 0 /',
          expectedOutput: 'Divide by zero',
          explanationVi: 'Chia cho 0, báo lỗi Divide by zero.',
          explanationEn: 'Division by zero, prints Divide by zero.'
        }
      ],
      hintsVi: ['Sử dụng khoảng trắng trước `%c` trong `scanf("%lf %lf %c")` để bỏ qua ký tự space.'],
      hintsEn: ['Use a space before `%c` in `scanf("%lf %lf %c")` to skip whitespace.']
    }
  ],

  // Giai đoạn 1 - Bài 5: Vòng lặp
  'c-1-loops': [
    {
      id: 'fptu-q3',
      questionCode: 'Q003',
      titleVi: '003. Bảng cửu chương từ 1 đến 10',
      titleEn: '003. Multiplication table',
      category: 'Loops',
      difficulty: 'Easy',
      descriptionVi: 'Nhập số nguyên dương n (0 < n < 10) và in bảng cửu chương của n từ n x 1 đến n x 10 theo định dạng "n x i = res". Nếu n nằm ngoài khoảng (0, 10), in ra "out of range".',
      descriptionEn: 'Accepts a positive integer n (0 < n < 10) as input and prints the multiplication table of that integer (from n x 1 to n x 10). If n is outside (0, 10), print "out of range".',
      initialCode: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        if (n <= 0 || n >= 10) {
            printf("out of range\\n");
        } else {
            for (int i = 1; i <= 10; i++) {
                printf("%d x %d = %d\\n", n, i, n * i);
            }
        }
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        if (n <= 0 || n >= 10) {
            printf("out of range\\n");
        } else {
            for (int i = 1; i <= 10; i++) {
                printf("%d x %d = %d\\n", n, i, n * i);
            }
        }
    }
    return 0;
}`,
      testcases: [
        {
          input: '5',
          expectedOutput: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50',
          explanationVi: 'In bảng cửu chương 5 từ 1 đến 10.',
          explanationEn: 'Prints 5 times table from 1 to 10.'
        },
        {
          input: '12',
          expectedOutput: 'out of range',
          explanationVi: '12 >= 10, in out of range.',
          explanationEn: '12 >= 10, prints out of range.'
        }
      ],
      hintsVi: ['Sử dụng vòng lặp `for (int i = 1; i <= 10; i++)`.'],
      hintsEn: ['Use loop `for (int i = 1; i <= 10; i++)`.']
    },
    {
      id: 'fptu-q25',
      questionCode: 'Q025',
      titleVi: '025. Đếm số chữ số của một số nguyên',
      titleEn: '025. Count Digits of an Integer',
      category: 'While Loop',
      difficulty: 'Medium',
      descriptionVi: 'Nhập vào một số nguyên dương n. Sử dụng vòng lặp với các phép toán số học (không đổi sang chuỗi string) để đếm xem số nguyên n có bao nhiêu chữ số. In ra định dạng "Number of digits = <count>".',
      descriptionEn: 'Write a C program that reads a positive integer n. Use a loop with arithmetic operations (do not convert to string) to determine how many digits the integer contains. Format: "Number of digits = <count>".',
      initialCode: `#include <stdio.h>

int main() {
    long long n;
    if (scanf("%lld", &n) == 1) {
        int count = 0;
        long long temp = n;
        if (temp == 0) count = 1;
        else {
            while (temp > 0) {
                count++;
                temp /= 10;
            }
        }
        printf("Number of digits = %d\\n", count);
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
    long long n;
    if (scanf("%lld", &n) == 1) {
        int count = 0;
        long long temp = n;
        if (temp == 0) count = 1;
        while (temp > 0) {
            count++;
            temp /= 10;
        }
        printf("Number of digits = %d\\n", count);
    }
    return 0;
}`,
      testcases: [
        {
          input: '58321',
          expectedOutput: 'Number of digits = 5',
          explanationVi: 'Số 58321 có 5 chữ số.',
          explanationEn: 'Number 58321 contains 5 digits.'
        }
      ],
      hintsVi: ['Mỗi lần lặp chia nguyên `temp /= 10` và tăng biến đếm lên 1.'],
      hintsEn: ['Divide `temp /= 10` in each iteration and increment count.']
    }
  ],

  // Giai đoạn 1 - Bài 6: Dự án CLI
  'c-1-project': [
    {
      id: 'fptu-q15',
      questionCode: 'Q015',
      titleVi: '015. Menu chuyển đổi đơn vị đo lường',
      titleEn: '015. Menu-Driven Unit Converter',
      category: 'Menu-Driven',
      difficulty: 'Medium',
      descriptionVi: 'Đọc vào mã lựa chọn (1-6) và giá trị cần chuyển đổi: 1: KM sang Miles (val * 0.621371), 2: Miles sang KM (val * 1.60934), 3: KG sang Pounds (val * 2.20462), 4: Pounds sang KG (val * 0.453592), 5: Celsius sang Fahrenheit (val * 9/5 + 32), 6: Fahrenheit sang Celsius ((val - 32) * 5/9). Định dạng in theo mẫu: "<Unit>: <value_4_decimals>".',
      descriptionEn: 'Reads an option (1-6) and a value to convert (1: KM to Miles, 2: Miles to KM, 3: KG to Pounds, 4: Pounds to KG, 5: Celsius to Fahrenheit, 6: Fahrenheit to Celsius). Output format: "<Unit>: <value_4_decimals>".',
      initialCode: `#include <stdio.h>

int main() {
    int opt;
    double val;
    if (scanf("%d %lf", &opt, &val) == 2) {
        switch (opt) {
            case 1: printf("Miles: %.4f\\n", val * 0.621371); break;
            case 2: printf("Kilometers: %.4f\\n", val * 1.60934); break;
            case 3: printf("Pounds: %.4f\\n", val * 2.20462); break;
            case 4: printf("Kilograms: %.4f\\n", val * 0.453592); break;
            case 5: printf("Fahrenheit: %.4f\\n", val * 9.0 / 5.0 + 32.0); break;
            case 6: printf("Celsius: %.4f\\n", (val - 32.0) * 5.0 / 9.0); break;
            default: printf("Invalid option\\n"); break;
        }
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
    int opt;
    double val;
    if (scanf("%d %lf", &opt, &val) == 2) {
        switch (opt) {
            case 1: printf("Miles: %.4f\\n", val * 0.621371); break;
            case 2: printf("Kilometers: %.4f\\n", val * 1.60934); break;
            case 3: printf("Pounds: %.4f\\n", val * 2.20462); break;
            case 4: printf("Kilograms: %.4f\\n", val * 0.453592); break;
            case 5: printf("Fahrenheit: %.4f\\n", val * 9.0 / 5.0 + 32.0); break;
            case 6: printf("Celsius: %.4f\\n", (val - 32.0) * 5.0 / 9.0); break;
            default: printf("Invalid option\\n"); break;
        }
    }
    return 0;
}`,
      testcases: [
        {
          input: '3 10',
          expectedOutput: 'Pounds: 22.0462',
          explanationVi: 'Lựa chọn 3: 10 KG * 2.20462 = 22.0462 Pounds.',
          explanationEn: 'Option 3: 10 KG * 2.20462 = 22.0462 Pounds.'
        }
      ],
      hintsVi: ['Làm tròn 4 chữ số thập phân bằng `%.4f`.'],
      hintsEn: ['Round to 4 decimals using `%.4f`.']
    }
  ],

  // Giai đoạn 1 - Bài 7: Quiz & Logic
  'c-1-quiz': [
    {
      id: 'fptu-q6',
      questionCode: 'Q006',
      titleVi: '006. Kiểm tra số chẵn hay số lẻ (Even or odd number)',
      titleEn: '006. Even or odd number',
      category: 'Conditionals & Bitwise',
      difficulty: 'Easy',
      descriptionVi: 'Đọc vào một số nguyên n và xác định xem n là số chẵn ("Even") hay số lẻ ("Odd").',
      descriptionEn: 'Read an integer n and determine whether n is an even number ("Even") or an odd number ("Odd").',
      initialCode: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        if ((n & 1) == 0) {
            printf("Even\\n");
        } else {
            printf("Odd\\n");
        }
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        if (n % 2 == 0) printf("Even\\n");
        else printf("Odd\\n");
    }
    return 0;
}`,
      testcases: [
        {
          input: '14',
          expectedOutput: 'Even',
          explanationVi: '14 chia hết cho 2 -> Even.',
          explanationEn: '14 is divisible by 2 -> Even.'
        },
        {
          input: '7',
          expectedOutput: 'Odd',
          explanationVi: '7 là số lẻ -> Odd.',
          explanationEn: '7 is odd -> Odd.'
        }
      ],
      hintsVi: ['Sử dụng phép toán `(n & 1) == 0` hoặc `n % 2 == 0`.'],
      hintsEn: ['Use bitwise `(n & 1) == 0` or modulo `n % 2 == 0`.']
    }
  ],

  // Giai đoạn 2 - Bài 1: Phân vùng RAM & Swap
  'c-2-memory-swap': [
    {
      id: 'fptu-q-swap',
      questionCode: 'Q-MEM01',
      titleVi: 'Hoán vị 2 số nguyên sử dụng con trỏ & Stack Frame',
      titleEn: 'Swap Two Integers with Pointers',
      category: 'Stack & Pointers',
      difficulty: 'Medium',
      descriptionVi: 'Cài đặt hàm `void swap(int *a, int *b)` để hoán vị giá trị của 2 biến được lưu trữ trên Stack frame của hàm `main`. In ra giá trị của 2 biến sau khi hoán vị.',
      descriptionEn: 'Implement function `void swap(int *a, int *b)` to exchange the values of two integers located on main\'s stack frame. Print the two integers after swapping.',
      initialCode: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x, y;
    if (scanf("%d %d", &x, &y) == 2) {
        swap(&x, &y);
        printf("%d %d\\n", x, y);
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
        printf("%d %d\\n", x, y);
    }
    return 0;
}`,
      testcases: [
        {
          input: '15 90',
          expectedOutput: '90 15',
          explanationVi: 'Sau khi swap(&x, &y), x nhận giá trị 90 và y nhận 15.',
          explanationEn: 'After swap(&x, &y), x becomes 90 and y becomes 15.'
        }
      ],
      hintsVi: ['Truyền địa chỉ `swap(&x, &y)` và giải tham chiếu `*a`.'],
      hintsEn: ['Pass addresses `swap(&x, &y)` and dereference `*a`.']
    }
  ],

  // Giai đoạn 2 - Bài 2: Con trỏ & Duyệt bộ nhớ
  'c-2-pointers': [
    {
      id: 'fptu-q61',
      questionCode: 'Q061',
      titleVi: '061. Đếm số từ trong câu bằng con trỏ',
      titleEn: '061. Count Words in a Sentence',
      category: 'Pointer String Traversal',
      difficulty: 'Medium',
      descriptionVi: 'Nhập vào một chuỗi ký tự. Sử dụng con trỏ duyệt qua chuỗi để đếm số lượng từ (phân cách bởi dấu cách). In ra: "Number of words: <count>".',
      descriptionEn: 'Write a C program that reads a sentence. Use pointer traversal to count how many words are in the sentence (separated by spaces). Output: "Number of words: <count>".',
      initialCode: `#include <stdio.h>
#include <ctype.h>

int main() {
    char str[1000];
    if (fgets(str, sizeof(str), stdin)) {
        char *ptr = str;
        int wordCount = 0;
        int inWord = 0;
        
        while (*ptr != '\\0' && *ptr != '\\n') {
            if (!isspace((unsigned char)*ptr)) {
                if (!inWord) {
                    wordCount++;
                    inWord = 1;
                }
            } else {
                inWord = 0;
            }
            ptr++;
        }
        printf("Number of words: %d\\n", wordCount);
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>
#include <ctype.h>

int main() {
    char str[1000];
    if (fgets(str, sizeof(str), stdin)) {
        char *ptr = str;
        int words = 0, inWord = 0;
        while (*ptr && *ptr != '\\n') {
            if (!isspace((unsigned char)*ptr)) {
                if (!inWord) { words++; inWord = 1; }
            } else inWord = 0;
            ptr++;
        }
        printf("Number of words: %d\\n", words);
    }
    return 0;
}`,
      testcases: [
        {
          input: 'C programming is interesting',
          expectedOutput: 'Number of words: 4',
          explanationVi: 'Câu gồm 4 từ: "C", "programming", "is", "interesting".',
          explanationEn: 'Sentence contains 4 words: "C", "programming", "is", "interesting".'
        }
      ],
      hintsVi: ['Dùng con trỏ `char *ptr = str;` và tiến tới bằng `ptr++`.'],
      hintsEn: ['Traverse with `char *ptr = str;` and advance with `ptr++`.']
    }
  ],

  // Giai đoạn 2 - Bài 3: Cấp phát bộ nhớ động
  'c-2-dynamic-alloc': [
    {
      id: 'fptu-q-heap01',
      questionCode: 'Q-HEAP01',
      titleVi: 'Cấp phát mảng động trên Heap với malloc',
      titleEn: 'Dynamic Array Allocation on Heap',
      category: 'Dynamic Memory',
      difficulty: 'Medium',
      descriptionVi: 'Đọc số nguyên n. Dùng `malloc` để cấp phát bộ nhớ động cho mảng gồm n số nguyên trên Heap. Đọc n phần tử, tính tổng và in ra: "Sum: <sum>". Sau khi tính xong, giải phóng bộ nhớ với `free`.',
      descriptionEn: 'Read integer n. Dynamically allocate an array of n integers using malloc() on the Heap. Read n values, compute their sum, print "Sum: <sum>", and safely call free().',
      initialCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1 && n > 0) {
        int *arr = (int *)malloc(n * sizeof(int));
        if (arr == NULL) return 1;
        
        long long sum = 0;
        for (int i = 0; i < n; i++) {
            scanf("%d", &arr[i]);
            sum += arr[i];
        }
        
        printf("Sum: %lld\\n", sum);
        free(arr);
        arr = NULL;
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1 && n > 0) {
        int *arr = (int *)malloc(n * sizeof(int));
        long long sum = 0;
        for (int i = 0; i < n; i++) {
            scanf("%d", arr + i);
            sum += *(arr + i);
        }
        printf("Sum: %lld\\n", sum);
        free(arr);
    }
    return 0;
}`,
      testcases: [
        {
          input: '5\n10 20 30 40 50',
          expectedOutput: 'Sum: 150',
          explanationVi: 'Tổng của 5 phần tử: 10 + 20 + 30 + 40 + 50 = 150.',
          explanationEn: 'Sum of 5 elements: 10 + 20 + 30 + 40 + 50 = 150.'
        }
      ],
      hintsVi: ['Luôn kiểm tra `arr != NULL` sau khi gọi malloc và `free(arr)` khi dùng xong.'],
      hintsEn: ['Always check `arr != NULL` after malloc and call `free(arr)` when done.']
    }
  ],

  // Giai đoạn 2 - Bài 4: Memory Leak & Dangling Pointer
  'c-2-memory-leak': [
    {
      id: 'fptu-q-safe-free',
      questionCode: 'Q-HEAP02',
      titleVi: 'Kỹ thuật dọn dẹp bộ nhớ & Triệt tiêu Dangling Pointer',
      titleEn: 'Safe Free & Dangling Pointer Prevention',
      category: 'Memory Safety',
      difficulty: 'Medium',
      descriptionVi: 'Cấp phát động vùng nhớ cho chuỗi, in thông báo, giải phóng bằng `free(ptr)` và ngay sau đó gán `ptr = NULL` để ngăn ngừa lỗi truy cập vùng nhớ rác. In ra "Memory freed and pointer secured".',
      descriptionEn: 'Dynamically allocate memory for a string buffer, print content, release it using free(ptr), and assign ptr = NULL immediately to prevent dangling pointer access. Output "Memory freed and pointer secured".',
      initialCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    char *buffer = (char *)malloc(64 * sizeof(char));
    if (buffer != NULL) {
        // Giải phóng và gán NULL
        free(buffer);
        buffer = NULL;
        
        if (buffer == NULL) {
            printf("Memory freed and pointer secured\\n");
        }
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    char *buffer = (char *)malloc(64);
    free(buffer);
    buffer = NULL;
    printf("Memory freed and pointer secured\\n");
    return 0;
}`,
      testcases: [
        {
          input: '',
          expectedOutput: 'Memory freed and pointer secured',
          explanationVi: 'Con trỏ đã được free và gán an toàn về NULL.',
          explanationEn: 'Pointer safely freed and assigned to NULL.'
        }
      ],
      hintsVi: ['Gán `ptr = NULL` ngay sau khi gọi `free(ptr);`.'],
      hintsEn: ['Assign `ptr = NULL` right after calling `free(ptr);`.']
    }
  ],

  // Giai đoạn 2 - Bài 5: struct & typedef
  'c-2-struct': [
    {
      id: 'fptu-q78',
      questionCode: 'Q078',
      titleVi: '078. Quản lý thông tin Sách bằng struct',
      titleEn: '078. Book Information',
      category: 'Struct Basics',
      difficulty: 'Easy',
      descriptionVi: 'Định nghĩa cấu trúc Book gồm các trường: id (mã sách), title (tựa đề), author (tác giả), và price (giá tiền). Đọc thông tin của một quyển sách và in ra định dạng:\\nBook ID: <id>\\nTitle: <title>\\nAuthor: <author>\\nPrice: <price_2_decimals>.',
      descriptionEn: 'Define a structure named Book with fields: id, title, author, and price. Read information for one book and display formatted:\\nBook ID: <id>\\nTitle: <title>\\nAuthor: <author>\\nPrice: <price_2_decimals>.',
      initialCode: `#include <stdio.h>
#include <string.h>

typedef struct {
    char id[50];
    char title[100];
    char author[100];
    double price;
} Book;

int main() {
    Book b;
    if (scanf("%s", b.id) == 1) {
        // Đọc ký tự thừa
        getchar();
        fgets(b.title, sizeof(b.title), stdin);
        b.title[strcspn(b.title, "\\r\\n")] = 0;
        
        fgets(b.author, sizeof(b.author), stdin);
        b.author[strcspn(b.author, "\\r\\n")] = 0;
        
        scanf("%lf", &b.price);
        
        printf("Book ID: %s\\n", b.id);
        printf("Title: %s\\n", b.title);
        printf("Author: %s\\n", b.author);
        printf("Price: %.2f\\n", b.price);
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>
#include <string.h>

typedef struct {
    char id[50];
    char title[100];
    char author[100];
    double price;
} Book;

int main() {
    Book b;
    if (scanf("%s", b.id) == 1) {
        getchar();
        fgets(b.title, sizeof(b.title), stdin);
        b.title[strcspn(b.title, "\\r\\n")] = 0;
        fgets(b.author, sizeof(b.author), stdin);
        b.author[strcspn(b.author, "\\r\\n")] = 0;
        scanf("%lf", &b.price);
        printf("Book ID: %s\\nTitle: %s\\nAuthor: %s\\nPrice: %.2f\\n", b.id, b.title, b.author, b.price);
    }
    return 0;
}`,
      testcases: [
        {
          input: 'B101\nThe C Programming Language\nDennis Ritchie\n45.50',
          expectedOutput: 'Book ID: B101\nTitle: The C Programming Language\nAuthor: Dennis Ritchie\nPrice: 45.50',
          explanationVi: 'In thông tin sách chính xác theo 4 trường.',
          explanationEn: 'Prints 4 formatted fields of Book struct.'
        }
      ],
      hintsVi: ['Sử dụng `strcspn(str, "\\r\\n") = 0` để xóa ký tự xuống dòng từ `fgets`.'],
      hintsEn: ['Use `strcspn(str, "\\r\\n") = 0` to trim trailing newline from `fgets`.']
    }
  ],

  // Giai đoạn 2 - Bài 6: Mini-Project Quản lý Nhân sự
  'c-2-mini-project': [
    {
      id: 'fptu-q79',
      questionCode: 'Q079',
      titleVi: '079. Tính lương Nhân viên theo ngày công',
      titleEn: '079. Employee Salary',
      category: 'Struct Calculation',
      difficulty: 'Medium',
      descriptionVi: 'Định nghĩa struct Employee (id, name, basicSalary, workingDays). Tính Lương Ngày = basicSalary / 26 và Tổng Lương = Lương Ngày * workingDays. In thông tin:\\nEmployee ID: <id>\\nName: <name>\\nSalary: <salary_2_decimals>.',
      descriptionEn: 'Define structure Employee (id, name, basicSalary, workingDays). Calculate Daily Salary = basicSalary / 26 and Salary = Daily Salary * workingDays. Output:\\nEmployee ID: <id>\\nName: <name>\\nSalary: <salary_2_decimals>.',
      initialCode: `#include <stdio.h>
#include <string.h>

typedef struct {
    char id[50];
    char name[100];
    double basicSalary;
    int workingDays;
} Employee;

int main() {
    Employee emp;
    if (scanf("%s", emp.id) == 1) {
        scanf("%s", emp.name);
        scanf("%lf %d", &emp.basicSalary, &emp.workingDays);
        
        double dailySalary = emp.basicSalary / 26.0;
        double totalSalary = dailySalary * emp.workingDays;
        
        printf("Employee ID: %s\\n", emp.id);
        printf("Name: %s\\n", emp.name);
        printf("Salary: %.2f\\n", totalSalary);
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>

typedef struct {
    char id[50];
    char name[100];
    double basicSalary;
    int workingDays;
} Employee;

int main() {
    Employee emp;
    if (scanf("%s %s %lf %d", emp.id, emp.name, &emp.basicSalary, &emp.workingDays) == 4) {
        double salary = (emp.basicSalary / 26.0) * emp.workingDays;
        printf("Employee ID: %s\\nName: %s\\nSalary: %.2f\\n", emp.id, emp.name, salary);
    }
    return 0;
}`,
      testcases: [
        {
          input: 'E102\nJohn\n1560\n24',
          expectedOutput: 'Employee ID: E102\nName: John\nSalary: 1440.00',
          explanationVi: 'Lương ngày: 1560 / 26 = 60. Tổng lương: 60 * 24 = 1440.00.',
          explanationEn: 'Daily salary: 1560 / 26 = 60. Total: 60 * 24 = 1440.00.'
        }
      ],
      hintsVi: ['Chia cho `26.0` để giữ độ chính xác số thực double.'],
      hintsEn: ['Divide by `26.0` to retain double floating-point precision.']
    },
    {
      id: 'fptu-q87',
      questionCode: 'Q087',
      titleVi: '087. Hệ thống Tìm kiếm & Lọc Nhân sự theo Phòng ban',
      titleEn: '087. Employee Management and Search',
      category: 'Struct Array System',
      difficulty: 'Hard',
      descriptionVi: 'Quản lý mảng n nhân viên (id, name, department, salary). Tìm nhân viên lương cao nhất, tính lương trung bình, tìm kiếm nhân viên theo mã searchId, và lọc danh sách nhân viên thuộc phòng ban filterDept.',
      descriptionEn: 'Manage array of Employee structures (id, name, department, salary). Find highest salary employee, average salary, search by id, and filter by department.',
      initialCode: `#include <stdio.h>
#include <string.h>

typedef struct {
    char id[20];
    char name[50];
    char dept[50];
    double salary;
} Employee;

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        Employee arr[50];
        double totalSalary = 0;
        int maxIdx = 0;
        
        for (int i = 0; i < n; i++) {
            scanf("%s %s %s %lf", arr[i].id, arr[i].name, arr[i].dept, &arr[i].salary);
            totalSalary += arr[i].salary;
            if (arr[i].salary > arr[maxIdx].salary) {
                maxIdx = i;
            }
        }
        
        char searchId[20], filterDept[50];
        scanf("%s", searchId);
        scanf("%s", filterDept);
        
        printf("Highest salary:\\n%s %s %s %.2f\\n", arr[maxIdx].id, arr[maxIdx].name, arr[maxIdx].dept, arr[maxIdx].salary);
        printf("Average salary: %.2f\\n", totalSalary / n);
        
        printf("Search result:\\n");
        int found = 0;
        for (int i = 0; i < n; i++) {
            if (strcmp(arr[i].id, searchId) == 0) {
                printf("%s %s %s %.2f\\n", arr[i].id, arr[i].name, arr[i].dept, arr[i].salary);
                found = 1;
                break;
            }
        }
        if (!found) printf("Not found\\n");
        
        printf("Employees in %s:\\n", filterDept);
        for (int i = 0; i < n; i++) {
            if (strcmp(arr[i].dept, filterDept) == 0) {
                printf("%s %s %s %.2f\\n", arr[i].id, arr[i].name, arr[i].dept, arr[i].salary);
            }
        }
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>
#include <string.h>

typedef struct {
    char id[20];
    char name[50];
    char dept[50];
    double salary;
} Employee;

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        Employee arr[50];
        double total = 0;
        int maxIdx = 0;
        for (int i = 0; i < n; i++) {
            scanf("%s %s %s %lf", arr[i].id, arr[i].name, arr[i].dept, &arr[i].salary);
            total += arr[i].salary;
            if (arr[i].salary > arr[maxIdx].salary) maxIdx = i;
        }
        char sId[20], fDept[50];
        scanf("%s %s", sId, fDept);
        printf("Highest salary:\\n%s %s %s %.2f\\n", arr[maxIdx].id, arr[maxIdx].name, arr[maxIdx].dept, arr[maxIdx].salary);
        printf("Average salary: %.2f\\n", total / n);
        printf("Search result:\\n");
        for (int i = 0; i < n; i++) {
            if (strcmp(arr[i].id, sId) == 0) {
                printf("%s %s %s %.2f\\n", arr[i].id, arr[i].name, arr[i].dept, arr[i].salary);
                break;
            }
        }
        printf("Employees in %s:\\n", fDept);
        for (int i = 0; i < n; i++) {
            if (strcmp(arr[i].dept, fDept) == 0) {
                printf("%s %s %s %.2f\\n", arr[i].id, arr[i].name, arr[i].dept, arr[i].salary);
            }
        }
    }
    return 0;
}`,
      testcases: [
        {
          input: '4\nE01 Alice IT 2500\nE02 Bob HR 2200\nE03 David IT 3000\nE04 Emma Sales 2800\nE03\nIT',
          expectedOutput: 'Highest salary:\nE03 David IT 3000.00\nAverage salary: 2625.00\nSearch result:\nE03 David IT 3000.00\nEmployees in IT:\nE01 Alice IT 2500.00\nE03 David IT 3000.00',
          explanationVi: 'Lương cao nhất là David (3000). Lương TB: 10500/4 = 2625. Tìm thấy E03. Phòng IT gồm Alice và David.',
          explanationEn: 'Highest is David (3000). Avg: 2625. Found E03. IT department has Alice and David.'
        }
      ],
      hintsVi: ['Sử dụng hàm `strcmp(str1, str2) == 0` để so sánh chuỗi.'],
      hintsEn: ['Use `strcmp(str1, str2) == 0` for string comparison.']
    }
  ],

  // Giai đoạn 2 - Bài 7: Code Review & Bug Audit
  'c-2-code-review': [
    {
      id: 'fptu-q86',
      questionCode: 'Q086',
      titleVi: '086. Quản lý Tài khoản Ngân hàng (Cập nhật số dư)',
      titleEn: '086. Bank Account Management',
      category: 'Struct & Pointer Update',
      difficulty: 'Medium',
      descriptionVi: 'Định nghĩa struct BankAccount (accountNumber, ownerName, balance). Đọc n tài khoản, một số tài khoản cần nạp và số tiền nạp. Cập nhật số dư nếu tìm thấy tài khoản (Account updated:\\n<accountNumber> <ownerName> <balance_2_decimals>), ngược lại in "Account not found".',
      descriptionEn: 'Define BankAccount (accountNumber, ownerName, balance). Read n accounts, an account number, and deposit amount. Update balance if found (Account updated:\\n<accountNumber> <ownerName> <balance_2_decimals>), otherwise display "Account not found".',
      initialCode: `#include <stdio.h>
#include <string.h>

typedef struct {
    char accountNumber[30];
    char ownerName[50];
    double balance;
} BankAccount;

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        BankAccount accounts[20];
        for (int i = 0; i < n; i++) {
            scanf("%s %s %lf", accounts[i].accountNumber, accounts[i].ownerName, &accounts[i].balance);
        }
        
        char targetAcc[30];
        double depositAmount;
        scanf("%s %lf", targetAcc, &depositAmount);
        
        int found = 0;
        for (int i = 0; i < n; i++) {
            if (strcmp(accounts[i].accountNumber, targetAcc) == 0) {
                accounts[i].balance += depositAmount;
                printf("Account updated:\\n%s %s %.2f\\n", accounts[i].accountNumber, accounts[i].ownerName, accounts[i].balance);
                found = 1;
                break;
            }
        }
        if (!found) printf("Account not found\\n");
    }
    return 0;
}`,
      solutionCode: `#include <stdio.h>
#include <string.h>

typedef struct {
    char acc[30];
    char name[50];
    double balance;
} BankAccount;

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        BankAccount a[20];
        for (int i = 0; i < n; i++) scanf("%s %s %lf", a[i].acc, a[i].name, &a[i].balance);
        char target[30]; double amount;
        scanf("%s %lf", target, &amount);
        for (int i = 0; i < n; i++) {
            if (strcmp(a[i].acc, target) == 0) {
                a[i].balance += amount;
                printf("Account updated:\\n%s %s %.2f\\n", a[i].acc, a[i].name, a[i].balance);
                return 0;
            }
        }
        printf("Account not found\\n");
    }
    return 0;
}`,
      testcases: [
        {
          input: '1\n1001 Alice 5000\n1001 2500',
          expectedOutput: 'Account updated:\n1001 Alice 7500.00',
          explanationVi: 'Tài khoản 1001 nạp thêm 2500, số dư mới là 7500.00.',
          explanationEn: 'Account 1001 deposits 2500, new balance is 7500.00.'
        }
      ],
      hintsVi: ['Tìm tài khoản bằng `strcmp` và tăng trường `accounts[i].balance += depositAmount`.'],
      hintsEn: ['Match account using `strcmp` and update `accounts[i].balance += depositAmount`.']
    }
  ]
};
