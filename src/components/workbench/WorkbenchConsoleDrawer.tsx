import React from 'react';
import {
  FileCode,
  Terminal,
  Activity,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Play,
  Bot
} from 'lucide-react';
import type { SampleCase, TestResult, Verdict } from '../../types/index.ts';
import type { PedagogicalDiagnosis } from '../../services/executionManager.ts';
import { DiffViewer } from '../DiffViewer.tsx';
import { ConsoleHeightControls, CompilerDiagnosticJumpBar } from '../shared/IDEPrimitives.tsx';
import { PedagogicalDiagnosisCard } from './PedagogicalDiagnosisCard.tsx';
import { getVerdictMeta } from '../../services/workbenchStorage.ts';

export interface WorkbenchConsoleDrawerProps {
  showConsole: boolean;
  setShowConsole: (show: boolean) => void;
  consoleHeight: number;
  setConsoleHeight: (h: number) => void;
  isConsoleMaximized: boolean;
  setIsConsoleMaximized: (max: boolean) => void;
  consoleTab: 'samples' | 'custom' | 'results';
  setConsoleTab: (tab: 'samples' | 'custom' | 'results') => void;
  isGrading: boolean;
  finalVerdict: Verdict | null;
  testResults: TestResult[];
  samples: SampleCase[];
  customInput: string;
  setCustomInput: (val: string) => void;
  customOutput: string;
  customExpected: string;
  setCustomExpected: (val: string) => void;
  onRunCustomTest: () => void;
  onJumpToLine: (line: number, col?: number) => void;
  pedagogicalDiagnosis: PedagogicalDiagnosis | null;
  onOpenAIMentor?: () => void;
  storagePrefix?: string;
}

export const WorkbenchConsoleDrawer: React.FC<WorkbenchConsoleDrawerProps> = ({
  showConsole,
  setShowConsole,
  consoleHeight,
  setConsoleHeight,
  isConsoleMaximized,
  setIsConsoleMaximized,
  consoleTab,
  setConsoleTab,
  isGrading,
  finalVerdict,
  testResults,
  samples,
  customInput,
  setCustomInput,
  customOutput,
  customExpected,
  setCustomExpected,
  onRunCustomTest,
  onJumpToLine,
  pedagogicalDiagnosis,
  onOpenAIMentor,
  storagePrefix = 'ahtest_workbench',
}) => {
  return (
    <div
      style={{
        height: isConsoleMaximized ? '100%' : showConsole ? `${consoleHeight}px` : '36px',
      }}
      className={`border-t border-slate-800 bg-slate-950 flex flex-col shrink-0 transition-all ${
        isConsoleMaximized ? 'absolute inset-0 z-40' : ''
      }`}
    >
      {/* Console Top Header Bar */}
      <div className="h-9 px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setConsoleTab('samples');
              if (!showConsole) setShowConsole(true);
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              consoleTab === 'samples' && showConsole
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>Mẫu có sẵn</span>
          </button>

          <button
            onClick={() => {
              setConsoleTab('custom');
              if (!showConsole) setShowConsole(true);
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              consoleTab === 'custom' && showConsole
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Tự nhập Test</span>
          </button>

          <button
            onClick={() => {
              setConsoleTab('results');
              if (!showConsole) setShowConsole(true);
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              consoleTab === 'results' && showConsole
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kết quả Chấm</span>
            {testResults.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          {isGrading && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold ml-2 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Đang chấm bài...</span>
            </div>
          )}

          {!isGrading && finalVerdict && (
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${getVerdictMeta(finalVerdict).shortClass}`}>
                {finalVerdict}
              </span>
            </div>
          )}
        </div>

        <ConsoleHeightControls
          showConsole={showConsole}
          setShowConsole={setShowConsole}
          consoleHeight={consoleHeight}
          setConsoleHeight={setConsoleHeight}
          isConsoleMaximized={isConsoleMaximized}
          setIsConsoleMaximized={setIsConsoleMaximized}
          storagePrefix={storagePrefix}
        />
      </div>

      {/* Console Content */}
      {showConsole && (
        <div className="flex-1 p-3 overflow-y-auto text-xs font-mono text-slate-300 space-y-3">
          {/* SAMPLES TAB */}
          {consoleTab === 'samples' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {samples.map((sample, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-400">Sample #{idx + 1}</span>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Input (Đầu vào):</span>
                      <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 max-h-32 overflow-y-auto">
                        <pre className="text-slate-200 whitespace-pre-wrap select-all font-mono leading-relaxed">{sample.input}</pre>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Expected Output (Đầu ra chuẩn):</span>
                      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40 max-h-32 overflow-y-auto">
                        <pre className="text-emerald-300 whitespace-pre-wrap select-all font-mono leading-relaxed">{sample.output}</pre>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 border-dashed space-y-2 flex flex-col justify-center text-center">
                  <Lock className="w-6 h-6 text-amber-500/70 mx-auto" />
                  <span className="font-bold text-slate-300 text-xs">Testcases Ẩn (Hidden System Cases)</span>
                  <p className="text-[11px] text-slate-500">
                    Bao gồm các ca kiểm tra biên ranh giới, số âm và Stress Test. Chỉ được chấm khi bạn bấm &quot;Nộp bài&quot;.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOM TEST TAB */}
          {consoleTab === 'custom' && (
            <div className="space-y-3 font-sans">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-slate-400 font-semibold mr-1">Mẫu nhanh:</span>
                  <button
                    onClick={() => {
                      setCustomInput(samples[0]?.input || '');
                      setCustomExpected(samples[0]?.output || '');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>📥 Nạp Test #1</span>
                  </button>
                  {samples.length > 1 && (
                    <button
                      onClick={() => {
                        setCustomInput(samples[1]?.input || '');
                        setCustomExpected(samples[1]?.output || '');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>📥 Nạp Test #2</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={onRunCustomTest}
                  disabled={isGrading}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Chạy Custom Test</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-300">Custom Input (Đầu vào stdin tùy ý):</span>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Nhập input thử nghiệm tại đây..."
                    className="w-full h-24 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:ring-1 focus:ring-rose-500 outline-hidden resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-300">Expected Output (Đầu ra mong đợi - Tùy chọn):</span>
                  <textarea
                    value={customExpected}
                    onChange={(e) => setCustomExpected(e.target.value)}
                    placeholder="Nhập output mong đợi để bật Diff Inspector so sánh từng ký tự..."
                    className="w-full h-24 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:ring-1 focus:ring-rose-500 outline-hidden resize-none"
                  />
                </div>
              </div>

              {/* Custom Output & Diagnostics */}
              {customOutput && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-300">Kết quả thực thi (Execution Output):</span>
                  <CompilerDiagnosticJumpBar output={customOutput} onJump={onJumpToLine} />
                  {customExpected.trim() ? (
                    <DiffViewer actual={customOutput} expected={customExpected} isVerdictAC={false} />
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs overflow-x-auto">
                      <pre className="text-slate-200 whitespace-pre-wrap">{customOutput}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* RESULTS TAB */}
          {consoleTab === 'results' && (
            <div className="space-y-4">
              {finalVerdict && finalVerdict !== 'AC' && onOpenAIMentor && (
                <div className="p-3 rounded-xl bg-indigo-950/50 border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 text-xs text-indigo-200">
                    <Bot className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>
                      Bài làm đang gặp lỗi <strong>{finalVerdict}</strong>. Bạn muốn AI Mentor soi dòng lỗi và đề xuất nhiều phương án sửa theo đúng ngôn ngữ?
                    </span>
                  </div>
                  <button
                    onClick={onOpenAIMentor}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 shadow-sm shadow-indigo-600/30"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Nhờ AI Mentor sửa lỗi</span>
                  </button>
                </div>
              )}

              {pedagogicalDiagnosis && (
                <PedagogicalDiagnosisCard
                  diagnosis={pedagogicalDiagnosis}
                  onJumpToLine={onJumpToLine}
                />
              )}

              {testResults.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <Activity className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="font-semibold text-slate-400">Chưa có kết quả chấm</p>
                  <p className="text-[11px]">Bấm &quot;Chạy thử&quot; (F9) hoặc &quot;Nộp bài&quot; (Ctrl + Enter) để xem chi tiết từng testcase.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {testResults.map((t, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex flex-col gap-2 ${
                        t.passed
                          ? 'bg-emerald-950/20 border-emerald-900/40'
                          : 'bg-rose-950/20 border-rose-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {t.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                          <span className="font-bold text-xs text-slate-200">{t.name}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                              t.passed
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {t.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {t.timeMs}ms
                          </span>
                        </div>
                      </div>

                      {!t.passed && (
                        <div className="pt-2 border-t border-slate-800">
                          <DiffViewer
                            actual={t.actualOutput || ''}
                            expected={t.expectedOutput || ''}
                            isVerdictAC={false}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
