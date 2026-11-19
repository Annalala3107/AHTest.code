import React from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Code2,
  PanelLeft,
  PanelLeftClose,
  Lightbulb,
  Play,
  Send,
  FileText
} from 'lucide-react';
import type { Problem } from '../../types/index.ts';

export interface WorkbenchHeaderProps {
  problem: Problem;
  collectionTitle?: string;
  onBack: () => void;
  hasPrevProblem?: boolean;
  onPrevProblem?: () => void;
  hasNextProblem?: boolean;
  onNextProblem?: () => void;
  selectedLang: string;
  onSelectLang: (lang: string) => void;
  docLang: 'vi' | 'en';
  onToggleDocLang: (lang: 'vi' | 'en') => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
  splitPercent: number;
  onSetSplitPercent: (pct: number) => void;
  isHintDrawerOpen: boolean;
  onToggleHintDrawer: () => void;
  unlockedHintTier: number;
  isGrading: boolean;
  codeLength: number;
  onRunSample: () => void;
  onSubmitSolution: () => void;
  mobileActiveTab: 'statement' | 'editor';
  onSetMobileActiveTab: (tab: 'statement' | 'editor') => void;
}

export const WorkbenchHeader: React.FC<WorkbenchHeaderProps> = ({
  problem,
  collectionTitle,
  onBack,
  hasPrevProblem,
  onPrevProblem,
  hasNextProblem,
  onNextProblem,
  selectedLang,
  onSelectLang,
  docLang,
  onToggleDocLang,
  isZenMode,
  onToggleZenMode,
  splitPercent,
  onSetSplitPercent,
  isHintDrawerOpen,
  onToggleHintDrawer,
  unlockedHintTier,
  isGrading,
  codeLength,
  onRunSample,
  onSubmitSolution,
  mobileActiveTab,
  onSetMobileActiveTab,
}) => {
  const isOverLimit = codeLength > 65536;

  return (
    <>
      <div className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 flex items-center justify-between shrink-0 z-20">
        {/* Left: Back & Problem Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Quay lại danh sách bài tập"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Prev / Next Problem Navigator */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={onPrevProblem}
              disabled={!hasPrevProblem}
              className={`p-1 rounded cursor-pointer transition-colors ${
                hasPrevProblem
                  ? 'text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700'
                  : 'text-slate-400 dark:text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              title="Bài trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNextProblem}
              disabled={!hasNextProblem}
              className={`p-1 rounded cursor-pointer transition-colors ${
                hasNextProblem
                  ? 'text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700'
                  : 'text-slate-400 dark:text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              title="Bài tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{docLang === 'en' && problem.titleEn ? problem.titleEn : problem.title}</span>
              </h1>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  problem.difficulty === 'Easy'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : problem.difficulty === 'Medium'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : problem.difficulty === 'Hard'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                }`}
              >
                {problem.difficulty}
              </span>
            </div>
            {collectionTitle && (
              <span className="text-[10px] text-slate-500 font-mono">
                Bộ đề: {collectionTitle}
              </span>
            )}
          </div>
        </div>

        {/* Right: Controls & CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <Code2 className="w-3.5 h-3.5 text-rose-500" />
            <select
              value={selectedLang}
              onChange={(e) => onSelectLang(e.target.value)}
              className="bg-transparent text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 outline-hidden cursor-pointer"
            >
              <option value="c17" className="bg-slate-900 text-white">C (GCC 11.4 - C17)</option>
              <option value="cpp20" className="bg-slate-900 text-white">C++20 (G++ 13)</option>
              <option value="cpp17" className="bg-slate-900 text-white">C++17 (G++ 11)</option>
              <option value="py3" className="bg-slate-900 text-white">Python 3.11</option>
              <option value="java" className="bg-slate-900 text-white">Java 21 (OpenJDK)</option>
              <option value="sql" className="bg-slate-900 text-white">PostgreSQL 16 Dialect</option>
            </select>
          </div>

          {/* Bilingual VI / EN Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onToggleDocLang('vi')}
              className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer flex items-center gap-1 text-[10px] ${
                docLang === 'vi'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Đề bài Tiếng Việt"
            >
              <span>🇻🇳</span>
              <span>VI</span>
            </button>
            <button
              onClick={() => onToggleDocLang('en')}
              className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer flex items-center gap-1 text-[10px] ${
                docLang === 'en'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="English Statement"
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>

          {/* Zen Mode Toggle */}
          <button
            onClick={onToggleZenMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isZenMode
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={isZenMode ? 'Thoát chế độ Zen' : 'Bật chế độ Zen Code'}
          >
            {isZenMode ? <PanelLeft className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isZenMode ? 'Hiện Đề' : 'Zen Mode'}</span>
          </button>

          {/* Quick Split Ratio */}
          {!isZenMode && (
            <div className="hidden xl:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => onSetSplitPercent(40)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                  splitPercent === 40 ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Tỷ lệ: Đề bài 40% - Code 60%"
              >
                4:6
              </button>
              <button
                onClick={() => onSetSplitPercent(50)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                  splitPercent === 50 ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Tỷ lệ: Đề bài 50% - Code 50%"
              >
                5:5
              </button>
              <button
                onClick={() => onSetSplitPercent(60)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                  splitPercent === 60 ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Tỷ lệ: Đề bài 60% - Code 40%"
              >
                6:4
              </button>
            </div>
          )}

          {/* Progressive Hint Drawer Toggle */}
          <button
            onClick={onToggleHintDrawer}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isHintDrawerOpen
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-xs'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40'
            }`}
            title="Mở Ngăn Kéo Gợi Ý 3 Tầng"
          >
            <Lightbulb className={`w-3.5 h-3.5 ${unlockedHintTier > 0 ? 'text-amber-400' : 'text-indigo-400'}`} />
            <span className="hidden sm:inline">Gợi Ý 3 Tầng</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-black border ${
                unlockedHintTier > 0
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}
            >
              {unlockedHintTier === 0 ? 'Mở' : `T${unlockedHintTier}/3`}
            </span>
          </button>

          {/* Run & Submit */}
          <button
            onClick={onRunSample}
            disabled={isGrading || isOverLimit}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              isOverLimit
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800 opacity-80 cursor-not-allowed'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 cursor-pointer'
            }`}
            title={isOverLimit ? `Mã nguồn (${codeLength.toLocaleString('vi-VN')} ký tự) vượt quá 65,536 ký tự!` : 'Phím tắt: F9'}
          >
            <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>{isOverLimit ? 'Quá giới hạn' : 'Chạy thử'}</span>
            {!isOverLimit && (
              <kbd className="hidden sm:inline-block text-[10px] ml-0.5 px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-mono">
                F9
              </kbd>
            )}
          </button>

          <button
            onClick={onSubmitSolution}
            disabled={isGrading || isOverLimit}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              isOverLimit
                ? 'bg-rose-950 text-rose-300 border border-rose-800 opacity-80 cursor-not-allowed'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs shadow-rose-600/30 disabled:opacity-50 cursor-pointer'
            }`}
            title={isOverLimit ? `Mã nguồn (${codeLength.toLocaleString('vi-VN')} ký tự) vượt quá 65,536 ký tự!` : 'Phím tắt: Ctrl + Enter'}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isOverLimit ? 'Quá giới hạn' : 'Nộp bài'}</span>
            {!isOverLimit && (
              <kbd className="hidden sm:inline-block text-[10px] ml-0.5 px-1.5 py-0.2 rounded bg-rose-700 text-rose-200 border border-rose-500/40 font-mono">
                Ctrl+↵
              </kbd>
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Dual-Tab Switcher */}
      <div className="lg:hidden flex items-center bg-slate-100 dark:bg-slate-800 p-1 border-b border-slate-200 dark:border-slate-700 shrink-0">
        <button
          onClick={() => onSetMobileActiveTab('statement')}
          className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileActiveTab === 'statement'
              ? 'bg-white dark:bg-slate-900 shadow-xs text-rose-600 dark:text-rose-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>📖 Đề bài & Mô tả</span>
        </button>
        <button
          onClick={() => onSetMobileActiveTab('editor')}
          className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileActiveTab === 'editor'
              ? 'bg-white dark:bg-slate-900 shadow-xs text-rose-600 dark:text-rose-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>💻 Trình soạn thảo & Console</span>
        </button>
      </div>
    </>
  );
};
