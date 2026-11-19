import React from 'react';
import { Users, Activity, Cpu, HardDrive, Terminal, RotateCcw } from 'lucide-react';

interface AdminOverviewSectionProps {
  onRejudgeAll: () => void;
}

export const AdminOverviewSection: React.FC<AdminOverviewSectionProps> = ({ onRejudgeAll }) => {
  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Thí sinh Hoạt động</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">1,248</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <span>↑ +14.2%</span> <span className="text-slate-500 font-normal">so với tuần trước</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tổng lượt nộp bài</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">18,920</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <span>AC Rate: 64.2%</span> <span className="text-slate-500 font-normal">(12,146 AC)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Độ trễ Judge Trung bình</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">18.4 ms</div>
          <div className="text-[11px] text-slate-400">
            Client Wasm Sandbox 0ms network
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tài nguyên Máy ảo Judge</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            128 MB <span className="text-xs text-slate-400 font-normal">/ 4 GB</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold">
            CPU: 4.1% • Tải cực kỳ ổn định
          </div>
        </div>
      </div>

      {/* Verdict Distribution Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Phân bổ Kết quả Chấm thi (Verdict Distribution)
          </h3>
          <span className="text-xs text-slate-400 font-mono">18,920 Submissions</span>
        </div>

        {/* Progress bar stack */}
        <div className="h-4 rounded-full bg-slate-950 overflow-hidden flex">
          <div style={{ width: '64%' }} className="bg-emerald-500" title="Accepted (AC): 64%" />
          <div style={{ width: '22%' }} className="bg-rose-500" title="Wrong Answer (WA): 22%" />
          <div style={{ width: '8%' }} className="bg-amber-500" title="Time Limit Exceeded (TLE): 8%" />
          <div style={{ width: '4%' }} className="bg-purple-500" title="Runtime Error (RTE): 4%" />
          <div style={{ width: '2%' }} className="bg-slate-600" title="Compile Error (CE): 2%" />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs pt-1">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Accepted (64%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Wrong Answer (22%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> TLE (8%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> RTE (4%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> CE (2%)</span>
        </div>
      </div>

      {/* Live Submissions Feed */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-white">Lịch sử Chấm bài Thời gian thực (Live Judge Stream)</h3>
          </div>
          <button
            onClick={onRejudgeAll}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-Judge Toàn bộ</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Mã Nộp</th>
                <th className="py-2.5 px-3">Thí sinh</th>
                <th className="py-2.5 px-3">Bài toán</th>
                <th className="py-2.5 px-3">Ngôn ngữ</th>
                <th className="py-2.5 px-3">Kết quả</th>
                <th className="py-2.5 px-3">Thời gian</th>
                <th className="py-2.5 px-3">Bộ nhớ</th>
                <th className="py-2.5 px-3">Thời điểm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 text-slate-500">#SUB-9841</td>
                <td className="py-2.5 px-3 font-sans font-bold text-white">fextivity</td>
                <td className="py-2.5 px-3 font-sans text-rose-400">Rước đuốc Olympic</td>
                <td className="py-2.5 px-3">C++20 (GCC)</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AC 100/100</span></td>
                <td className="py-2.5 px-3">18ms</td>
                <td className="py-2.5 px-3">1.2MB</td>
                <td className="py-2.5 px-3 text-slate-500 font-sans">1 phút trước</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 text-slate-500">#SUB-9840</td>
                <td className="py-2.5 px-3 font-sans font-bold text-white">longlh.se17</td>
                <td className="py-2.5 px-3 font-sans text-slate-300">Dãy con tăng dài nhất (LIS)</td>
                <td className="py-2.5 px-3">C17</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">TLE (2.01s)</span></td>
                <td className="py-2.5 px-3">2010ms</td>
                <td className="py-2.5 px-3">18.4MB</td>
                <td className="py-2.5 px-3 text-slate-500 font-sans">4 phút trước</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 text-slate-500">#SUB-9839</td>
                <td className="py-2.5 px-3 font-sans font-bold text-white">tranduluong</td>
                <td className="py-2.5 px-3 font-sans text-slate-300">Biến đổi ma trận xoắn ốc</td>
                <td className="py-2.5 px-3">C++20</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">WA (Diff #2)</span></td>
                <td className="py-2.5 px-3">34ms</td>
                <td className="py-2.5 px-3">2.4MB</td>
                <td className="py-2.5 px-3 text-slate-500 font-sans">8 phút trước</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
