import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Columns2, 
  Rows2, 
  Copy, 
  Check,
  Terminal,
  FileCode2,
  Binary
} from 'lucide-react';

interface DiffViewerProps {
  actual: string;
  expected: string;
  title?: string;
  testId?: number | string;
  input?: string;
  className?: string;
}

interface DiagnosisResult {
  hasIssue: boolean;
  type: 'trailing-space' | 'missing-newline' | 'case-mismatch' | 'precision-mismatch' | 'line-count-mismatch' | 'null-terminator' | 'general';
  message: string;
  recommendation: string;
}

// Diagnose the top classical student pitfalls
function diagnoseDiff(actual: string, expected: string): DiagnosisResult {
  const normActual = actual.replace(/\r\n/g, '\n');
  const normExpected = expected.replace(/\r\n/g, '\n');

  if (normActual === normExpected) {
    return {
      hasIssue: false,
      type: 'general',
      message: 'Kết quả hoàn toàn trùng khớp 100%!',
      recommendation: 'Không có lỗi sai.'
    };
  }

  // 0. Null-Terminator & Garbage Byte Pitfall in C strings
  // eslint-disable-next-line no-control-regex
  const hasGarbageChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFFFD]/.test(actual);
  const isExpectedPrefixPlusGarbage = normActual.startsWith(normExpected) && normActual.length > normExpected.length && normActual.length <= normExpected.length + 30;

  if (hasGarbageChars || isExpectedPrefixPlusGarbage) {
    return {
      hasIssue: true,
      type: 'null-terminator',
      message: 'Bẫy Thiếu Ký Tự Null \'\\0\' hoặc Rác Bộ Nhớ (Garbage Values Detected)',
      recommendation: 'Trong C, chuỗi bắt buộc phải kết thúc bằng ký tự rỗng \'\\0\' (ASCII 0). Nếu bạn duyệt mảng char hoặc copy chuỗi mà quên str[len] = \'\\0\';, hàm printf("%s") sẽ in tràn sang các byte rác kế tiếp trong RAM. Hãy bấm nút "Soi Byte (\\0)" ở trên để xem chi tiết từng ô nhớ.'
    };
  }

  // 1. Trailing whitespace pitfall
  const actualLines = normActual.split('\n');
  const expectedLines = normExpected.split('\n');
  const actualTrimmedLines = actualLines.map(l => l.trimEnd());
  const expectedTrimmedLines = expectedLines.map(l => l.trimEnd());

  if (actualTrimmedLines.join('\n') === expectedTrimmedLines.join('\n')) {
    return {
      hasIssue: true,
      type: 'trailing-space',
      message: 'Lỗi khoảng trắng ẩn ở cuối dòng (Trailing Whitespace)',
      recommendation: 'Chữ số và nội dung hiển thị của bạn đã đúng, nhưng có dấu cách thừa (space) ở cuối một hoặc nhiều dòng. Hãy kiểm tra lại vòng lặp in dấu cách.'
    };
  }

  // 2. Missing final newline pitfall
  if (normActual.trim() === normExpected.trim()) {
    if (normExpected.endsWith('\n') && !normActual.endsWith('\n')) {
      return {
        hasIssue: true,
        type: 'missing-newline',
        message: 'Thiếu ký tự xuống dòng ở cuối file (Missing \\n)',
        recommendation: 'Kết quả in đúng nhưng thiếu ký tự xuống dòng `\\n` ở cuối cùng. Hãy thêm `\\n` vào câu lệnh printf() hoặc cout.'
      };
    }
    if (!normExpected.endsWith('\n') && normActual.endsWith('\n')) {
      return {
        hasIssue: true,
        type: 'missing-newline',
        message: 'Thừa ký tự xuống dòng ở cuối file',
        recommendation: 'Bạn in thừa một ký tự xuống dòng `\\n` không cần thiết ở cuối.'
      };
    }
  }

  // 3. Case sensitivity pitfall
  if (normActual.toLowerCase() === normExpected.toLowerCase()) {
    return {
      hasIssue: true,
      type: 'case-mismatch',
      message: 'Lệch chữ HOA / chữ thường (Case Sensitive)',
      recommendation: 'Trình chấm phân biệt chính xác chữ hoa và chữ thường (ví dụ: "True" khác "TRUE", "Passed" khác "passed"). Hãy kiểm tra kỹ đề bài.'
    };
  }

  // 4. Line count mismatch
  if (actualLines.length !== expectedLines.length) {
    return {
      hasIssue: true,
      type: 'line-count-mismatch',
      message: `Lệch số lượng dòng (Bạn in ${actualLines.length} dòng, đề bài yêu cầu ${expectedLines.length} dòng)`,
      recommendation: 'Kiểm tra lại số lần gọi lệnh xuống dòng hoặc vòng lặp in nhiều hơn/ít hơn số dòng quy định.'
    };
  }

  // 5. Floating point precision
  const numRegex = /^-?\d+(\.\d+)?$/;
  if (actualLines.length === 1 && expectedLines.length === 1) {
    const act = actualLines[0].trim();
    const exp = expectedLines[0].trim();
    if (numRegex.test(act) && numRegex.test(exp) && Math.abs(parseFloat(act) - parseFloat(exp)) < 1e-4) {
      return {
        hasIssue: true,
        type: 'precision-mismatch',
        message: 'Lệch định dạng số chữ số thập phân (Precision Mismatch)',
        recommendation: `Giá trị tính toán đúng, nhưng định dạng in sai. Đề bài yêu cầu "${exp}" nhưng bạn in "${act}". Hãy dùng định dạng printf("%.2f") hoặc cout << fixed << setprecision(...).`
      };
    }
  }

  return {
    hasIssue: true,
    type: 'general',
    message: 'Nội dung kết quả không khớp với tiêu chuẩn kiểm thử',
    recommendation: 'So sánh từng dòng bên dưới để phát hiện điểm lệch thuật toán hoặc định dạng.'
  };
}

// Convert invisible whitespace into visible glyphs
function renderVisibleWhitespace(text: string, showHidden: boolean): string {
  if (!showHidden) return text;
  return text
    .replace(/ /g, '·')
    .replace(/\t/g, '⇥   ')
    .replace(/\r/g, '␍')
    .replace(/\n/g, '↵\n');
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  actual,
  expected,
  title = 'So sánh Chi tiết Output (Diff Inspector)',
  testId,
  input,
  className = ''
}) => {
  const [showWhitespace, setShowWhitespace] = useState<boolean>(true);
  const [showNullInspector, setShowNullInspector] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [copiedType, setCopiedType] = useState<'actual' | 'expected' | null>(null);

  const diagnosis = diagnoseDiff(actual, expected);

  const handleCopy = (text: string, type: 'actual' | 'expected') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const actualLines = actual.replace(/\r\n/g, '\n').split('\n');
  const expectedLines = expected.replace(/\r\n/g, '\n').split('\n');
  const maxLines = Math.max(actualLines.length, expectedLines.length);

  return (
    <div className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm ${className}`}>
      {/* Header Bar */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-rose-500" />
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {title} {testId !== undefined && <span className="text-rose-600 dark:text-rose-400">#{testId}</span>}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
            diagnosis.hasIssue 
              ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900' 
              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
          }`}>
            {diagnosis.hasIssue ? 'Wrong Answer (WA)' : 'Matched (AC)'}
          </span>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          {/* Toggle Null-Terminator Byte Inspector */}
          <button
            onClick={() => setShowNullInspector(!showNullInspector)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              showNullInspector
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
            title="Soi từng byte bộ nhớ RAM và ký tự kết thúc chuỗi '\0'"
          >
            <Binary className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Soi Byte (\0)</span>
          </button>

          {/* Toggle Whitespace */}
          <button
            onClick={() => setShowWhitespace(!showWhitespace)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              showWhitespace
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
            title="Hiện khoảng trắng (·) và xuống dòng (↵)"
          >
            {showWhitespace ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Ký tự ẩn (·, ↵)</span>
          </button>

          {/* Toggle Layout (Split / Unified) */}
          <div className="hidden sm:flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg">
            <button
              onClick={() => setViewMode('split')}
              className={`p-1 rounded cursor-pointer ${viewMode === 'split' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'}`}
              title="Chia 2 cột (Side-by-side)"
            >
              <Columns2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`p-1 rounded cursor-pointer ${viewMode === 'unified' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'}`}
              title="1 Cột gộp (Unified)"
            >
              <Rows2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Input Context if provided */}
      {input !== undefined && input !== '' && (
        <div className="px-4 py-2 bg-slate-100/80 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 shrink-0 select-none">
            <Terminal className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
            <span>STDIN</span>
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium shrink-0">Input testcase:</span>
          <code className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 font-mono text-xs border border-slate-200 dark:border-slate-800 font-bold max-w-full overflow-x-auto">
            {input}
          </code>
        </div>
      )}

      {/* Smart Automated Diagnosis Alert */}
      {diagnosis.hasIssue && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <h5 className="font-bold text-amber-950 dark:text-amber-200">
              {diagnosis.message}
            </h5>
            <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed">
              💡 <strong>Gợi ý khắc phục:</strong> {diagnosis.recommendation}
            </p>
          </div>
        </div>
      )}

      {/* Null-Terminator & Memory Byte Inspector Panel */}
      {showNullInspector && (
        <div className="p-4 bg-slate-950 border-b border-slate-800 text-xs font-mono space-y-3">
          <div className="flex items-center justify-between text-slate-300 font-sans flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Binary className="w-4 h-4 text-rose-400" />
              <strong className="text-white">Null-Terminator & Memory Byte Inspector (Hardware View)</strong>
            </div>
            <span className="text-[11px] text-slate-400">
              Soi từng byte RAM • Ký tự kết thúc chuỗi: <code className="text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">\0 (ASCII 0)</code>
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-sans font-bold text-rose-400 block mb-1">
                Actual Output Bytes (Độ dài: {actual.length} bytes):
              </span>
              <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 max-h-40 overflow-y-auto">
                {Array.from(actual).map((ch, idx) => {
                  const code = ch.charCodeAt(0);
                  const isNull = code === 0;
                  const isControl = (code < 32 && code !== 10 && code !== 9) || code >= 127;
                  return (
                    <div 
                      key={idx}
                      className={`p-1.5 rounded-lg border text-center min-w-[40px] ${
                        isNull ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300 font-bold' :
                        isControl ? 'bg-rose-950/80 border-rose-600 text-rose-300 font-bold animate-pulse' :
                        'bg-slate-800/80 border-slate-700 text-slate-200'
                      }`}
                      title={`Vị trí: [${idx}] | Ký tự: ${JSON.stringify(ch)} | Dec: ${code} | Hex: 0x${code.toString(16).toUpperCase()}`}
                    >
                      <span className="text-[9px] text-slate-400 block font-sans">[{idx}]</span>
                      <span className="font-bold text-xs block">
                        {isNull ? '\\0' : isControl ? '?' : ch === ' ' ? '·' : ch === '\n' ? '↵' : ch}
                      </span>
                      <span className="text-[9px] text-slate-500 block font-mono">0x{code.toString(16).toUpperCase().padStart(2, '0')}</span>
                    </div>
                  );
                })}
                <div className="p-1.5 rounded-lg border border-dashed border-emerald-500/60 bg-emerald-950/30 text-center min-w-[40px] flex flex-col justify-center">
                  <span className="text-[9px] text-emerald-400 font-sans block">[\0]</span>
                  <span className="text-[9px] text-emerald-500 font-mono">EOF</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-sans font-bold text-emerald-400 block mb-1">
                Expected Output Bytes (Độ dài: {expected.length} bytes):
              </span>
              <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 max-h-40 overflow-y-auto">
                {Array.from(expected).map((ch, idx) => {
                  const code = ch.charCodeAt(0);
                  return (
                    <div 
                      key={idx}
                      className="p-1.5 rounded-lg border bg-slate-800/80 border-slate-700 text-slate-200 text-center min-w-[40px]"
                      title={`Vị trí: [${idx}] | Dec: ${code} | Hex: 0x${code.toString(16).toUpperCase()}`}
                    >
                      <span className="text-[9px] text-slate-400 block font-sans">[{idx}]</span>
                      <span className="font-bold text-xs block">
                        {ch === ' ' ? '·' : ch === '\n' ? '↵' : ch}
                      </span>
                      <span className="text-[9px] text-slate-500 block font-mono">0x{code.toString(16).toUpperCase().padStart(2, '0')}</span>
                    </div>
                  );
                })}
                <div className="p-1.5 rounded-lg border border-dashed border-emerald-500/60 bg-emerald-950/30 text-center min-w-[40px] flex flex-col justify-center">
                  <span className="text-[9px] text-emerald-400 font-sans block">[\0]</span>
                  <span className="text-[9px] text-emerald-500 font-mono">0x00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Diff Content */}
      <div className="font-mono-code text-xs">
        {viewMode === 'split' ? (
          /* SIDE BY SIDE VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
            {/* Column 1: Actual Output (Your Output) */}
            <div className="flex flex-col">
              <div className="px-4 py-2 bg-rose-50/70 dark:bg-rose-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-rose-700 dark:text-rose-400">
                <span className="flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-500" /> Output của bạn (Actual)
                </span>
                <button
                  onClick={() => handleCopy(actual, 'actual')}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer text-[10px]"
                >
                  {copiedType === 'actual' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>

              <div className="p-3 overflow-x-auto space-y-1 bg-white dark:bg-slate-900/70 min-h-[120px]">
                {actualLines.length === 0 || (actualLines.length === 1 && actualLines[0] === '') ? (
                  <span className="text-slate-400 italic">(Không có output nào được sinh ra)</span>
                ) : (
                  Array.from({ length: maxLines }).map((_, idx) => {
                    const line = actualLines[idx];
                    const expLine = expectedLines[idx];
                    const isMissing = line === undefined;
                    const isDiff = line !== expLine;

                    if (isMissing) {
                      return (
                        <div key={idx} className="flex items-start text-slate-300 dark:text-slate-700 select-none">
                          <span className="w-8 text-[11px] font-mono text-right pr-2 mr-2 border-r border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 select-none shrink-0">{idx + 1}</span>
                          <span className="italic">[Không có dòng tương ứng]</span>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={idx} 
                        className={`flex items-start rounded px-1.5 py-0.5 ${
                          isDiff 
                            ? 'bg-rose-100/80 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 border-l-2 border-rose-500' 
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className="w-8 text-[11px] font-mono text-right pr-2 mr-2 border-r border-slate-200 dark:border-slate-800 text-slate-400 select-none shrink-0 mt-0.5">{idx + 1}</span>
                        <pre className="flex-1 whitespace-pre-wrap break-all">
                          {renderVisibleWhitespace(line, showWhitespace)}
                          {showWhitespace && idx < actualLines.length - 1 && <span className="text-rose-400/80 select-none">↵</span>}
                        </pre>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Column 2: Expected Output (Standard Answer) */}
            <div className="flex flex-col">
              <div className="px-4 py-2 bg-emerald-50/70 dark:bg-emerald-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Output chuẩn (Expected)
                </span>
                <button
                  onClick={() => handleCopy(expected, 'expected')}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer text-[10px]"
                >
                  {copiedType === 'expected' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>

              <div className="p-3 overflow-x-auto space-y-1 bg-white dark:bg-slate-900/70 min-h-[120px]">
                {Array.from({ length: maxLines }).map((_, idx) => {
                  const line = expectedLines[idx];
                  const actLine = actualLines[idx];
                  const isMissing = line === undefined;
                  const isDiff = line !== actLine;

                  if (isMissing) {
                    return (
                      <div key={idx} className="flex items-start text-slate-300 dark:text-slate-700 select-none">
                        <span className="w-8 text-[11px] font-mono text-right pr-2 mr-2 border-r border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 select-none shrink-0">{idx + 1}</span>
                        <span className="italic">[Không có dòng tương ứng]</span>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={idx} 
                      className={`flex items-start rounded px-1.5 py-0.5 ${
                        isDiff 
                          ? 'bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 border-l-2 border-emerald-500' 
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span className="w-8 text-[11px] font-mono text-right pr-2 mr-2 border-r border-slate-200 dark:border-slate-800 text-slate-400 select-none shrink-0 mt-0.5">{idx + 1}</span>
                      <pre className="flex-1 whitespace-pre-wrap break-all">
                        {renderVisibleWhitespace(line, showWhitespace)}
                        {showWhitespace && idx < expectedLines.length - 1 && <span className="text-emerald-500/80 select-none">↵</span>}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* UNIFIED LINE-BY-LINE VIEW */
          <div className="p-3 space-y-1.5 bg-white dark:bg-slate-900/70">
            {Array.from({ length: maxLines }).map((_, idx) => {
              const actLine = actualLines[idx];
              const expLine = expectedLines[idx];
              const isMatch = actLine === expLine;

              if (isMatch) {
                return (
                  <div key={idx} className="flex items-start px-2 py-0.5 text-slate-700 dark:text-slate-300">
                    <span className="w-8 text-[11px] font-mono text-right pr-2 mr-2 border-r border-slate-200 dark:border-slate-800 text-slate-400 select-none shrink-0 mt-0.5">{idx + 1}</span>
                    <span className="w-5 text-slate-400 select-none"> </span>
                    <pre className="flex-1 whitespace-pre-wrap break-all">{renderVisibleWhitespace(actLine, showWhitespace)}</pre>
                  </div>
                );
              }

              return (
                <div key={idx} className="space-y-0.5">
                  {actLine !== undefined && (
                    <div className="flex items-start px-2 py-0.5 bg-rose-100/80 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 rounded">
                      <span className="w-8 text-[11px] font-mono text-right pr-2 mr-2 border-r border-slate-200 dark:border-slate-800 text-rose-500 select-none shrink-0 mt-0.5">{idx + 1}</span>
                      <span className="w-5 font-bold text-rose-600 select-none">-</span>
                      <pre className="flex-1 whitespace-pre-wrap break-all">{renderVisibleWhitespace(actLine, showWhitespace)}</pre>
                    </div>
                  )}
                  {expLine !== undefined && (
                    <div className="flex items-start px-2 py-0.5 bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 rounded">
                      <span className="w-8 text-[11px] font-mono text-right pr-2 mr-2 border-r border-slate-200 dark:border-slate-800 text-emerald-500 select-none shrink-0 mt-0.5">{idx + 1}</span>
                      <span className="w-5 font-bold text-emerald-600 select-none">+</span>
                      <pre className="flex-1 whitespace-pre-wrap break-all">{renderVisibleWhitespace(expLine, showWhitespace)}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Legend */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Dòng sai khác
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Dòng chuẩn
          </span>
          {showWhitespace && (
            <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
              <span className="font-bold">·</span> Khoảng trắng &nbsp;|&nbsp; <span className="font-bold">↵</span> Xuống dòng
            </span>
          )}
        </div>
        <span className="text-[10px] text-slate-400">
          AHtest.code Precise Test Diff Engine
        </span>
      </div>
    </div>
  );
};
