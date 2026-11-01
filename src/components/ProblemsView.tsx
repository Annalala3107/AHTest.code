import React, { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle2, ChevronRight } from 'lucide-react';
import { Problem, Difficulty } from '../types';
import { mockProblems } from '../data/mockProblems';

interface ProblemsViewProps {
  onSelectProblem: (problem: Problem, list?: Problem[], collectionTitle?: string) => void;
}

export const ProblemsView: React.FC<ProblemsViewProps> = ({ onSelectProblem }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'ALL'>('ALL');

  // Check if a problem is officially solved by the student (stored rating / stars > 0)
  const isProblemSolved = (problemId: string): boolean => {
    try {
      const star = localStorage.getItem(`ahtest_star_${problemId}`);
      return star !== null && Number(star) > 0;
    } catch {
      return false;
    }
  };

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return mockProblems.filter((p) => {
      const matchSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchDiff = selectedDifficulty === 'ALL' || p.difficulty === selectedDifficulty;

      return matchSearch && matchDiff;
    });
  }, [searchQuery, selectedDifficulty]);

  const difficultyColors: Record<Difficulty, { badge: string; text: string }> = {
    Easy: {
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-600 dark:text-emerald-400'
    },
    Medium: {
      badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      text: 'text-amber-600 dark:text-amber-400'
    },
    Hard: {
      badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800',
      text: 'text-rose-600 dark:text-rose-400'
    },
    Expert: {
      badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      text: 'text-purple-600 dark:text-purple-400'
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header and Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Kho Bài Tập Lập Trình Thi Đấu
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tuyển tập 115+ bài toán chuẩn hóa từ Khảo thí PRF192, VOI, Olympic Tin Học, ICPC và các kỳ thi Quốc gia
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên bài hoặc dạng thuật toán..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
            />
          </div>
        </div>

        {/* Difficulty Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Độ khó:
          </span>
          {(['ALL', 'Easy', 'Medium', 'Hard', 'Expert'] as const).map((diff) => {
            const isActive = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-rose-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {diff === 'ALL' ? 'Tất cả' : diff}
              </button>
            );
          })}
        </div>

        {/* Quick Topic Shortcut Banner: String Mastery */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 bg-rose-50/50 dark:bg-rose-950/20 -mx-6 -mb-6 p-4 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
              CHUYÊN ĐỀ MỚI: Chuỗi & Ký Tự (String Mastery)
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              Tuyển tập bài tập chuẩn hóa từ cơ bản đến nâng cao
            </span>
          </div>
          <button
            onClick={() => setSearchQuery(searchQuery === 'Chuỗi' ? '' : 'Chuỗi')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              searchQuery === 'Chuỗi'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40'
            }`}
          >
            {searchQuery === 'Chuỗi' ? '✓ Đang xem bài tập Chuỗi' : 'Lọc bài tập Chuỗi →'}
          </button>
        </div>
      </div>

      {/* Problems Table / Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">Trạng thái</th>
                <th className="py-3.5 px-4">Tên bài toán</th>
                <th className="py-3.5 px-4">Độ khó</th>
                <th className="py-3.5 px-4">Chủ đề</th>
                <th className="py-3.5 px-4 text-center">Tỉ lệ AC</th>
                <th className="py-3.5 px-4 text-right">Giới hạn</th>
                <th className="py-3.5 px-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không tìm thấy bài toán nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((problem) => {
                  const passRate = ((problem.solvedCount / Math.max(1, problem.totalSubmissions)) * 100).toFixed(1);
                  const diff = difficultyColors[problem.difficulty];

                  return (
                    <tr
                      key={problem.id}
                      onClick={() => onSelectProblem(problem, filteredProblems, 'Kho Bài Tập Tiêu Chuẩn')}
                      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      {/* Solved Status Icon */}
                      <td className="py-4 px-4 text-center">
                        {isProblemSolved(problem.id) ? (
                          <span title="Bạn đã giải thành công bài này! (Accepted)">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20 mx-auto" />
                          </span>
                        ) : (
                          <span title="Chưa hoàn thành">
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 dark:border-slate-600 mx-auto group-hover:border-slate-400 dark:group-hover:border-slate-500 transition-colors" />
                          </span>
                        )}
                      </td>

                      {/* Title */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                          {problem.title}
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${diff.badge}`}>
                          {problem.difficulty}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400 text-xs">
                        {problem.category}
                      </td>

                      {/* Pass Rate */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                          {passRate}%
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mt-1 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${passRate}%` }}
                          />
                        </div>
                      </td>

                      {/* Constraints */}
                      <td className="py-4 px-4 text-right text-xs font-mono text-slate-500 dark:text-slate-400">
                        <div>{problem.timeLimit}s</div>
                        <div className="text-[10px] text-slate-400">{problem.memoryLimit}MB</div>
                      </td>

                      {/* Action Chevron */}
                      <td className="py-4 px-4 text-center text-slate-400 group-hover:text-rose-600 transition-colors">
                        <ChevronRight className="w-5 h-5 ml-auto" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
