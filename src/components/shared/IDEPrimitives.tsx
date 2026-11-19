import React from 'react';
import { Save, RotateCcw, Maximize2, Minimize2, ChevronDown, ChevronUp } from 'lucide-react';

export interface CompilerDiagnosticJumpBarProps {
  output: string;
  onJump: (line: number, col: number) => void;
}

function parseDiagnosticError(output: string): { line: number; col: number; raw: string } | null {
  if (!output) return null;
  const lineMatch =
    output.match(/dòng\s*(\d+)/i) ||
    output.match(/line\s*(\d+)/i) ||
    output.match(/:(\d+):(\d+):/);
  if (!lineMatch) return null;

  const line = parseInt(lineMatch[1], 10);
  const colMatch =
    output.match(/cột\s*(\d+)/i) ||
    output.match(/col\s*(\d+)/i) ||
    (lineMatch[2] ? [null, lineMatch[2]] : null);
  const col = colMatch && colMatch[1] ? parseInt(colMatch[1], 10) : 1;

  return { line, col, raw: output };
}

export const CompilerDiagnosticJumpBar: React.FC<CompilerDiagnosticJumpBarProps> = ({
  output,
  onJump
}) => {
  const err = parseDiagnosticError(output);
  if (!err) return null;

  return (
    <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-800/80 flex items-center justify-between shadow-xs">
      <span className="text-rose-200 text-xs font-mono">
        Lỗi cú pháp tại <strong className="text-rose-400 font-bold">Dòng {err.line}</strong>, Cột{' '}
        <strong className="text-rose-400 font-bold">{err.col}</strong>
      </span>
      <button
        onClick={() => onJump(err.line, err.col)}
        className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
      >
        <span>👉 Nhảy đến dòng lỗi</span>
      </button>
    </div>
  );
};

export interface EditorCharGaugeProps {
  charCount: number;
  maxChars?: number;
  draftSaved?: boolean;
  onResetCode?: () => void;
}

export const EditorCharGauge: React.FC<EditorCharGaugeProps> = ({
  charCount,
  maxChars = 65536,
  draftSaved,
  onResetCode
}) => {
  const isOver = charCount > maxChars;
  const isWarning = charCount > maxChars * 0.88;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`text-[11px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1.5 transition-colors ${
          isOver
            ? 'text-rose-400 bg-rose-950/80 border-rose-600 font-bold animate-pulse'
            : isWarning
            ? 'text-amber-300 bg-amber-950/60 border-amber-600 font-semibold'
            : 'text-slate-400 bg-slate-900 border-slate-800'
        }`}
        title={`Dung lượng code: ${charCount.toLocaleString('vi-VN')} / ${maxChars.toLocaleString('vi-VN')} ký tự tối đa`}
      >
        <span>
          {charCount.toLocaleString('vi-VN')}/{maxChars.toLocaleString('vi-VN')}
        </span>
        <span className="hidden md:inline text-[10px] text-slate-500">ký tự</span>
      </div>

      {draftSaved && (
        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
          <Save className="w-3 h-3 text-emerald-400" />
          <span>Đã lưu nháp</span>
        </span>
      )}

      {onResetCode && (
        <button
          onClick={onResetCode}
          title="Khôi phục code mẫu ban đầu (Xóa bản nháp đã lưu)"
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export interface ConsoleHeightControlsProps {
  showConsole: boolean;
  setShowConsole: (show: boolean) => void;
  consoleHeight: number;
  setConsoleHeight: (h: number) => void;
  isConsoleMaximized: boolean;
  setIsConsoleMaximized: (max: boolean) => void;
  storagePrefix: string;
}

export const ConsoleHeightControls: React.FC<ConsoleHeightControlsProps> = ({
  showConsole,
  setShowConsole,
  consoleHeight,
  setConsoleHeight,
  isConsoleMaximized,
  setIsConsoleMaximized,
  storagePrefix
}) => {
  const setPreset = (height: number) => {
    setShowConsole(true);
    setIsConsoleMaximized(false);
    setConsoleHeight(height);
    try {
      localStorage.setItem(`${storagePrefix}_console_height`, height.toString());
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Presets */}
      <div className="hidden sm:flex items-center bg-slate-800 rounded-md p-0.5 text-[10px] font-mono text-slate-400">
        <button
          onClick={() => setPreset(160)}
          className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
            showConsole && !isConsoleMaximized && consoleHeight === 160
              ? 'bg-slate-700 text-white font-bold'
              : 'hover:text-slate-200'
          }`}
          title="Thu gọn vừa phải (160px)"
        >
          Nhỏ
        </button>
        <button
          onClick={() => setPreset(260)}
          className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
            showConsole && !isConsoleMaximized && consoleHeight === 260
              ? 'bg-slate-700 text-white font-bold'
              : 'hover:text-slate-200'
          }`}
          title="Chiều cao chuẩn (260px)"
        >
          Vừa
        </button>
        <button
          onClick={() => setPreset(380)}
          className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
            showConsole && !isConsoleMaximized && consoleHeight === 380
              ? 'bg-slate-700 text-white font-bold'
              : 'hover:text-slate-200'
          }`}
          title="Mở rộng lớn (380px)"
        >
          Lớn
        </button>
      </div>

      {/* Maximize / Restore */}
      <button
        onClick={() => {
          setShowConsole(true);
          setIsConsoleMaximized(!isConsoleMaximized);
        }}
        className={`p-1 rounded transition-colors cursor-pointer ${
          isConsoleMaximized
            ? 'bg-rose-600 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
        title={isConsoleMaximized ? 'Thu nhỏ về kích thước cũ' : 'Phóng to Console'}
      >
        {isConsoleMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
      </button>

      {/* Collapse / Expand */}
      <button
        onClick={() => {
          if (showConsole) {
            setShowConsole(false);
            setIsConsoleMaximized(false);
          } else {
            setShowConsole(true);
          }
        }}
        className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
        title={showConsole ? 'Ẩn Console' : 'Hiện Console'}
      >
        {showConsole ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
    </div>
  );
};
