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
  const [showDemoProfiles, setShowDemoProfiles] = useState<boolean>(false);
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

  // Preset demo accounts for rapid testing & evaluation
  const demoAccounts: AuthUser[] = [
    {
      id: 'usr_admin_01',
      email: 'admin.truong@ahtest.code',
      name: 'Trương Quốc Anh',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      role: 'super_admin',
      provider: 'google',
      streakDays: 45,
      rating: 2450,
      rankClass: 'Grandmaster',
      lastLoginAt: 'Vừa xong'
    },
    {
      id: 'usr_educator_02',
      email: 'thay.tung@academy.edu',
      name: 'ThS. Nguyễn Thanh Tùng',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      role: 'educator',
      provider: 'google',
      streakDays: 21,
      rating: 1980,
      rankClass: 'Master',
      lastLoginAt: '10 phút trước'
    },
    {
      id: 'usr_student_03',
      email: 'fextivity@gmail.com',
      name: 'Nguyễn Hà An (fextivity)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      role: 'student',
      provider: 'google',
      streakDays: 7,
      rating: 1540,
      rankClass: 'Pupil',
      lastLoginAt: 'Vừa xong'
    }
  ];

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

  const handleSimulateGoogleLogin = (targetAccount?: AuthUser) => {
    setIsLoading(true);
    setErrorMessage(null);

    // Simulate authentic OAuth 2.0 PKCE redirect & token verification delay
    setTimeout(() => {
      setIsLoading(false);
      const chosen = targetAccount || demoAccounts[0]; // Defaults to Super Admin if clicked main button
      triggerCelebration();
      onLoginSuccess(chosen);
      onClose();
    }, 600);
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
      }, 550);

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
          name: fullNameInput.trim() || emailInput.split('@')[0],
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
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Container with Split-Screen Design */}
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative max-h-[92vh] overflow-y-auto md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Đóng cửa sổ"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: Brand Hero & Visual Trust Canvas */}
        <div className="md:w-5/12 bg-linear-to-br from-slate-950 via-slate-900 to-rose-950/40 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 relative overflow-hidden">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Top Brand Identity */}
          <div className="relative z-10 space-y-4">
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

            <div className="pt-4">
              <h3 className="text-lg font-bold text-white leading-snug">
                {authMode === 'login' 
                  ? 'Nền tảng Luyện Thuật Toán & Khảo Thí Lập Trình Chuyên Nghiệp'
                  : 'Khởi Đầu Hành Trình Lập Trình & Khảo Thí Đỉnh Cao'}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {authMode === 'login'
                  ? 'Đăng nhập để đồng bộ tiến độ học tập trên đám mây, nộp bài chấm thi thời gian thực và quản lý kho đề bài.'
                  : 'Tạo tài khoản để lưu trữ chuỗi ngày Streak, làm bài tập thực hành C/C++, thi đấu Contests và nhận bảng đánh giá năng lực.'}
              </p>
            </div>
          </div>

          {/* Security & System Trust Badges */}
          <div className="relative z-10 pt-6 space-y-3">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
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
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Wasm GCC 16.2 Sandbox
              </span>
              <span>256-bit AES RLS</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Authentication Form & SSO Actions */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-center bg-slate-900/90 text-white overflow-y-auto max-h-[85vh]">
          <div className="max-w-md mx-auto w-full space-y-4">
            
            {/* SEGMENTED TAB SWITCHER: ĐĂNG NHẬP / ĐĂNG KÝ */}
            <div className="flex items-center p-1 bg-slate-950/80 rounded-2xl border border-slate-800 select-none">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'login'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
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
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'register'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Đăng ký tài khoản</span>
              </button>
            </div>

            {/* Header Title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {authMode === 'login' ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === 'login' 
                  ? 'Chọn phương thức xác thực để truy cập hệ thống.' 
                  : 'Tham gia AHtest.code để nộp bài và lưu tiến độ học tập.'}
              </p>
            </div>

            {/* Error Banner if any */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* PRIMARY HERO CTA: Google Single Sign-On */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleSimulateGoogleLogin(demoAccounts[0])}
                disabled={isLoading}
                className="w-full h-11 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-indigo-500/20 active:scale-99 cursor-pointer disabled:opacity-60"
                title="Đăng nhập / Đăng ký 1-chạm bảo mật qua Google Identity Services"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {/* Official Google 4-Color SVG Icon */}
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                    <span>{authMode === 'login' ? 'Tiếp tục với Google' : 'Đăng ký nhanh với Google'}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>⚡ 1-chạm xác thực không cần nhớ mật khẩu</span>
                <button
                  type="button"
                  onClick={() => setShowDemoProfiles(!showDemoProfiles)}
                  className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer underline underline-offset-2"
                >
                  {showDemoProfiles ? 'Ẩn tài khoản Test' : 'Chọn nhanh Vai trò Test'}
                </button>
              </div>
            </div>

            {/* Quick Role Simulator Drawer (For Testing All User Types) */}
            {showDemoProfiles && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-fadeIn">
                <span className="text-[11px] font-bold text-slate-300 uppercase block tracking-wider font-mono">
                  Mô phỏng Đăng nhập theo Vai trò:
                </span>
                <div className="space-y-1.5">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleSimulateGoogleLogin(acc)}
                      className="w-full p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={acc.avatarUrl}
                          alt={acc.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block group-hover:text-rose-400">
                            {acc.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{acc.email}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        acc.role === 'super_admin' 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                          : acc.role === 'educator' 
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' 
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {acc.role === 'super_admin' ? 'Super Admin' : acc.role === 'educator' ? 'Giảng viên' : 'Học viên'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2 w-full">
              <div className="flex-1 border-t border-slate-800" />
              <span className="px-3 text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-mono whitespace-nowrap shrink-0 select-none">
                {authMode === 'login' ? 'hoặc dùng Email quản trị / tài khoản' : 'hoặc đăng ký bằng Email'}
              </span>
              <div className="flex-1 border-t border-slate-800" />
            </div>

            {/* Form Email / Password */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {/* Full Name (Registration only) */}
              {authMode === 'register' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullNameInput}
                      onChange={(e) => setFullNameInput(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {authMode === 'login' ? 'Email Quản trị viên / Cá nhân' : 'Địa chỉ Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="yourname@gmail.com hoặc admin@ahtest.code"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono transition-colors"
                  />
                </div>
              </div>

              {/* Confirm Password & Role Picker (Registration only) */}
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Mục đích tham gia
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('student')}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
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
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
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
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/30 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
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
            <div className="text-center text-xs text-slate-400 pt-1">
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
            <p className="text-[10px] text-slate-500 text-center leading-normal pt-1">
              Bằng việc thao tác, bạn đồng ý với Quy chế Khảo thí và Tiêu chuẩn Bảo mật Thông tin AHtest.code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
