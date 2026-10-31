import React, { useState, useRef, useEffect } from 'react';
import { 
  Code2, 
  BookOpen, 
  Trophy, 
  UploadCloud, 
  Users, 
  Flame, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LayoutDashboard,
  Shield,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { AuthUser } from '../types';

export type NavTab = 'home' | 'problems' | 'academy' | 'importer' | 'contests' | 'leaderboard' | 'admin';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  streakCount?: number;
  currentUser: AuthUser;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  streakCount = 7,
  currentUser,
  onOpenAuthModal,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  // Streamlined nav items with Admin Dashboard access
  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: LayoutDashboard },
    { id: 'problems', label: 'Luyện tập', icon: Code2 },
    { id: 'academy', label: 'Khóa học', icon: BookOpen },
    { id: 'contests', label: 'Kỳ thi', icon: Trophy },
    { id: 'importer', label: 'Import Đề', icon: UploadCloud },
    { id: 'leaderboard', label: 'Xếp hạng', icon: Users },
    { id: 'admin', label: 'Quản trị', icon: Shield },
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

              {/* Logo Title & Subtitle - Clean typography without clutter badge */}
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

          {/* Desktop Nav Items (Guaranteed 1 Single Line with whitespace-nowrap) */}
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
            {/* Daily Streak Indicator */}
            <div 
              title="Chuỗi ngày luyện tập liên tiếp!" 
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 lg:px-3 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 text-xs font-bold whitespace-nowrap shrink-0"
            >
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{streakCount} ngày</span>
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Chuyển chế độ sáng/tối"
              title={isDarkMode ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User Profile Capsule with Interactive Dropdown & Google SSO Auth */}
            <div ref={profileMenuRef} className="relative shrink-0 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 sm:gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none"
                title="Tài khoản cá nhân & Quản trị"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full ring-2 ring-slate-200 dark:ring-slate-700 object-cover shrink-0"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none whitespace-nowrap">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap mt-0.5 flex items-center gap-1 font-mono">
                    {currentUser.role === 'super_admin' ? '👑 Super Admin' : currentUser.role === 'educator' ? '⭐ Giảng viên' : 'Học viên C/C++'}
                  </span>
                </div>
                <ChevronDown className="hidden sm:inline-block w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-fadeIn">
                  {/* User info banner */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800/80 mb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                          {currentUser.name}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block font-mono">
                          {currentUser.email}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-medium">Quyền hạn:</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
                        {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role === 'educator' ? 'Giảng viên' : 'Sinh viên'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-1 text-xs">
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

                    <button
                      onClick={() => {
                        onOpenAuthModal();
                        setIsProfileMenuOpen(false);
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

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

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
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg">
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
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
