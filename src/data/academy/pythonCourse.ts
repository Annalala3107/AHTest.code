import type { AcademyCourse } from '../../types/index.ts';

export const pythonCourse: AcademyCourse = {
  id: 'python-cp',
  slug: 'python-chuyen-tin',
  title: 'Python Siêu Tốc Cho Lập Trình Thi Đấu',
  titleEn: 'Ultra-Fast Python for Competitive Programming',
  language: 'python',
  level: 'Beginner',
  description:
    'Làm chủ Python 3 từ nhập xuất chuẩn, tách dòng nhanh với map(), vòng lặp đến List Comprehension cho Tin học trẻ, OLP và giải thuật.',
  descriptionEn:
    'Master Python 3 from standard I/O, fast input parsing with map(), loops to List Comprehensions for informatics olympiads.',
  totalLessons: 4,
  estimatedHours: 3,
  isComingSoon: false,
  modules: [
    {
      id: 'py-mod-1',
      title: 'Chương 1: Python Nhập Môn & Tối Ưu Input/List',
      titleEn: 'Chapter 1: Python Core I/O & List Mastery',
      description: 'Viết code ngắn gọn, an toàn và đọc test chuẩn trong kỳ thi.',
      descriptionEn: 'Write concise, clean code and parse competitive inputs effortlessly.',
      lessons: [
        {
          id: 'py-1-io',
          title: 'Bài 1: Nhập xuất & f-string chuẩn xác',
          titleEn: 'Lesson 1: Standard I/O & f-strings',
          durationMinutes: 5,
          summary: 'Đọc chuỗi với input().strip(), ép kiểu int() và định dạng bằng f-string.',
          summaryEn: 'Read strings with input().strip(), cast with int(), and format via f-strings.',
          content: `### 1. Đọc dữ liệu và in định dạng trong Python 3
Trong Python, \`input()\` luôn trả về kiểu chuỗi (\`str\`). Để tính toán số học, bạn cần ép kiểu bằng \`int()\` hoặc \`float()\`:
\`\`\`python
name = input().strip()
year = int(input())
print(f"Hello {name}, age {2026 - year}")
\`\`\`

### 2. Nhiệm vụ của bạn:
Đọc dòng 1 là tên thí sinh (chuỗi), dòng 2 là năm sinh \`y\` (số nguyên). In ra chính xác định dạng:
\`Hello <tên>, age <2026 - y>\``,
          contentEn: `### 1. Standard Input and f-string Formatting
In Python, \`input()\` always returns a \`str\`. Cast numeric inputs with \`int()\` and print formatted text via f-strings:
\`\`\`python
name = input().strip()
year = int(input())
print(f"Hello {name}, age {2026 - year}")
\`\`\`

### 2. Your Task:
Read name on line 1 and birth year \`y\` on line 2, then print \`Hello <name>, age <2026 - y>\`.`,
          initialCode: `# Đọc tên và năm sinh, sau đó in theo định dạng yêu cầu
name = input().strip()
year = int(input())
# TODO: print(f"...")
`,
          solutionCode: `name = input().strip()
year = int(input())
print(f"Hello {name}, age {2026 - year}")`,
          hints: [
            'Dùng `print(f"Hello {name}, age {2026 - year}")`',
            'Nhớ dùng `.strip()` để bỏ khoảng trắng thừa hai đầu tên.'
          ],
          hintsEn: [
            'Use `print(f"Hello {name}, age {2026 - year}")`',
            'Call `.strip()` to clean whitespace around the name.'
          ],
          testcases: [
            { input: 'An\n2006', expectedOutput: 'Hello An, age 20' },
            { input: 'Minh\n2005', expectedOutput: 'Hello Minh, age 21' }
          ]
        },
        {
          id: 'py-1-math',
          title: 'Bài 2: Tách nhiều số trên một dòng với map()',
          titleEn: 'Lesson 2: Multi-value Parsing with map() & Floor Division',
          durationMinutes: 6,
          summary: 'Đọc a, b cùng lúc bằng map(int, input().split()) và phân biệt // với /.',
          summaryEn: 'Parse space-separated integers with map() and distinguish // from /.',
          content: `### 1. Đọc nhiều biến trên cùng một dòng
Để đọc hai số nguyên cách nhau bởi dấu cách:
\`\`\`python
a, b = map(int, input().split())
\`\`\`
* \`a // b\`: Chia lấy phần nguyên (khác với \`a / b\` vốn trả về số thực \`float\`).
* \`a ** b\`: Lũy thừa $a^b$.

### 2. Nhiệm vụ của bạn:
Nhập hai số nguyên \`a\` và \`b\` trên cùng 1 dòng ($b \\ne 0$). In ra 3 số cách nhau bởi 1 dấu cách trên một dòng: \`a + b\`, \`a // b\`, và \`a ** 2\`.`,
          contentEn: `### 1. Parsing Multiple Inputs on One Line
Use \`a, b = map(int, input().split())\` to unpack space-separated integers.
Use \`//\` for integer floor division and \`**\` for exponentiation.

### 2. Your Task:
Read \`a\` and \`b\` on one line and print \`a + b\`, \`a // b\`, and \`a ** 2\` separated by spaces.`,
          initialCode: `a, b = map(int, input().split())
# TODO: In ra a + b, a // b, a ** 2
`,
          solutionCode: `a, b = map(int, input().split())
print(a + b, a // b, a ** 2)`,
          hints: [
            'Hàm `print(x, y, z)` mặc định ngăn cách các giá trị bằng 1 dấu cách.'
          ],
          hintsEn: [
            '`print(x, y, z)` automatically separates arguments with single spaces.'
          ],
          testcases: [
            { input: '7 3', expectedOutput: '10 2 49' },
            { input: '10 4', expectedOutput: '14 2 100' }
          ]
        },
        {
          id: 'py-1-loop',
          title: 'Bài 3: Vòng lặp range() & Tổng số chẵn',
          titleEn: 'Lesson 3: Loops with range() & Step Control',
          durationMinutes: 6,
          summary: 'Sử dụng tham số bước nhảy step trong range(start, stop, step).',
          summaryEn: 'Iterate efficiently with range(start, stop, step).',
          content: `### 1. Cú pháp \`range(start, stop, step)\`
\`range(2, n + 1, 2)\` duyệt trực tiếp qua tất cả các số chẵn từ $2$ đến $n$ (nhanh gấp đôi việc duyệt hết và kiểm tra \`% 2 == 0\`).

### 2. Nhiệm vụ của bạn:
Đọc số nguyên dương \`n\`. Tính và in ra tổng các số nguyên dương chẵn $\\le n$.`,
          contentEn: `### 1. Using \`range(start, stop, step)\`
\`range(2, n + 1, 2)\` steps through even numbers from $2$ up to $n$ directly.

### 2. Your Task:
Read positive integer \`n\` and print the sum of all positive even integers $\\le n$.`,
          initialCode: `n = int(input())
total = 0
# TODO: Cộng dồn các số chẵn <= n vào total

print(total)`,
          solutionCode: `n = int(input())
total = 0
for i in range(2, n + 1, 2):
    total += i
print(total)`,
          hints: [
            'Dùng vòng lặp `for i in range(2, n + 1, 2):` để duyệt các số chẵn.'
          ],
          hintsEn: [
            'Loop using `for i in range(2, n + 1, 2):` and add `i` to `total`.'
          ],
          testcases: [
            { input: '10', expectedOutput: '30' },
            { input: '7', expectedOutput: '12' }
          ]
        },
        {
          id: 'py-1-list',
          title: 'Bài 4: List Comprehension & Hàm tổng hợp',
          titleEn: 'Lesson 4: List Comprehensions & Built-in Aggregations',
          durationMinutes: 7,
          summary: 'Lọc mảng bằng [x for x in arr if x > 0] và dùng sum(), max().',
          summaryEn: 'Filter arrays idiomatically with [x for x in arr if x > 0] and sum()/max().',
          content: `### 1. List Comprehension trong Python
\`\`\`python
arr = list(map(int, input().split()))
positives = [x for x in arr if x > 0]
\`\`\`

### 2. Nhiệm vụ của bạn:
Dòng 1 cho số nguyên \`n\`. Dòng 2 cho \`n\` số nguyên.
* Dòng 1: In ra tổng các số dương ($> 0$).
* Dòng 2: In ra giá trị lớn nhất trong cả dãy.`,
          contentEn: `### 1. Idiomatic List Comprehensions
Filter lists concisely using \`[x for x in arr if x > 0]\`, then aggregate with \`sum()\` and \`max()\`.

### 2. Your Task:
Line 1 gives \`n\`, line 2 gives \`n\` integers. Print the sum of positive integers on line 1 and the maximum value on line 2.`,
          initialCode: `n = int(input())
arr = list(map(int, input().split()))
# TODO: Lọc số dương và in sum + max
`,
          solutionCode: `n = int(input())
arr = list(map(int, input().split()))
positives = [x for x in arr if x > 0]
print(sum(positives))
print(max(arr))`,
          hints: [
            'Tạo mảng số dương bằng `[x for x in arr if x > 0]`',
            'Sau đó gọi `print(sum(positives))` và `print(max(arr))`.'
          ],
          hintsEn: [
            'Build `[x for x in arr if x > 0]`',
            'Print `sum(positives)` and `max(arr)`.'
          ],
          testcases: [
            { input: '5\n-3 4 0 7 -1', expectedOutput: '11\n7' },
            { input: '3\n2 5 8', expectedOutput: '15\n8' }
          ]
        }
      ]
    }
  ]
};
