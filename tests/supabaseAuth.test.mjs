import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mapSupabaseUserToAuthUser,
  DEFAULT_SUPABASE_URL
} from '../src/services/supabaseAuth.ts';

test('1. Default Supabase URL matches user project', () => {
  assert.equal(DEFAULT_SUPABASE_URL, 'https://dcfehiahdpbfvyzekchr.supabase.co');
});

test('2. mapSupabaseUserToAuthUser creates valid student profile by default', () => {
  const mockUser = {
    id: 'sb_123456',
    email: 'sinhvien@gmail.com',
    app_metadata: { provider: 'google' },
    user_metadata: {
      full_name: 'Trần Văn Nam',
      avatar_url: 'https://lh3.googleusercontent.com/avatar.png'
    }
  };

  const authUser = mapSupabaseUserToAuthUser(mockUser, null);
  assert.equal(authUser.id, 'usr_sb_sb_123456');
  assert.equal(authUser.email, 'sinhvien@gmail.com');
  assert.equal(authUser.name, 'Trần Văn Nam');
  assert.equal(authUser.role, 'student');
  assert.equal(authUser.provider, 'google');
});

test('3. Specific emails like Anngoc@.com NO LONGER get automatic admin without database profile', () => {
  const mockOldAdmin = {
    id: 'sb_admin_999',
    email: 'Anngoc@.com',
    user_metadata: {
      full_name: 'An Ngọc'
    }
  };

  // Without verified profile, it defaults strictly to student
  const authUserWithoutProfile = mapSupabaseUserToAuthUser(mockOldAdmin, null);
  assert.equal(authUserWithoutProfile.role, 'student');

  // When database profile explicitly has super_admin, role is granted
  const verifiedProfile = {
    id: 'sb_admin_999',
    email: 'anngoc@.com',
    name: 'An Ngọc',
    avatar_url: null,
    role: 'super_admin',
    rating: 3000,
    streak_days: 30,
    rank_class: 'Super Admin'
  };
  const authUserWithProfile = mapSupabaseUserToAuthUser(mockOldAdmin, verifiedProfile);
  assert.equal(authUserWithProfile.role, 'super_admin');
  assert.equal(authUserWithProfile.rankClass, 'Super Admin');
});
