import React from 'react';
import {
  BookOpen,
  Terminal,
  Target,
  ArrowLeft,
  ArrowRight,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import type { AcademyLesson, AppliedExercise } from '../../types/index.ts';
import { KaTeXRenderer } from '../KaTeXRenderer.tsx';

export interface AcademyLessonPaneProps {
  activeLesson: AcademyLesson;
  activeExercise: AppliedExercise | null;
  activeDocTab: 'theory' | 'testcases' | 'exercises';
  setActiveDocTab: (tab: 'theory' | 'testcases' | 'exercises') => void;
  currentTestcases: any[];
  docLang: 'vi' | 'en';
  onBackToLesson: () => void;
  onSelectExercise: (ex: AppliedExercise) => void;
  copiedTestIdx: number | null;
  onCopyInput: (input: string, idx: number) => void;
}

export const AcademyLessonPane: React.FC<AcademyLessonPaneProps> = ({
  activeLesson,
  activeExercise,
  activeDocTab,
  setActiveDocTab,
  currentTestcases,
  docLang,
  onBackToLesson,
  onSelectExercise,
  copiedTestIdx,
  onCopyInput,
}) => {
  return (
    <div className="w-full flex-col h-full bg-white dark:bg-slate-900 overflow-hidden flex">
      {/* Document Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 bg-slate-50/60 dark:bg-slate-950/40 text-xs shrink-0">
        <button
          onClick={() => setActiveDocTab('theory')}
          className={`py-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeDocTab === 'theory'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          {activeExercise ? (
            <>
              <Target className="w-3.5 h-3.5" />
              <span>Bài tập [{activeExercise.questionCode}]</span>
            </>
          ) : (
            <>
              <BookOpen className="w-3.5 h-3.5" />
              <span>Lý thuyết bài học</span>
            </>
          )}
        </button>

        <button
          onClick={() => setActiveDocTab('testcases')}
          className={`py-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeDocTab === 'testcases'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Test cases</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {currentTestcases.length}
          </span>
        </button>

        {!activeExercise &&
          activeLesson.appliedExercises &&
          activeLesson.appliedExercises.length > 0 && (
            <button
              onClick={() => setActiveDocTab('exercises')}
              className={`py-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeDocTab === 'exercises'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-rose-500" />
              <span>Bài tập Thực hành</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-900">
                {activeLesson.appliedExercises.length}
              </span>
            </button>
          )}
      </div>

      {/* Document Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
        {/* Active Exercise Indicator Bar */}
        {activeExercise && (
          <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-600 text-white">
                {activeExercise.questionCode}
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                Applied Practical Challenge
              </span>
            </div>

            <button
              onClick={onBackToLesson}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Quay lại lý thuyết</span>
            </button>
          </div>
        )}

        {/* TAB 1: THEORY / EXERCISE STATEMENT */}
        {activeDocTab === 'theory' && (
          <div className="space-y-4">
            {activeExercise ? (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {docLang === 'en' ? activeExercise.titleEn : activeExercise.titleVi}
                  </h2>
                  <div className="flex items-center gap-2 pt-2 text-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {activeExercise.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {activeExercise.difficulty}
                    </span>
                    <span className="text-slate-400">Nguồn: Đề thi Thực hành C/C++ Chuẩn Quốc Tế</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  <KaTeXRenderer
                    content={
                      docLang === 'en'
                        ? activeExercise.descriptionEn
                        : activeExercise.descriptionVi
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {docLang === 'en' && activeLesson.titleEn
                      ? activeLesson.titleEn
                      : activeLesson.title}
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    {activeLesson.durationMinutes} phút
                  </span>
                </div>

                <div className="text-sm">
                  <KaTeXRenderer
                    content={
                      docLang === 'en' && activeLesson.contentEn
                        ? activeLesson.contentEn
                        : activeLesson.content
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TEST CASES EXPLORER */}
        {activeDocTab === 'testcases' && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {docLang === 'en'
                  ? 'Sample Test Cases & Criteria'
                  : 'Bảng Test Cases Mẫu & Tiêu Chí Đánh Giá'}
              </h3>
              <p className="text-xs text-slate-500">
                Hệ thống sẽ chạy code của bạn qua {currentTestcases.length} trường hợp kiểm thử sau:
              </p>
            </div>

            <div className="space-y-3">
              {currentTestcases.map((tc, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Test #{idx + 1}
                      </span>
                      {idx === 0 ? (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          {docLang === 'en' ? 'Public Sample' : 'Test Mẫu'}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" />
                          {docLang === 'en' ? 'Hidden System' : 'Test Ẩn'}
                        </span>
                      )}
                    </div>

                    {tc.input && (
                      <button
                        onClick={() => onCopyInput(tc.input, idx)}
                        className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-medium"
                      >
                        {copiedTestIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500 font-bold">Đã chép!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Sao chép input</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Input</span>
                    <pre className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap">
                      {tc.input || '(Không có input)'}
                    </pre>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1">Expected Output</span>
                    <pre className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-mono whitespace-pre-wrap">
                      {tc.expectedOutput}
                    </pre>
                  </div>

                  {(tc.explanationVi || tc.explanationEn) && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                      💡 {docLang === 'en' && tc.explanationEn ? tc.explanationEn : tc.explanationVi}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CURATED APPLIED EXERCISES */}
        {activeDocTab === 'exercises' && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-rose-500" />
                Bài Tập Thực Chiến & Khảo Thí
              </h3>
              <p className="text-xs text-slate-500">
                Chọn một câu hỏi để gõ code và nộp bài trực tiếp vào Monaco Editor:
              </p>
            </div>

            <div className="space-y-3">
              {activeLesson.appliedExercises?.map((ex) => (
                <div
                  key={ex.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                        {ex.questionCode}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {ex.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        {ex.difficulty}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectExercise(ex)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Luyện bài này</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {docLang === 'en' ? ex.titleEn : ex.titleVi}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {docLang === 'en' ? ex.descriptionEn : ex.descriptionVi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
