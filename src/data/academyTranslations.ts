export interface LessonEnTranslation {
  titleEn: string;
  summaryEn: string;
  contentEn: string;
  hintsEn: string[];
}

export const academyEnTranslations: Record<string, LessonEnTranslation> = {
  'c-1-compile': {
    titleEn: '1. Overview & 4-Stage Compilation Process',
    summaryEn: 'Explore how C source code transforms into an executable (.exe) in Dev-C++ / GCC.',
    contentEn: `### 1. The Nature of C & The 4-Stage Compilation Process
The C programming language is a middle-level language bridging human algorithmic reasoning and computer hardware (CPU, RAM). The source code you write cannot run directly—it must undergo **4 compilation stages**:

1. **Preprocessing:** Scans lines starting with \`#\` (such as \`#include <stdio.h>\`), strips comments, expands macros, and copies library prototypes. Produces an intermediate \`.i\` file.
2. **Compiling:** Translates preprocessed C code into **Assembly Language** matching the CPU's specific instruction set architecture. Produces a \`.s\` file.
3. **Assembling:** Converts Assembly code into **Machine Code** (raw binary stream of 0s and 1s). Produces a \`.o\` or \`.obj\` object file.
4. **Linking:** Combines object files with precompiled standard libraries (such as the library containing \`printf\`) into the final binary executable (\`.exe\` on Windows).

### 2. Challenge:
Write a complete C program using \`<stdio.h>\` to print the startup greeting:
\`Chao mung den voi AHtest.code C Compiler!\``,
    hintsEn: [
      'Use `printf("Chao mung den voi AHtest.code C Compiler!\\n");`',
      'Remember the newline character `\\n` and terminating semicolon `;`.'
    ]
  },

  'c-1-variables': {
    titleEn: '2. RAM Architecture, Variables & Data Types',
    summaryEn: 'RAM memory cell model, basic data types (char, int, float, double), and explicit type casting pitfalls.',
    contentEn: `### 1. Memory Cells & Data Types in C
In RAM, each variable occupies a specific number of consecutive bytes:
- \`char\`: 1 byte (stores ASCII characters or numbers from -128 to 127).
- \`int\`: 4 bytes (stores signed integers, typically from -2,147,483,648 to 2,147,483,647).
- \`float\`: 4 bytes (single-precision floating point, ~6-7 decimal digits of precision).
- \`double\`: 8 bytes (double-precision floating point, ~15-17 decimal digits of precision).

**The Integer Division Pitfall:**
When dividing two integers, e.g. \`5 / 2\`, C performs integer division and truncates the decimal part, yielding \`2\` instead of \`2.5\`. To preserve the fractional part, you must perform explicit type casting: \`(float)a / b\`.

### 2. Challenge:
Given two integers \`a = 5\` and \`b = 2\`. Calculate their real division and print the result with 1 decimal place: \`2.5\`.`,
    hintsEn: [
      'Cast explicitly using `(float)a / b`.',
      'Use format specifier `%.1f` in `printf`.'
    ]
  },

  'c-1-io': {
    titleEn: '3. Standard I/O & Input Buffer Handling',
    summaryEn: 'printf specifiers, scanf address-of operator &, and input buffer flushing tricks.',
    contentEn: `### 1. Standard I/O Mechanisms in C
- \`printf\`: Outputs formatted data to the standard display stream (\`stdout\`).
- \`scanf\`: Reads formatted data from the keyboard (\`stdin\`). **Crucial Rule:** \`scanf\` requires memory addresses, so you must prefix variable names with the address-of operator \`&\` (e.g., \`&age\`).

**The Leftover Newline Trap (Buffer Overflow / Skips):**
When entering numbers followed by Enter, the \`\\n\` character remains in the input buffer. If you subsequently call \`getchar()\` or \`fgets()\`, it will instantly swallow this leftover \`\\n\` and skip user input.

### 2. Challenge:
Write a program to read an integer \`age\` and a float \`height\` from standard input, then display:
\`Tuoi: <age>, Chieu cao: <height>m\` (height formatted to 2 decimal places).`,
    hintsEn: [
      'Remember the `&` operator in `scanf("%d %f", &age, &height);`',
      'Format height with `%.2fm`.'
    ]
  },

  'c-1-selection': {
    titleEn: '4. Selection Structures & Condition Optimization',
    summaryEn: 'Nested if/else vs switch-case jump tables and short-circuit evaluation speedups.',
    contentEn: `### 1. Conditional Logic in C
- \`if - else if - else\`: Evaluates sequential Boolean expressions.
- \`switch - case\`: Dispatches directly via an internal jump table when comparing a single integral/char value against constants.
- **Short-circuit Evaluation:** In \`A && B\`, if \`A\` is false, \`B\` is never evaluated! In \`A || B\`, if \`A\` is true, \`B\` is skipped.

### 2. Challenge:
Read a student score (0-10) and output the classification:
- \`score >= 8.0\`: \`Gioi\`
- \`5.0 <= score < 8.0\`: \`Kha\`
- \`score < 5.0\`: \`Yeu\``,
    hintsEn: [
      'Use `if (score >= 8.0) ... else if (score >= 5.0) ... else ...`'
    ]
  },

  'c-1-loops': {
    titleEn: '5. Loops & Flow Control Optimization',
    summaryEn: 'for, while, do-while machine cycles, infinite loop prevention, and O(N) efficiency.',
    contentEn: `### 1. The Three Loops in C
1. \`for (init; cond; step)\`: Ideal for known iteration counts.
2. \`while (cond)\`: Checks condition *before* entering body (0 or more executions).
3. \`do { ... } while (cond);\`: Executes body *at least once* before checking condition (great for menus and input validation).

### 2. Challenge:
Calculate the sum of all odd integers from 1 to N: $S = 1 + 3 + 5 + \\dots + (2k-1) \\le N$. Output the final sum.`,
    hintsEn: [
      'Step loop by 2: `for (int i = 1; i <= n; i += 2)` or check `if (i % 2 != 0)`'
    ]
  },

  'c-1-project': {
    titleEn: '6. Phase 1 Capstone Project: Multi-functional CLI Tool',
    summaryEn: 'Synthesize variables, I/O, switch-case, and loops into a complete interactive console tool.',
    contentEn: `### 1. Software Architecture for Console Tools
A professional console application uses a continuous event loop (\`while(1)\` or \`do-while\`) driven by a user-facing menu with clear option handlers.

### 2. Challenge:
Build a mini calculation tool that reads option \`1\` to calculate rectangle area ($w \\times h$) or \`2\` to compute perimeter ($2 \\times (w + h)$). Output: \`Ket qua: <val>\`.`,
    hintsEn: [
      'Use switch-case on the user choice.',
      'Format output: `Ket qua: <val>`.'
    ]
  },

  'c-1-strings': {
    titleEn: "7. C Strings & The Secret of Null-Terminator '\\0' (String Mastery)",
    summaryEn: "Understanding char[] arrays, why C lacks a native string type, '\\0' delimiter, and buffer overflow prevention.",
    contentEn: `### 1. The Nature of Strings in C
In C, a string is simply a **1D array of \`char\` elements terminated by a Null byte \`'\\0'\`** (ASCII value 0).

\`\`\`c
char s[6] = {'H', 'e', 'l', 'l', 'o', '\\0'};
char greeting[] = "Hello"; // Compiler automatically appends '\\0' (6 bytes total)
\`\`\`

> [!WARNING]
> **Difference between \`'A'\` and \`"A"\`:**
> * \`'A'\`: Single character literal, occupies **1 byte**.
> * \`"A"\`: String literal with elements \`{'A', '\\0'}\`, occupies **2 bytes** in RAM!

### 2. Challenge:
Read a string $S$ (max 50 chars, no spaces). Calculate length without \`strlen\` and convert to UPPERCASE.
Format:
\`\`\`
DO DAI: <len>
VIET HOA: <upper_string>
\`\`\``,
    hintsEn: [
      "Traverse with: `while (s[len] != '\\0') len++;`",
      "Uppercase: `if (s[i] >= 'a' && s[i] <= 'z') s[i] -= 32;`"
    ]
  },

  'c-1-quiz': {
    titleEn: '8. Phase 1 Technical Quizzes & Logic Audit',
    summaryEn: 'Operator precedence traps, bitwise parity checks, and interview questions.',
    contentEn: `### 1. C Under-the-Hood Quizzes
- **Precedence:** Post-increment \`x++\` evaluates to current value before incrementing, whereas \`++x\` increments first.
- **Bitwise Trick:** To test if an integer is odd, \`(n & 1) == 1\` is faster than \`n % 2 != 0\`.

### 2. Challenge:
Implement a function to check if integer \`n\` is even using bitwise operators. Print \`Even\` or \`Odd\`.`,
    hintsEn: [
      'Check `(n & 1) == 0` for even numbers.'
    ]
  },

  'c-2-memory-swap': {
    titleEn: '8. Memory Segments (Stack, Heap, Data, Code) & The Swap Problem',
    summaryEn: 'Inspect stack call frames, pass-by-value vs pass-by-reference, and solve the Swap problem.',
    contentEn: `### 1. The 4 Segments of RAM
Every running C program is partitioned into 4 distinct segments:
1. **Code Segment (Text):** Read-only machine instructions.
2. **Data Segment (Data & BSS):** Global and static variables.
3. **Stack Segment:** Local variables and function call frames (LIFO, automatically allocated & freed).
4. **Heap Segment:** Dynamically allocated memory at runtime (\`malloc\`, \`free\`).

**The Swap Problem:**
In C, function arguments are passed by **value**. To modify variables in the caller's stack frame, you must pass **pointers** (\`&x\`, \`&y\`).

### 2. Challenge:
Implement \`void swap(int *a, int *b)\` to successfully exchange values between two integers.`,
    hintsEn: [
      'Pass memory addresses `swap(&a, &b)` and dereference inside `*a`.'
    ]
  },

  'c-2-pointers': {
    titleEn: '9. Pointers & Address Arithmetic',
    summaryEn: 'Hexadecimal addresses, dereference operator *, array navigation via pointer arithmetic.',
    contentEn: `### 1. Pointers & Address Arithmetic
A pointer is a variable that stores the memory address of another variable.
- \`&x\`: Retrieves the memory address of \`x\`.
- \`*ptr\`: Dereferences the pointer to read or write the value at that address.
- **Pointer Arithmetic:** \`ptr + 1\` advances the pointer by \`sizeof(*ptr)\` bytes! For \`int*\`, it advances by 4 bytes.

### 2. Challenge:
Traverse an array of 5 integers using only pointer arithmetic \`*(arr + i)\` to compute and print the total sum.`,
    hintsEn: [
      'Use pointer dereference `*(arr + i)` instead of array indexing `arr[i]`.'
    ]
  },

  'c-2-dynamic-alloc': {
    titleEn: '10. Dynamic Memory Allocation (malloc, calloc, realloc, free)',
    summaryEn: 'Allocate arbitrary blocks on the Heap at runtime and manage lifecycle manually.',
    contentEn: `### 1. Dynamic Allocation on the Heap
- \`malloc(size)\`: Allocates uninitialized memory block.
- \`calloc(n, size)\`: Allocates zero-initialized memory.
- \`realloc(ptr, new_size)\`: Resizes an existing heap allocation.
- \`free(ptr)\`: Returns memory back to the operating system.

### 2. Challenge:
Allocate memory for \`n\` integers on the Heap using \`malloc\`. Read \`n\` values, print \`Sum: <sum>\`, and call \`free()\`.`,
    hintsEn: [
      'Cast `(int*)malloc(n * sizeof(int))` and check for NULL.'
    ]
  },

  'c-2-memory-leak': {
    titleEn: '11. Memory Leak Prevention & Dangling Pointers',
    summaryEn: 'The danger of orphaned Heap memory, valgrind inspection, and assigning NULL after free.',
    contentEn: `### 1. Critical Memory Vulnerabilities
- **Memory Leak:** Allocating Heap memory without calling \`free()\`, exhausting system RAM over time.
- **Dangling Pointer:** A pointer pointing to deallocated memory after \`free()\`. Accessing it causes Undefined Behavior or security exploits.
- **Best Practice:** Immediately set \`ptr = NULL;\` after calling \`free(ptr);\`.

### 2. Challenge:
Allocate a dynamic buffer, print a status message, safely free it, and secure the pointer with \`NULL\`.`,
    hintsEn: [
      'Call `free(ptr);` and immediately assign `ptr = NULL;`.'
    ]
  },

  'c-2-struct': {
    titleEn: '12. User-Defined Structures (struct & typedef)',
    summaryEn: 'Package heterogeneous data fields, struct memory alignment, and member access with ->.',
    contentEn: `### 1. Structures in C
A \`struct\` packages heterogeneous variables into a single record.
- Use \`typedef struct { ... } TypeName;\` for concise declarations.
- Access members via dot \`.\` for direct variables, or arrow \`->\` for pointers (\`ptr->field\`).

### 2. Challenge:
Define \`struct SinhVien\` with \`id\`, \`name\`, and \`gpa\`. Read student details and print:
\`ID: <id>, Ten: <name>, GPA: <gpa>\`.`,
    hintsEn: [
      'Use `struct SinhVien sv;` and access with `sv.id`, `sv.name`, `sv.gpa`.'
    ]
  },

  'c-2-mini-project': {
    titleEn: '13. Phase 2 Project: Dynamic Personnel Management System',
    summaryEn: 'Build a console CRUD management system using struct arrays and dynamic reallocation.',
    contentEn: `### 1. Dynamic Struct Architecture
Combine dynamic arrays (\`malloc\` / \`realloc\`) with \`struct\` records to build expandable data structures like Vectors or Databases in C.

### 2. Challenge:
Manage a list of employees. Calculate daily salary = \`basicSalary / 26.0\` and total salary = \`dailySalary * workingDays\`. Print formatted output.`,
    hintsEn: [
      'Divide by `26.0` to preserve floating-point precision.'
    ]
  },

  'c-2-code-review': {
    titleEn: '14. Code Review & Vulnerability Audit Challenge',
    summaryEn: 'Detect memory corruption, stack variable return bugs, and patch dangerous code.',
    contentEn: `### 1. Code Review Traps
1. **Returning pointer to local stack variable:** Stack frame is destroyed upon return! Resulting pointer points to garbage.
2. **Buffer Overflow:** Using unsafe \`gets()\` instead of \`fgets()\`.
3. **Double Free:** Calling \`free()\` twice on the same pointer.

### 2. Challenge:
Review and fix the bug in a bank account deposit program to prevent memory corruption.`,
    hintsEn: [
      'Ensure account is found before updating balance.'
    ]
  },

  'cpp-1-1': {
    titleEn: 'Lesson 1: Program Skeleton & Fast I/O',
    summaryEn: 'Learn the main() function and cin/cout desynchronization techniques to avoid TLE.',
    contentEn: `### 1. Standard Competitive Programming Skeleton
Every modern C++ contest solution starts with this standard structure:
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    // Mandatory Fast I/O
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    cout << "Chao mung den voi AHtest.code!\\n";
    return 0;
}
\`\`\`

> [!TIP]
> Always use \`'\\n'\` instead of \`endl\` because \`endl\` forces the operating system to flush the buffer continuously, making execution up to 10x slower and causing TLE!

### 2. Challenge:
Write a program to output the exact line: \`AHtest.code Academy 2026\` followed by a newline.`,
    hintsEn: [
      'Use `cout << "AHtest.code Academy 2026\\n";`',
      'Make sure Fast I/O lines are included in main().'
    ]
  },

  'cpp-1-2': {
    titleEn: 'Lesson 2: Data Types & Integer Overflow',
    summaryEn: 'Variable value limits, bit boundaries, and silent overflow traps in math calculations.',
    contentEn: `### 1. 32-bit vs 64-bit Limits in C++
- \`int\`: 32-bit signed integer (range approx $-2 \\times 10^9$ to $2 \\times 10^9$).
- \`long long\`: 64-bit signed integer (range up to $9 \\times 10^{18}$).

> [!WARNING]
> **The Multiplication Trap:**
> Even if the result variable is \`long long\`, writing \`long long ans = a * b;\` with 32-bit \`int\` variables \`a\` and \`b\` will overflow **before** assignment!
> Always cast: \`long long ans = (long long)a * b;\`.

### 2. Challenge:
Given two integers $A$ and $B$ (up to $10^9$). Calculate and print their 64-bit product $A \\times B$.`,
    hintsEn: [
      'Declare variables as `long long a, b;`',
      'Use format `cout << a * b << "\\n";`'
    ]
  },

  'cpp-1-3': {
    titleEn: 'Lesson 3: Prefix Sum Array Technique',
    summaryEn: 'Optimize range sum queries from O(N) to O(1) using precalculated cumulative sums.',
    contentEn: `### 1. Prefix Sum Principle
Given array $A$ of size $N$, construct prefix array $P$ where $P[i] = P[i-1] + A[i]$ with $P[0] = 0$.
The sum of elements in subsegment $[L, R]$ is computed in $O(1)$:
$$\\text{Sum}(L, R) = P[R] - P[L - 1]$$

> [!NOTE]
> Instead of looping $O(N)$ for each query, precomputing $P$ in $O(N)$ allows answering $Q$ range sum queries in $O(1)$ each!

### 2. Challenge:
Build a prefix sum array and output the sum of elements for the given query range.`,
    hintsEn: [
      'Precompute with `prefix[i] = prefix[i - 1] + a[i]`',
      'Query result is `prefix[r] - prefix[l - 1]`'
    ]
  }
};
