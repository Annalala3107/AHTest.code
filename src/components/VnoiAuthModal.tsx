import React, { useState, useEffect } from 'react';
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
  ArrowLeft,
  Shield,
  Award,
  Settings,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { AuthUser } from '../types';
import {
  signInWithEmailPassword,
  signUpWithEmailPassword,
  signInWithGoogleOAuth,
  requestPasswordReset,
  resendConfirmationEmail,
  getSupabaseConfig,
  saveSupabaseConfig,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY,
} from '../services/supabaseAuth';
import { showToast } from '../services/uiFeedback';

interface VnoiAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialMode?: 'login' | 'register';
}

type AuthModalView = 'login' | 'register' | 'forgot_password' | 'verify_email';

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
  'Tự do / Khác',
];

function evaluatePasswordStrength(pwd: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  barColor: string;
  textColor: string;
} {
  if (!pwd) {
    return { score: 0, label: 'Chưa nhập', barColor: 'bg-slate-200 dark:bg-slate-700', textColor: 'text-slate-400' };
  }
  let points = 0;
  if (pwd.length >= 8) points += 1;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) points += 1;
  if (/\d/.test(pwd)) points += 1;
  if (/[^a-zA-Z0-9]/.test(pwd)) points += 1;

  if (pwd.length < 8) {
    return { score: 1, label: 'Yếu (cần tối thiểu 8 ký tự)', barColor: 'bg-rose-500', textColor: 'text-rose-500' };
  }
  if (points <= 2) {
    return { score: 2, label: 'Trung bình (nên thêm chữ hoa, số hoặc ký tự đặc biệt)', barColor: 'bg-amber-500', textColor: 'text-amber-500' };
  }
  if (points === 3) {
    return { score: 3, label: 'Khá tốt', barColor: 'bg-sky-500', textColor: 'text-sky-500' };
  }
  return { score: 4, label: 'Mạnh (Chuẩn bảo mật)', barColor: 'bg-emerald-500', textColor: 'text-emerald-500' };
}

export const VnoiAuthModal: React.FC<VnoiAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [activeView, setActiveView] = useState<AuthModalView>(initialMode);
  const propKey = `${isOpen}_${initialMode}`;
  const [prevPropKey, setPrevPropKey] = useState(propKey);

  // Quick Supabase Config Drawer State (GEMINI.md invariant)
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configUrl, setConfigUrl] = useState(() => getSupabaseConfig().url);
  const [configAnonKey, setConfigAnonKey] = useState(() => getSupabaseConfig().anonKey);
  const [showConfigKey, setShowConfigKey] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  // Register State
  const [regHandle, setRegHandle] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regOrg, setRegOrg] = useState(POPULAR_ORGANIZATIONS[0]);
  const [regCustomOrg, setRegCustomOrg] = useState('');
  const [showOrganization, setShowOrganization] = useState(true);
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [agreeRules, setAgreeRules] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showPrivacySummary, setShowPrivacySummary] = useState(false);

  // Forgot password & verify email state
  const [resetEmail, setResetEmail] = useState('');
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Status & Error
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (propKey !== prevPropKey) {
    setPrevPropKey(propKey);
    if (isOpen) {
      setActiveView(initialMode);
      setErrorMsg(null);
      setSuccessMsg(null);
      setLoading(false);
      setIsConfigOpen(false);
      const latestCfg = getSupabaseConfig();
      setConfigUrl(latestCfg.url);
      setConfigAnonKey(latestCfg.anonKey);
    }
  }

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const passwordStrength = evaluatePasswordStrength(regPassword);

  const resetMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(false);
  };

  const handleSwitchView = (view: AuthModalView) => {
    setActiveView(view);
    resetMessages();
  };

  const handleCheckCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
  };

  // Save Supabase Quick Config
  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configUrl.trim() || !configAnonKey.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Supabase Project URL và Public Anon Key.');
      return;
    }
    saveSupabaseConfig(configUrl, configAnonKey);
    setIsConfigOpen(false);
    setErrorMsg(null);
    showToast('Đã lưu cấu hình kết nối Supabase vào localStorage.', 'success');
  };

  const handleResetDefaultConfig = () => {
    setConfigUrl(DEFAULT_SUPABASE_URL);
    setConfigAnonKey(DEFAULT_SUPABASE_ANON_KEY);
    saveSupabaseConfig(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
    showToast('Đã khôi phục cấu hình Supabase mặc định.', 'info');
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const emailTrimmed = loginEmail.trim();
    if (!emailTrimmed) {
      setErrorMsg('Vui lòng nhập địa chỉ Email đã đăng ký.');
      return;
    }
    if (!emailTrimmed.includes('@')) {
      setErrorMsg(
        'Để bảo vệ quyền riêng tư và chống dò quét danh tính từ Handle công khai, vui lòng đăng nhập bằng địa chỉ Email đã đăng ký hoặc Google SSO.'
      );
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Vui lòng nhập Mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      const { success, user, error } = await signInWithEmailPassword(emailTrimmed, loginPassword);
      if (!success || !user) {
        setErrorMsg(error || 'Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại.');
        setLoading(false);
        return;
      }
      onLoginSuccess(user);
      showToast(`Chào mừng ${user.name} quay trở lại AHtest.code!`, 'success');
      onClose();
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
    setSuccessMsg(null);

    const handle = regHandle.trim();
    const email = regEmail.trim();
    const fullName = regFullName.trim();
    const finalOrg = regOrg === 'Tự do / Khác' ? regCustomOrg.trim() : regOrg;

    if (!handle || handle.length < 3) {
      setErrorMsg('Tên đăng nhập (Handle) phải có ít nhất 3 ký tự (chữ cái thường, số hoặc _).');
      return;
    }
    if (!/^[a-z0-9_]+$/.test(handle)) {
      setErrorMsg('Handle thi đấu chỉ được chứa chữ thường (a-z), số (0-9) và dấu gạch dưới (_).');
      return;
    }
    if (!fullName || fullName.length < 2) {
      setErrorMsg('Vui lòng nhập Họ và tên hợp lệ của thí sinh.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Vui lòng nhập địa chỉ Email hợp lệ.');
      return;
    }
    if (!regPassword || regPassword.length < 8) {
      setErrorMsg('Mật khẩu bảo mật phải có ít nhất 8 ký tự.');
      return;
    }
    if (passwordStrength.score < 2) {
      setErrorMsg('Mật khẩu quá yếu. Vui lòng kết hợp chữ hoa, chữ thường, chữ số hoặc ký tự đặc biệt.');
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
    if (!agreePrivacy) {
      setErrorMsg('Bạn cần xác nhận đồng ý Chính sách Bảo vệ Dữ liệu Cá nhân để tạo tài khoản.');
      return;
    }

    setLoading(true);
    try {
      const consentTimestamp = new Date().toISOString();
      const { success, user, error, requiresEmailConfirmation } = await signUpWithEmailPassword(
        email,
        regPassword,
        fullName,
        {
          username: handle,
          organization: finalOrg || 'Cộng đồng AHtest.code',
          showOrganization,
          privacyConsentedAt: consentTimestamp,
        }
      );

      if (!success) {
        setErrorMsg(error || 'Đăng ký tài khoản không thành công.');
        setLoading(false);
        return;
      }

      if (requiresEmailConfirmation) {
        setPendingVerifyEmail(email);
        setResendCooldown(60);
        setActiveView('verify_email');
        setLoading(false);
        showToast('Đã tạo tài khoản! Vui lòng kiểm tra hộp thư để xác nhận email.', 'info');
        return;
      }

      if (user) {
        onLoginSuccess(user);
        showToast('Đăng ký tài khoản AHtest.code thành công!', 'success');
        onClose();
        return;
      }

      setErrorMsg('Không thể khởi tạo phiên đăng nhập. Vui lòng thử lại.');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Không thể tạo tài khoản vào lúc này.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Submit
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const emailTrimmed = resetEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      setErrorMsg('Vui lòng nhập đúng địa chỉ Email đã đăng ký.');
      return;
    }

    setLoading(true);
    const result = await requestPasswordReset(emailTrimmed);
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Không thể gửi email khôi phục mật khẩu.');
      return;
    }

    // Generic message to prevent email enumeration
    setSuccessMsg(
      'Nếu địa chỉ Email tồn tại trong hệ thống, liên kết đặt lại mật khẩu đã được gửi vào hộp thư của bạn (kiểm tra cả mục Spam).'
    );
    showToast('Đã gửi yêu cầu đặt lại mật khẩu.', 'success');
  };

  // Resend Verification Email
  const handleResendVerification = async () => {
    if (resendCooldown > 0 || !pendingVerifyEmail) return;
    setLoading(true);
    setErrorMsg(null);
    const result = await resendConfirmationEmail(pendingVerifyEmail);
    setLoading(false);
    if (!result.success) {
      setErrorMsg(result.error || 'Không thể gửi lại email xác nhận lúc này.');
      return;
    }
    setResendCooldown(60);
    setSuccessMsg('Đã gửi lại liên kết kích hoạt tài khoản tới hộp thư của bạn.');
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ahtest-auth-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp"
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
                <h3 id="ahtest-auth-title" className="text-lg font-bold text-slate-900 dark:text-white">
                  AHtest Online Judge
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  AHtest ID
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Xác thực bảo mật & Bảo vệ thông tin cá nhân thí sinh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick Supabase Settings Gear Button (GEMINI.md) */}
            <button
              type="button"
              onClick={() => setIsConfigOpen((prev) => !prev)}
              aria-label="Cấu hình kết nối Supabase"
              title="Cấu hình nhanh Supabase URL & Public Anon Key"
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isConfigOpen
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng hộp thoại"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Inline Quick Supabase Config Drawer */}
        {isConfigOpen && (
          <form
            onSubmit={handleSaveSupabaseConfig}
            className="mx-6 mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3 text-xs animate-slideUp"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-rose-500" />
                <span>Cấu hình nhanh Supabase (localStorage)</span>
              </span>
              <button
                type="button"
                onClick={handleResetDefaultConfig}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Mặc định</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                value={configUrl}
                onChange={(e) => setConfigUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Supabase Public Anon Key
              </label>
              <div className="relative">
                <input
                  type={showConfigKey ? 'text' : 'password'}
                  value={configAnonKey}
                  onChange={(e) => setConfigAnonKey(e.target.value)}
                  placeholder="sb_publishable_..."
                  className="w-full pl-3 pr-9 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfigKey((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showConfigKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConfigOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
              >
                Lưu cấu hình
              </button>
            </div>
          </form>
        )}

        {/* Tab Switcher (only shown for login/register views) */}
        {(activeView === 'login' || activeView === 'register') && (
          <div className="px-6 pt-4">
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => handleSwitchView('login')}
                className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeView === 'login'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Đăng nhập (Sign In)
              </button>
              <button
                type="button"
                onClick={() => handleSwitchView('register')}
                className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeView === 'register'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Đăng ký thí sinh (Register)
              </button>
            </div>
          </div>
        )}

        {/* Alerts */}
        {(errorMsg || successMsg) && (
          <div className="px-6 pt-3 space-y-2">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-medium leading-relaxed">{successMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeView === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                    onChange={(e) => setLoginEmail(e.target.value)}
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
                    onClick={() => {
                      setResetEmail(loginEmail.includes('@') ? loginEmail : '');
                      handleSwitchView('forgot_password');
                    }}
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
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyUp={handleCheckCapsLock}
                    onKeyDown={handleCheckCapsLock}
                    placeholder="Nhập mật khẩu tài khoản"
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showLoginPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    onClick={() => setShowLoginPassword((prev) => !prev)}
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
                onClick={handleGoogleLogin}
                className="w-full py-2.5 rounded-xl font-medium text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Tiếp tục với Google SSO</span>
              </button>
            </form>
          )}

          {activeView === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
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
                    onChange={(e) => setRegHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
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
                    onChange={(e) => setRegFullName(e.target.value)}
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
                    onChange={(e) => setRegEmail(e.target.value)}
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
                    className="w-full px-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                  />
                )}
                <label className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showOrganization}
                    onChange={(e) => setShowOrganization(e.target.checked)}
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
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Ví dụ: Ah2026@!"
                        className="w-full pl-3.5 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                        required
                      />
                      <button
                        type="button"
                        aria-label={showRegPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        onClick={() => setShowRegPassword((prev) => !prev)}
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
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Khớp với mật khẩu"
                        className="w-full pl-3.5 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                        required
                      />
                      <button
                        type="button"
                        aria-label={showRegConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                        onClick={() => setShowRegConfirmPassword((prev) => !prev)}
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
                    onChange={(e) => setAgreeRules(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-rose-600 rounded-sm border-slate-300 focus:ring-rose-500 cursor-pointer"
                  />
                  <label htmlFor="agreeRules" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none leading-relaxed">
                    Tôi đồng ý với <span className="text-rose-600 dark:text-rose-400 font-semibold">Quy chế Thi đấu & Liêm chính Học thuật AHtest.code</span>.
                  </label>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agreePrivacy"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-rose-600 rounded-sm border-slate-300 focus:ring-rose-500 cursor-pointer"
                  />
                  <div className="flex-1 space-y-1">
                    <label htmlFor="agreePrivacy" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none leading-relaxed block">
                      Tôi đồng ý <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Chính sách Bảo vệ Dữ liệu Cá nhân</span> (tuân thủ Nghị định 13/2023/NĐ-CP).
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPrivacySummary((prev) => !prev)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>{showPrivacySummary ? 'Thu gọn tóm tắt' : 'Xem chi tiết quyền riêng tư'}</span>
                      {showPrivacySummary ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {showPrivacySummary && (
                      <ul className="mt-1.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4">
                        <li><strong>Mục đích thu thập:</strong> Xác thực tài khoản, lưu tiến độ bài tập và xếp hạng thi đấu.</li>
                        <li><strong>Bảo vệ danh tính:</strong> Email và họ tên thật được khóa bởi Supabase RLS; không hiển thị công khai và không chia sẻ cho bên thứ ba.</li>
                        <li><strong>Quyền kiểm soát:</strong> Bạn có thể ẩn tên trường trên bảng xếp hạng hoặc yêu cầu xuất/xóa dữ liệu cá nhân.</li>
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
          )}

          {activeView === 'forgot_password' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Khôi phục mật khẩu qua Email
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Nhập địa chỉ Email đã dùng để đăng ký tài khoản AHtest.code. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu một lần.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email tài khoản
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    autoComplete="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Đang gửi liên kết...' : 'Gửi liên kết đặt lại mật khẩu'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleSwitchView('login')}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại Đăng nhập</span>
              </button>
            </form>
          )}

          {activeView === 'verify_email' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 mx-auto flex items-center justify-center">
                <Mail className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Kiểm tra hộp thư đến của bạn
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Chúng tôi đã gửi liên kết kích hoạt tài khoản tới{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{pendingVerifyEmail}</strong>.
                  Hãy bấm vào liên kết trong email để hoàn tất đăng ký và bảo vệ tài khoản.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  disabled={loading || resendCooldown > 0}
                  onClick={handleResendVerification}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {resendCooldown > 0
                    ? `Gửi lại sau (${resendCooldown}s)`
                    : 'Gửi lại email kích hoạt'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchView('login')}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                >
                  Đã xác nhận • Đăng nhập
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
