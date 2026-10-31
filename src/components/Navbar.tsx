import React, { useState } from 'react';
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
  LayoutDashboard
} from 'lucide-react';

export type NavTab = 'home' | 'problems' | 'academy' | 'importer' | 'contests' | 'leaderboard';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  streakCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  streakCount = 7
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Streamlined nav items without distracting badge clutter
  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: LayoutDashboard },
    { id: 'problems', label: 'Luyện tập', icon: Code2 },
    { id: 'academy', label: 'Khóa học', icon: BookOpen },
    { id: 'contests', label: 'Kỳ thi', icon: Trophy },
    { id: 'importer', label: 'Import Đề', icon: UploadCloud },
    { id: 'leaderboard', label: 'Xếp hạng', icon: Users },
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

            {/* User Profile Capsule - Authentic Student Profile */}
            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800 shrink-0">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="fextivity avatar"
                  className="w-8 h-8 rounded-full ring-2 ring-slate-200 dark:ring-slate-700 object-cover shrink-0"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none whitespace-nowrap">
                  fextivity
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap mt-0.5 flex items-center gap-1">
                  Học viên C/C++
                </span>
              </div>
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
