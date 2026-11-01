import React from 'react';
import { Flame, X, Check, Shield, Trophy, Calendar, Sparkles } from 'lucide-react';
import { getStreakState, getWeeklyActivity, StreakState } from '../services/streakService';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToDailyChallenge?: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  onGoToDailyChallenge
}) => {
  if (!isOpen) return null;

  const streakState: StreakState = getStreakState();
  const weekly = getWeeklyActivity();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn font-sans">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent border-b border-amber-500/20 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Glowing Animated Flame */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 mb-3 animate-pulse">
            <Flame className="w-12 h-12 fill-white drop-shadow-md" />
          </div>

          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Chuỗi {streakState.currentStreak} Ngày Liên Tiếp!
          </h3>

          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border">
            {streakState.completedToday ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 px-3 py-0.5 rounded-full">
                <Check className="w-3.5 h-3.5" /> Đã hoàn thành mục tiêu hôm nay
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 px-3 py-0.5 rounded-full animate-bounce">
                <Sparkles className="w-3.5 h-3.5" /> Chưa giải bài hôm nay
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Weekly Mini Calendar */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-orange-500" /> Tiến độ tuần này
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {streakState.completedToday ? 'Tuyệt vời, giữ vững phong độ!' : 'Hãy giải 1 bài để duy trì!'}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekly.map((day, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                    day.isActive
                      ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400 font-bold'
                      : day.isToday
                      ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold block mb-1">
                    {day.dayName}
                  </span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                    day.isActive
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xs'
                      : day.isToday
                      ? 'border-2 border-dashed border-orange-500 text-orange-500'
                      : 'text-slate-400'
                  }`}>
                    {day.isActive ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span>{day.dateStr.split('-')[2]}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-center">
              <Trophy className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <span className="text-base font-black text-slate-900 dark:text-white block">
                {streakState.longestStreak}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Kỷ lục chuỗi
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-center">
              <Calendar className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
              <span className="text-base font-black text-slate-900 dark:text-white block">
                {streakState.activeDates.length}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Tổng ngày làm bài
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-center">
              <Shield className="w-5 h-5 text-sky-500 mx-auto mb-1" />
              <span className="text-base font-black text-slate-900 dark:text-white block">
                {streakState.freezeDays}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Khiên bảo vệ
              </span>
            </div>
          </div>

          {/* Action CTA */}
          <button
            onClick={() => {
              onClose();
              if (onGoToDailyChallenge) onGoToDailyChallenge();
            }}
            className="w-full py-3 px-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>{streakState.completedToday ? 'Tiếp tục luyện tập nâng cao' : 'Giải bài hôm nay ngay'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
