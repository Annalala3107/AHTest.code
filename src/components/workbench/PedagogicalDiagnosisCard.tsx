import React from 'react';
import { Lightbulb } from 'lucide-react';
import { PedagogicalDiagnosis } from '../../services/executionManager';

interface PedagogicalDiagnosisCardProps {
  diagnosis: PedagogicalDiagnosis;
}

export const PedagogicalDiagnosisCard: React.FC<PedagogicalDiagnosisCardProps> = ({ diagnosis }) => {
  return (
    <div className="p-3.5 rounded-xl border border-amber-500/40 bg-linear-to-r from-amber-950/40 via-slate-900 to-slate-950 shadow-md font-sans space-y-2.5">
      <div className="flex items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
            <Lightbulb className="w-4 h-4" />
          </span>
          <span className="font-bold text-amber-300 text-xs sm:text-sm">
            {diagnosis.title}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
          {diagnosis.badge}
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        {diagnosis.explanation}
      </p>

      {diagnosis.suggestion && (
        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1">
          <span className="font-bold text-emerald-400 text-[11px] block">
            💡 Hướng dẫn sửa nhanh:
          </span>
          <p className="text-slate-300 whitespace-pre-line font-mono text-[11px] leading-relaxed">
            {diagnosis.suggestion}
          </p>
        </div>
      )}
    </div>
  );
};
