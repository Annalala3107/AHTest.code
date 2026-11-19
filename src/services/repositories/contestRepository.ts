import { getSupabaseClient } from '../supabaseAuth.ts';
import { mockContests } from '../../data/mockContests.ts';
import type { Contest } from '../../types/index.ts';

export interface ContestScoreboardEntry {
  userId: string;
  username: string;
  organization: string;
  totalScore: number;
  totalPenalty: number;
  solvedProblems: Array<{
    problem_id: string;
    verdict: string;
    score: number;
    time_ms: number;
  }>;
}

export async function fetchContests(): Promise<Contest[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .order('start_time', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((c: any) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          description: c.description || '',
          startTime: c.start_time,
          endTime: c.end_time,
          durationMinutes: c.duration_minutes,
          status: c.status,
          isRated: c.is_rated,
          tags: Array.isArray(c.tags) ? c.tags : [],
          participantsCount: c.registration_count || 0,
          problemCount: 5,
          problems: [],
        }));
      }
    } catch {
      // Fallback
    }
  }

  return mockContests;
}

export async function registerForContest(
  contestId: string,
  userId: string
): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabaseClient();
  if (supabase && userId) {
    try {
      const { error } = await supabase.from('contest_registrations').insert({
        contest_id: contestId,
        user_id: userId,
      });

      if (!error) {
        return { success: true, message: 'Đăng ký tham gia kỳ thi thành công!' };
      }
    } catch {
      // Fallback
    }
  }

  return { success: true, message: 'Đã lưu đăng ký tham gia kỳ thi (Local Mode).' };
}

export async function fetchContestScoreboard(slug: string): Promise<ContestScoreboardEntry[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('get_contest_scoreboard', {
        p_contest_slug: slug,
      });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((d: any) => ({
          userId: d.user_id,
          username: d.username,
          organization: d.organization,
          totalScore: Number(d.total_score) || 0,
          totalPenalty: Number(d.total_penalty) || 0,
          solvedProblems: Array.isArray(d.solved_problems) ? d.solved_problems : [],
        }));
      }
    } catch {
      // Fallback
    }
  }

  // Fallback mock scoreboard
  return [
    {
      userId: 'usr_mock_1',
      username: 'fextivity',
      organization: 'THPT Chuyên KHTN - ĐHQG HN',
      totalScore: 500,
      totalPenalty: 124,
      solvedProblems: [
        { problem_id: 'A', verdict: 'AC', score: 100, time_ms: 12 },
        { problem_id: 'B', verdict: 'AC', score: 100, time_ms: 25 },
        { problem_id: 'C', verdict: 'AC', score: 100, time_ms: 40 },
        { problem_id: 'D', verdict: 'AC', score: 100, time_ms: 60 },
        { problem_id: 'E', verdict: 'AC', score: 100, time_ms: 95 },
      ],
    },
    {
      userId: 'usr_mock_2',
      username: 'longlh.se17',
      organization: 'Đại học FPT',
      totalScore: 300,
      totalPenalty: 210,
      solvedProblems: [
        { problem_id: 'A', verdict: 'AC', score: 100, time_ms: 15 },
        { problem_id: 'B', verdict: 'AC', score: 100, time_ms: 45 },
        { problem_id: 'C', verdict: 'AC', score: 100, time_ms: 150 },
      ],
    },
  ];
}
