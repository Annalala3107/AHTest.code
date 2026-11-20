import type {
  AIMentorApproach,
  AIMentorRequest,
  AIMentorResponse,
  Problem,
  TestResult,
} from '../types/index.ts';
import {
  generatePedagogicalDiagnosis,
  LANGUAGE_LABELS,
} from './executionManager.ts';
import { resolveProgressiveHints } from './progressiveHintService.ts';

const CACHE_PREFIX = 'ahtest_ai_mentor_v1_';

function simpleStringHash(str: string): string {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function buildMentorCacheKey(req: AIMentorRequest): string {
  const raw = [
    req.problemId,
    req.language,
    req.mode,
    req.verdict || '',
    req.userQuestion || '',
    req.failedCase?.actualOutput || '',
    req.code,
  ].join('|');
  return `${CACHE_PREFIX}${req.problemId}_${req.language}_${simpleStringHash(raw)}`;
}

function readSessionCache(key: string): AIMentorResponse | null {
  try {
    if (typeof sessionStorage === 'undefined') return null;
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as AIMentorResponse;
  } catch {
    return null;
  }
}

function writeSessionCache(key: string, data: AIMentorResponse): void {
  try {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore storage quota errors
  }
}

function buildLanguageSpecificScaffold(language: string, problem: Problem): AIMentorApproach[] {
  const langKey = (language || 'cpp20').toLowerCase();
  const sampleIn = problem.samples?.[0]?.input?.trim() || '1';
  const hints = resolveProgressiveHints(problem);
  const tier3Code = (hints[2]?.content || '').replace(/\\`/g, '`');

  if (langKey === 'py3' || langKey === 'python') {
    return [
      {
        approachName: 'Python 3 - Đọc nhanh & Xử lý trực tiếp',
        levelTag: 'Trực quan',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        explanation: `Sử dụng sys.stdin / input() đọc dữ liệu chuẩn hóa theo mẫu "${sampleIn.slice(0, 30)}", tách token bằng split() và in kết quả sạch.`,
        language,
        code: [
          'import sys',
          '',
          'def solve():',
          '    data = sys.stdin.read().split()',
          '    if not data:',
          '        return',
          '    # TODO: Áp dụng logic bài toán tại đây',
          '    print(data[0])',
          '',
          'if __name__ == "__main__":',
          '    solve()',
        ].join('\n'),
      },
    ];
  }

  if (langKey === 'java') {
    return [
      {
        approachName: 'Java 21 - Scanner & Cấu trúc chuẩn Main',
        levelTag: 'Trực quan',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        explanation: 'Sử dụng Scanner đọc dữ liệu đầu vào trong class Main, xử lý logic an toàn tránh tràn số với kiểu long.',
        language,
        code: [
          'import java.util.*;',
          '',
          'public class Main {',
          '    public static void main(String[] args) {',
          '        Scanner sc = new Scanner(System.in);',
          '        if (!sc.hasNext()) return;',
          '        // TODO: Đọc dữ liệu và cài đặt thuật toán',
          '        System.out.println(sc.next());',
          '    }',
          '}',
        ].join('\n'),
      },
    ];
  }

  if (langKey === 'sql') {
    return [
      {
        approachName: 'PostgreSQL 16 - Truy vấn lọc & Sắp xếp chuẩn',
        levelTag: 'Chuẩn thư viện',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        explanation: 'Dùng SELECT kết hợp WHERE lọc điều kiện, GROUP BY tổng hợp nếu cần và ORDER BY sắp xếp kết quả.',
        language,
        code: [
          '-- Kiểm tra kỹ tên bảng và tên cột theo đề bài',
          'SELECT *',
          'FROM students',
          '-- WHERE ...',
          '-- ORDER BY ... DESC;',
        ].join('\n'),
      },
    ];
  }

  if (langKey.startsWith('cpp')) {
    return [
      {
        approachName: 'C++20 - Fast I/O & STL Vector/Algorithm',
        levelTag: 'Tối ưu',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        explanation:
          'Bật Fast I/O (`ios::sync_with_stdio(false)`), ưu tiên `vector`, `long long` để tránh tràn số và `std::sort` của STL.',
        language,
        code: [
          '#include <iostream>',
          '#include <vector>',
          '#include <algorithm>',
          'using namespace std;',
          '',
          'int main() {',
          '    ios::sync_with_stdio(false);',
          '    cin.tie(nullptr);',
          '    // TODO: Đọc input và cài đặt thuật toán tối ưu',
          '    return 0;',
          '}',
        ].join('\n'),
      },
    ];
  }

  return [
    {
      approachName: 'C17 - Khung giải thuật chuẩn GCC 11.4',
      levelTag: 'Trực quan',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      explanation: hints[0]?.content || 'Đọc input chuẩn bằng scanf/fgets, xử lý an toàn biên mảng và in kết quả.',
      language,
      code:
        tier3Code ||
        [
          '#include <stdio.h>',
          '',
          'int main() {',
          '    // TODO: Đọc input và in kết quả chính xác',
          '    return 0;',
          '}',
        ].join('\n'),
    },
  ];
}

export function buildLocalMentorFallback(
  req: AIMentorRequest,
  problem: Problem,
  fallbackReason: string
): AIMentorResponse {
  const verdict = req.verdict || null;
  const actual = req.failedCase?.actualOutput || '';
  const staticDiag =
    verdict === 'CE' || verdict === 'TLE' || verdict === 'RTE'
      ? generatePedagogicalDiagnosis(verdict, actual, req.code)
      : null;
  const hints = resolveProgressiveHints(problem);
  const langLabel = LANGUAGE_LABELS[req.language] || req.language.toUpperCase();

  const bugFixes: string[] = [];
  if (staticDiag?.suggestion) {
    bugFixes.push(staticDiag.suggestion);
  }
  if (hints[1]?.content) {
    bugFixes.push(`Bẫy thường gặp: ${hints[1].content.split('\n')[0]}`);
  }
  if (bugFixes.length === 0) {
    bugFixes.push(`Kiểm tra lại định dạng nhập/xuất của ngôn ngữ ${langLabel} và các trường hợp biên (N nhỏ nhất/lớn nhất).`);
  }

  return {
    verdictSummary: staticDiag
      ? `[Chẩn đoán cục bộ] ${staticDiag.title}`
      : `Phân tích cục bộ cho bài "${req.problemTitle}" bằng ngôn ngữ ${langLabel}`,
    rootCause:
      staticDiag?.explanation ||
      hints[0]?.content ||
      'Chưa kết nối được tới Gemini API trực tiếp, hệ thống đang hiển thị phân tích sư phạm cục bộ.',
    suspectedLine: null,
    bugFixes,
    approaches: buildLanguageSpecificScaffold(req.language, problem),
    followUpTip:
      req.mode === 'ask' && req.userQuestion
        ? `Để AI trả lời chi tiết câu hỏi "${req.userQuestion}", hãy bật GEMINI_API_KEY trên server.`
        : 'Kiểm tra kết quả chạy mẫu (F9) trước khi nộp toàn bộ testcase ẩn.',
    source: 'fallback',
    fallbackReason,
  };
}

export interface RequestMentorOptions {
  skipCache?: boolean;
  fetchImpl?: typeof fetch;
}

export function buildMentorRequestFromContext(params: {
  problem: Problem;
  selectedLang: string;
  code: string;
  verdict: AIMentorRequest['verdict'];
  testResults: TestResult[];
  customInput: string;
  customOutput: string;
  customExpected: string;
  mode: AIMentorRequest['mode'];
  userQuestion?: string;
}): AIMentorRequest {
  const firstFailed = params.testResults.find((r) => !r.passed);
  const isSampleName =
    firstFailed?.name?.toLowerCase().includes('mẫu') ||
    firstFailed?.name?.toLowerCase().includes('sample');
  const failedCase = firstFailed
    ? {
        input: isSampleName
          ? params.problem.samples?.[0]?.input || ''
          : '(Test ẩn - chỉ gửi đầu ra lỗi)',
        actualOutput: firstFailed.actualOutput || '',
        expectedOutput: isSampleName ? firstFailed.expectedOutput || '' : '(Ẩn)',
      }
    : params.customOutput
    ? {
        input: params.customInput,
        actualOutput: params.customOutput,
        expectedOutput: params.customExpected,
      }
    : undefined;

  return {
    problemId: params.problem.id,
    problemTitle: params.problem.title,
    problemStatement: params.problem.statement,
    inputFormat: params.problem.inputFormat,
    outputFormat: params.problem.outputFormat,
    constraints: params.problem.constraints,
    language: params.selectedLang,
    code: params.code,
    verdict: params.verdict,
    failedCase,
    mode: params.mode,
    userQuestion: params.userQuestion,
  };
}

export async function requestAIMentor(
  req: AIMentorRequest,
  problem: Problem,
  options: RequestMentorOptions = {}
): Promise<AIMentorResponse> {
  const cacheKey = buildMentorCacheKey(req);
  if (!options.skipCache) {
    const cached = readSessionCache(cacheKey);
    if (cached && cached.source === 'gemini') {
      return cached;
    }
  }

  const fetchFn = options.fetchImpl || fetch;

  try {
    const response = await fetchFn('/api/ai-mentor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return buildLocalMentorFallback(
        req,
        problem,
        'Môi trường hiện tại (Vite dev thuần) chưa chạy Vercel Serverless Function `/api/ai-mentor`. Hãy dùng `npx vercel dev` hoặc deploy lên Vercel.'
      );
    }

    const body = await response.json();
    if (!response.ok) {
      const msg =
        (body && typeof body.message === 'string' && body.message) ||
        `Server trả về mã ${response.status}`;
      return buildLocalMentorFallback(req, problem, msg);
    }

    const result: AIMentorResponse = {
      ...(body as AIMentorResponse),
      source: 'gemini',
    };

    writeSessionCache(cacheKey, result);
    return result;
  } catch (err: unknown) {
    const reason =
      err instanceof Error ? err.message : 'Không thể kết nối tới Serverless Function `/api/ai-mentor`.';
    return buildLocalMentorFallback(req, problem, reason);
  }
}
