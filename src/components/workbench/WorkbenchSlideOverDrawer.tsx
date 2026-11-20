import React from 'react';
import { Bot, Lightbulb, X } from 'lucide-react';
import type {
  AIMentorMode,
  AIMentorResponse,
  ProgressiveHint,
  Verdict,
} from '../../types/index.ts';
import { AIMentorDrawerContent } from './AIMentorDrawerContent.tsx';
import { ProgressiveHintDrawer } from './ProgressiveHintDrawer.tsx';

export interface WorkbenchSlideOverDrawerProps {
  isOpen: boolean;
  drawerTab: 'mentor' | 'hints';
  onSetDrawerTab: (tab: 'mentor' | 'hints') => void;
  onClose: () => void;
  problemTitle: string;
  selectedLang: string;
  verdict: Verdict | null;
  mentorResponse: AIMentorResponse | null;
  isMentorLoading: boolean;
  hasCodeBackup: boolean;
  onRunMentor: (mode: AIMentorMode, question?: string) => void;
  onApplyCode: (code: string, approachName: string) => void;
  onUndoApplyCode: () => void;
  onJumpToLine: (line: number, col?: number) => void;
  progressiveHints: ProgressiveHint[];
  unlockedHintTier: number;
  onUnlockHintTier: (tier: 1 | 2 | 3) => void;
}

export const WorkbenchSlideOverDrawer: React.FC<WorkbenchSlideOverDrawerProps> = ({
  isOpen,
  drawerTab,
  onSetDrawerTab,
  onClose,
  problemTitle,
  selectedLang,
  verdict,
  mentorResponse,
  isMentorLoading,
  hasCodeBackup,
  onRunMentor,
  onApplyCode,
  onUndoApplyCode,
  onJumpToLine,
  progressiveHints,
  unlockedHintTier,
  onUnlockHintTier,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-[2px] animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full bg-slate-900 border-l border-indigo-500/30 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSetDrawerTab('mentor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                drawerTab === 'mentor'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Mentor (Gemini 4)</span>
            </button>

            <button
              onClick={() => onSetDrawerTab('hints')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                drawerTab === 'hints'
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Gợi Ý 3 Tầng</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {drawerTab === 'mentor' ? (
            <AIMentorDrawerContent
              problemTitle={problemTitle}
              selectedLang={selectedLang}
              verdict={verdict}
              response={mentorResponse}
              isLoading={isMentorLoading}
              hasCodeBackup={hasCodeBackup}
              onRunMentor={onRunMentor}
              onApplyCode={onApplyCode}
              onUndoApplyCode={onUndoApplyCode}
              onJumpToLine={(line, col) => {
                onClose();
                onJumpToLine(line, col);
              }}
            />
          ) : (
            <ProgressiveHintDrawer
              hints={progressiveHints}
              unlockedTier={unlockedHintTier}
              onUnlockTier={onUnlockHintTier}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};
