import React from 'react';
import { Search, Plus, Database, Edit3 } from 'lucide-react';
import type { Problem } from '../../types';

interface AdminProblemsSectionProps {
  problems: Problem[];
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (d: string) => void;
  isAddingProblem: boolean;
  onToggleAddProblem: () => void;
  onSelectProblemTestcases: (problemId: string) => void;
}

export const AdminProblemsSection: React.FC<AdminProblemsSectionProps> = ({
  problems,
  searchQuery,
  onSearchQueryChange,
  selectedDifficulty,
  onDifficultyChange,
  isAddingProblem,
  onToggleAddProblem,
  onSelectProblemTestcases,
}) => {
  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Tìm bài theo tên, slug..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">Tất cả độ khó</option>
            <option value="easy">Dễ (Easy)</option>
            <option value="medium">Trung bình (Medium)</option>
            <option value="hard">Khó (Hard)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onToggleAddProblem}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingProblem ? 'Đóng tạo bài' : 'Thêm bài toán mới'}</span>
          </button>
        </div>
      </div>

      {/* Problems Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Mã / Slug</th>
              <th className="py-3 px-4">Tên bài toán</th>
              <th className="py-3 px-4">Thể loại</th>
              <th className="py-3 px-4">Độ khó</th>
              <th className="py-3 px-4">Giới hạn</th>
              <th className="py-3 px-4">Lượt nộp</th>
              <th className="py-3 px-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {problems.map((prob) => (
              <tr key={prob.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-mono text-slate-400">{prob.slug}</td>
                <td className="py-3 px-4 font-bold text-white">
                  <span>{prob.title}</span>
                  <span className="block text-[10px] text-slate-500 font-normal">Tác giả: {prob.author}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                    {prob.category}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      prob.difficulty === 'Easy'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : prob.difficulty === 'Medium'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                  {prob.timeLimit}s • {prob.memoryLimit}MB
                </td>
                <td className="py-3 px-4 font-mono">
                  {prob.solvedCount} / {prob.totalSubmissions}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onSelectProblemTestcases(prob.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-white transition-colors cursor-pointer"
                      title="Xem & sửa Testcases"
                    >
                      <Database className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Chỉnh sửa đề bài"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
