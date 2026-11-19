import React from 'react';
import { X, Clock, Trophy } from 'lucide-react';
import type { AcademyCourse } from '../../types/index.ts';

export interface ComingSoonModalProps {
  track: AcademyCourse | null;
  docLang: 'vi' | 'en';
  onClose: () => void;
  onSwitchTrack: () => void;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  track,
  docLang,
  onClose,
  onSwitchTrack
}) => {
  if (!track) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Lộ trình đang hoàn thiện
            </span>
            <span className="text-xs text-slate-400 font-bold uppercase">{track.language} Track</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {docLang === 'en' && track.titleEn ? track.titleEn : track.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {track.description}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Tiếp tục học C Track
          </button>
          <button
            onClick={onSwitchTrack}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-colors cursor-pointer"
          >
            Đăng ký nhận tin
          </button>
        </div>
      </div>
    </div>
  );
};

export interface GraduationModalProps {
  isOpen: boolean;
  course: AcademyCourse;
  onClose: () => void;
  onReviewFirstLesson: () => void;
}

export const GraduationModal: React.FC<GraduationModalProps> = ({
  isOpen,
  course,
  onClose,
  onReviewFirstLesson
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center shadow-inner">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            🎓 Tốt Nghiệp Khóa Học
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
            Chúc Mừng Bạn Đã Hoàn Thành {course.title}!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-sm mx-auto">
            Bạn đã vượt qua xuất sắc toàn bộ {course.totalLessons} bài học và bài tập thực hành!
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-base font-black text-indigo-600 dark:text-indigo-400">{course.totalLessons}/{course.totalLessons}</div>
            <div className="text-[10px] text-slate-400 font-medium">Bài học</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-base font-black text-emerald-500">100%</div>
            <div className="text-[10px] text-slate-400 font-medium">Tỷ lệ đạt</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-base font-black text-amber-500">8.0h</div>
            <div className="text-[10px] text-slate-400 font-medium">Thời lượng</div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onReviewFirstLesson}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Ôn tập từ Bài 1
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-colors cursor-pointer"
          >
            Đóng & Xem lại bài
          </button>
        </div>
      </div>
    </div>
  );
};
