import React from 'react';
import {
  FolderGit2,
  Search,
  RefreshCw,
  Trash2,
  ChevronRight,
  FolderPlus,
  UploadCloud
} from 'lucide-react';
import type { ProblemCollection } from '../../types/index.ts';
import { getColorStyles, renderCollectionIcon } from './collectionTheme.tsx';

export interface CollectionHubViewProps {
  collections: ProblemCollection[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectCollection: (colId: string) => void;
  onOpenCreateCollectionModal: () => void;
  onOpenImportProblemModal: () => void;
  onRestoreMasterBank: () => void;
  onDeleteCollection: (colId: string, e: React.MouseEvent) => void;
}

export const CollectionHubView: React.FC<CollectionHubViewProps> = ({
  collections,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSelectCollection,
  onOpenCreateCollectionModal,
  onOpenImportProblemModal,
  onRestoreMasterBank,
  onDeleteCollection,
}) => {
  const totalProblems = collections.reduce((acc, c) => acc + c.problems.length, 0);

  const categories = ['All', ...Array.from(new Set(collections.map((c) => c.category)))];

  const filteredCollections = collections.filter((col) => {
    const matchSearch =
      col.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'All' || col.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-950 via-rose-950/40 to-slate-950 border border-rose-900/40 p-6 sm:p-8 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-300">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>HỆ THỐNG QUẢN LÝ BỘ ĐỀ & KHẢO THÍ CHUẨN QUỐC TẾ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Thư Viện Bộ Đề & Đề Thi Phân Loại
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tổ chức kho đề theo từng học phần, giáo trình và kỳ thi. Hỗ trợ import tự động từ tệp .docx tổng hợp, kiểm tra chuẩn hóa và tổ chức thi thử bấm giờ.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[95px] shadow-xs">
              <div className="text-xl font-extrabold text-rose-400">{collections.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Thư mục</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[95px] shadow-xs">
              <div className="text-xl font-extrabold text-emerald-400">{totalProblems}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Bài tập</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm thư mục, bộ đề..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-rose-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer shrink-0"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'Tất cả phân loại' : c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRestoreMasterBank}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Đồng bộ lại trọn vẹn 115 bài tập gốc PRF192"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Khôi phục 115 Bài</span>
          </button>

          <button
            onClick={onOpenCreateCollectionModal}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-blue-500" />
            <span>+ Thư Mục Mới</span>
          </button>

          <button
            onClick={onOpenImportProblemModal}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>+ Nhập Đề Bài</span>
          </button>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCollections.map((col) => {
          const styles = getColorStyles(col.color || 'blue');
          return (
            <div
              key={col.id}
              onClick={() => onSelectCollection(col.id)}
              className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border ${styles.border} p-5 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-2xl ${styles.bgLight} ${styles.text} flex items-center justify-center border border-current/20 shadow-xs`}>
                    {renderCollectionIcon(col.icon, 'w-5 h-5')}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${styles.badge}`}>
                      {col.category}
                    </span>
                    {col.isCustom && (
                      <button
                        onClick={(e) => onDeleteCollection(col.id, e)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Xóa thư mục tùy chỉnh"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors flex items-center gap-2">
                    <span>{col.title}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {col.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {col.problems.length} bài tập
                </span>
                <span className="text-rose-500 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Khám phá</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
