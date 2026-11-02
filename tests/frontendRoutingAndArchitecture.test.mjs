import test from 'node:test';
import assert from 'node:assert/strict';
import { findProblemById } from '../src/services/problemResolver.ts';
import { mockProblems } from '../src/data/mockProblems.ts';
import { PRF192_MASTER_PROBLEMS } from '../src/data/prf192MasterDataset.ts';

test('1. findProblemById resolves standard problem by id from mock bank', () => {
  const targetId = mockProblems[0].id;
  const result = findProblemById(targetId);
  assert.ok(result !== null);
  assert.equal(result.problem.id, targetId);
  assert.equal(result.collectionTitle, 'Kho Bài Tập Tiêu Chuẩn');
  assert.ok(Array.isArray(result.contextList));
  assert.ok(result.contextList.length >= 10);
});

test('2. findProblemById returns null for invalid or non-existent problem id', () => {
  const result = findProblemById('non_existent_prob_xyz_123');
  assert.equal(result, null);
  assert.equal(findProblemById(''), null);
});

test('3. findProblemById correctly resolves PRF192 problems', () => {
  const prfProb = PRF192_MASTER_PROBLEMS[0];
  assert.ok(prfProb);
  const result = findProblemById(prfProb.id);
  assert.ok(result !== null);
  assert.equal(result.problem.title, prfProb.title);
  assert.equal(result.collectionTitle, 'PRF192 Master Bank (FPT Standard)');
  assert.equal(result.contextList.length, 115);
});
