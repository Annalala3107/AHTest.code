import React from 'react';
import type { AuthUser } from '../../types';

interface AdminUsersSectionProps {
  userList: AuthUser[];
  onToggleUserRole: (userId: string) => void;
}

export const AdminUsersSection: React.FC<AdminUsersSectionProps> = ({
  userList,
  onToggleUserRole,
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Quản lý Thí sinh & Phân quyền Truy cập (RBAC)</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Đồng bộ tự động qua tài khoản Google SSO. Chỉ các tài khoản được cấp quyền Super Admin mới truy cập được bảng này.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Thí sinh / Cán bộ</th>
              <th className="py-3 px-4">Email Google SSO</th>
              <th className="py-3 px-4">Vai trò (Role)</th>
              <th className="py-3 px-4">Rating Elo</th>
              <th className="py-3 px-4">Hoạt động cuối</th>
              <th className="py-3 px-4 text-right">Thao tác Quyền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {userList.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatarUrl}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <div>
                      <span className="font-bold text-white block">{u.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Hoạt động: {u.streakDays} ngày</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">{u.email}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                      u.role === 'super_admin'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : u.role === 'educator'
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {u.role === 'super_admin'
                      ? '👑 Super Admin'
                      : u.role === 'educator'
                      ? '⭐ Giảng viên'
                      : 'Học viên'}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                  {u.rating || 1500} ({u.rankClass || 'Pupil'})
                </td>
                <td className="py-3 px-4 text-slate-400 font-sans">{u.lastLoginAt || 'Hôm nay'}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onToggleUserRole(u.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-rose-400 hover:text-white transition-colors cursor-pointer"
                    title="Chuyển đổi vai trò: Student -> Educator -> Super Admin"
                  >
                    Đổi vai trò
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
