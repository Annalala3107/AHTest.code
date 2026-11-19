import React, { useState } from 'react';
import { X, Play } from 'lucide-react';
import type { Problem } from '../../types/index.ts';
import { ProblemSpecificationView } from '../ProblemSpecificationView.tsx';

export interface ProblemPreviewModalProps {
  problem: Problem | null;
  onClose: () => void;
  onSelectProblem: (problem: Problem) => void;
}

export const ProblemPreviewModal: React.FC<ProblemPreviewModalProps> = ({
  problem,
  onClose,
  onSelectProblem,
}) => {
  const [docLang, setDocLang] = useState<'vi' | 'en'>('vi');

  if (!problem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs select-none">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {problem.difficulty}
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
              {docLang === 'en' && problem.titleEn ? problem.titleEn : problem.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onSelectProblem(problem);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Vào Làm Bài</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Problem Spec */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          <ProblemSpecificationView
            problem={problem}
            lang={docLang}
            onToggleLang={setDocLang}
            showLangToggle={true}
            scoreWeight={`${problem.points}đ`}
            isExamMode={false}
          />
        </div>
      </div>
    </div>
  );
};
