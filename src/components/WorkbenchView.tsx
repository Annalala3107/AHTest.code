import React, { useState, useEffect, useRef } from 'react';
import type { Problem, Verdict, TestResult } from '../types/index.ts';
import {
  executeCodeAsync,
  type PedagogicalDiagnosis,
  LANGUAGE_LABELS,
} from '../services/executionManager.ts';
import { resolveProgressiveHints } from '../services/progressiveHintService.ts';
import { CodeEditor } from './CodeEditor.tsx';
import { recordStreakActivity } from '../services/streakService.ts';
import { showToast } from '../services/uiFeedback.ts';
import { useCodeDraft } from '../hooks/useCodeDraft.ts';
import { useResizablePanels } from '../hooks/useResizablePanels.ts';
import { useBreakpointLg } from '../hooks/useBreakpointLg.ts';
import { EditorCharGauge } from './shared/IDEPrimitives.tsx';
import {
  DEFAULT_CODES,
  getWorkbenchDraftKey,
  isLeakedWorkbenchDraft,
  loadCleanWorkbenchDraft,
  loadLocalSubmissions,
  saveLocalSubmission,
  loadLocalNotes,
  saveLocalNotes,
  type LocalProblemNote,
} from '../services/workbenchStorage.ts';
import { WorkbenchHeader } from './workbench/WorkbenchHeader.tsx';
import { WorkbenchLeftPane } from './workbench/WorkbenchLeftPane.tsx';
import { WorkbenchConsoleDrawer } from './workbench/WorkbenchConsoleDrawer.tsx';
import { ProgressiveHintDrawer } from './workbench/ProgressiveHintDrawer.tsx';
import { submitSolution } from '../services/repositories/submissionRepository.ts';

interface WorkbenchViewProps {
  problem: Problem;
  onBack: () => void;
  onNextProblem?: () => void;
  hasNextProblem?: boolean;
  onPrevProblem?: () => void;
  hasPrevProblem?: boolean;
  collectionTitle?: string;
}

export const WorkbenchView: React.FC<WorkbenchViewProps> = ({
  problem,
  onBack,
  onNextProblem,
  hasNextProblem,
  onPrevProblem,
  hasPrevProblem,
  collectionTitle,
}) => {
  const isLg = useBreakpointLg();
  const [mobileActiveTab, setMobileActiveTab] = useState<'statement' | 'editor'>('statement');
  const [selectedLang, setSelectedLang] = useState<string>('cpp20');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'statement' | 'editorial' | 'submissions' | 'comments'>('statement');
  const [consoleTab, setConsoleTab] = useState<'samples' | 'custom' | 'results'>('samples');

  // Progressive Hints State
  const progressiveHints = resolveProgressiveHints(problem);
  const [unlockedHintTier, setUnlockedHintTier] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`ahtest_hint_tier_${problem.id}`);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [isHintDrawerOpen, setIsHintDrawerOpen] = useState<boolean>(false);

  // Bilingual Statement
  const [docLang, setDocLang] = useState<'vi' | 'en'>(() => {
    try {
      return (localStorage.getItem('ahtest_doc_lang') as 'vi' | 'en') || 'vi';
    } catch {
      return 'vi';
    }
  });

  const handleToggleDocLang = (lang: 'vi' | 'en') => {
    setDocLang(lang);
    try {
      localStorage.setItem('ahtest_doc_lang', lang);
    } catch {
      // ignore
    }
  };

  // Code Draft Hook
  const draftKey = getWorkbenchDraftKey(problem.id, selectedLang);
  const {
    code,
    setCode,
    draftSaved,
    handleCodeChange,
    resetDraft,
    flushPendingDraft,
  } = useCodeDraft({
    draftKey,
    defaultCode: DEFAULT_CODES[selectedLang] || '',
    isLeakedCheck: (saved) => isLeakedWorkbenchDraft(problem.id, saved),
    debounceMs: 600,
  });

  // When language switches, re-initialize code draft
  const handleSelectLang = (newLang: string) => {
    flushPendingDraft();
    setSelectedLang(newLang);
    const loaded = loadCleanWorkbenchDraft(problem.id, newLang);
    setCode(loaded.code);
  };

  const handleResetCode = () => {
    resetDraft(DEFAULT_CODES[selectedLang] || '');
    showToast('Đã khôi phục mã nguồn mẫu ban đầu.', 'info');
  };

  // Resizable Panels Hook
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
    storagePrefix: 'ahtest_workbench',
    defaultLeftWidth: 50,
    defaultConsoleHeight: 260,
    minLeftWidth: 25,
    maxLeftWidth: 75,
    containerRef,
    editorColumnRef,
  });

  // Editor Ref for Jump to Line
  const editorComponentRef = useRef<{ jumpToLine: (line: number, col?: number) => void } | null>(null);
  const handleJumpToLine = (line: number, col: number = 1) => {
    editorComponentRef.current?.jumpToLine(line, col);
  };

  // Execution & Grading States
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [finalVerdict, setFinalVerdict] = useState<Verdict | null>(null);
  const [pedagogicalDiagnosis, setPedagogicalDiagnosis] = useState<PedagogicalDiagnosis | null>(null);

  // Custom Test Inputs
  const [customInput, setCustomInput] = useState<string>(problem.samples[0]?.input || '');
  const [customExpected, setCustomExpected] = useState<string>(problem.samples[0]?.output || '');
  const [customOutput, setCustomOutput] = useState<string>('');

  // Local Submissions & Notes
  const [submissions, setSubmissions] = useState(() => loadLocalSubmissions(problem.id));
  const [notes, setNotes] = useState(() => loadLocalNotes(problem.id));

  const handleAddNote = (text: string) => {
    const newNote: LocalProblemNote = {
      id: `note_${Date.now()}`,
      author: 'Ghi chú cá nhân',
      text,
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    saveLocalNotes(problem.id, updated);
    showToast('Đã lưu ghi chú thành công.', 'success');
  };

  const handleRestoreSubmissionCode = (subCode: string, submittedAt: string) => {
    handleCodeChange(subCode);
    showToast(`Đã nạp lại mã nguồn lần nộp lúc ${submittedAt}.`, 'info');
  };

  const handleUnlockHintTier = (tier: 1 | 2 | 3) => {
    setUnlockedHintTier(tier);
    try {
      localStorage.setItem(`ahtest_hint_tier_${problem.id}`, String(tier));
    } catch {
      // ignore
    }
  };

  // Run Custom Test
  const handleRunCustomTest = async () => {
    if (isGrading) return;
    setIsGrading(true);
    setCustomOutput('Đang biên dịch và thực thi trên sandbox...');
    try {
      const res = await executeCodeAsync(selectedLang, code, customInput, { timeoutMs: 2500 });
      setCustomOutput(res.stderr ? `${res.stderr}\n${res.stdout}` : res.stdout);
      if (res.pedagogicalDiagnosis) {
        setPedagogicalDiagnosis(res.pedagogicalDiagnosis);
      }
    } catch (err: any) {
      setCustomOutput(`Lỗi thực thi: ${err?.message || err}`);
    } finally {
      setIsGrading(false);
    }
  };

  // Run Samples (F9)
  const handleRunSample = async () => {
    if (isGrading || code.length > 65536) return;
    setIsGrading(true);
    setConsoleTab('results');
    setShowConsole(true);
    setPedagogicalDiagnosis(null);

    const sampleDefinitions = problem.samples || [];
    const results: TestResult[] = [];

    for (let i = 0; i < sampleDefinitions.length; i++) {
      const s = sampleDefinitions[i];
      const res = await executeCodeAsync(selectedLang, code, s.input, { timeoutMs: 2000 });
      const passed = (res.stdout || '').trim() === (s.output || '').trim();
      results.push({
        id: i + 1,
        name: `Sample #${i + 1}`,
        passed,
        timeMs: res.executionTimeMs,
        memoryKb: res.memoryKb,
        actualOutput: res.stderr ? `${res.stderr}\n${res.stdout}` : res.stdout,
        expectedOutput: s.output,
        points: Math.round(100 / sampleDefinitions.length),
      });

      if (!passed && res.pedagogicalDiagnosis && !pedagogicalDiagnosis) {
        setPedagogicalDiagnosis(res.pedagogicalDiagnosis);
      }
    }

    setTestResults(results);
    const allPassed = results.length > 0 && results.every((r) => r.passed);
    setFinalVerdict(allPassed ? 'AC' : 'WA');
    setIsGrading(false);
  };

  // Submit Solution (Ctrl + Enter)
  const handleSubmitSolution = async () => {
    if (isGrading || code.length > 65536) return;
    flushPendingDraft();
    setIsGrading(true);
    setConsoleTab('results');
    setShowConsole(true);
    setPedagogicalDiagnosis(null);

    // Dynamic Testcases: If problem.testcases exists, use them.
    // If empty, fall back strictly to problem.samples.
    // Never fall back to another problem's testcases!
    const testDefinitions =
      problem.testcases && problem.testcases.length > 0
        ? problem.testcases.map((tc, idx) => ({
            id: tc.id || idx + 1,
            testName: tc.isHidden
              ? `Test ẩn #${idx + 1}`
              : `Test #${idx + 1}${idx < problem.samples.length ? ' (Mẫu)' : ''}`,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: !!tc.isHidden,
            weight: tc.weight || Math.max(1, Math.round(100 / problem.testcases!.length)),
          }))
        : problem.samples && problem.samples.length > 0
        ? problem.samples.map((s, idx) => ({
            id: idx + 1,
            testName: `Test mẫu #${idx + 1}`,
            input: s.input,
            expectedOutput: s.output,
            isHidden: false,
            weight: Math.round(100 / problem.samples.length),
          }))
        : [];

    if (testDefinitions.length === 0) {
      setIsGrading(false);
      showToast('Bài tập này chưa có bộ testcase chấm điểm. Vui lòng dùng tab Custom Test.', 'warning');
      return;
    }

    const results: TestResult[] = [];
    let firstFailDiag: PedagogicalDiagnosis | null = null;
    let earnedPoints = 0;
    let computedVerdict: Verdict = 'AC';

    for (let i = 0; i < testDefinitions.length; i++) {
      const t = testDefinitions[i];
      const res = await executeCodeAsync(selectedLang, code, t.input, { timeoutMs: 2000 });
      const passed = (res.stdout || '').trim() === (t.expectedOutput || '').trim();

      if (passed) {
        earnedPoints += t.weight;
      } else {
        if (computedVerdict === 'AC') {
          if (res.status === 'TLE') computedVerdict = 'TLE';
          else if (res.status === 'CE') computedVerdict = 'CE';
          else if (res.status === 'RTE') computedVerdict = 'RTE';
          else computedVerdict = 'WA';
        }
        if (!firstFailDiag && res.pedagogicalDiagnosis) {
          firstFailDiag = res.pedagogicalDiagnosis;
        }
      }

      results.push({
        id: t.id,
        name: t.testName,
        passed,
        timeMs: res.executionTimeMs,
        memoryKb: res.memoryKb,
        actualOutput: res.stderr ? `${res.stderr}\n${res.stdout}` : res.stdout,
        expectedOutput: t.expectedOutput,
        points: passed ? t.weight : 0,
      });
    }

    setTestResults(results);
    setFinalVerdict(computedVerdict);
    if (firstFailDiag) {
      setPedagogicalDiagnosis(firstFailDiag);
    }

    // Record streak activity if AC
    if (computedVerdict === 'AC') {
      recordStreakActivity();
    }

    // Save Submission Record with human-readable language label
    const langLabel = LANGUAGE_LABELS[selectedLang] || selectedLang.toUpperCase();
    const submissionRecord = {
      id: `sub_${Date.now()}`,
      problemId: problem.id,
      code,
      language: langLabel,
      verdict: computedVerdict,
      score: earnedPoints,
      maxScore: 100,
      timeMs: Math.max(...results.map((r) => r.timeMs || 0), 1),
      memoryKb: Math.max(...results.map((r) => r.memoryKb || 0), 512),
      submittedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedSubs = saveLocalSubmission(problem.id, submissionRecord);
    setSubmissions(updatedSubs);

    // Sync to Supabase DB asynchronously without blocking UI
    submitSolution({
      problemId: problem.id,
      language: selectedLang,
      code,
      verdict: computedVerdict,
      score: earnedPoints,
      maxScore: 100,
      timeMs: submissionRecord.timeMs,
      memoryKb: submissionRecord.memoryKb,
      passedTests: results.filter((r) => r.passed).length,
      totalTests: results.length,
    }).catch(() => {});

    if (computedVerdict === 'AC') {
      showToast('Chúc mừng! Bạn đã hoàn thành chính xác 100% testcase.', 'success');
    } else {
      showToast(`Kết quả: ${computedVerdict} (${earnedPoints}/100 điểm)`, 'warning');
    }

    setIsGrading(false);
  };

  const runSampleRef = useRef(handleRunSample);
  const submitSolutionRef = useRef(handleSubmitSolution);
  const onNextProblemRef = useRef(onNextProblem);

  useEffect(() => {
    runSampleRef.current = handleRunSample;
    submitSolutionRef.current = handleSubmitSolution;
    onNextProblemRef.current = onNextProblem;
  });

  // Keyboard Shortcuts: F9 to run sample, Ctrl+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        e.preventDefault();
        runSampleRef.current();
      } else if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        submitSolutionRef.current();
      } else if (e.shiftKey && e.key === 'Enter' && finalVerdict === 'AC' && hasNextProblem) {
        e.preventDefault();
        onNextProblemRef.current?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [finalVerdict, hasNextProblem]);

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <WorkbenchHeader
        problem={problem}
        collectionTitle={collectionTitle}
        onBack={onBack}
        hasPrevProblem={hasPrevProblem}
        onPrevProblem={onPrevProblem}
        hasNextProblem={hasNextProblem}
        onNextProblem={onNextProblem}
        selectedLang={selectedLang}
        onSelectLang={handleSelectLang}
        docLang={docLang}
        onToggleDocLang={handleToggleDocLang}
        isZenMode={isZenMode}
        onToggleZenMode={() => setIsZenMode(!isZenMode)}
        splitPercent={splitPercent}
        onSetSplitPercent={setSplitPercent}
        isHintDrawerOpen={isHintDrawerOpen}
        onToggleHintDrawer={() => setIsHintDrawerOpen(!isHintDrawerOpen)}
        unlockedHintTier={unlockedHintTier}
        isGrading={isGrading}
        codeLength={code.length}
        onRunSample={handleRunSample}
        onSubmitSolution={handleSubmitSolution}
        mobileActiveTab={mobileActiveTab}
        onSetMobileActiveTab={setMobileActiveTab}
      />

      {/* Main Dual-Pane Workspace */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
        {/* Left Pane (Statement / Editorial / Submissions / Notes) */}
        {(!isZenMode && (isLg || mobileActiveTab === 'statement')) && (
          <div
            style={{ width: isLg && !isZenMode ? `${splitPercent}%` : '100%' }}
            className="h-full flex flex-col shrink-0 overflow-hidden"
          >
            <WorkbenchLeftPane
              problem={problem}
              docLang={docLang}
              onToggleDocLang={handleToggleDocLang}
              activeTab={activeTab}
              onSetActiveTab={setActiveTab}
              finalVerdict={finalVerdict}
              unlockedHintTier={unlockedHintTier}
              submissions={submissions}
              onRestoreSubmissionCode={handleRestoreSubmissionCode}
              notes={notes}
              onAddNote={handleAddNote}
              hasNextProblem={hasNextProblem}
              onNextProblem={onNextProblem}
            />
          </div>
        )}

        {/* Resizer Splitter (Desktop Only) */}
        {isLg && !isZenMode && (
          <div
            onMouseDown={() => setIsDraggingSplitter(true)}
            className={`w-1.5 hover:w-2 bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 cursor-col-resize transition-all shrink-0 z-30 ${
              isDraggingSplitter ? 'bg-rose-500 w-2' : ''
            }`}
            title="Kéo sang trái/phải để điều chỉnh độ rộng màn hình"
          />
        )}

        {/* Right Pane (Code Editor & Console Drawer) */}
        {(isLg || mobileActiveTab === 'editor') && (
          <div
            ref={editorColumnRef}
            style={{ width: isLg && !isZenMode ? `${100 - splitPercent}%` : '100%' }}
            className="flex-1 flex flex-col h-full bg-slate-900 overflow-hidden relative"
          >
            {/* Editor Sub-Header (Char Gauge, Draft Saved, Reset) */}
            <div className="h-9 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-mono text-slate-400 font-semibold flex items-center gap-2">
                <span>main.{selectedLang.startsWith('py') ? 'py' : selectedLang.startsWith('sql') ? 'sql' : selectedLang.startsWith('java') ? 'java' : 'cpp'}</span>
              </span>
              <EditorCharGauge
                charCount={code.length}
                draftSaved={draftSaved}
                onResetCode={handleResetCode}
              />
            </div>

            {/* Monaco Code Editor */}
            <div className="flex-1 overflow-hidden relative">
              <CodeEditor
                ref={editorComponentRef}
                value={code}
                onChange={handleCodeChange}
                language={selectedLang.startsWith('py') ? 'python' : selectedLang.startsWith('java') ? 'java' : selectedLang.startsWith('sql') ? 'sql' : 'cpp'}
              />
            </div>

            {/* Console Resizer Bar (Vertical) */}
            <div
              onMouseDown={() => setIsDraggingConsole(true)}
              className={`h-1.5 hover:h-2 bg-slate-800 hover:bg-rose-500 cursor-row-resize transition-all shrink-0 z-30 ${
                isDraggingConsole ? 'bg-rose-500 h-2' : ''
              }`}
              title="Kéo lên/xuống để điều chỉnh chiều cao Console"
            />

            {/* Bottom Console Drawer */}
            <WorkbenchConsoleDrawer
              showConsole={showConsole}
              setShowConsole={setShowConsole}
              consoleHeight={consoleHeight}
              setConsoleHeight={setConsoleHeight}
              isConsoleMaximized={isConsoleMaximized}
              setIsConsoleMaximized={setIsConsoleMaximized}
              consoleTab={consoleTab}
              setConsoleTab={setConsoleTab}
              isGrading={isGrading}
              finalVerdict={finalVerdict}
              testResults={testResults}
              samples={problem.samples || []}
              customInput={customInput}
              setCustomInput={setCustomInput}
              customOutput={customOutput}
              customExpected={customExpected}
              setCustomExpected={setCustomExpected}
              onRunCustomTest={handleRunCustomTest}
              onJumpToLine={handleJumpToLine}
              pedagogicalDiagnosis={pedagogicalDiagnosis}
            />
          </div>
        )}
      </div>

      {/* Right Slide-Over Progressive Hint Drawer */}
      {isHintDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-[2px] animate-fadeIn"
          onClick={() => setIsHintDrawerOpen(false)}
        >
          <div
            className="w-full max-w-lg h-full bg-slate-900 border-l border-amber-500/30 shadow-2xl overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <ProgressiveHintDrawer
              hints={progressiveHints}
              unlockedTier={unlockedHintTier}
              onUnlockTier={handleUnlockHintTier}
              onClose={() => setIsHintDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
