import React from 'react';
import {
  GraduationCap,
  ChevronRight,
  Lock,
  Save,
  Play,
  Sparkles,
  Trophy
} from 'lucide-react';
import type { AcademyCourse, AcademyLesson, AppliedExercise } from '../../types/index.ts';
import { mockCourses } from '../../data/academy/index.ts';

export interface AcademyBreadcrumbBarProps {
  selectedCourse: AcademyCourse;
  activeLesson: AcademyLesson;
  activeExercise: AppliedExercise | null;
  activeModule?: { id: string; title: string; titleEn?: string };
  docLang: 'vi' | 'en';
  onToggleDocLang: (lang: 'vi' | 'en') => void;
  onSelectCourse: (course: AcademyCourse) => void;
  completedCount: number;
  progressPercent: number;
  draftSaved: boolean;
  isZenMode: boolean;
  onToggleZenMode: () => void;
  splitPercent: number;
  onSetSplitPercent: (pct: number) => void;
  isRunning: boolean;
  userCodeLength: number;
  onRunCode: () => void;
  exercisePassed: boolean;
  nextLessonCandidate: AcademyLesson | null;
  onNextLesson: () => void;
  onShowGraduationModal: () => void;
}

export const AcademyBreadcrumbBar: React.FC<AcademyBreadcrumbBarProps> = ({
  selectedCourse,
  activeLesson,
  activeExercise,
  activeModule,
  docLang,
  onToggleDocLang,
  onSelectCourse,
  completedCount,
  progressPercent,
  draftSaved,
  isZenMode,
  onToggleZenMode,
  splitPercent,
  onSetSplitPercent,
  isRunning,
  userCodeLength,
  onRunCode,
  exercisePassed,
  nextLessonCandidate,
  onNextLesson,
  onShowGraduationModal,
}) => {
  const isOverLimit = userCodeLength > 65536;

  return (
    <div className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 flex items-center justify-between shrink-0 z-20">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 shrink-0">
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Học viện</span>
          </div>

          <ChevronRight className="hidden sm:inline w-3 h-3 text-slate-300 dark:text-slate-600 shrink-0" />

          {/* Level 2: Track Selector */}
          <div className="flex items-center gap-1 shrink-0">
            {mockCourses.map((c) => {
              const isSelected = selectedCourse.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCourse(c)}
                  className={`items-center gap-1 px-2.5 py-1 rounded-md font-bold text-[11px] transition-all cursor-pointer ${
                    c.isComingSoon ? 'hidden md:inline-flex' : 'inline-flex'
                  } ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shadow-2xs'
                      : c.isComingSoon
                      ? 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={c.isComingSoon ? `${c.title} (Sắp ra mắt)` : c.title}
                >
                  <span>
                    {c.language === 'c'
                      ? 'C Track'
                      : c.language === 'cpp'
                      ? 'C++ Track'
                      : c.language === 'python'
                      ? 'Python'
                      : c.language === 'java'
                      ? 'Java Track'
                      : 'SQL Track'}
                  </span>
                  {c.isComingSoon && (
                    <span className="flex items-center gap-0.5 px-1 py-0.2 text-[8px] font-bold rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      <Lock className="w-2 h-2" />
                      <span>Sắp có</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Level 3: Active Module Tag */}
          {activeModule && (() => {
            const moduleIndex = selectedCourse.modules.findIndex((m) => m.id === activeModule.id);
            const moduleNum = moduleIndex >= 0 ? moduleIndex + 1 : 1;
            return (
              <>
                <ChevronRight className="hidden md:inline w-3 h-3 text-slate-400 dark:text-slate-600 shrink-0" />
                <span
                  className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shrink-0 select-none cursor-default"
                  title={activeModule.title}
                >
                  {docLang === 'en' ? `Stage ${moduleNum}` : `GĐ ${moduleNum}`}
                </span>
              </>
            );
          })()}

          {/* Level 4: Active Lesson / Exercise Title */}
          <ChevronRight className="hidden sm:inline w-3 h-3 text-slate-400 dark:text-slate-600 shrink-0" />
          <span
            className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[420px] xl:max-w-[500px]"
            title={
              activeExercise
                ? docLang === 'en'
                  ? activeExercise.titleEn
                  : activeExercise.titleVi
                : docLang === 'en' && activeLesson.titleEn
                ? activeLesson.titleEn
                : activeLesson.title
            }
          >
            {activeExercise
              ? `[${activeExercise.questionCode}] ${
                  docLang === 'en' ? activeExercise.titleEn : activeExercise.titleVi
                }`
              : docLang === 'en' && activeLesson.titleEn
              ? activeLesson.titleEn
              : activeLesson.title}
          </span>
        </div>
      </div>

      {/* Right: Progress Meter, Switcher, Zen, Run Button */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Progress Meter Bar */}
        <div
          className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-[11px]"
          title={`Bạn đã hoàn thành ${completedCount} trên tổng số ${selectedCourse.totalLessons} bài học`}
        >
          <span className="text-slate-500 dark:text-slate-400 font-medium">Tiến độ:</span>
          <div className="w-14 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {completedCount}/{selectedCourse.totalLessons} ({progressPercent}%)
          </span>
        </div>

        {/* Draft Saved Status */}
        {draftSaved && (
          <span className="hidden 2xl:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
            <Save className="w-3 h-3 text-emerald-500" />
            <span>Đã lưu</span>
          </span>
        )}

        {/* Bilingual Switcher (VI / EN) */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => onToggleDocLang('vi')}
            className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
              docLang === 'vi'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Tiếng Việt"
          >
            🇻🇳 VI
          </button>
          <button
            onClick={() => onToggleDocLang('en')}
            className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
              docLang === 'en'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="English"
          >
            🇬🇧 EN
          </button>
        </div>

        {/* Zen Mode Button */}
        <button
          onClick={onToggleZenMode}
          className={`hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
            isZenMode
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          title={isZenMode ? 'Thoát Zen Mode' : 'Bật Zen Mode'}
        >
          <span className="text-[11px] font-bold">{isZenMode ? 'Hiện Lý thuyết' : 'Zen Code'}</span>
        </button>

        {/* Quick Split Ratio */}
        {!isZenMode && (
          <div className="hidden lg:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onSetSplitPercent(40)}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                splitPercent === 40
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Tỷ lệ: 40% - 60%"
            >
              4:6
            </button>
            <button
              onClick={() => onSetSplitPercent(50)}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                splitPercent === 50
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Tỷ lệ: 50% - 50%"
            >
              5:5
            </button>
            <button
              onClick={() => onSetSplitPercent(60)}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                splitPercent === 60
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Tỷ lệ: 60% - 40%"
            >
              6:4
            </button>
          </div>
        )}

        {/* Run Code Button */}
        <button
          onClick={onRunCode}
          disabled={isRunning || isOverLimit}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
            isOverLimit
              ? 'bg-rose-950 text-rose-300 border border-rose-700 opacity-80 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs shadow-indigo-600/30 cursor-pointer disabled:opacity-50'
          }`}
          title={isOverLimit ? 'Vượt quá giới hạn ký tự' : 'Phím tắt: Ctrl + Enter'}
        >
          <Play className="w-3 h-3 fill-white" />
          <span className="hidden sm:inline">
            {isRunning ? 'Đang chấm...' : isOverLimit ? 'Quá giới hạn' : 'Chạy thử'}
          </span>
          {!isOverLimit && (
            <kbd className="hidden sm:inline-block ml-0.5 px-1 py-0.2 rounded text-[9px] bg-indigo-700 text-indigo-200 font-mono">
              Ctrl+↵
            </kbd>
          )}
        </button>

        {/* Next Lesson Pulsating Quick Button */}
        {exercisePassed && nextLessonCandidate && (
          <button
            onClick={onNextLesson}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 animate-pulse transition-all cursor-pointer"
            title="Phím tắt: Shift + Enter để sang bài tiếp theo"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Bài tiếp theo</span>
            <kbd className="hidden sm:inline-block ml-0.5 px-1 py-0.2 rounded text-[9px] bg-emerald-700 text-emerald-100 font-mono">
              Shift+↵
            </kbd>
          </button>
        )}

        {/* Graduation Badge if finished all lessons */}
        {exercisePassed && !nextLessonCandidate && (
          <button
            onClick={onShowGraduationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30 transition-all cursor-pointer"
            title="Chúc mừng bạn đã hoàn thành toàn bộ khóa học!"
          >
            <Trophy className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Tốt nghiệp</span>
          </button>
        )}
      </div>
    </div>
  );
};
