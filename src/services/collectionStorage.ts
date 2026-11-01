import { ProblemCollection, Problem, ExamSessionConfig } from '../types';
import { DEFAULT_PROBLEM_COLLECTIONS } from '../data/prf192Collections';

export const COLLECTIONS_STORAGE_KEY = 'ahtest_problem_collections';
export const LEGACY_PROBLEMS_STORAGE_KEY = 'ahtest_imported_problems';

/**
 * Load all problem collections from persistent localStorage.
 * Automatically migrates legacy imported problems if they exist.
 */
export function loadCollections(): ProblemCollection[] {
  try {
    const raw = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
    let collections: ProblemCollection[] = [];

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        collections = parsed;
      }
    }

    // Fallback to default PRF192 collections if none saved
    if (collections.length === 0) {
      collections = JSON.parse(JSON.stringify(DEFAULT_PROBLEM_COLLECTIONS));
    }

    // Check for legacy imported problems to migrate
    const legacyRaw = localStorage.getItem(LEGACY_PROBLEMS_STORAGE_KEY);
    if (legacyRaw) {
      try {
        const legacyProblems: Problem[] = JSON.parse(legacyRaw);
        if (Array.isArray(legacyProblems) && legacyProblems.length > 0) {
          // Find or create the user_custom_library collection
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
 * Reset collections back to factory defaults.
 */
export function resetCollectionsToDefault(): ProblemCollection[] {
  const defaults = JSON.parse(JSON.stringify(DEFAULT_PROBLEM_COLLECTIONS));
  saveCollections(defaults);
  return defaults;
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
 */
export function createExamSession(
  collection: ProblemCollection,
  questionCount: number,
  timeLimitMinutes: number
): ExamSessionConfig {
  // Clamp question count between 10 and 20 (or max available)
  const available = collection.problems.length;
  const count = Math.min(Math.max(10, questionCount), Math.max(available, 10));

  // Fisher-Yates smart shuffle
  const pool = [...collection.problems];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Selected questions
  const selectedProblems = pool.slice(0, count);

  return {
    collectionId: collection.id,
    collectionTitle: collection.title,
    totalQuestions: selectedProblems.length,
    timeLimitMinutes,
    problems: selectedProblems
  };
}
