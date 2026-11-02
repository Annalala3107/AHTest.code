/**
 * Safe In-Memory Auth Fallback & Guest Definitions
 * Strict RBAC: All authentic sessions, roles, and identity checks
 * are delegated to Supabase Auth & Postgres Row-Level Security (RLS).
 * No secrets, credentials, or hashes are stored on the client.
 */

import type { AuthUser } from '../types/index.ts';

export const GUEST_USER: AuthUser = {
  id: 'usr_guest',
  name: 'Khách',
  email: 'guest@ahtest.code',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest',
  role: 'student',
  provider: 'email',
  streakDays: 0,
  rating: 1200,
  rankClass: 'Newbie'
};

/**
 * Check if the active user session is an unauthenticated guest
 */
export function isGuestUser(user: AuthUser | null | undefined): boolean {
  return !user || user.id === GUEST_USER.id || user.role === undefined;
}
