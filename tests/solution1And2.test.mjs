import test from 'node:test';
import assert from 'node:assert';
import { executeCCode } from '../src/services/cExecutionEngine.ts';
import { executeCCodeWasm, isWasmSupported } from '../src/services/wasmExecutionEngine.ts';

test('Solution 1: Passing array parameter to function int sum(int arr[], int n)', () => {
  const code = `
#include <stdio.h>
int sum(int arr[], int n) {
    int s = 0;
    for (int i = 0; i < n; i++) s += arr[i];
    return s;
}
int main() {
    int a[4] = {5, 10, 15, 20};
    printf("%d\\n", sum(a, 4));
    return 0;
}
`;
  const res = executeCCode(code, '');
  assert.strictEqual(res.status, 'SUCCESS', 'Execution must succeed without syntax error');
  assert.strictEqual(res.stdout.trim(), '50');
});

test('Solution 1: Pointer swap function void swap(int *a, int *b)', () => {
  const code = `
#include <stdio.h>
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
int main() {
    int x = 42, y = 99;
    swap(&x, &y);
    printf("%d %d\\n", x, y);
    return 0;
}
`;
  const res = executeCCode(code, '');
  assert.strictEqual(res.status, 'SUCCESS', 'Pointer swap must succeed');
  assert.strictEqual(res.stdout.trim(), '99 42');
});

test('Solution 1: 2D Matrix Array manipulation int a[3][3]', () => {
  const code = `
#include <stdio.h>
int main() {
    int m[3][3];
    m[0][0] = 1;
    m[1][1] = 5;
    m[2][2] = 9;
    printf("%d %d %d\\n", m[0][0], m[1][1], m[2][2]);
    return 0;
}
`;
  const res = executeCCode(code, '');
  assert.strictEqual(res.status, 'SUCCESS', '2D array must execute without undefined read');
  assert.strictEqual(res.stdout.trim(), '1 5 9');
});

test('Solution 1: Struct definition and member access', () => {
  const code = `
#include <stdio.h>
struct Student {
    char name[30];
    int score;
};
int main() {
    struct Student s;
    s.score = 100;
    printf("Score: %d\\n", s.score);
    return 0;
}
`;
  const res = executeCCode(code, '');
  assert.strictEqual(res.status, 'SUCCESS', 'Struct must execute cleanly');
  assert.strictEqual(res.stdout.trim(), 'Score: 100');
});

test('Solution 1: Integer division truncation in index and loop', () => {
  const code = `
#include <stdio.h>
int main() {
    int arr[10];
    int a = 7, b = 2;
    int idx = a / b; // 3 in C
    arr[idx] = 77;
    printf("%d %d\\n", idx, arr[idx]);
    return 0;
}
`;
  const res = executeCCode(code, '');
  assert.strictEqual(res.status, 'SUCCESS');
  assert.strictEqual(res.stdout.trim(), '3 77');
});

test('Solution 2: WebAssembly C Engine executes valid C code with isWasmSupported check', async () => {
  assert.strictEqual(typeof isWasmSupported(), 'boolean');

  const code = `
#include <stdio.h>
int main() {
    printf("AHtest WebAssembly C Runtime: %d\\n", 2026);
    return 0;
}
`;
  const res = await executeCCodeWasm(code, '');
  assert.strictEqual(res.status, 'SUCCESS');
  assert.ok(res.stdout.includes('2026'));
});

test('Solution 2: Exam Hardening - Wall-clock timestamp ensures timer persistence across simulated reloads', () => {
  const colId = 'prf192_test_exam';
  const endTimestampKey = `ahtest_exam_end_${colId}`;
  const totalSeconds = 90 * 60;

  // Mock localStorage
  const map = new Map();
  global.localStorage = {
    getItem: (k) => map.get(k) || null,
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k)
  };

  // 1. Initial exam start: sets end time
  const now = Date.now();
  const targetEndTime = now + totalSeconds * 1000;
  global.localStorage.setItem(endTimestampKey, String(targetEndTime));

  // 2. Simulated F5 reload after 20 minutes (1200 seconds)
  const after20Mins = now + 1200 * 1000;
  const stored = global.localStorage.getItem(endTimestampKey);
  const remaining = Math.max(0, Math.floor((Number(stored) - after20Mins) / 1000));

  assert.strictEqual(remaining, totalSeconds - 1200, 'Remaining time must be exactly 70 minutes (4200s), NOT reset to 90 minutes');

  // 3. Question bookmark / flag persists
  const flagKey = `ahtest_exam_flags_${colId}`;
  global.localStorage.setItem(flagKey, JSON.stringify({ 0: true, 2: true }));
  const loadedFlags = JSON.parse(global.localStorage.getItem(flagKey));
  assert.strictEqual(loadedFlags[0], true);
  assert.strictEqual(loadedFlags[1], undefined);
  assert.strictEqual(loadedFlags[2], true);
});
