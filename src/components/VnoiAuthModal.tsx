import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  School, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Award
} from 'lucide-react';
import { AuthUser } from '../types';
import { 
  signInWithEmailPassword, 
  signUpWithEmailPassword, 
  signInWithGoogleOAuth, 
  isSupabaseConfigured 
} from '../services/supabaseAuth';

interface VnoiAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialMode?: 'login' | 'register';
}

const POPULAR_ORGANIZATIONS = [
  'Trường THPT Chuyên Khoa học Tự nhiên - ĐHQG HN',
  'Trường Phổ thông Năng khiếu - ĐHQG TP.HCM',
  'Trường THPT Chuyên Sư Phạm Hà Nội',
  'Trường THPT Chuyên Lê Hồng Phong - TP.HCM',
  'Trường THPT Chuyên Lương Văn Chánh - Phú Yên',
  'Trường Đại học Công nghệ - ĐHQG Hà Nội (UET)',
  'Trường Đại học Bách Khoa Hà Nội (HUST)',
  'Trường Đại học Bách Khoa - ĐHQG TP.HCM (HCMUT)',
  'Trường Đại học FPT (FPT University)',
  'Tự do / Khác'
];

export const VnoiAuthModal: React.FC<VnoiAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register State
  const [regHandle, setRegHandle] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regOrg, setRegOrg] = useState(POPULAR_ORGANIZATIONS[0]);
  const [regCustomOrg, setRegCustomOrg] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeRules, setAgreeRules] = useState(true);

  // Status & Error
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(false);
  };

  const handleSwitchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    resetForm();
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const identifier = loginIdentifier.trim();
    if (!identifier) {
      setErrorMsg('Vui lòng nhập Tên đăng nhập (Handle) hoặc Email.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Vui lòng nhập Mật khẩu.');
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured()) {
        const emailToUse = identifier.includes('@') ? identifier : `${identifier}@ahtest.user`;
        const { user, error } = await signInWithEmailPassword(emailToUse, loginPassword);
        if (error || !user) {
          setErrorMsg(error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
          setLoading(false);
          return;
        }
        onLoginSuccess(user);
        if (rememberMe) {
          localStorage.setItem('ahtest_active_user', JSON.stringify(user));
        }
        onClose();
      } else {
        const resolvedUser: AuthUser = {
          id: `usr_${Date.now()}`,
          username: identifier.replace(/[^a-zA-Z0-9_]/g, '') || 'coder',
          name: identifier.split('@')[0],
          email: identifier.includes('@') ? identifier : `${identifier}@ahtest.code`,
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${identifier}`,
          role: 'student',
          provider: 'email',
          streakDays: 1,
          rating: 1200,
          rankClass: 'Pupil',
          organization: 'AHtest.code Arena'
        };

        onLoginSuccess(resolvedUser);
        if (rememberMe) {
          localStorage.setItem('ahtest_active_user', JSON.stringify(resolvedUser));
        }
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Có lỗi xảy ra trong quá trình xác thực.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const handle = regHandle.trim();
    const email = regEmail.trim();
    const fullName = regFullName.trim();
    const finalOrg = regOrg === 'Tự do / Khác' ? regCustomOrg.trim() : regOrg;

    if (!handle || handle.length < 3) {
      setErrorMsg('Tên đăng nhập (Handle) phải có ít nhất 3 ký tự (chữ cái, chữ số hoặc gạch dưới).');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(handle)) {
      setErrorMsg('Tên đăng nhập chỉ được chứa ký tự chữ cái, số và dấu gạch dưới (_).');
      return;
    }
    if (!fullName) {
      setErrorMsg('Vui lòng nhập Họ và tên đầy đủ của thí sinh.');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMsg('Vui lòng nhập địa chỉ Email hợp lệ.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('Mật khẩu bảo mật phải có ít nhất 6 ký tự.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp. Vui lòng nhập lại.');
      return;
    }
    if (!agreeRules) {
      setErrorMsg('Bạn cần đồng ý với Quy chế Lập trình Thi đấu & Liêm chính Học thuật.');
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured()) {
        const { user, error } = await signUpWithEmailPassword(email, regPassword, fullName);
        if (error || !user) {
          setErrorMsg(error || 'Đăng ký tài khoản không thành công.');
          setLoading(false);
          return;
        }
        const enrichedUser: AuthUser = {
          ...user,
          username: handle,
          organization: finalOrg,
          rating: 1200,
          rankClass: 'Pupil'
        };
        onLoginSuccess(enrichedUser);
        localStorage.setItem('ahtest_active_user', JSON.stringify(enrichedUser));
        onClose();
      } else {
        const newUser: AuthUser = {
          id: `usr_ah_${Date.now()}`,
          username: handle,
          name: fullName,
          email: email,
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${handle}`,
          role: 'student',
          provider: 'email',
          streakDays: 1,
          rating: 1200,
          rankClass: 'Pupil',
          organization: finalOrg || 'Cộng đồng AHtest.code'
        };
        onLoginSuccess(newUser);
        localStorage.setItem('ahtest_active_user', JSON.stringify(newUser));
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Không thể tạo tài khoản vào lúc này.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth
  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const { error } = await signInWithGoogleOAuth();
      if (error) {
        setErrorMsg(error);
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Không thể mở cổng Google OAuth.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-rose-600 via-rose-500 to-red-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-rose-500/20">
              AH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  AHtest Online Judge
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  AHtest ID
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hệ thống xác thực thí sinh lập trình thi đấu & khảo thí
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-bold">
            <button
              onClick={() => handleSwitchTab('login')}
              className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Đăng nhập (Sign In)
            </button>
            <button
              onClick={() => handleSwitchTab('register')}
              className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Đăng ký thí sinh (Register)
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="px-6 pt-3 space-y-2">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Username or Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tên đăng nhập hoặc Email (Username / Email)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="ví dụ: user@ahtest.code hoặc username"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Mật khẩu (Password)
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Tính năng khôi phục mật khẩu sẽ gửi liên kết xác thực về email của bạn.');
                    }}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Nhập mật khẩu tài khoản"
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded-sm border-slate-300 focus:ring-rose-500 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  Ghi nhớ đăng nhập trên thiết bị này
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Đang xác thực...' : 'Đăng nhập AHtest'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Google SSO */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 rounded-xl font-medium text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Tiếp tục với Google SSO
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Handle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tên người dùng / Handle thi đấu <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regHandle}
                    onChange={(e) => setRegHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="ví dụ: coder_2026"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-mono"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Chỉ gồm chữ thường, chữ số và gạch dưới (_).</p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Họ và tên thật của thí sinh <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="ví dụ: Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Địa chỉ Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              {/* School / Organization */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Trường học / Tổ chức thi đấu (Organization)
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={regOrg}
                    onChange={(e) => setRegOrg(e.target.value)}
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
                    onChange={(e) => setRegCustomOrg(e.target.value)}
                    placeholder="Nhập tên trường học hoặc CLB của bạn..."
                    className="w-full mt-2 px-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                  />
                )}
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nhập lại mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Khớp với mật khẩu"
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              {/* Rules check */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeRules"
                  checked={agreeRules}
                  onChange={(e) => setAgreeRules(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-rose-600 rounded-sm border-slate-300 focus:ring-rose-500 cursor-pointer"
                />
                <label htmlFor="agreeRules" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  Tôi đồng ý với <span className="text-rose-600 dark:text-rose-400 font-medium">Quy chế Lập trình Thi đấu AHtest</span> và cam kết không sao chép lời giải hoặc vi phạm liêm chính học thuật.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Đang khởi tạo tài khoản...' : 'Tạo tài khoản thí sinh AHtest'}
                <Shield className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
