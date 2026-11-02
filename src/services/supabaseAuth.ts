/**
 * Supabase Authentication & Real-time Session Service
 * Provides Google OAuth 2.0 PKCE, Email/Password Auth, Session Management,
 * and Server-Verified Role-Based Access Control (RBAC) via the Postgres 'profiles' table.
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { AuthUser, UserRole } from '../types/index.ts';

// Default Supabase project URL discovered from user's setup
export const DEFAULT_SUPABASE_URL = 'https://dcfehiahdpbfvyzekchr.supabase.co';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface UserProfileRecord {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: UserRole;
  rating: number;
  streak_days: number;
  rank_class: string;
}

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = '';

/**
 * Retrieve current Supabase config from environment variables or localStorage
 */
export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : '';
  const envAnonKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : '';

  let localUrl = '';
  let localAnonKey = '';
  if (typeof window !== 'undefined' && window.localStorage) {
    localUrl = localStorage.getItem('ahtest_supabase_url') || '';
    localAnonKey = localStorage.getItem('ahtest_supabase_anon_key') || '';
  }

  const url = (envUrl || localUrl || DEFAULT_SUPABASE_URL).trim();
  const anonKey = (envAnonKey || localAnonKey || '').trim();

  return { url, anonKey };
}

/**
 * Persist Supabase configuration locally (useful for live Vercel testing before env redeploy)
 */
export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('ahtest_supabase_url', url.trim());
    localStorage.setItem('ahtest_supabase_anon_key', anonKey.trim());
  }
  cachedClient = null; // force re-initialization
}

/**
 * Check if Supabase client is properly configured with an anon key
 */
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && anonKey.length > 20);
}

/**
 * Get or create Supabase client instance
 */
export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return null;

  const configKey = `${url}::${anonKey}`;
  if (cachedClient && cachedConfigKey === configKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
      }
    });
    cachedConfigKey = configKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Query server-verified user profile from the Postgres 'profiles' table.
 * Protected by Row-Level Security (RLS).
 */
export async function fetchUserProfile(userId: string): Promise<UserProfileRecord | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('profiles')
      .select('id, email, name, avatar_url, role, rating, streak_days, rank_class')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Could not fetch user profile from Supabase:', error.message);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar_url: data.avatar_url,
      role: (data.role as UserRole) || 'student',
      rating: data.rating ?? 1200,
      streak_days: data.streak_days ?? 0,
      rank_class: data.rank_class ?? 'Newbie'
    };
  } catch (err) {
    console.warn('Error fetching user profile:', err);
    return null;
  }
}

/**
 * Transform Supabase user payload + server-verified database profile into application AuthUser.
 * Role is strictly sourced from verified profile, defaulting to 'student'.
 */
export function mapSupabaseUserToAuthUser(
  supabaseUser: any,
  profile?: UserProfileRecord | null
): AuthUser {
  const email = (supabaseUser.email || '').toLowerCase();
  const metadata = supabaseUser.user_metadata || {};

  const fullName =
    profile?.name ||
    metadata.full_name ||
    metadata.name ||
    (metadata.given_name ? `${metadata.given_name} ${metadata.family_name || ''}`.trim() : '') ||
    email.split('@')[0] ||
    'Học viên';

  const avatarUrl =
    profile?.avatar_url ||
    metadata.avatar_url ||
    metadata.picture ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email || 'student')}`;

  // Strict RBAC: Role is derived exclusively from server database, never user_metadata or email matching
  const role: UserRole = profile?.role === 'super_admin' ? 'super_admin'
    : profile?.role === 'educator' ? 'educator'
    : 'student';

  return {
    id: `usr_sb_${supabaseUser.id}`,
    name: fullName,
    email: supabaseUser.email || email,
    avatarUrl,
    role,
    provider: (supabaseUser.app_metadata?.provider as any) || 'email',
    streakDays: profile?.streak_days ?? 1,
    rating: profile?.rating ?? (role === 'super_admin' ? 3000 : 1200),
    rankClass: profile?.rank_class ?? (role === 'super_admin' ? 'Super Admin' : 'Newbie'),
    lastLoginAt: 'Vừa xong'
  };
}

/**
 * Authenticate with Email & Password via Supabase Auth
 */
export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      error: 'Hệ thống chưa kết nối tới Supabase. Vui lòng cấu hình Public Anon Key.'
    };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      let friendlyError = error.message;
      if (error.message.includes('Invalid login credentials')) {
        friendlyError = 'Email hoặc mật khẩu không chính xác.';
      } else if (error.message.includes('Email not confirmed')) {
        friendlyError = 'Tài khoản chưa được kích hoạt email xác nhận.';
      }
      return { success: false, error: friendlyError };
    }

    if (data.user) {
      const profile = await fetchUserProfile(data.user.id);
      const authUser = mapSupabaseUserToAuthUser(data.user, profile);
      return { success: true, user: authUser };
    }

    return { success: false, error: 'Không thể xác thực thông tin tài khoản.' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Lỗi kết nối máy chủ xác thực.' };
  }
}

/**
 * Register a new user with Email & Password via Supabase Auth
 */
export async function signUpWithEmailPassword(
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; user?: AuthUser; error?: string; requiresEmailConfirmation?: boolean }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      error: 'Hệ thống chưa kết nối tới Supabase. Vui lòng cấu hình Public Anon Key.'
    };
  }

  try {
    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name.trim(),
          name: name.trim()
        }
      }
    });

    if (error) {
      let friendlyError = error.message;
      if (error.message.includes('User already registered')) {
        friendlyError = 'Email này đã tồn tại trong hệ thống. Vui lòng chọn đăng nhập.';
      } else if (error.message.includes('Password should be at least')) {
        friendlyError = 'Mật khẩu phải có độ dài tối thiểu 6 ký tự.';
      }
      return { success: false, error: friendlyError };
    }

    // If email confirmation is enabled and session is not auto-created
    if (data.user && !data.session) {
      return {
        success: true,
        requiresEmailConfirmation: true
      };
    }

    if (data.user) {
      const profile = await fetchUserProfile(data.user.id);
      const authUser = mapSupabaseUserToAuthUser(data.user, profile);
      return { success: true, user: authUser };
    }

    return { success: false, error: 'Không thể khởi tạo tài khoản mới.' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Lỗi kết nối máy chủ xác thực.' };
  }
}

/**
 * Trigger authentic Google OAuth 2.0 PKCE sign-in via Supabase
 */
export async function signInWithGoogleOAuth(): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      error: 'Chưa cấu hình Supabase Anon Key. Vui lòng nhập Public Anon Key để kích hoạt kết nối OAuth.'
    };
  }

  try {
    const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;

    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Lỗi kết nối tới Google OAuth.' };
  }
}

/**
 * Listen to Supabase OAuth redirects and restore verified authenticated session.
 * Always resolves role from database profile before notifying the application.
 */
export function setupSupabaseAuthListener(
  onLogin: (user: AuthUser) => void,
  onLogout: () => void
): () => void {
  const client = getSupabaseClient();
  if (!client) return () => {};

  const handleSession = async (user: User | null | undefined) => {
    if (user) {
      const profile = await fetchUserProfile(user.id);
      const authUser = mapSupabaseUserToAuthUser(user, profile);
      onLogin(authUser);
    } else {
      onLogout();
    }
  };

  // Check if session already exists on initial load
  client.auth.getSession().then(({ data: { session }, error }) => {
    if (error) {
      console.warn('Supabase getSession error:', error.message);
      onLogout();
      return;
    }
    if (session?.user) {
      handleSession(session.user);
    }
  });

  // Listen to state changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED)
  const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
    if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session?.user) {
      await handleSession(session.user);
    } else if (event === 'SIGNED_OUT') {
      onLogout();
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Sign out of Supabase session
 */
export async function signOutSupabase(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch {
      // ignore
    }
  }
}
