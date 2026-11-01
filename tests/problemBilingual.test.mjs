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
