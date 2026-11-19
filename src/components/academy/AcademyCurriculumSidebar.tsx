import React, { useState, useMemo } from 'react';
import {
  PanelLeft,
  PanelLeftClose,
  Clock,
  Search,
  X,
  Layers,
  CheckCircle2,
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import type { AcademyCourse, AcademyLesson, AppliedExercise } from '../../types/index.ts';

export interface AcademyCurriculumSidebarProps {
  selectedCourse: AcademyCourse;
  activeLesson: AcademyLesson;
  activeExercise: AppliedExercise | null;
  completedLessons: string[];
  docLang: 'vi' | 'en';
  isSidebarExpanded: boolean;
  onToggleSidebarExpanded: (expanded: boolean) => void;
  onSelectLesson: (lesson: AcademyLesson) => void;
  onSelectExercise: (ex: AppliedExercise) => void;
  nextLessonCandidate: AcademyLesson | null;
}

export const AcademyCurriculumSidebar: React.FC<AcademyCurriculumSidebarProps> = ({
  selectedCourse,
  activeLesson,
  activeExercise,
  completedLessons,
  docLang,
  isSidebarExpanded,
  onToggleSidebarExpanded,
  onSelectLesson,
  onSelectExercise,
  nextLessonCandidate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const completedCount = completedLessons.length;
  const progressPercent = Math.min(
    100,
    Math.round((completedCount / (selectedCourse.totalLessons || 1)) * 100)
  );

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return selectedCourse.modules;
    const q = searchQuery.toLowerCase().trim();
    return selectedCourse.modules
      .map((mod) => {
        const matchingLessons = mod.lessons.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            (l.titleEn && l.titleEn.toLowerCase().includes(q)) ||
            (l.appliedExercises &&
              l.appliedExercises.some(
                (ex) =>
                  ex.titleVi.toLowerCase().includes(q) ||
                  ex.titleEn.toLowerCase().includes(q) ||
                  ex.questionCode.toLowerCase().includes(q)
              ))
        );
        return { ...mod, lessons: matchingLessons };
      })
      .filter((mod) => mod.lessons.length > 0);
  }, [selectedCourse, searchQuery]);

  return (
    <>
      {/* 1. MINI ICON RAIL: Visible when sidebar is collapsed on desktop */}
      {!isSidebarExpanded && (
        <div className="hidden lg:flex flex-col w-14 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-20 select-none">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-center shrink-0">
            <button
              onClick={() => onToggleSidebarExpanded(true)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer group relative"
              title="Mở rộng lộ trình bài học"
            >
              <PanelLeft className="w-4 h-4 transition-transform group-hover:scale-110" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2 px-1 space-y-2 overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {selectedCourse.modules.map((module, modIdx) => (
              <div key={module.id} className="space-y-1.5 flex flex-col items-center">
                <div
                  className="w-8 h-4 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[9px] font-extrabold text-slate-500 dark:text-slate-400 flex items-center justify-center select-none"
                  title={docLang === 'en' && module.titleEn ? module.titleEn : module.title}
                >
                  M{modIdx + 1}
                </div>

                {module.lessons.map((lesson, lessonIdx) => {
                  const isCurrent = activeLesson.id === lesson.id && !activeExercise;
                  const isDone = completedLessons.includes(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer relative ${
                        isCurrent
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105'
                          : isDone
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 hover:scale-105'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:scale-105'
                      }`}
                      title={`${lessonIdx + 1}. ${
                        docLang === 'en' && lesson.titleEn ? lesson.titleEn : lesson.title
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-emerald-500'}`} />
                      ) : (
                        <span>{lessonIdx + 1}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col items-center gap-1 shrink-0">
            <div className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
              {progressPercent}%
            </div>
          </div>
        </div>
      )}

      {/* 2. EXPANDED CURRICULUM DRAWER */}
      {isSidebarExpanded && (
        <>
          {/* Mobile Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
            onClick={() => onToggleSidebarExpanded(false)}
          />

          <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 shadow-2xl lg:shadow-none lg:relative lg:z-20 select-none">
            {/* Header */}
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {selectedCourse.level}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {selectedCourse.estimatedHours}h học
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate mt-0.5">
                  {docLang === 'en' ? selectedCourse.titleEn : selectedCourse.title}
                </h3>
              </div>
              <button
                onClick={() => onToggleSidebarExpanded(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Progress */}
            <div className="px-3.5 py-2.5 bg-indigo-50/60 dark:bg-indigo-950/20 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Tiến độ khóa học</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {completedCount}/{selectedCourse.totalLessons} bài ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm bài học, bài tập..."
                  className="w-full pl-8 pr-7 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Modules List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {filteredModules.map((module) => {
                const moduleCompleted = module.lessons.filter((l) =>
                  completedLessons.includes(l.id)
                ).length;
                return (
                  <div key={module.id} className="space-y-1.5">
                    <div className="flex items-center justify-between px-2 py-1">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 min-w-0">
                        <Layers className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span className="truncate">
                          {docLang === 'en' && module.titleEn ? module.titleEn : module.title}
                        </span>
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 shrink-0 ml-1">
                        {moduleCompleted}/{module.lessons.length}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {module.lessons.map((lesson, idx) => {
                        const isCurrent = activeLesson.id === lesson.id && !activeExercise;
                        const isDone = completedLessons.includes(lesson.id);
                        const hasExercises =
                          lesson.appliedExercises && lesson.appliedExercises.length > 0;
                        return (
                          <div key={lesson.id} className="space-y-1">
                            <button
                              onClick={() => {
                                onSelectLesson(lesson);
                                if (window.innerWidth < 1024) onToggleSidebarExpanded(false);
                              }}
                              className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                                isCurrent
                                  ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800/80 shadow-2xs'
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <span
                                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                      isCurrent
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                    }`}
                                  >
                                    {idx + 1}
                                  </span>
                                )}
                                <span className="truncate">
                                  {docLang === 'en' && lesson.titleEn
                                    ? lesson.titleEn
                                    : lesson.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                                {hasExercises && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300">
                                    +{lesson.appliedExercises!.length} BT
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400">
                                  {lesson.durationMinutes}m
                                </span>
                              </div>
                            </button>

                            {/* Sub-exercises */}
                            {activeLesson.id === lesson.id && hasExercises && (
                              <div className="pl-6 pr-2 py-1 space-y-1 border-l-2 border-indigo-200 dark:border-indigo-900 ml-4 my-1">
                                {lesson.appliedExercises!.map((ex) => {
                                  const isExActive = activeExercise?.id === ex.id;
                                  return (
                                    <button
                                      key={ex.id}
                                      onClick={() => {
                                        onSelectExercise(ex);
                                        if (window.innerWidth < 1024) onToggleSidebarExpanded(false);
                                      }}
                                      className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] flex items-center justify-between transition-colors cursor-pointer ${
                                        isExActive
                                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30'
                                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5 truncate">
                                        <Target className="w-3 h-3 text-amber-500 shrink-0" />
                                        <span className="truncate">
                                          [{ex.questionCode}]{' '}
                                          {docLang === 'en' ? ex.titleEn : ex.titleVi}
                                        </span>
                                      </div>
                                      <span className="text-[9px] text-slate-400 shrink-0 ml-1">
                                        Test
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer: Next Lesson Action */}
            {nextLessonCandidate && (
              <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 shrink-0">
                <button
                  onClick={() => {
                    onSelectLesson(nextLessonCandidate);
                    if (window.innerWidth < 1024) onToggleSidebarExpanded(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">
                      Bài tiếp theo:{' '}
                      {docLang === 'en' && nextLessonCandidate.titleEn
                        ? nextLessonCandidate.titleEn
                        : nextLessonCandidate.title}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 shrink-0" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
