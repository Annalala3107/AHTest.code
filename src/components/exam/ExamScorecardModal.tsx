import React from 'react';
import { Trophy, Award, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import type { ExamScorecard } from '../../types/index.ts';

export interface ExamScorecardModalProps {
  isOpen: boolean;
  scorecard: ExamScorecard | null;
  onClose: () => void;
  onExitToDashboard: () => void;
}

export const ExamScorecardModal: React.FC<ExamScorecardModalProps> = ({
  isOpen,
  scorecard,
  onClose,
  onExitToDashboard,
}) => {
  if (!isOpen || !scorecard) return null;

  const score10 = Number(scorecard.totalScore.toFixed(1));
  const isPassed = score10 >= 5.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs select-none">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col overflow-hidden space-y-5 animate-fadeIn">
        {/* Top Trophy & Final Score */}
        <div className="text-center space-y-2 shrink-0">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg ${
              isPassed
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
            }`}
          >
            {isPassed ? <Trophy className="w-8 h-8" /> : <Award className="w-8 h-8" />}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isPassed ? 'KẾT QUẢ THI: ĐẠT (PASSED)' : 'KẾT QUẢ THI: CHƯA ĐẠT'}
          </h2>

          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-rose-500 font-mono">
              {score10}
            </span>
            <span className="text-slate-400 text-sm font-bold">/ 10.0 Điểm</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Bạn đã giải chính xác <strong>{scorecard.passedQuestions}</strong> trên tổng số{' '}
            <strong>{scorecard.totalQuestions}</strong> câu hỏi trong thời gian{' '}
            <strong>{Math.floor(scorecard.timeSpentSeconds / 60)} phút</strong>.
          </p>
        </div>

        {/* Detailed Questions Table */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Bảng Điểm Từng Câu Hỏi:
          </span>
          {scorecard.questionDetails.map((q, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                q.verdict === 'AC'
                  ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {q.verdict === 'AC' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-200">
                    Câu {idx + 1}: {q.title}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {q.earnedScore}/{q.maxScore} điểm • {q.timeMs}ms
                  </div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded font-black text-[10px] ${
                  q.verdict === 'AC'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {q.verdict}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            Xem lại bài làm
          </button>

          <button
            onClick={onExitToDashboard}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Hoàn tất & Rời phòng thi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
