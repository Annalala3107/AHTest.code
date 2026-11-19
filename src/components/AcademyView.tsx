import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { AcademyCourse, AcademyLesson, AppliedExercise } from '../types/index.ts';
import { mockCourses } from '../data/academy/index.ts';
import {
  executeCodeAsync,
  type ExecutionResult,
  type PedagogicalDiagnosis,
  generatePedagogicalDiagnosis,
} from '../services/executionManager.ts';
import { CodeEditor } from './CodeEditor.tsx';
import confetti from 'canvas-confetti';
import { recordStreakActivity } from '../services/streakService.ts';
import { showToast } from '../services/uiFeedback.ts';
import { useBreakpointLg } from '../hooks/useBreakpointLg.ts';
import { useCodeDraft } from '../hooks/useCodeDraft.ts';
import { useResizablePanels } from '../hooks/useResizablePanels.ts';
import { EditorCharGauge } from './shared/IDEPrimitives.tsx';
import { AcademyBreadcrumbBar } from './academy/AcademyBreadcrumbBar.tsx';
import { AcademyCurriculumSidebar } from './academy/AcademyCurriculumSidebar.tsx';
import { AcademyLessonPane } from './academy/AcademyLessonPane.tsx';
import { AcademyConsoleDrawer } from './academy/AcademyConsoleDrawer.tsx';
import { ComingSoonModal, GraduationModal } from './academy/AcademyModals.tsx';

function getAcademyDraftKey(courseId: string, lessonId: string, exerciseId?: string | null): string {
  return `ahtest_draft_academy_${courseId}_${lessonId}_${exerciseId || 'theory'}`;
}

export const AcademyView: React.FC = () => {
  const isLgScreen = useBreakpointLg();
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse>(mockCourses[0]);
  const [activeLesson, setActiveLesson] = useState<AcademyLesson>(() => {
    return mockCourses[0].modules[0]?.lessons[0] || ({} as AcademyLesson);
  });
  const [activeExercise, setActiveExercise] = useState<AppliedExercise | null>(null);
  const [activeDocTab, setActiveDocTab] = useState<'theory' | 'testcases' | 'exercises'>('theory');

  const [docLang, setDocLang] = useState<'vi' | 'en'>(() => {
    try {
      return (localStorage.getItem('ahtest_academy_lang') as 'vi' | 'en') || 'vi';
    } catch {
      return 'vi';
    }
  });

  const handleToggleLang = (lang: 'vi' | 'en') => {
    setDocLang(lang);
    try {
      localStorage.setItem('ahtest_academy_lang', lang);
    } catch {
      // ignore
    }
  };

  // Execution & Output State
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [pedagogicalDiagnosis, setPedagogicalDiagnosis] = useState<PedagogicalDiagnosis | null>(null);
  const [exercisePassed, setExercisePassed] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copiedTestIdx, setCopiedTestIdx] = useState<number | null>(null);
  const [diffState, setDiffState] = useState<{ actual: string; expected: string; input?: string; isFailed: boolean } | null>(null);

  // Completed Lessons
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`ahtest_completed_${mockCourses[0]?.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const completedCount = completedLessons.length;
  const progressPercent = Math.min(
    100,
    Math.round((completedCount / (selectedCourse.totalLessons || 1)) * 100)
  );

  // Layout states
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'theory' | 'editor'>('theory');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
  const [comingSoonTrack, setComingSoonTrack] = useState<AcademyCourse | null>(null);
  const [showGraduationModal, setShowGraduationModal] = useState<boolean>(false);

  // Code Draft Hook
  const draftKey = getAcademyDraftKey(selectedCourse.id, activeLesson.id, activeExercise?.id);
  const defaultCode = activeExercise ? activeExercise.initialCode : activeLesson.initialCode || '';
  const {
    code: userCode,
    setCode: setUserCode,
    draftSaved,
    handleCodeChange,
    resetDraft,
    flushPendingDraft,
  } = useCodeDraft({
    draftKey,
    defaultCode,
    debounceMs: 600,
  });

  // Resizable Panels
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorColumnRef = useRef<HTMLDivElement | null>(null);
  const {
    leftPaneWidth: splitPercent,
    setLeftPaneWidth: setSplitPercent,
    consoleHeight,
    setConsoleHeight,
    isDraggingSplitter,
    setIsDraggingSplitter,
    isDraggingConsole,
    setIsDraggingConsole,
    showConsole,
    setShowConsole,
    isConsoleMaximized,
    setIsConsoleMaximized,
  } = useResizablePanels({
    storagePrefix: 'ahtest_academy',
    defaultLeftWidth: 50,
    defaultConsoleHeight: 260,
    minLeftWidth: 25,
    maxLeftWidth: 75,
    containerRef,
    editorColumnRef,
  });

  // Monaco Editor Ref
  const editorRef = useRef<{ jumpToLine: (line: number, col?: number) => void } | null>(null);
  const handleJumpToLine = (line: number, col: number = 1) => {
    editorRef.current?.jumpToLine(line, col);
  };

  // Switch Course
  const handleSelectCourse = (course: AcademyCourse) => {
    if (course.isComingSoon) {
      setComingSoonTrack(course);
      return;
    }
    setSelectedCourse(course);
    setActiveExercise(null);
    if (course.modules[0]?.lessons[0]) {
      const firstLesson = course.modules[0].lessons[0];
      setActiveLesson(firstLesson);
      const saved = localStorage.getItem(getAcademyDraftKey(course.id, firstLesson.id, null));
      setUserCode(saved !== null ? saved : firstLesson.initialCode || '');
      setExecutionOutput(null);
      setExercisePassed(false);
      setDiffState(null);
      setPedagogicalDiagnosis(null);
    }
  };

  // Switch Lesson
  const handleSelectLesson = (lesson: AcademyLesson) => {
    flushPendingDraft();
    setActiveLesson(lesson);
    setActiveExercise(null);
    setActiveDocTab('theory');
    const saved = localStorage.getItem(getAcademyDraftKey(selectedCourse.id, lesson.id, null));
    setUserCode(saved !== null ? saved : lesson.initialCode || '');
    setExecutionOutput(null);
    setExercisePassed(false);
    setDiffState(null);
    setPedagogicalDiagnosis(null);
  };

  // Switch Exercise
  const handleSelectExercise = (ex: AppliedExercise) => {
    flushPendingDraft();
    setActiveExercise(ex);
    setActiveDocTab('theory');
    const saved = localStorage.getItem(getAcademyDraftKey(selectedCourse.id, activeLesson.id, ex.id));
    setUserCode(saved !== null ? saved : ex.initialCode || '');
    setExecutionOutput(null);
    setExercisePassed(false);
    setDiffState(null);
    setPedagogicalDiagnosis(null);
  };

  const handleBackToLesson = () => {
    flushPendingDraft();
    setActiveExercise(null);
    setActiveDocTab('theory');
    const saved = localStorage.getItem(getAcademyDraftKey(selectedCourse.id, activeLesson.id, null));
    setUserCode(saved !== null ? saved : activeLesson.initialCode || '');
  };

  // Calculate next lesson candidate
  const nextLessonCandidate = useMemo(() => {
    let foundCurrent = false;
    for (const mod of selectedCourse.modules) {
      for (const les of mod.lessons) {
        if (foundCurrent) return les;
        if (les.id === activeLesson.id) foundCurrent = true;
      }
    }
    return null;
  }, [selectedCourse, activeLesson]);

  const handleNextLesson = () => {
    if (nextLessonCandidate) {
      handleSelectLesson(nextLessonCandidate);
      showToast(`Chuyển sang bài tiếp theo: ${nextLessonCandidate.title}`, 'info');
    }
  };

  // Current Testcases
  const currentTestcases = useMemo(() => {
    if (activeExercise) return activeExercise.testcases;
    return activeLesson.testcases || [];
  }, [activeExercise, activeLesson]);

  const handleCopyInput = (input: string, idx: number) => {
    try {
      navigator.clipboard.writeText(input);
      setCopiedTestIdx(idx);
      setTimeout(() => setCopiedTestIdx(null), 2000);
    } catch {
      // ignore
    }
  };

  // Code Execution Engine
  const resolveAcademyLang = (courseLang?: string) => {
    if (courseLang === 'cpp') return 'cpp20';
    if (courseLang === 'python') return 'py3';
    return 'c17';
  };

  const handleRunCode = async () => {
    if (isRunning) return;
    flushPendingDraft();
    if (!isLgScreen) setMobileActiveTab('editor');
    setIsRunning(true);
    setShowConsole(true);
    setExecutionOutput('Đang khởi chạy sandbox và thực thi mã...');
    setPedagogicalDiagnosis(null);
    setExercisePassed(false);
    setDiffState(null);

    const judgeLang = resolveAcademyLang(selectedCourse.language);

    if (userCode.length > 65536) {
      setIsRunning(false);
      const diag = generatePedagogicalDiagnosis('CE', 'MAX_CODE_LENGTH_EXCEEDED', userCode);
      setPedagogicalDiagnosis(diag || null);
      setExecutionOutput(
        `[Lỗi dung lượng: TỐI ĐA 65,536 KÝ TỰ]\nMã nguồn hiện tại chứa ${userCode.length.toLocaleString(
          'vi-VN'
        )} ký tự, vượt quá giới hạn tối đa 65,536 ký tự.`
      );
      return;
    }

    const targetTestcases = currentTestcases;
    if (targetTestcases.length > 0) {
      let allPassed = true;
      let totalTime = 0;
      let maxMemory = 0;
      const resultsSummary: string[] = [];
      let firstFailedDiff: { actual: string; expected: string; input?: string; isFailed: boolean } | null = null;
      let lastExecResult: ExecutionResult | null = null;

      for (let i = 0; i < targetTestcases.length; i++) {
        const tc = targetTestcases[i];
        const exec = await executeCodeAsync(judgeLang, userCode, tc.input);
        lastExecResult = exec;
        totalTime += exec.executionTimeMs;
        if (exec.memoryKb > maxMemory) maxMemory = exec.memoryKb;

        if (exec.status === 'CE') {
          setIsRunning(false);
          setExecutionOutput(`[Biên dịch thất bại: COMPILE ERROR]\n${exec.stderr}`);
          setPedagogicalDiagnosis(exec.pedagogicalDiagnosis || null);
          return;
        }

        if (exec.status === 'RTE') {
          setIsRunning(false);
          setExecutionOutput(`[Lỗi thực thi: RUNTIME ERROR]\n${exec.stderr}`);
          setPedagogicalDiagnosis(exec.pedagogicalDiagnosis || null);
          return;
        }

        if (exec.status === 'TLE') {
          setIsRunning(false);
          setExecutionOutput(`[Vượt quá thời gian: TIME LIMIT EXCEEDED]\n${exec.stderr}`);
          setPedagogicalDiagnosis(exec.pedagogicalDiagnosis || null);
          return;
        }

        const normActual = exec.stdout.replace(/\r\n/g, '\n').trim();
        const normExpected = tc.expectedOutput.replace(/\r\n/g, '\n').trim();

        if (normActual === normExpected) {
          resultsSummary.push(`✅ Test ${i + 1}: Passed (${exec.executionTimeMs}ms, ${exec.memoryKb}KB)`);
        } else {
          allPassed = false;
          resultsSummary.push(`❌ Test ${i + 1}: Failed`);
          if (!firstFailedDiff) {
            firstFailedDiff = {
              actual: exec.stdout,
              expected: tc.expectedOutput,
              input: tc.input,
              isFailed: true,
            };
          }
        }
      }

      setIsRunning(false);

      if (allPassed) {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        let output = `[Auto-Grading Verdict: ACCEPTED (100/100)]\n` + resultsSummary.join('\n');
        output += `\n\nThời gian: ${totalTime}ms | Bộ nhớ tối đa: ${maxMemory}KB`;
        setExecutionOutput(output);
        setExercisePassed(true);
        recordStreakActivity();

        setCompletedLessons((prev) => {
          if (!prev.includes(activeLesson.id)) {
            const next = [...prev, activeLesson.id];
            try {
              localStorage.setItem(`ahtest_completed_${selectedCourse.id}`, JSON.stringify(next));
            } catch {
              // ignore
            }
            return next;
          }
          return prev;
        });
      } else {
        setExecutionOutput(`[Chưa đạt yêu cầu]\n` + resultsSummary.join('\n'));
        if (firstFailedDiff) {
          setDiffState(firstFailedDiff);
        }
        if (lastExecResult?.pedagogicalDiagnosis) {
          setPedagogicalDiagnosis(lastExecResult.pedagogicalDiagnosis);
        }
      }
    } else {
      const res = await executeCodeAsync(judgeLang, userCode, '');
      setIsRunning(false);
      setExecutionOutput(res.stderr ? `${res.stderr}\n${res.stdout}` : res.stdout);
      if (res.pedagogicalDiagnosis) {
        setPedagogicalDiagnosis(res.pedagogicalDiagnosis);
      }
    }
  };

  // Keyboard Shortcuts
  const runCodeRef = useRef(handleRunCode);
  const nextLessonRef = useRef(handleNextLesson);

  useEffect(() => {
    runCodeRef.current = handleRunCode;
    nextLessonRef.current = handleNextLesson;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        runCodeRef.current();
      } else if (e.shiftKey && e.key === 'Enter' && exercisePassed) {
        e.preventDefault();
        nextLessonRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [exercisePassed]);

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <AcademyBreadcrumbBar
        selectedCourse={selectedCourse}
        activeLesson={activeLesson}
        activeExercise={activeExercise}
        activeModule={selectedCourse.modules.find((m) =>
          m.lessons.some((l) => l.id === activeLesson.id)
        )}
        docLang={docLang}
        onToggleDocLang={handleToggleLang}
        onSelectCourse={handleSelectCourse}
        completedCount={completedCount}
        progressPercent={progressPercent}
        draftSaved={draftSaved}
        isZenMode={isZenMode}
        onToggleZenMode={() => setIsZenMode(!isZenMode)}
        splitPercent={splitPercent}
        onSetSplitPercent={setSplitPercent}
        isRunning={isRunning}
        userCodeLength={userCode.length}
        onRunCode={handleRunCode}
        exercisePassed={exercisePassed}
        nextLessonCandidate={nextLessonCandidate}
        onNextLesson={handleNextLesson}
        onShowGraduationModal={() => setShowGraduationModal(true)}
      />

      {/* Main Split Layout */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
        {/* Left Curriculum Sidebar */}
        {!isZenMode && (
          <AcademyCurriculumSidebar
            selectedCourse={selectedCourse}
            activeLesson={activeLesson}
            activeExercise={activeExercise}
            completedLessons={completedLessons}
            docLang={docLang}
            isSidebarExpanded={isSidebarExpanded}
            onToggleSidebarExpanded={setIsSidebarExpanded}
            onSelectLesson={handleSelectLesson}
            onSelectExercise={handleSelectExercise}
            nextLessonCandidate={nextLessonCandidate}
          />
        )}

        {/* Lesson Theory & Exercises Pane */}
        {(!isZenMode && (isLgScreen || mobileActiveTab === 'theory')) && (
          <div
            style={{ width: isLgScreen && !isZenMode ? `${splitPercent}%` : '100%' }}
            className="h-full flex flex-col shrink-0 overflow-hidden border-r border-slate-200 dark:border-slate-800"
          >
            <AcademyLessonPane
              activeLesson={activeLesson}
              activeExercise={activeExercise}
              activeDocTab={activeDocTab}
              setActiveDocTab={setActiveDocTab}
              currentTestcases={currentTestcases}
              docLang={docLang}
              onBackToLesson={handleBackToLesson}
              onSelectExercise={handleSelectExercise}
              copiedTestIdx={copiedTestIdx}
              onCopyInput={handleCopyInput}
            />
          </div>
        )}

        {/* Resizer Splitter */}
        {isLgScreen && !isZenMode && (
          <div
            onMouseDown={() => setIsDraggingSplitter(true)}
            className={`w-1.5 hover:w-2 bg-slate-200 dark:bg-slate-800 hover:bg-indigo-500 cursor-col-resize transition-all shrink-0 z-30 ${
              isDraggingSplitter ? 'bg-indigo-500 w-2' : ''
            }`}
            title="Kéo sang trái/phải để điều chỉnh độ rộng màn hình"
          />
        )}

        {/* Code Editor & Console Drawer */}
        {(isLgScreen || mobileActiveTab === 'editor') && (
          <div
            ref={editorColumnRef}
            style={{ width: isLgScreen && !isZenMode ? `${100 - splitPercent}%` : '100%' }}
            className="flex-1 flex flex-col h-full bg-slate-900 overflow-hidden relative"
          >
            {/* Editor Subheader */}
            <div className="h-9 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-mono text-slate-400 font-semibold">
                main.{selectedCourse.language === 'cpp' ? 'cpp' : selectedCourse.language === 'python' ? 'py' : 'c'}
              </span>
              <EditorCharGauge
                charCount={userCode.length}
                draftSaved={draftSaved}
                onResetCode={() => resetDraft(defaultCode)}
              />
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 overflow-hidden relative">
              <CodeEditor
                ref={editorRef}
                value={userCode}
                onChange={handleCodeChange}
                language={selectedCourse.language === 'cpp' ? 'cpp' : selectedCourse.language === 'python' ? 'python' : 'c'}
              />
            </div>

            {/* Console Resizer Bar */}
            <div
              onMouseDown={() => setIsDraggingConsole(true)}
              className={`h-1.5 hover:h-2 bg-slate-800 hover:bg-indigo-500 cursor-row-resize transition-all shrink-0 z-30 ${
                isDraggingConsole ? 'bg-indigo-500 h-2' : ''
              }`}
              title="Kéo lên/xuống để điều chỉnh chiều cao Console"
            />

            {/* Bottom Console Drawer */}
            <AcademyConsoleDrawer
              isConsoleCollapsed={!showConsole}
              setIsConsoleCollapsed={(collapsed) => setShowConsole(!collapsed)}
              consoleHeight={consoleHeight}
              setConsoleHeight={setConsoleHeight}
              isConsoleMaximized={isConsoleMaximized}
              setIsConsoleMaximized={setIsConsoleMaximized}
              isRunning={isRunning}
              exercisePassed={exercisePassed}
              executionOutput={executionOutput}
              onClearOutput={() => {
                setExecutionOutput(null);
                setDiffState(null);
                setPedagogicalDiagnosis(null);
              }}
              diffState={diffState}
              pedagogicalDiagnosis={pedagogicalDiagnosis}
              onJumpToLine={handleJumpToLine}
              nextLessonCandidate={nextLessonCandidate}
              onNextLesson={handleNextLesson}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <ComingSoonModal
        track={comingSoonTrack}
        docLang={docLang}
        onClose={() => setComingSoonTrack(null)}
        onSwitchTrack={() => {
          setComingSoonTrack(null);
          showToast('Đã đăng ký nhận tin lộ trình mới!', 'success');
        }}
      />

      <GraduationModal
        isOpen={showGraduationModal}
        course={selectedCourse}
        onClose={() => setShowGraduationModal(false)}
        onReviewFirstLesson={() => {
          setShowGraduationModal(false);
          handleSelectLesson(selectedCourse.modules[0].lessons[0]);
        }}
      />
    </div>
  );
};
