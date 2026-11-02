import type { Problem } from '../types/index.ts';

export const mockProblems: Problem[] = [
  {
    id: '1',
    slug: 'icpc26_mn_c',
    title: 'ICPC 2026 miền Nam - C: Sodium Sort',
    category: 'Sắp xếp & Cấu trúc dữ liệu',
    difficulty: 'Hard',
    points: 100,
    timeLimit: 2.0,
    memoryLimit: 1024,
    tags: ['Fenwick Tree', 'Segment Tree', 'Coordinate Compression', 'Greedy'],
    solvedCount: 142,
    totalSubmissions: 890,
    statement: `Trong phòng thí nghiệm hóa học của kỳ thi ICPC 2026 miền Nam, các nhà khoa học đang sắp xếp $N$ ống nghiệm chứa nguyên tố Natri (Sodium). 
Mỗi ống nghiệm thứ $i$ có mức độ hoạt tính $A_i$.

Để sắp xếp lại các ống nghiệm theo thứ tự không giảm của hoạt tính mà không làm nổ dung dịch, mỗi bước bạn được phép tráo đổi hai ống nghiệm liền kề nếu độ chênh lệch hoạt tính giữa chúng thỏa mãn:
$$|A_i - A_{i+1}| \\le K$$
với $K$ là hằng số phân rã nhiệt độ an toàn.

Hãy tính số lần đổi chỗ ít nhất để đưa dãy về trạng thái có thứ tự tăng dần. Nếu không thể đạt được trạng thái mong muốn, hãy in ra $-1$.`,
    inputFormat: `* Dòng đầu tiên chứa hai số nguyên dương $N$ và $K$ ($1 \\le N \\le 2 \\times 10^5, 0 \\le K \\le 10^9$).
* Dòng thứ hai chứa $N$ số nguyên $A_1, A_2, \\dots, A_N$ ($1 \\le A_i \\le 10^9$).`,
    outputFormat: `In ra một số nguyên duy nhất là số phép tráo đổi tối thiểu, hoặc $-1$ nếu không thể sắp xếp.`,
    constraints: `* **Subtask 1 (20% số điểm):** $N \\le 1000$ và $K = 10^9$ (luôn được phép đổi chỗ).
* **Subtask 2 (30% số điểm):** $N \\le 5000, A_i \\le 10^5$.
* **Subtask 3 (50% số điểm):** Không có ràng buộc gì thêm.`,
    samples: [
      {
        input: `5 3
4 2 1 5 3`,
        output: `3`,
        explanation: `Các bước đổi chỗ: (4, 2) -> (2, 4); (4, 1) không đổi được trực tiếp nếu chênh lệch > 3. Kết quả tối ưu mất 3 phép biến đổi hợp lệ.`
      },
      {
        input: `3 1
10 1 5`,
        output: `-1`,
        explanation: `Độ chênh lệch giữa 10 và 1 là 9 > 1 nên không bao giờ tráo đổi được vị trí ban đầu.`
      }
    ],
    subtasks: [
      { id: 1, points: 20, description: 'N <= 1000, K = 10^9' },
      { id: 2, points: 30, description: 'N <= 5000' },
      { id: 3, points: 50, description: 'Full constraints' }
    ],
    editorial: `### Hướng dẫn thuật toán
1. Đây là bài toán đếm số nghịch thế kết hợp đồ thị thành phần liên thông.
2. Dựng đồ thị vô hướng trong đó cạnh nối giữa $i$ và $j$ nếu $|A_i - A_j| \\le K$.
3. Các phần tử cùng thành phần liên thông có thể sắp xếp tùy ý bên trong tập hợp vị trí của chúng.
4. Dùng thuật toán nén tọa độ và Fenwick Tree (Binary Indexed Tree) để tính số nghịch thế trong từng thành phần liên thông với độ phức tạp $O(N \\log N)$.`,
    author: 'AH ICPC Setter Team',
    source: 'ICPC 2026 Southern Vietnam Regional Contest',
    createdAt: '2026-10-18'
  },
  {
    id: '2',
    slug: 'torch',
    title: 'Rước đuốc Olympic',
    category: 'Quy hoạch động',
    difficulty: 'Medium',
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 512,
    tags: ['Dynamic Programming', 'Binary Search', 'Prefix Sum'],
    solvedCount: 412,
    totalSubmissions: 1250,
    statement: `Tại lễ hội thể thao Olympic Sinh Viên, có $N$ vận động viên rước đuốc đứng tại các tọa độ $X_1, X_2, \\dots, X_N$ trên một trục đường thẳng.
Mỗi vận động viên $i$ có thể lực $E_i$, có thể chạy quãng đường tối đa $E_i$ đơn vị chiều dài. Ngọn đuốc ban đầu nằm ở vị trí của vận động viên $1$ và cần được chuyển tới vận động viên $N$.

Một người chỉ có thể truyền đuốc cho người khác nếu khoảng cách giữa họ không vượt quá thể lực còn lại của người đang cầm đuốc.
Tìm số lần chuyển đuốc ít nhất để đưa ngọn đuốc từ người $1$ đến người $N$.`,
    inputFormat: `* Dòng đầu tiên chứa số nguyên $N$ ($2 \\le N \\le 10^5$).
* $N$ dòng tiếp theo, dòng thứ $i$ chứa hai số nguyên $X_i$ và $E_i$ ($0 \\le X_1 < X_2 < \\dots < X_N \\le 10^9; 1 \\le E_i \\le 10^9$).`,
    outputFormat: `In ra số lần chuyển đuốc tối thiểu, hoặc $-1$ nếu ngọn đuốc không thể tới đích.`,
    constraints: `* **Subtask 1 (30% số điểm):** $N \\le 1000$.
* **Subtask 2 (70% số điểm):** $N \\le 10^5$.`,
    samples: [
      {
        input: `4
0 4
3 2
5 3
8 1`,
        output: `2`,
        explanation: `Người 1 (X=0, E=4) truyền cho người 2 (X=3, khoảng cách 3 <= 4). Người 2 (X=3, E=2) không với tới người 4 (X=8), nhưng người 1 có thể truyền trực tiếp hoặc chọn lộ trình tối ưu.`
      }
    ],
    editorial: `Sử dụng quy hoạch động $DP[i]$ là số bước ít nhất đến người thứ $i$. Có thể tối ưu bằng Breadth-First Search (BFS) hoặc Segment Tree / Monotonic Queue để đạt $O(N \\log N)$.`,
    author: 'Bedao Team',
    source: 'Bedao Grand Contest',
    createdAt: '2026-08-20'
  },
  {
    id: '3',
    slug: 'voi26_pine',
    title: 'VOI 26 Bài 5 - Cây thông',
    category: 'Đồ thị & Cây',
    difficulty: 'Expert',
    points: 100,
    timeLimit: 1.5,
    memoryLimit: 512,
    tags: ['Tree DP', 'Centroid Decomposition', 'Heavy-Light Decomposition'],
    solvedCount: 68,
    totalSubmissions: 540,
    statement: `Cho một cây gồm $N$ đỉnh được đánh số từ $1$ đến $N$. Mỗi đỉnh $u$ được gán một màu $C_u$ và một giá trị thẩm mỹ $V_u$.
Một "cây thông hình nón" là một cây con liên thông mà nếu xét từ gốc cây xuống các lá, số đỉnh cùng màu trên mỗi nhánh giảm dần đều.

Hãy tìm cây con thỏa mãn điều kiện có tổng giá trị thẩm mỹ $\\sum_{u \\in T} V_u$ lớn nhất.`,
    inputFormat: `* Dòng 1: Số nguyên dương $N$ ($1 \\le N \\le 10^5$).
* Dòng 2: $N$ số nguyên $C_1, C_2, \\dots, C_N$ ($1 \\le C_i \\le N$).
* Dòng 3: $N$ số nguyên $V_1, V_2, \\dots, V_N$ ($-10^9 \\le V_i \\le 10^9$).
* $N - 1$ dòng tiếp theo, mỗi dòng chứa hai số $u, v$ mô tả một cạnh của cây.`,
    outputFormat: `Ghi ra một số nguyên duy nhất là giá trị thẩm mỹ lớn nhất tìm được.`,
    constraints: `* Subtask 1 (20% số điểm): $N \\le 20$.
* Subtask 2 (30% số điểm): Đồ thị là một đường thẳng ($1-2-3-\\dots-N$).
* Subtask 3 (50% số điểm): Không có ràng buộc gì thêm.`,
    samples: [
      {
        input: `3
1 2 1
5 -2 10
1 2
2 3`,
        output: `15`,
        explanation: `Chọn các đỉnh 1 và 3 (thông qua đường nối phù hợp) để tối đa hóa tổng giá trị.`
      }
    ],
    editorial: `Bài toán phân rã cây bằng Centroid Decomposition kết hợp cấu trúc dữ liệu Persistent Segment Tree để đếm màu.`,
    author: 'AH VOI Prep',
    source: 'Kỳ thi Học sinh giỏi Quốc gia (VOI 2026)',
    createdAt: '2026-01-12'
  },
  {
    id: '4',
    slug: 'olp_ct25_lgsqr',
    title: 'Olympic Sinh Viên 2025 - Chuyên tin - CẶP SỐ',
    category: 'Toán học & Số học',
    difficulty: 'Easy',
    points: 20,
    timeLimit: 1.0,
    memoryLimit: 256,
    tags: ['Math', 'Number Theory', 'GCD', 'Sieve'],
    solvedCount: 1120,
    totalSubmissions: 2840,
    statement: `Cho hai số nguyên dương $L$ và $R$. Hãy đếm số lượng cặp số $(a, b)$ thỏa mãn:
1. $L \\le a < b \\le R$
2. $\\gcd(a, b) = a \\oplus b$ (với $\\oplus$ là phép toán XOR bit).`,
    inputFormat: `Một dòng duy nhất chứa hai số nguyên dương $L, R$ ($1 \\le L < R \\le 10^7$).`,
    outputFormat: `In ra số lượng cặp số thỏa mãn.`,
    constraints: `* Subtask 1 (40% số điểm): $R \\le 1000$.
* Subtask 2 (60% số điểm): $R \\le 10^7$.`,
    samples: [
      {
        input: `1 10`,
        output: `4`,
        explanation: `Các cặp thỏa mãn là (2, 3), (4, 6), (6, 7), (8, 12 ngoài khoảng)...`
      }
    ],
    editorial: `Nhận xét: $\\gcd(a, b) = a \\oplus b$. Đặt $c = a \\oplus b = \\gcd(a, b)$. Khi đó $b - a \\ge a \\oplus b = c$. Vì $c$ là ước của $a$ và $b$, nên $c$ cũng là ước của $b - a$. Do đó $b - a = c$. Thay $b = a + c$ vào $a \\oplus (a+c) = c$, ta duyệt theo $c$ tương tự sàng Eratosthenes.`,
    author: 'Hội Tin học Việt Nam',
    source: 'Kỳ thi Olympic Tin học Sinh viên Toàn quốc 2025',
    createdAt: '2025-12-10'
  },
  // ==========================================
  // CHUYÊN ĐỀ CHUỖI & KÝ TỰ (STRING MASTERY)
  // ==========================================
  {
    id: 'str_1',
    slug: 'str_len_manual',
    title: 'Đếm độ dài chuỗi không dùng strlen()',
    category: 'Xử lý Chuỗi (Strings)',
    difficulty: 'Easy',
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    tags: ['Strings', 'Pointers', 'Basics', 'Null-Terminator'],
    solvedCount: 1420,
    totalSubmissions: 1890,
    statement: `Trong ngôn ngữ C, chuỗi ký tự (\`char[]\`) luôn kết thúc bởi ký tự rỗng (Null-terminator) có giá trị \`'\\0'\` (mã ASCII là 0).
Cho một chuỗi ký tự $S$ không chứa khoảng trắng. Hãy viết chương trình đếm độ dài của chuỗi (số lượng ký tự) mà **không được sử dụng hàm \`strlen()\`** trong thư viện \`<string.h>\`.

*Gợi ý:* Sử dụng con trỏ hoặc chỉ số mảng duyệt từ vị trí $0$ cho đến khi phần tử gặp ký tự \`'\\0'\`.`,
    inputFormat: `Một chuỗi ký tự $S$ ($1 \\le |S| \\le 1000$). Chuỗi chỉ chứa các ký tự chữ cái và chữ số.`,
    outputFormat: `In ra một số nguyên duy nhất là độ dài của chuỗi $S$.`,
    constraints: `$1 \\le |S| \\le 1000$.`,
    samples: [
      {
        input: `HelloWorld`,
        output: `10`,
        explanation: `Chuỗi "HelloWorld" gồm đúng 10 ký tự.`
      },
      {
        input: `Code`,
        output: `4`,
        explanation: `Chuỗi "Code" gồm 4 ký tự.`
      }
    ],
    editorial: `Khởi tạo biến \`int len = 0;\`. Dùng vòng lặp \`while (s[len] != '\\0') len++;\`. Sau vòng lặp, giá trị \`len\` chính là số ký tự của chuỗi.`,
    author: 'AHtest Academy String Team',
    source: 'Bộ Chuyên Đề String Mastery',
    createdAt: '2026-11-01',
    testcases: [
      { id: 1, input: 'HelloWorld', expectedOutput: '10', isHidden: false },
      { id: 2, input: 'Code', expectedOutput: '4', isHidden: false },
      { id: 3, input: 'A', expectedOutput: '1', isHidden: true, explanation: 'Kiểm thử biên chuỗi 1 ký tự' },
      { id: 4, input: 'ProgrammingLanguageC17', expectedOutput: '22', isHidden: true },
      { id: 5, input: 'DevCpp2026MinGW', expectedOutput: '15', isHidden: true }
    ]
  },
  {
    id: 'str_2',
    slug: 'str_vowels_consonants',
    title: 'Đếm số lượng nguyên âm & phụ âm',
    category: 'Xử lý Chuỗi (Strings)',
    difficulty: 'Easy',
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    tags: ['Strings', 'ASCII', 'Counting', 'Char-Classification'],
    solvedCount: 1180,
    totalSubmissions: 1540,
    statement: `Cho chuỗi ký tự $S$ chỉ gồm các chữ cái tiếng Anh (\`a-z\`, \`A-Z\`, không chứa khoảng trắng).
Các nguyên âm trong bảng chữ cái tiếng Anh gồm 5 chữ cái: \`a, e, i, o, u\` (và các dạng in hoa \`A, E, I, O, U\`). Các chữ cái còn lại được xem là phụ âm.

Hãy viết chương trình đếm số lượng nguyên âm và số lượng phụ âm có trong chuỗi $S$.`,
    inputFormat: `Một dòng duy nhất chứa chuỗi $S$ ($1 \\le |S| \\le 1000$).`,
    outputFormat: `In ra hai số nguyên cách nhau một khoảng trắng: \`<so_nguyen_am> <so_phu_am>\`.`,
    constraints: `$1 \\le |S| \\le 1000$.`,
    samples: [
      {
        input: `Hello`,
        output: `2 3`,
        explanation: `Nguyên âm: e, o (2). Phụ âm: H, l, l (3).`
      },
      {
        input: `Education`,
        output: `5 4`,
        explanation: `Nguyên âm: E, u, a, i, o (5). Phụ âm: d, c, t, n (4).`
      }
    ],
    editorial: `Duyệt từng ký tự từ đầu chuỗi đến \`'\\0'\`. Dùng hàm \`tolower()\` hoặc kiểm tra các ký tự \`'a', 'e', 'i', 'o', 'u'\`. Nếu là nguyên âm tăng biến đếm nguyên âm, ngược lại tăng phụ âm.`,
    author: 'AHtest Academy String Team',
    source: 'Bộ Chuyên Đề String Mastery',
    createdAt: '2026-11-01',
    testcases: [
      { id: 1, input: 'Hello', expectedOutput: '2 3', isHidden: false },
      { id: 2, input: 'Education', expectedOutput: '5 4', isHidden: false },
      { id: 3, input: 'AeiOu', expectedOutput: '5 0', isHidden: true, explanation: 'Toàn bộ là nguyên âm' },
      { id: 4, input: 'Rhythm', expectedOutput: '0 6', isHidden: true, explanation: 'Toàn bộ là phụ âm' },
      { id: 5, input: 'ComputerScience', expectedOutput: '6 9', isHidden: true }
    ]
  },
  {
    id: 'str_3',
    slug: 'str_case_transform',
    title: 'Chuyển đổi hoa / thường chuẩn ASCII',
    category: 'Xử lý Chuỗi (Strings)',
    difficulty: 'Easy',
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    tags: ['Strings', 'ASCII-Table', 'Bitwise', 'Math'],
    solvedCount: 950,
    totalSubmissions: 1320,
    statement: `Trong bảng mã ASCII, chữ hoa \`'A'\` có mã $65$ và chữ thường \`'a'\` có mã $97$. Độ lệch giữa chữ thường và chữ hoa luôn là $32$.
Cho chuỗi ký tự $S$. Hãy biến đổi:
* Tất cả chữ cái viết hoa thành chữ cái viết thường.
* Tất cả chữ cái viết thường thành chữ cái viết hoa.
* Các ký tự chữ số hoặc ký tự đặc biệt giữ nguyên không đổi.`,
    inputFormat: `Một chuỗi $S$ ($1 \\le |S| \\le 1000$).`,
    outputFormat: `In ra chuỗi sau khi đã chuyển đổi hoa/thường.`,
    constraints: `$1 \\le |S| \\le 1000$.`,
    samples: [
      {
        input: `CodeFight2026`,
        output: `cODEfIGHT2026`,
        explanation: `C -> c, ode -> ODE, F -> f, ight -> IGHT, 2026 giữ nguyên.`
      },
      {
        input: `Hello`,
        output: `hELLO`,
        explanation: `H -> h, ello -> ELLO.`
      }
    ],
    editorial: `Nếu ký tự nằm trong đoạn \`['a', 'z']\` thì \`c -= 32\`. Nếu nằm trong đoạn \`['A', 'Z']\` thì \`c += 32\`.`,
    author: 'AHtest Academy String Team',
    source: 'Bộ Chuyên Đề String Mastery',
    createdAt: '2026-11-01',
    testcases: [
      { id: 1, input: 'CodeFight2026', expectedOutput: 'cODEfIGHT2026', isHidden: false },
      { id: 2, input: 'Hello', expectedOutput: 'hELLO', isHidden: false },
      { id: 3, input: 'ABCXYZ', expectedOutput: 'abcxyz', isHidden: true },
      { id: 4, input: 'modernc', expectedOutput: 'MODERNC', isHidden: true },
      { id: 5, input: 'aB1cD2eF3', expectedOutput: 'Ab1Cd2Ef3', isHidden: true }
    ]
  },
  {
    id: 'str_4',
    slug: 'str_normalize_spaces',
    title: 'Chuẩn hóa khoảng trắng & Xóa dấu cách thừa',
    category: 'Xử lý Chuỗi (Strings)',
    difficulty: 'Medium',
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    tags: ['Strings', 'Tokenization', 'Trim', 'Practical'],
    solvedCount: 820,
    totalSubmissions: 1410,
    statement: `Văn bản thô khi người dùng nhập từ bàn phím thường chứa nhiều dấu cách thừa ở đầu câu, cuối câu hoặc giữa các từ.
Hãy viết chương trình chuẩn hóa chuỗi $S$ sao cho:
1. Không có khoảng trắng ở đầu chuỗi và cuối chuỗi.
2. Giữa các từ liền kề chỉ được phép có **đúng 1 dấu khoảng trắng duy nhất**.`,
    inputFormat: `Một dòng duy nhất chứa chuỗi ký tự $S$ ($1 \\le |S| \\le 1000$).`,
    outputFormat: `In ra chuỗi sau khi đã được chuẩn hóa khoảng trắng.`,
    constraints: `Độ dài chuỗi $S$ không quá $1000$ ký tự.`,
    samples: [
      {
        input: `   lap   trinh    c    `,
        output: `lap trinh c`,
        explanation: `Bỏ dấu cách ở đầu và cuối, gộp các khoảng trắng liên tiếp thành 1 dấu cách.`
      },
      {
        input: `hello   world`,
        output: `hello world`,
        explanation: `Gộp 3 dấu cách giữa "hello" và "world" thành 1 dấu cách.`
      }
    ],
    editorial: `Kỹ thuật hai con trỏ (Two Pointers): Bỏ qua khoảng trắng đầu, khi gặp từ thì sao chép vào mảng mới. Sau mỗi từ, thêm đúng 1 khoảng trắng nếu chưa tới cuối chuỗi. Cuối cùng gắn ký tự null '\\0'.`,
    author: 'AHtest Academy String Team',
    source: 'Bộ Chuyên Đề String Mastery',
    createdAt: '2026-11-01',
    testcases: [
      { id: 1, input: '   lap   trinh    c    ', expectedOutput: 'lap trinh c', isHidden: false },
      { id: 2, input: 'hello   world', expectedOutput: 'hello world', isHidden: false },
      { id: 3, input: 'ahtest code compiler', expectedOutput: 'ahtest code compiler', isHidden: true },
      { id: 4, input: '      singleword      ', expectedOutput: 'singleword', isHidden: true },
      { id: 5, input: '  cau   truc   du   lieu   ', expectedOutput: 'cau truc du lieu', isHidden: true }
    ]
  },
  {
    id: 'str_5',
    slug: 'str_word_reversal',
    title: 'Đảo ngược từng từ trong câu (Word Reversal)',
    category: 'Xử lý Chuỗi (Strings)',
    difficulty: 'Medium',
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    tags: ['Strings', 'Two-Pointers', 'Tokenization', 'Inversion'],
    solvedCount: 790,
    totalSubmissions: 1260,
    statement: `Cho chuỗi ký tự $S$ gồm nhiều từ phân tách bởi một hoặc nhiều khoảng trắng.
Hãy đảo ngược thứ tự các ký tự trong từng từ, nhưng **giữ nguyên thứ tự các từ** trong câu.

Ví dụ: \`Hello World\` $\\rightarrow$ \`olleH dlroW\`.`,
    inputFormat: `Một dòng chứa chuỗi $S$ ($1 \\le |S| \\le 1000$).`,
    outputFormat: `In ra chuỗi sau khi đảo từng từ.`,
    constraints: `$1 \\le |S| \\le 1000$.`,
    samples: [
      {
        input: `Hello World C Language`,
        output: `olleH dlroW C egaugnaL`,
        explanation: `Đảo từng từ: Hello->olleH, World->dlroW, C->C, Language->egaugnaL.`
      },
      {
        input: `codefight ahtest`,
        output: `thgifedoc tsetha`,
        explanation: `codefight -> thgifedoc, ahtest -> tsetha.`
      }
    ],
    editorial: `Tìm điểm bắt đầu và kết thúc của từng từ trong câu. Dùng hàm đảo ngược đoạn mảng con \`reverse(start, end)\` bằng hai con trỏ tráo đổi từ hai đầu vào giữa.`,
    author: 'AHtest Academy String Team',
    source: 'Bộ Chuyên Đề String Mastery',
    createdAt: '2026-11-01',
    testcases: [
      { id: 1, input: 'Hello World C Language', expectedOutput: 'olleH dlroW C egaugnaL', isHidden: false },
      { id: 2, input: 'codefight ahtest', expectedOutput: 'thgifedoc tsetha', isHidden: false },
      { id: 3, input: 'Programming', expectedOutput: 'gnimmargorP', isHidden: true },
      { id: 4, input: 'dev c sandbox', expectedOutput: 'ved c xobdnas', isHidden: true },
      { id: 5, input: 'gcc 16 wasm 2026', expectedOutput: 'ccg 61 msaw 6202', isHidden: true }
    ]
  },
  {
    id: 'str_6',
    slug: 'str_palindrome',
    title: 'Kiểm tra xâu đối xứng Palindrome',
    category: 'Xử lý Chuỗi (Strings)',
    difficulty: 'Easy',
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    tags: ['Strings', 'Palindrome', 'Two-Pointers', 'Interview-Favorite'],
    solvedCount: 1650,
    totalSubmissions: 2100,
    statement: `Một chuỗi được gọi là Palindrome nếu khi đọc từ trái sang phải hay từ phải sang trái đều thu được chuỗi giống hệt nhau (không phân biệt chữ hoa và chữ thường).
Cho chuỗi ký tự $S$ (không có khoảng trắng). Hãy kiểm tra xem chuỗi có phải là Palindrome hay không.
In ra \`YES\` nếu đúng, ngược lại in ra \`NO\`.`,
    inputFormat: `Một chuỗi $S$ ($1 \\le |S| \\le 1000$).`,
    outputFormat: `In ra \`YES\` hoặc \`NO\`.`,
    constraints: `$1 \\le |S| \\le 1000$.`,
    samples: [
      {
        input: `Racecar`,
        output: `YES`,
        explanation: `"Racecar" đọc ngược lại là "racecaR", cùng chữ cái không phân biệt hoa thường nên là Palindrome.`
      },
      {
        input: `Hello`,
        output: `NO`,
        explanation: `"Hello" đọc ngược lại là "olleH" (không khớp).`
      }
    ],
    editorial: `Dùng 2 con trỏ: \`left = 0\`, \`right = len - 1\`. So sánh \`tolower(s[left])\` với \`tolower(s[right])\`. Nếu lệch nhau thì kết luận NO. Nếu duyệt hết mà luôn bằng nhau thì in YES.`,
    author: 'AHtest Academy String Team',
    source: 'Bộ Chuyên Đề String Mastery',
    createdAt: '2026-11-01',
    testcases: [
      { id: 1, input: 'Racecar', expectedOutput: 'YES', isHidden: false },
      { id: 2, input: 'Hello', expectedOutput: 'NO', isHidden: false },
      { id: 3, input: 'A', expectedOutput: 'YES', isHidden: true },
      { id: 4, input: 'Noon', expectedOutput: 'YES', isHidden: true },
      { id: 5, input: 'Abccb', expectedOutput: 'NO', isHidden: true }
    ]
  },
  {
    id: 'str_7',
    slug: 'str_longest_word',
    title: 'Tìm từ dài nhất trong câu',
    category: 'Xử lý Chuỗi (Strings)',
    difficulty: 'Medium',
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    tags: ['Strings', 'Word-Analysis', 'Algorithms'],
    solvedCount: 680,
    totalSubmissions: 1120,
    statement: `Cho một câu $S$ gồm nhiều từ phân tách bởi khoảng trắng.
Hãy tìm từ có độ dài lớn nhất trong câu. Nếu có nhiều từ có cùng độ dài lớn nhất, hãy in ra **từ xuất hiện đầu tiên**.
Định dạng in ra: \`<tu_dai_nhat> <do_dai>\`.`,
    inputFormat: `Một dòng duy nhất chứa chuỗi $S$ ($1 \\le |S| \\le 1000$).`,
    outputFormat: `In ra từ dài nhất và độ dài của nó cách nhau bởi dấu cách.`,
    constraints: `$1 \\le |S| \\le 1000$.`,
    samples: [
      {
        input: `Lap trinh ngon ngu C rat thu vi`,
        output: `trinh 5`,
        explanation: `Từ "trinh" có độ dài 5 ký tự là từ dài nhất trong câu.`
      },
      {
        input: `Welcome to AHtest code academy`,
        output: `Welcome 7`,
        explanation: `Cả "Welcome" và "academy" đều dài 7, nhưng "Welcome" xuất hiện trước.`
      }
    ],
    editorial: `Tách câu thành các từ. Duyệt và đo độ dài từng từ. Dùng biến \`maxLen\` và mảng lưu lại từ dài nhất khi tìm thấy từ có độ dài lớn hơn hẳn \`maxLen\`.`,
    author: 'AHtest Academy String Team',
    source: 'Bộ Chuyên Đề String Mastery',
    createdAt: '2026-11-01',
    testcases: [
      { id: 1, input: 'Lap trinh ngon ngu C rat thu vi', expectedOutput: 'trinh 5', isHidden: false },
      { id: 2, input: 'Welcome to AHtest code academy', expectedOutput: 'Welcome 7', isHidden: false },
      { id: 3, input: 'Supercalifragilistic', expectedOutput: 'Supercalifragilistic 20', isHidden: true },
      { id: 4, input: 'mot hai bon nam', expectedOutput: 'hai 3', isHidden: true },
      { id: 5, input: 'Hoc lap trinh chuyen nghiep', expectedOutput: 'chuyen 6', isHidden: true }
    ]
  },
  {
    id: 'str_8',
    slug: 'str_substring_search',
    title: 'Tìm kiếm chuỗi con (String Pattern Matching)',
    category: 'Xử lý Chuỗi (Strings)',
    difficulty: 'Medium',
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    tags: ['Strings', 'Pattern-Matching', 'Search', 'strstr'],
    solvedCount: 540,
    totalSubmissions: 980,
    statement: `Cho chuỗi văn bản $S$ và chuỗi mẫu $P$ (cả hai chuỗi không chứa khoảng trắng).
Hãy tìm vị trí xuất hiện đầu tiên của chuỗi $P$ trong chuỗi $S$ (chỉ số tính từ $0$).
Nếu $P$ không xuất hiện trong $S$, in ra $-1$.`,
    inputFormat: `* Dòng 1: Chuỗi $S$ ($1 \\le |S| \\le 1000$).
* Dòng 2: Chuỗi mẫu $P$ ($1 \\le |P| \\le |S|$).`,
    outputFormat: `In ra chỉ số nguyên là vị trí đầu tiên $P$ xuất hiện trong $S$, hoặc $-1$.`,
    constraints: `$1 \\le |P| \\le |S| \\le 1000$.`,
    samples: [
      {
        input: `programming\ngram`,
        output: `3`,
        explanation: `Chuỗi "gram" xuất hiện tại vị trí chỉ số 3 trong "programming" (p=0, r=1, o=2, g=3).`
      },
      {
        input: `helloworld\nabc`,
        output: `-1`,
        explanation: `"abc" không xuất hiện trong "helloworld".`
      }
    ],
    editorial: `Thuật toán so khớp thô (Brute Force): Thử mọi vị trí $i$ từ $0$ đến $|S| - |P|$. Tại mỗi $i$, kiểm tra xem $S[i \\dots i+|P|-1]$ có khớp với $P$ hay không. Hoặc có thể sử dụng hàm \`strstr(S, P)\`.`,
    author: 'AHtest Academy String Team',
    source: 'Bộ Chuyên Đề String Mastery',
    createdAt: '2026-11-01',
    testcases: [
      { id: 1, input: 'programming\ngram', expectedOutput: '3', isHidden: false },
      { id: 2, input: 'helloworld\nabc', expectedOutput: '-1', isHidden: false },
      { id: 3, input: 'developer\ndev', expectedOutput: '0', isHidden: true },
      { id: 4, input: 'ahtestcode\ncode', expectedOutput: '6', isHidden: true },
      { id: 5, input: 'aaaaab\naaab', expectedOutput: '2', isHidden: true }
    ]
  },
  {
    id: 'str_9',
    slug: 'str_char_frequency',
    title: 'Bảng tần suất xuất hiện ký tự (Frequency Map)',
    category: 'Xử lý Chuỗi (Strings)',
    difficulty: 'Hard',
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    tags: ['Strings', 'Frequency-Array', 'Histogram', 'Hash-Table'],
    solvedCount: 420,
    totalSubmissions: 810,
    statement: `Cho chuỗi ký tự $S$ chỉ gồm các chữ cái viết thường \`a-z\` (không chứa khoảng trắng).
Hãy đếm số lần xuất hiện của từng ký tự và in ra màn hình các ký tự có xuất hiện theo **thứ tự bảng chữ cái alphabet (\`a\` đến \`z\`)**.
Mỗi dòng in ra một ký tự kèm số lần xuất hiện theo định dạng: \`<ky_tu>: <so_lan_xuat_hien>\`.`,
    inputFormat: `Một chuỗi $S$ ($1 \\le |S| \\le 1000$).`,
    outputFormat: `Danh sách các ký tự có xuất hiện kèm tần suất theo thứ tự từ điển, mỗi ký tự trên 1 dòng.`,
    constraints: `$1 \\le |S| \\le 1000$. Các ký tự trong $S$ thuộc đoạn \`['a', 'z']\`.`,
    samples: [
      {
        input: `banana`,
        output: `a: 3\nb: 1\nn: 2`,
        explanation: `Ký tự 'a' xuất hiện 3 lần, 'b' xuất hiện 1 lần, 'n' xuất hiện 2 lần.`
      },
      {
        input: `code`,
        output: `c: 1\nd: 1\ne: 1\no: 1`,
        explanation: `Các ký tự c, d, e, o mỗi ký tự xuất hiện 1 lần, sắp xếp từ điển.`
      }
    ],
    editorial: `Sử dụng mảng đếm tần suất kích thước 26: \`int count[26] = {0};\`. Với mỗi ký tự \`s[i]\`, tăng \`count[s[i] - 'a']++\`. Sau đó duyệt từ 'a' đến 'z', nếu \`count[c - 'a'] > 0\` thì in ra kết quả.`,
    author: 'AHtest Academy String Team',
    source: 'Bộ Chuyên Đề String Mastery',
    createdAt: '2026-11-01',
    testcases: [
      { id: 1, input: 'banana', expectedOutput: 'a: 3\nb: 1\nn: 2', isHidden: false },
      { id: 2, input: 'code', expectedOutput: 'c: 1\nd: 1\ne: 1\no: 1', isHidden: false },
      { id: 3, input: 'aaaaa', expectedOutput: 'a: 5', isHidden: true },
      { id: 4, input: 'programming', expectedOutput: 'a: 1\ng: 2\ni: 1\nm: 2\nn: 1\no: 1\np: 1\nr: 2', isHidden: true },
      { id: 5, input: 'aabbcc', expectedOutput: 'a: 2\nb: 2\nc: 2', isHidden: true }
    ]
  }
];
