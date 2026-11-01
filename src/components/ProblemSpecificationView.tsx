import React, { useState } from 'react';
import { 
  Terminal, 
  FileCode2, 
  ShieldAlert, 
  Clock, 
  HardDrive, 
  Copy, 
  Check, 
  BookOpen
} from 'lucide-react';
import type { Problem, Difficulty } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';
import { 
  getProblemTitle, 
  getProblemStatement, 
  getProblemInputFormat, 
  getProblemOutputFormat, 
  getProblemConstraints 
} from '../services/problemBilingualService';

export interface ProblemSpecificationViewProps {
  problem: Problem;
  lang?: 'vi' | 'en';
  onToggleLang?: (lang: 'vi' | 'en') => void;
  showLangToggle?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
  scoreWeight?: number | string;
  isExamMode?: boolean;
  className?: string;
}

export const ProblemSpecificationView: React.FC<ProblemSpecificationViewProps> = ({
  problem,
  lang: controlledLang,
  onToggleLang,
  showLangToggle = false,
  questionNumber,
  totalQuestions,
  scoreWeight,
  isExamMode = false,
  className = ''
}) => {
  // Internal language state if not controlled
  const [internalLang, setInternalLang] = useState<'vi' | 'en'>(() => {
    return (localStorage.getItem('ahtest_doc_lang') as 'vi' | 'en') || 'vi';
  });

  const currentLang = controlledLang || internalLang;

  const handleLangChange = (newLang: 'vi' | 'en') => {
    setInternalLang(newLang);
    try {
      localStorage.setItem('ahtest_doc_lang', newLang);
    } catch {
      // ignore
    }
    if (onToggleLang) {
      onToggleLang(newLang);
    }
  };

  // 1-Click Copy state tracking: `${sampleIndex}_${'input'|'output'}`
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const title = getProblemTitle(problem, currentLang);
  const statement = getProblemStatement(problem, currentLang);
  const inputFormat = getProblemInputFormat(problem, currentLang);
  const outputFormat = getProblemOutputFormat(problem, currentLang);
  const constraints = getProblemConstraints(problem, currentLang);

  const difficultyColors: Record<Difficulty, string> = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    Expert: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
  };

  return (
    <div className={`space-y-5 font-sans ${className}`}>
      {/* 1. HEADER META BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {questionNumber !== undefined && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-xs">
              {currentLang === 'en' 
                ? `Question #${questionNumber}${totalQuestions ? `/${totalQuestions}` : ''}` 
                : `Câu #${questionNumber}${totalQuestions ? `/${totalQuestions}` : ''}`}
            </span>
          )}

          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${difficultyColors[problem.difficulty || 'Easy']}`}>
            {problem.difficulty || 'Easy'}
          </span>

          {problem.category && (
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {problem.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {scoreWeight !== undefined && (
            <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              <span>{currentLang === 'en' ? 'Weight: ' : 'Điểm: '}</span>
              <strong className="text-rose-500 dark:text-rose-400">{scoreWeight}</strong>
            </div>
          )}

          {/* Bilingual Switcher (VI / EN) */}
          {showLangToggle && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-xs">
              <button
                type="button"
                onClick={() => handleLangChange('vi')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                  currentLang === 'vi'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Xem đề bài bằng Tiếng Việt"
              >
                <span>🇻🇳</span>
                <span>VI</span>
              </button>
              <button
                type="button"
                onClick={() => handleLangChange('en')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                  currentLang === 'en'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="View problem in English (Standard PE)"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. SPECIFICATION META STRIP (Resource Limits & Standard Streams) */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 py-1 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span>{currentLang === 'en' ? 'Time Limit: ' : 'Thời gian: '}</span>
          <strong className="text-slate-700 dark:text-slate-200 font-mono">{problem.timeLimit || 1.0}s</strong>
        </span>

        <span className="flex items-center gap-1.5">
          <HardDrive className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>{currentLang === 'en' ? 'Memory Limit: ' : 'Bộ nhớ: '}</span>
          <strong className="text-slate-700 dark:text-slate-200 font-mono">{problem.memoryLimit || 128}MB</strong>
        </span>

        <span className="flex items-center gap-1.5">
          <span className="text-slate-400">•</span>
          <span>Input: <strong className="font-mono text-slate-700 dark:text-slate-200">stdin</strong></span>
        </span>

        <span className="flex items-center gap-1.5">
          <span>Output: <strong className="font-mono text-slate-700 dark:text-slate-200">stdout</strong></span>
        </span>
      </div>

      {/* 3. KHỐI 1: YÊU CẦU & MÔ TẢ BÀI TOÁN (PROBLEM STATEMENT) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
            {title}
          </h1>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
          <KaTeXRenderer content={statement} />
        </div>
      </div>

      {/* 4. KHỐI 2: ĐỊNH DẠNG ĐẦU VÀO (INPUT SPECIFICATION) */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          <span>{currentLang === 'en' ? 'Input Specification (stdin):' : 'Định Dạng Đầu Vào (stdin):'}</span>
        </span>
        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans shadow-2xs">
          <KaTeXRenderer content={inputFormat} />
        </div>
      </div>

      {/* 5. KHỐI 3: ĐỊNH DẠNG ĐẦU RA (OUTPUT SPECIFICATION) */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <FileCode2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          <span>{currentLang === 'en' ? 'Output Specification (stdout):' : 'Định Dạng Đầu Ra (stdout):'}</span>
        </span>
        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans shadow-2xs">
          <KaTeXRenderer content={outputFormat} />
        </div>
      </div>

      {/* 6. KHỐI 4: GIỚI HẠN & RÀNG BUỘC KỸ THUẬT (CONSTRAINTS) */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>{currentLang === 'en' ? 'Constraints & Technical Requirements:' : 'Giới Hạn & Ràng Buộc Kỹ Thuật:'}</span>
        </span>
        <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 shadow-2xs">
          {constraints}
        </div>
      </div>

      {/* 7. KHỐI 5: VÍ DỤ MẪU VỚI NÚT 1-CLICK COPY (SAMPLE CASES & EXPLANATIONS) */}
      {problem.samples && problem.samples.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-rose-500" />
              <span>{currentLang === 'en' ? 'Sample Test Cases:' : 'Ví Dụ Mẫu (Sample Cases):'}</span>
            </span>
            <span className="text-[10px] text-slate-400 italic">
              {currentLang === 'en' ? 'Click Copy to paste into custom test' : 'Bấm nút Copy để dán nhanh vào trình chạy thử'}
            </span>
          </div>

          <div className="space-y-3">
            {problem.samples.map((sample, idx) => {
              const inputKey = `${idx}_input`;
              const outputKey = `${idx}_output`;
              const isInputCopied = copiedKey === inputKey;
              const isOutputCopied = copiedKey === outputKey;

              return (
                <div 
                  key={idx} 
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-100 dark:border-slate-900">
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">
                      {currentLang === 'en' ? `Sample Case #${idx + 1}` : `Ví dụ #${idx + 1}`}
                    </span>
                    {sample.explanation && (
                      <span className="text-[10px] text-amber-500 dark:text-amber-400 font-medium">
                        💡 {currentLang === 'en' ? 'Explanation available' : 'Có lời giải thích'}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Input Column */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold">
                        <span>Input (stdin):</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(sample.input, inputKey)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer text-[10px]"
                          title="Copy input vào clipboard"
                        >
                          {isInputCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500 font-bold">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200 overflow-x-auto min-h-[42px] leading-relaxed">
                        {sample.input || '(rỗng)'}
                      </pre>
                    </div>

                    {/* Output Column */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold">
                        <span>{currentLang === 'en' ? 'Expected Output (stdout):' : 'Output Chuẩn (stdout):'}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(sample.output, outputKey)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer text-[10px]"
                          title="Copy expected output vào clipboard"
                        >
                          {isOutputCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500 font-bold">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 overflow-x-auto min-h-[42px] leading-relaxed">
                        {sample.output || '(rỗng)'}
                      </pre>
                    </div>
                  </div>

                  {/* Explanation if present */}
                  {sample.explanation && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                      💡 <strong>{currentLang === 'en' ? 'Sample Note: ' : 'Giải thích mẫu: '}</strong>
                      {sample.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 8. EXAM INTEGRITY NOTICE (If in Exam Mode) */}
      {isExamMode && (
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-3 shadow-md">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="block text-amber-300 font-bold uppercase tracking-wider text-[10px]">
              {currentLang === 'en' ? 'Official Exam Protocol:' : 'Quy chế phòng thi chuẩn Khảo thí:'}
            </strong>
            <p className="text-slate-400 leading-relaxed">
              {currentLang === 'en'
                ? 'All 3-tier progressive hints and automated assist engines are disabled to evaluate pure problem-solving capability.'
                : 'Toàn bộ trợ lý gợi ý 3 tầng bị vô hiệu hóa để bảo đảm tính trung thực và phản ánh đúng năng lực thi thực tế của bạn.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
