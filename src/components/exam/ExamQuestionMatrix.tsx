import React from 'react';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export interface ExamQuestionMatrixProps {
  totalQuestions: number;
  currentIndex: number;
  onSelectIndex: (idx: number) => void;
  questionStates: Record<number, { isSolved?: boolean; isAttempted?: boolean }>;
  flaggedQuestions: Record<number, boolean>;
  onToggleFlag: (idx: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const ExamQuestionMatrix: React.FC<ExamQuestionMatrixProps> = ({
  totalQuestions,
  currentIndex,
  onSelectIndex,
  questionStates,
  flaggedQuestions,
  onToggleFlag,
  onPrev,
  onNext,
}) => {
  const isCurrentFlagged = !!flaggedQuestions[currentIndex];

  return (
    <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 select-none">
      {/* Question Matrix Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = idx === currentIndex;
          const isDone = questionStates[idx]?.isSolved;
          const isFlagged = flaggedQuestions[idx];

          return (
            <button
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all relative flex items-center justify-center cursor-pointer ${
                isCurrent
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400 ring-offset-2 ring-offset-slate-900 scale-105'
                  : isDone
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
              title={`Câu ${idx + 1}${isDone ? ' - Đã đạt điểm tuyệt đối' : ''}${isFlagged ? ' - Đã đánh dấu xem lại' : ''}`}
            >
              {isDone ? (
                <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-emerald-400'}`} />
              ) : (
                <span>{idx + 1}</span>
              )}

              {/* Bookmark Indicator */}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center text-slate-900">
                  <Bookmark className="w-2 h-2 fill-current" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Prev / Next & Flag Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onToggleFlag(currentIndex)}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border ${
            isCurrentFlagged
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
          }`}
          title="Đánh dấu câu này để xem lại trước khi nộp bài"
        >
          <Bookmark className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span className="hidden sm:inline">{isCurrentFlagged ? 'Đã ghim' : 'Ghim câu'}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={`p-1.5 rounded-xl border border-slate-700 bg-slate-800 transition-colors ${
              currentIndex > 0
                ? 'text-slate-200 hover:bg-slate-700 cursor-pointer'
                : 'text-slate-600 opacity-40 cursor-not-allowed'
            }`}
            title="Câu trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNext}
            disabled={currentIndex === totalQuestions - 1}
            className={`p-1.5 rounded-xl border border-slate-700 bg-slate-800 transition-colors ${
              currentIndex < totalQuestions - 1
                ? 'text-slate-200 hover:bg-slate-700 cursor-pointer'
                : 'text-slate-600 opacity-40 cursor-not-allowed'
            }`}
            title="Câu tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
