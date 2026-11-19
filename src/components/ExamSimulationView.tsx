import React, { useState, useEffect, useRef } from 'react';
import type {
  ExamSessionConfig,
  ExamQuestionState,
  ExamScorecard,
  Verdict,
} from '../types/index.ts';
import { executeCodeAsync } from '../services/executionManager.ts';
import { ProblemSpecificationView } from './ProblemSpecificationView.tsx';
import { CodeEditor } from './CodeEditor.tsx';
import { EditorCharGauge } from './shared/IDEPrimitives.tsx';
import { DiffViewer } from './DiffViewer.tsx';
import { showToast, askConfirm } from '../services/uiFeedback.ts';
import { ExamHeaderBar } from './exam/ExamHeaderBar.tsx';
import { ExamQuestionMatrix } from './exam/ExamQuestionMatrix.tsx';
import { ExamScorecardModal } from './exam/ExamScorecardModal.tsx';
import confetti from 'canvas-confetti';

interface ExamSimulationViewProps {
  session: ExamSessionConfig;
  onExit: () => void;
}

const DEFAULT_C_TEMPLATE = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

int main() {
    return 0;
}`;

export const ExamSimulationView: React.FC<ExamSimulationViewProps> = ({ session, onExit }) => {
  const totalQuestions = session.problems.length;
  const initialSeconds = session.timeLimitMinutes * 60;
  const endTimestampKey = `ahtest_exam_end_${session.collectionId}`;

  // Persistent Timer Hook via wall-clock timestamp
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(endTimestampKey);
      if (stored) {
        const remaining = Math.max(0, Math.floor((Number(stored) - Date.now()) / 1000));
        return remaining;
      }
      const newEndTime = Date.now() + initialSeconds * 1000;
      localStorage.setItem(endTimestampKey, String(newEndTime));
      return initialSeconds;
    } catch {
      return initialSeconds;
    }
  });

  const [isExamFinished, setIsExamFinished] = useState<boolean>(false);
  const [scorecard, setScorecard] = useState<ExamScorecard | null>(null);
  const [isGradingAll, setIsGradingAll] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>('c17');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [docLang, setDocLang] = useState<'vi' | 'en'>('vi');

  // Bookmarks / Flags persistence
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`ahtest_exam_flags_${session.collectionId}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleFlagQuestion = (idx: number) => {
    setFlaggedQuestions((prev) => {
      const updated = { ...prev, [idx]: !prev[idx] };
      try {
        localStorage.setItem(
          `ahtest_exam_flags_${session.collectionId}`,
          JSON.stringify(updated)
        );
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Active Question & Buffer
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [questionStates, setQuestionStates] = useState<Record<number, ExamQuestionState>>(() => {
    const states: Record<number, ExamQuestionState> = {};
    session.problems.forEach((_, idx) => {
      const draftKey = `ahtest_exam_${session.collectionId}_q${idx}`;
      let savedCode: string | null = null;
      try {
        savedCode = localStorage.getItem(draftKey);
      } catch {
        // ignore
      }
      states[idx] = {
        questionIndex: idx,
        code: savedCode !== null ? savedCode : DEFAULT_C_TEMPLATE,
        isAttempted: savedCode !== null,
        isSolved: false,
      };
    });
    return states;
  });

  const currentProblem = session.problems[currentIndex];
  const currentState = questionStates[currentIndex];
  const [codeBuffer, setCodeBuffer] = useState<string>(currentState?.code || DEFAULT_C_TEMPLATE);
  const [sampleRunOutput, setSampleRunOutput] = useState<string>('');
  const [isEvaluatingSample, setIsEvaluatingSample] = useState<boolean>(false);

  // Sync buffer when currentIndex changes
  const handleSelectIndex = (idx: number) => {
    // Save current buffer
    saveCurrentBuffer();
    setCurrentIndex(idx);
    const nextState = questionStates[idx];
    setCodeBuffer(nextState?.code || DEFAULT_C_TEMPLATE);
    setSampleRunOutput('');
  };

  const saveCurrentBuffer = () => {
    const draftKey = `ahtest_exam_${session.collectionId}_q${currentIndex}`;
    try {
      localStorage.setItem(draftKey, codeBuffer);
    } catch {
      // ignore
    }
    setQuestionStates((prev) => ({
      ...prev,
      [currentIndex]: {
        ...prev[currentIndex],
        code: codeBuffer,
        isAttempted: true,
      },
    }));
  };

  const autoSubmitRef = useRef<() => void>(() => {});

  // Timer Tick Effect
  useEffect(() => {
    if (isExamFinished || remainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          autoSubmitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isExamFinished, remainingSeconds]);

  // Run Sample Test (Sample 1)
  const handleRunSample = async () => {
    if (isEvaluatingSample || !currentProblem) return;
    setIsEvaluatingSample(true);
    setSampleRunOutput('Đang biên dịch và chạy thử trên Test Mẫu #1...');
    const sample = currentProblem.samples?.[0];
    const stdin = sample?.input || '';
    try {
      const res = await executeCodeAsync(selectedLang, codeBuffer, stdin, { timeoutMs: 2500 });
      const out = res.stderr ? `${res.stderr}\n${res.stdout}` : res.stdout;
      setSampleRunOutput(out);
    } catch (err: any) {
      setSampleRunOutput(`Lỗi thực thi: ${err?.message || err}`);
    } finally {
      setIsEvaluatingSample(false);
    }
  };

  // Grade Entire Exam and Open Scorecard
  const gradeAllQuestions = async () => {
    saveCurrentBuffer();
    setIsGradingAll(true);
    showToast('Đang chấm toàn bộ bài thi trên sandbox bảo mật...', 'info');

    let totalEarnedScore = 0;
    let passedCount = 0;
    const details = [];

    for (let idx = 0; idx < totalQuestions; idx++) {
      const prob = session.problems[idx];
      const draftKey = `ahtest_exam_${session.collectionId}_q${idx}`;
      let codeToGrade = codeBuffer;
      if (idx !== currentIndex) {
        try {
          codeToGrade = localStorage.getItem(draftKey) || DEFAULT_C_TEMPLATE;
        } catch {
          codeToGrade = DEFAULT_C_TEMPLATE;
        }
      }

      // Check tests
      const tests =
        prob.testcases && prob.testcases.length > 0
          ? prob.testcases
          : prob.samples && prob.samples.length > 0
          ? prob.samples.map((s, i) => ({
              id: i + 1,
              input: s.input,
              expectedOutput: s.output,
              isHidden: false,
              weight: Math.round(100 / prob.samples.length),
            }))
          : [];

      let questionPassed = tests.length > 0;
      let questionVerdict: Verdict = 'AC';
      let maxTime = 1;

      for (let tIdx = 0; tIdx < tests.length; tIdx++) {
        const tc = tests[tIdx];
        const res = await executeCodeAsync(selectedLang, codeToGrade, tc.input, { timeoutMs: 2000 });
        if (res.executionTimeMs > maxTime) maxTime = res.executionTimeMs;
        const passed = (res.stdout || '').trim() === (tc.expectedOutput || '').trim();
        if (!passed) {
          questionPassed = false;
          if (res.status === 'TLE') questionVerdict = 'TLE';
          else if (res.status === 'CE') questionVerdict = 'CE';
          else if (res.status === 'RTE') questionVerdict = 'RTE';
          else questionVerdict = 'WA';
          break;
        }
      }

      if (questionPassed && tests.length > 0) {
        passedCount += 1;
        totalEarnedScore += 10.0 / totalQuestions;
      }

      details.push({
        questionIndex: idx,
        problemId: prob.id,
        title: prob.title,
        earnedScore: questionPassed ? Number((10.0 / totalQuestions).toFixed(2)) : 0,
        maxScore: Number((10.0 / totalQuestions).toFixed(2)),
        verdict: questionPassed ? ('AC' as Verdict) : questionVerdict,
        timeMs: maxTime,
      });

      // Update questionStates
      setQuestionStates((prev) => ({
        ...prev,
        [idx]: {
          ...prev[idx],
          isSolved: questionPassed,
        },
      }));
    }

    const timeSpent = Math.max(1, initialSeconds - remainingSeconds);
    const card: ExamScorecard = {
      examId: `exam_${session.collectionId}_${Date.now()}`,
      collectionTitle: session.collectionTitle || 'Phòng Thi Chuẩn',
      totalQuestions,
      passedQuestions: passedCount,
      totalScore: totalEarnedScore,
      timeSpentSeconds: timeSpent,
      timeLimitSeconds: initialSeconds,
      submittedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      questionDetails: details,
    };

    setScorecard(card);
    setIsExamFinished(true);
    setIsGradingAll(false);

    if (totalEarnedScore >= 5.0) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  };

  const handleAutoSubmitOnTimeUp = async () => {
    showToast('Hết giờ làm bài! Hệ thống tự động thu bài và chấm điểm...', 'warning');
    await gradeAllQuestions();
  };

  useEffect(() => {
    autoSubmitRef.current = handleAutoSubmitOnTimeUp;
  });

  const handleManualSubmit = async () => {
    const confirmed = await askConfirm({
      title: 'Nộp bài thi?',
      message: `Bạn còn ${Math.floor(remainingSeconds / 60)} phút làm bài. Bạn có chắc chắn muốn nộp bài thi ngay bây giờ?`,
      confirmText: 'Nộp bài ngay',
    });
    if (!confirmed) return;
    await gradeAllQuestions();
  };

  const handleExitExam = async () => {
    if (!isExamFinished) {
      const confirmed = await askConfirm({
        title: 'Rời phòng thi?',
        message: 'Bạn đang trong ca thi tính giờ. Nếu rời phòng thi bây giờ, tiến trình làm bài có thể bị hủy.',
        confirmText: 'Rời phòng thi',
      });
      if (!confirmed) return;
    }
    // Clean up end time
    try {
      localStorage.removeItem(endTimestampKey);
    } catch {
      // ignore
    }
    onExit();
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <ExamHeaderBar
        collectionTitle={session.collectionTitle || 'Phòng Thi Mô Phỏng'}
        remainingSeconds={remainingSeconds}
        onExitExam={handleExitExam}
        onSubmitExam={handleManualSubmit}
        isGradingAll={isGradingAll}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        docLang={docLang}
        onToggleDocLang={setDocLang}
        isZenMode={isZenMode}
        onToggleZenMode={() => setIsZenMode(!isZenMode)}
      />

      {/* Question Navigation Matrix */}
      <ExamQuestionMatrix
        totalQuestions={totalQuestions}
        currentIndex={currentIndex}
        onSelectIndex={handleSelectIndex}
        questionStates={questionStates}
        flaggedQuestions={flaggedQuestions}
        onToggleFlag={toggleFlagQuestion}
        onPrev={() => currentIndex > 0 && handleSelectIndex(currentIndex - 1)}
        onNext={() => currentIndex < totalQuestions - 1 && handleSelectIndex(currentIndex + 1)}
      />

      {/* Main Dual Pane Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Problem Statement */}
        {!isZenMode && (
          <div className="w-1/2 h-full flex flex-col border-r border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto p-6">
            <ProblemSpecificationView
              problem={currentProblem}
              lang={docLang}
              onToggleLang={setDocLang}
              showLangToggle={false}
              scoreWeight={`Câu ${currentIndex + 1}/${totalQuestions}`}
              isExamMode={true}
            />
          </div>
        )}

        {/* Right: Code Editor & Mini Terminal */}
        <div className={`flex flex-col h-full bg-slate-900 ${isZenMode ? 'w-full' : 'w-1/2'}`}>
          {/* Subheader */}
          <div className="h-9 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-xs font-mono text-slate-400 font-semibold">
              câu_{currentIndex + 1}.{selectedLang.startsWith('py') ? 'py' : 'c'}
            </span>
            <EditorCharGauge
              charCount={codeBuffer.length}
              draftSaved={true}
              onResetCode={() => setCodeBuffer(DEFAULT_C_TEMPLATE)}
            />
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden relative">
            <CodeEditor
              value={codeBuffer}
              onChange={(newCode) => {
                setCodeBuffer(newCode);
                const draftKey = `ahtest_exam_${session.collectionId}_q${currentIndex}`;
                try {
                  localStorage.setItem(draftKey, newCode);
                } catch {
                  // ignore
                }
              }}
              language={selectedLang.startsWith('py') ? 'python' : 'c'}
            />
          </div>

          {/* Sample Run Quick Output Bar */}
          <div className="h-44 border-t border-slate-800 bg-slate-950 p-3 flex flex-col shrink-0 space-y-2">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
              <span className="font-semibold text-slate-400">Kiểm thử Test Mẫu:</span>
              <button
                onClick={handleRunSample}
                disabled={isEvaluatingSample}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer disabled:opacity-50 transition-colors"
              >
                {isEvaluatingSample ? 'Đang chạy...' : 'Chạy thử Test #1'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-xs text-slate-300">
              {sampleRunOutput ? (
                currentProblem.samples?.[0] ? (
                  <DiffViewer
                    actual={sampleRunOutput}
                    expected={currentProblem.samples[0].output}
                    isVerdictAC={false}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap">{sampleRunOutput}</pre>
                )
              ) : (
                <div className="text-slate-600 italic py-3 text-center">
                  Bấm &quot;Chạy thử Test #1&quot; để đối chiếu nhanh với output chuẩn của đề bài.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scorecard Modal */}
      <ExamScorecardModal
        isOpen={isExamFinished}
        scorecard={scorecard}
        onClose={() => setIsExamFinished(false)}
        onExitToDashboard={handleExitExam}
      />
    </div>
  );
};
