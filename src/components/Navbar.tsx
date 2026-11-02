import React, { useState, useRef, useEffect } from 'react';
import { 
  Code2, 
  BookOpen, 
  FolderGit2,
  Sun, 
  Moon, 
  Menu, 
  X, 
  LayoutDashboard,
  Shield,
  LogOut,
  ChevronDown,
  User,
  UserPlus,
  LogIn,
  Sparkles
} from 'lucide-react';
import { AuthUser } from '../types';

export type NavTab = 'home' | 'problems' | 'academy' | 'importer' | 'admin' | 'contests' | 'leaderboard';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  streakCount?: number;
  currentUser: AuthUser;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  streakCount: _streakCount = 7,
  currentUser,
  onOpenAuthModal,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const isGuest = !currentUser || currentUser.id === 'usr_guest';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Streamlined Navbar 2.0: 4 core public destinations + Admin only for Super Admin
  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: LayoutDashboard },
    { id: 'problems', label: 'Luyện tập', icon: Code2 },
    { id: 'academy', label: 'Khóa học', icon: BookOpen },
    { id: 'importer', label: 'Kho Đề Ngoại Nhập', icon: FolderGit2 },
    ...(currentUser.role === 'super_admin' ? [{ id: 'admin', label: 'Quản trị', icon: Shield }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      {/* Full width container utilizing available horizontal space */}
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 gap-2 lg:gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer focus:outline-none"
              title="AHtest.code - Về trang chủ"
            >
              {/* Perfectly Centered Logo Badge */}
              <div className="relative w-10 h-10 rounded-xl bg-linear-to-tr from-rose-600 via-rose-500 to-red-500 flex items-center justify-center shadow-md shadow-rose-500/20 ring-1 ring-white/20 group-hover:scale-105 transition-all shrink-0">
                <span className="text-white font-black text-lg leading-none tracking-normal select-none flex items-center justify-center">
                  AH
                </span>
              </div>

              {/* Logo Title & Subtitle */}
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                    AHtest<span className="text-rose-600 dark:text-rose-500">.code</span>
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap leading-tight">
                  Online Judge & Academy
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items (Guaranteed 1 Single Line) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 xl:gap-2 flex-1 justify-center max-w-fit mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as NavTab)}
                  className={`relative flex items-center gap-1.5 lg:gap-2 px-2.5 py-2 lg:px-3.5 lg:py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 select-none ${
                    isActive
                      ? 'text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-rose-600 dark:bg-rose-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Chuyển chế độ sáng/tối"
              title={isDarkMode ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* DIRECT AVATAR AUTH INTEGRATION */}
            <div ref={profileMenuRef} className="relative shrink-0 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
              
              {isGuest ? (
                /* GUEST STATE: Dual interactive header capsule */
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Direct Quick Register Button (Desktop) */}
                  <button
                    onClick={() => onOpenAuthModal('register')}
                    className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-sm shadow-rose-600/30 transition-all hover:scale-102 cursor-pointer select-none"
                    title="Tạo tài khoản mới để lưu tiến độ"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Đăng ký</span>
                  </button>

                  {/* Avatar Anchor Button with Login microcopy */}
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/50 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:border-rose-300 dark:hover:border-rose-900/60 transition-all cursor-pointer select-none group"
                    title="Đăng nhập / Đăng ký tài khoản"
                  >
                    <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-tr from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-rose-500 transition-colors">
                      <User className="w-4 h-4" />
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
                        Đăng nhập
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none hidden sm:block">
                        / Đăng ký
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                  </button>
                </div>
              ) : (
                /* AUTHENTICATED USER STATE: Profile capsule with active badge */
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 sm:gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none group"
                  title="Tài khoản & Quản trị"
                >
                  <div className="relative">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full ring-2 ring-slate-200 dark:ring-slate-700 object-cover shrink-0 group-hover:ring-rose-500 transition-all"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none whitespace-nowrap group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap mt-0.5 flex items-center gap-1 font-mono">
                      {currentUser.role === 'super_admin' ? '👑 Super Admin' : currentUser.role === 'educator' ? '⭐ Giảng viên' : 'Học viên C/C++'}
                    </span>
                  </div>
                  <ChevronDown className="hidden sm:inline-block w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                </button>
              )}

              {/* INTERACTIVE AVATAR DROPDOWN (RICH POPUP) */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 z-50 animate-fadeIn">
                  
                  {isGuest ? (
                    /* GUEST QUICK-AUTH MENU */
                    <div className="space-y-3">
                      {/* Welcome banner */}
                      <div className="p-3.5 rounded-xl bg-linear-to-br from-rose-500/10 via-slate-50 to-indigo-500/10 dark:from-rose-950/40 dark:via-slate-950/70 dark:to-indigo-950/30 border border-slate-200 dark:border-slate-800/80">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-600/30 shrink-0">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              Tài khoản AHtest.code
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                              Đăng nhập để đồng bộ tiến độ học & nộp bài thi
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Primary SSO Action */}
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenAuthModal('login');
                        }}
                        className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
                      >
                        {/* Google Icon */}
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Tiếp tục với Google</span>
                      </button>

                      {/* Dual Form Actions */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            onOpenAuthModal('login');
                          }}
                          className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5 text-rose-500" />
                          <span>Đăng nhập</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            onOpenAuthModal('register');
                          }}
                          className="py-2 px-3 rounded-xl bg-linear-to-r from-rose-600 to-rose-500 text-white font-bold hover:from-rose-500 hover:to-rose-400 flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Đăng ký mới</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* LOGGED-IN USER MENU */
                    <div className="space-y-2">
                      {/* User Info Header */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={currentUser.avatarUrl}
                            alt={currentUser.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                              {currentUser.name}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block font-mono">
                              {currentUser.email}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500 font-medium">Vai trò:</span>
                          <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
                            {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role === 'educator' ? 'Giảng viên' : 'Học viên'}
                          </span>
                        </div>
                      </div>

                      {/* Direct Auth & Account Actions */}
                      <div className="space-y-1 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            onOpenAuthModal('login');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <LogIn className="w-4 h-4 text-rose-500" />
                          <span>Đăng nhập tài khoản khác</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            onOpenAuthModal('register');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <UserPlus className="w-4 h-4 text-emerald-500" />
                          <span>Đăng ký tài khoản mới</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            onOpenAuthModal('login');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                          </svg>
                          <span>Đổi tài khoản Google SSO</span>
                        </button>
                      </div>

                      {/* Admin Navigation Link (Strict RBAC: Only visible to Super Admin) */}
                      {currentUser.role === 'super_admin' && (
                        <div className="space-y-1 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => {
                              onSelectTab('admin');
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <Shield className="w-4 h-4 text-rose-500" />
                            <span>Hệ thống Quản trị (Backend)</span>
                          </button>
                        </div>
                      )}

                      {/* Logout Action */}
                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            onLogout();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {/* Quick Auth for Mobile */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 mb-2">
            {isGuest ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <User className="w-4 h-4 text-rose-500" />
                  <span>Chào bạn! Bạn chưa đăng nhập</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      onOpenAuthModal('login');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Đăng nhập</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuthModal('register');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-3 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Đăng ký</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role === 'educator' ? 'Giảng viên' : 'Học viên'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id as NavTab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
