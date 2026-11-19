import React, { useState } from 'react';
import {
  FileText,
  Lightbulb,
  Clock,
  MessageSquare,
  Star,
  Send
} from 'lucide-react';
import type { Problem, Verdict, LocalSubmissionRecord } from '../../types/index.ts';
import { KaTeXRenderer } from '../KaTeXRenderer.tsx';
import { ProblemSpecificationView } from '../ProblemSpecificationView.tsx';
import { getVerdictMeta, type LocalProblemNote } from '../../services/workbenchStorage.ts';

export interface WorkbenchLeftPaneProps {
  problem: Problem;
  docLang: 'vi' | 'en';
  onToggleDocLang: (lang: 'vi' | 'en') => void;
  activeTab: 'statement' | 'editorial' | 'submissions' | 'comments';
  onSetActiveTab: (tab: 'statement' | 'editorial' | 'submissions' | 'comments') => void;
  finalVerdict: Verdict | null;
  unlockedHintTier: number;
  submissions: LocalSubmissionRecord[];
  onRestoreSubmissionCode: (code: string, submittedAt: string) => void;
  notes: LocalProblemNote[];
  onAddNote: (text: string) => void;
  hasNextProblem?: boolean;
  onNextProblem?: () => void;
}

function getMasteryRating(tier: number) {
  if (tier === 0) {
    return {
      stars: 3,
      badge: 'THUẦN THỤC CAO CẤP',
      title: 'Tự lực 100% không cần gợi ý',
      description: 'Bạn đã độc lập phân tích bài toán và tìm ra thuật toán tối ưu. Xuất sắc!',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-400'
    };
  }
  if (tier <= 2) {
    return {
      stars: 2,
      badge: 'KHÁ GIỎI',
      title: 'Cần một chút gợi ý định hướng',
      description: 'Bạn đã tận dụng tốt gợi ý tư duy để vượt qua bẫy thuật toán. Hãy luyện thêm để đạt 3 sao!',
      borderColor: 'border-blue-500/40',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400'
    };
  }
  return {
    stars: 1,
    badge: 'ĐÃ THÔNG SUỐT',
    title: 'Học hỏi từ mã giả định hướng',
    description: 'Bạn đã hiểu cấu trúc và hoàn thiện bài toán. Hãy tự code lại lần nữa để nhớ sâu hơn!',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400'
  };
}

export const WorkbenchLeftPane: React.FC<WorkbenchLeftPaneProps> = ({
  problem,
  docLang,
  onToggleDocLang,
  activeTab,
  onSetActiveTab,
  finalVerdict,
  unlockedHintTier,
  submissions,
  onRestoreSubmissionCode,
  notes,
  onAddNote,
  hasNextProblem,
  onNextProblem,
}) => {
  const [noteInput, setNoteInput] = useState('');

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddNote(noteInput.trim());
    setNoteInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
        <button
          onClick={() => onSetActiveTab('statement')}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'statement'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Đề bài
        </button>
        <button
          onClick={() => onSetActiveTab('editorial')}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'editorial'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" /> Lời giải (Editorial)
        </button>
        <button
          onClick={() => onSetActiveTab('submissions')}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'submissions'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Lịch sử nộp
        </button>
        <button
          onClick={() => onSetActiveTab('comments')}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'comments'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> Thảo luận
        </button>
      </div>

      {/* Content Area with smooth scrolling */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Solved Banner */}
        {finalVerdict === 'AC' && (() => {
          const rating = getMasteryRating(unlockedHintTier);
          return (
            <div className={`p-5 rounded-2xl border ${rating.borderColor} ${rating.bgColor} space-y-3 shadow-lg animate-fadeIn relative overflow-hidden`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xl">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < rating.stars
                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-600 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${rating.borderColor} ${rating.textColor}`}>
                        {rating.badge}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                        {rating.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {rating.description}
                    </p>
                  </div>
                </div>

                {hasNextProblem && onNextProblem && (
                  <button
                    onClick={onNextProblem}
                    className="px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 shrink-0"
                  >
                    <span>Luyện Tập Bài Tiếp Theo →</span>
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        {/* Tab 1: Statement */}
        {activeTab === 'statement' && (
          <div className="space-y-4">
            <ProblemSpecificationView
              problem={problem}
              lang={docLang}
              onToggleLang={onToggleDocLang}
              showLangToggle={false}
              scoreWeight={`${problem.points}đ`}
              isExamMode={false}
            />
          </div>
        )}

        {/* Tab 2: Editorial */}
        {activeTab === 'editorial' && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs">
              💡 Hướng dẫn giải chi tiết được kiểm duyệt bởi ban chuyên môn AHtest.code.
            </div>
            <KaTeXRenderer content={problem.editorial || 'Lời giải chi tiết đang được cập nhật.'} />
          </div>
        )}

        {/* Tab 3: Submissions */}
        {activeTab === 'submissions' && (
          <div className="space-y-3 text-xs">
            {submissions.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-1.5">
                <p className="font-bold text-slate-600 dark:text-slate-300">Chưa có bài nộp nào cho bài toán này</p>
                <p className="text-[11px] text-slate-400">
                  Hãy bấm &quot;Nộp bài&quot; (Ctrl + Enter) để lưu lịch sử nộp và so sánh các phiên bản mã nguồn của bạn.
                </p>
              </div>
            ) : (
              submissions.map((sub) => {
                const meta = getVerdictMeta(sub.verdict);
                return (
                  <div
                    key={sub.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${meta.shortClass}`}>
                          {sub.verdict}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {sub.score}/{sub.maxScore} điểm
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {sub.language} • {sub.timeMs}ms • {sub.memoryKb}KB • {sub.submittedAt}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRestoreSubmissionCode(sub.code, sub.submittedAt)}
                      className="px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer shrink-0"
                    >
                      Nạp lại code
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 4: Comments & Notes */}
        {activeTab === 'comments' && (
          <div className="space-y-4 text-xs">
            <form onSubmit={handleSubmitNote} className="space-y-2">
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Ghi chú cá nhân hoặc phương pháp tiếp cận của bạn về bài tập này..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-hidden min-h-[80px]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!noteInput.trim()}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Lưu ghi chú</span>
                </button>
              </div>
            </form>

            <div className="space-y-2.5">
              {notes.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic text-center py-4">
                  Chưa có ghi chú nào. Ghi chú của bạn được lưu an toàn tại máy của bạn.
                </p>
              ) : (
                notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{n.author}</span>
                      <span>{n.createdAt}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{n.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
