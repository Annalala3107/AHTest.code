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
  PanelLeftClose,
  ChevronRight,
  GraduationCap,
  Search,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { AcademyCourse, AcademyLesson, AppliedExercise } from '../types';
import { mockCourses } from '../data/academy';
import { KaTeXRenderer } from './KaTeXRenderer';
import { DiffViewer } from './DiffViewer';
import { executeCCodeAsync, ExecutionResult, PedagogicalDiagnosis, generatePedagogicalDiagnosis } from '../services/executionManager';
import { CodeEditor } from './CodeEditor';
import { PedagogicalDiagnosisCard } from './workbench/PedagogicalDiagnosisCard';
import confetti from 'canvas-confetti';
import { recordStreakActivity } from '../services/streakService';

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
  const [pedagogicalDiagnosis, setPedagogicalDiagnosis] = useState<PedagogicalDiagnosis | null>(null);
  const [exercisePassed, setExercisePassed] = useState<boolean>(false);
  const [showHintIndex, setShowHintIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copiedTestIdx, setCopiedTestIdx] = useState<number | null>(null);
  const [diffState, setDiffState] = useState<{ actual: string; expected: string; input?: string; isFailed: boolean } | null>(null);

  // Lesson Completion State & Gamification
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`ahtest_completed_${mockCourses[0]?.id}`);
      return saved ? JSON.parse(saved) : ['c-1-compile'];
    } catch {
      return ['c-1-compile'];
    }
  });

  const activeModule = selectedCourse.modules.find(m => 
    m.lessons.some(l => l.id === activeLesson.id)
  ) || selectedCourse.modules[0];

  const completedCount = completedLessons.length;
  const progressPercent = Math.min(100, Math.round((completedCount / (selectedCourse.totalLessons || 1)) * 100));
  
  // Splitter & Workspace Responsive States
  const [splitPercent, setSplitPercent] = useState<number>(() => {
    const saved = localStorage.getItem('ahtest_academy_split');
    return saved ? Math.min(75, Math.max(25, Number(saved))) : 46;
  });
  const [isLgScreen, setIsLgScreen] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });
  const [mobileActiveTab, setMobileActiveTab] = useState<'theory' | 'editor'>('theory');

  useEffect(() => {
    const handleResize = () => {
      setIsLgScreen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => {
    return localStorage.getItem('ahtest_academy_sidebar_expanded') === 'true';
  });
  const [searchLessonQuery, setSearchLessonQuery] = useState<string>('');
  const [isDraggingSplitter, setIsDraggingSplitter] = useState<boolean>(false);
  const [consoleHeight, setConsoleHeight] = useState<number>(() => {
    const saved = localStorage.getItem('ahtest_academy_console_height');
    return saved ? Math.max(36, Math.min(650, Number(saved))) : 240;
  });
  const [isDraggingConsole, setIsDraggingConsole] = useState<boolean>(false);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState<boolean>(false);
  const [isConsoleMaximized, setIsConsoleMaximized] = useState<boolean>(false);
  const [comingSoonTrack, setComingSoonTrack] = useState<AcademyCourse | null>(null);
  const [lessonSwitchToast, setLessonSwitchToast] = useState<string | null>(null);
  const [showGraduationModal, setShowGraduationModal] = useState<boolean>(false);

  const toggleSidebarExpanded = (val?: boolean) => {
    setIsSidebarExpanded((prev) => {
      const next = typeof val === 'boolean' ? val : !prev;
      localStorage.setItem('ahtest_academy_sidebar_expanded', String(next));
      return next;
    });
  };

  const filteredModules = selectedCourse.modules.map(module => {
    if (!searchLessonQuery.trim()) return module;
    const q = searchLessonQuery.toLowerCase().trim();
    const matchesModule = module.title.toLowerCase().includes(q) || (Boolean(module.titleEn) && module.titleEn!.toLowerCase().includes(q));
    const matchedLessons = module.lessons.filter(l => 
      matchesModule ||
      l.title.toLowerCase().includes(q) || 
      (Boolean(l.titleEn) && l.titleEn!.toLowerCase().includes(q)) ||
      (Boolean(l.appliedExercises) && l.appliedExercises!.some(ex => 
        ex.questionCode.toLowerCase().includes(q) || 
        ex.titleVi.toLowerCase().includes(q) || 
        (Boolean(ex.titleEn) && ex.titleEn!.toLowerCase().includes(q))
      ))
    );
    return {
      ...module,
      lessons: matchedLessons
    };
  }).filter(m => m.lessons.length > 0);

  const workspaceContainerRef = useRef<HTMLDivElement>(null);
  const editorColumnRef = useRef<HTMLDivElement>(null);
  const academyMonacoRef = useRef<any>(null);

  // Helper for unique localStorage draft key per lesson / exercise
  const getDraftKey = (courseId: string, lessonId: string, exerciseId?: string | null) => {
    return `ahtest_draft_academy_${courseId}_${lessonId}_${exerciseId || 'theory'}`;
  };

  const [draftSaved, setDraftSaved] = useState<boolean>(() => {
    const key = `ahtest_draft_academy_${mockCourses[0]?.id}_${mockCourses[0]?.modules[0]?.lessons[0]?.id}_theory`;
    return typeof window !== 'undefined' && localStorage.getItem(key) !== null;
  });

  const runTimerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceSaveRef = useRef<NodeJS.Timeout | null>(null);
  const activeRunIdRef = useRef<number>(0);

  // Helper to immediately flush any pending draft to localStorage
  const flushPendingDraft = (curCode?: string) => {
    if (debounceSaveRef.current) {
      clearTimeout(debounceSaveRef.current);
      debounceSaveRef.current = null;
    }
    const targetCode = curCode !== undefined ? curCode : userCode;
    const key = getDraftKey(selectedCourse.id, activeLesson.id, activeExercise?.id);
    try {
      localStorage.setItem(key, targetCode);
      setDraftSaved(true);
    } catch {
      // ignore
    }
  };

  // Cleanup pending timers on unmount to eliminate memory leaks and race conditions
  useEffect(() => {
    return () => {
      activeRunIdRef.current = 0;
      if (runTimerRef.current) {
        clearTimeout(runTimerRef.current);
        runTimerRef.current = null;
      }
      if (debounceSaveRef.current) {
        clearTimeout(debounceSaveRef.current);
        debounceSaveRef.current = null;
      }
    };
  }, []);

  // Mouse drag event listeners for resizing horizontal splitter & console vertical splitter
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 1. Horizontal Left/Right Workspace Splitter
      if (isDraggingSplitter && workspaceContainerRef.current) {
        const rect = workspaceContainerRef.current.getBoundingClientRect();
        const newPercent = ((e.clientX - rect.left) / rect.width) * 100;
        if (newPercent >= 25 && newPercent <= 75) {
          setSplitPercent(Math.round(newPercent));
          localStorage.setItem('ahtest_academy_split', Math.round(newPercent).toString());
        }
      }

      // 2. Vertical Up/Down Console Splitter
      if (isDraggingConsole && editorColumnRef.current) {
        const rect = editorColumnRef.current.getBoundingClientRect();
        const newHeight = rect.bottom - e.clientY;
        const maxHeight = Math.max(100, rect.height - 100);
        const clamped = Math.max(36, Math.min(maxHeight, newHeight));
        setConsoleHeight(Math.round(clamped));
        if (clamped > 36 && isConsoleCollapsed) {
          setIsConsoleCollapsed(false);
        }
        if (isConsoleMaximized) {
          setIsConsoleMaximized(false);
        }
        localStorage.setItem('ahtest_academy_console_height', Math.round(clamped).toString());
      }
    };

    const handleMouseUp = () => {
      if (isDraggingSplitter) setIsDraggingSplitter(false);
      if (isDraggingConsole) setIsDraggingConsole(false);
    };

    if (isDraggingSplitter || isDraggingConsole) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSplitter, isDraggingConsole, isConsoleCollapsed, isConsoleMaximized]);

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

  // Debounced auto-save (400ms) for smooth 60fps typing without disk thrashing
  const handleCodeChange = (newCode: string) => {
    setUserCode(newCode);
    setDraftSaved(false);

    if (debounceSaveRef.current) {
      clearTimeout(debounceSaveRef.current);
    }
    debounceSaveRef.current = setTimeout(() => {
      const key = getDraftKey(selectedCourse.id, activeLesson.id, activeExercise?.id);
      try {
        localStorage.setItem(key, newCode);
        setDraftSaved(true);
      } catch {
        // ignore
      }
      debounceSaveRef.current = null;
    }, 400);
  };

  const handleResetCode = () => {
    if (debounceSaveRef.current) {
      clearTimeout(debounceSaveRef.current);
      debounceSaveRef.current = null;
    }
    const key = getDraftKey(selectedCourse.id, activeLesson.id, activeExercise?.id);
    localStorage.removeItem(key);
    const defaultCode = activeExercise ? activeExercise.initialCode : activeLesson.initialCode;
    setUserCode(defaultCode);
    setDraftSaved(false);
  };

  const handleSelectLesson = (lesson: AcademyLesson) => {
    // Flush draft of currently edited lesson/exercise before switching
    flushPendingDraft();
    if (!isLgScreen) setMobileActiveTab('theory');
    if (runTimerRef.current) {
      clearTimeout(runTimerRef.current);
      runTimerRef.current = null;
    }
    setIsRunning(false);

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
    // Flush draft of current code before switching
    flushPendingDraft();
    if (!isLgScreen) setMobileActiveTab('theory');
    if (runTimerRef.current) {
      clearTimeout(runTimerRef.current);
      runTimerRef.current = null;
    }
    setIsRunning(false);

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
    flushPendingDraft();
    if (!isLgScreen) setMobileActiveTab('theory');
    if (runTimerRef.current) {
      clearTimeout(runTimerRef.current);
      runTimerRef.current = null;
    }
    setIsRunning(false);

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

  const nextLessonCandidate = getNextLesson();

  const handleNextLesson = () => {
    const next = getNextLesson();
    if (next) {
      handleSelectLesson(next);
      const title = docLang === 'en' && next.titleEn ? next.titleEn : next.title;
      setLessonSwitchToast(`Đã chuyển sang Bài: ${title}`);
      setTimeout(() => setLessonSwitchToast(null), 3000);
    } else if (exercisePassed) {
      setShowGraduationModal(true);
    }
  };

  const handleNextLessonRef = useRef(handleNextLesson);
  useEffect(() => {
    handleNextLessonRef.current = handleNextLesson;
  });

  // Global Shift+Enter shortcut to advance to next lesson when exercise is passed
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'Enter' && exercisePassed) {
        e.preventDefault();
        handleNextLessonRef.current();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [exercisePassed]);

  const handleRunCode = () => {
    if (isRunning) return; // Prevent spam clicks
    flushPendingDraft();
    if (!isLgScreen) setMobileActiveTab('editor');
    if (runTimerRef.current) {
      clearTimeout(runTimerRef.current);
      runTimerRef.current = null;
    }

    const runId = ++activeRunIdRef.current;

    setIsRunning(true);
    setExecutionOutput('Đang khởi chạy sandbox và thực thi mã C...');
    setPedagogicalDiagnosis(null);
    setExercisePassed(false);
    setDiffState(null);

    // Enforce 5000 character limit
    if (userCode.length > 5000) {
      setIsRunning(false);
      const diag = generatePedagogicalDiagnosis('CE', 'MAX_CODE_LENGTH_EXCEEDED', userCode);
      setPedagogicalDiagnosis(diag || null);
      setExecutionOutput(`[Lỗi dung lượng: TỐI ĐA 5,000 KÝ TỰ]\nMã nguồn hiện tại chứa ${userCode.length.toLocaleString('vi-VN')} ký tự, vượt quá giới hạn tối đa 5,000 ký tự.`);
      setExercisePassed(false);
      setDiffState(null);
      setIsConsoleCollapsed(false);
      return;
    }

    runTimerRef.current = setTimeout(async () => {
      runTimerRef.current = null;
      
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
          if (activeRunIdRef.current !== runId) return;
          const tc = targetTestcases[i];
          const exec = await executeCCodeAsync(userCode, tc.input);
          if (activeRunIdRef.current !== runId) return;
          lastExecResult = exec;

          totalTime += exec.executionTimeMs;
          if (exec.memoryKb > maxMemory) maxMemory = exec.memoryKb;

          // If Compile Error
          if (exec.status === 'CE') {
            setIsRunning(false);
            setExecutionOutput(`[Biên dịch thất bại: COMPILE ERROR]\n${exec.stderr}`);
            setPedagogicalDiagnosis(exec.pedagogicalDiagnosis || null);
            setExercisePassed(false);
            setDiffState(null);
            setIsConsoleCollapsed(false);
            return;
          }

          // If Runtime Error
          if (exec.status === 'RTE') {
            setIsRunning(false);
            setExecutionOutput(`[Lỗi thực thi: RUNTIME ERROR]\n${exec.stderr}`);
            setPedagogicalDiagnosis(exec.pedagogicalDiagnosis || null);
            setExercisePassed(false);
            setDiffState(null);
            setIsConsoleCollapsed(false);
            return;
          }

          // If Time Limit Exceeded
          if (exec.status === 'TLE') {
            setIsRunning(false);
            setExecutionOutput(
              `[Vượt quá thời gian: TIME LIMIT EXCEEDED]\n${exec.stderr}\n[Gợi ý]: Vòng lặp while/for không có điều kiện dừng thích hợp.`
            );
            setPedagogicalDiagnosis(exec.pedagogicalDiagnosis || null);
            setExercisePassed(false);
            setDiffState(null);
            setIsConsoleCollapsed(false);
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

        if (activeRunIdRef.current !== runId) return;
        setIsRunning(false);

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
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 }
          });
          let output = `[Auto-Grading Verdict: ACCEPTED (100/100)]\n` + resultsSummary.join('\n');
          output += `\n\nThời gian thực thi: ${totalTime}ms | Bộ nhớ tối đa: ${maxMemory}KB`;
          if (lastExecResult?.heapReport) {
            if (lastExecResult.heapReport.hasMemoryLeak) {
              output += `\n⚠️ Cảnh báo Memory Leak: Còn ${lastExecResult.heapReport.activeBlocks} khối Heap chưa được giải phóng!`;
            } else if (lastExecResult.heapReport.totalAllocated > 0) {
              output += `\n🛡️ Kiểm tra an toàn bộ nhớ: Đã giải phóng 100% (${lastExecResult.heapReport.totalFreed} bytes Heap). Không có rò rỉ RAM!`;
            }
          }
          setExecutionOutput(output);
          setPedagogicalDiagnosis(lastExecResult?.pedagogicalDiagnosis || null);
          setExercisePassed(true);
          recordStreakActivity();
          setCompletedLessons((prev) => {
            if (!prev.includes(activeLesson.id)) {
              const updated = [...prev, activeLesson.id];
              localStorage.setItem(`ahtest_completed_${selectedCourse.id}`, JSON.stringify(updated));
              return updated;
            }
            return prev;
          });
          setDiffState({
            actual: targetTestcases[0].expectedOutput,
            expected: targetTestcases[0].expectedOutput,
            input: targetTestcases[0].input,
            isFailed: false,
          });
        } else {
          setActiveDocTab('testcases');
          const failedTc = firstFailed ? firstFailed.tc : targetTestcases[0];
          const failedExec = firstFailed?.exec || lastExecResult;
          let output = `[Auto-Grading Verdict: WRONG ANSWER]\n` + resultsSummary.join('\n');
          output += `\n\n❌ Test case thất bại đầu tiên: Input "${failedTc.input}"`;
          setExecutionOutput(output);
          setExercisePassed(false);
          const waDiag: PedagogicalDiagnosis = {
            category: 'LOGIC',
            badge: 'Chưa đạt (Wrong Answer)',
            title: 'Kết quả in ra (Stdout) chưa khớp với đáp án mẫu',
            explanation: 'Chương trình biên dịch và chạy thành công mà không bị dừng đột ngột, nhưng kết quả in ra màn hình khác với kết quả mong đợi của bộ kiểm thử.',
            suggestion: 'Hãy quan sát Bảng So Sánh Output (Diff Inspector) bên dưới. Chú ý các khoảng trắng thừa, dấu xuống dòng \\n, định dạng chữ hoa/thường hoặc định dạng số thập phân.'
          };
          setPedagogicalDiagnosis(failedExec?.pedagogicalDiagnosis || waDiag);
          setDiffState({
            actual: failedExec?.stdout || '',
            expected: failedTc.expectedOutput,
            input: failedTc.input,
            isFailed: true,
          });
        }
      } else {
        // Freeform lesson without strict testcases
        const exec = await executeCCodeAsync(userCode, '');
        if (activeRunIdRef.current !== runId) return;
        setIsRunning(false);

        if (exec.status === 'CE') {
          setExecutionOutput(`[Biên dịch thất bại: COMPILE ERROR]\n${exec.stderr}`);
          setPedagogicalDiagnosis(exec.pedagogicalDiagnosis || null);
          setExercisePassed(false);
          setIsConsoleCollapsed(false);
        } else if (exec.status === 'RTE') {
          setExecutionOutput(`[Lỗi thực thi: RUNTIME ERROR]\n${exec.stderr}`);
          setPedagogicalDiagnosis(exec.pedagogicalDiagnosis || null);
          setExercisePassed(false);
          setIsConsoleCollapsed(false);
        } else if (exec.status === 'TLE') {
          setExecutionOutput(`[Vượt quá thời gian: TIME LIMIT EXCEEDED]\n${exec.stderr}`);
          setPedagogicalDiagnosis(exec.pedagogicalDiagnosis || null);
          setExercisePassed(false);
          setIsConsoleCollapsed(false);
        } else {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.6 }
          });
          let output = `[Biên dịch & Thực thi Thành Công (exit code 0)]\n`;
          output += exec.stdout ? `Output:\n${exec.stdout}\n` : `(Chương trình không xuất output ra stdout)\n`;
          output += `Thời gian: ${exec.executionTimeMs}ms | Bộ nhớ: ${exec.memoryKb}KB`;
          if (exec.heapReport?.hasMemoryLeak) {
            output += `\n⚠️ Cảnh báo: Rò rỉ bộ nhớ Heap (chưa gọi free())!`;
          }
          setExecutionOutput(output);
          setPedagogicalDiagnosis(exec.pedagogicalDiagnosis || null);
          setExercisePassed(true);
          recordStreakActivity();
          setCompletedLessons((prev) => {
            if (!prev.includes(activeLesson.id)) {
              const updated = [...prev, activeLesson.id];
              localStorage.setItem(`ahtest_completed_${selectedCourse.id}`, JSON.stringify(updated));
              return updated;
            }
            return prev;
          });
        }
      }
    }, 250);
  };

  const currentHints = activeExercise 
    ? (docLang === 'en' ? activeExercise.hintsEn : activeExercise.hintsVi)
    : (docLang === 'en' && activeLesson.hintsEn ? activeLesson.hintsEn : activeLesson.hints);

  const currentTestcases = activeExercise 
    ? activeExercise.testcases 
    : (activeLesson.testcases || []);

  return (
    <div className="h-[calc(100vh-64px)] w-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      
      {/* 1. COMPACT BREADCRUMB BAR (Height ~46px, Ultra-Sleek & Space-Efficient) */}
      <div className="h-11 sm:h-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 flex items-center justify-between shrink-0 z-30 select-none text-xs">
        
        {/* Left: Drawer Toggle & Interactive Breadcrumb Trail */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <button
            onClick={() => toggleSidebarExpanded()}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
              isSidebarExpanded
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={isSidebarExpanded ? "Thu gọn về thanh Icon Rail" : "Mở rộng danh mục lộ trình bài học (Drawer)"}
          >
            {isSidebarExpanded ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeft className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">Lộ trình</span>
          </button>

          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-1.5 text-xs min-w-0">
            {/* Level 1: Academy Root */}
            <div className="hidden sm:flex items-center gap-1 text-slate-400 font-medium shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
              <span>Học viện</span>
            </div>

            <ChevronRight className="hidden sm:inline w-3 h-3 text-slate-300 dark:text-slate-600 shrink-0" />

            {/* Level 2: Track Selector (Dropdown / Pills) */}
            <div className="flex items-center gap-1 shrink-0">
              {mockCourses.map((c) => {
                const isSelected = selectedCourse.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (c.isComingSoon) {
                        setComingSoonTrack(c);
                        return;
                      }
                      setSelectedCourse(c);
                      setActiveExercise(null);
                      if (c.modules[0]?.lessons[0]) {
                        setActiveLesson(c.modules[0].lessons[0]);
                        setUserCode(c.modules[0].lessons[0].initialCode);
                        setExecutionOutput(null);
                        setExercisePassed(false);
                      }
                    }}
                    className={`items-center gap-1 px-2.5 py-1 rounded-md font-bold text-[11px] transition-all cursor-pointer ${
                      c.isComingSoon ? 'hidden md:inline-flex' : 'inline-flex'
                    } ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shadow-2xs'
                        : c.isComingSoon
                        ? 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={c.isComingSoon ? `${c.title} (Sắp ra mắt - Nhấn để xem lộ trình dự kiến)` : c.title}
                  >
                    <span>
                      {c.language === 'c' 
                        ? 'C Track' 
                        : c.language === 'cpp' 
                        ? 'C++ Track' 
                        : 'Python'}
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

            {/* Level 3: Active Module Tag (Compact & Non-wrapping) */}
            {activeModule && (() => {
              const moduleIndex = selectedCourse.modules.findIndex(m => m.id === activeModule.id);
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
              title={activeExercise ? (docLang === 'en' ? activeExercise.titleEn : activeExercise.titleVi) : (docLang === 'en' && activeLesson.titleEn ? activeLesson.titleEn : activeLesson.title)}
            >
              {activeExercise
                ? `[${activeExercise.questionCode}] ${docLang === 'en' ? activeExercise.titleEn : activeExercise.titleVi}`
                : docLang === 'en' && activeLesson.titleEn ? activeLesson.titleEn : activeLesson.title}
            </span>
          </div>
        </div>

        {/* Right: Progress Meter, Bilingual Switcher, Split Presets, Zen Mode, Run Button */}
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

          {/* Single Bilingual Switcher (VI / EN) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => handleToggleLang('vi')}
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
              onClick={() => handleToggleLang('en')}
              className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
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
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
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
            <div className="hidden lg:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
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
            disabled={isRunning || userCode.length > 5000}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              userCode.length > 5000
                ? 'bg-rose-950 text-rose-300 border border-rose-700 opacity-80 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs shadow-indigo-600/30 cursor-pointer disabled:opacity-50'
            }`}
            title={userCode.length > 5000 ? `Mã nguồn (${userCode.length.toLocaleString('vi-VN')} ký tự) vượt quá giới hạn 5,000 ký tự!` : "Phím tắt: Ctrl + Enter"}
          >
            <Play className="w-3 h-3 fill-white" />
            <span className="hidden sm:inline">
              {isRunning ? 'Đang chấm...' : userCode.length > 5000 ? 'Quá 5,000 ký tự' : 'Chạy thử'}
            </span>
            {userCode.length <= 5000 && (
              <kbd className="hidden sm:inline-block ml-0.5 px-1 py-0.2 rounded text-[9px] bg-indigo-700 text-indigo-200 font-mono">
                Ctrl+↵
              </kbd>
            )}
          </button>

          {/* Next Lesson Pulsating Quick Button (Shift + Enter) */}
          {exercisePassed && nextLessonCandidate && (
            <button
              onClick={handleNextLesson}
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
              onClick={() => setShowGraduationModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30 transition-all cursor-pointer"
              title="Chúc mừng bạn đã hoàn thành toàn bộ khóa học!"
            >
              <Trophy className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Tốt nghiệp C Track</span>
            </button>
          )}
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
        <div className="flex-1 flex overflow-hidden relative">
          {/* 1. SIDEBAR: DUAL-MODE MINI ICON RAIL & COLLAPSIBLE DRAWER (Hidden in Zen Mode) */}
          {!isZenMode && (
            <>
              {/* A. MINI ICON RAIL: Visible on Desktop (>= 1024px) when sidebar is collapsed */}
              {!isSidebarExpanded && (
                <div className="hidden lg:flex flex-col w-14 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-20 select-none">
                  {/* Rail Header: Expand Button */}
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-center shrink-0">
                    <button
                      onClick={() => toggleSidebarExpanded(true)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer group relative"
                      title="Mở rộng lộ trình bài học (Drawer 320px)"
                    >
                      <PanelLeft className="w-4 h-4 transition-transform group-hover:scale-110" />
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-semibold shadow-xl border border-slate-700/80 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        Mở rộng lộ trình bài học
                      </div>
                    </button>
                  </div>

                  {/* Rail Body: Vertical List of Lesson Pills & Module Badges */}
                  <div className="flex-1 overflow-y-auto py-2 px-1 space-y-2 overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {selectedCourse.modules.map((module, modIdx) => {
                      const modNumber = modIdx + 1;
                      return (
                        <div key={module.id} className="space-y-1.5 flex flex-col items-center">
                          {/* Module Badge */}
                          <div 
                            className="w-8 h-4 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[9px] font-extrabold text-slate-500 dark:text-slate-400 flex items-center justify-center select-none"
                            title={docLang === 'en' && module.titleEn ? module.titleEn : module.title}
                          >
                            M{modNumber}
                          </div>

                          {/* Lessons in this Module */}
                          {module.lessons.map((lesson, lessonIdx) => {
                            const isCurrent = activeLesson.id === lesson.id && !activeExercise;
                            const isDone = completedLessons.includes(lesson.id);
                            return (
                              <div key={lesson.id} className="relative group w-full flex justify-center">
                                <button
                                  onClick={() => handleSelectLesson(lesson)}
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer relative ${
                                    isCurrent
                                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400 dark:ring-indigo-300 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105'
                                      : isDone
                                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:scale-105'
                                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white hover:scale-105'
                                  }`}
                                  title={`${lessonIdx + 1}. ${docLang === 'en' && lesson.titleEn ? lesson.titleEn : lesson.title}`}
                                >
                                  {isDone ? (
                                    <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-emerald-500'}`} />
                                  ) : (
                                    <span>{lessonIdx + 1}</span>
                                  )}

                                  {/* Active pulsing dot */}
                                  {isCurrent && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-indigo-400 ring-2 ring-white dark:ring-slate-900" />
                                  )}
                                </button>

                                {/* Hover Tooltip positioned to the right of the rail */}
                                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 min-w-56 max-w-xs p-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white shadow-2xl border border-slate-700/80 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 z-50 select-none">
                                  <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 mb-0.5">
                                    {docLang === 'en' && module.titleEn ? module.titleEn : module.title}
                                  </div>
                                  <div className="font-bold text-xs text-slate-100 mb-1.5 leading-snug line-clamp-2">
                                    {lessonIdx + 1}. {docLang === 'en' && lesson.titleEn ? lesson.titleEn : lesson.title}
                                  </div>
                                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-700/60 pt-1.5">
                                    <span className="flex items-center gap-1 text-slate-300">
                                      <Clock className="w-3 h-3 text-slate-400" />
                                      {lesson.durationMinutes} phút
                                    </span>
                                    {isDone ? (
                                      <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                                        <Check className="w-3 h-3" /> Đã hoàn thành
                                      </span>
                                    ) : (
                                      <span className="text-slate-400">Chưa hoàn thành</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                  {/* Rail Footer: Mini Progress Meter */}
                  <div className="p-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col items-center gap-1 shrink-0">
                    <div 
                      className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400"
                      title={`Tiến độ: ${completedCount}/${selectedCourse.totalLessons} bài (${progressPercent}%)`}
                    >
                      {progressPercent}%
                    </div>
                    <div className="w-8 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* B. EXPANDED CURRICULUM DRAWER: Drawer on Desktop, Overlay Drawer with Backdrop on Mobile */}
              {isSidebarExpanded && (
                <>
                  {/* Backdrop Overlay for Mobile (< 1024px) */}
                  <div 
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
                    onClick={() => toggleSidebarExpanded(false)}
                  />

                  {/* Drawer Panel Container */}
                  <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 shadow-2xl lg:shadow-none lg:relative lg:z-20 select-none">
                    {/* Drawer Header */}
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
                        onClick={() => toggleSidebarExpanded(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                        title="Thu gọn về thanh Icon Rail"
                      >
                        <PanelLeftClose className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Gamified Course Progress Bar */}
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

                    {/* Search & Filter Bar */}
                    <div className="p-3 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={searchLessonQuery}
                          onChange={(e) => setSearchLessonQuery(e.target.value)}
                          placeholder="Tìm bài học, bài tập..."
                          className="w-full pl-8 pr-7 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                        />
                        {searchLessonQuery && (
                          <button
                            onClick={() => setSearchLessonQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5 cursor-pointer"
                            title="Xóa tìm kiếm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Filtered Modules & Lessons List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-4">
                      {filteredModules.length === 0 ? (
                        <div className="text-center py-8 px-4 space-y-2">
                          <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            Không tìm thấy bài học nào phù hợp
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
                          </p>
                          <button
                            onClick={() => setSearchLessonQuery('')}
                            className="mt-2 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
                          >
                            Xóa bộ lọc
                          </button>
                        </div>
                      ) : (
                        filteredModules.map((module) => {
                          const moduleCompleted = module.lessons.filter(l => completedLessons.includes(l.id)).length;
                          return (
                            <div key={module.id} className="space-y-1.5">
                              {/* Module Header */}
                              <div className="flex items-center justify-between px-2 py-1">
                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 min-w-0">
                                  <Layers className="w-3 h-3 text-indigo-500 shrink-0" />
                                  <span className="truncate">{docLang === 'en' && module.titleEn ? module.titleEn : module.title}</span>
                                </h4>
                                <span className="text-[10px] font-bold text-slate-400 shrink-0 ml-1">
                                  {moduleCompleted}/{module.lessons.length}
                                </span>
                              </div>

                              {/* Lesson Items */}
                              <div className="space-y-1">
                                {module.lessons.map((lesson, idx) => {
                                  const isCurrent = activeLesson.id === lesson.id && !activeExercise;
                                  const isDone = completedLessons.includes(lesson.id);
                                  const hasExercises = lesson.appliedExercises && lesson.appliedExercises.length > 0;
                                  return (
                                    <div key={lesson.id} className="space-y-1">
                                      <button
                                        onClick={() => {
                                          handleSelectLesson(lesson);
                                          if (window.innerWidth < 1024) toggleSidebarExpanded(false);
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
                                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                              isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                            }`}>
                                              {idx + 1}
                                            </span>
                                          )}
                                          <span className="truncate">
                                            {docLang === 'en' && lesson.titleEn ? lesson.titleEn : lesson.title}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                                          {hasExercises && (
                                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300">
                                              +{lesson.appliedExercises!.length} BT
                                            </span>
                                          )}
                                          <span className="text-[10px] text-slate-400">{lesson.durationMinutes}m</span>
                                        </div>
                                      </button>

                                      {/* Sub-exercises list if active lesson and has exercises */}
                                      {activeLesson.id === lesson.id && hasExercises && (
                                        <div className="pl-6 pr-2 py-1 space-y-1 border-l-2 border-indigo-200 dark:border-indigo-900 ml-4 my-1">
                                          {lesson.appliedExercises!.map((ex) => {
                                            const isExActive = activeExercise?.id === ex.id;
                                            return (
                                              <button
                                                key={ex.id}
                                                onClick={() => {
                                                  handleSelectExercise(ex);
                                                  if (window.innerWidth < 1024) toggleSidebarExpanded(false);
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
                                                    [{ex.questionCode}] {docLang === 'en' ? ex.titleEn : ex.titleVi}
                                                  </span>
                                                </div>
                                                <span className="text-[9px] text-slate-400 shrink-0 ml-1">Test</span>
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
                        })
                      )}
                    </div>

                    {/* Drawer Footer: Next Lesson Action */}
                    {nextLessonCandidate && (
                      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 shrink-0">
                        <button
                          onClick={() => {
                            handleSelectLesson(nextLessonCandidate);
                            if (window.innerWidth < 1024) toggleSidebarExpanded(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="truncate">
                              Bài tiếp theo: {docLang === 'en' && nextLessonCandidate.titleEn ? nextLessonCandidate.titleEn : nextLessonCandidate.title}
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
          )}

          {/* Mobile/Tablet Dual-Tab Switcher (Viewport < 1024px) */}
          <div className="lg:hidden flex items-center bg-slate-100 dark:bg-slate-800 p-1 border-b border-slate-200 dark:border-slate-700 shrink-0">
            <button
              onClick={() => setMobileActiveTab('theory')}
              className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileActiveTab === 'theory'
                  ? 'bg-white dark:bg-slate-900 shadow-xs text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📖 Lý thuyết & Bài tập</span>
            </button>
            <button
              onClick={() => setMobileActiveTab('editor')}
              className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileActiveTab === 'editor'
                  ? 'bg-white dark:bg-slate-900 shadow-xs text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>💻 Trình soạn thảo & Chạy thử</span>
            </button>
          </div>

          {/* 2. SPLIT-SCREEN WORKBENCH CONTAINER (Holds Theory Document Panel, Draggable Splitter, Monaco Editor) */}
          <div 
            ref={workspaceContainerRef}
            className={`flex-1 flex flex-col lg:flex-row overflow-hidden relative ${isDraggingSplitter ? 'cursor-col-resize select-none' : ''}`}
          >

          {/* LEFT COLUMN: Document & Theory Panel (Collapsible in Zen Mode) */}
          {!isZenMode && (
            <div 
              style={{ width: isLgScreen ? `${splitPercent}%` : '100%' }}
              className={`w-full flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden ${
                !isLgScreen && mobileActiveTab !== 'theory' ? 'hidden' : 'flex'
              }`}
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
                    <span>Bài tập Thực hành</span>
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
                        Applied Practical Challenge
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
                            <span className="text-slate-400">Nguồn: Đề thi Thực hành C/C++ Chuẩn Quốc Tế</span>
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
            ref={editorColumnRef}
            style={{ width: isLgScreen ? (isZenMode ? '100%' : `${100 - splitPercent}%`) : '100%' }}
            className={`flex-1 flex flex-col bg-slate-900 text-white overflow-hidden relative ${
              isDraggingConsole ? 'select-none cursor-row-resize' : ''
            } ${!isLgScreen && mobileActiveTab !== 'editor' ? 'hidden' : 'flex'}`}
          >
            {/* Editor Status Bar */}
            <div className="h-10 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2 font-mono text-slate-300 truncate">
                <Code2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">
                  {activeExercise
                    ? `Auto-Grading: [${activeExercise.questionCode}] ${docLang === 'en' ? activeExercise.titleEn : activeExercise.titleVi}`
                    : selectedCourse.language === 'c'
                    ? 'Trình Thực Thi C (Dev-C++ / MinGW GCC Wasm Sandbox)'
                    : 'Client-Side Wasm Sandbox'}
                </span>
              </div>

              {/* Action Toolbar: 5000-char counter, Auto-save status & Hints */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* 5000-character limit counter */}
                <div 
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1.5 transition-colors ${
                    userCode.length > 5000 
                      ? 'text-rose-400 bg-rose-950/80 border-rose-600 font-bold animate-pulse'
                      : userCode.length > 4500
                      ? 'text-amber-300 bg-amber-950/60 border-amber-600 font-semibold'
                      : 'text-slate-400 bg-slate-900 border-slate-800'
                  }`}
                  title={`Dung lượng code: ${userCode.length.toLocaleString('vi-VN')} / 5,000 ký tự tối đa`}
                >
                  <span>{userCode.length.toLocaleString('vi-VN')}/5,000</span>
                  <span className="hidden md:inline text-[10px] text-slate-500">ký tự</span>
                </div>

                <div 
                  className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono select-none"
                  title="Code của bạn được tự động lưu liên tục trong trình duyệt"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${draftSaved ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  <span className="text-slate-400">{draftSaved ? 'Đã lưu tự động' : 'Tự động lưu'}</span>
                </div>

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
            <div className="flex-1 min-h-[100px] relative overflow-hidden bg-slate-950">
              <CodeEditor
                value={userCode}
                onChange={handleCodeChange}
                language={selectedCourse.language || 'c'}
                onRun={handleRunCode}
                onSubmit={handleRunCode}
                onNextLesson={exercisePassed && nextLessonCandidate ? handleNextLesson : undefined}
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

            {/* DRAGGABLE CONSOLE SPLITTER (Resize Console Up/Down) */}
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDraggingConsole(true);
              }}
              className={`h-2 hover:h-2.5 bg-slate-800 hover:bg-indigo-500 transition-colors cursor-row-resize flex items-center justify-center shrink-0 group relative z-20 select-none ${
                isDraggingConsole ? 'bg-indigo-500' : ''
              }`}
              title="Kéo lên / kéo xuống để điều chỉnh độ cao khung Console & Test Output"
            >
              <div className="w-12 h-1 rounded-full bg-slate-600 group-hover:bg-white transition-colors" />
            </div>

            {/* Terminal Console Output & Diagnostics (Bottom Portion with Dynamic Resizable Height) */}
            <div 
              style={{ 
                height: isConsoleCollapsed 
                  ? '36px' 
                  : isConsoleMaximized 
                  ? 'calc(100% - 40px)' 
                  : `${consoleHeight}px`,
                maxHeight: isConsoleCollapsed ? '36px' : 'calc(100% - 90px)'
              }}
              className="border-t border-slate-800 bg-slate-950/95 flex flex-col shrink-0 overflow-hidden transition-all duration-75"
            >
              <div className="h-9 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs shrink-0 select-none">
                <div className="flex items-center gap-2.5 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] uppercase font-bold text-slate-300">Console & Test Output</span>
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

                {/* Right controls: Presets, Maximize, clear, collapse/expand */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Preset Height Buttons */}
                  <div className="hidden sm:flex items-center bg-slate-800 rounded-md p-0.5 text-[10px] font-mono text-slate-400">
                    <button
                      onClick={() => {
                        setIsConsoleCollapsed(false);
                        setIsConsoleMaximized(false);
                        setConsoleHeight(160);
                        localStorage.setItem('ahtest_academy_console_height', '160');
                      }}
                      className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                        !isConsoleCollapsed && !isConsoleMaximized && consoleHeight === 160 ? 'bg-slate-700 text-white font-bold' : 'hover:text-slate-200'
                      }`}
                      title="Thu gọn vừa phải (160px)"
                    >
                      Nhỏ
                    </button>
                    <button
                      onClick={() => {
                        setIsConsoleCollapsed(false);
                        setIsConsoleMaximized(false);
                        setConsoleHeight(260);
                        localStorage.setItem('ahtest_academy_console_height', '260');
                      }}
                      className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                        !isConsoleCollapsed && !isConsoleMaximized && consoleHeight === 260 ? 'bg-slate-700 text-white font-bold' : 'hover:text-slate-200'
                      }`}
                      title="Chiều cao chuẩn (260px)"
                    >
                      Vừa
                    </button>
                    <button
                      onClick={() => {
                        setIsConsoleCollapsed(false);
                        setIsConsoleMaximized(false);
                        setConsoleHeight(380);
                        localStorage.setItem('ahtest_academy_console_height', '380');
                      }}
                      className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                        !isConsoleCollapsed && !isConsoleMaximized && consoleHeight === 380 ? 'bg-slate-700 text-white font-bold' : 'hover:text-slate-200'
                      }`}
                      title="Mở rộng lớn (380px - xem trọn vẹn Diff & Stack Trace lỗi)"
                    >
                      Lớn
                    </button>
                  </div>

                  {/* Maximize / Restore Console Toggle */}
                  <button
                    onClick={() => {
                      setIsConsoleCollapsed(false);
                      setIsConsoleMaximized(!isConsoleMaximized);
                    }}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      isConsoleMaximized 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title={isConsoleMaximized ? "Thu nhỏ về kích thước cũ" : "Phóng to Console toàn màn hình (Xem trọn vẹn Diff & Testcases)"}
                  >
                    {isConsoleMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>

                  {/* Clear Output */}
                  {executionOutput && (
                    <button
                      onClick={() => {
                        setExecutionOutput(null);
                        setDiffState(null);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Xóa output console"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}

                  {/* Collapse / Expand Toggle */}
                  <button
                    onClick={() => {
                      if (isConsoleCollapsed) {
                        setIsConsoleCollapsed(false);
                      } else {
                        setIsConsoleCollapsed(true);
                        setIsConsoleMaximized(false);
                      }
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title={isConsoleCollapsed ? "Mở rộng Console" : "Thu gọn Console"}
                  >
                    {isConsoleCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Console Body with Scroll */}
              <div className="flex-1 min-h-0 overflow-y-auto p-3.5 font-mono-code text-xs space-y-2.5">
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

                {/* Pedagogical Diagnosis Explainer Card */}
                {pedagogicalDiagnosis && (
                  <PedagogicalDiagnosisCard diagnosis={pedagogicalDiagnosis} />
                )}

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
                      verdict={exercisePassed ? 'AC' : 'WA'}
                      isPassed={exercisePassed}
                    />
                  </div>
                )}

                {/* Celebratory Alert when Passed */}
                {exercisePassed && (
                  <div className="p-3.5 rounded-xl bg-linear-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/40 font-sans space-y-2 mt-2 shadow-lg">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-white block">
                            🎉 {docLang === 'en' ? 'Challenge Passed (100/100 Accepted)!' : 'Xuất sắc! Đạt 100/100 điểm Accepted!'}
                          </span>
                          <span className="text-[10px] text-emerald-300/80">
                            {nextLessonCandidate 
                              ? 'Bấm nút hoặc nhấn Shift + Enter để tự động chuyển sang bài tiếp theo.' 
                              : 'Bạn đã hoàn thành bài học cuối cùng trong giáo trình!'}
                          </span>
                        </div>
                      </div>
                      
                      {nextLessonCandidate ? (
                        <button
                          onClick={handleNextLesson}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md shadow-emerald-600/40 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
                          title="Phím tắt: Shift + Enter để sang bài tiếp theo"
                        >
                          <span>Sang bài tiếp theo</span>
                          <kbd className="px-1 py-0.2 rounded text-[9px] bg-emerald-800 text-emerald-200 font-mono">
                            Shift+↵
                          </kbd>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowGraduationModal(true)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/40 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
                        >
                          <Trophy className="w-3.5 h-3.5" />
                          <span>Xem bảng vinh danh tốt nghiệp</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
      )}

      {/* Lesson Transition Toast Notification */}
      {lessonSwitchToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-2xl animate-in slide-in-from-bottom duration-200 select-none">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{lessonSwitchToast}</span>
        </div>
      )}

      {/* Coming Soon Track Preview Modal */}
      {comingSoonTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 select-none">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <button
                onClick={() => setComingSoonTrack(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  Sắp ra mắt • Coming Soon
                </span>
                <span className="text-xs text-slate-400 font-bold uppercase">{comingSoonTrack.language} Track</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {docLang === 'en' && comingSoonTrack.titleEn ? comingSoonTrack.titleEn : comingSoonTrack.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {comingSoonTrack.description}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Nội dung đang được biên soạn chuẩn Wasm Sandbox:</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span>Trình thông dịch WebAssembly chạy trực tiếp trên client.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span>Giáo trình tương tác gắn liền đề thi Olympic & Doanh nghiệp.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span>Chấm test cases tự động và phân tích lỗi chi tiết.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => setComingSoonTrack(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Tiếp tục học C Track
              </button>
              <button
                onClick={() => {
                  alert('Cảm ơn bạn! Hệ thống sẽ thông báo ngay khi khóa học chính thức phát hành.');
                  setComingSoonTrack(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-colors cursor-pointer"
              >
                Đăng ký nhận tin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Graduation Modal */}
      {showGraduationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 select-none">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                🎓 Tốt Nghiệp Khóa Học
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                Chúc Mừng Bạn Đã Hoàn Thành C Track Tiêu Chuẩn Quốc Tế!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-sm mx-auto">
                Bạn đã vượt qua xuất sắc toàn bộ 14 bài học và bài tập thực hành con trỏ, cấp phát bộ nhớ động & cấu trúc dữ liệu!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-base font-black text-indigo-600 dark:text-indigo-400">14/14</div>
                <div className="text-[10px] text-slate-400 font-medium">Bài học</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-base font-black text-emerald-500">100%</div>
                <div className="text-[10px] text-slate-400 font-medium">Tỷ lệ đạt</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-base font-black text-amber-500">8.0h</div>
                <div className="text-[10px] text-slate-400 font-medium">Thời lượng</div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowGraduationModal(false);
                  handleSelectLesson(selectedCourse.modules[0].lessons[0]);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Ôn tập từ Bài 1
              </button>
              <button
                onClick={() => setShowGraduationModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-colors cursor-pointer"
              >
                Đóng & Xem lại bài
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
