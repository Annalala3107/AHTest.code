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
  Trophy,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
  User
} from 'lucide-react';
import { AuthUser } from '../types';
import { isGuestUser } from '../services/authService';
import { getVnoiRankInfo } from '../services/vnoiRank';

export type NavTab = 'home' | 'problems' | 'academy' | 'importer' | 'admin' | 'contests';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  streakCount?: number;
  currentUser?: AuthUser;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  currentUser,
  onOpenAuthModal,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isGuest = isGuestUser(currentUser);
  const rankInfo = getVnoiRankInfo(currentUser?.rating || 1200);

  // Core Navigation Destinations
  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: LayoutDashboard },
    { id: 'problems', label: 'Bài tập', icon: Code2 },
    { id: 'contests', label: 'Kỳ thi', icon: Trophy },
    { id: 'academy', label: 'Khóa học', icon: BookOpen },
    { id: 'importer', label: 'Kho Đề', icon: FolderGit2 },
    { id: 'admin', label: 'Quản trị', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 gap-2 lg:gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer focus:outline-none"
              title="AHtest.code - Về trang chủ"
            >
              <div className="relative w-10 h-10 rounded-xl bg-linear-to-tr from-rose-600 via-rose-500 to-red-500 flex items-center justify-center shadow-md shadow-rose-500/20 ring-1 ring-white/20 group-hover:scale-105 transition-all shrink-0">
                <span className="text-white font-black text-lg leading-none tracking-normal select-none flex items-center justify-center">
                  AH
                </span>
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                    AHtest<span className="text-rose-600 dark:text-rose-500">.code</span>
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap leading-tight">
                  Online Judge & Training Arena
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 xl:gap-2 flex-1 justify-center max-w-fit mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as NavTab)}
                  className={`relative flex items-center gap-1.5 lg:gap-2 px-2.5 py-2 lg:px-3 lg:py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 select-none ${
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

            {/* Authentication Capsule */}
            {isGuest ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => onOpenAuthModal?.('login')}
                  className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  <span>Đăng nhập</span>
                </button>
                <button
                  onClick={() => onOpenAuthModal?.('register')}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Đăng ký</span>
                </button>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer select-none"
                >
                  <img
                    src={currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=coder'}
                    alt="avatar"
                    className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 object-cover ring-2 ring-rose-500/20"
                  />
                  <div className="hidden sm:flex flex-col text-left leading-tight">
                    <span className={`text-xs truncate max-w-[120px] ${rankInfo.textColor}`}>
                      {currentUser?.username || currentUser?.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Rating: {currentUser?.rating || 1200}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-fadeIn">
                    {/* Header Details */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentUser?.avatarUrl}
                          alt="avatar"
                          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 ring-2 ring-rose-500/30 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-bold truncate ${rankInfo.textColor}`}>
                            {currentUser?.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono truncate">
                            @{currentUser?.username || 'ah_coder'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800/60">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${rankInfo.badgeBg}`}>
                          {rankInfo.title}
                        </span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                          {currentUser?.rating || 1200} pts
                        </span>
                      </div>
                      {currentUser?.organization && (
                        <p className="text-[10px] text-slate-400 truncate mt-1.5">
                          🏛️ {currentUser.organization}
                        </p>
                      )}
                    </div>

                    {/* Navigation Actions */}
                    <div className="py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <button
                        onClick={() => {
                          onSelectTab('problems');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                      >
                        <Code2 className="w-4 h-4 text-slate-400" />
                        <span>Kho bài tập luyện tập</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectTab('contests');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                      >
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span>Đấu trường kỳ thi (Contests)</span>
                      </button>
                      {currentUser?.role === 'super_admin' && (
                        <button
                          onClick={() => {
                            onSelectTab('admin');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-rose-600 dark:text-rose-400 cursor-pointer"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Khu vực Quản trị viên</span>
                        </button>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          onLogout?.();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất tài khoản</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

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
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400'
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

          {/* Mobile Auth Buttons */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            {isGuest ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenAuthModal?.('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-center"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => {
                    onOpenAuthModal?.('register');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white text-center shadow-xs cursor-pointer"
                >
                  Đăng ký
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onLogout?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 text-center flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất ({currentUser?.name})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
