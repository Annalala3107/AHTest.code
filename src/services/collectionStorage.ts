import type { ProblemCollection, Problem, ExamSessionConfig } from '../types';
import { DEFAULT_PROBLEM_COLLECTIONS } from '../data/prf192Collections.ts';
import { PRF192_MASTER_PROBLEMS } from '../data/prf192MasterDataset.ts';

export const COLLECTIONS_STORAGE_KEY = 'ahtest_problem_collections';
export const LEGACY_PROBLEMS_STORAGE_KEY = 'ahtest_imported_problems';

/**
 * Seed code drafts directly into localStorage for Monaco editor.
 */
export function seedDraftsForProblems(problems: (Problem & { code?: string })[]): void {
  try {
    problems.forEach(p => {
      if (p.code) {
        localStorage.setItem(`ahtest_draft_workbench_${p.id}_c17`, p.code);
        localStorage.setItem(`ahtest_draft_workbench_${p.id}_cpp20`, p.code);
      }
    });
  } catch (e) {
    console.warn('Draft seeding error:', e);
  }
}

/**
 * Load all problem collections from persistent localStorage.
 * Automatically migrates to 115+ master problems bank and legacy problems.
 */
export function loadCollections(): ProblemCollection[] {
  try {
    const raw = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
    const v3Flag = localStorage.getItem('ahtest_prf192_master_v3');
    let collections: ProblemCollection[] = [];

    // If master bank v3 not initialized yet or raw empty, initialize with 115+ master problems
    if (!v3Flag || !raw) {
      // Preserve any custom collections user created before resetting system collections
      const existingUserCol = raw ? (() => {
        try {
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed.find((c: ProblemCollection) => c.id === 'user_custom_library') : null;
        } catch { return null; }
      })() : null;

      collections = JSON.parse(JSON.stringify(DEFAULT_PROBLEM_COLLECTIONS));
      if (existingUserCol) {
        const uIdx = collections.findIndex(c => c.id === 'user_custom_library');
        if (uIdx >= 0) collections[uIdx] = existingUserCol;
        else collections.push(existingUserCol);
      }
      localStorage.setItem('ahtest_prf192_master_v3', 'true');
      localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections));
      seedDraftsForProblems(PRF192_MASTER_PROBLEMS);
    } else {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Check if existing stored collections only have few problems (< 20 total)
        const totalProbs = parsed.reduce((sum: number, c: ProblemCollection) => sum + (c.problems?.length || 0), 0);
        if (totalProbs < 20) {
          // Auto upgrade
          collections = JSON.parse(JSON.stringify(DEFAULT_PROBLEM_COLLECTIONS));
          seedDraftsForProblems(PRF192_MASTER_PROBLEMS);
        } else {
          collections = parsed;
        }
      } else {
        collections = JSON.parse(JSON.stringify(DEFAULT_PROBLEM_COLLECTIONS));
      }
    }

    // Check for legacy imported problems to migrate
    const legacyRaw = localStorage.getItem(LEGACY_PROBLEMS_STORAGE_KEY);
    if (legacyRaw) {
      try {
        const legacyProblems: Problem[] = JSON.parse(legacyRaw);
        if (Array.isArray(legacyProblems) && legacyProblems.length > 0) {
          let userCol = collections.find(c => c.id === 'user_custom_library');
          if (!userCol) {
            userCol = {
              id: 'user_custom_library',
              title: 'Kho Đề Tự Tạo & Ngoại Nhập (My Workspace)',
              titleEn: 'My Uploads & Custom Workspace',
              description: 'Nơi lưu trữ các bài tập bạn tự tạo thủ công hoặc nhập từ bên ngoài.',
              category: 'Kho Đề Cá Nhân',
              icon: 'folder-git-2',
              color: 'purple',
              difficultySummary: 'All Levels',
              isSystem: false,
              problems: []
            };
            collections.push(userCol);
          }

          // Add only non-existing legacy problems
          for (const prob of legacyProblems) {
            if (!userCol.problems.some(p => p.id === prob.id || p.slug === prob.slug)) {
              userCol.problems.push({
                ...prob,
                collectionId: userCol.id,
                isCustom: true
              });
            }
          }
        }
      } catch (e) {
        console.warn('Failed to parse legacy imported problems during migration:', e);
      }
    }

    // Ensure all problems know their collectionId
    collections.forEach(col => {
      col.problems = (col.problems || []).map(p => ({
        ...p,
        collectionId: col.id
      }));
    });

    // Save synced version
    saveCollections(collections);
    return collections;
  } catch (err) {
    console.error('Error loading problem collections:', err);
    return DEFAULT_PROBLEM_COLLECTIONS;
  }
}

/**
 * Persist collections to localStorage.
 */
export function saveCollections(collections: ProblemCollection[]): void {
  try {
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections));
  } catch (err) {
    console.error('Failed to save collections to localStorage:', err);
  }
}

/**
 * Reset collections back to factory defaults with 115+ problems.
 */
export function resetCollectionsToDefault(): ProblemCollection[] {
  const defaults: ProblemCollection[] = JSON.parse(JSON.stringify(DEFAULT_PROBLEM_COLLECTIONS));
  saveCollections(defaults);
  localStorage.setItem('ahtest_prf192_master_v2', 'true');
  seedDraftsForProblems(PRF192_MASTER_PROBLEMS);
  return defaults;
}

/**
 * 1-Click Restore / Synchronize Full 115+ Master PRF192 Bank.
 * Preserves user custom collections and re-seeds all drafts.
 */
export function restoreFull115MasterBank(): ProblemCollection[] {
  const freshDefaults: ProblemCollection[] = JSON.parse(JSON.stringify(DEFAULT_PROBLEM_COLLECTIONS));
  const current = loadCollections();
  const userCol = current.find(c => !c.isSystem && c.id === 'user_custom_library');
  if (userCol && userCol.problems.length > 0) {
    const existing = freshDefaults.find(c => c.id === 'user_custom_library');
    if (existing) {
      existing.problems = userCol.problems;
    } else {
      freshDefaults.push(userCol);
    }
  }
  saveCollections(freshDefaults);
  localStorage.setItem('ahtest_prf192_master_v2', 'true');
  seedDraftsForProblems(PRF192_MASTER_PROBLEMS);
  return freshDefaults;
}

/**
 * Add a new user-defined collection.
 */
export function createCollection(
  title: string,
  description: string,
  category: string,
  color: 'rose' | 'amber' | 'emerald' | 'blue' | 'purple' | 'cyan' = 'blue',
  icon: string = 'folder'
): ProblemCollection {
  const collections = loadCollections();
  const newCol: ProblemCollection = {
    id: `col_user_${Date.now()}`,
    title: title.trim(),
    description: description.trim(),
    category: category.trim() || 'Tự chọn',
    icon,
    color,
    difficultySummary: 'All Levels',
    isSystem: false,
    createdAt: new Date().toISOString().split('T')[0],
    problems: []
  };
  collections.push(newCol);
  saveCollections(collections);
  return newCol;
}

/**
 * Add a problem into a specific collection.
 */
export function addProblemToCollection(collectionId: string, problem: Problem): ProblemCollection[] {
  const collections = loadCollections();
  const col = collections.find(c => c.id === collectionId);
  if (col) {
    problem.collectionId = collectionId;
    problem.isCustom = true;
    col.problems.unshift(problem);
    col.updatedAt = new Date().toISOString().split('T')[0];
    saveCollections(collections);
  }
  return collections;
}

/**
 * Remove a problem from a collection.
 */
export function deleteProblemFromCollection(collectionId: string, problemId: string): ProblemCollection[] {
  const collections = loadCollections();
  const col = collections.find(c => c.id === collectionId);
  if (col) {
    col.problems = col.problems.filter(p => p.id !== problemId);
    saveCollections(collections);
  }
  return collections;
}

/**
 * Delete an entire user collection.
 */
export function deleteCollection(collectionId: string): ProblemCollection[] {
  let collections = loadCollections();
  // Prevent deleting default system collections
  const col = collections.find(c => c.id === collectionId);
  if (col && col.isSystem) {
    alert('Không thể xóa thư mục hệ thống chuẩn!');
    return collections;
  }
  collections = collections.filter(c => c.id !== collectionId);
  saveCollections(collections);
  return collections;
}

/**
 * Generate a smart exam session with balanced shuffling and configured duration.
 * Supports:
 * - Target as a single collection: Shuffles questions within the collection.
 * - Target as an array of collections: Performs balanced cross-category quota sampling
 *   (e.g., equal distribution from Shape, Array, String, and Math).
 */
export function createExamSession(
  target: ProblemCollection | ProblemCollection[],
  questionCount: number,
  timeLimitMinutes: number = 90,
  titleOverride?: string
): ExamSessionConfig {
  const isMultiCollection = Array.isArray(target);
  const collections = isMultiCollection ? target : [target];
  
  // Safe default: 90 minutes for standard PE Lab if <= 0 or omitted
  const actualTimeLimit = timeLimitMinutes && timeLimitMinutes > 0 ? timeLimitMinutes : 90;

  // Target question count clamped between 10 and 20
  const clampedCount = Math.min(20, Math.max(10, questionCount));
  
  let selectedProblems: Problem[] = [];

  if (isMultiCollection && collections.length > 1) {
    // Cross-Category Balanced Quota Sampling
    const activeCols = collections.filter(c => c.problems.length > 0);
    const perColQuota = Math.floor(clampedCount / activeCols.length);
    let remainder = clampedCount % activeCols.length;

    activeCols.forEach(col => {
      const quota = perColQuota + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;

      const pool = [...col.problems];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      selectedProblems.push(...pool.slice(0, quota));
    });

    // Shuffle the final assembled exam so questions from different categories are interweaved
    for (let i = selectedProblems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selectedProblems[i], selectedProblems[j]] = [selectedProblems[j], selectedProblems[i]];
    }
  } else {
    // Single Collection Exam
    const pool = [...collections[0].problems];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    selectedProblems = pool.slice(0, Math.min(clampedCount, pool.length));
  }

  const sessionTitle = titleOverride || (isMultiCollection ? 'Kỳ Thi Thử Toàn Diện PRF192' : collections[0].title);
  const collectionId = isMultiCollection ? 'prf192_grand_exam' : collections[0].id;

  return {
    collectionId,
    collectionTitle: sessionTitle,
    totalQuestions: selectedProblems.length,
    timeLimitMinutes: actualTimeLimit,
    problems: selectedProblems
  };
}
