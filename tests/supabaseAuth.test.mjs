import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mapSupabaseUserToAuthUser,
  DEFAULT_SUPABASE_URL
} from '../src/services/supabaseAuth.ts';

test('1. Default Supabase URL matches user project', () => {
  assert.equal(DEFAULT_SUPABASE_URL, 'https://dcfehiahdpbfvyzekchr.supabase.co');
});

test('2. mapSupabaseUserToAuthUser creates valid student profile', () => {
  const mockUser = {
    id: 'sb_123456',
    email: 'sinhvien@gmail.com',
    user_metadata: {
      full_name: 'Trần Văn Nam',
      avatar_url: 'https://lh3.googleusercontent.com/avatar.png'
    }
  };

  const authUser = mapSupabaseUserToAuthUser(mockUser);
  assert.equal(authUser.id, 'usr_sb_sb_123456');
  assert.equal(authUser.email, 'sinhvien@gmail.com');
  assert.equal(authUser.name, 'Trần Văn Nam');
  assert.equal(authUser.role, 'student');
  assert.equal(authUser.provider, 'google');
});

test('3. mapSupabaseUserToAuthUser grants super_admin to Anngoc@.com', () => {
  const mockAdmin = {
    id: 'sb_admin_999',
    email: 'Anngoc@.com',
    user_metadata: {
      full_name: 'An Ngọc Admin',
      avatar_url: 'https://lh3.googleusercontent.com/admin.png'
    }
  };

  const authUser = mapSupabaseUserToAuthUser(mockAdmin);
  assert.equal(authUser.role, 'super_admin');
  assert.equal(authUser.rankClass, 'Super Admin');
});
