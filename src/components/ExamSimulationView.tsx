import React, { useState, useEffect, useRef } from 'react';
import { 
  Timer, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Send, 
  Award, 
  Flame, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  X,
  Sparkles,
  BarChart3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExamSessionConfig, ExamQuestionState, ExamScorecard, TestResult } from '../types';
import { CodeEditor } from './CodeEditor';
import { ProblemSpecificationView } from './ProblemSpecificationView';
import { executeCCode } from '../services/cExecutionEngine';

interface ExamSimulationViewProps {
  session: ExamSessionConfig;
  onExit: () => void;
}

const DEFAULT_C_TEMPLATE = (title: string) => `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

int main() {
    // ${title}
    
    return 0;
}
`;

export const ExamSimulationView: React.FC<ExamSimulationViewProps> = ({ session, onExit }) => {
  const totalQuestions = session.problems.length;
  const initialSeconds = session.timeLimitMinutes * 60;

  // Countdown timer state
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialSeconds);
  const [isExamFinished, setIsExamFinished] = useState<boolean>(false);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState<boolean>(false);
  const [scorecard, setScorecard] = useState<ExamScorecard | null>(null);

  // Bilingual state (VI / EN)
  const [docLang, setDocLang] = useState<'vi' | 'en'>(() => {
    return (localStorage.getItem('ahtest_doc_lang') as 'vi' | 'en') || 'vi';
  });

  const handleToggleLang = (lang: 'vi' | 'en') => {
    setDocLang(lang);
    try {
      localStorage.setItem('ahtest_doc_lang', lang);
    } catch {
      // ignore
    }
  };

  // Active question index
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Per-question state
  const [questionStates, setQuestionStates] = useState<Record<number, ExamQuestionState>>(() => {
    const states: Record<number, ExamQuestionState> = {};
    session.problems.forEach((p, idx) => {
      // Check if draft already stored in localStorage
      const draftKey = `ahtest_exam_${session.collectionId}_q${idx}`;
      const savedCode = localStorage.getItem(draftKey);

      states[idx] = {
        problemId: p.id,
        code: savedCode || DEFAULT_C_TEMPLATE(p.title),
        status: 'unattempted',
        score: 0,
        testResults: []
      };
    });
    return states;
  });

  // Current problem & state
  const currentProblem = session.problems[currentIndex];
  const currentState = questionStates[currentIndex];

  // Editor code buffer
  const [codeBuffer, setCodeBuffer] = useState<string>(currentState?.code || '');
  const [consoleTab, setConsoleTab] = useState<'sample' | 'results'>('sample');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [sampleRunStdout, setSampleRunStdout] = useState<string>('');
  const [sampleRunStatus, setSampleRunStatus] = useState<string>('');

  // Sync buffer on question change
  useEffect(() => {
    if (questionStates[currentIndex]) {
      setCodeBuffer(questionStates[currentIndex].code);
      setSampleRunStdout(questionStates[currentIndex].lastRunStdout || '');
      setSampleRunStatus('');
    }
  }, [currentIndex]);

  // Persist code changes in memory and localStorage
  const handleCodeChange = (newCode: string) => {
    setCodeBuffer(newCode);
    setQuestionStates(prev => ({
      ...prev,
      [currentIndex]: {
        ...prev[currentIndex],
        code: newCode,
        status: prev[currentIndex].status === 'unattempted' ? 'in_progress' : prev[currentIndex].status
      }
    }));
    try {
      localStorage.setItem(`ahtest_exam_${session.collectionId}_q${currentIndex}`, newCode);
    } catch {
      // ignore
    }
  };

  // Timer Tick Interval
  const finalSubmitRef = useRef<((isAuto?: boolean) => void) | null>(null);

  useEffect(() => {
    if (isExamFinished) return;

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finalSubmitRef.current?.(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamFinished]);

  // Format seconds to HH:MM:SS or MM:SS
  const formatTimer = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Switch to another question safely
  const handleSelectQuestion = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= totalQuestions) return;
    // Save current code to state before switching
    setQuestionStates(prev => ({
      ...prev,
      [currentIndex]: {
        ...prev[currentIndex],
        code: codeBuffer
      }
    }));
    setCurrentIndex(targetIdx);
  };

  // Run code against public sample tests (Sanity check)
  const handleRunSample = () => {
    setIsEvaluating(true);
    setConsoleTab('sample');
    setSampleRunStatus('Running...');

    setTimeout(() => {
      const sample = currentProblem.samples?.[0] || { input: '', output: '' };
      const res = executeCCode(codeBuffer, sample.input);

      if (res.status === 'CE') {
        setSampleRunStatus('Compile Error (CE)');
        setSampleRunStdout(res.stderr || 'Lỗi cú pháp trình biên dịch');
      } else if (res.status === 'RTE') {
        setSampleRunStatus('Runtime Error (RTE)');
        setSampleRunStdout(res.stderr || 'Chương trình bị dừng đột ngột');
      } else if (res.status === 'TLE') {
        setSampleRunStatus('Time Limit Exceeded (TLE)');
        setSampleRunStdout('Vượt quá thời gian thực thi (vòng lặp vô hạn)');
      } else {
        const cleanActual = res.stdout.replace(/\r\n/g, '\n').trim();
        const cleanExpected = sample.output.replace(/\r\n/g, '\n').trim();
        const isMatch = cleanActual === cleanExpected;
        setSampleRunStatus(isMatch ? 'Sample Passed (Khớp đáp án)' : 'Sample Output Mismatch');
        setSampleRunStdout(res.stdout);
      }

      setQuestionStates(prev => ({
        ...prev,
        [currentIndex]: {
          ...prev[currentIndex],
          lastRunStdout: res.stdout || res.stderr
        }
      }));

      setIsEvaluating(false);
    }, 200);
  };

  // Grade the current question across all testcases
  const handleGradeCurrentQuestion = () => {
    setIsEvaluating(true);
    setConsoleTab('results');

    setTimeout(() => {
      const tests = currentProblem.testcases && currentProblem.testcases.length > 0
        ? currentProblem.testcases
        : currentProblem.samples.map((s, i) => ({
            id: i + 1,
            input: s.input,
            expectedOutput: s.output,
            isHidden: false
          }));

      let passedCount = 0;
      const testResults: TestResult[] = [];

      for (let i = 0; i < tests.length; i++) {
        const t = tests[i];
        const res = executeCCode(codeBuffer, t.input);
        const cleanActual = res.stdout.replace(/\r\n/g, '\n').trim();
        const cleanExpected = t.expectedOutput.replace(/\r\n/g, '\n').trim();
        const isAc = res.status === 'SUCCESS' && cleanActual === cleanExpected;

        if (isAc) passedCount++;

        testResults.push({
          testId: t.id || i + 1,
          verdict: isAc ? 'AC' : res.status === 'SUCCESS' ? 'WA' : res.status,
          time: res.executionTimeMs,
          memory: res.memoryKb,
          score: isAc ? 100 : 0,
          maxScore: 100
        });
      }

      const scorePercent = Math.round((passedCount / tests.length) * 100);
      const isFullAc = passedCount === tests.length;

      setQuestionStates(prev => ({
        ...prev,
        [currentIndex]: {
          ...prev[currentIndex],
          code: codeBuffer,
          status: isFullAc ? 'passed' : 'failed',
          score: scorePercent,
          testResults
        }
      }));

      setIsEvaluating(false);
    }, 300);
  };

  // Final Exam Submission & Scorecard generation
  const handleFinalSubmit = (_isAutoTimeout: boolean = false) => {
    setIsSubmitConfirmOpen(false);
    setIsExamFinished(true);

    const timeSpent = initialSeconds - remainingSeconds;

    // Grade all questions that haven't been graded yet
    const finalStates = { ...questionStates };
    let totalScoreSum = 0;
    let passedQuestionsCount = 0;

    const details: ExamScorecard['questionDetails'] = [];
    const weakTopics: Set<string> = new Set();
    const strongTopics: Set<string> = new Set();

    session.problems.forEach((p, idx) => {
      let state = finalStates[idx];
      // If code buffer was edited on current index, ensure it's saved
      const codeToGrade = idx === currentIndex ? codeBuffer : state.code;
      const isTouched = codeToGrade.trim().length > 25 && codeToGrade.includes('main') && codeToGrade.trim() !== DEFAULT_C_TEMPLATE(p.title).trim();

      const tests = p.testcases && p.testcases.length > 0
        ? p.testcases
        : p.samples.map((s, i) => ({ id: i + 1, input: s.input, expectedOutput: s.output, isHidden: false }));

      let passedCount = 0;
      if (isTouched) {
        tests.forEach(t => {
          const res = executeCCode(codeToGrade, t.input);
          const cleanActual = res.stdout.replace(/\r\n/g, '\n').trim();
          const cleanExpected = t.expectedOutput.replace(/\r\n/g, '\n').trim();
          if (res.status === 'SUCCESS' && cleanActual === cleanExpected) passedCount++;
        });
      }

      const questionScore = isTouched ? Math.round((passedCount / tests.length) * 100) : 0;
      const isPassed = isTouched && passedCount === tests.length;

      if (isPassed) {
        passedQuestionsCount++;
        p.tags.forEach(t => strongTopics.add(t));
      } else {
        p.tags.forEach(t => weakTopics.add(t));
      }

      totalScoreSum += (questionScore / 100);

      details.push({
        questionIndex: idx + 1,
        title: p.title,
        difficulty: p.difficulty,
        status: !isTouched ? 'unattempted' : isPassed ? 'passed' : 'failed',
        score: questionScore,
        passedTests: passedCount,
        totalTests: tests.length
      });
    });

    // 10.0 scale calculation
    const finalScore = Number(((totalScoreSum / totalQuestions) * 10).toFixed(1));

    // Pedagogical Strengths & Weaknesses
    const strengths = Array.from(strongTopics).slice(0, 3).map(t => `Vững kỹ năng ${t}`);
    if (strengths.length === 0) strengths.push('Cần rèn luyện thêm các kỹ thuật lập trình cơ bản');

    const weaknesses = Array.from(weakTopics).slice(0, 3).map(t => `Cần ôn tập thêm chuyên đề ${t}`);
    if (weaknesses.length === 0) weaknesses.push('Không có lỗ hổng lớn! Phong độ xuất sắc.');

    const recommendations = [
      finalScore >= 8.0 
        ? 'Bạn đã đạt chuẩn điểm Giỏi (>= 8.0). Tiếp tục duy trì phản xạ giải đề thi có bấm giờ!'
        : 'Hãy ôn lại các bẫy ngầm về ép kiểu số thực (float) và ký tự kết thúc chuỗi \\0 để tăng điểm.',
      'Rèn luyện thói quen kiểm tra các testcase biên (ví dụ: N=1, số âm, chuỗi có khoảng trắng).'
    ];

    const card: ExamScorecard = {
      examId: `exam_${Date.now()}`,
      collectionTitle: session.collectionTitle,
      totalQuestions,
      passedQuestions: passedQuestionsCount,
      totalScore: finalScore,
      timeSpentSeconds: timeSpent,
      timeLimitSeconds: initialSeconds,
      submittedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      questionDetails: details,
      strengths,
      weaknesses,
      recommendations
    };

    setScorecard(card);

    // Fire confetti for high scores!
    if (finalScore >= 8.0) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    finalSubmitRef.current = handleFinalSubmit;
  });

  // Count metrics
  const answeredCount = Object.values(questionStates).filter(
    s => s.status === 'passed' || s.status === 'failed' || s.code.trim().length > 120
  ).length;

  const timerColor = 
    remainingSeconds > 900 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
    remainingSeconds > 300 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
    'text-rose-400 bg-rose-500/20 border-rose-500/50 animate-pulse font-black';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      {/* 1. EXAM TOP BAR */}
      <header className="h-14 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 shadow-lg">
        {/* Left: Exam Info & Recording status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>{docLang === 'en' ? 'OFFICIAL LAB EXAM' : 'PHÒNG THI THẬT'}</span>
          </div>

          <div className="hidden sm:block">
            <h2 className="text-xs font-extrabold text-slate-200 truncate max-w-xs">
              {docLang === 'en' ? 'PRF192 Comprehensive Lab Exam' : session.collectionTitle}
            </h2>
            <span className="text-[10px] text-slate-400">
              {docLang === 'en' 
                ? `Standard Practical Assessment (${totalQuestions} problems • MinGW GCC Sandbox)` 
                : `Đề thi tổng hợp (${totalQuestions} câu hỏi • MinGW GCC Sandbox)`}
            </span>
          </div>
        </div>

        {/* Center: Live Countdown Timer & Bilingual Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-xl border text-xs sm:text-sm font-mono font-bold tracking-wider ${timerColor}`}>
            <Timer className="w-4 h-4" />
            <span>{formatTimer(remainingSeconds)}</span>
          </div>

          {/* Bilingual Switcher (VI / EN) */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs shadow-xs">
            <button
              onClick={() => handleToggleLang('vi')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                docLang === 'vi'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Đề thi Tiếng Việt"
            >
              <span>🇻🇳</span>
              <span>VI</span>
            </button>
            <button
              onClick={() => handleToggleLang('en')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                docLang === 'en'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="English Practical Exam (Exam Mode)"
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-semibold px-2">
            <span>{docLang === 'en' ? 'Progress:' : 'Tiến độ:'}</span>
            <span className="text-rose-400 font-bold">{answeredCount}/{totalQuestions} {docLang === 'en' ? 'done' : 'câu'}</span>
          </div>

          <button
            onClick={() => setIsSubmitConfirmOpen(true)}
            className="px-4 py-1.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{docLang === 'en' ? 'Submit Entire Exam' : 'Nộp Toàn Bộ Bài Thi'}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc muốn thoát phòng thi? Tiến trình thi sẽ bị hủy!')) {
                onExit();
              }
            }}
            title="Thoát phòng thi"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. QUESTION MATRIX BAR */}
      <div className="h-11 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          <span>Câu:</span>
        </span>

        {session.problems.map((p, idx) => {
          const st = questionStates[idx];
          const isCurrent = idx === currentIndex;

          let badgeStyle = 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border-slate-700';
          let statusIcon = null;

          if (st.status === 'passed') {
            badgeStyle = 'bg-emerald-600 text-white border-emerald-500';
            statusIcon = <Check className="w-3 h-3 stroke-[3]" />;
          } else if (st.status === 'failed') {
            badgeStyle = 'bg-rose-600 text-white border-rose-500';
            statusIcon = <X className="w-3 h-3 stroke-[3]" />;
          } else if (st.status === 'in_progress' || st.code.trim().length > 120) {
            badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
            statusIcon = <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />;
          }

          return (
            <button
              key={p.id}
              onClick={() => handleSelectQuestion(idx)}
              className={`h-7 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all shrink-0 cursor-pointer ${badgeStyle} ${
                isCurrent ? 'ring-2 ring-rose-400 shadow-md scale-105 font-black z-10' : ''
              }`}
            >
              <span>{idx + 1}</span>
              {statusIcon}
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2 shrink-0 pl-2">
          <button
            disabled={currentIndex === 0}
            onClick={() => handleSelectQuestion(currentIndex - 1)}
            className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-400">
            {currentIndex + 1} / {totalQuestions}
          </span>
          <button
            disabled={currentIndex === totalQuestions - 1}
            onClick={() => handleSelectQuestion(currentIndex + 1)}
            className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. EXAM WORKSPACE (SPLIT VIEW: STATEMENT & EDITOR) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Problem Statement & Constraints (Khung hiển thị chuẩn Khảo Thí) */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-slate-800 bg-slate-900/40 overflow-y-auto p-5">
          <ProblemSpecificationView
            problem={currentProblem}
            lang={docLang}
            onToggleLang={handleToggleLang}
            showLangToggle={false}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
            scoreWeight={`${(10 / totalQuestions).toFixed(1)} / 10.0`}
            isExamMode={true}
          />
        </div>

        {/* Right: Code Editor & Execution Arena */}
        <div className="w-full md:w-1/2 flex flex-col bg-slate-950 overflow-hidden">
          {/* Editor Header Bar */}
          <div className="h-10 px-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
            <span className="font-mono text-slate-300 font-bold flex items-center gap-1.5">
              <span>Trình soạn thảo C (MinGW GCC 16)</span>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-mono">
                {codeBuffer.length}/5,000 ký tự
              </span>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              value={codeBuffer}
              onChange={handleCodeChange}
              language="c"
              height="100%"
              maxLength={5000}
              showCharBadge={false}
            />
          </div>

          {/* Mini Execution Bar */}
          <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                disabled={isEvaluating}
                onClick={handleRunSample}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-blue-400 fill-current" />
                <span>{docLang === 'en' ? 'Run Sample Test' : 'Chạy Thử Mẫu'}</span>
              </button>

              <button
                disabled={isEvaluating}
                onClick={handleGradeCurrentQuestion}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{docLang === 'en' ? 'Grade Question' : 'Chấm Điểm Câu Này'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentIndex === totalQuestions - 1}
                onClick={() => handleSelectQuestion(currentIndex + 1)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 flex items-center gap-1 cursor-pointer disabled:opacity-30"
              >
                <span>{docLang === 'en' ? 'Next Question' : 'Câu Tiếp Theo'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Console Drawer */}
          <div className="h-36 bg-slate-950 border-t border-slate-800 flex flex-col shrink-0 text-xs font-mono">
            <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setConsoleTab('sample')}
                  className={`font-bold transition-colors cursor-pointer ${
                    consoleTab === 'sample' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {docLang === 'en' ? 'Sample Execution' : 'Kết Quả Chạy Mẫu'} {sampleRunStatus && `(${sampleRunStatus})`}
                </button>
                <button
                  onClick={() => setConsoleTab('results')}
                  className={`font-bold transition-colors cursor-pointer ${
                    consoleTab === 'results' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {docLang === 'en' ? 'Test Results' : 'Bảng Chấm Test'} ({currentState.score}%)
                </button>
              </div>

              {currentState.status === 'passed' && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Đã vượt qua toàn bộ test (100%)
                </span>
              )}
            </div>

            <div className="flex-1 p-3 overflow-y-auto text-slate-300">
              {consoleTab === 'sample' ? (
                sampleRunStdout ? (
                  <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                    {sampleRunStdout}
                  </pre>
                ) : (
                  <span className="text-slate-500 italic">
                    Chưa chạy thử. Bấm "Chạy Thử Mẫu" để kiểm tra output trên Sample Case #1.
                  </span>
                )
              ) : (
                currentState.testResults.length > 0 ? (
                  <div className="space-y-1.5">
                    {currentState.testResults.map(tr => (
                      <div key={tr.testId} className="flex items-center justify-between text-[11px] py-0.5 border-b border-slate-900">
                        <span>Test Case #{tr.testId}</span>
                        <span className={`font-bold ${tr.verdict === 'AC' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tr.verdict} ({tr.time}ms)
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 italic">
                    Chưa chấm câu này. Bấm "Chấm Điểm Câu Này" để máy chấm toàn bộ test case.
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. SUBMIT CONFIRMATION MODAL */}
      {isSubmitConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-black text-base text-slate-100">
                Xác Nhận Nộp Toàn Bộ Bài Thi?
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Tổng số câu thi:</span>
                <span className="font-bold text-slate-200">{totalQuestions} câu</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Số câu đã làm:</span>
                <span className="font-bold text-rose-400">{answeredCount} câu</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Thời gian còn lại:</span>
                <span className="font-bold text-amber-400">{formatTimer(remainingSeconds)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Sau khi nộp, hệ thống sẽ tự động chấm toàn bộ các câu hỏi còn lại và lập <strong>Bảng Điểm Chi Tiết (Scorecard)</strong>. Bạn sẽ không thể tiếp tục chỉnh sửa code của bài thi này.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsSubmitConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                Tiếp Tục Làm Bài
              </button>
              <button
                onClick={() => handleFinalSubmit(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Xác Nhận Nộp Bài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. POST-EXAM SCORECARD & ANALYTICS MODAL */}
      {scorecard && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <Award className="w-4 h-4" />
                <span>BẢNG ĐIỂM KẾT QUẢ THI THỬ PRF192</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-100">
                {scorecard.collectionTitle}
              </h2>
              <span className="text-xs text-slate-400 block">
                Nộp lúc {scorecard.submittedAt} • Thời gian làm bài: {Math.floor(scorecard.timeSpentSeconds / 60)} phút {scorecard.timeSpentSeconds % 60} giây
              </span>
            </div>

            {/* Score Highlight Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/40 border border-slate-800 text-center space-y-2 shadow-inner">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Điểm Tổng Kết (Thang điểm 10.0)
              </span>
              <div className="text-5xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-300 to-amber-300">
                {scorecard.totalScore}
                <span className="text-2xl text-slate-500 font-bold"> / 10.0</span>
              </div>
              <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${
                scorecard.totalScore >= 8.0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                scorecard.totalScore >= 5.0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {scorecard.totalScore >= 8.0 ? 'Xếp Loại: GIỎI (Passed with Distinction)' :
                 scorecard.totalScore >= 5.0 ? 'Xếp Loại: ĐẠT (Passed)' :
                 'Xếp Loại: CHƯA ĐẠT (Needs Practice)'}
              </span>
            </div>

            {/* Questions Performance Matrix */}
            <div className="space-y-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-rose-400" />
                <span>Chi Tiết Từng Câu Hỏi ({scorecard.passedQuestions}/{scorecard.totalQuestions} câu hoàn thành):</span>
              </span>

              <div className="max-h-48 overflow-y-auto space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-xs">
                {scorecard.questionDetails.map((q) => (
                  <div key={q.questionIndex} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                        q.status === 'passed' ? 'bg-emerald-500 text-white' :
                        q.status === 'failed' ? 'bg-rose-500 text-white' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {q.questionIndex}
                      </span>
                      <span className="truncate text-slate-200">{q.title}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className="text-[11px] text-slate-400">
                        {q.passedTests}/{q.totalTests} tests
                      </span>
                      <span className={`font-bold ${q.status === 'passed' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {q.score} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pedagogical Diagnosis & Recommendations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Điểm Mạnh Ghi Nhận:</span>
                </span>
                <ul className="space-y-1 text-slate-300">
                  {scorecard.strengths.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Lỗ Hổng Cần Khắc Phục:</span>
                </span>
                <ul className="space-y-1 text-slate-300">
                  {scorecard.weaknesses.map((w, i) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setScorecard(null);
                  // Resume in review mode
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                Xem Lại Bài Thi & Mã Nguồn
              </button>

              <button
                onClick={onExit}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                Trở Về Kho Đề Ngoại Nhập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
