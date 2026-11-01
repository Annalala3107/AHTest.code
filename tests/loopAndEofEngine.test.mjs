import test from 'node:test';
import assert from 'node:assert/strict';
import { executeCCode } from '../src/services/cExecutionEngine.ts';

test('Solution 1: Unbraced while(1); loop must trigger TLE watchdog safely without crashing', () => {
  const code = `#include <stdio.h>
int main() {
    while (1);
    return 0;
}`;
  const res = executeCCode(code, '');
  assert.strictEqual(res.status, 'TLE', 'Expected status to be TLE');
  assert.strictEqual(res.exitCode, 124, 'Expected exitCode to be 124');
  assert.ok(res.stderr.includes('TIME_LIMIT_EXCEEDED'), 'Expected TLE in stderr');
});

test('Solution 1: Unbraced while (x > 0) x++; loop must trigger TLE watchdog safely', () => {
  const code = `#include <stdio.h>
int main() {
    int x = 1;
    while (x > 0)
        x++;
    return 0;
}`;
  const res = executeCCode(code, '');
  assert.strictEqual(res.status, 'TLE', 'Expected status to be TLE');
  assert.ok(res.stderr.includes('TIME_LIMIT_EXCEEDED'), 'Expected TLE in stderr');
});

test('Solution 1: Unbraced for loop calculates correctly', () => {
  const code = `#include <stdio.h>
int main() {
    int sum = 0;
    for (int i = 1; i <= 5; i++)
        sum += i;
    printf("%d", sum);
    return 0;
}`;
  const res = executeCCode(code, '');
  assert.strictEqual(res.status, 'SUCCESS', 'Expected status to be SUCCESS');
  assert.strictEqual(res.stdout.trim(), '15', 'Expected sum to be 15');
});

test('Solution 1: Nested unbraced for loops calculate correctly', () => {
  const code = `#include <stdio.h>
int main() {
    int count = 0;
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 4; j++)
            count++;
    printf("%d", count);
    return 0;
}`;
  const res = executeCCode(code, '');
  assert.strictEqual(res.status, 'SUCCESS', 'Expected status to be SUCCESS');
  assert.strictEqual(res.stdout.trim(), '12', 'Expected count to be 12');
});

test('Solution 1: Unbraced do-while loop executes correctly', () => {
  const code = `#include <stdio.h>
int main() {
    int x = 5;
    do
        x--;
    while (x > 0);
    printf("%d", x);
    return 0;
}`;
  const res = executeCCode(code, '');
  assert.strictEqual(res.status, 'SUCCESS', 'Expected status to be SUCCESS');
  assert.strictEqual(res.stdout.trim(), '0', 'Expected x to be 0');
});

test('Solution 1: while (scanf(...) != -1) terminates cleanly at EOF without TLE', () => {
  const code = `#include <stdio.h>
int main() {
    int n;
    int sum = 0;
    while (scanf("%d", &n) != -1) {
        sum += n;
    }
    printf("%d", sum);
    return 0;
}`;
  const res = executeCCode(code, '10 20 30');
  assert.strictEqual(res.status, 'SUCCESS', 'Expected status to be SUCCESS, got: ' + res.status);
  assert.strictEqual(res.stdout.trim(), '60', 'Expected sum to be 60');
});

test('Solution 1: while (scanf(...) != EOF) terminates cleanly at EOF without TLE', () => {
  const code = `#include <stdio.h>
int main() {
    int n;
    int count = 0;
    while (scanf("%d", &n) != EOF) {
        count++;
    }
    printf("%d", count);
    return 0;
}`;
  const res = executeCCode(code, '5 4 3 2 1');
  assert.strictEqual(res.status, 'SUCCESS', 'Expected status to be SUCCESS, got: ' + res.status);
  assert.strictEqual(res.stdout.trim(), '5', 'Expected count to be 5');
});

test('Solution 1: while (scanf(...) == 1) terminates cleanly at EOF', () => {
  const code = `#include <stdio.h>
int main() {
    int a;
    while (scanf("%d", &a) == 1) {
        printf("%d ", a * 2);
    }
    return 0;
}`;
  const res = executeCCode(code, '1 2 3');
  assert.strictEqual(res.status, 'SUCCESS', 'Expected status to be SUCCESS, got: ' + res.status);
  assert.strictEqual(res.stdout.trim(), '2 4 6', 'Expected 2 4 6');
});
