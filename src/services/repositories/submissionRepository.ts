import { getSupabaseClient } from '../supabaseAuth.ts';
import {
  saveLocalSubmission,
  getLocalSubmissions,
  type LocalSubmissionRecord,
} from '../workbenchStorage.ts';
import type { Verdict } from '../../types/index.ts';

export interface SubmitSolutionPayload {
  problemId: string;
  language: string;
  code: string;
  verdict: Verdict;
  score: number;
  maxScore: number;
  timeMs: number;
  memoryKb: number;
  passedTests: number;
  totalTests: number;
  userId?: string;
}

export interface PublicSubmissionItem {
  id: string;
  problemId: string;
  problemTitle: string;
  username: string;
  language: string;
  verdict: Verdict;
  score: number;
  timeMs: number;
  memoryKb: number;
  createdAt: string;
}

export interface ProblemCommentItem {
  id: string;
  problemId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likesCount: number;
  createdAt: string;
}

export async function submitSolution(
  payload: SubmitSolutionPayload
): Promise<{ success: boolean; submissionId: string; error?: string }> {
  // 1. Always record in local workbenchStorage
  const submissionRecord = {
    id: `sub_${Date.now()}`,
    problemId: payload.problemId,
    language: payload.language,
    code: payload.code,
    verdict: payload.verdict,
    score: payload.score,
    maxScore: payload.maxScore,
    timeMs: payload.timeMs,
    memoryKb: payload.memoryKb,
    passedTests: payload.passedTests,
    totalTests: payload.totalTests,
    submittedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  };
  saveLocalSubmission(payload.problemId, submissionRecord);

  // 2. Sync to Supabase if authenticated
  const supabase = getSupabaseClient();
  if (supabase && payload.userId) {
    try {
      const { data: subData, error: subError } = await supabase
        .from('submissions')
        .insert({
          user_id: payload.userId,
          problem_id: payload.problemId,
          language: payload.language.toLowerCase().replace(/[^a-z0-9]/g, ''),
          code: payload.code,
          verdict: payload.verdict,
          score: payload.score,
          max_score: payload.maxScore,
          time_ms: payload.timeMs,
          memory_kb: payload.memoryKb,
          passed_tests: payload.passedTests,
          total_tests: payload.totalTests,
        })
        .select('id')
        .single();

      if (!subError && subData) {
        // Update user_problem_progress
        const status = payload.verdict === 'AC' ? 'solved' : 'attempted';
        await supabase
          .from('user_problem_progress')
          .upsert({
            user_id: payload.userId,
            problem_id: payload.problemId,
            status,
            star_score: payload.score,
            last_attempt_at: new Date().toISOString(),
            solved_at: payload.verdict === 'AC' ? new Date().toISOString() : null,
          });

        return { success: true, submissionId: subData.id };
      }
    } catch {
      // Graceful fallback to local record
    }
  }

  return { success: true, submissionId: submissionRecord.id };
}

export async function fetchRecentSubmissions(limit = 10): Promise<PublicSubmissionItem[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('get_recent_public_submissions', {
        limit_count: limit,
      });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          problemId: d.problem_id,
          problemTitle: d.problem_title,
          username: d.username,
          language: d.language,
          verdict: d.verdict,
          score: d.score,
          timeMs: d.time_ms,
          memoryKb: d.memory_kb,
          createdAt: new Date(d.created_at).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));
      }
    } catch {
      // Fallback below
    }
  }

  // Fallback to local submissions + default stream
  const local = getLocalSubmissions();
  const fallbackList: PublicSubmissionItem[] = local.slice(0, limit).map((l: LocalSubmissionRecord) => ({
    id: l.id,
    problemId: l.problemId,
    problemTitle: l.problemId,
    username: 'Bạn (Local)',
    language: l.language,
    verdict: l.verdict,
    score: l.score,
    timeMs: l.timeMs,
    memoryKb: l.memoryKb,
    createdAt: l.submittedAt,
  }));

  // Append standard mock submissions if local has few items
  const mockSubmissions: PublicSubmissionItem[] = [
    {
      id: 'sub_01',
      problemId: 'torch',
      problemTitle: 'Rước Đuốc Olympic',
      username: 'fextivity',
      language: 'C++20 (GCC)',
      verdict: 'AC',
      score: 100,
      timeMs: 18,
      memoryKb: 1200,
      createdAt: '1 phút trước',
    },
    {
      id: 'sub_02',
      problemId: 'icpc26_mn_c',
      problemTitle: 'Cây Khung Cân Bằng',
      username: 'longlh.se17',
      language: 'C17',
      verdict: 'TLE',
      score: 40,
      timeMs: 2010,
      memoryKb: 18400,
      createdAt: '4 phút trước',
    },
    {
      id: 'sub_03',
      problemId: 'voi26_pine',
      problemTitle: 'Rừng Thông Đà Lạt',
      username: 'tranduluong',
      language: 'C++20',
      verdict: 'WA',
      score: 20,
      timeMs: 34,
      memoryKb: 2400,
      createdAt: '8 phút trước',
    },
  ];

  return [...fallbackList, ...mockSubmissions].slice(0, limit);
}

export async function fetchProblemComments(problemId: string): Promise<ProblemCommentItem[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('problem_comments')
        .select('*')
        .eq('problem_id', problemId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((c: any) => ({
          id: c.id,
          problemId: c.problem_id,
          userId: c.user_id,
          userName: c.user_name,
          userAvatar: c.user_avatar,
          content: c.content,
          likesCount: c.likes_count || 0,
          createdAt: new Date(c.created_at).toLocaleDateString('vi-VN'),
        }));
      }
    } catch {
      // Fallback
    }
  }

  return [];
}

export async function postProblemComment(
  problemId: string,
  userId: string,
  userName: string,
  content: string,
  userAvatar?: string
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('problem_comments').insert({
      problem_id: problemId,
      user_id: userId,
      user_name: userName,
      user_avatar: userAvatar,
      content,
    });
    return !error;
  } catch {
    return false;
  }
}
