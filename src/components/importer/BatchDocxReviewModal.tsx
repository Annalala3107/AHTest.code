import React from 'react';
import { X, FileCheck, CheckCircle2 } from 'lucide-react';
import type { SanitizedProblemResult } from '../../services/dataSanitizationPipeline.ts';

export interface BatchDocxReviewModalProps {
  isOpen: boolean;
  batchItems: SanitizedProblemResult[];
  targetCollectionTitle: string;
  onClose: () => void;
  onConfirmCommit: () => void;
}

export const BatchDocxReviewModal: React.FC<BatchDocxReviewModalProps> = ({
  isOpen,
  batchItems,
  targetCollectionTitle,
  onClose,
  onConfirmCommit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs select-none">
      <div className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Kiểm Duyệt Kết Quả Bóc Tách ({batchItems.length} Bài Tập)
              </h3>
              <p className="text-[11px] text-slate-400">
                Thư mục đích: <span className="font-bold text-slate-300">{targetCollectionTitle}</span>
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

        {/* List of Extracted Items */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {batchItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.difficulty}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded-lg line-clamp-2">
                {item.statement}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                <span>{item.testcases?.length || 0} Testcases số hóa</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đã làm sạch lệnh Windows
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 shrink-0">
          <span className="text-[11px] text-slate-400">
            Tất cả bài tập sẽ được lưu vào bộ nhớ an toàn của bạn.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onConfirmCommit}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              Lưu Toàn Bộ {batchItems.length} Bài Tập Vào Bộ Đề
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
