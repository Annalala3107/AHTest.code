import type { Problem } from '../types/index.ts';
import { mockProblems } from '../data/mockProblems.ts';
import { PRF192_MASTER_PROBLEMS } from '../data/prf192MasterDataset.ts';
import { loadCollections } from './collectionStorage.ts';

export interface ResolvedProblemResult {
  problem: Problem;
  collectionTitle: string;
  contextList: Problem[];
}

/**
 * Resolves a problem by ID from:
 * 1. Default standard mock problems bank (mockProblems)
 * 2. PRF192 Master Bank (115 master problems)
 * 3. User-imported collections in local persistence
 */
export function findProblemById(problemId: string): ResolvedProblemResult | null {
  if (!problemId) return null;

  // 1. Search in standard mockProblems
  const standardIdx = mockProblems.findIndex(p => p.id === problemId);
  if (standardIdx !== -1) {
    return {
      problem: mockProblems[standardIdx],
      collectionTitle: 'Kho Bài Tập Tiêu Chuẩn',
      contextList: mockProblems,
    };
  }

  // 2. Search in PRF192 Master dataset
  const prfIdx = PRF192_MASTER_PROBLEMS.findIndex(p => p.id === problemId);
  if (prfIdx !== -1) {
    return {
      problem: PRF192_MASTER_PROBLEMS[prfIdx],
      collectionTitle: 'PRF192 Master Bank (FPT Standard)',
      contextList: PRF192_MASTER_PROBLEMS,
    };
  }

  // 3. Search in local persistence collections (Browser only)
  if (typeof localStorage !== 'undefined') {
    try {
      const collections = loadCollections();
      for (const col of collections) {
        const found = col.problems?.find(p => p.id === problemId);
        if (found) {
          return {
            problem: found,
            collectionTitle: col.title || 'Bộ Đề Ngoại Nhập',
            contextList: col.problems || [found],
          };
        }
      }
    } catch {
      // ignore
    }
  }

  return null;
}
