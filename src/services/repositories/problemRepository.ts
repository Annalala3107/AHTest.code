import { getSupabaseClient } from '../supabaseAuth.ts';
import { mockProblems } from '../../data/mockProblems.ts';
import { loadCollections } from '../collectionStorage.ts';
import type { Problem, Difficulty } from '../../types/index.ts';

export interface ProblemFilterOptions {
  track?: 'competitive' | 'lab_practice';
  category?: string;
  difficulty?: Difficulty | 'All';
  searchQuery?: string;
}

export interface UserProgressRecord {
  problemId: string;
  status: 'unattempted' | 'attempted' | 'solved';
  starScore: number;
}

function mapRowToProblem(row: any): Problem {
  return {
    id: row.id,
    slug: row.id,
    title: row.title,
    titleEn: row.title_en || undefined,
    difficulty: (row.difficulty as Difficulty) || 'Medium',
    points: row.points || 100,
    solvedCount: row.accepted_count || 0,
    totalSubmissions: row.submission_count || 0,
    author: 'AHtest Official',
    source: 'AHtest Supabase',
    createdAt: row.created_at || new Date().toISOString(),
    category: row.category || 'General',
    tags: Array.isArray(row.tags) ? row.tags : [],
    timeLimit: Number((row.time_limit_ms / 1000).toFixed(1)) || 1.0,
    memoryLimit: Math.round(row.memory_limit_kb / 1024) || 256,
    statement: row.statement || '',
    statementEn: row.statement_en || undefined,
    inputFormat: row.input_format || '',
    inputFormatEn: row.input_format_en || undefined,
    outputFormat: row.output_format || '',
    outputFormatEn: row.output_format_en || undefined,
    constraints: row.constraints || '',
    constraintsEn: row.constraints_en || undefined,
    samples: Array.isArray(row.samples) ? row.samples : [],
    testcases: [],
    editorial: row.editorial || undefined,
  };
}

export async function fetchProblems(options?: ProblemFilterOptions): Promise<Problem[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      let query = supabase
        .from('problems')
        .select('*')
        .eq('is_published', true);

      if (options?.track) {
        query = query.eq('track', options.track);
      }
      if (options?.difficulty && options.difficulty !== 'All') {
        query = query.eq('difficulty', options.difficulty);
      }
      if (options?.category && options.category !== 'All') {
        query = query.eq('category', options.category);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        let results = data.map(mapRowToProblem);
        if (options?.searchQuery) {
          const q = options.searchQuery.toLowerCase();
          results = results.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.id.toLowerCase().includes(q) ||
              p.tags.some((t) => t.toLowerCase().includes(q))
          );
        }
        return results;
      }
    } catch {
      // Fallback below
    }
  }

  // Graceful Offline / Fallback
  let results = [...mockProblems];

  // Include user local imported collections' problems
  try {
    const localCols = loadCollections();
    for (const col of localCols) {
      if (col.problems && col.problems.length > 0) {
        for (const p of col.problems) {
          if (!results.some((r) => r.id === p.id)) {
            results.push(p);
          }
        }
      }
    }
  } catch {
    // ignore
  }

  if (options?.difficulty && options.difficulty !== 'All') {
    results = results.filter((p) => p.difficulty === options.difficulty);
  }
  if (options?.category && options.category !== 'All') {
    results = results.filter((p) => p.category === options.category);
  }
  if (options?.searchQuery) {
    const q = options.searchQuery.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return results;
}

export async function fetchUserProgress(userId?: string): Promise<Record<string, UserProgressRecord>> {
  const progressMap: Record<string, UserProgressRecord> = {};

  // Check localStorage for offline/guest solved records
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ahtest_solved_')) {
        const problemId = key.replace('ahtest_solved_', '');
        const star = Number(localStorage.getItem(key)) || 100;
        progressMap[problemId] = {
          problemId,
          status: 'solved',
          starScore: star,
        };
      }
    }
  } catch {
    // ignore
  }

  if (!userId) return progressMap;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('user_problem_progress')
        .select('problem_id, status, star_score')
        .eq('user_id', userId);

      if (!error && data) {
        data.forEach((row: any) => {
          progressMap[row.problem_id] = {
            problemId: row.problem_id,
            status: row.status,
            starScore: row.star_score,
          };
        });
      }
    } catch {
      // ignore
    }
  }

  return progressMap;
}
