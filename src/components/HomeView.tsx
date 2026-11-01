import React from 'react';
import { 
  Trophy, 
  Flame, 
  ArrowRight, 
  Code2, 
  BookOpen, 
  UploadCloud, 
  Clock, 
  Sparkles
} from 'lucide-react';
import { Problem } from '../types';
import { mockProblems } from '../data/mockProblems';
import { mockContests } from '../data/mockContests';
import { mockSubmissions } from '../data/mockSubmissions';
import { InlineMath } from './InlineMath';
import { getStreakState } from '../services/streakService';

interface HomeViewProps {
  onSelectProblem: (problem: Problem, problemList?: Problem[], collectionTitle?: string) => void;
  onNavigateTab: (tab: any) => void;
  streakCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectProblem,
  onNavigateTab,
  streakCount
}) => {
  const dailyProblem = mockProblems[0]; // Sodium Sort
  const featuredContest = mockContests[0]; // VNOI Cup Final

  // 52-week activity heatmap generator (dummy active days)
  const heatmapWeeks = Array.from({ length: 36 }, (_, w) => 
    Array.from({ length: 7 }, (_, d) => {
      const active = (w * 7 + d) % 4 === 0 || (w * 7 + d) % 7 === 2;
      const intensity = active ? ((w + d) % 3) + 1 : 0;
      return { active, intensity };
    })
  );

  return (
    <div className="space-y-8 py-6">
      {/* Hero Contest Banner (Above-the-fold) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-900/40 p-6 sm:p-8 text-white shadow-xl shadow-rose-950/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              SẮP KHỞI TRANH • VÒNG CHUNG KẾT
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              {featuredContest.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {featuredContest.description} Thể thức IOI tính điểm thành phần (Subtasks), hệ số xếp hạng chính thức Rated toàn quốc.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 font-medium pt-1">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
                <Clock className="w-4 h-4 text-rose-400" />
                <span>Thời gian làm bài: {featuredContest.durationMinutes / 60} giờ</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{featuredContest.participantsCount} Thí sinh đã đăng ký</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
            <button
              onClick={() => onNavigateTab('problems')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer text-center"
            >
              Vào Luyện Tập Ngay
            </button>
            <button
              onClick={() => onNavigateTab('importer')}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition-colors cursor-pointer text-center"
            >
              Kho Đề Ngoại Nhập ↗
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Daily Challenge + Streaks + Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Problem of the Day */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:border-rose-500/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Thử Thách Hằng Ngày (Daily Challenge)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Giải bài hôm nay để duy trì chuỗi Streak và nhận +50 điểm danh dự
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900">
              {dailyProblem.difficulty}
            </span>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 mb-5">
            <div className="flex items-start justify-between">
              <h4 className="font-bold text-lg text-slate-900 dark:text-white hover:text-rose-600 transition-colors cursor-pointer" onClick={() => onSelectProblem(dailyProblem, mockProblems, 'Thử Thách Hằng Ngày')}>
                {dailyProblem.title}
              </h4>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {dailyProblem.points} điểm
              </span>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              <InlineMath text={dailyProblem.statement.split('\n\n')[0].replace(/\n/g, ' ')} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span>Đã giải: <strong className="text-slate-700 dark:text-slate-200">{dailyProblem.solvedCount}</strong></span>
              <span>Thời gian: <strong className="text-slate-700 dark:text-slate-200">{dailyProblem.timeLimit}s</strong></span>
              <span>Bộ nhớ: <strong className="text-slate-700 dark:text-slate-200">{dailyProblem.memoryLimit}MB</strong></span>
            </div>
            <button
              onClick={() => onSelectProblem(dailyProblem, mockProblems, 'Thử Thách Hằng Ngày')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              Vào giải ngay <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Activity Heatmap & Streak Tracker */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 fill-amber-500 text-amber-500 animate-pulse" />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Chuỗi Streak: {streakCount ?? getStreakState().currentStreak} ngày
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Kỷ lục cá nhân: {getStreakState().longestStreak} ngày liên tục
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              Biểu đồ giải thuật toán trong năm 2026:
            </p>

            {/* Mini Heatmap Grid */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-1">
                {heatmapWeeks.slice(-24).map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {week.map((day, dIdx) => (
                      <div
                        key={dIdx}
                        className={`w-2.5 h-2.5 rounded-xs transition-colors ${
                          day.intensity === 0
                            ? 'bg-slate-100 dark:bg-slate-800'
                            : day.intensity === 1
                            ? 'bg-emerald-200 dark:bg-emerald-900/60'
                            : day.intensity === 2
                            ? 'bg-emerald-400 dark:bg-emerald-600'
                            : 'bg-emerald-600 dark:bg-emerald-400'
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Mục tiêu tuần: <strong>5/7 bài</strong></span>
            <button 
              onClick={() => onNavigateTab('academy')} 
              className="text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Học bài mới <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Navigation Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          onClick={() => onNavigateTab('academy')}
          className="group p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-purple-50/60 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200/60 dark:border-indigo-800/40 hover:border-indigo-500/50 transition-all cursor-pointer shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              AHtest Academy Mới
            </h3>
            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-indigo-600 text-white">Mới</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Học C++ & Python từ số 0 với bài học tương tác dạng micro-learning. Trình biên dịch chạy ngay trên trình duyệt, không lag!
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('importer')}
          className="group p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-teal-50/60 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/60 dark:border-emerald-800/40 hover:border-emerald-500/50 transition-all cursor-pointer shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Bộ Công Cụ Import Đề Thi
            </h3>
            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-emerald-600 text-white">Pro</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Tự động chuyển đổi gói đề Themis/Polygon sang chuẩn AHtest.code. Chạy thẩm định tính toàn vẹn và đo benchmark Time Limit tự động.
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('problems')}
          className="group p-5 rounded-2xl bg-gradient-to-br from-rose-50/60 to-orange-50/60 dark:from-rose-950/30 dark:to-orange-950/30 border border-rose-200/60 dark:border-rose-800/40 hover:border-rose-500/50 transition-all cursor-pointer shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-3 shadow-md shadow-rose-600/20 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              Kho Bài Tập Chuẩn Hóa
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Tuyển tập 115+ bài toán chuẩn hóa từ Khảo thí PRF192, VOI, Olympic Tin học & ICPC với KaTeX mượt mà và giao diện làm bài Split-Workbench hiện đại.
          </p>
        </div>
      </div>

      {/* Live Submissions Stream (Full Width) */}
      <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Dòng Bài Nộp Thời Gian Thực (Live Submissions)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">WebSocket: Connected</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {mockSubmissions.map((sub) => {
            const isAC = sub.verdict === 'AC';
            const isTLE = sub.verdict === 'TLE';
            return (
              <div key={sub.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`px-2 py-1 rounded text-xs font-black tracking-wider ${
                    isAC 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                      : isTLE
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                  }`}>
                    {sub.verdict}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate hover:text-rose-600 cursor-pointer">
                      {sub.problemTitle}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {sub.user.username}
                      </span>
                      <span>•</span>
                      <span>{sub.language}</span>
                      <span>•</span>
                      <span>{sub.submittedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {sub.score}/{sub.maxScore}
                  </span>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {sub.time}s • {sub.memory}MB
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
