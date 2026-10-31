import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  Code2, 
  Layers, 
  Trophy,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Terminal,
  Target,
  Lock,
  Save,
  PanelLeft,
  PanelLeftClose
} from 'lucide-react';
import { AcademyCourse, AcademyLesson, AppliedExercise } from '../types';
import { mockCourses } from '../data/academy';
import { KaTeXRenderer } from './KaTeXRenderer';
import { DiffViewer } from './DiffViewer';
import { executeCCode, ExecutionResult } from '../services/cExecutionEngine';
import { CodeEditor } from './CodeEditor';

export const AcademyView: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse>(mockCourses[0]);
  const [activeLesson, setActiveLesson] = useState<AcademyLesson>(
    mockCourses[0].modules[0]?.lessons[0] || ({} as AcademyLesson)
  );
  const [activeExercise, setActiveExercise] = useState<AppliedExercise | null>(null);
  const [activeDocTab, setActiveDocTab] = useState<'theory' | 'testcases' | 'exercises'>('theory');

  const [docLang, setDocLang] = useState<'vi' | 'en'>(() => {
    return (localStorage.getItem('ahtest_academy_lang') as 'vi' | 'en') || 'vi';
  });

  const [userCode, setUserCode] = useState<string>(activeLesson.initialCode || '');
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [exercisePassed, setExercisePassed] = useState<boolean>(false);
  const [showHintIndex, setShowHintIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copiedTestIdx, setCopiedTestIdx] = useState<number | null>(null);
  const [diffState, setDiffState] = useState<{ actual: string; expected: string; input?: string; isFailed: boolean } | null>(null);
  
  // Splitter & Workspace Responsive States
  const [splitPercent, setSplitPercent] = useState<number>(() => {
    const saved = localStorage.getItem('ahtest_academy_split');
    return saved ? Math.min(75, Math.max(25, Number(saved))) : 46;
  });
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isDraggingSplitter, setIsDraggingSplitter] = useState<boolean>(false);

  const workspaceContainerRef = useRef<HTMLDivElement>(null);
  const academyMonacoRef = useRef<any>(null);

  // Helper for unique localStorage draft key per lesson / exercise
  const getDraftKey = (courseId: string, lessonId: string, exerciseId?: string | null) => {
    return `ahtest_draft_academy_${courseId}_${lessonId}_${exerciseId || 'theory'}`;
  };

  const [draftSaved, setDraftSaved] = useState<boolean>(() => {
    const key = `ahtest_draft_academy_${mockCourses[0]?.id}_${mockCourses[0]?.modules[0]?.lessons[0]?.id}_theory`;
    return typeof window !== 'undefined' && localStorage.getItem(key) !== null;
  });

  // Mouse drag event listeners for resizing splitter
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSplitter || !workspaceContainerRef.current) return;
      const rect = workspaceContainerRef.current.getBoundingClientRect();
      const newPercent = ((e.clientX - rect.left) / rect.width) * 100;
      if (newPercent >= 25 && newPercent <= 75) {
        setSplitPercent(Math.round(newPercent));
        localStorage.setItem('ahtest_academy_split', Math.round(newPercent).toString());
      }
    };

    const handleMouseUp = () => {
      if (isDraggingSplitter) {
        setIsDraggingSplitter(false);
      }
    };

    if (isDraggingSplitter) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSplitter]);

  // Load draft on initial mount
  useEffect(() => {
    const key = getDraftKey(selectedCourse.id, activeLesson.id, activeExercise?.id);
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      setUserCode(saved);
      setDraftSaved(true);
    }
  }, []);

  const handleToggleLang = (lang: 'vi' | 'en') => {
    setDocLang(lang);
    localStorage.setItem('ahtest_academy_lang', lang);
  };

  const handleCodeChange = (newCode: string) => {
    setUserCode(newCode);
    const key = getDraftKey(selectedCourse.id, activeLesson.id, activeExercise?.id);
    localStorage.setItem(key, newCode);
    setDraftSaved(true);
  };

  const handleResetCode = () => {
    const key = getDraftKey(selectedCourse.id, activeLesson.id, activeExercise?.id);
    localStorage.removeItem(key);
    const defaultCode = activeExercise ? activeExercise.initialCode : activeLesson.initialCode;
    setUserCode(defaultCode);
    setDraftSaved(false);
  };

  const handleSelectLesson = (lesson: AcademyLesson) => {
    setActiveLesson(lesson);
    setActiveExercise(null);
    setActiveDocTab('theory');
    const key = getDraftKey(selectedCourse.id, lesson.id, null);
    const saved = localStorage.getItem(key);
    setUserCode(saved !== null ? saved : lesson.initialCode);
    setDraftSaved(saved !== null);
    setExecutionOutput(null);
    setExercisePassed(false);
    setShowHintIndex(-1);
    setDiffState(null);
  };

  const handleSelectExercise = (exercise: AppliedExercise) => {
    setActiveExercise(exercise);
    setActiveDocTab('theory');
    const key = getDraftKey(selectedCourse.id, activeLesson.id, exercise.id);
    const saved = localStorage.getItem(key);
    setUserCode(saved !== null ? saved : exercise.initialCode);
    setDraftSaved(saved !== null);
    setExecutionOutput(null);
    setExercisePassed(false);
    setShowHintIndex(-1);
    setDiffState(null);
  };

  const handleBackToLesson = () => {
    setActiveExercise(null);
    setActiveDocTab('theory');
    const key = getDraftKey(selectedCourse.id, activeLesson.id, null);
    const saved = localStorage.getItem(key);
    setUserCode(saved !== null ? saved : activeLesson.initialCode);
    setDraftSaved(saved !== null);
    setExecutionOutput(null);
    setExercisePassed(false);
    setShowHintIndex(-1);
    setDiffState(null);
  };

  const handleCopyInput = (input: string, idx: number) => {
    navigator.clipboard.writeText(input);
    setCopiedTestIdx(idx);
    setTimeout(() => setCopiedTestIdx(null), 2000);
  };

  // Find next lesson helper
  const getNextLesson = (): AcademyLesson | null => {
    for (let mIdx = 0; mIdx < selectedCourse.modules.length; mIdx++) {
      const mod = selectedCourse.modules[mIdx];
      const lIdx = mod.lessons.findIndex(l => l.id === activeLesson.id);
      if (lIdx !== -1) {
        if (lIdx + 1 < mod.lessons.length) {
          return mod.lessons[lIdx + 1];
        } else if (mIdx + 1 < selectedCourse.modules.length && selectedCourse.modules[mIdx + 1].lessons.length > 0) {
          return selectedCourse.modules[mIdx + 1].lessons[0];
        }
      }
    }
    return null;
  };

  const handleNextLesson = () => {
    const next = getNextLesson();
    if (next) {
      handleSelectLesson(next);
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setExecutionOutput(null);
    setExercisePassed(false);
    setDiffState(null);

    setTimeout(() => {
      setIsRunning(false);
      
      const targetTestcases = activeExercise 
        ? activeExercise.testcases 
        : (activeLesson.testcases && activeLesson.testcases.length > 0 ? activeLesson.testcases : []);

      if (targetTestcases.length > 0) {
        let allPassed = true;
        let totalTime = 0;
        let maxMemory = 0;
        const resultsSummary: string[] = [];
        let firstFailed: { tc: any; exec: ExecutionResult } | null = null;
        let lastExecResult: ExecutionResult | null = null;

        for (let i = 0; i < targetTestcases.length; i++) {
          const tc = targetTestcases[i];
          const exec = executeCCode(userCode, tc.input);
          lastExecResult = exec;

          totalTime += exec.executionTimeMs;
          if (exec.memoryKb > maxMemory) maxMemory = exec.memoryKb;

          // If Compile Error
          if (exec.status === 'CE') {
            setExecutionOutput(`[Biên dịch thất bại: COMPILE ERROR]\n${exec.stderr}`);
            setExercisePassed(false);
            setDiffState(null);
            return;
          }

          // If Runtime Error
          if (exec.status === 'RTE') {
            setExecutionOutput(`[Lỗi thực thi: RUNTIME ERROR]\n${exec.stderr}`);
            setExercisePassed(false);
            setDiffState({
              actual: `RUNTIME ERROR:\n${exec.stderr}`,
              expected: tc.expectedOutput,
              input: tc.input,
              isFailed: true,
            });
            return;
          }

          // If Time Limit Exceeded
          if (exec.status === 'TLE') {
            setExecutionOutput(
              `[Vượt quá thời gian: TIME LIMIT EXCEEDED]\n${exec.stderr}\n[Gợi ý]: Vòng lặp while/for không có điều kiện dừng thích hợp.`
            );
            setExercisePassed(false);
            setDiffState(null);
            return;
          }

          // Output comparison: normalize CRLF and trim whitespace
          const normActual = exec.stdout.replace(/\r\n/g, '\n').trim();
          const normExpected = tc.expectedOutput.replace(/\r\n/g, '\n').trim();

          if (normActual === normExpected) {
            resultsSummary.push(`✅ Test ${i + 1}: Passed (${exec.executionTimeMs}ms, ${exec.memoryKb}KB)`);
          } else {
            allPassed = false;
            resultsSummary.push(`❌ Test ${i + 1}: Failed`);
            if (!firstFailed) {
              firstFailed = { tc, exec };
            }
          }
        }

        // Didactic verification for special lessons (e.g. pointer swap must use pointers)
        if (activeLesson.id === 'c-2-memory-swap' && (!userCode.includes('*') || !userCode.includes('&'))) {
          allPassed = false;
          resultsSummary.push(`⚠️ Yêu cầu phương pháp: Bài học yêu cầu bắt buộc truyền con trỏ swap(int *a, int *b) và gọi swap(&x, &y).`);
        }
        if (activeLesson.id === 'c-2-dynamic-alloc' && (!userCode.includes('malloc') || !userCode.includes('free'))) {
          allPassed = false;
          resultsSummary.push(`⚠️ Yêu cầu phương pháp: Bắt buộc dùng malloc() để xin RAM và free() để giải phóng.`);
        }

        if (allPassed) {
          let output = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n` + resultsSummary.join('\n');
          output += `\n\nThời gian thực thi: ${totalTime}ms | Bộ nhớ tối đa: ${maxMemory}KB`;
          if (lastExecResult?.heapReport) {
            if (lastExecResult.heapReport.hasMemoryLeak) {
              output += `\n⚠️ Cảnh báo Memory Leak: Còn ${lastExecResult.heapReport.activeBlocks} khối Heap chưa được giải phóng!`;
            } else if (lastExecResult.heapReport.totalAllocated > 0) {
              output += `\n🛡️ Kiểm tra an toàn bộ nhớ: Đã giải phóng 100% (${lastExecResult.heapReport.totalFreed} bytes Heap). Không có rò rỉ RAM!`;
            }
          }
          setExecutionOutput(output);
          setExercisePassed(true);
          setDiffState({
            actual: targetTestcases[0].expectedOutput,
            expected: targetTestcases[0].expectedOutput,
            input: targetTestcases[0].input,
            isFailed: false,
          });
        } else {
          const failedTc = firstFailed ? firstFailed.tc : targetTestcases[0];
          const failedExec = firstFailed ? firstFailed.exec : (lastExecResult || executeCCode(userCode, failedTc.input));
          let output = `[FPTU Auto-Grading Verdict: WRONG ANSWER]\n` + resultsSummary.join('\n');
          output += `\n\n❌ Test case thất bại đầu tiên: Input "${failedTc.input}"`;
          setExecutionOutput(output);
          setExercisePassed(false);
          setDiffState({
            actual: failedExec.stdout,
            expected: failedTc.expectedOutput,
            input: failedTc.input,
            isFailed: true,
          });
        }
      } else {
        // Freeform lesson without strict testcases
        const exec = executeCCode(userCode, '');
        if (exec.status === 'CE') {
          setExecutionOutput(`[Biên dịch thất bại: COMPILE ERROR]\n${exec.stderr}`);
          setExercisePassed(false);
        } else if (exec.status === 'RTE') {
          setExecutionOutput(`[Lỗi thực thi: RUNTIME ERROR]\n${exec.stderr}`);
          setExercisePassed(false);
        } else if (exec.status === 'TLE') {
          setExecutionOutput(`[Vượt quá thời gian: TIME LIMIT EXCEEDED]\n${exec.stderr}`);
          setExercisePassed(false);
        } else {
          let output = `[Biên dịch & Thực thi Thành Công (exit code 0)]\n`;
          output += exec.stdout ? `Output:\n${exec.stdout}\n` : `(Chương trình không xuất output ra stdout)\n`;
          output += `Thời gian: ${exec.executionTimeMs}ms | Bộ nhớ: ${exec.memoryKb}KB`;
          if (exec.heapReport?.hasMemoryLeak) {
            output += `\n⚠️ Cảnh báo: Rò rỉ bộ nhớ Heap (chưa gọi free())!`;
          }
          setExecutionOutput(output);
          setExercisePassed(true);
        }
      }
    }, 350);
  };

  const currentHints = activeExercise 
    ? (docLang === 'en' ? activeExercise.hintsEn : activeExercise.hintsVi)
    : (docLang === 'en' && activeLesson.hintsEn ? activeLesson.hintsEn : activeLesson.hints);

  const currentTestcases = activeExercise 
    ? activeExercise.testcases 
    : (activeLesson.testcases || []);

  const nextLessonCandidate = getNextLesson();

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
      
      {/* 1. TOP NAVIGATION & WORKSPACE TOOLBAR (Compact ~52px) */}
      <div className="h-13 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between shrink-0 z-30 select-none">
        
        {/* Left: Curriculum Toggle & Breadcrumb / Track Switcher */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSidebarOpen
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Đóng / Mở danh mục lộ trình bài học"
          >
            {isSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeft className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Lộ trình ({selectedCourse.totalLessons})</span>
          </button>

          {/* Track Switcher */}
          <div className="hidden sm:flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs">
            {mockCourses.map((c) => {
              const isSelected = selectedCourse.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCourse(c);
                    setActiveExercise(null);
                    if (!c.isComingSoon && c.modules[0]?.lessons[0]) {
                      setActiveLesson(c.modules[0].lessons[0]);
                      setUserCode(c.modules[0].lessons[0].initialCode);
                      setExecutionOutput(null);
                      setExercisePassed(false);
                    }
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>
                    {c.language === 'c' 
                      ? 'C Track' 
                      : c.language === 'cpp' 
                      ? 'C++ Track' 
                      : 'Python'}
                  </span>
                  {c.isComingSoon && (
                    <span className="px-1 py-0.2 text-[8px] font-bold rounded bg-amber-500/20 text-amber-500">
                      Sắp có
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Lesson Breadcrumb */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate pl-2 border-l border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {activeExercise
                ? `[${activeExercise.questionCode}] ${docLang === 'en' ? activeExercise.titleEn : activeExercise.titleVi}`
                : docLang === 'en' && activeLesson.titleEn ? activeLesson.titleEn : activeLesson.title}
            </span>
          </div>
        </div>

        {/* Right: Bilingual Switcher, Split Presets, Zen Mode, Run Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Draft Saved Status */}
          {draftSaved && (
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
              <Save className="w-3 h-3 text-emerald-500" />
              <span>Đã lưu nháp</span>
            </span>
          )}

          {/* Single Bilingual Switcher (VI / EN) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs">
            <button
              onClick={() => handleToggleLang('vi')}
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                docLang === 'vi'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tiếng Việt"
            >
              🇻🇳 VI
            </button>
            <button
              onClick={() => handleToggleLang('en')}
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                docLang === 'en'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="English (Exam Mode)"
            >
              🇬🇧 EN
            </button>
          </div>

          {/* Zen Mode Button */}
          <button
            onClick={() => setIsZenMode(!isZenMode)}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              isZenMode
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={isZenMode ? "Thoát Zen Mode (Hiện lại Lý thuyết)" : "Bật Zen Mode (Toàn màn hình Code)"}
          >
            <span className="text-[11px] font-bold">{isZenMode ? 'Hiện Lý thuyết' : 'Zen Code'}</span>
          </button>

          {/* Quick Split Ratio Selector */}
          {!isZenMode && (
            <div className="hidden xl:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setSplitPercent(40)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${splitPercent === 40 ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'hover:text-slate-800 dark:hover:text-slate-200'}`}
                title="Tỷ lệ: Lý thuyết 40% - Code 60%"
              >
                4:6
              </button>
              <button
                onClick={() => setSplitPercent(50)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${splitPercent === 50 ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'hover:text-slate-800 dark:hover:text-slate-200'}`}
                title="Tỷ lệ: Lý thuyết 50% - Code 50%"
              >
                5:5
              </button>
              <button
                onClick={() => setSplitPercent(60)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${splitPercent === 60 ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'hover:text-slate-800 dark:hover:text-slate-200'}`}
                title="Tỷ lệ: Lý thuyết 60% - Code 40%"
              >
                6:4
              </button>
            </div>
          )}

          {/* Reset Code */}
          <button
            onClick={handleResetCode}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đặt lại code ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Run Code / Submit Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            title="Phím tắt: Ctrl + Enter"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">{isRunning ? 'Đang chấm...' : 'Chạy thử'}</span>
            <kbd className="hidden md:inline-block ml-0.5 px-1 py-0.2 rounded text-[9px] bg-indigo-700 text-indigo-200 font-mono">
              Ctrl+↵
            </kbd>
          </button>
        </div>
      </div>

      {/* 2. MAIN SPLIT-SCREEN WORKSPACE WITH REAL DRAGGABLE SPLITTER */}
      {selectedCourse.isComingSoon ? (
        /* Coming Soon Screen */
        <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
          <div className="max-w-md text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Giáo Trình {selectedCourse.title} Đang Được Biên Soạn
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Khóa học này sẽ sớm ra mắt với các bài giảng tương tác và thử thách Wasm sandbox độc quyền. Hãy trải nghiệm Giáo trình C Track chuẩn chỉnh có sẵn ngay hôm nay!
            </p>
            <button
              onClick={() => {
                setSelectedCourse(mockCourses[0]);
                setActiveExercise(null);
                setActiveLesson(mockCourses[0].modules[0].lessons[0]);
                setUserCode(mockCourses[0].modules[0].lessons[0].initialCode);
              }}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              Chuyển sang C Track (Dev-Cpp) →
            </button>
          </div>
        </div>
      ) : (
        <div 
          ref={workspaceContainerRef}
          className={`flex-1 flex flex-col lg:flex-row overflow-hidden relative ${isDraggingSplitter ? 'cursor-col-resize select-none' : ''}`}
        >
          {/* COLLAPSIBLE SIDEBAR: Curriculum Drawer */}
          {isSidebarOpen && (
            <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 z-20 shadow-md">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {docLang === 'en' ? selectedCourse.titleEn : selectedCourse.title}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {selectedCourse.totalLessons} bài học • {selectedCourse.estimatedHours} giờ học
                  </span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>

              {/* Module & Lesson List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {selectedCourse.modules.map((module) => (
                  <div key={module.id} className="space-y-1.5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-2">
                      <Layers className="w-3 h-3 text-indigo-500" />
                      <span>{docLang === 'en' && module.titleEn ? module.titleEn : module.title}</span>
                    </h4>
                    
                    <div className="space-y-1">
                      {module.lessons.map((lesson, idx) => {
                        const isCurrent = activeLesson.id === lesson.id && !activeExercise;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              handleSelectLesson(lesson);
                              if (window.innerWidth < 1024) setIsSidebarOpen(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                              isCurrent
                                ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800/80'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}>
                                {idx + 1}
                              </span>
                              <span className="truncate">
                                {docLang === 'en' && lesson.titleEn ? lesson.titleEn : lesson.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 ml-1.5">{lesson.durationMinutes}m</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEFT COLUMN: Document & Theory Panel (Collapsible in Zen Mode) */}
          {!isZenMode && (
            <div 
              style={{ width: `${splitPercent}%` }}
              className="w-full lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
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

                {!activeExercise && activeLesson.appliedExercises && activeLesson.appliedExercises.length > 0 && (
                  <button
                    onClick={() => setActiveDocTab('exercises')}
                    className={`py-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeDocTab === 'exercises'
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5 text-rose-500" />
                    <span>Bài tập FPTU</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-900">
                      {activeLesson.appliedExercises.length}
                    </span>
                  </button>
                )}
              </div>

              {/* Document Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                
                {/* Active Exercise Indicator Bar if practicing an exercise */}
                {activeExercise && (
                  <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-600 text-white">
                        {activeExercise.questionCode}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                        FPT University Practical Exam
                      </span>
                    </div>

                    <button
                      onClick={handleBackToLesson}
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
                            <span className="text-slate-400">Nguồn: FPT University C/C++ Grading</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                          <KaTeXRenderer
                            content={docLang === 'en' ? activeExercise.descriptionEn : activeExercise.descriptionVi}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                          <h2 className="text-lg font-black text-slate-900 dark:text-white">
                            {docLang === 'en' && activeLesson.titleEn ? activeLesson.titleEn : activeLesson.title}
                          </h2>
                          <span className="text-xs text-slate-400 font-medium">
                            {activeLesson.durationMinutes} phút
                          </span>
                        </div>

                        <div className="text-sm">
                          <KaTeXRenderer 
                            content={docLang === 'en' && activeLesson.contentEn ? activeLesson.contentEn : activeLesson.content} 
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
                        {docLang === 'en' ? 'Sample Test Cases & Criteria' : 'Bảng Test Cases Mẫu & Tiêu Chí Đánh Giá'}
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
                                onClick={() => handleCopyInput(tc.input, idx)}
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
                            <pre className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono-code whitespace-pre-wrap">
                              {tc.input || '(Không có input)'}
                            </pre>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1">Expected Output</span>
                            <pre className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-mono-code whitespace-pre-wrap">
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

                {/* TAB 3: CURATED APPLIED EXERCISES (FPTU) */}
                {activeDocTab === 'exercises' && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-rose-500" />
                        Bài Tập Thực Chiến FPT University
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
                              onClick={() => handleSelectExercise(ex)}
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
          )}

          {/* DRAGGABLE SPLITTER HANDLE */}
          {!isZenMode && (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDraggingSplitter(true);
              }}
              className="hidden lg:flex items-center justify-center w-2 hover:w-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-indigo-500 dark:hover:bg-indigo-500 transition-colors cursor-col-resize group shrink-0 relative z-20 select-none"
              title="Kéo sang trái hoặc phải để điều chỉnh tỷ lệ khung làm việc (25% - 75%)"
            >
              <div className="w-0.5 h-8 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-white" />
            </div>
          )}

          {/* RIGHT COLUMN: Monaco Code Editor & Terminal Sandbox */}
          <div 
            style={{ width: isZenMode ? '100%' : `${100 - splitPercent}%` }}
            className="flex-1 flex flex-col bg-slate-900 text-white overflow-hidden"
          >
            {/* Editor Status Bar */}
            <div className="h-10 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2 font-mono text-slate-300 truncate">
                <Code2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">
                  {activeExercise
                    ? `FPTU Auto-Grading: [${activeExercise.questionCode}] ${docLang === 'en' ? activeExercise.titleEn : activeExercise.titleVi}`
                    : selectedCourse.language === 'c'
                    ? 'Trình Thực Thi C (Dev-C++ / MinGW GCC Wasm Sandbox)'
                    : 'Client-Side Wasm Sandbox'}
                </span>
              </div>

              {/* Action Toolbar: Hints */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowHintIndex((prev) => (prev + 1) % (currentHints?.length || 1))}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                  <span>Gợi ý ({currentHints?.length || 0})</span>
                </button>
              </div>
            </div>

            {/* Monaco Code Editor Area (Top Portion) */}
            <div className="flex-1 min-h-[280px] relative overflow-hidden bg-slate-950">
              <CodeEditor
                value={userCode}
                onChange={handleCodeChange}
                language={selectedCourse.language || 'c'}
                onRun={handleRunCode}
                onSubmit={handleRunCode}
                onMount={(editor) => {
                  academyMonacoRef.current = editor;
                }}
              />
            </div>

            {/* Hints Banner if shown */}
            {showHintIndex >= 0 && currentHints && (
              <div className="px-4 py-2.5 bg-amber-950/60 border-t border-amber-900/60 text-xs text-amber-200 shrink-0 flex items-center justify-between">
                <span>
                  <strong>{docLang === 'en' ? `Hint #${showHintIndex + 1}:` : `Gợi ý #${showHintIndex + 1}:`}</strong> {currentHints[showHintIndex]}
                </span>
                <button 
                  onClick={() => setShowHintIndex(-1)}
                  className="text-amber-400 hover:text-white cursor-pointer ml-2"
                >
                  ×
                </button>
              </div>
            )}

            {/* Terminal Console Output & Diagnostics (Bottom Portion) */}
            <div className="h-48 sm:h-56 border-t border-slate-800 bg-slate-950/95 flex flex-col shrink-0 overflow-hidden">
              <div className="h-8 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
                <div className="flex items-center gap-2 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] uppercase font-bold text-slate-400">Console & Test Output</span>
                </div>

                {executionOutput && (
                  <div>
                    {exercisePassed ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3 h-3" /> {docLang === 'en' ? 'Passed!' : 'Đạt 100/100!'}
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1 text-[11px]">
                        <AlertCircle className="w-3 h-3" /> {docLang === 'en' ? 'Failed' : 'Chưa đạt'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Console Body with Scroll */}
              <div className="flex-1 overflow-y-auto p-3.5 font-mono-code text-xs space-y-2">
                {/* Jump-to-line diagnostic button if compile error */}
                {executionOutput && (() => {
                  const match = executionOutput.match(/(?:solution\.c)?:?(\d+):(\d+):\s*(error|warning)/i) || executionOutput.match(/:(\d+):(\d+):/);
                  if (match) {
                    const line = parseInt(match[1], 10);
                    const col = parseInt(match[2], 10);
                    return (
                      <div className="p-2 rounded-xl bg-rose-950/70 border border-rose-800/80 flex items-center justify-between shadow-2xs font-sans">
                        <span className="text-rose-200 text-xs">
                          Lỗi tại <strong className="text-rose-400">Dòng {line}</strong>, Cột <strong className="text-rose-400">{col}</strong>
                        </span>
                        <button
                          onClick={() => {
                            if (academyMonacoRef.current) {
                              academyMonacoRef.current.revealLineInCenter(line);
                              academyMonacoRef.current.setPosition({ lineNumber: line, column: col });
                              academyMonacoRef.current.focus();
                            }
                          }}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          👉 Nhảy đến dòng lỗi
                        </button>
                      </div>
                    );
                  }
                  return null;
                })()}

                {executionOutput ? (
                  <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {executionOutput}
                  </pre>
                ) : (
                  <p className="text-slate-500 italic text-[11px]">
                    Nhấn "Chạy thử" hoặc bấm phím Ctrl + Enter để biên dịch và kiểm tra bài làm.
                  </p>
                )}

                {/* DiffViewer if output mismatch */}
                {diffState && (
                  <div className="pt-2 font-sans">
                    <DiffViewer
                      actual={diffState.actual}
                      expected={diffState.expected}
                      input={diffState.input}
                      title="Bảng So Sánh Output (Diff Inspector)"
                      testId={1}
                    />
                  </div>
                )}

                {/* Celebratory Alert when Passed */}
                {exercisePassed && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/70 to-indigo-950/70 border border-emerald-500/40 font-sans space-y-2.5 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-xs text-white">
                          🎉 {docLang === 'en' ? 'Challenge Passed!' : 'Tuyệt vời! Bạn đã vượt qua thử thách!'}
                        </span>
                      </div>
                      
                      {nextLessonCandidate && (
                        <button
                          onClick={handleNextLesson}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span>Sang bài tiếp theo</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
