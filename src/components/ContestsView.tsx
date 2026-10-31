import React, { useState } from 'react';
import { Trophy, Clock, Users, ArrowRight, Play, CheckCircle2, Award, Shield } from 'lucide-react';
import { mockContests } from '../data/mockContests';
import { Contest } from '../types';

export const ContestsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'scoreboard'>('all');
  const [selectedContest, setSelectedContest] = useState<Contest>(mockContests[0]);
  const [isVirtualRunning, setIsVirtualRunning] = useState<boolean>(false);
  const [virtualTimer, setVirtualTimer] = useState<string>('04:59:42');

  const handleStartVirtual = () => {
    setIsVirtualRunning(true);
    alert('Đã kích hoạt chế độ THAM GIA ẢO (Virtual Contest)! Đồng hồ đếm ngược 5 giờ đang chạy.');
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Các Kỳ Thi Thuật Toán & Contest
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Đấu trường cạnh tranh kỹ năng giải thuật, xếp hạng rating quốc gia và mô phỏng thi ảo
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Danh sách kỳ thi
          </button>
          <button
            onClick={() => setActiveTab('scoreboard')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'scoreboard'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Bảng Rank Mẫu
          </button>
        </div>
      </div>

      {/* Virtual Running Banner if active */}
      {isVirtualRunning && (
        <div className="p-4 rounded-2xl bg-amber-500 text-slate-950 font-bold flex items-center justify-between shadow-lg shadow-amber-500/20 animate-fadeIn">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 animate-spin" />
            <span>ĐANG THI ẢO: {selectedContest.title}</span>
          </div>
          <div className="flex items-center gap-4 text-lg font-mono">
            <span>Thời gian còn lại: <strong>{virtualTimer}</strong></span>
            <button
              onClick={() => setIsVirtualRunning(false)}
              className="px-3 py-1 bg-slate-950 text-white rounded-lg text-xs font-sans hover:bg-slate-900 cursor-pointer"
            >
              Kết thúc
            </button>
          </div>
        </div>
      )}

      {/* Contest List View */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {mockContests.map((contest) => {
            const isUpcoming = contest.status === 'UPCOMING';
            const isRunning = contest.status === 'RUNNING';

            return (
              <div
                key={contest.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:border-rose-500/40 transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      {isRunning ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          ĐANG DIỄN RA
                        </span>
                      ) : isUpcoming ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                          SẮP BẮT ĐẦU
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          ĐÃ KẾT THÚC
                        </span>
                      )}

                      {contest.isRated && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
                          Rated
                        </span>
                      )}

                      {contest.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {contest.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {contest.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    {isRunning ? (
                      <button
                        onClick={() => setActiveTab('scoreboard')}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 cursor-pointer"
                      >
                        Vào phòng thi ngay →
                      </button>
                    ) : isUpcoming ? (
                      <button
                        onClick={() => alert('Đã đăng ký tham gia kỳ thi!')}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 cursor-pointer"
                      >
                        Đăng ký tham gia
                      </button>
                    ) : (
                      <button
                        onClick={handleStartVirtual}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>Tham gia thi ảo</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub details */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Thời lượng: {contest.durationMinutes} phút
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Thí sinh: {contest.participantsCount}
                  </span>
                  <span>
                    Bao gồm <strong>{contest.problems.length}</strong> bài toán
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scoreboard View */}
      {activeTab === 'scoreboard' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Bảng Điểm Trực Tuyến - {selectedContest.title}
              </h3>
              <p className="text-xs text-slate-400">
                Cập nhật tự động từng giây qua WebSocket. Trạng thái đóng băng (Freeze) trước giờ kết thúc 1 tiếng.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Leaderboard
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-500 uppercase">
                  <th className="p-3 w-12 text-center">Hạng</th>
                  <th className="p-3">Thí sinh</th>
                  <th className="p-3 text-center">Tổng điểm</th>
                  <th className="p-3 text-center">Penalty</th>
                  <th className="p-3 text-center">A: Sodium Sort</th>
                  <th className="p-3 text-center">B: Rước đuốc</th>
                  <th className="p-3 text-center">C: Cây thông</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 text-center font-bold text-amber-500">1</td>
                  <td className="p-3 font-semibold text-red-600 dark:text-red-400">fextivity (Trần Xuân Bách)</td>
                  <td className="p-3 text-center font-bold text-emerald-600">300</td>
                  <td className="p-3 text-center font-mono">142</td>
                  <td className="p-3 text-center text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-950/20">100 (00:15)</td>
                  <td className="p-3 text-center text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-950/20">100 (00:45)</td>
                  <td className="p-3 text-center text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-950/20">100 (01:20)</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 text-center font-bold text-slate-400">2</td>
                  <td className="p-3 font-semibold text-red-600 dark:text-red-400">hollwo_pelw (Phạm Quốc Hùng)</td>
                  <td className="p-3 text-center font-bold text-emerald-600">280</td>
                  <td className="p-3 text-center font-mono">185</td>
                  <td className="p-3 text-center text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-950/20">100 (00:22)</td>
                  <td className="p-3 text-center text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-950/20">100 (01:05)</td>
                  <td className="p-3 text-center text-amber-600 font-bold bg-amber-50/50 dark:bg-amber-950/20">80 (02:10)</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 text-center font-bold text-amber-700">3</td>
                  <td className="p-3 font-semibold text-red-600 dark:text-red-400">marvinthang (Nguyễn Đức Thắng)</td>
                  <td className="p-3 text-center font-bold text-emerald-600">200</td>
                  <td className="p-3 text-center font-mono">92</td>
                  <td className="p-3 text-center text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-950/20">100 (00:18)</td>
                  <td className="p-3 text-center text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-950/20">100 (00:54)</td>
                  <td className="p-3 text-center text-slate-400 font-mono">0 (-3)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
