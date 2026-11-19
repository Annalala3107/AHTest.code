import React from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthLoginFormProps {
  loginEmail: string;
  onLoginEmailChange: (v: string) => void;
  loginPassword: string;
  onLoginPasswordChange: (v: string) => void;
  showLoginPassword: boolean;
  onToggleShowLoginPassword: () => void;
  capsLockOn: boolean;
  onCheckCapsLock: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToForgotPassword: () => void;
  onGoogleLogin: () => void;
}

export const AuthLoginForm: React.FC<AuthLoginFormProps> = ({
  loginEmail,
  onLoginEmailChange,
  loginPassword,
  onLoginPasswordChange,
  showLoginPassword,
  onToggleShowLoginPassword,
  capsLockOn,
  onCheckCapsLock,
  loading,
  onSubmit,
  onSwitchToForgotPassword,
  onGoogleLogin,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Địa chỉ Email đăng nhập
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            autoComplete="email"
            value={loginEmail}
            onChange={(e) => onLoginEmailChange(e.target.value)}
            placeholder="ví dụ: sinhvien@gmail.com"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
            required
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Sử dụng Email đã đăng ký hoặc Google SSO để bảo vệ Handle công khai.
        </p>
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Mật khẩu (Password)
          </label>
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer font-semibold"
          >
            Quên mật khẩu?
          </button>
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type={showLoginPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={loginPassword}
            onChange={(e) => onLoginPasswordChange(e.target.value)}
            onKeyUp={onCheckCapsLock}
            onKeyDown={onCheckCapsLock}
            placeholder="Nhập mật khẩu tài khoản"
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
            required
          />
          <button
            type="button"
            aria-label={showLoginPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            onClick={onToggleShowLoginPassword}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {capsLockOn && (
          <p className="text-[11px] text-amber-500 font-semibold mt-1">
            ⚠️ Đang bật phím Caps Lock — hãy chú ý chữ hoa/thường.
          </p>
        )}
      </div>

      {/* Security Badge */}
      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>Phiên đăng nhập được xác thực bằng JWT PKCE từ Supabase Auth.</span>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <span>{loading ? 'Đang xác thực...' : 'Đăng nhập AHtest'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Google SSO */}
      <button
        type="button"
        disabled={loading}
        onClick={onGoogleLogin}
        className="w-full py-2.5 rounded-xl font-medium text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Tiếp tục với Google SSO</span>
      </button>
    </form>
  );
};
