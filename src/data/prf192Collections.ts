import type { ProblemCollection } from '../types';
import { PRF192_MASTER_PROBLEMS } from './prf192MasterDataset.ts';

export const DEFAULT_PROBLEM_COLLECTIONS: ProblemCollection[] = [
  // 1. SHAPE & STAR PATTERNS
  {
    id: 'prf192_shape_matrix',
    title: 'BỘ ĐỀ 1: Vẽ Hình & Tư Duy Vòng Lặp Lồng Nhau (Shape Matrix & Patterns)',
    titleEn: 'Shape & Star Pattern Mastery',
    description: 'Tuyển tập 27+ bài vẽ hình kinh điển thường gặp nhất trong đề thi C: Tam giác sao vuông, tam giác cân, hình vuông rỗng viền, tam giác số Floyd, hình thoi đối xứng, ngôi nhà.',
    category: 'Vòng lặp & Hình học',
    icon: 'shapes',
    color: 'rose',
    difficultySummary: 'Beginner',
    isSystem: true,
    createdAt: '2026-11-01',
    problems: [
      {
        id: 'prf_sq_hollow',
        slug: 'hollow_square_pattern',
        title: 'Vẽ hình vuông rỗng viền sao (Hollow Square)',
        category: 'Vòng lặp & Hình học',
        difficulty: 'Easy',
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: ['Loop', 'Pattern', 'Logic', 'PRF192'],
        solvedCount: 420,
        totalSubmissions: 580,
        statement: `Cho số nguyên dương $N$ ($N \\ge 2$). Hãy vẽ một hình vuông rỗng kích thước $N \\times N$ bằng ký tự dấu sao \`*\`.
Đường viền của hình vuông in dấu \`*\`, bên trong hình vuông là các khoảng trắng. Không có khoảng trắng thừa ở cuối mỗi dòng.`,
        inputFormat: `Một dòng duy nhất chứa số nguyên dương $N$ ($2 \\le N \\le 30$).`,
        outputFormat: `In ra hình vuông rỗng kích thước $N \\times N$.`,
        constraints: `$2 \\le N \\le 30$.`,
        author: 'Đề thi thực hành PRF192 Lab',
        source: 'Kho Đề Ngoại Nhập 2.0',
        createdAt: '2026-11-01',
        isCustom: true,
        collectionId: 'prf192_shape_matrix',
        progressiveHints: [
          {
            tier: 1,
            title: 'Gợi ý tư duy thuật toán',
            content: 'Duyệt 2 vòng lặp lồng nhau: vòng ngoài $i$ chạy từ $1$ đến $N$, vòng trong $j$ chạy từ $1$ đến $N$. Ký tự \'*\' chỉ xuất hiện ở các cạnh biên!'
          },
          {
            tier: 2,
            title: 'Cảnh báo bẫy ngầm & Lỗi thường gặp',
            content: 'Điều kiện in \'*\' là khi ở hàng đầu ($i == 1$), hàng cuối ($i == N$), cột đầu ($j == 1$), hoặc cột cuối ($j == N$). Các vị trí còn lại in khoảng trắng \' \'.'
          },
          {
            tier: 3,
            title: 'Khung mã giả (Pseudocode Scaffold)',
            content: `for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= n; j++) {
        if (i == 1 || i == n || j == 1 || j == n) printf("*");
        else printf(" ");
    }
    printf("\\n");
}`
          }
        ],
        samples: [
          {
            input: '4',
            output: '****\n*  *\n*  *\n****',
            explanation: 'Hình vuông kích thước 4x4 với viền ngoài là sao và lõi 2x2 là khoảng trắng.'
          }
        ],
        testcases: [
          { id: 1, input: '4', expectedOutput: '****\n*  *\n*  *\n****', isHidden: false },
          { id: 2, input: '3', expectedOutput: '***\n* *\n***', isHidden: false },
          { id: 3, input: '2', expectedOutput: '**\n**', isHidden: true, explanation: 'Trường hợp biên tối thiểu N = 2.' },
          { id: 4, input: '5', expectedOutput: '*****\n*   *\n*   *\n*   *\n*****', isHidden: true }
        ]
      },
      {
        id: 'prf_tri_iso',
        slug: 'isosceles_triangle_pattern',
        title: 'Vẽ tam giác cân đối xứng (Isosceles Triangle)',
        category: 'Vòng lặp & Hình học',
        difficulty: 'Easy',
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: ['Loop', 'Pattern', 'Symmetry'],
        solvedCount: 380,
        totalSubmissions: 510,
        statement: `Cho chiều cao $H$. Hãy in ra một tam giác cân đối xứng có chiều cao $H$.
Tại dòng thứ $i$ ($1 \\le i \\le H$), in ra $H - i$ khoảng trắng ở đầu, tiếp theo là $2 \\times i - 1$ ký tự \`*\`.`,
        inputFormat: `Một dòng duy nhất chứa số nguyên $H$ ($1 \\le H \\le 20$).`,
        outputFormat: `In ra tam giác cân kích thước $H$.`,
        constraints: `$1 \\le H \\le 20$.`,
        author: 'Đề thi thực hành PRF192 Lab',
        source: 'Kho Đề Ngoại Nhập 2.0',
        createdAt: '2026-11-01',
        isCustom: true,
        collectionId: 'prf192_shape_matrix',
        progressiveHints: [
          {
            tier: 1,
            title: 'Gợi ý tư duy thuật toán',
            content: 'Mỗi dòng $i$ có 2 phần: Khoảng trắng căn lề trái ($H - i$) và các dấu sao ($2i - 1$).'
          },
          {
            tier: 2,
            title: 'Cảnh báo bẫy ngầm',
            content: 'Chú ý không in khoảng trắng dư thừa sau ký tự \'*\' cuối cùng của mỗi dòng để tránh bị máy chấm báo sai diff.'
          },
          {
            tier: 3,
            title: 'Khung mã giả (Pseudocode Scaffold)',
            content: `for (int i = 1; i <= h; i++) {
    for (int s = 1; s <= h - i; s++) printf(" ");
    for (int star = 1; star <= 2 * i - 1; star++) printf("*");
    printf("\\n");
}`
          }
        ],
        samples: [
          {
            input: '3',
            output: '  *\n ***\n*****',
            explanation: 'Dòng 1: 2 space + 1 star. Dòng 2: 1 space + 3 star. Dòng 3: 0 space + 5 star.'
          }
        ],
        testcases: [
          { id: 1, input: '3', expectedOutput: '  *\n ***\n*****', isHidden: false },
          { id: 2, input: '4', expectedOutput: '   *\n  ***\n *****\n*******', isHidden: false },
          { id: 3, input: '1', expectedOutput: '*', isHidden: true, explanation: 'Trường hợp biên H = 1.' },
          { id: 4, input: '5', expectedOutput: '    *\n   ***\n  *****\n *******\n*********', isHidden: true }
        ]
      },
      {
        id: 'prf_floyd_triangle',
        slug: 'floyds_number_triangle',
        title: 'Tam giác số Floyd liên tiếp (Floyd Triangle)',
        category: 'Vòng lặp & Hình học',
        difficulty: 'Easy',
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: ['Loop', 'Numbers', 'Counters'],
        solvedCount: 290,
        totalSubmissions: 390,
        statement: `Tam giác Floyd là tam giác số nguyên tự nhiên liên tiếp. Cho số hàng $N$, hãy in ra tam giác Floyd gồm $N$ dòng, bắt đầu từ số $1$.
Mỗi dòng $i$ chứa đúng $i$ số, cách nhau bởi một khoảng trắng.`,
        inputFormat: `Một dòng duy nhất chứa số nguyên dương $N$ ($1 \\le N \\le 15$).`,
        outputFormat: `In ra tam giác Floyd gồm $N$ hàng.`,
        constraints: `$1 \\le N \\le 15$.`,
        author: 'Đề thi thực hành PRF192 Lab',
        source: 'Kho Đề Ngoại Nhập 2.0',
        createdAt: '2026-11-01',
        isCustom: true,
        collectionId: 'prf192_shape_matrix',
        progressiveHints: [
          {
            tier: 1,
            title: 'Gợi ý tư duy thuật toán',
            content: 'Dùng một biến đếm toàn cục `int val = 1;`. Khi lặp qua từng phần tử của từng dòng, in `val` rồi tăng `val++`.'
          },
          {
            tier: 2,
            title: 'Cảnh báo bẫy ngầm',
            content: 'Khoảng trắng giữa các số: Trong một hàng, số cuối cùng không nên có khoảng trắng thừa phía sau (hoặc in `val` kèm khoảng trắng nếu đề yêu cầu chuẩn).'
          },
          {
            tier: 3,
            title: 'Khung mã giả (Pseudocode Scaffold)',
            content: `int num = 1;
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= i; j++) {
        printf("%d%s", num++, (j == i ? "" : " "));
    }
    printf("\\n");
}`
          }
        ],
        samples: [
          {
            input: '4',
            output: '1\n2 3\n4 5 6\n7 8 9 10',
            explanation: '4 hàng số đếm tuần tự từ 1 đến 10.'
          }
        ],
        testcases: [
          { id: 1, input: '4', expectedOutput: '1\n2 3\n4 5 6\n7 8 9 10', isHidden: false },
          { id: 2, input: '3', expectedOutput: '1\n2 3\n4 5 6', isHidden: false },
          { id: 3, input: '1', expectedOutput: '1', isHidden: true },
          { id: 4, input: '5', expectedOutput: '1\n2 3\n4 5 6\n7 8 9 10\n11 12 13 14 15', isHidden: true }
        ]
      },
      {
        id: 'prf_rhombus_diamond',
        slug: 'rhombus_diamond_pattern',
        title: 'Vẽ hình thoi đối xứng (Diamond Pattern)',
        category: 'Vòng lặp & Hình học',
        difficulty: 'Medium',
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: ['Loop', 'Geometry', 'Nested-Loops'],
        solvedCount: 210,
        totalSubmissions: 350,
        statement: `Cho số nguyên dương lẻ $N$ đại diện cho đường chéo ngang lớn nhất. Hãy vẽ một hình thoi sao đối xứng có chiều cao $N$.
Ví dụ $N = 5$:
\`\`\`
  *
 ***
*****
 ***
  *
\`\`\``,
        inputFormat: `Một dòng duy nhất chứa số nguyên dương lẻ $N$ ($3 \\le N \\le 25$).`,
        outputFormat: `In ra hình thoi sao đối xứng gồm $N$ dòng.`,
        constraints: `$N$ là số lẻ, $3 \\le N \\le 25$.`,
        author: 'Đề thi thực hành PRF192 Lab',
        source: 'Kho Đề Ngoại Nhập 2.0',
        createdAt: '2026-11-01',
        isCustom: true,
        collectionId: 'prf192_shape_matrix',
        progressiveHints: [
          {
            tier: 1,
            title: 'Gợi ý tư duy thuật toán',
            content: 'Chia hình thoi thành 2 nửa: Nửa trên từ hàng $1$ đến $(N+1)/2$ (tam giác cân mở rộng) và nửa dưới từ $(N+1)/2 - 1$ về $1$ (tam giác cân thu hẹp).'
          },
          {
            tier: 2,
            title: 'Cảnh báo bẫy ngầm',
            content: 'N là số lẻ, điểm giữa là $mid = N / 2 + 1$. Số khoảng trắng dòng $i$ là $|mid - i|$, số dấu sao là $N - 2 \\times |mid - i|$.'
          },
          {
            tier: 3,
            title: 'Khung mã giả (Pseudocode Scaffold)',
            content: `int mid = n / 2 + 1;
for (int i = 1; i <= n; i++) {
    int spaces = abs(mid - i);
    int stars = n - 2 * spaces;
    for (int s = 0; s < spaces; s++) printf(" ");
    for (int st = 0; st < stars; st++) printf("*");
    printf("\\n");
}`
          }
        ],
        samples: [
          {
            input: '5',
            output: '  *\n ***\n*****\n ***\n  *',
            explanation: 'Hình thoi đối xứng có đường kính giữa là 5.'
          }
        ],
        testcases: [
          { id: 1, input: '5', expectedOutput: '  *\n ***\n*****\n ***\n  *', isHidden: false },
          { id: 2, input: '3', expectedOutput: ' *\n***\n *', isHidden: false },
          { id: 3, input: '7', expectedOutput: '   *\n  ***\n *****\n*******\n *****\n  ***\n   *', isHidden: true }
        ]
      },
      ...PRF192_MASTER_PROBLEMS.filter(p => p.collectionId === 'prf192_shape_matrix')
    ]
  },

  // 2. ARRAY MANIPULATION & SORTING
  {
    id: 'prf192_array_sorting',
    title: 'BỘ ĐỀ 2: Mảng 1 Chiều & Thuật Toán Sắp Xếp (Array Manipulation & Sorting)',
    titleEn: 'Array Manipulation & Sorting Algorithms',
    description: 'Tuyển tập 24+ bài toán mảng then chốt: Đổi chỗ số lẻ min-max, xóa phần tử trùng, sắp xếp Bubble/Insertion/Selection sort, mảng chẵn lẻ, max/min.',
    category: 'Mảng & Bộ nhớ',
    icon: 'layers',
    color: 'amber',
    difficultySummary: 'Intermediate',
    isSystem: true,
    createdAt: '2026-11-01',
    problems: [
      {
        id: 'prf_arr_swap_odd_min_max',
        slug: 'swap_min_max_odd_elements',
        title: 'Đổi vị trí số lẻ lớn nhất và số lẻ nhỏ nhất',
        category: 'Mảng & Con trỏ',
        difficulty: 'Easy',
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: ['Array', 'Swap', 'Min-Max', 'PRF192'],
        solvedCount: 310,
        totalSubmissions: 450,
        statement: `Cho mảng gồm $N$ số nguyên. Hãy tìm số lẻ nhỏ nhất và số lẻ lớn nhất trong mảng, sau đó hoán đổi vị trí của hai số này cho nhau.
Nếu mảng không có số lẻ hoặc chỉ có 1 số lẻ duy nhất thì giữ nguyên mảng. In mảng kết quả sau khi hoán đổi trên một dòng.`,
        inputFormat: `* Dòng 1: Số nguyên dương $N$ ($1 \\le N \\le 100$).
* Dòng 2: $N$ số nguyên phân tách bởi dấu cách.`,
        outputFormat: `In ra $N$ phần tử của mảng sau khi hoán vị, cách nhau bởi một khoảng trắng.`,
        constraints: `$1 \\le N \\le 100$, phần tử mảng có giá trị trong khoảng $[-10^4, 10^4]$.`,
        author: 'Đề thi thực hành PRF192 Lab (Source 1)',
        source: 'Kho Đề Ngoại Nhập 2.0',
        createdAt: '2026-11-01',
        isCustom: true,
        collectionId: 'prf192_array_sorting',
        progressiveHints: [
          {
            tier: 1,
            title: 'Gợi ý tư duy thuật toán',
            content: 'Duyệt mảng tìm vị trí index của số lẻ nhỏ nhất (`minOddIdx`) và số lẻ lớn nhất (`maxOddIdx`).'
          },
          {
            tier: 2,
            title: 'Cảnh báo bẫy ngầm',
            content: 'Khởi tạo index ban đầu bằng `-1`. Chú ý số âm lẻ (ví dụ: -3 % 2 == -1 trong C), nên dùng `abs(a[i]) % 2 == 1` hoặc `a[i] % 2 != 0`.'
          },
          {
            tier: 3,
            title: 'Khung mã giả (Pseudocode Scaffold)',
            content: `int minIdx = -1, maxIdx = -1;
for (int i = 0; i < n; i++) {
    if (a[i] % 2 != 0) {
        if (minIdx == -1 || a[i] < a[minIdx]) minIdx = i;
        if (maxIdx == -1 || a[i] > a[maxIdx]) maxIdx = i;
    }
}
if (minIdx != -1 && maxIdx != -1 && minIdx != maxIdx) {
    int tmp = a[minIdx]; a[minIdx] = a[maxIdx]; a[maxIdx] = tmp;
}`
          }
        ],
        samples: [
          {
            input: '5\n2 7 4 1 8',
            output: '2 1 4 7 8',
            explanation: 'Số lẻ lớn nhất là 7 (vị trí 1), nhỏ nhất là 1 (vị trí 3). Đổi vị trí 7 và 1.'
          }
        ],
        testcases: [
          { id: 1, input: '5\n2 7 4 1 8', expectedOutput: '2 1 4 7 8', isHidden: false },
          { id: 2, input: '4\n2 4 6 8', expectedOutput: '2 4 6 8', isHidden: false, explanation: 'Không có số lẻ nào, giữ nguyên mảng.' },
          { id: 3, input: '3\n5 5 5', expectedOutput: '5 5 5', isHidden: true, explanation: 'Các số lẻ bằng nhau.' },
          { id: 4, input: '6\n9 2 1 4 5 7', expectedOutput: '1 2 9 4 5 7', isHidden: true }
        ]
      },
      {
        id: 'prf_arr_deduplicate',
        slug: 'remove_duplicate_elements',
        title: 'Loại bỏ các phần tử trùng lặp (Deduplicate Array)',
        category: 'Mảng & Con trỏ',
        difficulty: 'Medium',
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: ['Array', 'Deduplication', 'Filter'],
        solvedCount: 260,
        totalSubmissions: 410,
        statement: `Cho mảng $N$ phần tử số nguyên. Hãy loại bỏ tất cả các phần tử trùng nhau, chỉ giữ lại **lần xuất hiện đầu tiên** của mỗi giá trị theo đúng thứ tự ban đầu.`,
        inputFormat: `* Dòng 1: Số nguyên dương $N$ ($1 \\le N \\le 1000$).
* Dòng 2: $N$ số nguyên.`,
        outputFormat: `In ra các phần tử duy nhất sau khi đã lọc, cách nhau bởi một khoảng trắng.`,
        constraints: `$1 \\le N \\le 1000$.`,
        author: 'Đề thi thực hành PRF192 Lab (Source 25)',
        source: 'Kho Đề Ngoại Nhập 2.0',
        createdAt: '2026-11-01',
        isCustom: true,
        collectionId: 'prf192_array_sorting',
        progressiveHints: [
          {
            tier: 1,
            title: 'Gợi ý tư duy thuật toán',
            content: 'Khi xét phần tử $A[i]$, kiểm tra xem nó đã từng xuất hiện ở bất kỳ vị trí $j < i$ nào trước đó chưa.'
          },
          {
            tier: 2,
            title: 'Cảnh báo bẫy ngầm',
            content: 'Tạo mảng kết quả mới `res[]` chứa các phần tử chưa từng xuất hiện để tránh ghi đè làm mất dữ liệu mảng ban đầu.'
          },
          {
            tier: 3,
            title: 'Khung mã giả (Pseudocode Scaffold)',
            content: `int res[1000], k = 0;
for (int i = 0; i < n; i++) {
    int found = 0;
    for (int j = 0; j < k; j++) {
        if (res[j] == a[i]) { found = 1; break; }
    }
    if (!found) res[k++] = a[i];
}`
          }
        ],
        samples: [
          {
            input: '7\n1 3 2 3 5 1 2',
            output: '1 3 2 5',
            explanation: 'Các giá trị 3, 1, 2 xuất hiện lần 2 trở đi bị loại bỏ.'
          }
        ],
        testcases: [
          { id: 1, input: '7\n1 3 2 3 5 1 2', expectedOutput: '1 3 2 5', isHidden: false },
          { id: 2, input: '4\n5 5 5 5', expectedOutput: '5', isHidden: false },
          { id: 3, input: '5\n10 20 30 40 50', expectedOutput: '10 20 30 40 50', isHidden: true }
        ]
      },
      {
        id: 'prf_bubble_sort_asc',
        slug: 'bubble_sort_ascending',
        title: 'Cài đặt thuật toán Bubble Sort sắp xếp tăng dần',
        category: 'Mảng & Con trỏ',
        difficulty: 'Easy',
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: ['Sorting', 'BubbleSort', 'Algorithms'],
        solvedCount: 350,
        totalSubmissions: 480,
        statement: `Cho dãy $N$ số nguyên. Sử dụng thuật toán sắp xếp nổi bọt (Bubble Sort) để sắp xếp mảng theo thứ tự tăng dần.
In ra mảng sau khi sắp xếp trên một dòng.`,
        inputFormat: `* Dòng 1: Số nguyên dương $N$ ($1 \\le N \\le 500$).
* Dòng 2: $N$ số nguyên.`,
        outputFormat: `In ra mảng đã sắp xếp tăng dần.`,
        constraints: `$1 \\le N \\le 500$.`,
        author: 'Đề thi thực hành PRF192 Lab (Source 35)',
        source: 'Kho Đề Ngoại Nhập 2.0',
        createdAt: '2026-11-01',
        isCustom: true,
        collectionId: 'prf192_array_sorting',
        progressiveHints: [
          {
            tier: 1,
            title: 'Gợi ý tư duy thuật toán',
            content: 'So sánh từng cặp 2 phần tử liền kề $a[j]$ và $a[j+1]$. Nếu $a[j] > a[j+1]$ thì đổi chỗ.'
          },
          {
            tier: 2,
            title: 'Cảnh báo bẫy ngầm',
            content: 'Vòng lặp trong chạy từ $j = 0$ đến $n - i - 2$ để không bị vượt biên (out-of-bounds) khi truy cập `a[j+1]`.'
          },
          {
            tier: 3,
            title: 'Khung mã giả (Pseudocode Scaffold)',
            content: `for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
        if (a[j] > a[j + 1]) {
            int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
        }
    }
}`
          }
        ],
        samples: [
          {
            input: '5\n64 34 25 12 22',
            output: '12 22 25 34 64',
            explanation: 'Sắp xếp dãy số tăng dần.'
          }
        ],
        testcases: [
          { id: 1, input: '5\n64 34 25 12 22', expectedOutput: '12 22 25 34 64', isHidden: false },
          { id: 2, input: '3\n3 2 1', expectedOutput: '1 2 3', isHidden: false },
          { id: 3, input: '6\n-5 10 -2 0 8 3', expectedOutput: '-5 -2 0 3 8 10', isHidden: true }
        ]
      },
      ...PRF192_MASTER_PROBLEMS.filter(p => p.collectionId === 'prf192_array_sorting')
    ]
  },

  // 3. STRING & CHARACTER MASTERY
  {
    id: 'prf192_string_mastery',
    title: 'BỘ ĐỀ 3: Xử Lý Chuỗi & Ký Tự Nâng Cao (String & Character Algorithms)',
    titleEn: 'String & Character Mastery',
    description: 'Tuyển tập 18+ bài toán chuỗi chuyên sâu: Đảo ngược từ trong câu, chuẩn hóa khoảng trắng thừa, đếm chữ số, kiểm tra xâu đối xứng Palindrome, tìm từ dài nhất.',
    category: 'Xử lý Chuỗi (Strings)',
    icon: 'type',
    color: 'emerald',
    difficultySummary: 'Intermediate',
    isSystem: true,
    createdAt: '2026-11-01',
    problems: [
      {
        id: 'prf_str_count_digits_letters',
        slug: 'count_digits_and_letters',
        title: 'Đếm số lượng chữ số và chữ cái trong chuỗi',
        category: 'Xử lý Chuỗi (Strings)',
        difficulty: 'Easy',
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: ['Strings', 'Character', 'Counting', 'PRF192'],
        solvedCount: 450,
        totalSubmissions: 600,
        statement: `Cho chuỗi ký tự $S$ có thể chứa khoảng trắng và các ký tự đặc biệt.
Hãy đếm và in ra số lượng chữ cái tiếng Anh (chữ hoa và chữ thường) và số lượng chữ số ($0-9$) xuất hiện trong chuỗi $S$.`,
        inputFormat: `Một dòng duy nhất chứa chuỗi $S$ ($1 \\le |S| \\le 500$).`,
        outputFormat: `In ra hai số nguyên trên một dòng cách nhau bởi dấu cách: \`[Số chữ cái] [Số chữ số]\`.`,
        constraints: `$1 \\le |S| \\le 500$.`,
        author: 'Đề thi thực hành PRF192 Lab (Source 40, 50)',
        source: 'Kho Đề Ngoại Nhập 2.0',
        createdAt: '2026-11-01',
        isCustom: true,
        collectionId: 'prf192_string_mastery',
        progressiveHints: [
          {
            tier: 1,
            title: 'Gợi ý tư duy thuật toán',
            content: 'Duyệt từng ký tự từ đầu chuỗi cho đến khi gặp ký tự kết thúc `\\0`. Có thể dùng `isalpha(c)` và `isdigit(c)` từ thư viện `<ctype.h>`.'
          },
          {
            tier: 2,
            title: 'Cảnh báo bẫy ngầm',
            content: 'Để đọc chuỗi có dấu cách, dùng `gets(s)` hoặc `fgets(s, sizeof(s), stdin)`, KHÔNG dùng `scanf("%s", s)` vì nó sẽ dừng ngay khi gặp dấu cách đầu tiên!'
          },
          {
            tier: 3,
            title: 'Khung mã giả (Pseudocode Scaffold)',
            content: `int letters = 0, digits = 0;
for (int i = 0; s[i] != '\\0'; i++) {
    if (isalpha(s[i])) letters++;
    else if (isdigit(s[i])) digits++;
}
printf("%d %d\\n", letters, digits);`
          }
        ],
        samples: [
          {
            input: 'FPT University 2026 Codefight!',
            output: '22 4',
            explanation: 'Có 22 chữ cái (FPT University Codefight) và 4 chữ số (2026).'
          }
        ],
        testcases: [
          { id: 1, input: 'FPT University 2026 Codefight!', expectedOutput: '22 4', isHidden: false },
          { id: 2, input: 'Hello World', expectedOutput: '10 0', isHidden: false },
          { id: 3, input: '1234567890', expectedOutput: '0 10', isHidden: true },
          { id: 4, input: '!@#$%^&*()', expectedOutput: '0 0', isHidden: true }
        ]
      },
      {
        id: 'prf_str_palindrome',
        slug: 'check_palindrome_string',
        title: 'Kiểm tra chuỗi đối xứng (Palindrome String)',
        category: 'Xử lý Chuỗi (Strings)',
        difficulty: 'Easy',
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: ['Strings', 'Two-Pointers', 'Palindrome'],
        solvedCount: 390,
        totalSubmissions: 520,
        statement: `Một chuỗi được gọi là Palindrome nếu đọc xuôi hay đọc ngược đều giống hệt nhau.
Cho một chuỗi ký tự $S$ (không phân biệt chữ hoa, chữ thường). Hãy in ra \`YES\` nếu $S$ là chuỗi đối xứng, ngược lại in ra \`NO\`.`,
        inputFormat: `Một dòng duy nhất chứa chuỗi ký tự $S$ ($1 \\le |S| \\le 1000$, không chứa khoảng trắng).`,
        outputFormat: `In ra \`YES\` hoặc \`NO\`.`,
        constraints: `$1 \\le |S| \\le 1000$.`,
        author: 'Đề thi thực hành PRF192 Lab',
        source: 'Kho Đề Ngoại Nhập 2.0',
        createdAt: '2026-11-01',
        isCustom: true,
        collectionId: 'prf192_string_mastery',
        progressiveHints: [
          {
            tier: 1,
            title: 'Gợi ý tư duy thuật toán',
            content: 'Dùng kỹ thuật 2 con trỏ: Con trỏ $L$ bắt đầu từ đầu chuỗi ($0$), con trỏ $R$ bắt đầu từ cuối chuỗi ($len - 1$). So sánh $s[L]$ và $s[R]$.'
          },
          {
            tier: 2,
            title: 'Cảnh báo bẫy ngầm',
            content: 'Đề bài yêu cầu không phân biệt hoa thường, nên trước khi so sánh cần dùng `tolower()` để chuẩn hóa cả hai ký tự về cùng dạng.'
          },
          {
            tier: 3,
            title: 'Khung mã giả (Pseudocode Scaffold)',
            content: `int l = 0, r = strlen(s) - 1, ok = 1;
while (l < r) {
    if (tolower(s[l]) != tolower(s[r])) { ok = 0; break; }
    l++; r--;
}
printf("%s\\n", ok ? "YES" : "NO");`
          }
        ],
        samples: [
          {
            input: 'Radar',
            output: 'YES',
            explanation: 'Chuỗi "Radar" đọc ngược là "radaR", không phân biệt hoa thường nên là đối xứng.'
          },
          {
            input: 'Codefight',
            output: 'NO',
            explanation: 'Chuỗi "Codefight" không đối xứng.'
          }
        ],
        testcases: [
          { id: 1, input: 'Radar', expectedOutput: 'YES', isHidden: false },
          { id: 2, input: 'Codefight', expectedOutput: 'NO', isHidden: false },
          { id: 3, input: 'a', expectedOutput: 'YES', isHidden: true, explanation: '1 ký tự luôn đối xứng.' },
          { id: 4, input: 'Level', expectedOutput: 'YES', isHidden: true }
        ]
      },
      {
        id: 'prf_str_normalize_spaces',
        slug: 'normalize_whitespace_string',
        title: 'Chuẩn hóa khoảng trắng thừa trong văn bản',
        category: 'Xử lý Chuỗi (Strings)',
        difficulty: 'Medium',
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: ['Strings', 'Formatting', 'Tokenizer'],
        solvedCount: 280,
        totalSubmissions: 430,
        statement: `Cho chuỗi văn bản $S$. Hãy chuẩn hóa chuỗi theo các quy tắc sau:
1. Xóa toàn bộ khoảng trắng ở đầu và cuối chuỗi.
2. Giữa các từ liền kề chỉ được phép có đúng một dấu cách duy nhất.`,
        inputFormat: `Một dòng duy nhất chứa chuỗi văn bản $S$ ($1 \\le |S| \\le 1000$).`,
        outputFormat: `In ra chuỗi sau khi đã chuẩn hóa khoảng trắng trên một dòng.`,
        constraints: `$1 \\le |S| \\le 1000$.`,
        author: 'Đề thi thực hành PRF192 Lab (Source 52)',
        source: 'Kho Đề Ngoại Nhập 2.0',
        createdAt: '2026-11-01',
        isCustom: true,
        collectionId: 'prf192_string_mastery',
        progressiveHints: [
          {
            tier: 1,
            title: 'Gợi ý tư duy thuật toán',
            content: 'Có thể dùng hàm `strtok(s, " ")` để tách chuỗi thành các từ, sau đó ghép lại với nhau bằng đúng 1 khoảng trắng.'
          },
          {
            tier: 2,
            title: 'Cảnh báo bẫy ngầm',
            content: 'Cẩn thận không in khoảng trắng ở trước từ đầu tiên và sau từ cuối cùng.'
          },
          {
            tier: 3,
            title: 'Khung mã giả (Pseudocode Scaffold)',
            content: `char *token = strtok(s, " ");
int first = 1;
while (token != NULL) {
    if (!first) printf(" ");
    printf("%s", token);
    first = 0;
    token = strtok(NULL, " ");
}
printf("\\n");`
          }
        ],
        samples: [
          {
            input: '   Lap    trinh   C   can   ban   ',
            output: 'Lap trinh C can ban',
            explanation: 'Bỏ khoảng trắng đầu đuôi và rút gọn nhiều khoảng trắng giữa các từ thành 1 khoảng trắng.'
          }
        ],
        testcases: [
          { id: 1, input: '   Lap    trinh   C   can   ban   ', expectedOutput: 'Lap trinh C can ban', isHidden: false },
          { id: 2, input: 'Hello World', expectedOutput: 'Hello World', isHidden: false },
          { id: 3, input: '   Test   ', expectedOutput: 'Test', isHidden: true }
        ]
      },
      ...PRF192_MASTER_PROBLEMS.filter(p => p.collectionId === 'prf192_string_mastery')
    ]
  },

  // 4. MATH, PRIMES & NUMBER THEORY
  {
    id: 'prf192_math_algorithms',
    title: 'BỘ ĐỀ 4: Số Học, Đệ Quy & Số Đặc Biệt (Math & Prime/Fibonacci/Armstrong)',
    titleEn: 'Math, Primes, Armstrong & Recursion',
    description: 'Tuyển tập 46+ bài toán số học bám sát 100% đề thi: Số nguyên tố, số chính phương, số Armstrong, dãy Fibonacci, Ước chung lớn nhất (GCD), Bội chung nhỏ nhất (LCM).',
    category: 'Toán học & Thuật toán',
    icon: 'calculator',
    color: 'blue',
    difficultySummary: 'Beginner',
    isSystem: true,
    createdAt: '2026-11-01',
    problems: [
      {
        id: 'prf_math_prime_check',
        slug: 'check_prime_number',
        title: 'Kiểm tra số nguyên tố tối ưu (Prime Check)',
        category: 'Toán học & Thuật toán',
        difficulty: 'Easy',
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: ['Math', 'Primes', 'Optimization', 'PRF192'],
        solvedCount: 520,
        totalSubmissions: 700,
        statement: `Cho số nguyên $N$. Hãy viết hàm kiểm tra $N$ có phải là số nguyên tố hay không.
Số nguyên tố là số nguyên lớn hơn 1 chỉ có đúng 2 ước dương là 1 và chính nó.
In ra \`YES\` nếu $N$ là số nguyên tố, ngược lại in ra \`NO\`.`,
        inputFormat: `Một dòng duy nhất chứa số nguyên $N$ ($-10^9 \\le N \\le 10^9$).`,
        outputFormat: `In ra \`YES\` hoặc \`NO\`.`,
        constraints: `$-10^9 \\le N \\le 10^9$.`,
        author: 'Đề thi thực hành PRF192 Lab (Source 29)',
        source: 'Kho Đề Ngoại Nhập 2.0',
        createdAt: '2026-11-01',
        isCustom: true,
        collectionId: 'prf192_math_algorithms',
        progressiveHints: [
          {
            tier: 1,
            title: 'Gợi ý tư duy thuật toán',
            content: 'Nếu $N < 2$, chắc chắn không phải số nguyên tố. Với $N \\ge 2$, chỉ cần kiểm tra các ước từ $2$ đến $\\sqrt{N}$.'
          },
          {
            tier: 2,
            title: 'Cảnh báo bẫy ngầm',
            content: 'Dùng điều kiện `i * i <= n` thay vì `i <= sqrt(n)` để tránh sai số dấu phẩy động hoặc phải import `<math.h>`.'
          },
          {
            tier: 3,
            title: 'Khung mã giả (Pseudocode Scaffold)',
            content: `int isPrime(long long n) {
    if (n < 2) return 0;
    for (long long i = 2; i * i <= n; i++) {
        if (n % i == 0) return 0;
    }
    return 1;
}`
          }
        ],
        samples: [
          {
            input: '17',
            output: 'YES',
            explanation: '17 là số nguyên tố.'
          },
          {
            input: '4',
            output: 'NO',
            explanation: '4 chia hết cho 2.'
          }
        ],
        testcases: [
          { id: 1, input: '17', expectedOutput: 'YES', isHidden: false },
          { id: 2, input: '4', expectedOutput: 'NO', isHidden: false },
          { id: 3, input: '1', expectedOutput: 'NO', isHidden: true, explanation: '1 không phải số nguyên tố.' },
          { id: 4, input: '2', expectedOutput: 'YES', isHidden: true, explanation: '2 là số nguyên tố chẵn duy nhất.' },
          { id: 5, input: '-7', expectedOutput: 'NO', isHidden: true, explanation: 'Số âm không phải số nguyên tố.' }
        ]
      },
      {
        id: 'prf_math_gcd_lcm',
        slug: 'greatest_common_divisor_gcd_lcm',
        title: 'Ước số chung lớn nhất (GCD) & Bội chung nhỏ nhất (LCM)',
        category: 'Toán học & Thuật toán',
        difficulty: 'Easy',
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: ['Math', 'Euclid', 'GCD', 'LCM'],
        solvedCount: 460,
        totalSubmissions: 590,
        statement: `Cho hai số nguyên dương $A$ và $B$. Hãy tìm và in ra:
1. Ước số chung lớn nhất $\\gcd(A, B)$
2. Bội số chung nhỏ nhất $\\text{lcm}(A, B)$
Hai số được in trên một dòng cách nhau bởi một khoảng trắng.`,
        inputFormat: `Một dòng duy nhất chứa hai số nguyên dương $A, B$ ($1 \\le A, B \\le 10^9$).`,
        outputFormat: `In ra: \`[GCD] [LCM]\`.`,
        constraints: `$1 \\le A, B \\le 10^9$.`,
        author: 'Đề thi thực hành PRF192 Lab (Source 42)',
        source: 'Kho Đề Ngoại Nhập 2.0',
        createdAt: '2026-11-01',
        isCustom: true,
        collectionId: 'prf192_math_algorithms',
        progressiveHints: [
          {
            tier: 1,
            title: 'Gợi ý tư duy thuật toán',
            content: 'Dùng thuật toán Euclid tìm GCD: $\\gcd(a, b) = \\gcd(b, a \\% b)$ cho tới khi $b = 0$.'
          },
          {
            tier: 2,
            title: 'Cảnh báo bẫy ngầm',
            content: 'Công thức $\\text{lcm}(a, b) = (a \\times b) / \\gcd(a, b)$. Chú ý tích $a \\times b$ có thể vượt quá $2 \\times 10^9$ gây tràn số `int`, nên chia trước rồi nhân sau hoặc ép kiểu sang `long long`: `(1LL * a / gcd(a, b)) * b`.'
          },
          {
            tier: 3,
            title: 'Khung mã giả (Pseudocode Scaffold)',
            content: `long long gcd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}
long long g = gcd(a, b);
long long l = (a / g) * b;
printf("%lld %lld\\n", g, l);`
          }
        ],
        samples: [
          {
            input: '12 18',
            output: '6 36',
            explanation: 'GCD(12, 18) = 6, LCM(12, 18) = 36.'
          }
        ],
        testcases: [
          { id: 1, input: '12 18', expectedOutput: '6 36', isHidden: false },
          { id: 2, input: '5 7', expectedOutput: '1 35', isHidden: false },
          { id: 3, input: '100 25', expectedOutput: '25 100', isHidden: true }
        ]
      },
      {
        id: 'prf_math_armstrong',
        slug: 'check_armstrong_number',
        title: 'Kiểm tra số Armstrong (Narcissistic Number)',
        category: 'Toán học & Thuật toán',
        difficulty: 'Easy',
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: ['Math', 'Digits', 'Armstrong'],
        solvedCount: 340,
        totalSubmissions: 470,
        statement: `Số Armstrong (hay số tự mãn) là một số nguyên dương có giá trị bằng tổng các chữ số của nó, mỗi chữ số được nâng lên lũy thừa bằng số lượng chữ số của số đó.
Ví dụ: $153$ có 3 chữ số, và $1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153$ $\\rightarrow$ Là số Armstrong.
Cho số nguyên dương $N$. In ra \`YES\` nếu $N$ là số Armstrong, ngược lại in ra \`NO\`.`,
        inputFormat: `Một dòng duy nhất chứa số nguyên dương $N$ ($1 \\le N \\le 10^7$).`,
        outputFormat: `In ra \`YES\` hoặc \`NO\`.`,
        constraints: `$1 \\le N \\le 10^7$.`,
        author: 'Đề thi thực hành PRF192 Lab (Source 3)',
        source: 'Kho Đề Ngoại Nhập 2.0',
        createdAt: '2026-11-01',
        isCustom: true,
        collectionId: 'prf192_math_algorithms',
        progressiveHints: [
          {
            tier: 1,
            title: 'Gợi ý tư duy thuật toán',
            content: 'Bước 1: Đếm số lượng chữ số $K$ của $N$. Bước 2: Tách từng chữ số của $N$, tính tổng lũy thừa bậc $K$.'
          },
          {
            tier: 2,
            title: 'Cảnh báo bẫy ngầm',
            content: 'Nhớ lưu giá trị ban đầu của $N$ vào một biến tạm `int original = n;` vì sau khi chia lấy chữ số thì $N$ sẽ trở thành 0.'
          },
          {
            tier: 3,
            title: 'Khung mã giả (Pseudocode Scaffold)',
            content: `int original = n, count = 0, temp = n;
while (temp > 0) { count++; temp /= 10; }
temp = original;
long long sum = 0;
while (temp > 0) {
    int digit = temp % 10;
    sum += pow(digit, count);
    temp /= 10;
}
printf("%s\\n", sum == original ? "YES" : "NO");`
          }
        ],
        samples: [
          {
            input: '153',
            output: 'YES',
            explanation: '1^3 + 5^3 + 3^3 = 153.'
          },
          {
            input: '123',
            output: 'NO',
            explanation: '1^3 + 2^3 + 3^3 = 36 != 123.'
          }
        ],
        testcases: [
          { id: 1, input: '153', expectedOutput: 'YES', isHidden: false },
          { id: 2, input: '123', expectedOutput: 'NO', isHidden: false },
          { id: 3, input: '9', expectedOutput: 'YES', isHidden: true, explanation: 'Số có 1 chữ số luôn là số Armstrong.' },
          { id: 4, input: '370', expectedOutput: 'YES', isHidden: true }
        ]
      },
      ...PRF192_MASTER_PROBLEMS.filter(p => p.collectionId === 'prf192_math_algorithms')
    ]
  },

  // 5. USER CUSTOM WORKSPACE
  {
    id: 'user_custom_library',
    title: 'Kho Đề Tự Tạo & Ngoại Nhập (My Workspace)',
    titleEn: 'My Uploads & Custom Workspace',
    description: 'Không gian lưu trữ cá nhân dành riêng cho các bài tập bạn tự tạo thủ công hoặc nhập từ bên ngoài. Hỗ trợ thêm mới, chỉnh sửa, gán test cases và xóa bài tập.',
    category: 'Kho Đề Cá Nhân',
    icon: 'folder-git-2',
    color: 'purple',
    difficultySummary: 'All Levels',
    isSystem: false,
    createdAt: '2026-11-01',
    problems: []
  }
];
