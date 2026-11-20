import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  buildMentorPrompt,
  handleAIMentorPost,
  resolveMentorTargetLanguage,
  resolveMentorModel,
  SUPPORTED_GEMINI_MODELS,
  DEFAULT_GEMINI_MODEL,
  AI_MENTOR_RESPONSE_SCHEMA,
  GET,
} from '../api/ai-mentor.ts';
import {
  buildMentorCacheKey,
  requestAIMentor,
} from '../src/services/aiMentorService.ts';

// Mock sessionStorage & localStorage for Node.js test runtime
const sessionMap = new Map();
globalThis.sessionStorage = {
  getItem: (k) => sessionMap.get(k) || null,
  setItem: (k, v) => sessionMap.set(k, String(v)),
  removeItem: (k) => sessionMap.delete(k),
  clear: () => sessionMap.clear(),
  get length() {
    return sessionMap.size;
  },
  key: (i) => Array.from(sessionMap.keys())[i] || null,
};

const sampleProblem = {
  id: 'two_sum_test',
  title: 'Tổng Hai Số (Two Sum)',
  difficulty: 'Easy',
  points: 100,
  category: 'Mảng & Hash',
  tags: ['Array', 'Hash'],
  timeLimitMs: 1000,
  memoryLimitKb: 262144,
  statement: 'Cho mảng N số nguyên và target K. Tìm chỉ số 2 phần tử có tổng bằng K.',
  inputFormat: 'Dòng 1 chứa N, K. Dòng 2 chứa N số nguyên.',
  outputFormat: 'Hai chỉ số.',
  constraints: '1 <= N <= 10^5',
  samples: [{ input: '4 9\n2 7 11 15', output: '0 1' }],
};

test('1. vercel.json excludes /api/ routes from SPA catch-all rewrite', () => {
  const vercelRaw = fs.readFileSync(path.resolve('vercel.json'), 'utf-8');
  const vercelCfg = JSON.parse(vercelRaw);
  const rewrites = vercelCfg.rewrites || [];
  assert.ok(rewrites.length > 0, 'vercel.json must define rewrites');
  assert.ok(
    rewrites.some((r) => typeof r.source === 'string' && r.source.includes('(?!api/)')),
    'SPA catch-all rewrite must exclude /api/ via negative lookahead'
  );
});

test('2. API handler validates malformed JSON, missing fields, and oversized code', async () => {
  const badJsonRes = await handleAIMentorPost(
    new Request('http://localhost/api/ai-mentor', {
      method: 'POST',
      body: 'not-json',
    })
  );
  assert.equal(badJsonRes.status, 400);

  const missingFieldsRes = await handleAIMentorPost(
    new Request('http://localhost/api/ai-mentor', {
      method: 'POST',
      body: JSON.stringify({ problemId: 'x' }),
    })
  );
  assert.equal(missingFieldsRes.status, 400);

  const hugeCodeRes = await handleAIMentorPost(
    new Request('http://localhost/api/ai-mentor', {
      method: 'POST',
      body: JSON.stringify({
        problemId: 'p1',
        problemTitle: 'Test',
        problemStatement: 'Test',
        language: 'cpp20',
        code: 'a'.repeat(70000),
        mode: 'diagnose',
      }),
    }),
    { apiKey: 'dummy' }
  );
  assert.equal(hugeCodeRes.status, 413);
});

test('3. API handler returns structured 503 when GEMINI_API_KEY is missing', async () => {
  const prevKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    const res = await handleAIMentorPost(
      new Request('http://localhost/api/ai-mentor', {
        method: 'POST',
        body: JSON.stringify({
          problemId: 'p1',
          problemTitle: 'Two Sum',
          problemStatement: 'Find pair',
          language: 'py3',
          code: 'print(1)',
          mode: 'diagnose',
        }),
      }),
      { apiKey: '' }
    );
    assert.equal(res.status, 503);
    const json = await res.json();
    assert.equal(json.errorCode, 'MISSING_API_KEY');
  } finally {
    if (prevKey !== undefined) process.env.GEMINI_API_KEY = prevKey;
  }
});

test('4. Prompt builder targets exact selected programming language across all 5 languages', () => {
  for (const lang of ['c17', 'cpp20', 'py3', 'java', 'sql']) {
    const { systemInstruction, userPrompt } = buildMentorPrompt({
      problemId: sampleProblem.id,
      problemTitle: sampleProblem.title,
      problemStatement: sampleProblem.statement,
      language: lang,
      code: '// user draft',
      mode: 'approaches',
    });
    const label = resolveMentorTargetLanguage(lang);
    assert.ok(systemInstruction.includes(label), `System instruction must specify ${label}`);
    assert.ok(userPrompt.includes(`code key: ${lang}`), `Prompt must carry key ${lang}`);
  }
  assert.ok(AI_MENTOR_RESPONSE_SCHEMA.properties.approaches, 'Schema must enforce approaches array');
});

test('5. API handler parses Gemini Interactions response into strict structured JSON', async () => {
  const mockStructuredJson = JSON.stringify({
    verdictSummary: 'Thuật toán O(N^2) bị TLE với N = 10^5.',
    rootCause: 'Hai vòng lặp lồng nhau tốn 10^10 phép tính.',
    suspectedLine: 7,
    bugFixes: ['Dùng Hash Map (unordered_map) để giảm xuống O(N).'],
    approaches: [
      {
        approachName: 'Two Pointers sau khi sort',
        levelTag: 'Trực quan',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        explanation: 'Sắp xếp mảng giữ lại index gốc rồi dùng 2 con trỏ.',
        language: 'cpp20',
        code: '#include <iostream>\nint main() { return 0; }',
      },
      {
        approachName: 'Hash Map tối ưu',
        levelTag: 'Tối ưu',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        explanation: 'Lưu giá trị đã gặp vào unordered_map.',
        language: 'cpp20',
        code: '#include <unordered_map>\nint main() { return 0; }',
      },
    ],
    followUpTip: 'Luôn kiểm tra ràng buộc N <= 10^5 trước khi chọn O(N^2).',
  });

  let capturedModel = '';
  const res = await handleAIMentorPost(
    new Request('http://localhost/api/ai-mentor', {
      method: 'POST',
      body: JSON.stringify({
        problemId: sampleProblem.id,
        problemTitle: sampleProblem.title,
        problemStatement: sampleProblem.statement,
        language: 'cpp20',
        code: 'for(int i=0;i<n;i++) for(int j=i+1;j<n;j++);',
        verdict: 'TLE',
        mode: 'diagnose',
      }),
    }),
    {
      apiKey: 'mock-key',
      createInteraction: async ({ model }) => {
        capturedModel = model;
        return mockStructuredJson;
      },
    }
  );

  assert.equal(res.status, 200);
  assert.equal(capturedModel, 'gemini-4-hydrogen');
  const body = await res.json();
  assert.equal(body.source, 'gemini');
  assert.equal(body.modelUsed, 'gemini-4-hydrogen');
  assert.equal(body.approaches.length, 2);
  assert.equal(body.suspectedLine, 7);
});

test('6. aiMentorService caches Gemini hits in sessionStorage and falls back gracefully on 503', async () => {
  sessionStorage.clear();

  let fetchCount = 0;
  const mockGeminiFetch = async () => {
    fetchCount++;
    return new Response(
      JSON.stringify({
        verdictSummary: 'Cached OK',
        rootCause: 'None',
        suspectedLine: null,
        bugFixes: [],
        approaches: [
          {
            approachName: 'Python Dict',
            levelTag: 'Tối ưu',
            timeComplexity: 'O(N)',
            spaceComplexity: 'O(N)',
            explanation: 'Use dict.',
            language: 'py3',
            code: 'print(0, 1)',
          },
        ],
        followUpTip: 'Keep practicing.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  };

  const req = {
    problemId: sampleProblem.id,
    problemTitle: sampleProblem.title,
    problemStatement: sampleProblem.statement,
    language: 'py3',
    code: 'print("hello")',
    verdict: 'WA',
    mode: 'diagnose',
  };

  const first = await requestAIMentor(req, sampleProblem, { fetchImpl: mockGeminiFetch });
  const second = await requestAIMentor(req, sampleProblem, { fetchImpl: mockGeminiFetch });
  assert.equal(first.source, 'gemini');
  assert.equal(second.source, 'gemini');
  assert.equal(fetchCount, 1, 'Second identical call must read from sessionStorage cache');
  assert.ok(buildMentorCacheKey(req).includes('two_sum_test_py3'));

  // Test fallback when backend returns 503 for Java
  const javaReq = { ...req, language: 'java', code: 'public class Main {}' };
  const fallbackRes = await requestAIMentor(javaReq, sampleProblem, {
    fetchImpl: async () =>
      new Response(JSON.stringify({ message: 'Missing GEMINI_API_KEY' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }),
  });
  assert.equal(fallbackRes.source, 'fallback');
  assert.ok(fallbackRes.fallbackReason.includes('Missing GEMINI_API_KEY'));
  assert.equal(fallbackRes.approaches[0].language, 'java');
  assert.ok(fallbackRes.approaches[0].code.includes('public class Main'));
});

test('7. BYOK mechanism prioritizes x-gemini-api-key header over server env var', async () => {
  const prevEnv = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'server-fallback-key';

  try {
    let capturedKey = '';
    const res = await handleAIMentorPost(
      new Request('http://localhost/api/ai-mentor', {
        method: 'POST',
        headers: {
          'x-gemini-api-key': 'user-custom-byok-key',
        },
        body: JSON.stringify({
          mode: 'verify_key',
        }),
      }),
      {
        verifyKey: async ({ apiKey }) => {
          capturedKey = apiKey;
          return true;
        },
      }
    );

    assert.equal(res.status, 200);
    assert.equal(capturedKey, 'user-custom-byok-key', 'Header x-gemini-api-key must take priority over process.env');

    // Without header, falls back to server env
    let fallbackCapturedKey = '';
    const fallbackRes = await handleAIMentorPost(
      new Request('http://localhost/api/ai-mentor', {
        method: 'POST',
        body: JSON.stringify({
          mode: 'verify_key',
        }),
      }),
      {
        verifyKey: async ({ apiKey }) => {
          fallbackCapturedKey = apiKey;
          return true;
        },
      }
    );
    assert.equal(fallbackRes.status, 200);
    assert.equal(fallbackCapturedKey, 'server-fallback-key', 'Must fall back to process.env.GEMINI_API_KEY');
  } finally {
    if (prevEnv !== undefined) {
      process.env.GEMINI_API_KEY = prevEnv;
    } else {
      delete process.env.GEMINI_API_KEY;
    }
  }
});

test('8. Mode verify_key validates key and returns 400 when missing or 401 when invalid', async () => {
  const prevEnv = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  try {
    // 1. Missing key returns 400
    const noKeyRes = await handleAIMentorPost(
      new Request('http://localhost/api/ai-mentor', {
        method: 'POST',
        body: JSON.stringify({ mode: 'verify_key' }),
      }),
      { apiKey: '' }
    );
    assert.equal(noKeyRes.status, 400);
    const noKeyJson = await noKeyRes.json();
    assert.equal(noKeyJson.valid, false);

    // 2. Invalid key returns 401
    const invalidKeyRes = await handleAIMentorPost(
      new Request('http://localhost/api/ai-mentor', {
        method: 'POST',
        headers: { 'x-gemini-api-key': 'bad-key-123' },
        body: JSON.stringify({ mode: 'verify_key' }),
      }),
      {
        verifyKey: async () => false,
      }
    );
    assert.equal(invalidKeyRes.status, 401);
    const invalidJson = await invalidKeyRes.json();
    assert.equal(invalidJson.valid, false);

    // 3. Valid key returns 200 with modelUsed
    const validRes = await handleAIMentorPost(
      new Request('http://localhost/api/ai-mentor', {
        method: 'POST',
        headers: { 'x-gemini-api-key': 'good-key-xyz' },
        body: JSON.stringify({ mode: 'verify_key', model: 'gemini-3.5-flash-lite' }),
      }),
      {
        verifyKey: async () => true,
      }
    );
    assert.equal(validRes.status, 200);
    const validJson = await validRes.json();
    assert.equal(validJson.valid, true);
    assert.equal(validJson.modelUsed, 'gemini-3.5-flash-lite');
  } finally {
    if (prevEnv !== undefined) process.env.GEMINI_API_KEY = prevEnv;
  }
});

test('9. Model whitelist sanitizes model choice and defaults to gemini-4-hydrogen', async () => {
  assert.deepEqual(SUPPORTED_GEMINI_MODELS, [
    'gemini-3.5-flash-lite',
    'gemini-4-hydrogen',
    'gemini-4-argon',
  ]);

  assert.equal(resolveMentorModel('gemini-3.5-flash-lite'), 'gemini-3.5-flash-lite');
  assert.equal(resolveMentorModel('gemini-4-argon'), 'gemini-4-argon');
  assert.equal(resolveMentorModel('gemini-4-hydrogen'), 'gemini-4-hydrogen');

  // Deprecated or untrusted models must sanitize to default gemini-4-hydrogen
  assert.equal(resolveMentorModel('gemini-1.5-pro'), DEFAULT_GEMINI_MODEL);
  assert.equal(resolveMentorModel('gemini-2.5-pro'), DEFAULT_GEMINI_MODEL);
  assert.equal(resolveMentorModel('gpt-4o'), DEFAULT_GEMINI_MODEL);
  assert.equal(resolveMentorModel(null), DEFAULT_GEMINI_MODEL);
  assert.equal(resolveMentorModel(undefined), DEFAULT_GEMINI_MODEL);

  let calledModel = '';
  await handleAIMentorPost(
    new Request('http://localhost/api/ai-mentor', {
      method: 'POST',
      body: JSON.stringify({
        problemId: 'p1',
        problemTitle: 'Title',
        problemStatement: 'Stmt',
        language: 'cpp20',
        code: 'int main(){}',
        mode: 'diagnose',
        model: 'gemini-4-argon',
      }),
    }),
    {
      apiKey: 'test-key',
      createInteraction: async ({ model }) => {
        calledModel = model;
        return JSON.stringify({
          verdictSummary: 'OK',
          rootCause: 'None',
          suspectedLine: null,
          bugFixes: [],
          approaches: [],
          followUpTip: 'Tip',
        });
      },
    }
  );
  assert.equal(calledModel, 'gemini-4-argon');
});

test('10. Stateful memory sends previous_interaction_id with store: true and returns interactionId', async () => {
  let passedPreviousId = null;
  let passedStore = null;

  const res = await handleAIMentorPost(
    new Request('http://localhost/api/ai-mentor', {
      method: 'POST',
      headers: {
        'x-gemini-api-key': 'mock-byok-key',
      },
      body: JSON.stringify({
        problemId: 'p1',
        problemTitle: 'Title',
        problemStatement: 'Stmt',
        language: 'py3',
        code: 'print(1)',
        mode: 'ask',
        userQuestion: 'Làm sao để tối ưu?',
        previousInteractionId: 'interaction_turn_1_abc',
      }),
    }),
    {
      createInteraction: async ({ previousInteractionId, store }) => {
        passedPreviousId = previousInteractionId;
        passedStore = store;
        return {
          outputText: JSON.stringify({
            verdictSummary: 'Tư vấn vòng 2',
            rootCause: 'None',
            suspectedLine: null,
            bugFixes: [],
            approaches: [],
            followUpTip: 'Tiếp tục luyện tập',
          }),
          interactionId: 'interaction_turn_2_def',
        };
      },
    }
  );

  assert.equal(res.status, 200);
  assert.equal(passedPreviousId, 'interaction_turn_1_abc');
  assert.equal(passedStore, true);

  const json = await res.json();
  assert.equal(json.interactionId, 'interaction_turn_2_def');
  assert.equal(json.verdictSummary, 'Tư vấn vòng 2');
});

test('11. GET /api/ai-mentor exposes supported models, default model, and BYOK capabilities', async () => {
  const res = await GET();
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.status, 'ok');
  assert.equal(json.defaultModel, 'gemini-4-hydrogen');
  assert.ok(Array.isArray(json.supportedModels));
  assert.ok(json.supportedModels.includes('gemini-3.5-flash-lite'));
  assert.ok(json.supportedModels.includes('gemini-4-hydrogen'));
  assert.ok(json.supportedModels.includes('gemini-4-argon'));
  assert.equal(json.features.byokHeader, 'x-gemini-api-key');
  assert.equal(json.features.statefulMemory, true);
  assert.equal(json.features.verifyKeyMode, true);
});
