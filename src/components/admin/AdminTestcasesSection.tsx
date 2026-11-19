import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import type { Problem } from '../../types';

export interface AdminTestcaseItem {
  id: number;
  name: string;
  isHidden: boolean;
  input: string;
  output: string;
  weight: number;
}

interface AdminTestcasesSectionProps {
  problems: Problem[];
  selectedProblemId: string;
  onSelectProblemId: (id: string) => void;
  testcases: AdminTestcaseItem[];
  onToggleTestcaseHidden: (id: number) => void;
}

export const AdminTestcasesSection: React.FC<AdminTestcasesSectionProps> = ({
  problems,
  selectedProblemId,
  onSelectProblemId,
  testcases,
  onToggleTestcaseHidden,
}) => {
  const publicCount = testcases.filter((t) => !t.isHidden).length;
  const hiddenCount = testcases.filter((t) => t.isHidden).length;

  return (
    <div className="space-y-4">
      {/* Problem Selector Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-400">Chọn bài toán:</span>
          <select
            value={selectedProblemId}
            onChange={(e) => onSelectProblemId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer font-bold"
          >
            {problems.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.slug}] {p.title} ({p.difficulty})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 text-emerald-400 border border-emerald-800/80 font-mono">
            {publicCount} Test Công khai
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 text-amber-400 border border-amber-800/80 font-mono flex items-center gap-1">
            <Lock className="w-3 h-3" />
            {hiddenCount} Test Ẩn RLS Guard
          </span>
        </div>
      </div>

      {/* Testcases List */}
      <div className="grid grid-cols-1 gap-3">
        {testcases.map((tc) => (
          <div key={tc.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    tc.isHidden
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {tc.isHidden ? '🔒 Testcase Ẩn (System Case)' : '🌐 Testcase Công khai'}
                </span>
                <span className="text-xs font-bold text-white">{tc.name}</span>
                <span className="text-[11px] text-slate-500 font-mono">Trọng số: {tc.weight} điểm</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleTestcaseHidden(tc.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Bật/Tắt chế độ ẩn (RLS Row Level Security)"
                >
                  {tc.isHidden ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3 text-amber-400" />}
                  <span>{tc.isHidden ? 'Chuyển thành Công khai' : 'Khóa bảo mật Ẩn'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Input Data:</span>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 whitespace-pre-wrap max-h-28 overflow-y-auto">
                  {tc.input}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-emerald-500 uppercase block mb-1">Expected Output:</span>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 whitespace-pre-wrap max-h-28 overflow-y-auto">
                  {tc.output}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
