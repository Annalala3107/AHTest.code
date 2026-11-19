import type { AcademyCourse } from '../../types/index.ts';

export const javaCourse: AcademyCourse = {
  id: 'java-core',
  slug: 'java-21-oop-algorithms',
  title: 'Java 21 Thực Chiến & Thuật Toán (OOP -> CP)',
  titleEn: 'Java 21 Core & Competitive Programming',
  language: 'java',
  level: 'Beginner',
  description:
    'Làm chủ Java 21 từ Scanner I/O, vòng lặp, mảng một chiều đến Arrays.sort() cho phỏng vấn kỹ thuật và lập trình thi đấu.',
  descriptionEn:
    'Master Java 21 from Scanner I/O, control flow, arrays to Arrays.sort() for coding interviews and competitive programming.',
  totalLessons: 3,
  estimatedHours: 3,
  isComingSoon: false,
  modules: [
    {
      id: 'java-mod-1',
      title: 'Chương 1: Java 21 Nền Tảng & Nhập Xuất Chuẩn',
      titleEn: 'Chapter 1: Java 21 Fundamentals & Standard I/O',
      description: 'Xử lý đầu vào với Scanner và định dạng đầu ra chuẩn xác với System.out.println.',
      descriptionEn: 'Handle input cleanly with Scanner and output formatting via System.out.println.',
      lessons: [
        {
          id: 'java-1-io',
          title: 'Bài 1: Nhập xuất chuẩn với Scanner & System.out',
          titleEn: 'Lesson 1: Standard I/O with Scanner',
          durationMinutes: 6,
          summary: 'Đọc chuỗi và số nguyên bằng Scanner trong Java 21.',
          summaryEn: 'Read strings and integers using Java Scanner.',
          content: `### 1. Cấu trúc một chương trình Java chuẩn
Mọi chương trình Java chạy từ phương thức \`public static void main(String[] args)\` nằm trong lớp \`Main\`:
\`\`\`java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int score = sc.nextInt();
        System.out.println("Coder " + name + ": " + score + " pts");
    }
}
\`\`\`

### 2. Nhiệm vụ của bạn:
Đọc một từ \`name\` (chuỗi không dấu cách) và một số nguyên \`score\`. In ra đúng định dạng:
\`Coder <name>: <score> pts\``,
          contentEn: `### 1. Standard Java Program Structure
Every Java executable begins at \`public static void main(String[] args)\`:
\`\`\`java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int score = sc.nextInt();
        System.out.println("Coder " + name + ": " + score + " pts");
    }
}
\`\`\`

### 2. Your Task:
Read a token \`name\` and an integer \`score\`, then print \`Coder <name>: <score> pts\`.`,
          initialCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int score = sc.nextInt();
        // TODO: In ra theo định dạng "Coder <name>: <score> pts"
        
    }
}
`,
          solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int score = sc.nextInt();
        System.out.println("Coder " + name + ": " + score + " pts");
    }
}`,
          hints: [
            'Dùng phép nối chuỗi `+`: `System.out.println("Coder " + name + ": " + score + " pts");`',
            'Kiểm tra kỹ dấu hai chấm và khoảng trắng giữa các phần tử.'
          ],
          hintsEn: [
            'Use string concatenation: `System.out.println("Coder " + name + ": " + score + " pts");`',
            'Pay attention to exact spacing and colons.'
          ],
          testcases: [
            { input: 'An\n1500', expectedOutput: 'Coder An: 1500 pts' },
            { input: 'Minh\n2100', expectedOutput: 'Coder Minh: 2100 pts' }
          ]
        },
        {
          id: 'java-1-loop',
          title: 'Bài 2: Vòng lặp for & Tính tổng số chẵn',
          titleEn: 'Lesson 2: Loops & Even Sum Calculation',
          durationMinutes: 7,
          summary: 'Sử dụng vòng lặp for và toán tử modulo % để tính tổng các số chẵn từ 1 đến N.',
          summaryEn: 'Use for loops and modulo operator % to sum even integers from 1 to N.',
          content: `### 1. Vòng lặp trong Java
Vòng lặp \`for\` trong Java có cú pháp quen thuộc tương tự C/C++:
\`\`\`java
long sum = 0;
for (int i = 1; i <= n; i++) {
    if (i % 2 == 0) {
        sum += i;
    }
}
\`\`\`
> 💡 **Mẹo thi đấu**: Khi tổng có thể vượt quá $2 \\times 10^9$, hãy dùng kiểu \`long\` thay vì \`int\`.

### 2. Nhiệm vụ của bạn:
Nhập vào số nguyên dương $N$. In ra tổng các số nguyên dương chẵn nhỏ hơn hoặc bằng $N$.`,
          contentEn: `### 1. Loops in Java
Java \`for\` loops share familiar C-style syntax:
\`\`\`java
long sum = 0;
for (int i = 1; i <= n; i++) {
    if (i % 2 == 0) {
        sum += i;
    }
}
\`\`\`

### 2. Your Task:
Given a positive integer $N$, print the sum of all positive even numbers $\\le N$.`,
          initialCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long sum = 0;
        // TODO: Tính tổng các số chẵn từ 1 đến n
        
        System.out.println(sum);
    }
}
`,
          solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long sum = 0;
        for (int i = 2; i <= n; i += 2) {
            sum += i;
        }
        System.out.println(sum);
    }
}`,
          hints: [
            'Cho vòng lặp chạy `for (int i = 2; i <= n; i += 2)` để cộng trực tiếp các số chẵn.',
            'Đảm bảo khởi tạo `long sum = 0;` trước khi vào vòng lặp.'
          ],
          hintsEn: [
            'Loop with step 2: `for (int i = 2; i <= n; i += 2)`.',
            'Initialize `long sum = 0;` before the loop.'
          ],
          testcases: [
            { input: '6', expectedOutput: '12' },
            { input: '10', expectedOutput: '30' },
            { input: '1', expectedOutput: '0' }
          ]
        },
        {
          id: 'java-1-array',
          title: 'Bài 3: Mảng 1 chiều & Arrays.sort() tìm Tổng, Min, Max',
          titleEn: 'Lesson 3: Arrays & Arrays.sort() Statistics',
          durationMinutes: 8,
          summary: 'Đọc mảng N phần tử, sắp xếp tăng dần bằng Arrays.sort() và xuất tổng, min, max.',
          summaryEn: 'Read N elements into an array, sort with Arrays.sort(), and print sum, min, and max.',
          content: `### 1. Thư viện \`java.util.Arrays\`
Java cung cấp sẵn hàm \`Arrays.sort(a)\` với độ phức tạp $O(N \\log N)$ giúp sắp xếp mảng nhanh chóng:
\`\`\`java
int[] a = new int[n];
for (int i = 0; i < n; i++) {
    a[i] = sc.nextInt();
}
Arrays.sort(a);
// Sau khi sort: phần tử nhỏ nhất là a[0], lớn nhất là a[n - 1]
\`\`\`

### 2. Nhiệm vụ của bạn:
Cho số nguyên $N$ và mảng $N$ số nguyên. Hãy in ra 3 số trên cùng 1 dòng cách nhau bởi dấu cách:
\`<tổng> <min> <max>\``,
          contentEn: `### 1. Built-in \`java.util.Arrays\`
Java provides \`Arrays.sort(a)\` running in $O(N \\log N)$:
\`\`\`java
int[] a = new int[n];
for (int i = 0; i < n; i++) {
    a[i] = sc.nextInt();
}
Arrays.sort(a);
\`\`\`

### 2. Your Task:
Given $N$ and $N$ integers, output \`<sum> <min> <max>\` separated by spaces.`,
          initialCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        long sum = 0;
        for (int i = 0; i < n; i++) {
            a[i] = sc.nextInt();
            sum += a[i];
        }
        // TODO: Sắp xếp mảng a và in ra: sum + " " + a[0] + " " + a[n - 1]
        
    }
}
`,
          solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        long sum = 0;
        for (int i = 0; i < n; i++) {
            a[i] = sc.nextInt();
            sum += a[i];
        }
        Arrays.sort(a);
        System.out.println(sum + " " + a[0] + " " + a[n - 1]);
    }
}`,
          hints: [
            'Gọi `Arrays.sort(a);` sau vòng lặp nhập dữ liệu.',
            'Phần tử nhỏ nhất nằm ở `a[0]` và lớn nhất nằm ở `a[n - 1]`.'
          ],
          hintsEn: [
            'Call `Arrays.sort(a);` after reading all elements.',
            'Smallest is `a[0]`, largest is `a[n - 1]`.'
          ],
          testcases: [
            { input: '4\n9 2 7 4', expectedOutput: '22 2 9' },
            { input: '5\n10 5 1 8 6', expectedOutput: '30 1 10' }
          ]
        }
      ]
    }
  ]
};
