import test from 'node:test';
import assert from 'node:assert/strict';
import { PRF192_MASTER_PROBLEMS } from '../src/data/prf192MasterDataset.ts';

test('115 PRF192 Master Problems Accuracy Verification', async (t) => {
  await t.test('All 115 problems are present and accounted for', () => {
    assert.equal(PRF192_MASTER_PROBLEMS.length, 115, 'Must contain exactly 115 problems');
  });

  await t.test('Source 8: Vẽ hình tam giác must output a triangle, NOT a square', () => {
    const src8 = PRF192_MASTER_PROBLEMS.find(p => p.id === 'prf192_src_8');
    assert.ok(src8, 'Source 8 must exist');
    assert.ok(src8.title.includes('tam giác'), 'Title must be triangle');
    
    const sample4 = src8.samples.find(s => s.input === '4');
    assert.ok(sample4, 'Must have sample for N=4');
    
    // A triangle for N=4 should have line lengths increasing: line 1 has 1 star, line 4 has 4 stars
    const lines = sample4.output.split('\n');
    assert.equal(lines.length, 4, 'Must have 4 lines');
    assert.ok(lines[0].trim().length < lines[3].trim().length, 'Line 1 must be shorter than Line 4 (triangle property)');
    assert.notEqual(sample4.output, '* * * *\n* * * *\n* * * *\n* * * *', 'Must NEVER be a 4x4 square');
  });

  await t.test('Source 18: Tính tổng mảng must output sum number (24), NOT an array', () => {
    const src18 = PRF192_MASTER_PROBLEMS.find(p => p.id === 'prf192_src_21');
    assert.ok(src18, 'Source 18 must exist');
    const sample = src18.samples[0];
    assert.equal(sample.output.trim(), '24', 'Sum of 5 2 9 1 7 must be 24');
  });

  await t.test('Source 22: Đảo ngược số must output reversed digits, NOT YES', () => {
    const src22 = PRF192_MASTER_PROBLEMS.find(p => p.id === 'prf192_src_25');
    assert.ok(src22, 'Source 22 must exist');
    const sample = src22.samples[0];
    assert.equal(sample.output.trim(), '54321', 'Reverse of 12345 must be 54321');
  });

  await t.test('Source 80: Đảo ngược chuỗi must output reversed string, NOT Hello World', () => {
    const src80 = PRF192_MASTER_PROBLEMS.find(p => p.id === 'prf192_src_82');
    assert.ok(src80, 'Source 80 must exist');
    const sample = src80.samples[0];
    assert.equal(sample.output.trim(), 'olleh', 'Reverse of hello must be olleh');
  });

  await t.test('All 115 problems have at least 2 samples and 4 testcases with valid weights', () => {
    PRF192_MASTER_PROBLEMS.forEach((p, idx) => {
      assert.ok(p.samples && p.samples.length >= 1, `Problem #${idx+1} (${p.id}) must have samples`);
      assert.ok(p.testcases && p.testcases.length >= 2, `Problem #${idx+1} (${p.id}) must have testcases`);
      
      const totalWeight = p.testcases.reduce((sum, tc) => sum + (tc.weight || 0), 0);
      assert.equal(totalWeight, 100, `Problem #${idx+1} (${p.id}) testcase weights must sum to 100`);
    });
  });
});
