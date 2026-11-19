import { getSupabaseClient } from '../supabaseAuth.ts';
import type { AuthUser, UserRole } from '../../types/index.ts';

export async function adminListUsersSafe(): Promise<AuthUser[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('admin_list_users_safe');
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          name: d.full_name || d.username || 'Thí sinh',
          email: `${(d.username || 'usr').slice(0, 3)}***@ahtest.code`,
          avatarUrl: d.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
          role: d.role as UserRole,
          provider: 'google',
          streakDays: 7,
          rating: d.rating || 1500,
          rankClass: d.rank_class || 'Pupil',
          lastLoginAt: new Date(d.created_at).toLocaleDateString('vi-VN'),
        }));
      }
    } catch {
      // Fallback
    }
  }

  return [];
}

export async function adminSetUserRole(targetUserId: string, newRole: UserRole): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { data, error } = await supabase.rpc('admin_set_user_role', {
      target_user_id: targetUserId,
      new_role: newRole,
    });
    return !error && data === true;
  } catch {
    return false;
  }
}
