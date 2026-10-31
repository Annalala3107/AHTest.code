import React, { useState } from 'react';
import { Trophy, Building2, TrendingUp } from 'lucide-react';
import { mockUsers, UserItem } from '../data/mockUsers';

export const LeaderboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'individual' | 'organizations'>('individual');
  const [selectedUser, setSelectedUser] = useState<UserItem>(mockUsers[0]);

  const organizations = [
    { rank: 1, name: 'Trường THPT chuyên Khoa học Tự nhiên - ĐHQG Hà Nội', members: 420, avgRating: 2450, totalAC: 14200 },
    { rank: 2, name: 'Trường Đại học Công nghệ - ĐHQG Hà Nội (UET)', members: 310, avgRating: 2380, totalAC: 12500 },
    { rank: 3, name: 'Trường Phổ thông Năng khiếu - ĐHQG TP.HCM (PTNK)', members: 290, avgRating: 2310, totalAC: 11200 },
    { rank: 4, name: 'Trường THPT chuyên Lương Văn Chánh - Phú Yên', members: 180, avgRating: 2240, totalAC: 8900 },
    { rank: 5, name: 'Trường Đại học Bách Khoa Hà Nội (HUST)', members: 520, avgRating: 2190, totalAC: 16800 },
  ];

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Bảng Xếp Hạng Quốc Gia (Leaderboards)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hệ số Rating chuẩn hóa theo công thức Elo AHtest.code tính từ các kỳ thi Rated chính thức
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'individual'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Cá nhân (Individuals)
          </button>
          <button
            onClick={() => setActiveTab('organizations')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'organizations'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Tổ chức (Trường học / CLB)
          </button>
        </div>
      </div>

      {activeTab === 'individual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Table (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs overflow-hidden">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
              Top Lập Trình Viên Đạt Rating Cao Nhất
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-500 uppercase">
                    <th className="p-3 w-10 text-center">Hạng</th>
                    <th className="p-3">Thành viên</th>
                    <th className="p-3 text-right">Rating</th>
                    <th className="p-3 text-right">Số bài AC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {mockUsers.map((user, idx) => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                        selectedUser.id === user.id ? 'bg-rose-50/50 dark:bg-rose-950/20' : ''
                      }`}
                    >
                      <td className={`p-3 text-center font-bold ${
                        idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-slate-500'
                      }`}>
                        #{idx + 1}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img src={user.avatar} alt={user.username} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <span className={`font-bold ${user.rankColor}`}>
                              {user.username}
                            </span>
                            <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                              {user.fullName} • {user.organization}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white font-mono">
                        {user.rating}
                      </td>
                      <td className="p-3 text-right text-slate-500">
                        {user.solvedCount} bài
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Detail & Interactive Rating Chart (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.username}
                className="w-16 h-16 rounded-2xl ring-4 ring-rose-500/20 object-cover"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedUser.fullName}
                </h3>
                <span className={`text-xs ${selectedUser.rankColor}`}>
                  @{selectedUser.username} ({selectedUser.rankTitle})
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {selectedUser.organization}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block mb-0.5">Rating hiện tại:</span>
                <strong className="text-xl text-rose-600 dark:text-rose-400 font-mono font-black">
                  {selectedUser.rating}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block mb-0.5">Tổng bài giải thành công:</span>
                <strong className="text-xl text-slate-900 dark:text-white font-mono font-black">
                  {selectedUser.solvedCount}
                </strong>
              </div>
            </div>

            {/* Rating Curve Chart Simulator */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Lịch sử biến động Rating
                </h4>
                <span className="text-[10px] text-emerald-500 font-bold">+1320 pts all-time</span>
              </div>

              {/* Simplified SVG Chart */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="h-32 w-full flex items-end gap-1.5 pt-4">
                  {selectedUser.ratingHistory.map((item, idx) => {
                    const heightPercent = Math.min(100, Math.max(20, ((item.rating - 1800) / 1600) * 100));
                    return (
                      <div
                        key={idx}
                        title={`${item.contest}: ${item.rating} (Hạng ${item.rank})`}
                        className="flex-1 flex flex-col items-center group relative cursor-pointer"
                      >
                        <div
                          className="w-full rounded-t-xs bg-rose-600 group-hover:bg-rose-400 transition-all"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[8px] text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.rating}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contests History mini table */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400 block">Các kỳ thi gần nhất:</span>
              {selectedUser.ratingHistory.slice(-3).reverse().map((h, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-[11px]">
                  <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{h.contest}</span>
                  <div className="text-right">
                    <span className="font-bold text-rose-600 font-mono">{h.rating}</span>
                    <span className="text-slate-400 ml-1">(#{h.rank})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'organizations' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Bảng Xếp Hạng Các Trường THPT Chuyên & Đại Học
              </h3>
              <p className="text-xs text-slate-500">
                Tính theo trung bình rating của top 10 thành viên và tổng số bài đã nộp AC
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-500 uppercase">
                  <th className="p-3 w-12 text-center">Hạng</th>
                  <th className="p-3">Tổ chức / Trường học</th>
                  <th className="p-3 text-center">Số thành viên</th>
                  <th className="p-3 text-right">Rating trung bình</th>
                  <th className="p-3 text-right">Tổng số bài AC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {organizations.map((org) => (
                  <tr key={org.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className={`p-3 text-center font-bold ${
                      org.rank === 1 ? 'text-amber-500' : org.rank === 2 ? 'text-slate-400' : org.rank === 3 ? 'text-amber-700' : 'text-slate-500'
                    }`}>
                      #{org.rank}
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>{org.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center text-slate-500">
                      {org.members} lập trình viên
                    </td>
                    <td className="p-3 text-right font-bold text-rose-600 font-mono">
                      {org.avgRating}
                    </td>
                    <td className="p-3 text-right font-semibold text-emerald-600">
                      {org.totalAC.toLocaleString()} AC
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
