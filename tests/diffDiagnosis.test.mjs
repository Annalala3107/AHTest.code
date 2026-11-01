import test from 'node:test';
import assert from 'node:assert';

// Target implementation of the improved diagnoseDiff
export function diagnoseDiff(actual, expected, verdict) {
  const normActual = actual.replace(/\r\n/g, '\n');
  const normExpected = expected.replace(/\r\n/g, '\n');

  // Rule 0: If Grader already officially gave AC verdict, DiffViewer must NEVER mark as issue
  if (verdict === 'AC' || normActual === normExpected) {
    return {
      hasIssue: false,
      type: 'general',
      message: 'Kết quả hoàn toàn trùng khớp 100%!',
      recommendation: 'Không có lỗi sai.'
    };
  }

  // 1. Check for genuine Null-Terminator & Garbage Byte Pitfall in C strings
  // Must contain unprintable control chars OR non-whitespace suffix chars
  // eslint-disable-next-line no-control-regex
  const hasGarbageChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFFFD]/.test(actual);
  
  let isTrueGarbageSuffix = false;
  if (normActual.startsWith(normExpected) && normActual.length > normExpected.length && normActual.length <= normExpected.length + 30) {
    const extraSuffix = normActual.slice(normExpected.length);
    // If the extra suffix contains non-whitespace characters (like @, #, letters, digits, symbols), it's true memory garbage!
    // But if it's ONLY whitespace (spaces, tabs, newlines), it is NOT garbage memory!
    if (/[^\s\r\n]/.test(extraSuffix)) {
      isTrueGarbageSuffix = true;
    }
  }

  if (hasGarbageChars || isTrueGarbageSuffix) {
    return {
      hasIssue: true,
      type: 'null-terminator',
      message: 'Bẫy Thiếu Ký Tự Null \'\\0\' hoặc Rác Bộ Nhớ (Garbage Values Detected)',
      recommendation: 'Trong C, chuỗi bắt buộc phải kết thúc bằng ký tự rỗng \'\\0\' (ASCII 0). Nếu bạn duyệt mảng char hoặc copy chuỗi mà quên str[len] = \'\\0\';, hàm printf("%s") sẽ in tràn sang các byte rác kế tiếp trong RAM. Hãy bấm nút "Soi Byte (\\0)" ở trên để xem chi tiết từng ô nhớ.'
    };
  }

  // 2. Trailing whitespace pitfall
  const actualLines = normActual.split('\n');
  const expectedLines = normExpected.split('\n');
  const actualTrimmedLines = actualLines.map(l => l.trimEnd());
  const expectedTrimmedLines = expectedLines.map(l => l.trimEnd());

  if (actualTrimmedLines.join('\n') === expectedTrimmedLines.join('\n')) {
    return {
      hasIssue: true,
      type: 'trailing-space',
      message: 'Lỗi khoảng trắng ẩn ở cuối dòng (Trailing Whitespace)',
      recommendation: 'Chữ số và nội dung hiển thị của bạn đã đúng, nhưng có dấu cách thừa (space) ở cuối một hoặc nhiều dòng. Hãy kiểm tra lại vòng lặp in dấu cách.'
    };
  }

  // 3. Missing/extra final newline pitfall
  if (normActual.trim() === normExpected.trim()) {
    if (normExpected.endsWith('\n') && !normActual.endsWith('\n')) {
      return {
        hasIssue: true,
        type: 'missing-newline',
        message: 'Thiếu ký tự xuống dòng ở cuối file (Missing \\n)',
        recommendation: 'Kết quả in đúng nhưng thiếu ký tự xuống dòng `\\n` ở cuối cùng. Hãy thêm `\\n` vào câu lệnh printf() hoặc cout.'
      };
    }
    if (!normExpected.endsWith('\n') && normActual.endsWith('\n')) {
      return {
        hasIssue: true,
        type: 'missing-newline',
        message: 'Thừa ký tự xuống dòng ở cuối file',
        recommendation: 'Bạn in thừa một ký tự xuống dòng `\\n` không cần thiết ở cuối.'
      };
    }
  }

  // 4. Case sensitivity pitfall
  if (normActual.toLowerCase() === normExpected.toLowerCase()) {
    return {
      hasIssue: true,
      type: 'case-mismatch',
      message: 'Lệch chữ HOA / chữ thường (Case Sensitive)',
      recommendation: 'Trình chấm phân biệt chính xác chữ hoa và chữ thường (ví dụ: "True" khác "TRUE", "Passed" khác "passed"). Hãy kiểm tra kỹ đề bài.'
    };
  }

  // 5. Line count mismatch
  if (actualLines.length !== expectedLines.length) {
    return {
      hasIssue: true,
      type: 'line-count-mismatch',
      message: `Lệch số lượng dòng (Bạn in ${actualLines.length} dòng, đề bài yêu cầu ${expectedLines.length} dòng)`,
      recommendation: 'Kiểm tra lại số lần gọi lệnh xuống dòng hoặc vòng lặp in nhiều hơn/ít hơn số dòng quy định.'
    };
  }

  // 6. Floating point precision
  const numRegex = /^-?\d+(\.\d+)?$/;
  if (actualLines.length === 1 && expectedLines.length === 1) {
    const act = actualLines[0].trim();
    const exp = expectedLines[0].trim();
    if (numRegex.test(act) && numRegex.test(exp) && Math.abs(parseFloat(act) - parseFloat(exp)) < 1e-4) {
      return {
        hasIssue: true,
        type: 'precision-mismatch',
        message: 'Lệch định dạng số chữ số thập phân (Precision Mismatch)',
        recommendation: `Giá trị tính toán đúng, nhưng định dạng in sai. Đề bài yêu cầu "${exp}" nhưng bạn in "${act}". Hãy dùng định dạng printf("%.2f") hoặc cout << fixed << setprecision(...).`
      };
    }
  }

  return {
    hasIssue: true,
    type: 'general',
    message: 'Nội dung kết quả không khớp với tiêu chuẩn kiểm thử',
    recommendation: 'So sánh từng dòng bên dưới để phát hiện điểm lệch thuật toán hoặc định dạng.'
  };
}

// UNIT TESTS
test('1. Exact match returns hasIssue: false', () => {
  const res = diagnoseDiff('Hello World\n', 'Hello World\n');
  assert.strictEqual(res.hasIssue, false);
});

test('2. When Grader says verdict is AC, hasIssue MUST be false even if trailing newline differs', () => {
  const expected = '****\n*  *\n*  *\n****';
  const actualWithNewline = '****\n*  *\n*  *\n****\n';
  const res = diagnoseDiff(actualWithNewline, expected, 'AC');
  assert.strictEqual(res.hasIssue, false, 'If verdict is AC, hasIssue must be false!');
});

test('3. Trailing newline without AC verdict returns missing-newline, NEVER null-terminator', () => {
  const expected = '****\n*  *\n*  *\n****';
  const actualWithNewline = '****\n*  *\n*  *\n****\n';
  const res = diagnoseDiff(actualWithNewline, expected);
  assert.strictEqual(res.type, 'missing-newline');
  assert.notStrictEqual(res.type, 'null-terminator');
});

test('4. Real unprintable memory garbage triggers null-terminator warning', () => {
  const expected = 'Hello';
  const actualGarbage = 'Hello\x00\x01\x02';
  const res = diagnoseDiff(actualGarbage, expected);
  assert.strictEqual(res.type, 'null-terminator');
  assert.strictEqual(res.hasIssue, true);
});

test('5. Real non-whitespace memory garbage suffix triggers null-terminator warning', () => {
  const expected = 'Hello';
  const actualGarbage = 'Hello@#!';
  const res = diagnoseDiff(actualGarbage, expected);
  assert.strictEqual(res.type, 'null-terminator');
  assert.strictEqual(res.hasIssue, true);
});

test('6. Trailing whitespace triggers trailing-space', () => {
  const expected = '1 2 3';
  const actualWithSpace = '1 2 3   ';
  const res = diagnoseDiff(actualWithSpace, expected);
  assert.strictEqual(res.type, 'trailing-space');
});
