import React, { useState } from 'react';
import {
  ArrowLeft,
  Timer,
  Play,
  Eye,
  Trash2,
  Search,
  UploadCloud,
  Flame,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import type { ProblemCollection, Problem } from '../../types/index.ts';
import { getColorStyles, renderCollectionIcon } from './collectionTheme.tsx';

export interface CollectionDetailViewProps {
  collection: ProblemCollection;
  onBackToHub: () => void;
  onStartExamSetup: (collection: ProblemCollection) => void;
  onSelectProblem: (problem: Problem) => void;
  onPreviewProblem: (problem: Problem) => void;
  onDeleteProblem: (problemId: string) => void;
  onOpenImportModal: () => void;
}

export const CollectionDetailView: React.FC<CollectionDetailViewProps> = ({
  collection,
  onBackToHub,
  onStartExamSetup,
  onSelectProblem,
  onPreviewProblem,
  onDeleteProblem,
  onOpenImportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const styles = getColorStyles(collection.color || 'blue');

  const filteredProblems = collection.problems.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return matchSearch && matchDiff;
  });

  return (
    <div className="space-y-6">
      {/* Top Back Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHub}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Thư viện Bộ đề</span>
        </button>

        <button
          onClick={onOpenImportModal}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>+ Thêm Bài Tập Vào Bộ Đề Này</span>
        </button>
      </div>

      {/* Collection Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles.badge}`}>
                {collection.category}
              </span>
              <span className="text-xs text-slate-400">
                {collection.problems.length} bài tập sẵn sàng
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
              <span className={styles.text}>{renderCollectionIcon(collection.icon, 'w-7 h-7')}</span>
              <span>{collection.title}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {collection.description}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onStartExamSetup(collection)}
              className="px-5 py-3 rounded-2xl text-xs font-black bg-linear-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <Timer className="w-4 h-4" />
              <span>THI THỬ PHÒNG THI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dual Mode Arena Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Exam Simulation Card */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-950 via-slate-900 to-rose-950/30 border border-rose-500/40 p-6 text-white shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <Timer className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Áp Lực Phòng Thi
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-rose-300">
                🎯 Chế Độ Ôn Thi (Exam Simulation)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                Mô phỏng 100% không khí thi PE: Hệ thống tự động <strong>trộn ngẫu nhiên câu hỏi</strong>, kích hoạt <strong>đồng hồ đếm ngược</strong>, và <strong>khóa toàn bộ gợi ý</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={() => onStartExamSetup(collection)}
            className="w-full py-2.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Flame className="w-4 h-4" />
            <span>Thiết Lập Phòng Thi Thử</span>
          </button>
        </div>

        {/* Deep Practice Card */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950/30 border border-emerald-500/40 p-6 text-white shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Lightbulb className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Học Sâu • Nhớ Lâu
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-emerald-300">
                💡 Chế Độ Luyện Tập (Deep Practice)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                <strong>Không giới hạn thời gian</strong>, tự do giải từng bài toán. Trang bị hệ thống <strong>3 Tầng Gợi Ý Tiến Trình (Progressive Hints)</strong> giúp ghi nhớ bản chất và chống mất gốc ngầm.
              </p>
            </div>
          </div>

          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 py-2">
            <Sparkles className="w-4 h-4" />
            <span>Chọn bất kỳ bài tập nào bên dưới để bắt đầu giải!</span>
          </div>
        </div>
      </div>

      {/* Problems List Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài tập trong bộ đề này..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-rose-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer shrink-0"
          >
            <option value="All">Tất cả độ khó</option>
            <option value="Easy">Dễ (Easy)</option>
            <option value="Medium">Vừa (Medium)</option>
            <option value="Hard">Khó (Hard)</option>
          </select>
        </div>

        <span className="text-xs text-slate-400">
          Hiển thị <strong>{filteredProblems.length}</strong> bài tập
        </span>
      </div>

      {/* Problems Cards Table */}
      <div className="space-y-3">
        {filteredProblems.map((prob) => (
          <div
            key={prob.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    prob.difficulty === 'Easy'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : prob.difficulty === 'Medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {prob.difficulty}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {prob.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {prob.points} điểm • {prob.timeLimit}s • {prob.memoryLimit}MB
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {prob.title}
              </h4>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {prob.statement}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onPreviewProblem(prob)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                title="Xem trước đề bài & test cases"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xem trước</span>
              </button>

              <button
                onClick={() => onSelectProblem(prob)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Giải Bài Này</span>
              </button>

              {collection.isCustom && (
                <button
                  onClick={() => onDeleteProblem(prob.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Xóa bài tập khỏi bộ đề này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
