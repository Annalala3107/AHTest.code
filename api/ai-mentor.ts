import { GoogleGenAI } from '@google/genai';
import {
  SUPPORTED_GEMINI_MODELS,
  type AIMentorMode,
  type AIMentorRequest,
  type AIMentorResponse,
  type AIMentorVerifyKeyResponse,
  type SupportedGeminiModel,
} from '../src/types/index.ts';

export { SUPPORTED_GEMINI_MODELS };
export type { SupportedGeminiModel };

const MAX_CODE_CHARS = 65536;
export const DEFAULT_GEMINI_MODEL: SupportedGeminiModel = 'gemini-4-hydrogen';

export function resolveMentorModel(candidate?: string | null): SupportedGeminiModel {
  if (candidate && (SUPPORTED_GEMINI_MODELS as readonly string[]).includes(candidate)) {
    return candidate as SupportedGeminiModel;
  }
  return DEFAULT_GEMINI_MODEL;
}

const TARGET_LANGUAGE_LABELS: Record<string, string> = {
  c: 'C (GCC 11.4 / C17)',
  c17: 'C (GCC 11.4 / C17)',
  cpp: 'C++20 (G++ 13)',
  cpp17: 'C++17 (G++ 11)',
  cpp20: 'C++20 (G++ 13)',
  py3: 'Python 3.11',
  python: 'Python 3.11',
  java: 'Java 21 (OpenJDK - dùng class Main)',
  sql: 'PostgreSQL 16 (SQL chuẩn DDL/DML/DQL)',
};

export function resolveMentorTargetLanguage(language: string): string {
  const key = (language || 'cpp20').toLowerCase().trim();
  return TARGET_LANGUAGE_LABELS[key] || `${language.toUpperCase()}`;
}

export const AI_MENTOR_RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'verdictSummary',
    'rootCause',
    'suspectedLine',
    'bugFixes',
    'approaches',
    'followUpTip',
  ],
  properties: {
    verdictSummary: {
      type: 'string',
      description: 'Tóm tắt 1-2 câu về trạng thái bài làm hiện tại bằng tiếng Việt.',
    },
    rootCause: {
      type: 'string',
      description: 'Phân tích sư phạm nguyên nhân gốc rễ gây sai/chậm hoặc đánh giá thuật toán hiện tại bằng tiếng Việt.',
    },
    suspectedLine: {
      type: ['integer', 'null'],
      description: 'Số dòng nghi ngờ có lỗi trong code của học viên (1-indexed), hoặc null nếu không xác định.',
    },
    bugFixes: {
      type: 'array',
      items: { type: 'string' },
      description: 'Danh sách 2-4 điểm cụ thể cần sửa hoặc cải tiến.',
    },
    approaches: {
      type: 'array',
      minItems: 1,
      maxItems: 3,
      description: 'Từ 2 đến 3 phương án giải khác nhau viết đúng ngôn ngữ mục tiêu đang chọn.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'approachName',
          'levelTag',
          'timeComplexity',
          'spaceComplexity',
          'explanation',
          'language',
          'code',
        ],
        properties: {
          approachName: {
            type: 'string',
            description: 'Tên ngắn gọn của phương án (ví dụ: Quy hoạch động tối ưu O(N)).',
          },
          levelTag: {
            type: 'string',
            description: 'Nhãn cấp độ: "Trực quan", "Tối ưu", hoặc "Chuẩn thư viện".',
          },
          timeComplexity: {
            type: 'string',
            description: 'Độ phức tạp thời gian, ví dụ: O(N log N).',
          },
          spaceComplexity: {
            type: 'string',
            description: 'Độ phức tạp không gian, ví dụ: O(N).',
          },
          explanation: {
            type: 'string',
            description: 'Giải thích tư duy giải thuật của phương án này bằng tiếng Việt.',
          },
          language: {
            type: 'string',
            description: 'Mã ngôn ngữ đúng theo ngôn ngữ đang chọn trên IDE.',
          },
          code: {
            type: 'string',
            description: 'Mã nguồn hoàn chỉnh, sạch, có thể chạy ngay bằng đúng ngôn ngữ mục tiêu.',
          },
        },
      },
    },
    followUpTip: {
      type: 'string',
      description: 'Một lời khuyên ngắn gọn để học viên luyện tập tốt hơn sau bài này.',
    },
  },
};

export function buildMentorPrompt(payload: AIMentorRequest): {
  systemInstruction: string;
  userPrompt: string;
} {
  const targetLangLabel = resolveMentorTargetLanguage(payload.language);
  const mode: AIMentorMode = payload.mode || 'diagnose';

  const systemInstruction = [
    'Bạn là Trợ lý AI Mentor chuyên sâu về Lập trình Thi đấu (Competitive Programming) và Giảng dạy Khoa học Máy tính trên nền tảng AHtest.code.',
    'Quy tắc bắt buộc:',
    '1. Trả lời bằng tiếng Việt rõ ràng, chính xác về mặt thuật toán và mang tính sư phạm cao.',
    `2. MỌI mã nguồn mẫu trong mảng "approaches" BẮT BUỘC phải được viết bằng đúng ngôn ngữ mục tiêu: ${targetLangLabel} (trường "language" đặt giá trị "${payload.language}"). TUYỆT ĐỐI KHÔNG trả về ngôn ngữ khác.`,
    '3. Với C/C++, chú ý tràn số nguyên (dùng long long khi cần), null-terminator với chuỗi char, và đọc/ghi I/O chuẩn.',
    '4. Với Java 21, luôn đặt code trong `public class Main` với `public static void main(String[] args)`.',
    '5. Với SQL, tuân thủ PostgreSQL chuẩn (SELECT/WHERE/JOIN/GROUP BY).',
    '6. Luôn cung cấp ít nhất 2 phương án code (từ Cách 1: Trực quan/Dễ hiểu đến Cách 2: Tối ưu thuật toán) kèm độ phức tạp Big-O.',
  ].join('\n');

  const safeStatement = (payload.problemStatement || '').slice(0, 4000);
  const safeCode = (payload.code || '').slice(0, 12000);

  const modeDirective =
    mode === 'approaches'
      ? 'YÊU CẦU CHÍNH: Hãy phân tích bài toán và đề xuất 2-3 phương án giải khác nhau (từ trực quan đến tối ưu nhất) viết bằng đúng ngôn ngữ đang chọn.'
      : mode === 'ask'
      ? `YÊU CẦU CHÍNH: Hãy trả lời câu hỏi cụ thể của học viên: "${(payload.userQuestion || '').slice(0, 800)}" dựa trên ngữ cảnh bài toán và code hiện tại, đồng thời đưa ra phương án sửa/code phù hợp.`
      : 'YÊU CẦU CHÍNH: Hãy chẩn đoán nguyên nhân lỗi gốc rễ trong code hiện tại của học viên (dựa vào verdict và diff nếu có), chỉ ra dòng nghi ngờ và đề xuất 2 phương án code sửa/tối ưu bằng đúng ngôn ngữ đang chọn.';

  const failedBlock = payload.failedCase
    ? [
        '--- CHI TIẾT TEST BỊ LỖI / KẾT QUẢ CHẠY ---',
        `Input: ${(payload.failedCase.input || '(rỗng)').slice(0, 600)}`,
        `Output thực tế / Stderr: ${(payload.failedCase.actualOutput || '(rỗng)').slice(0, 1000)}`,
        `Output kỳ vọng: ${(payload.failedCase.expectedOutput || '(không có)').slice(0, 600)}`,
      ].join('\n')
    : '';

  const userPrompt = [
    modeDirective,
    '',
    `=== ĐỀ BÀI: ${payload.problemTitle} (ID: ${payload.problemId}) ===`,
    safeStatement,
    payload.inputFormat ? `Input format: ${payload.inputFormat.slice(0, 600)}` : '',
    payload.outputFormat ? `Output format: ${payload.outputFormat.slice(0, 600)}` : '',
    payload.constraints ? `Constraints: ${payload.constraints.slice(0, 600)}` : '',
    '',
    `=== NGÔN NGỮ ĐANG CHỌN: ${targetLangLabel} (code key: ${payload.language}) ===`,
    `Verdict hiện tại: ${payload.verdict || 'Chưa chấm'}`,
    '',
    '=== CODE HIỆN TẠI CỦA HỌC VIÊN ===',
    safeCode || '(Học viên chưa viết code)',
    '',
    failedBlock,
  ]
    .filter(Boolean)
    .join('\n');

  return { systemInstruction, userPrompt };
}

function isValidMentorRequest(body: unknown): body is AIMentorRequest {
  if (!body || typeof body !== 'object') return false;
  const candidate = body as Record<string, unknown>;
  return (
    typeof candidate.problemId === 'string' &&
    typeof candidate.problemTitle === 'string' &&
    typeof candidate.language === 'string' &&
    typeof candidate.code === 'string'
  );
}

export interface MentorApiDependencies {
  apiKey?: string;
  createInteraction?: (params: {
    model: string;
    systemInstruction: string;
    userPrompt: string;
    previousInteractionId?: string;
    store?: boolean;
  }) => Promise<string | { outputText: string | null; interactionId?: string } | null>;
  verifyKey?: (params: { apiKey: string; model: string }) => Promise<boolean>;
}

function resolveEffectiveApiKey(request: Request, deps: MentorApiDependencies): string {
  const clientHeader = request.headers.get('x-gemini-api-key')?.trim();
  if (clientHeader) return clientHeader;
  if (deps.apiKey?.trim()) return deps.apiKey.trim();
  return (process.env.GEMINI_API_KEY || '').trim();
}

async function handleVerifyKeyMode(
  request: Request,
  body: { mode: 'verify_key'; model?: string },
  deps: MentorApiDependencies
): Promise<Response> {
  const apiKey = resolveEffectiveApiKey(request, deps);
  const selectedModel = resolveMentorModel(body.model);

  if (!apiKey && !deps.verifyKey && !deps.createInteraction) {
    const errorPayload: AIMentorVerifyKeyResponse = {
      status: 'error',
      valid: false,
      message: 'Chưa cung cấp Gemini API key (qua header x-gemini-api-key hoặc biến môi trường server).',
    };
    return Response.json(errorPayload, { status: 400 });
  }

  try {
    if (deps.verifyKey) {
      const isValid = await deps.verifyKey({ apiKey, model: selectedModel });
      if (!isValid) {
        const errorPayload: AIMentorVerifyKeyResponse = {
          status: 'error',
          valid: false,
          message: 'API key không hợp lệ hoặc đã hết hạn.',
        };
        return Response.json(errorPayload, { status: 401 });
      }
    } else if (deps.createInteraction) {
      await deps.createInteraction({
        model: selectedModel,
        systemInstruction: '',
        userPrompt: 'PING',
        store: false,
      });
    } else {
      const client = new GoogleGenAI({ apiKey });
      await client.interactions.create({
        model: selectedModel,
        input: 'PING',
        store: false,
        generation_config: {
          max_output_tokens: 5,
        },
      });
    }

    const successPayload: AIMentorVerifyKeyResponse = {
      status: 'ok',
      valid: true,
      modelUsed: selectedModel,
    };
    return Response.json(successPayload, { status: 200 });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'API key không hợp lệ hoặc đã hết hạn.';
    const errorPayload: AIMentorVerifyKeyResponse = {
      status: 'error',
      valid: false,
      message: errMsg,
    };
    return Response.json(errorPayload, { status: 401 });
  }
}

export async function handleAIMentorPost(
  request: Request,
  deps: MentorApiDependencies = {}
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { errorCode: 'INVALID_JSON', message: 'Dữ liệu gửi lên không phải JSON hợp lệ.' },
      { status: 400 }
    );
  }

  // 1. Kiểm tra mode verify_key độc lập (BYOK verification)
  if (
    typeof body === 'object' &&
    body !== null &&
    (body as { mode?: string }).mode === 'verify_key'
  ) {
    return handleVerifyKeyMode(
      request,
      body as { mode: 'verify_key'; model?: string },
      deps
    );
  }

  // 2. Validate payload cho các mode phân tích thường (diagnose, approaches, ask)
  if (!isValidMentorRequest(body)) {
    return Response.json(
      {
        errorCode: 'BAD_REQUEST',
        message: 'Thiếu trường bắt buộc (problemId, problemTitle, language, code).',
      },
      { status: 400 }
    );
  }

  if (body.code.length > MAX_CODE_CHARS) {
    return Response.json(
      {
        errorCode: 'CODE_TOO_LARGE',
        message: `Mã nguồn vượt quá giới hạn tối đa ${MAX_CODE_CHARS.toLocaleString('vi-VN')} ký tự.`,
      },
      { status: 413 }
    );
  }

  // 3. Cơ chế BYOK: ưu tiên header x-gemini-api-key, fallback về deps / process.env
  const apiKey = resolveEffectiveApiKey(request, deps);
  if (!apiKey && !deps.createInteraction) {
    return Response.json(
      {
        errorCode: 'MISSING_API_KEY',
        message:
          'Chưa cấu hình GEMINI_API_KEY. Hãy cung cấp API key cá nhân (BYOK) hoặc thêm biến GEMINI_API_KEY trên server.',
      },
      { status: 503 }
    );
  }

  // 4. Whitelist model selection
  const selectedModel = resolveMentorModel(body.model);

  // 5. Stateful memory: previousInteractionId
  const previousInteractionId =
    typeof body.previousInteractionId === 'string' && body.previousInteractionId.trim()
      ? body.previousInteractionId.trim()
      : undefined;

  const { systemInstruction, userPrompt } = buildMentorPrompt(body);

  try {
    let rawOutputText: string | null = null;
    let interactionId: string | undefined = undefined;

    if (deps.createInteraction) {
      const interactionResult = await deps.createInteraction({
        model: selectedModel,
        systemInstruction,
        userPrompt,
        previousInteractionId,
        store: true,
      });

      if (typeof interactionResult === 'string') {
        rawOutputText = interactionResult;
      } else if (interactionResult && typeof interactionResult === 'object') {
        rawOutputText = interactionResult.outputText ?? null;
        interactionId = interactionResult.interactionId;
      }
    } else {
      const client = new GoogleGenAI({ apiKey });
      const interaction = await client.interactions.create({
        model: selectedModel,
        system_instruction: systemInstruction,
        input: userPrompt,
        store: true,
        previous_interaction_id: previousInteractionId,
        generation_config: {
          thinking_level: 'low',
          max_output_tokens: 32768,
        },
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: AI_MENTOR_RESPONSE_SCHEMA,
        },
      });
      rawOutputText = interaction.output_text ?? null;
      interactionId = interaction.id;
    }

    if (!rawOutputText) {
      return Response.json(
        {
          errorCode: 'EMPTY_AI_RESPONSE',
          message: 'Gemini API không trả về nội dung phân tích.',
        },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(rawOutputText) as AIMentorResponse;
    const responsePayload: AIMentorResponse = {
      verdictSummary: parsed.verdictSummary || 'Đã hoàn tất phân tích bài làm.',
      rootCause: parsed.rootCause || 'Không phát hiện lỗi nghiêm trọng.',
      suspectedLine: typeof parsed.suspectedLine === 'number' ? parsed.suspectedLine : null,
      bugFixes: Array.isArray(parsed.bugFixes) ? parsed.bugFixes : [],
      approaches: Array.isArray(parsed.approaches)
        ? parsed.approaches.map((app) => ({
            ...app,
            language: body.language,
          }))
        : [],
      followUpTip: parsed.followUpTip || '',
      source: 'gemini',
      modelUsed: selectedModel,
      interactionId,
    };

    return Response.json(responsePayload, { status: 200 });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'Lỗi không xác định khi gọi Gemini API.';
    return Response.json(
      {
        errorCode: 'GEMINI_UPSTREAM_ERROR',
        message: errMsg,
      },
      { status: 502 }
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  return handleAIMentorPost(request);
}

export async function GET(): Promise<Response> {
  return Response.json(
    {
      status: 'ok',
      endpoint: '/api/ai-mentor',
      configured: Boolean((process.env.GEMINI_API_KEY || '').trim()),
      defaultModel: DEFAULT_GEMINI_MODEL,
      supportedModels: SUPPORTED_GEMINI_MODELS,
      features: {
        byokHeader: 'x-gemini-api-key',
        statefulMemory: true,
        verifyKeyMode: true,
      },
    },
    { status: 200 }
  );
}
