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
  Sparkles,
  Trophy,
  Copy,
  Check,
  Languages,
  ArrowRight,
  ArrowLeft,
  Terminal,
  ExternalLink,
  Target,
  Lock,
  Save
} from 'lucide-react';
import { AcademyCourse, AcademyLesson, AppliedExercise } from '../types';
import { mockCourses } from '../data/mockAcademy';
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
  const academyGutterRef = useRef<HTMLDivElement>(null);
  const academyMonacoRef = useRef<any>(null);

  // Helper for unique localStorage draft key per lesson / exercise
  const getDraftKey = (courseId: string, lessonId: string, exerciseId?: string | null) => {
    return `ahtest_draft_academy_${courseId}_${lessonId}_${exerciseId || 'theory'}`;
  };

  const [draftSaved, setDraftSaved] = useState<boolean>(() => {
    const key = `ahtest_draft_academy_${mockCourses[0]?.id}_${mockCourses[0]?.modules[0]?.lessons[0]?.id}_theory`;
    return typeof window !== 'undefined' && localStorage.getItem(key) !== null;
  });

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
    const key = getDraftKey(selectedCourse.id, activeLesson.id, exercise.id);
    const saved = localStorage.getItem(key);
    setUserCode(saved !== null ? saved : exercise.initialCode);
    setDraftSaved(saved !== null);
    setExecutionOutput(null);
    setExercisePassed(false);
    setShowHintIndex(-1);
    const sandboxEl = document.getElementById('academy-sandbox');
    if (sandboxEl) {
      sandboxEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackToLesson = () => {
    setActiveExercise(null);
    const key = getDraftKey(selectedCourse.id, activeLesson.id, null);
    const saved = localStorage.getItem(key);
    setUserCode(saved !== null ? saved : activeLesson.initialCode);
    setDraftSaved(saved !== null);
    setExecutionOutput(null);
    setExercisePassed(false);
    setShowHintIndex(-1);
  };

  const handleCopyInput = (input: string, idx: number) => {
    navigator.clipboard.writeText(input);
    setCopiedTestIdx(idx);
    setTimeout(() => setCopiedTestIdx(null), 2000);
  };

  // Keyboard shortcut & indentation handler for code editor
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 1. Ctrl + Enter or Cmd + Enter: Trigger Run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isRunning) {
        handleRunCode();
      }
      return;
    }

    // 2. Tab key indentation (2 spaces)
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const currentVal = target.value;
      const newVal = currentVal.substring(0, start) + '  ' + currentVal.substring(end);
      handleCodeChange(newVal);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
      return;
    }

    // 3. Enter key: Auto-indent matching previous line
    if (e.key === 'Enter') {
      const target = e.currentTarget;
      const start = target.selectionStart;
      const currentVal = target.value;
      const lineStart = currentVal.lastIndexOf('\n', start - 1) + 1;
      const lineText = currentVal.substring(lineStart, start);
      const indentMatch = lineText.match(/^(\s*)/);
      let indent = indentMatch ? indentMatch[1] : '';

      if (lineText.trim().endsWith('{')) {
        indent += '  ';
      }

      if (indent.length > 0) {
        e.preventDefault();
        const newVal = currentVal.substring(0, start) + '\n' + indent + currentVal.substring(start);
        handleCodeChange(newVal);
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + 1 + indent.length;
        }, 0);
      }
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
        : (activeLesson.testcases || []);

      // If testcases exist, execute code against each testcase!
      if (targetTestcases.length > 0) {
        let allPassed = true;
        let firstFailed: { tc: any; exec: ExecutionResult } | null = null;
        const resultsSummary: string[] = [];
        let totalTime = 0;
        let maxMemory = 0;
        let lastExecResult: ExecutionResult | null = null;

        for (let i = 0; i < targetTestcases.length; i++) {
          const tc = targetTestcases[i];
          const exec = executeCCode(userCode, tc.input);
          lastExecResult = exec;
          totalTime += exec.executionTimeMs;
          maxMemory = Math.max(maxMemory, exec.memoryKb);

          // If Compile Error
          if (exec.status === 'CE') {
            setExecutionOutput(
              `[Biên dịch thất bại: COMPILE ERROR]\n${exec.stderr}\n\n[Gợi ý]: Hãy sửa lỗi cú pháp trước khi chạy.`
            );
            setExercisePassed(false);
            setDiffState(null);
            return;
          }

          // If Runtime Error
          if (exec.status === 'RTE') {
            setExecutionOutput(
              `[Lỗi thực thi: RUNTIME ERROR]\n${exec.stderr}\n[Gợi ý]: Kiểm tra giải phóng con trỏ, truy cập mảng ngoài biên hoặc chia cho 0.`
            );
            setExercisePassed(false);
            setDiffState({
              actual: exec.stdout || exec.stderr,
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

  return (
    <div className="space-y-6 pb-16">
      {/* Academy Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Micro-Learning Interactive Academy
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                FPTU Auto-Grading & Dev-Cpp
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {docLang === 'en'
                ? 'Interactive Coding & Algorithmic Academy'
                : 'Học Lập Trình Thi Đấu & Ngôn Ngữ Tương Tác'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {docLang === 'en'
                ? 'Bite-sized 3-minute theory, hands-on challenges right in your browser with WebAssembly. Integrated with official FPT University C/C++ Practical Exam questions with full test cases.'
                : 'Học lý thuyết ngắn gọn 3 phút, giải thử thách ngay trên trình duyệt với công nghệ WebAssembly. Tích hợp bộ câu hỏi thi thực hành chuẩn FPT University C/C++ với đầy đủ testcases và chế độ song ngữ (VI/EN).'}
            </p>
          </div>

          {/* Controls: Quick Bilingual Switcher & Track Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start md:self-auto shrink-0">
            {/* Quick Bilingual Switcher */}
            <div className="flex items-center bg-slate-950/80 border border-slate-800 p-1 rounded-xl text-xs backdrop-blur-md">
              <button
                onClick={() => handleToggleLang('vi')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  docLang === 'vi'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Giao diện Tiếng Việt"
              >
                <span>🇻🇳 VI</span>
              </button>
              <button
                onClick={() => handleToggleLang('en')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  docLang === 'en'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to English (Exam Mode)"
              >
                <span>🇬🇧 EN</span>
              </button>
            </div>

            {/* Track Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
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
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>
                    {c.language === 'c' 
                      ? 'C Track (Dev-Cpp)' 
                      : c.language === 'cpp' 
                      ? 'C++ Track' 
                      : 'Python Track'}
                  </span>
                  {c.isComingSoon && (
                    <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Sắp có
                    </span>
                  )}
                </button>
              );
            })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Learning Body */}
      {selectedCourse.isComingSoon ? (
        /* Python Coming Soon Placeholder */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Giáo Trình Python Đang Được Biên Soạn
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Khóa học Python cho Lập trình thi đấu và Tin học trẻ sẽ được cập nhật trong phiên bản tiếp theo. 
              Hiện tại bạn hãy trải nghiệm đầy đủ **Giáo trình C/C++ (Cơ bản đến Trung cấp)** đã có sẵn giáo trình chi tiết!
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCourse(mockCourses[0]);
              setActiveExercise(null);
              setActiveLesson(mockCourses[0].modules[0].lessons[0]);
              setUserCode(mockCourses[0].modules[0].lessons[0].initialCode);
            }}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            Chuyển sang học Ngôn ngữ C ngay →
          </button>
        </div>
      ) : (
        /* Active 2-Column Learning Workbench */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 4 Cols: Curriculum Navigation List */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {docLang === 'en'
                    ? (selectedCourse.titleEn || selectedCourse.title)
                    : `Lộ trình ${selectedCourse.title}`}
                </h3>
                <span className="text-xs text-slate-500">
                  {docLang === 'en'
                    ? `${selectedCourse.totalLessons} lessons • ${selectedCourse.estimatedHours} hrs to complete`
                    : `${selectedCourse.totalLessons} bài học • ${selectedCourse.estimatedHours} giờ hoàn thành`}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {selectedCourse.level}
              </span>
            </div>


            <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1">
              {selectedCourse.modules.map((module) => (
                <div key={module.id} className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    {docLang === 'en' && module.titleEn ? module.titleEn : module.title}
                  </h4>
                  <div className="space-y-1">
                    {module.lessons.map((lesson, idx) => {
                      const isCurrent = activeLesson.id === lesson.id && !activeExercise;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleSelectLesson(lesson)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="truncate">
                              {docLang === 'en' && lesson.titleEn ? lesson.titleEn : lesson.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">{lesson.durationMinutes}m</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 8 Cols: Interactive Micro-Lesson & Code Sandbox */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Active Exercise Indicator Bar (If currently in Applied Exercise mode) */}
            {activeExercise ? (
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white">
                    {activeExercise.questionCode}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {docLang === 'en' ? activeExercise.titleEn : activeExercise.titleVi}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Đang luyện tập bài tập ứng dụng thực tế (FPT University Practical Exam)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Language Toggle */}
                  <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <button
                      onClick={() => handleToggleLang('vi')}
                      className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        docLang === 'vi' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      🇻🇳 VI
                    </button>
                    <button
                      onClick={() => handleToggleLang('en')}
                      className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        docLang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      🇬🇧 EN
                    </button>
                  </div>

                  <button
                    onClick={handleBackToLesson}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Quay lại lý thuyết</span>
                  </button>
                </div>
              </div>
            ) : null}

            {/* Lesson Content Card (Or Exercise Statement) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-3">
                <div className="flex items-center gap-2.5">
                  {activeExercise ? (
                    <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  )}
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeExercise
                      ? (docLang === 'en' ? activeExercise.titleEn : activeExercise.titleVi)
                      : (docLang === 'en' && activeLesson.titleEn ? activeLesson.titleEn : activeLesson.title)}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* Language Switcher Button (VI / EN) */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                    <button
                      onClick={() => handleToggleLang('vi')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        docLang === 'vi'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Chuyển sang đề tiếng Việt"
                    >
                      <span>🇻🇳 Tiếng Việt</span>
                    </button>
                    <button
                      onClick={() => handleToggleLang('en')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        docLang === 'en'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Switch to English (Exam mode)"
                    >
                      <span>🇬🇧 English</span>
                    </button>
                  </div>

                  {!activeExercise && (
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                      {activeLesson.durationMinutes} phút
                    </span>
                  )}
                </div>
              </div>

              {/* Lesson Body Rendered with KaTeX */}
              <div className="text-sm">
                {activeExercise ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {docLang === 'en' ? activeExercise.descriptionEn : activeExercise.descriptionVi}
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {activeExercise.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Độ khó: {activeExercise.difficulty}
                      </span>
                      <span className="text-xs text-slate-400">
                        Nguồn: FPT University C/C++ Auto Grading
                      </span>
                    </div>
                  </div>
                ) : (
                  <KaTeXRenderer 
                    content={docLang === 'en' && activeLesson.contentEn ? activeLesson.contentEn : activeLesson.content} 
                  />
                )}
              </div>
            </div>

            {/* VISIBLE TESTCASES EXPLORER (User requirement: 'hiện thêm phần testcase để người dùng biết mình phải làm gì') */}
            {currentTestcases.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {docLang === 'en' ? 'Sample Test Cases & Specifications' : 'Bảng Test Cases Mẫu & Tiêu Chí Đánh Giá'}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {currentTestcases.length} {docLang === 'en' ? 'test cases' : 'trường hợp kiểm thử'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
                            className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            title="Sao chép đầu vào"
                          >
                            {copiedTestIdx === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500 font-bold">Đã chép!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Sao chép</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Input Box */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          {docLang === 'en' ? 'Input:' : 'Đầu vào (Input):'}
                        </span>
                        <pre className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono-code whitespace-pre-wrap">
                          {tc.input || '(Không có input)'}
                        </pre>
                      </div>

                      {/* Expected Output Box */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                          {docLang === 'en' ? 'Expected Output:' : 'Đầu ra kỳ vọng (Expected Output):'}
                        </span>
                        <pre className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-mono-code whitespace-pre-wrap">
                          {tc.expectedOutput}
                        </pre>
                      </div>

                      {/* Explanation */}
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

            {/* CURATED APPLIED EXERCISES (RECOMMENDED AFTER LESSON) */}
            {!activeExercise && activeLesson.appliedExercises && activeLesson.appliedExercises.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {docLang === 'en' ? 'FPTU Applied Practice & Practical Exam' : 'Bài Tập Ứng Dụng Thực Chiến (FPTU PRF192)'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {docLang === 'en' 
                          ? 'Apply your knowledge immediately with authentic university exam questions.' 
                          : 'Rèn luyện phản xạ thi thực hành với các đề thi chuẩn FPT University bám sát lý thuyết vừa học.'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                    {activeLesson.appliedExercises.length} bài tập
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {activeLesson.appliedExercises.map((ex) => (
                    <div 
                      key={ex.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
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
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {docLang === 'en' ? ex.titleEn : ex.titleVi}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {docLang === 'en' ? ex.descriptionEn : ex.descriptionVi}
                        </p>
                      </div>

                      <button
                        onClick={() => handleSelectExercise(ex)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>{docLang === 'en' ? 'Solve Now' : 'Luyện tập bài này'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive In-Browser Sandbox */}
            <div id="academy-sandbox" className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md overflow-hidden text-white scroll-mt-6">
              <div className="h-10 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono text-slate-300">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span>
                    {activeExercise
                      ? `Trình Chấm FPTU Auto-Grading: [${activeExercise.questionCode}] ${docLang === 'en' ? activeExercise.titleEn : activeExercise.titleVi}`
                      : selectedCourse.language === 'c'
                      ? 'Trình Thực Thi C (Dev-C++ / MinGW GCC Wasm Sandbox)'
                      : selectedCourse.language === 'cpp'
                      ? 'Trình Thực Thi C++20 Sandbox (Client-Side Wasm)'
                      : 'Trình Thực Thi Python 3 Sandbox (Pyodide Wasm)'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {draftSaved && (
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                      <Save className="w-3 h-3 text-emerald-400" />
                      <span>{docLang === 'en' ? 'Draft Saved' : 'Đã lưu nháp'}</span>
                    </span>
                  )}
                  <button
                    onClick={handleResetCode}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                    title={docLang === 'en' ? 'Reset to default code (Clears saved draft)' : 'Đặt lại code ban đầu (Xóa bản nháp đã lưu)'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Professional Monaco Code Editor */}
              <div className="relative overflow-hidden bg-slate-950 border-b border-slate-800/80 h-72 sm:h-80 min-h-[260px]">
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

              {/* Action Bar */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHintIndex((prev) => (prev + 1) % (currentHints?.length || 1))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>{docLang === 'en' ? 'Hint' : 'Xem gợi ý'} ({currentHints?.length || 0})</span>
                  </button>
                </div>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
                  title="Phím tắt: Ctrl + Enter"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isRunning ? 'Đang chấm bài...' : (docLang === 'en' ? 'Run & Check Test Cases' : 'Chạy & Kiểm tra nghiệm')}</span>
                  <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded text-[10px] bg-indigo-700/70 text-indigo-200 border border-indigo-500/40 font-mono">
                    Ctrl + ↵
                  </kbd>
                </button>
              </div>

              {/* Hints Box */}
              {showHintIndex >= 0 && currentHints && (
                <div className="px-4 py-3 bg-amber-950/40 border-t border-amber-900/60 text-xs text-amber-200">
                  <strong>{docLang === 'en' ? `Hint #${showHintIndex + 1}:` : `Gợi ý #${showHintIndex + 1}:`}</strong> {currentHints[showHintIndex]}
                </div>
              )}

              {/* Output Terminal */}
              {executionOutput && (
                <div className="p-4 bg-slate-950/90 border-t border-slate-800 font-mono-code text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Console Output:
                    </span>
                    {exercisePassed ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {docLang === 'en' ? 'Accepted! Challenge Completed!' : 'Xuất sắc! Thử thách hoàn thành!'}
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1 text-xs">
                        <AlertCircle className="w-3.5 h-3.5" /> {docLang === 'en' ? 'Test failed, please try again!' : 'Chưa đạt yêu cầu, hãy thử lại!'}
                      </span>
                    )}
                  </div>

                  {/* Jump-to-line diagnostic button if compile error */}
                  {(() => {
                    const match = executionOutput.match(/(?:solution\.c)?:?(\d+):(\d+):\s*(error|warning)/i) || executionOutput.match(/:(\d+):(\d+):/);
                    if (match) {
                      const line = parseInt(match[1], 10);
                      const col = parseInt(match[2], 10);
                      return (
                        <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-800/80 flex items-center justify-between shadow-xs">
                          <span className="text-rose-200 text-xs font-mono">
                            Phát hiện lỗi cú pháp tại <strong className="text-rose-400 font-bold">Dòng {line}</strong>, Cột <strong className="text-rose-400 font-bold">{col}</strong>
                          </span>
                          <button
                            onClick={() => {
                              if (academyMonacoRef.current) {
                                academyMonacoRef.current.revealLineInCenter(line);
                                academyMonacoRef.current.setPosition({ lineNumber: line, column: col });
                                academyMonacoRef.current.focus();
                              }
                            }}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                          >
                            <span>👉 Nhảy đến dòng lỗi trong Monaco</span>
                          </button>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <pre className="text-slate-200 whitespace-pre-wrap">{executionOutput}</pre>

                  {/* Embedded Interactive DiffViewer */}
                  {diffState && (
                    <div className="pt-2 animate-fadeIn font-sans">
                      <DiffViewer
                        actual={diffState.actual}
                        expected={diffState.expected}
                        input={diffState.input}
                        title={docLang === 'en' ? 'Detailed Output Comparison (Diff Inspector)' : 'Bảng So Sánh Chi Tiết Output (Diff Inspector)'}
                        testId={1}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CELEBRATORY CALLOUT WHEN LESSON PASSED: PROMPTING APPLIED PRACTICE */}
            {exercisePassed && !activeExercise && activeLesson.appliedExercises && activeLesson.appliedExercises.length > 0 && (
              <div className="p-5 rounded-2xl bg-linear-to-r from-emerald-500/10 via-indigo-500/10 to-emerald-500/10 border-2 border-emerald-500/30 shadow-lg space-y-3">
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-6 h-6 text-emerald-500 animate-bounce" />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      🎉 {docLang === 'en' ? 'Awesome! You passed the theory challenge!' : 'Xuất sắc! Bạn đã vượt qua bài học lý thuyết!'}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {docLang === 'en'
                        ? 'Solidify your knowledge by solving the authentic FPT University practical exam question below!'
                        : 'Để hiểu sâu hơn và luyện phản xạ thi thực tế, hãy giải ngay bài tập ứng dụng liên quan dưới đây!'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => handleSelectExercise(activeLesson.appliedExercises![0])}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    <span>
                      {docLang === 'en' 
                        ? `Practice Applied Question: ${activeLesson.appliedExercises[0].questionCode} →` 
                        : `Làm bài tập ứng dụng ngay: ${activeLesson.appliedExercises[0].questionCode} (${activeLesson.appliedExercises[0].titleVi}) →`}
                    </span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
