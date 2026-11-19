import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { getColorStyles, renderCollectionIcon } from './collectionTheme.tsx';

export interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    description: string;
    category: string;
    color: 'rose' | 'amber' | 'emerald' | 'blue' | 'purple' | 'cyan';
    icon: string;
  }) => void;
}

export const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Chuyên đề Tự chọn');
  const [color, setColor] = useState<'rose' | 'amber' | 'emerald' | 'blue' | 'purple' | 'cyan'>('blue');
  const [icon, setIcon] = useState('folder');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), description: description.trim(), category, color, icon });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Tạo Thư Mục Bộ Đề Mới
              </h3>
              <p className="text-[11px] text-slate-400">
                Gom nhóm các bài tập theo chủ đề, kỳ thi hoặc tài liệu riêng
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tên bộ đề / Thư mục <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Ôn thi Lab 3 PRF192, Bộ đề ICPC 2026..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mô tả ngắn
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả mục tiêu của bộ đề này..."
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phân loại
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="Chuyên đề Tự chọn">Chuyên đề Tự chọn</option>
                <option value="Kỳ thi Thực tế">Kỳ thi Thực tế</option>
                <option value="Giáo trình Đại học">Giáo trình Đại học</option>
                <option value="Olympic & ICPC">Olympic & ICPC</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Màu sắc nhận diện
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {(['blue', 'rose', 'emerald', 'amber', 'purple'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                      getColorStyles(c).accentBg
                    } ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-800' : 'opacity-70 hover:opacity-100'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Biểu tượng đại diện
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'folder', label: 'Thư mục' },
                { id: 'shapes', label: 'Hình học' },
                { id: 'layers', label: 'Tầng lớp' },
                { id: 'calculator', label: 'Tính toán' },
                { id: 'type', label: 'Ký tự' },
              ].map((ic) => (
                <button
                  key={ic.id}
                  type="button"
                  onClick={() => setIcon(ic.id)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    icon === ic.id
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {renderCollectionIcon(ic.id, 'w-4 h-4')}
                  <span className="text-[10px]">{ic.label}</span>
                </button>
              ))}
            </div>
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
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 cursor-pointer disabled:opacity-50"
            >
              Tạo Thư Mục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
