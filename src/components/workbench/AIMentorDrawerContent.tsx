import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  SearchCode,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ArrowDownToLine,
  Undo2,
  Send,
  Loader2,
  Crosshair,
  Info,
} from 'lucide-react';
import type {
  AIMentorMode,
  AIMentorResponse,
  Verdict,
} from '../../types/index.ts';
import { LANGUAGE_LABELS } from '../../services/executionManager.ts';

export interface AIMentorDrawerContentProps {
  problemTitle: string;
  selectedLang: string;
  verdict: Verdict | null;
  response: AIMentorResponse | null;
  isLoading: boolean;
  hasCodeBackup: boolean;
  onRunMentor: (mode: AIMentorMode, question?: string) => void;
  onApplyCode: (code: string, approachName: string) => void;
  onUndoApplyCode: () => void;
  onJumpToLine?: (line: number, col?: number) => void;
}

export const AIMentorDrawerContent: React.FC<AIMentorDrawerContentProps> = ({
  problemTitle,
  selectedLang,
  verdict,
  response,
  isLoading,
  hasCodeBackup,
  onRunMentor,
  onApplyCode,
  onUndoApplyCode,
  onJumpToLine,
}) => {
  const [activeApproachIdx, setActiveApproachIdx] = useState<number>(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [questionInput, setQuestionInput] = useState<string>('');

  const langLabel = LANGUAGE_LABELS[selectedLang] || selectedLang.toUpperCase();
  const approaches = response?.approaches || [];
  const safeIdx = activeApproachIdx < approaches.length ? activeApproachIdx : 0;
  const activeApproach = approaches[safeIdx] || null;

  const handleCopyCode = (code: string, idx: number) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = questionInput.trim();
    if (!trimmed || isLoading) return;
    onRunMentor('ask', trimmed);
    setQuestionInput('');
  };

  return (
    <div className="space-y-4 text-slate-100 font-sans">
      {/* Context Summary Card */}
      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>AI Mentor • Gemini 4</span>
                {response?.source === 'gemini' && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    LIVE
                  </span>
                )}
              </h4>
              <p className="text-[11px] text-slate-400 truncate" title={problemTitle}>
                {problemTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-sky-300 border border-slate-700">
              {langLabel}
            </span>
            {verdict && (
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${
                  verdict === 'AC'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                {verdict}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              setActiveApproachIdx(0);
              onRunMentor('diagnose');
            }}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors cursor-pointer shadow-sm shadow-indigo-600/30"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <SearchCode className="w-3.5 h-3.5" />
            )}
            <span>Phân tích & Sửa lỗi</span>
          </button>

          <button
            onClick={() => {
              setActiveApproachIdx(0);
              onRunMentor('approaches');
            }}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Nhiều phương án code</span>
          </button>
        </div>

        {hasCodeBackup && (
          <button
            onClick={onUndoApplyCode}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Hoàn tác: Khôi phục code trước khi nạp từ AI</span>
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-6 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2.5">
          <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
          <p className="text-xs font-bold text-slate-200">
            AI Mentor đang phân tích mã nguồn {langLabel}...
          </p>
          <p className="text-[11px] text-slate-400">
            Đang đối chiếu thuật toán, độ phức tạp và sinh phương án sửa tối ưu.
          </p>
        </div>
      )}

      {/* Initial Empty Prompt */}
      {!isLoading && !response && (
        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-2.5">
          <Sparkles className="w-6 h-6 text-indigo-400 mx-auto" />
          <p className="text-xs font-bold text-slate-200">
            Sẵn sàng hỗ trợ bài "{problemTitle}"
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Bấm <strong>Phân tích & Sửa lỗi</strong> để AI soi code hiện tại của bạn, hoặc bấm{' '}
            <strong>Nhiều phương án code</strong> để xem các hướng giải tối ưu bằng đúng ngôn ngữ{' '}
            <span className="text-sky-300 font-semibold">{langLabel}</span>.
          </p>
        </div>
      )}

      {/* Results View */}
      {!isLoading && response && (
        <div className="space-y-4">
          {/* Fallback Notice Banner */}
          {response.source === 'fallback' && response.fallbackReason && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] flex items-start gap-2 leading-relaxed">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-300">
                  Chế độ Phân tích Cục bộ (Fallback)
                </span>
                <span>{response.fallbackReason}</span>
              </div>
            </div>
          )}

          {/* Diagnosis Block */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Chẩn đoán & Nguyên nhân</span>
              </span>
              {typeof response.suspectedLine === 'number' &&
                response.suspectedLine > 0 &&
                onJumpToLine && (
                  <button
                    onClick={() => onJumpToLine(response.suspectedLine!)}
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Crosshair className="w-3 h-3" />
                    <span>Nhảy tới dòng {response.suspectedLine}</span>
                  </button>
                )}
            </div>

            <p className="text-xs font-bold text-slate-100">{response.verdictSummary}</p>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {response.rootCause}
            </p>

            {response.bugFixes.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                  Checklist khắc phục nhanh:
                </span>
                <ul className="space-y-1">
                  {response.bugFixes.map((fix, idx) => (
                    <li
                      key={idx}
                      className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-relaxed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Solution Approaches Tabs */}
          {approaches.length > 0 && (
            <div className="rounded-xl bg-slate-950/90 border border-indigo-500/30 overflow-hidden">
              <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Phương án Code ({langLabel})</span>
                </span>

                <div className="flex items-center gap-1">
                  {approaches.map((app, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveApproachIdx(idx)}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                        safeIdx === idx
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Cách {idx + 1} • {app.levelTag}
                    </button>
                  ))}
                </div>
              </div>

              {activeApproach && (
                <div className="p-3.5 space-y-3">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h5 className="text-xs font-extrabold text-white">
                        {activeApproach.approachName}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          Time: {activeApproach.timeComplexity}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-sky-500/15 text-sky-300 border border-sky-500/30">
                          Space: {activeApproach.spaceComplexity}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyCode(activeApproach.code, safeIdx)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedIdx === safeIdx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedIdx === safeIdx ? 'Đã chép' : 'Sao chép'}</span>
                      </button>

                      <button
                        onClick={() =>
                          onApplyCode(activeApproach.code, activeApproach.approachName)
                        }
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 cursor-pointer transition-colors"
                        title="Nạp mã nguồn này vào khung Code Editor bên trái"
                      >
                        <ArrowDownToLine className="w-3.5 h-3.5" />
                        <span>Nạp vào Editor</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {activeApproach.explanation}
                  </p>

                  <pre className="text-[11px] font-mono text-indigo-100 bg-slate-900 p-3 rounded-lg border border-slate-800 overflow-x-auto leading-relaxed max-h-72">
                    {activeApproach.code}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Follow-up Tip */}
          {response.followUpTip && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-200 leading-relaxed">
              <strong className="text-emerald-300">💡 Mẹo rèn luyện: </strong>
              {response.followUpTip}
            </div>
          )}
        </div>
      )}

      {/* Ask Follow-Up Form */}
      <form onSubmit={handleAskSubmit} className="pt-2 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
          placeholder={`Hỏi thêm AI Mentor về ${langLabel}...`}
          disabled={isLoading}
          className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !questionInput.trim()}
          className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center gap-1 text-xs font-bold cursor-pointer transition-colors shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Hỏi</span>
        </button>
      </form>
    </div>
  );
};
