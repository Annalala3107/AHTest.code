import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { executeCodeAsync } from '../src/services/executionManager.ts';
import {
  executePythonCode,
  executeJavaCode,
  executeSqlQuery,
} from '../src/services/multiLangJudgeService.ts';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseLocalConfig,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY,
} from '../src/services/supabaseAuth.ts';
import { cppCourse } from '../src/data/academy/cppCourse.ts';
import { pythonCourse } from '../src/data/academy/pythonCourse.ts';

test('1. C++20 supports FastIO, #define ll long long, vector<int>, sort, and type-aware cin', async () => {
  const cppCode = `
#include <iostream>
#include <vector>
#include <algorithm>
#define ll long long
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string name;
    double score;
    int n;
    if (cin >> name >> score >> n) {
        vector<ll> a(n);
        for (int i = 0; i < n; i++) {
            cin >> a[i];
        }
        sort(a.begin(), a.end());
        cout << name << " " << score << " " << a[0] << " " << a[n - 1] << "\\n";
    }
    return 0;
}
`;
  const exec = await executeCodeAsync('cpp20', cppCode, 'An 9.5 4\n40 10 30 20');
  assert.equal(exec.status, 'SUCCESS', `Expected SUCCESS, got ${exec.status}: ${exec.stderr}`);
  assert.equal(exec.stdout.trim(), 'An 9.5 10 40');
});

test('2. Python 3 sandbox executes input().split(), map(int, ...), loops, list comprehensions, and print', async () => {
  const pyCode = `
n = int(input())
a, b = map(int, input().split())
arr = [x * 2 for x in range(1, n + 1) if x % 2 == 1]
total = 0
for v in arr:
    total += v
print(a + b, total, arr[::-1])
`;
  const exec = await executeCodeAsync('py3', pyCode, '5\n10 25');
  assert.equal(exec.status, 'SUCCESS', `Expected SUCCESS, got ${exec.status}: ${exec.stderr}`);
  assert.equal(exec.stdout.trim(), '35 18 [10, 6, 2]');
});

test('3. Java 21 sandbox executes Scanner, Arrays.sort, and System.out.println', async () => {
  const javaCode = `
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        int sum = 0;
        for (int i = 0; i < n; i++) {
            a[i] = sc.nextInt();
            sum += a[i];
        }
        Arrays.sort(a);
        System.out.println(sum + " " + a[0] + " " + a[n - 1]);
    }
}
`;
  const exec = await executeCodeAsync('java', javaCode, '4\n9 2 7 4');
  assert.equal(exec.status, 'SUCCESS', `Expected SUCCESS, got ${exec.status}: ${exec.stderr}`);
  assert.equal(exec.stdout.trim(), '22 2 9');
});

test('4. SQL sandbox executes CREATE TABLE, INSERT INTO, SELECT WHERE ORDER BY, and COUNT/SUM aggregates', async () => {
  const sqlCode = `
CREATE TABLE contest_scores (id INT, handle TEXT, team TEXT, points INT);
INSERT INTO contest_scores VALUES (1, 'an_coder', 'A', 120), (2, 'binh_cp', 'B', 95), (3, 'chi_algo', 'A', 150);
SELECT handle, points FROM contest_scores WHERE points >= 100 ORDER BY points DESC;
SELECT COUNT(*) AS passed_count, SUM(points) AS total_points FROM contest_scores WHERE team = 'A';
`;
  const exec = await executeCodeAsync('sql', sqlCode, '');
  assert.equal(exec.status, 'SUCCESS', `Expected SUCCESS, got ${exec.status}: ${exec.stderr}`);
  assert.equal(
    exec.stdout.trim(),
    [
      'handle | points',
      'chi_algo | 150',
      'an_coder | 120',
      '',
      'passed_count | total_points',
      '2 | 270',
    ].join('\n')
  );
});

test('5. Academy C++ and Python courses are unlocked and every lesson solution passes its testcases', async () => {
  assert.equal(cppCourse.isComingSoon, false, 'cppCourse must be unlocked');
  assert.equal(pythonCourse.isComingSoon, false, 'pythonCourse must be unlocked');

  const academyIndexSrc = fs.readFileSync(path.resolve('src/data/academy/index.ts'), 'utf-8');
  assert.ok(academyIndexSrc.includes('cppCourse') && academyIndexSrc.includes('pythonCourse'));

  for (const mod of cppCourse.modules) {
    for (const lesson of mod.lessons) {
      for (const tc of lesson.testcases || []) {
        const res = await executeCodeAsync('cpp20', lesson.solutionCode, tc.input);
        assert.equal(res.status, 'SUCCESS', `C++ lesson ${lesson.id} failed: ${res.stderr}`);
        assert.equal(
          res.stdout.replace(/\r\n/g, '\n').trim(),
          tc.expectedOutput.replace(/\r\n/g, '\n').trim(),
          `C++ lesson ${lesson.id} output mismatch`
        );
      }
    }
  }

  for (const mod of pythonCourse.modules) {
    for (const lesson of mod.lessons) {
      for (const tc of lesson.testcases || []) {
        const res = await executeCodeAsync('py3', lesson.solutionCode, tc.input);
        assert.equal(res.status, 'SUCCESS', `Python lesson ${lesson.id} failed: ${res.stderr}`);
        assert.equal(
          res.stdout.replace(/\r\n/g, '\n').trim(),
          tc.expectedOutput.replace(/\r\n/g, '\n').trim(),
          `Python lesson ${lesson.id} output mismatch`
        );
      }
    }
  }
});

test('6. Multi-language sandboxes block host escape identifiers', async () => {
  const pyEscape = await executePythonCode('fetch("https://evil.test")', '');
  assert.equal(pyEscape.status, 'CE');
  assert.ok(pyEscape.stderr.includes('security violation'));

  const javaEscape = await executeJavaCode(
    'public class Main { public static void main(String[] a) { System.out.println(localStorage); } }',
    ''
  );
  assert.equal(javaEscape.status, 'CE');
  assert.ok(javaEscape.stderr.includes('security violation'));

  const sqlEscape = await executeSqlQuery('SELECT fetch FROM students;', '');
  assert.equal(sqlEscape.status, 'CE');
  assert.ok(sqlEscape.stderr.includes('security violation'));
});

test('7. Phase 2 SQL migration secures hidden testcases and adds submissions table', () => {
  const sql = fs.readFileSync(
    path.resolve('supabase/migrations/20261118_phase2_problems_submissions_and_judge.sql'),
    'utf-8'
  );
  assert.ok(sql.includes('create table if not exists public.problems'));
  assert.ok(sql.includes('create table if not exists public.problem_testcases'));
  assert.ok(sql.includes('using (is_hidden = false or public.is_super_admin())'));
  assert.ok(sql.includes('create table if not exists public.submissions'));
  assert.ok(sql.includes('with check (auth.uid() = user_id)'));
});

test('8. Supabase local override priority honors localStorage ⚙️ config and restores defaults cleanly', () => {
  const store = new Map();
  const originalWindow = globalThis.window;
  globalThis.window = {
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
    },
  };

  try {
    saveSupabaseConfig('https://custom123.supabase.co', 'sb_publishable_custom_key_1234567890');
    const custom = getSupabaseConfig();
    assert.equal(custom.url, 'https://custom123.supabase.co');
    assert.equal(custom.anonKey, 'sb_publishable_custom_key_1234567890');

    clearSupabaseLocalConfig();
    const fallback = getSupabaseConfig();
    assert.equal(fallback.url, DEFAULT_SUPABASE_URL);
    assert.equal(fallback.anonKey, DEFAULT_SUPABASE_ANON_KEY);
  } finally {
    globalThis.window = originalWindow;
  }
});
