import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GUEST_USER,
  verifyAdminCredentials,
  hashPassword,
  ADMIN_PASSWORD_HASH,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
  parseGoogleJwt,
  createGoogleAuthUser
} from '../src/services/authService.ts';

test('1. Guest user is safe and has student role', () => {
  assert.equal(GUEST_USER.id, 'usr_guest');
  assert.equal(GUEST_USER.role, 'student');
  assert.equal(GUEST_USER.email, 'guest@ahtest.code');
});

test('2. Admin password hash calculation matches constant', async () => {
  const hash = await hashPassword('an06112007');
  assert.equal(hash, ADMIN_PASSWORD_HASH);
});

test('3. Admin login with Anngoc@.com and an06112007 succeeds with super_admin role', async () => {
  clearFailedAttempts('anngoc@.com');
  const result = await verifyAdminCredentials('Anngoc@.com', 'an06112007');
  assert.equal(result.success, true);
  assert.ok(result.user);
  assert.equal(result.user.role, 'super_admin');
  assert.equal(result.user.email, 'Anngoc@.com');
});

test('4. Admin login with wrong password fails and reports error', async () => {
  clearFailedAttempts('anngoc@.com');
  const result = await verifyAdminCredentials('Anngoc@.com', 'wrong_pass');
  assert.equal(result.success, false);
  assert.ok(result.error && result.error.includes('không chính xác'));
});

test('5. Anti-Brute-Force locks out after 5 consecutive failures', async () => {
  const email = 'test_brute_force@ahtest.code';
  clearFailedAttempts(email);
  for (let i = 0; i < 5; i++) {
    recordFailedAttempt(email);
  }
  const status = checkRateLimit(email);
  assert.equal(status.isLocked, true);
  assert.ok(status.remainingSeconds > 0);
  clearFailedAttempts(email);
});

test('6. Google JWT decode produces authentic student user', () => {
  // Mock standard base64url JWT payload
  const mockPayload = {
    sub: '10987654321',
    email: 'sinhvien.cntt@gmail.com',
    email_verified: true,
    name: 'Nguyễn Văn A',
    picture: 'https://lh3.googleusercontent.com/a/sample-photo'
  };
  const base64Payload = Buffer.from(JSON.stringify(mockPayload)).toString('base64url');
  const mockJwt = `header.${base64Payload}.signature`;

  const decoded = parseGoogleJwt(mockJwt);
  assert.ok(decoded);
  assert.equal(decoded.email, 'sinhvien.cntt@gmail.com');
  assert.equal(decoded.name, 'Nguyễn Văn A');

  const authUser = createGoogleAuthUser(decoded);
  assert.equal(authUser.role, 'student');
  assert.equal(authUser.provider, 'google');
  assert.equal(authUser.email, 'sinhvien.cntt@gmail.com');
});
