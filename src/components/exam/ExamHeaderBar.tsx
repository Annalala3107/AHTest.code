import React from 'react';
import {
  ArrowLeft,
  Timer,
  Clock,
  Code2,
  PanelLeft,
  PanelLeftClose,
  Send,
  Loader2
} from 'lucide-react';

export interface ExamHeaderBarProps {
  collectionTitle: string;
  remainingSeconds: number;
  onExitExam: () => void;
  onSubmitExam: () => void;
  isGradingAll: boolean;
  selectedLang: string;
  setSelectedLang: (l: string) => void;
  docLang: 'vi' | 'en';
  onToggleDocLang: (l: 'vi' | 'en') => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
}

function formatExamTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const ExamHeaderBar: React.FC<ExamHeaderBarProps> = ({
  collectionTitle,
  remainingSeconds,
  onExitExam,
  onSubmitExam,
  isGradingAll,
  selectedLang,
  setSelectedLang,
  docLang,
  onToggleDocLang,
  isZenMode,
  onToggleZenMode,
}) => {
  const isUrgent = remainingSeconds < 300; // < 5 mins
  const isWarning = remainingSeconds < 600; // < 10 mins

  return (
    <div className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 flex items-center justify-between shrink-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onExitExam}
          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
          title="Rời phòng thi"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-bold text-rose-500">Rời thi</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-[320px]">
              {collectionTitle}
            </h1>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Phòng Thi Mô Phỏng Khảo Thí
            </span>
          </div>
        </div>
      </div>

      {/* Center: Countdown Timer */}
      <div className="flex items-center gap-2">
        <div
          className={`px-3 py-1.5 rounded-2xl border font-mono font-black text-sm sm:text-base flex items-center gap-2 transition-all ${
            isUrgent
              ? 'bg-rose-950/80 text-rose-400 border-rose-600 animate-pulse'
              : isWarning
              ? 'bg-amber-950/60 text-amber-300 border-amber-600'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
          }`}
          title="Thời gian làm bài còn lại"
        >
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-400' : 'text-slate-400'}`} />
          <span>{formatExamTimer(remainingSeconds)}</span>
        </div>
      </div>

      {/* Right: Controls & Submit */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <Code2 className="w-3.5 h-3.5 text-rose-500" />
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-transparent text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 outline-hidden cursor-pointer"
          >
            <option value="c17" className="bg-slate-900 text-white">C (GCC 11.4)</option>
            <option value="cpp20" className="bg-slate-900 text-white">C++20</option>
            <option value="py3" className="bg-slate-900 text-white">Python 3.11</option>
            <option value="java" className="bg-slate-900 text-white">Java 21</option>
          </select>
        </div>

        {/* Bilingual Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onToggleDocLang('vi')}
            className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer text-[10px] ${
              docLang === 'vi' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            VI
          </button>
          <button
            onClick={() => onToggleDocLang('en')}
            className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer text-[10px] ${
              docLang === 'en' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            EN
          </button>
        </div>

        {/* Zen Mode */}
        <button
          onClick={onToggleZenMode}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
        >
          {isZenMode ? <PanelLeft className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
          <span>{isZenMode ? 'Hiện Đề' : 'Zen'}</span>
        </button>

        {/* Submit Entire Exam */}
        <button
          onClick={onSubmitExam}
          disabled={isGradingAll}
          className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isGradingAll ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Đang chấm...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Nộp Bài Thi</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
