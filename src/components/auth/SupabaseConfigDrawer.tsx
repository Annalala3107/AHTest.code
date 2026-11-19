import React from 'react';
import { KeyRound, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface SupabaseConfigDrawerProps {
  isOpen: boolean;
  configUrl: string;
  onConfigUrlChange: (url: string) => void;
  configAnonKey: string;
  onConfigAnonKeyChange: (key: string) => void;
  showConfigKey: boolean;
  onToggleShowConfigKey: () => void;
  onResetDefault: () => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SupabaseConfigDrawer: React.FC<SupabaseConfigDrawerProps> = ({
  isOpen,
  configUrl,
  onConfigUrlChange,
  configAnonKey,
  onConfigAnonKeyChange,
  showConfigKey,
  onToggleShowConfigKey,
  onResetDefault,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <form
      onSubmit={onSubmit}
      className="mx-6 mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3 text-xs animate-slideUp"
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-rose-500" />
          <span>Cấu hình nhanh Supabase (localStorage)</span>
        </span>
        <button
          type="button"
          onClick={onResetDefault}
          className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Mặc định</span>
        </button>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
          Supabase Project URL
        </label>
        <input
          type="url"
          value={configUrl}
          onChange={(e) => onConfigUrlChange(e.target.value)}
          placeholder="https://your-project.supabase.co"
          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
          Supabase Public Anon Key
        </label>
        <div className="relative">
          <input
            type={showConfigKey ? 'text' : 'password'}
            value={configAnonKey}
            onChange={(e) => onConfigAnonKeyChange(e.target.value)}
            placeholder="sb_publishable_..."
            className="w-full pl-3 pr-9 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
          />
          <button
            type="button"
            onClick={onToggleShowConfigKey}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            {showConfigKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
        >
          Đóng
        </button>
        <button
          type="submit"
          className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
        >
          Lưu cấu hình
        </button>
      </div>
    </form>
  );
};
