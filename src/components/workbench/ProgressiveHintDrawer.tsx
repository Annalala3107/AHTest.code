import React, { useState } from 'react';
import { Lightbulb, ChevronUp, Sparkles, ShieldAlert, Lock, BookOpen, Copy, Check } from 'lucide-react';
import { KaTeXRenderer } from '../KaTeXRenderer.tsx';
import type { ProgressiveHint } from '../../types/index.ts';

export interface ProgressiveHintDrawerProps {
  hints: ProgressiveHint[];
  unlockedTier: number;
  onUnlockTier: (tier: 1 | 2 | 3) => void;
  onClose: () => void;
}

export const ProgressiveHintDrawer: React.FC<ProgressiveHintDrawerProps> = ({
  hints,
  unlockedTier,
  onUnlockTier,
  onClose,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopy = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 text-white space-y-4 shadow-xl animate-fadeIn relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Trợ Lý Gợi Ý 3 Tầng</span>
              <span className="text-[10px] text-slate-400 font-normal">| Học sâu • Tránh mất gốc</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {unlockedTier === 0
                ? 'Đang giữ: ⭐⭐⭐ Tự Lực (100% sao)'
                : unlockedTier <= 2
                ? 'Đang nhận: ⭐⭐ Khá Giỏi (Gợi ý tư duy)'
                : 'Đang nhận: ⭐ Đã Thông Suốt (Dùng mã giả)'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
        >
          <span>Thu gọn</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Tiers Stack */}
      <div className="space-y-3">
        {/* TIER 1: CONCEPTUAL */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Tầng 1: Tư Duy Thuật Toán Cốt Lõi
            </span>
            <span className="text-[10px] font-bold text-emerald-400">Đã mở khóa</span>
          </div>
          <h5 className="text-xs font-bold text-slate-200">{hints[0]?.title}</h5>
          <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 font-sans">
            <KaTeXRenderer content={hints[0]?.content || ''} />
          </div>
        </div>

        {/* TIER 2: TRAP & PITFALL */}
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            unlockedTier >= 2
              ? 'bg-slate-800/80 border-amber-500/40'
              : 'bg-slate-950/60 border-slate-800'
          } space-y-2`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Tầng 2: Cảnh Báo Bẫy Ngầm & Bộ Nhớ C
            </span>
            {unlockedTier >= 2 ? (
              <span className="text-[10px] font-bold text-amber-400">Đã mở khóa</span>
            ) : (
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Đang khóa (⭐ Giữ 3 Sao)
              </span>
            )}
          </div>

          {unlockedTier >= 2 ? (
            <>
              <h5 className="text-xs font-bold text-slate-200">{hints[1]?.title}</h5>
              <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 font-sans">
                <KaTeXRenderer content={(hints[1]?.content || '').replace(/\\`/g, '`')} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                Cảnh báo bẫy khoảng trắng scanf, null-terminator '\0', tràn mảng char, và lỗi rác bộ nhớ...
              </p>
              <button
                onClick={() => onUnlockTier(2)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shrink-0 shadow-xs cursor-pointer transition-colors"
              >
                Mở Khóa Tầng 2
              </button>
            </div>
          )}
        </div>

        {/* TIER 3: PSEUDOCODE SCAFFOLD */}
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            unlockedTier >= 3
              ? 'bg-slate-800/80 border-blue-500/40'
              : 'bg-slate-950/60 border-slate-800'
          } space-y-2`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Tầng 3: Khung Mã Giả Định Hướng (Pseudocode)
            </span>
            {unlockedTier >= 3 ? (
              <span className="text-[10px] font-bold text-blue-400">Đã mở khóa</span>
            ) : (
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Đang khóa (⭐ Giữ 2 Sao)
              </span>
            )}
          </div>

          {unlockedTier >= 3 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-slate-200">{hints[2]?.title}</h5>
                <button
                  onClick={() => handleCopy((hints[2]?.content || '').replace(/\\`/g, '`'))}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Đã chép khung' : 'Sao chép khung code'}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono text-blue-100 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto leading-relaxed">
                {(hints[2]?.content || '').replace(/\\`/g, '`')}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                Cung cấp sườn code chuẩn C từ khai báo, xử lý chuỗi đến in kết quả để người học điền vào...
              </p>
              <button
                onClick={() => onUnlockTier(3)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shrink-0 shadow-xs cursor-pointer transition-colors"
              >
                Mở Khóa Mã Giả
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
