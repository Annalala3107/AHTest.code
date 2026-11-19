import { getSupabaseClient } from '../supabaseAuth.ts';
import { mockUsers, type UserItem } from '../../data/mockUsers.ts';

function getRankColor(rating: number): { title: string; color: string } {
  if (rating >= 3000) return { title: 'Legendary Grandmaster', color: 'text-red-500 font-bold' };
  if (rating >= 2600) return { title: 'Grandmaster', color: 'text-red-500' };
  if (rating >= 2400) return { title: 'International Master', color: 'text-amber-500 font-bold' };
  if (rating >= 2200) return { title: 'Master', color: 'text-amber-500' };
  if (rating >= 1900) return { title: 'Candidate Master', color: 'text-purple-500' };
  if (rating >= 1600) return { title: 'Expert', color: 'text-blue-500' };
  if (rating >= 1400) return { title: 'Specialist', color: 'text-cyan-500' };
  return { title: 'Pupil', color: 'text-emerald-500' };
}

export async function fetchLeaderboard(): Promise<UserItem[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('get_organization_leaderboard');
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((row: any) => {
          const rating = row.rating || 1500;
          const { title, color } = getRankColor(rating);
          return {
            id: row.id,
            username: row.username || 'coder',
            fullName: row.full_name || row.username || 'Thí sinh',
            rating,
            rankTitle: row.rank_class || title,
            rankColor: color,
            organization: row.organization || 'Tự do',
            solvedCount: Number(row.solved_count) || 0,
            points: Number(row.total_submissions) || 0,
            avatar: row.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            ratingHistory: [
              { contest: 'VNOI Cup 2026', rating, date: '2026-03-01', rank: 1 }
            ],
          };
        });
      }
    } catch {
      // Fallback
    }
  }

  return mockUsers;
}
