import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Settings,
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
import { evaluatePasswordStrength, POPULAR_ORGANIZATIONS } from './auth/passwordStrength.ts';
import { AuthLoginForm } from './auth/AuthLoginForm.tsx';
import { AuthRegisterForm } from './auth/AuthRegisterForm.tsx';
import { SupabaseConfigDrawer } from './auth/SupabaseConfigDrawer.tsx';

interface VnoiAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialMode?: 'login' | 'register';
}

type AuthModalView = 'login' | 'register' | 'forgot_password' | 'verify_email';

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
        <SupabaseConfigDrawer
          isOpen={isConfigOpen}
          configUrl={configUrl}
          onConfigUrlChange={setConfigUrl}
          configAnonKey={configAnonKey}
          onConfigAnonKeyChange={setConfigAnonKey}
          showConfigKey={showConfigKey}
          onToggleShowConfigKey={() => setShowConfigKey((prev) => !prev)}
          onResetDefault={handleResetDefaultConfig}
          onClose={() => setIsConfigOpen(false)}
          onSubmit={handleSaveSupabaseConfig}
        />

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
            <AuthLoginForm
              loginEmail={loginEmail}
              onLoginEmailChange={setLoginEmail}
              loginPassword={loginPassword}
              onLoginPasswordChange={setLoginPassword}
              showLoginPassword={showLoginPassword}
              onToggleShowLoginPassword={() => setShowLoginPassword((prev) => !prev)}
              capsLockOn={capsLockOn}
              onCheckCapsLock={handleCheckCapsLock}
              loading={loading}
              onSubmit={handleLoginSubmit}
              onSwitchToForgotPassword={() => {
                setResetEmail(loginEmail.includes('@') ? loginEmail : '');
                handleSwitchView('forgot_password');
              }}
              onGoogleLogin={handleGoogleLogin}
            />
          )}

          {activeView === 'register' && (
            <AuthRegisterForm
              regHandle={regHandle}
              onRegHandleChange={setRegHandle}
              regFullName={regFullName}
              onRegFullNameChange={setRegFullName}
              regEmail={regEmail}
              onRegEmailChange={setRegEmail}
              regOrg={regOrg}
              onRegOrgChange={setRegOrg}
              regCustomOrg={regCustomOrg}
              onRegCustomOrgChange={setRegCustomOrg}
              showOrganization={showOrganization}
              onToggleShowOrganization={setShowOrganization}
              regPassword={regPassword}
              onRegPasswordChange={setRegPassword}
              regConfirmPassword={regConfirmPassword}
              onRegConfirmPasswordChange={setRegConfirmPassword}
              showRegPassword={showRegPassword}
              onToggleShowRegPassword={() => setShowRegPassword((prev) => !prev)}
              showRegConfirmPassword={showRegConfirmPassword}
              onToggleShowRegConfirmPassword={() => setShowRegConfirmPassword((prev) => !prev)}
              passwordStrength={passwordStrength}
              agreeRules={agreeRules}
              onAgreeRulesChange={setAgreeRules}
              agreePrivacy={agreePrivacy}
              onAgreePrivacyChange={setAgreePrivacy}
              showPrivacySummary={showPrivacySummary}
              onTogglePrivacySummary={() => setShowPrivacySummary((prev) => !prev)}
              loading={loading}
              onSubmit={handleRegisterSubmit}
            />
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

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleSwitchView('login')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại đăng nhập</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Đang gửi...' : 'Gửi liên kết khôi phục'}
                </button>
              </div>
            </form>
          )}

          {activeView === 'verify_email' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Kiểm tra hộp thư xác nhận
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Liên kết xác nhận tài khoản đã được gửi tới{' '}
                  <strong className="text-slate-900 dark:text-slate-200 font-mono">
                    {pendingVerifyEmail}
                  </strong>
                  . Vui lòng bấm vào liên kết trong email để kích hoạt tài khoản.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={loading || resendCooldown > 0}
                  onClick={handleResendVerification}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {resendCooldown > 0
                    ? `Gửi lại email sau (${resendCooldown}s)`
                    : 'Gửi lại email xác nhận'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchView('login')}
                  className="w-full py-2.5 rounded-xl font-semibold text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Đã xác nhận? Bấm vào đây để đăng nhập
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
