import React, { useState } from 'react';
import { X, Timer, Flame } from 'lucide-react';
import type { ProblemCollection, ExamSessionConfig } from '../../types/index.ts';
import { createExamSession } from '../../services/collectionStorage.ts';

export interface ExamSetupModalProps {
  isOpen: boolean;
  collection: ProblemCollection | null;
  onClose: () => void;
  onConfirmStartExam: (config: ExamSessionConfig) => void;
}

export const ExamSetupModal: React.FC<ExamSetupModalProps> = ({
  isOpen,
  collection,
  onClose,
  onConfirmStartExam,
}) => {
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [durationMinutes, setDurationMinutes] = useState<number>(90);

  if (!isOpen || !collection) return null;

  const maxAvailable = collection.problems.length;
  const safeCount = Math.min(questionCount, Math.max(1, maxAvailable));

  const handleStart = () => {
    const session = createExamSession(collection, safeCount, durationMinutes);
    onConfirmStartExam(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Cấu Hình Phòng Thi Thử
              </h3>
              <p className="text-[11px] text-slate-400">
                Bộ đề: {collection.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Số lượng câu hỏi thi (Tối đa {maxAvailable} câu có sẵn)
            </label>
            <div className="flex items-center gap-1.5">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  disabled={num > maxAvailable}
                  onClick={() => setQuestionCount(num)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    questionCount === num
                      ? 'bg-rose-600 text-white shadow-xs'
                      : num > maxAvailable
                      ? 'opacity-30 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {num} câu
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Thời gian làm bài thi
            </label>
            <div className="flex items-center gap-2">
              {[
                { mins: 45, label: '45 phút (Test nhanh)' },
                { mins: 90, label: '⭐ 90 phút (Chuẩn PE)' },
                { mins: 120, label: '120 phút (Chuyên sâu)' },
              ].map(({ mins, label }) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`flex-1 py-2 px-2 rounded-xl text-center font-bold text-[11px] transition-colors cursor-pointer ${
                    durationMinutes === mins
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 space-y-1">
            <span className="font-bold flex items-center gap-1">
              ⚠️ Quy chế phòng thi:
            </span>
            <p className="text-slate-300 leading-relaxed">
              Hệ thống sẽ trộn ngẫu nhiên câu hỏi từ bộ đề và kích hoạt đồng hồ đếm ngược. Mọi gợi ý giải bài sẽ bị khóa trong suốt thời gian làm bài.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleStart}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Bắt Đầu Làm Bài ({safeCount} câu • {durationMinutes}p)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
