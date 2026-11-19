import React from 'react';
import {
  Terminal,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import type { AcademyLesson } from '../../types/index.ts';
import type { PedagogicalDiagnosis } from '../../services/executionManager.ts';
import { DiffViewer } from '../DiffViewer.tsx';
import { ConsoleHeightControls, CompilerDiagnosticJumpBar } from '../shared/IDEPrimitives.tsx';
import { PedagogicalDiagnosisCard } from '../workbench/PedagogicalDiagnosisCard.tsx';

export interface AcademyConsoleDrawerProps {
  isConsoleCollapsed: boolean;
  setIsConsoleCollapsed: (c: boolean) => void;
  consoleHeight: number;
  setConsoleHeight: (h: number) => void;
  isConsoleMaximized: boolean;
  setIsConsoleMaximized: (m: boolean) => void;
  isRunning: boolean;
  exercisePassed: boolean;
  executionOutput: string | null;
  onClearOutput: () => void;
  diffState: { actual: string; expected: string; input?: string; isFailed: boolean } | null;
  pedagogicalDiagnosis: PedagogicalDiagnosis | null;
  onJumpToLine: (line: number, col?: number) => void;
  nextLessonCandidate: AcademyLesson | null;
  onNextLesson: () => void;
}

export const AcademyConsoleDrawer: React.FC<AcademyConsoleDrawerProps> = ({
  isConsoleCollapsed,
  setIsConsoleCollapsed,
  consoleHeight,
  setConsoleHeight,
  isConsoleMaximized,
  setIsConsoleMaximized,
  isRunning,
  exercisePassed,
  executionOutput,
  onClearOutput,
  diffState,
  pedagogicalDiagnosis,
  onJumpToLine,
  nextLessonCandidate,
  onNextLesson,
}) => {
  return (
    <div
      style={{
        height: isConsoleMaximized ? '100%' : !isConsoleCollapsed ? `${consoleHeight}px` : '36px',
      }}
      className={`border-t border-slate-800 bg-slate-950 flex flex-col shrink-0 transition-all ${
        isConsoleMaximized ? 'absolute inset-0 z-40' : ''
      }`}
    >
      {/* Console Top Header Bar */}
      <div className="h-9 px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300">Terminal Sandbox</span>
          {isRunning && (
            <span className="text-[10px] text-amber-400 font-bold animate-pulse ml-2">
              Đang chấm bài...
            </span>
          )}
          {exercisePassed && (
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-2 py-0.2 rounded-full">
              ACCEPTED (100/100)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {executionOutput && (
            <button
              onClick={onClearOutput}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer mr-1"
              title="Xóa output console"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}

          <ConsoleHeightControls
            showConsole={!isConsoleCollapsed}
            setShowConsole={(show) => setIsConsoleCollapsed(!show)}
            consoleHeight={consoleHeight}
            setConsoleHeight={setConsoleHeight}
            isConsoleMaximized={isConsoleMaximized}
            setIsConsoleMaximized={setIsConsoleMaximized}
            storagePrefix="ahtest_academy"
          />
        </div>
      </div>

      {/* Console Body */}
      {!isConsoleCollapsed && (
        <div className="flex-1 min-h-0 overflow-y-auto p-3.5 font-mono text-xs space-y-2.5">
          {/* Jump-to-line diagnostic button if compile error */}
          {executionOutput && (
            <CompilerDiagnosticJumpBar
              output={executionOutput}
              onJump={(line, col) => onJumpToLine(line, col)}
            />
          )}

          {/* AI Pedagogical Diagnosis */}
          {pedagogicalDiagnosis && (
            <PedagogicalDiagnosisCard
              diagnosis={pedagogicalDiagnosis}
              onJumpToLine={(line, col) => onJumpToLine(line, col)}
            />
          )}

          {/* Diff Inspector if output mismatch */}
          {diffState && (
            <div className="space-y-2 font-sans">
              <span className="text-[11px] font-bold text-slate-300">So sánh Output:</span>
              <DiffViewer
                actual={diffState.actual}
                expected={diffState.expected}
                isVerdictAC={!diffState.isFailed}
              />
            </div>
          )}

          {/* Raw Execution Output */}
          {executionOutput ? (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
              <pre className="text-slate-200 whitespace-pre-wrap">{executionOutput}</pre>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-600 italic">
              Bấm &quot;Chạy thử&quot; (Ctrl + Enter) để biên dịch và chạy chương trình trong Web Worker Sandbox.
            </div>
          )}

          {/* Next Lesson Pulsating Banner on Success */}
          {exercisePassed && nextLessonCandidate && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/80 flex items-center justify-between font-sans">
              <span className="text-emerald-300 font-semibold text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Chúc mừng bạn đã hoàn thành bài học!
              </span>
              <button
                onClick={onNextLesson}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <span>Sang bài tiếp theo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
