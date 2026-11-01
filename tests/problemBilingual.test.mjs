import test from 'node:test';
import assert from 'node:assert';
import { 
  getProblemTitle, 
  getProblemStatement, 
  getProblemInputFormat, 
  getProblemOutputFormat, 
  getProblemConstraints 
} from '../src/services/problemBilingualService.ts';

test('1. Problem with existing titleEn returns titleEn in EN mode', () => {
  const p = {
    id: '1',
    title: 'Vẽ hình vuông rỗng',
    titleEn: 'Draw Hollow Square Pattern',
    statement: 'Mô tả tiếng Việt',
    statementEn: 'English statement description'
  };

  assert.strictEqual(getProblemTitle(p, 'vi'), 'Vẽ hình vuông rỗng');
  assert.strictEqual(getProblemTitle(p, 'en'), 'Draw Hollow Square Pattern');
  assert.strictEqual(getProblemStatement(p, 'en'), 'English statement description');
});

test('2. Problem without titleEn automatically translates common PRF192 patterns to English', () => {
  const p = {
    id: 'src_1',
    title: 'Source 1: Đổi vị trí số lẻ lớn nhất và nhỏ nhất',
    statement: 'Viết chương trình C...'
  };

  const titleEn = getProblemTitle(p, 'en');
  assert.ok(titleEn.includes('Swap') || titleEn.includes('odd') || titleEn.includes('Source 1'), 'Must generate a valid English title');
});

test('3. Problem with empty or missing statement NEVER returns empty ("tàng hình")', () => {
  const emptyProblem = {
    id: 'p_empty',
    title: 'Kiểm tra số nguyên tố',
    statement: ''
  };

  const viStatement = getProblemStatement(emptyProblem, 'vi');
  const enStatement = getProblemStatement(emptyProblem, 'en');

  assert.ok(viStatement.length > 20, 'VI Statement must not be empty or blank');
  assert.ok(enStatement.length > 20, 'EN Statement must not be empty or blank');
  assert.ok(enStatement.includes('prime') || enStatement.includes('C program'), 'EN statement should have meaningful content');
});

test('4. Formats and Constraints always provide safe fallbacks', () => {
  const p = { id: 'test', title: 'Test' };

  assert.ok(getProblemInputFormat(p, 'vi').length > 5);
  assert.ok(getProblemInputFormat(p, 'en').length > 5);
  assert.ok(getProblemOutputFormat(p, 'vi').length > 5);
  assert.ok(getProblemOutputFormat(p, 'en').length > 5);
  assert.ok(getProblemConstraints(p, 'vi').length > 5);
  assert.ok(getProblemConstraints(p, 'en').length > 5);
});

test('5. createExamSession defaults duration to 90 minutes when 0 or omitted', async () => {
  const { createExamSession } = await import('../src/services/collectionStorage.ts');
  const mockCol = {
    id: 'col_1',
    title: 'Shape Drawing',
    problems: [
      { id: '1', title: 'P1' },
      { id: '2', title: 'P2' }
    ]
  };

  const sessionDefault = createExamSession(mockCol, 10);
  assert.strictEqual(sessionDefault.timeLimitMinutes, 90, 'Omitted timeLimitMinutes must default to 90');

  const sessionExplicitZero = createExamSession(mockCol, 10, 0);
  assert.strictEqual(sessionExplicitZero.timeLimitMinutes, 90, '0 timeLimitMinutes must default to 90');

  const sessionCustom = createExamSession(mockCol, 10, 45);
  assert.strictEqual(sessionCustom.timeLimitMinutes, 45, 'Explicit custom 45 minutes must be respected');
});

test('6. Solution 5: Category-aware fallback synthesis eliminates invisible statement completely', () => {
  const shapeProb = { id: 's1', title: 'Source 12: Hình tam giác rỗng', category: 'Vẽ Hình' };
  const arrayProb = { id: 'a1', title: 'Source 33: Mảng số', category: 'Mảng 1 Chiều & Sắp Xếp' };
  const strProb = { id: 'st1', title: 'Source 55: Xâu', category: 'Chuỗi & Ký Tự' };

  const shapeVi = getProblemStatement(shapeProb, 'vi');
  assert.ok(shapeVi.includes('vòng lặp lồng nhau') || shapeVi.includes('vẽ hình'), 'Shape should guide nested loops');

  const arrayEn = getProblemStatement(arrayProb, 'en');
  assert.ok(arrayEn.includes('array of integers') || arrayEn.includes('elements'), 'Array should guide array manipulation');

  const strVi = getProblemStatement(strProb, 'vi');
  assert.ok(strVi.includes('chuỗi') || strVi.includes('\\0'), 'String should guide null-terminator');
});

test('7. Generic boilerplate specifications in Image 2 are identified and replaced with domain-specific specs', async () => {
  const { isGenericFormat, detectProblemDomain } = await import('../src/services/problemBilingualService.ts');

  // Verify detector identifies meaningless boilerplate from Image 2
  assert.strictEqual(isGenericFormat('Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.'), true);
  assert.strictEqual(isGenericFormat('Kết quả in ra stdout theo đúng định dạng kiểm thử.'), true);
  assert.strictEqual(isGenericFormat('Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.'), true);
  assert.strictEqual(isGenericFormat('Line 1: An integer N (1 <= N <= 1000)'), false);

  const arrayProb = {
    id: 'prf192_src_1',
    title: 'Source 1: Đổi vị trí số lẻ lớn nhất và nhỏ nhất',
    category: 'Mảng 1 Chiều & Sắp Xếp',
    inputFormat: 'Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.',
    outputFormat: 'Kết quả in ra stdout theo đúng định dạng kiểm thử.',
    constraints: 'Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.'
  };

  assert.strictEqual(detectProblemDomain(arrayProb), 'array');

  const inputVi = getProblemInputFormat(arrayProb, 'vi');
  const outputVi = getProblemOutputFormat(arrayProb, 'vi');
  const constraintsVi = getProblemConstraints(arrayProb, 'vi');

  // Must NOT be the old meaningless placeholder
  assert.notStrictEqual(inputVi, 'Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.');
  assert.notStrictEqual(outputVi, 'Kết quả in ra stdout theo đúng định dạng kiểm thử.');
  assert.notStrictEqual(constraintsVi, 'Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.');

  // Must contain specific array details
  assert.ok(inputVi.includes('Dòng 1: Số nguyên dương $N$') || inputVi.includes('mảng'));
  assert.ok(outputVi.includes('mảng sau khi xử lý') || outputVi.includes('khoảng trắng'));
  assert.ok(constraintsVi.includes('1 \\le N \\le 1000') && constraintsVi.includes('A_i'));

  // Test Shape problem replacement
  const shapeProb = {
    id: 'prf192_src_8',
    title: 'Source 8: Vẽ hình tam giác',
    category: 'Vẽ Hình & Ma Trận Ký Tự',
    inputFormat: 'Dữ liệu đầu vào chuẩn từ stdin theo từng dòng.',
    outputFormat: 'Kết quả in ra stdout theo đúng định dạng kiểm thử.',
    constraints: 'Thời gian thực thi tối đa: 1.0s. Bộ nhớ: 128MB.'
  };

  assert.strictEqual(detectProblemDomain(shapeProb), 'shape');
  const shapeInput = getProblemInputFormat(shapeProb, 'vi');
  const shapeOutput = getProblemOutputFormat(shapeProb, 'vi');
  const shapeConstraints = getProblemConstraints(shapeProb, 'vi');

  assert.ok(shapeInput.includes('kích thước cạnh hoặc chiều cao'));
  assert.ok(shapeOutput.includes('ký tự sao `*`'));
  assert.ok(shapeConstraints.includes('Không in khoảng trắng thừa'));
});

test('8. purgeLeakedSolutionDrafts purges leaked solution code from localStorage', async () => {
  const { purgeLeakedSolutionDrafts } = await import('../src/services/collectionStorage.ts');

  // Mock global window & localStorage
  const store = new Map();
  global.window = {
    localStorage: {
      length: 0,
      key(idx) {
        return Array.from(store.keys())[idx] || null;
      },
      getItem(k) {
        return store.get(k) || null;
      },
      setItem(k, v) {
        store.set(k, String(v));
        this.length = store.size;
      },
      removeItem(k) {
        store.delete(k);
        this.length = store.size;
      }
    }
  };
  global.localStorage = global.window.localStorage;

  // Add leaked drafts (like Image 1)
  global.localStorage.setItem('ahtest_draft_workbench_prf192_src_1_c17', `#include <stdio.h>\nvoid swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }\nint main() {\n  // [Sanitized]: removed\n  int n; scanf("%d", &n);\n}`);
  global.localStorage.setItem('ahtest_draft_workbench_prf192_src_8_cpp20', `#include <stdio.h>\nvoid veTamGiac(int n) {\n  for(int i=0;i<n;i++) printf("* ");\n}`);
  // Add a clean draft
  global.localStorage.setItem('ahtest_draft_workbench_custom_prob_c17', `#include <stdio.h>\n\nint main() {\n    return 0;\n}`);

  purgeLeakedSolutionDrafts();

  // Leaked solution drafts must be gone
  assert.strictEqual(global.localStorage.getItem('ahtest_draft_workbench_prf192_src_1_c17'), null);
  assert.strictEqual(global.localStorage.getItem('ahtest_draft_workbench_prf192_src_8_cpp20'), null);
  // Clean draft preserved
  assert.notStrictEqual(global.localStorage.getItem('ahtest_draft_workbench_custom_prob_c17'), null);
});
