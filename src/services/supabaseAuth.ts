/**
 * Supabase Authentication & Real-time Session Service
 * Provides Google OAuth 2.0 PKCE, Session Management, and Auto-sync with AHtest.code
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { AuthUser } from '../types/index.ts';

// Default Supabase project URL discovered from user's setup
export const DEFAULT_SUPABASE_URL = 'https://dcfehiahdpbfvyzekchr.supabase.co';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = '';

/**
 * Retrieve current Supabase config from environment variables or localStorage
 */
export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const localUrl = localStorage.getItem('ahtest_supabase_url');
  const localAnonKey = localStorage.getItem('ahtest_supabase_anon_key');

  const url = (envUrl || localUrl || DEFAULT_SUPABASE_URL).trim();
  const anonKey = (envAnonKey || localAnonKey || '').trim();

  return { url, anonKey };
}

/**
 * Persist Supabase configuration locally (useful for live Vercel testing before env redeploy)
 */
export function saveSupabaseConfig(url: string, anonKey: string): void {
  localStorage.setItem('ahtest_supabase_url', url.trim());
  localStorage.setItem('ahtest_supabase_anon_key', anonKey.trim());
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
        storage: window.localStorage
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
 * Transform Supabase user payload into application AuthUser
 */
export function mapSupabaseUserToAuthUser(supabaseUser: any): AuthUser {
  const email = (supabaseUser.email || '').toLowerCase();
  const metadata = supabaseUser.user_metadata || {};
  
  // Super Admin validation
  const isSuperAdmin = email === 'anngoc@.com' || email === 'anngoc@gmail.com';

  const fullName = 
    metadata.full_name || 
    metadata.name || 
    (metadata.given_name ? `${metadata.given_name} ${metadata.family_name || ''}`.trim() : '') ||
    email.split('@')[0] || 
    'Học viên Google';

  const avatarUrl = 
    metadata.avatar_url || 
    metadata.picture || 
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email || 'student')}`;

  return {
    id: `usr_sb_${supabaseUser.id}`,
    name: fullName,
    email: supabaseUser.email || email,
    avatarUrl,
    role: isSuperAdmin ? 'super_admin' : 'student',
    provider: 'google',
    streakDays: 1,
    rating: isSuperAdmin ? 3000 : 1200,
    rankClass: isSuperAdmin ? 'Super Admin' : 'Newbie',
    lastLoginAt: 'Vừa xong'
  };
}

/**
 * Trigger authentic Google OAuth sign-in via Supabase
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
    // Current origin (e.g. https://ahtestcode.vercel.app or http://localhost:5173)
    const redirectTo = window.location.origin;

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
 * Listen to Supabase OAuth redirects and restore authenticated session
 */
export function setupSupabaseAuthListener(
  onLogin: (user: AuthUser) => void,
  onLogout: () => void
): () => void {
  const client = getSupabaseClient();
  if (!client) return () => {};

  // Check if session already exists on load (e.g. after redirect back from Google)
  client.auth.getSession().then(({ data: { session }, error }) => {
    if (error) {
      console.warn('Supabase getSession error:', error.message);
      return;
    }
    if (session?.user) {
      const authUser = mapSupabaseUserToAuthUser(session.user);
      onLogin(authUser);
    }
  });

  // Listen to state changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED)
  const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const authUser = mapSupabaseUserToAuthUser(session.user);
      onLogin(authUser);
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
