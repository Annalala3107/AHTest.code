import React from 'react';

export const ViewLoadingFallback: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-fade-in">
      <div className="relative w-14 h-14 mb-4">
        <div className="absolute inset-0 rounded-2xl bg-rose-500/20 animate-ping" />
        <div className="relative w-14 h-14 rounded-2xl bg-linear-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
          <span className="text-white font-black text-xl">AH</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Đang tải giao diện phân hệ...
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Hệ thống đang tải nạp module theo cơ chế On-Demand Code Splitting
        </p>
      </div>
    </div>
  );
};
