import React from 'react';
import {
  User,
  Award,
  Mail,
  School,
  Eye,
  EyeOff,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { POPULAR_ORGANIZATIONS, type PasswordStrengthResult } from './passwordStrength.ts';

interface AuthRegisterFormProps {
  regHandle: string;
  onRegHandleChange: (v: string) => void;
  regFullName: string;
  onRegFullNameChange: (v: string) => void;
  regEmail: string;
  onRegEmailChange: (v: string) => void;
  regOrg: string;
  onRegOrgChange: (v: string) => void;
  regCustomOrg: string;
  onRegCustomOrgChange: (v: string) => void;
  showOrganization: boolean;
  onToggleShowOrganization: (v: boolean) => void;
  regPassword: string;
  onRegPasswordChange: (v: string) => void;
  regConfirmPassword: string;
  onRegConfirmPasswordChange: (v: string) => void;
  showRegPassword: boolean;
  onToggleShowRegPassword: () => void;
  showRegConfirmPassword: boolean;
  onToggleShowRegConfirmPassword: () => void;
  passwordStrength: PasswordStrengthResult;
  agreeRules: boolean;
  onAgreeRulesChange: (v: boolean) => void;
  agreePrivacy: boolean;
  onAgreePrivacyChange: (v: boolean) => void;
  showPrivacySummary: boolean;
  onTogglePrivacySummary: () => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const AuthRegisterForm: React.FC<AuthRegisterFormProps> = ({
  regHandle,
  onRegHandleChange,
  regFullName,
  onRegFullNameChange,
  regEmail,
  onRegEmailChange,
  regOrg,
  onRegOrgChange,
  regCustomOrg,
  onRegCustomOrgChange,
  showOrganization,
  onToggleShowOrganization,
  regPassword,
  onRegPasswordChange,
  regConfirmPassword,
  onRegConfirmPasswordChange,
  showRegPassword,
  onToggleShowRegPassword,
  showRegConfirmPassword,
  onToggleShowRegConfirmPassword,
  passwordStrength,
  agreeRules,
  onAgreeRulesChange,
  agreePrivacy,
  onAgreePrivacyChange,
  showPrivacySummary,
  onTogglePrivacySummary,
  loading,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Handle (Public) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Handle thi đấu <span className="text-rose-500">*</span>
          </label>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
            Công khai trên Bảng xếp hạng
          </span>
        </div>
        <div className="relative">
          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoComplete="username"
            value={regHandle}
            onChange={(e) =>
              onRegHandleChange(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
            }
            placeholder="ví dụ: coder_2026"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-mono"
            required
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Chỉ gồm chữ thường, chữ số và gạch dưới (_). Không chứa thông tin nhạy cảm.
        </p>
      </div>

      {/* Full Name (Private) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Họ và tên thật <span className="text-rose-500">*</span>
          </label>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
            🔒 Riêng tư
          </span>
        </div>
        <div className="relative">
          <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoComplete="name"
            value={regFullName}
            onChange={(e) => onRegFullNameChange(e.target.value)}
            placeholder="ví dụ: Nguyễn Văn A"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
            required
          />
        </div>
      </div>

      {/* Email (Private) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Địa chỉ Email cá nhân <span className="text-rose-500">*</span>
          </label>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
            🔒 Ẩn tuyệt đối với người khác
          </span>
        </div>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            autoComplete="email"
            value={regEmail}
            onChange={(e) => onRegEmailChange(e.target.value)}
            placeholder="user@example.com"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
            required
          />
        </div>
      </div>

      {/* School / Organization */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Trường học / Tổ chức thi đấu
        </label>
        <div className="relative">
          <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={regOrg}
            onChange={(e) => onRegOrgChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 cursor-pointer"
          >
            {POPULAR_ORGANIZATIONS.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>
        </div>
        {regOrg === 'Tự do / Khác' && (
          <input
            type="text"
            value={regCustomOrg}
            onChange={(e) => onRegCustomOrgChange(e.target.value)}
            placeholder="Nhập tên trường học hoặc CLB của bạn..."
            className="w-full px-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
          />
        )}
        <label className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showOrganization}
            onChange={(e) => onToggleShowOrganization(e.target.checked)}
            className="w-3.5 h-3.5 text-rose-600 rounded-sm border-slate-300 focus:ring-rose-500 cursor-pointer"
          />
          <span>Cho phép hiển thị tên trường/tổ chức trên Bảng xếp hạng công khai</span>
        </label>
      </div>

      {/* Passwords & Real-Time Strength Meter */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Mật khẩu (tối thiểu 8 ký tự) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showRegPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={regPassword}
                onChange={(e) => onRegPasswordChange(e.target.value)}
                placeholder="Ví dụ: Ah2026@!"
                className="w-full pl-3.5 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                required
              />
              <button
                type="button"
                aria-label={showRegPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onClick={onToggleShowRegPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nhập lại mật khẩu <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showRegConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={regConfirmPassword}
                onChange={(e) => onRegConfirmPasswordChange(e.target.value)}
                placeholder="Khớp với mật khẩu"
                className="w-full pl-3.5 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                required
              />
              <button
                type="button"
                aria-label={showRegConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                onClick={onToggleShowRegConfirmPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* 4-Bar Password Strength Meter */}
        {regPassword.length > 0 && (
          <div className="space-y-1">
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1.5 rounded-full transition-colors ${
                    passwordStrength.score >= level
                      ? passwordStrength.barColor
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
            <p className={`text-[11px] font-semibold ${passwordStrength.textColor}`}>
              Độ mạnh mật khẩu: {passwordStrength.label}
            </p>
          </div>
        )}
      </div>

      {/* Explicit Academic & Personal Data Privacy Consents */}
      <div className="space-y-2.5 pt-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="agreeRules"
            checked={agreeRules}
            onChange={(e) => onAgreeRulesChange(e.target.checked)}
            className="w-4 h-4 mt-0.5 text-rose-600 rounded-sm border-slate-300 focus:ring-rose-500 cursor-pointer"
          />
          <label
            htmlFor="agreeRules"
            className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none leading-relaxed"
          >
            Tôi đồng ý với{' '}
            <span className="text-rose-600 dark:text-rose-400 font-semibold">
              Quy chế Thi đấu & Liêm chính Học thuật AHtest.code
            </span>
            .
          </label>
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="agreePrivacy"
            checked={agreePrivacy}
            onChange={(e) => onAgreePrivacyChange(e.target.checked)}
            className="w-4 h-4 mt-0.5 text-rose-600 rounded-sm border-slate-300 focus:ring-rose-500 cursor-pointer"
          />
          <div className="flex-1 space-y-1">
            <label
              htmlFor="agreePrivacy"
              className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none leading-relaxed block"
            >
              Tôi đồng ý{' '}
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Chính sách Bảo vệ Dữ liệu Cá nhân
              </span>{' '}
              (tuân thủ Nghị định 13/2023/NĐ-CP).
            </label>
            <button
              type="button"
              onClick={onTogglePrivacySummary}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>{showPrivacySummary ? 'Thu gọn tóm tắt' : 'Xem chi tiết quyền riêng tư'}</span>
              {showPrivacySummary ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showPrivacySummary && (
              <ul className="mt-1.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4">
                <li>
                  <strong>Mục đích thu thập:</strong> Xác thực tài khoản, lưu tiến độ bài tập và xếp hạng thi đấu.
                </li>
                <li>
                  <strong>Bảo vệ danh tính:</strong> Email và họ tên thật được khóa bởi Supabase RLS; không hiển thị công khai và không chia sẻ cho bên thứ ba.
                </li>
                <li>
                  <strong>Quyền kiểm soát:</strong> Bạn có thể ẩn tên trường trên bảng xếp hạng hoặc yêu cầu xuất/xóa dữ liệu cá nhân.
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <span>{loading ? 'Đang khởi tạo tài khoản...' : 'Tạo tài khoản thí sinh AHtest'}</span>
        <Shield className="w-4 h-4" />
      </button>
    </form>
  );
};
