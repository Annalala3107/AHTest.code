import { Problem } from '../types';

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
    author: 'VNOI ICPC Setter Team',
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
    author: 'VNOI VOI Prep',
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
  }
];
