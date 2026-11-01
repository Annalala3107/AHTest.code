import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  UploadCloud, 
  Plus, 
  Search, 
  CheckCircle2, 
  Play, 
  Eye, 
  Trash2, 
  RefreshCw, 
  FileCode, 
  X, 
  BookOpen, 
  Copy, 
  Check 
} from 'lucide-react';
import { Problem, Difficulty, TestCaseItem } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';

// Pre-seeded high quality real practical lab problems
const PRE_SEEDED_PROBLEMS: Problem[] = [
  {
    id: 'imported_str_reversal',
    slug: 'str_word_reversal',
    title: 'Đảo ngược từng từ trong câu (Word Reversal)',
    category: 'Xử lý Chuỗi (Strings)',
    difficulty: 'Easy',
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    tags: ['Strings', 'Tokenization', 'Pointers', 'C-Standard'],
    solvedCount: 342,
    totalSubmissions: 512,
    statement: `Cho một chuỗi ký tự $S$ gồm nhiều từ được phân tách bởi các khoảng trắng.
Hãy viết chương trình đảo ngược thứ tự các ký tự trong từng từ, nhưng **giữ nguyên thứ tự xuất hiện của các từ** trong câu.

Ví dụ: \`Hello World\` $\\rightarrow$ \`olleH dlroW\`.`,
    inputFormat: `Một dòng duy nhất chứa chuỗi ký tự $S$ ($1 \\le |S| \\le 1000$). Chuỗi chỉ chứa chữ cái tiếng Anh và khoảng trắng.`,
    outputFormat: `In ra chuỗi kết quả sau khi đã đảo ngược từng từ trên một dòng duy nhất.`,
    constraints: `* Độ dài chuỗi $S$ không quá $1000$ ký tự.
* Các từ phân tách nhau bởi một hoặc nhiều dấu cách.`,
    author: 'Đề thi thực hành Lab (C Programming)',
    source: 'Kho Đề Ngoại Nhập',
    createdAt: '2026-11-01',
    isCustom: true,
    samples: [
      {
        input: 'Hello World C Language',
        output: 'olleH dlroW C egaugnaL',
        explanation: 'Mỗi từ trong câu được đảo ngược thứ tự ký tự.'
      },
      {
        input: 'codefight ahtest',
        output: 'thgifedoc tsetha',
        explanation: 'Đảo ngược 2 từ: codefight -> thgifedoc, ahtest -> tsetha.'
      }
    ],
    testcases: [
      {
        id: 1,
        input: 'Hello World C Language',
        expectedOutput: 'olleH dlroW C egaugnaL',
        isHidden: false
      },
      {
        id: 2,
        input: 'codefight ahtest',
        expectedOutput: 'thgifedoc tsetha',
        isHidden: false
      },
      {
        id: 3,
        input: 'Programming',
        expectedOutput: 'gnimmargorP',
        isHidden: true,
        explanation: 'Kiểm thử câu chỉ có đúng 1 từ duy nhất.'
      },
      {
        id: 4,
        input: 'dev c sandbox',
        expectedOutput: 'ved c xobdnas',
        isHidden: true,
        explanation: 'Kiểm thử câu có từ 1 ký tự.'
      },
      {
        id: 5,
        input: 'gcc 16 wasm 2026',
        expectedOutput: 'ccg 61 msaw 6202',
        isHidden: true,
        explanation: 'Kiểm thử chuỗi chứa chữ số xen kẽ.'
      }
    ]
  },
  {
    id: 'imported_spiral_matrix',
    slug: 'matrix_spiral_nxn',
    title: 'Điền ma trận xoắn ốc Spiral N x N',
    category: 'Mảng 2 Chiều & Ma Trận',
    difficulty: 'Medium',
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    tags: ['Matrix', '2D-Array', 'Simulation', 'Algorithms'],
    solvedCount: 198,
    totalSubmissions: 420,
    statement: `Cho số nguyên dương $N$. Hãy tạo và in ra ma trận vuông kích thước $N \\times N$ được điền các số liên tiếp từ $1$ đến $N^2$ theo chiều kim đồng hồ theo hình xoắn ốc (Spiral Matrix), bắt đầu từ ô góc trên cùng bên trái $(0, 0)$.`,
    inputFormat: `Một dòng duy nhất chứa số nguyên dương $N$ ($1 \\le N \\le 20$).`,
    outputFormat: `In ra ma trận $N \\times N$, mỗi hàng gồm $N$ số phân tách bởi dấu cách.`,
    constraints: `$1 \\le N \\le 20$.`,
    author: 'Đề thi thực hành Lab (C Programming)',
    source: 'Kho Đề Ngoại Nhập',
    createdAt: '2026-11-01',
    isCustom: true,
    samples: [
      {
        input: '3',
        output: '1 2 3\n8 9 4\n7 6 5',
        explanation: 'Ma trận xoắn ốc 3x3 điền từ 1 đến 9.'
      },
      {
        input: '4',
        output: '1 2 3 4\n12 13 14 5\n11 16 15 6\n10 9 8 7',
        explanation: 'Ma trận xoắn ốc 4x4 điền từ 1 đến 16.'
      }
    ],
    testcases: [
      {
        id: 1,
        input: '3',
        expectedOutput: '1 2 3\n8 9 4\n7 6 5',
        isHidden: false
      },
      {
        id: 2,
        input: '4',
        expectedOutput: '1 2 3 4\n12 13 14 5\n11 16 15 6\n10 9 8 7',
        isHidden: false
      },
      {
        id: 3,
        input: '1',
        expectedOutput: '1',
        isHidden: true,
        explanation: 'Trường hợp biên N = 1.'
      },
      {
        id: 4,
        input: '2',
        expectedOutput: '1 2\n4 3',
        isHidden: true,
        explanation: 'Trường hợp N = 2.'
      },
      {
        id: 5,
        input: '5',
        expectedOutput: '1 2 3 4 5\n16 17 18 19 6\n15 24 25 20 7\n14 23 22 21 8\n13 12 11 10 9',
        isHidden: true,
        explanation: 'Trường hợp N = 5.'
      }
    ]
  },
  {
    id: 'imported_scholarship_ranking',
    slug: 'student_scholarship_ranking',
    title: 'Quản lý điểm & Học bổng sinh viên',
    category: 'Cấu trúc Struct & Bản ghi',
    difficulty: 'Medium',
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    tags: ['Struct', 'Sorting', 'Records', 'Practical'],
    solvedCount: 145,
    totalSubmissions: 310,
    statement: `Cho danh sách $N$ sinh viên gồm Mã sinh viên (chuỗi không khoảng trắng) và Điểm tổng kết GPA (số thực từ $0.0$ đến $10.0$).
Hệ thống xét học bổng cho các sinh viên có $\\text{GPA} \\ge 8.0$.

Hãy in ra danh sách các sinh viên đạt học bổng theo thứ tự:
1. Giảm dần theo điểm GPA.
2. Nếu hai sinh viên có cùng điểm GPA, sắp xếp tăng dần theo Mã sinh viên (thứ tự bảng chữ cái).
Nếu không có sinh viên nào đạt học bổng, in ra: \`NO SCHOLARSHIP\`.`,
    inputFormat: `* Dòng 1: Số nguyên $N$ ($1 \\le N \\le 100$).
* $N$ dòng tiếp theo, mỗi dòng gồm Mã sinh viên và điểm GPA cách nhau một khoảng trắng.`,
    outputFormat: `In ra danh sách sinh viên đạt học bổng, mỗi dòng gồm: \`MASV GPA\` (GPA hiển thị 1 chữ số thập phân). Hoặc \`NO SCHOLARSHIP\` nếu không ai đạt.`,
    constraints: `* $1 \\le N \\le 100$.
* $0.0 \\le \\text{GPA} \\le 10.0$.`,
    author: 'Đề thi thực hành Lab (C Programming)',
    source: 'Kho Đề Ngoại Nhập',
    createdAt: '2026-11-01',
    isCustom: true,
    samples: [
      {
        input: '4\nSE1801 8.5\nSE1802 7.8\nSE1803 9.2\nSE1804 8.5',
        output: 'SE1803 9.2\nSE1801 8.5\nSE1804 8.5',
        explanation: 'SE1803 cao nhất (9.2). SE1801 và SE1804 cùng 8.5, SE1801 xếp trước theo bảng chữ cái.'
      },
      {
        input: '3\nSE1701 6.5\nSE1702 7.9\nSE1703 5.4',
        output: 'NO SCHOLARSHIP',
        explanation: 'Không có sinh viên nào đạt GPA >= 8.0.'
      }
    ],
    testcases: [
      {
        id: 1,
        input: '4\nSE1801 8.5\nSE1802 7.8\nSE1803 9.2\nSE1804 8.5',
        expectedOutput: 'SE1803 9.2\nSE1801 8.5\nSE1804 8.5',
        isHidden: false
      },
      {
        id: 2,
        input: '3\nSE1701 6.5\nSE1702 7.9\nSE1703 5.4',
        expectedOutput: 'NO SCHOLARSHIP',
        isHidden: false
      },
      {
        id: 3,
        input: '3\nB102 8.0\nA101 8.0\nC103 8.0',
        expectedOutput: 'A101 8.0\nB102 8.0\nC103 8.0',
        isHidden: true,
        explanation: 'Cùng 8.0, kiểm tra sắp xếp thứ tự từ điển A101 < B102 < C103.'
      },
      {
        id: 4,
        input: '2\nSV01 10.0\nSV02 7.9',
        expectedOutput: 'SV01 10.0',
        isHidden: true,
        explanation: 'Điểm tuyệt đối 10.0.'
      },
      {
        id: 5,
        input: '5\nHE1905 8.2\nHE1901 9.5\nHE1903 8.2\nHE1902 6.0\nHE1904 8.8',
        expectedOutput: 'HE1901 9.5\nHE1904 8.8\nHE1903 8.2\nHE1905 8.2',
        isHidden: true,
        explanation: 'Danh sách nhiều sinh viên.'
      }
    ]
  },
  {
    id: 'imported_coprime_pairs',
    slug: 'coprime_pairs_counter',
    title: 'Đếm cặp số nguyên tố cùng nhau (Coprime Pairs)',
    category: 'Toán học & Thuật toán',
    difficulty: 'Easy',
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    tags: ['Math', 'GCD', 'Number-Theory', 'Brute-Force'],
    solvedCount: 280,
    totalSubmissions: 450,
    statement: `Cho dãy gồm $N$ số nguyên dương $A_1, A_2, \\dots, A_N$.
Hãy đếm số lượng cặp chỉ số $(i, j)$ sao cho $1 \\le i < j \\le N$ và:
$$\\gcd(A_i, A_j) = 1$$
Với $\\gcd(x, y)$ là ước số chung lớn nhất của hai số $x$ và $y$.`,
    inputFormat: `* Dòng 1: Số nguyên dương $N$ ($2 \\le N \\le 1000$).
* Dòng 2: $N$ số nguyên dương $A_1, A_2, \\dots, A_N$ ($1 \\le A_i \\le 10^5$).`,
    outputFormat: `In ra một số nguyên duy nhất là số cặp nguyên tố cùng nhau.`,
    constraints: `* $2 \\le N \\le 1000$.
* $1 \\le A_i \\le 10^5$.`,
    author: 'Đề thi thực hành Lab (C Programming)',
    source: 'Kho Đề Ngoại Nhập',
    createdAt: '2026-11-01',
    isCustom: true,
    samples: [
      {
        input: '4\n2 3 4 5',
        output: '5',
        explanation: 'Có 5 cặp: (2,3), (2,5), (3,4), (3,5), (4,5).'
      },
      {
        input: '5\n2 4 6 8 10',
        output: '0',
        explanation: 'Tất cả các số đều là số chẵn nên không có cặp nào có ước chung là 1.'
      }
    ],
    testcases: [
      {
        id: 1,
        input: '4\n2 3 4 5',
        expectedOutput: '5',
        isHidden: false
      },
      {
        id: 2,
        input: '5\n2 4 6 8 10',
        expectedOutput: '0',
        isHidden: false
      },
      {
        id: 3,
        input: '4\n1 1 1 1',
        expectedOutput: '6',
        isHidden: true,
        explanation: 'Tất cả các số bằng 1, gcd(1,1)=1.'
      },
      {
        id: 4,
        input: '5\n2 3 5 7 11',
        expectedOutput: '10',
        isHidden: true,
        explanation: 'Dãy gồm toàn số nguyên tố, mọi cặp đều nguyên tố cùng nhau.'
      },
      {
        id: 5,
        input: '6\n12 15 7 11 25 4',
        expectedOutput: '12',
        isHidden: true,
        explanation: 'Dãy số hỗn hợp.'
      }
    ]
  },
  {
    id: 'imported_valid_parentheses',
    slug: 'valid_parentheses_check',
    title: 'Kiểm tra tính hợp lệ chuỗi dấu ngoặc (Parentheses)',
    category: 'Xử lý Chuỗi & Cấu trúc Stack',
    difficulty: 'Easy',
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    tags: ['Stack', 'Strings', 'Data-Structure'],
    solvedCount: 410,
    totalSubmissions: 630,
    statement: `Cho một chuỗi ký tự $S$ chỉ gồm các ký tự mở và đóng ngoặc: \`(\`, \`)\`, \`[\`, \`]\`, \`{\`, \`}\`.
Chuỗi được gọi là hợp lệ nếu:
1. Mỗi dấu mở ngoặc phải được đóng bởi dấu ngoặc cùng loại.
2. Các dấu ngoặc được đóng theo đúng thứ tự mở trước đóng sau (nguyên lý LIFO / Stack).

In ra \`VALID\` nếu chuỗi hợp lệ, ngược lại in ra \`INVALID\`.`,
    inputFormat: `Một dòng duy nhất chứa chuỗi $S$ ($1 \\le |S| \\le 1000$).`,
    outputFormat: `In ra \`VALID\` hoặc \`INVALID\`.`,
    constraints: `* $1 \\le |S| \\le 1000$.
* $S$ chỉ chứa các ký tự \`(\`, \`)\`, \`[\`, \`]\`, \`{\`, \`}\`.`,
    author: 'Đề thi thực hành Lab (C Programming)',
    source: 'Kho Đề Ngoại Nhập',
    createdAt: '2026-11-01',
    isCustom: true,
    samples: [
      {
        input: '()[]{}',
        output: 'VALID',
        explanation: 'Các cặp ngoặc mở và đóng tương ứng hợp lệ.'
      },
      {
        input: '(]',
        output: 'INVALID',
        explanation: 'Ngoặc tròn mở nhưng bị đóng bởi ngoặc vuông.'
      }
    ],
    testcases: [
      {
        id: 1,
        input: '()[]{}',
        expectedOutput: 'VALID',
        isHidden: false
      },
      {
        id: 2,
        input: '(]',
        expectedOutput: 'INVALID',
        isHidden: false
      },
      {
        id: 3,
        input: '{[]()}',
        expectedOutput: 'VALID',
        isHidden: true,
        explanation: 'Ngoặc lồng nhau đúng quy tắc.'
      },
      {
        id: 4,
        input: '([)]',
        expectedOutput: 'INVALID',
        isHidden: true,
        explanation: 'Ngoặc đóng sai thứ tự xen kẽ.'
      },
      {
        id: 5,
        input: '((({{{[[[]]]}}})))',
        expectedOutput: 'VALID',
        isHidden: true,
        explanation: 'Ngoặc lồng sâu đối xứng.'
      }
    ]
  }
];

const STORAGE_KEY = 'ahtest_imported_problems';

interface ProblemImporterViewProps {
  onSelectProblem?: (problem: Problem) => void;
}

export const ProblemImporterView: React.FC<ProblemImporterViewProps> = ({ onSelectProblem }) => {
  const [problems, setProblems] = useState<Problem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading imported problems from storage:', e);
    }
    return PRE_SEEDED_PROBLEMS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewProblem, setPreviewProblem] = useState<Problem | null>(null);
  const [copiedSampleIdx, setCopiedSampleIdx] = useState<number | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'form' | 'file'>('form');

  // Form State for Manual Ingestion
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newCategory, setNewCategory] = useState('Xử lý Chuỗi (Strings)');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('Easy');
  const [newStatement, setNewStatement] = useState('');
  const [newInputFormat, setNewInputFormat] = useState('');
  const [newOutputFormat, setNewOutputFormat] = useState('');
  const [newConstraints, setNewConstraints] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTestcases, setNewTestcases] = useState<Array<{ input: string; output: string; isHidden: boolean }>>([
    { input: '', output: '', isHidden: false },
    { input: '', output: '', isHidden: false }
  ]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
    } catch (e) {
      console.error('Failed to save problems:', e);
    }
  }, [problems]);

  const handleResetSampleProblems = () => {
    if (window.confirm('Khôi phục danh sách 5 bài tập thực hành Lab mẫu ban đầu?')) {
      setProblems(PRE_SEEDED_PROBLEMS);
    }
  };

  const handleDeleteProblem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa bài tập này khỏi kho cá nhân?')) {
      setProblems(prev => prev.filter(p => p.id !== id));
      if (previewProblem?.id === id) {
        setPreviewProblem(null);
      }
    }
  };

  // Add new test case row in form
  const handleAddTestcaseRow = () => {
    setNewTestcases(prev => [...prev, { input: '', output: '', isHidden: false }]);
  };

  const handleRemoveTestcaseRow = (idx: number) => {
    setNewTestcases(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateTestcase = (idx: number, field: 'input' | 'output' | 'isHidden', val: any) => {
    setNewTestcases(prev => prev.map((tc, i) => i === idx ? { ...tc, [field]: val } : tc));
  };

  // Save manual problem
  const handleSaveProblem = (autoStart: boolean = false) => {
    if (!newTitle.trim()) {
      alert('Vui lòng nhập Tên bài toán!');
      return;
    }
    const slug = newSlug.trim() || newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const validTests = newTestcases.filter(t => t.input.trim() || t.output.trim());
    if (validTests.length === 0) {
      alert('Vui lòng nhập ít nhất 1 test case!');
      return;
    }

    const publicSamples = validTests
      .filter(t => !t.isHidden)
      .map(t => ({ input: t.input, output: t.output }));

    const formattedTestcases: TestCaseItem[] = validTests.map((t, i) => ({
      id: i + 1,
      input: t.input,
      expectedOutput: t.output,
      isHidden: t.isHidden
    }));

    const created: Problem = {
      id: `imported_${Date.now()}`,
      slug,
      title: newTitle.trim(),
      category: newCategory,
      difficulty: newDifficulty,
      points: 100,
      timeLimit: 1.0,
      memoryLimit: 128,
      tags: [newCategory.split(' ')[0], 'Custom', 'Lab'],
      solvedCount: 0,
      totalSubmissions: 0,
      statement: newStatement || `Mô tả bài toán cho **${newTitle}**`,
      inputFormat: newInputFormat || 'Đọc dữ liệu từ stdin.',
      outputFormat: newOutputFormat || 'In kết quả ra stdout.',
      constraints: newConstraints || 'Theo chuẩn đề bài.',
      samples: publicSamples.length > 0 ? publicSamples : [{ input: validTests[0].input, output: validTests[0].output }],
      testcases: formattedTestcases,
      author: newAuthor.trim() || 'Người dùng nhập',
      source: 'Kho Đề Ngoại Nhập',
      createdAt: new Date().toISOString().split('T')[0],
      isCustom: true
    };

    setProblems(prev => [created, ...prev]);
    setIsAddModalOpen(false);

    // Reset fields
    setNewTitle('');
    setNewSlug('');
    setNewStatement('');
    setNewInputFormat('');
    setNewOutputFormat('');
    setNewConstraints('');
    setNewTestcases([
      { input: '', output: '', isHidden: false },
      { input: '', output: '', isHidden: false }
    ]);

    if (autoStart && onSelectProblem) {
      onSelectProblem(created);
    }
  };

  // Handle File Drop / Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          const prob: Problem = {
            id: `imported_${Date.now()}`,
            slug: parsed.slug || `prob_${Date.now()}`,
            title: parsed.title || file.name.replace(/\.[^/.]+$/, ""),
            category: parsed.category || 'Tùy biến ngoại nhập',
            difficulty: (parsed.difficulty as Difficulty) || 'Medium',
            points: parsed.points || 100,
            timeLimit: parsed.timeLimit || 1.0,
            memoryLimit: parsed.memoryLimit || 128,
            tags: parsed.tags || ['Custom', 'FileImport'],
            solvedCount: 0,
            totalSubmissions: 0,
            statement: parsed.statement || 'Không có mô tả chi tiết.',
            inputFormat: parsed.inputFormat || 'Dữ liệu đầu vào.',
            outputFormat: parsed.outputFormat || 'Dữ liệu đầu ra.',
            constraints: parsed.constraints || 'Theo chuẩn.',
            samples: parsed.samples || [{ input: '1', output: '1' }],
            testcases: parsed.testcases || [
              { id: 1, input: parsed.samples?.[0]?.input || '1', expectedOutput: parsed.samples?.[0]?.output || '1', isHidden: false }
            ],
            author: parsed.author || 'Tập tin nạp ngoài',
            source: file.name,
            createdAt: new Date().toISOString().split('T')[0],
            isCustom: true
          };
          setProblems(prev => [prob, ...prev]);
          setIsAddModalOpen(false);
          alert(`Đã nạp thành công bài tập "${prob.title}"!`);
        } else {
          // If .c, .cpp, or .txt file, create a template problem with code inside statement
          const prob: Problem = {
            id: `imported_${Date.now()}`,
            slug: file.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            title: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
            category: 'Thực hành C/C++',
            difficulty: 'Easy',
            points: 100,
            timeLimit: 1.0,
            memoryLimit: 128,
            tags: ['SourceFile', 'Imported'],
            solvedCount: 0,
            totalSubmissions: 0,
            statement: `### Đề bài nạp từ tập tin: \`${file.name}\`\n\n\`\`\`c\n${text.slice(0, 1500)}\n\`\`\``,
            inputFormat: 'Xem nội dung đề bài.',
            outputFormat: 'Xem nội dung đề bài.',
            constraints: 'Theo chuẩn Sandbox.',
            samples: [{ input: '1', output: '1' }],
            testcases: [{ id: 1, input: '1', expectedOutput: '1', isHidden: false }],
            author: 'Tập tin nạp ngoài',
            source: file.name,
            createdAt: new Date().toISOString().split('T')[0],
            isCustom: true
          };
          setProblems(prev => [prob, ...prev]);
          setIsAddModalOpen(false);
          alert(`Đã tạo bài toán từ file ${file.name}!`);
        }
      } catch (err: any) {
        setUploadError(`Lỗi phân tích tập tin: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  // Filter problems
  const filteredProblems = problems.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  // Calculate stats
  const totalTests = problems.reduce((acc, p) => acc + (p.testcases?.length || p.samples.length || 0), 0);
  const categories = Array.from(new Set(problems.map(p => p.category)));

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-900/40 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold tracking-wide">
              <FolderGit2 className="w-3.5 h-3.5 text-rose-400" />
              KHÔNG GIAN LUYỆN TẬP CÁ NHÂN HÓA (CUSTOM WORKSPACE)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Kho Đề Ngoại Nhập & Luyện Thực Hành
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Tự do nạp đề thi, bài tập Lab từ file JSON hoặc mã nguồn C/C++. Chạy thử nghiệm và chấm điểm trực tiếp 
              với bộ Testcases tùy biến trên trình biên dịch Dev-C++ / MinGW GCC Wasm Sandbox.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[100px]">
              <span className="block text-2xl font-black text-rose-400">{problems.length}</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Bài trong kho</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[100px]">
              <span className="block text-2xl font-black text-emerald-400">{totalTests}</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Testcases</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[100px]">
              <span className="block text-2xl font-black text-blue-400">Dev-C++</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">GCC 16.2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên bài, mã slug, chủ đề hoặc thẻ tag..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-rose-500 text-slate-900 dark:text-slate-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="All">Tất cả độ khó</option>
            <option value="Easy">Dễ (Easy)</option>
            <option value="Medium">Trung bình (Medium)</option>
            <option value="Hard">Khó (Hard)</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer max-w-[180px] truncate"
          >
            <option value="All">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Restore sample problems button */}
          <button
            onClick={handleResetSampleProblems}
            title="Khôi phục 5 đề Lab mẫu"
            className="p-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nạp 5 Đề Lab Mẫu</span>
          </button>

          {/* Add Problem CTA */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nhập Đề Mới</span>
          </button>
        </div>
      </div>

      {/* Problem Cards Grid */}
      {filteredProblems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            Không tìm thấy bài tập nào phù hợp
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Hãy thử thay đổi từ khóa tìm kiếm, bộ lọc danh mục hoặc bấm "Nạp 5 Đề Lab Mẫu" để bắt đầu luyện tập.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedDifficulty('All'); setSelectedCategory('All'); }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 cursor-pointer"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProblems.map((prob) => {
            const testCount = prob.testcases ? prob.testcases.length : prob.samples.length;
            const hiddenCount = prob.testcases ? prob.testcases.filter(t => t.isHidden).length : 0;
            const publicCount = testCount - hiddenCount;

            const diffColor = 
              prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
              prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
              'bg-rose-500/10 text-rose-400 border-rose-500/30';

            return (
              <div
                key={prob.id}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 p-5 shadow-xs transition-all flex flex-col justify-between hover:shadow-lg hover:shadow-rose-950/20"
              >
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 truncate max-w-[160px]">
                      {prob.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${diffColor}`}>
                        {prob.difficulty}
                      </span>
                      <button
                        onClick={(e) => handleDeleteProblem(prob.id, e)}
                        title="Xóa đề này"
                        className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Slug */}
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                      {prob.title}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                      #{prob.slug}
                    </span>
                  </div>

                  {/* Statement Excerpt */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {prob.statement.replace(/[#$*`_]/g, '')}
                  </p>

                  {/* Testcases & Tags info */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {testCount} Tests ({publicCount} Mẫu, {hiddenCount} Ẩn)
                    </span>
                    <span className="text-slate-500 font-mono">
                      {prob.timeLimit}s • {prob.memoryLimit}MB
                    </span>
                  </div>
                </div>

                {/* Bottom CTA Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onSelectProblem) {
                        onSelectProblem(prob);
                      }
                    }}
                    className="flex-1 py-2 px-3 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Vào Luyện Tập Ngay</span>
                  </button>

                  <button
                    onClick={() => setPreviewProblem(prob)}
                    title="Xem chi tiết đề bài"
                    className="p-2 rounded-xl font-semibold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewProblem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    {previewProblem.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {previewProblem.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {previewProblem.title}
                </h2>
              </div>
              <button
                onClick={() => setPreviewProblem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-rose-500" />
                  Nội dung đề bài
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 leading-relaxed">
                  <KaTeXRenderer content={previewProblem.statement} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <strong className="text-[11px] uppercase font-bold text-slate-500 block">Định dạng Input</strong>
                  <KaTeXRenderer content={previewProblem.inputFormat} />
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <strong className="text-[11px] uppercase font-bold text-slate-500 block">Định dạng Output</strong>
                  <KaTeXRenderer content={previewProblem.outputFormat} />
                </div>
              </div>

              {/* Sample cases */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Ví dụ minh họa (Samples)</h4>
                <div className="space-y-3">
                  {previewProblem.samples.map((sample, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden font-mono">
                      <div className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 flex items-center justify-between text-[11px] font-sans font-semibold">
                        <span>Ví dụ #{idx + 1}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(sample.input);
                            setCopiedSampleIdx(idx);
                            setTimeout(() => setCopiedSampleIdx(null), 1500);
                          }}
                          className="text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {copiedSampleIdx === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedSampleIdx === idx ? 'Đã copy!' : 'Copy Input'}</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 font-sans block mb-1">INPUT:</span>
                          <pre className="whitespace-pre-wrap">{sample.input}</pre>
                        </div>
                        <div className="pl-2">
                          <span className="text-[10px] text-slate-400 font-sans block mb-1">OUTPUT:</span>
                          <pre className="whitespace-pre-wrap">{sample.output}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setPreviewProblem(null)}
                className="px-4 py-2 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  const p = previewProblem;
                  setPreviewProblem(null);
                  if (onSelectProblem) onSelectProblem(p);
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Vào Luyện Tập Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / IMPORT PROBLEM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Nhập Bài Tập / Đề Thi Mới
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Nạp đề ngoại nhập vào kho dữ liệu cá nhân của bạn trên Sandbox.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-2 shrink-0 bg-slate-50/50 dark:bg-slate-950/40">
              <button
                onClick={() => setActiveModalTab('form')}
                className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeModalTab === 'form'
                    ? 'border-rose-500 text-rose-500'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <FileCode className="w-4 h-4" />
                Nhập Thủ Công (Form Trực Quan)
              </button>
              <button
                onClick={() => setActiveModalTab('file')}
                className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeModalTab === 'file'
                    ? 'border-rose-500 text-rose-500'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                Kéo Thả Tập Tin (.json / .c / .cpp / .txt)
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {activeModalTab === 'form' ? (
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Tên bài toán <span className="text-rose-500">*</span>:
                      </label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => {
                          setNewTitle(e.target.value);
                          if (!newSlug) {
                            setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '_'));
                          }
                        }}
                        placeholder="Ví dụ: Đảo ngược từ trong chuỗi"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Mã bài (Slug):
                      </label>
                      <input
                        type="text"
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value)}
                        placeholder="str_word_reversal"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Danh mục:</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        <option value="Xử lý Chuỗi (Strings)">Xử lý Chuỗi (Strings)</option>
                        <option value="Mảng & Con Trỏ">Mảng & Con Trỏ</option>
                        <option value="Mảng 2 Chiều & Ma Trận">Mảng 2 Chiều & Ma Trận</option>
                        <option value="Cấu trúc Struct & Bản ghi">Cấu trúc Struct & Bản ghi</option>
                        <option value="Toán học & Thuật toán">Toán học & Thuật toán</option>
                        <option value="Thực hành Lab Tổng hợp">Thực hành Lab Tổng hợp</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Độ khó:</label>
                      <select
                        value={newDifficulty}
                        onChange={(e) => setNewDifficulty(e.target.value as Difficulty)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        <option value="Easy">Dễ (Easy)</option>
                        <option value="Medium">Trung bình (Medium)</option>
                        <option value="Hard">Khó (Hard)</option>
                        <option value="Expert">Chuyên gia (Expert)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tác giả / Nguồn đề:</label>
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder="Ví dụ: Đề thi thử Lab 2026"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Statement */}
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Nội dung đề bài (Hỗ trợ Markdown & LaTeX $...$):
                    </label>
                    <textarea
                      value={newStatement}
                      onChange={(e) => setNewStatement(e.target.value)}
                      rows={3}
                      placeholder="Mô tả yêu cầu bài toán..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  {/* I/O formats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Định dạng Input:</label>
                      <input
                        type="text"
                        value={newInputFormat}
                        onChange={(e) => setNewInputFormat(e.target.value)}
                        placeholder="Dòng 1 chứa số nguyên N..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Định dạng Output:</label>
                      <input
                        type="text"
                        value={newOutputFormat}
                        onChange={(e) => setNewOutputFormat(e.target.value)}
                        placeholder="In ra kết quả bài toán..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Testcases Builder */}
                  <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Bộ Test Cases Chấm Điểm
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Nhập cặp Input và Expected Output. Đánh dấu [x] nếu là Test Ẩn (Hidden).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddTestcaseRow}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm Test Case</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {newTestcases.map((tc, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-slate-600 dark:text-slate-300">
                              Test Case #{idx + 1}
                            </span>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={tc.isHidden}
                                  onChange={(e) => handleUpdateTestcase(idx, 'isHidden', e.target.checked)}
                                  className="rounded text-rose-600 focus:ring-rose-500"
                                />
                                <span>Test Ẩn (Chỉ chấm, không hiện input)</span>
                              </label>
                              {newTestcases.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTestcaseRow(idx)}
                                  className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                            <div>
                              <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Input:</span>
                              <textarea
                                value={tc.input}
                                onChange={(e) => handleUpdateTestcase(idx, 'input', e.target.value)}
                                rows={2}
                                placeholder="Dữ liệu đầu vào..."
                                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Expected Output:</span>
                              <textarea
                                value={tc.output}
                                onChange={(e) => handleUpdateTestcase(idx, 'output', e.target.value)}
                                rows={2}
                                placeholder="Kết quả mong đợi..."
                                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Tab File Upload */
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-500 rounded-2xl p-8 text-center transition-all bg-slate-50/50 dark:bg-slate-800/30 group">
                    <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                      Kéo thả tập tin (.json, .c, .cpp, .txt) vào đây
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                      Hệ thống tự động phân tích cấu trúc đề và chuyển đổi thành bài tập có thể giải ngay trên Sandbox.
                    </p>
                    <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 cursor-pointer">
                      <UploadCloud className="w-4 h-4" />
                      <span>Chọn file từ máy tính</span>
                      <input
                        type="file"
                        accept=".json,.c,.cpp,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {uploadError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                      {uploadError}
                    </div>
                  )}

                  {/* Sample JSON snippet guide */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Cấu trúc mẫu file .json chuẩn:</span>
                      <button
                        onClick={() => {
                          const sampleJson = JSON.stringify({
                            title: "Tính tổng 2 số",
                            slug: "sum_two_numbers",
                            category: "Toán học",
                            difficulty: "Easy",
                            statement: "Cho 2 số a và b. In ra tổng a + b.",
                            samples: [{ input: "5 3", output: "8" }],
                            testcases: [
                              { id: 1, input: "5 3", expectedOutput: "8", isHidden: false },
                              { id: 2, input: "10 20", expectedOutput: "30", isHidden: true }
                            ]
                          }, null, 2);
                          navigator.clipboard.writeText(sampleJson);
                          alert('Đã copy cấu trúc JSON mẫu vào clipboard!');
                        }}
                        className="text-rose-400 hover:underline flex items-center gap-1 font-sans cursor-pointer"
                      >
                        <Copy className="w-3 h-3" /> Copy JSON mẫu
                      </button>
                    </div>
                    <pre className="text-slate-300 overflow-x-auto text-[11px]">
{`{
  "title": "Tính tổng 2 số nguyên",
  "slug": "sum_two_numbers",
  "category": "Cơ bản",
  "difficulty": "Easy",
  "statement": "Cho hai số nguyên a và b. In ra tổng a + b.",
  "samples": [{ "input": "5 3", "output": "8" }],
  "testcases": [
    { "id": 1, "input": "5 3", "expectedOutput": "8", "isHidden": false },
    { "id": 2, "input": "10 20", "expectedOutput": "30", "isHidden": true }
  ]
}`}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {activeModalTab === 'form' && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveProblem(false)}
                  className="px-4 py-2 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 cursor-pointer"
                >
                  Lưu vào Kho Đề
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveProblem(true)}
                  className="px-5 py-2 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Lưu & Vào Luyện Tập Ngay</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
