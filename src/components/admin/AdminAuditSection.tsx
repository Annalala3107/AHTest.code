import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';

export const AdminAuditSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Chính Sách Bảo Mật Cấp Hàng (Supabase RLS Status)</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Toàn bộ bảng dữ liệu nhạy cảm (<code className="text-rose-400">problem_testcases</code>, <code className="text-rose-400">submissions.code</code>) được bảo vệ bằng chính sách RLS. Người dùng nặc danh không thể truy vấn trái phép dữ liệu ẩn.
        </p>
        <div className="pt-2 flex items-center gap-3 text-xs font-mono">
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> RLS Enabled: ON
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-indigo-400">Domain Whitelist: Toàn bộ Email Google hợp lệ</span>
        </div>
      </div>

      {/* Audit Trail Timeline */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Nhật Ký Hành Động Quản Trị (Immutable Audit Trail)
        </h4>

        <div className="space-y-2.5 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-emerald-400 font-bold">[LOGIN_SUCCESS]</span> Google SSO Auth: <strong className="text-white">adm***@ahtest.code</strong> (IP: 14.232.***.***)
            </div>
            <span className="text-slate-500 text-[11px]">Vừa xong</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-indigo-400 font-bold">[REJUDGE_ALL]</span> Kích hoạt re-judge 412 bài nộp bài toán [torch]
            </div>
            <span className="text-slate-500 text-[11px]">2 phút trước</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-amber-400 font-bold">[TESTCASE_UPDATE]</span> Đổi cờ bảo mật RLS sang Hidden cho Test #3 [torch]
            </div>
            <span className="text-slate-500 text-[11px]">15 phút trước</span>
          </div>
        </div>
      </div>
    </div>
  );
};
