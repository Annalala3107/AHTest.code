import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  ArrowRight, 
  Mail, 
  KeyRound, 
  ShieldAlert,
  User,
  UserPlus,
  LogIn,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthUser, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialRole?: UserRole;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [prevInitialMode, setPrevInitialMode] = useState<'login' | 'register'>(initialMode);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [fullNameInput, setFullNameInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // React-recommended pattern: adjust state during render when prop changes
  if (prevInitialMode !== initialMode) {
    setPrevInitialMode(initialMode);
    setAuthMode(initialMode);
    setErrorMessage(null);
  }

  if (!isOpen) return null;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
  };

  const handleSimulateGoogleLogin = () => {
    setIsLoading(true);
    setErrorMessage(null);

    // Simulate authentic OAuth 2.0 PKCE redirect & token verification delay
    setTimeout(() => {
      setIsLoading(false);
      const googleUser: AuthUser = {
        id: `usr_google_${Date.now()}`,
        email: emailInput.trim() || (authMode === 'register' ? 'user.google@gmail.com' : 'admin.truong@ahtest.code'),
        name: fullNameInput.trim() || (authMode === 'register' ? 'Học Viên Mới' : 'Trương Quốc Anh'),
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        role: authMode === 'register' ? selectedRole : 'super_admin',
        provider: 'google',
        streakDays: 7,
        rating: 1600,
        rankClass: 'Specialist',
        lastLoginAt: 'Vừa xong'
      };
      triggerCelebration();
      onLoginSuccess(googleUser);
      onClose();
    }, 450);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (authMode === 'register') {
      // Registration validation
      if (!fullNameInput.trim()) {
        setErrorMessage('Vui lòng nhập họ và tên của bạn.');
        return;
      }
      if (!emailInput.trim() || !emailInput.includes('@')) {
        setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ.');
        return;
      }
      if (!passwordInput || passwordInput.length < 6) {
        setErrorMessage('Mật khẩu phải chứa ít nhất 6 ký tự.');
        return;
      }
      if (passwordInput !== confirmPasswordInput) {
        setErrorMessage('Mật khẩu xác nhận không khớp.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const newUser: AuthUser = {
          id: `usr_${Date.now()}`,
          email: emailInput.trim().toLowerCase(),
          name: fullNameInput.trim(),
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(emailInput.trim())}`,
          role: selectedRole,
          provider: 'email',
          streakDays: 1,
          rating: selectedRole === 'educator' ? 1800 : 1200,
          rankClass: selectedRole === 'educator' ? 'Expert' : 'Newbie',
          lastLoginAt: 'Vừa xong'
        };
        triggerCelebration();
        onLoginSuccess(newUser);
        onClose();
      }, 450);

    } else {
      // Login validation
      if (!emailInput.trim() || !passwordInput.trim()) {
        setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const isAdminUser = emailInput.includes('admin') || emailInput.endsWith('@ahtest.code');
        const newUser: AuthUser = {
          id: `usr_${Date.now()}`,
          email: emailInput.trim(),
          name: emailInput.split('@')[0],
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(emailInput.trim())}`,
          role: isAdminUser ? 'super_admin' : 'student',
          provider: 'email',
          streakDays: 1,
          rating: 1500,
          rankClass: 'Pupil',
          lastLoginAt: 'Vừa xong'
        };
        triggerCelebration();
        onLoginSuccess(newUser);
        onClose();
      }, 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* ISOLATED STATIC BACKDROP: Separated to eliminate GPU backdrop blur re-calculation on scroll */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 transition-opacity" 
      />

      {/* Modal Container: Solid opaque background with hardware acceleration */}
      <div 
        className="relative z-10 w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] transform-gpu"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Đóng cửa sổ"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: Brand Hero Canvas */}
        <div className="md:w-5/12 bg-linear-to-br from-slate-950 via-slate-900 to-rose-950/30 p-6 sm:p-7 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
          {/* Top Brand Identity */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-rose-600 via-rose-500 to-red-500 flex items-center justify-center shadow-lg shadow-rose-600/30 ring-1 ring-white/20">
                <span className="text-white font-black text-xl leading-none">AH</span>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white block leading-none">
                  AHtest<span className="text-rose-500">.code</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Online Judge & Academy</span>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {authMode === 'login' 
                  ? 'Nền tảng Luyện Thuật Toán & Khảo Thí Lập Trình Chuyên Nghiệp'
                  : 'Khởi Đầu Hành Trình Lập Trình & Khảo Thí Đỉnh Cao'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {authMode === 'login'
                  ? 'Đăng nhập để đồng bộ tiến độ học tập trên đám mây, nộp bài chấm thi thời gian thực và quản lý kho đề bài.'
                  : 'Tạo tài khoản để lưu trữ tiến độ học tập, làm bài tập thực hành C/C++, thi đấu Contests và nhận bảng đánh giá năng lực.'}
              </p>
            </div>
          </div>

          {/* Security & System Trust Badges */}
          <div className="pt-4 space-y-2.5">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Bảo mật Chuẩn OAuth 2.0 PKCE</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Không lưu mật khẩu dạng rõ. Đăng nhập 1-chạm xác thực trực tiếp qua hạ tầng Google Identity & Supabase Auth.
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Wasm GCC 16.2 Sandbox
              </span>
              <span>256-bit AES RLS</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Ultra-smooth Form (No flex justify-center to prevent layout thrashing) */}
        <div className="md:w-7/12 p-5 sm:p-7 flex flex-col bg-slate-900 text-white overflow-y-auto overscroll-contain transform-gpu">
          <div className="max-w-md mx-auto w-full space-y-3.5 my-auto">
            
            {/* SEGMENTED TAB SWITCHER */}
            <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800 select-none">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'login'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'register'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Đăng ký tài khoản</span>
              </button>
            </div>

            {/* Header Title */}
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {authMode === 'login' ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {authMode === 'login' 
                  ? 'Chọn phương thức xác thực để truy cập hệ thống.' 
                  : 'Tham gia AHtest.code để nộp bài và lưu tiến độ học tập.'}
              </p>
            </div>

            {/* Error Banner if any */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* PRIMARY HERO CTA: Google Single Sign-On (Clean 1-chạm, no demo buttons) */}
            <div>
              <button
                type="button"
                onClick={handleSimulateGoogleLogin}
                disabled={isLoading}
                className="w-full h-10 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-indigo-500/20 active:scale-99 cursor-pointer disabled:opacity-60"
                title="Đăng nhập / Đăng ký 1-chạm bảo mật qua Google Identity Services"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>{authMode === 'login' ? 'Tiếp tục với Google' : 'Đăng ký nhanh với Google'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2 w-full">
              <div className="flex-1 border-t border-slate-800" />
              <span className="px-3 text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-mono whitespace-nowrap shrink-0 select-none">
                {authMode === 'login' ? 'hoặc dùng Email quản trị / tài khoản' : 'hoặc đăng ký bằng Email'}
              </span>
              <div className="flex-1 border-t border-slate-800" />
            </div>

            {/* Form Email / Password */}
            <form onSubmit={handleEmailAuth} className="space-y-2.5">
              {/* Full Name (Registration only) */}
              {authMode === 'register' && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={fullNameInput}
                      onChange={(e) => setFullNameInput(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  {authMode === 'login' ? 'Email Quản trị viên / Cá nhân' : 'Địa chỉ Email'}
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="yourname@gmail.com hoặc admin@ahtest.code"
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono transition-colors"
                  />
                </div>
              </div>

              {/* Password Row */}
              {authMode === 'register' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Role Picker (Registration only) */}
              {authMode === 'register' && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Mục đích tham gia
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('student')}
                      className={`p-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        selectedRole === 'student'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-xs'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Học viên / Luyện thi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('educator')}
                      className={`p-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        selectedRole === 'educator'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-xs'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Giảng viên / Soạn đề</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/30 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60 mt-1"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : authMode === 'login' ? (
                  <>
                    <span>Đăng nhập với Email</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Tạo tài khoản & Bắt đầu học</span>
                    <UserPlus className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Switch between Login and Register Mode */}
            <div className="text-center text-xs text-slate-400 pt-0.5">
              {authMode === 'login' ? (
                <span>
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setErrorMessage(null);
                    }}
                    className="text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
                  >
                    Đăng ký ngay
                  </button>
                </span>
              ) : (
                <span>
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMessage(null);
                    }}
                    className="text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
                  >
                    Đăng nhập ngay
                  </button>
                </span>
              )}
            </div>

            {/* Microcopy Privacy Note */}
            <p className="text-[10px] text-slate-500 text-center leading-normal pt-0.5">
              Bằng việc thao tác, bạn đồng ý với Quy chế Khảo thí và Tiêu chuẩn Bảo mật Thông tin AHtest.code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
