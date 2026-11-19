import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Code2,
  Database,
  Users,
  Shield,
  CheckCircle2,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import type { AuthUser } from '../types';
import { mockProblems } from '../data/mockProblems';
import { AdminOverviewSection } from './admin/AdminOverviewSection.tsx';
import { AdminProblemsSection } from './admin/AdminProblemsSection.tsx';
import { AdminTestcasesSection, type AdminTestcaseItem } from './admin/AdminTestcasesSection.tsx';
import { AdminUsersSection } from './admin/AdminUsersSection.tsx';
import { AdminAuditSection } from './admin/AdminAuditSection.tsx';
import { adminListUsersSafe, adminSetUserRole } from '../services/repositories/adminRepository.ts';

interface AdminDashboardViewProps {
  currentUser: AuthUser;
  onNavigateTab?: (tab: any) => void;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
}

type AdminSection = 'overview' | 'problems' | 'testcases' | 'users' | 'audit';

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  onNavigateTab,
  onOpenAuthModal
}) => {
  const isAuthorizedStaff = currentUser.role === 'super_admin' || currentUser.role === 'educator';
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedProblemId, setSelectedProblemId] = useState<string>(mockProblems[0]?.id || '');
  const [isAddingProblem, setIsAddingProblem] = useState<boolean>(false);
  const [rejudgeSuccessToast, setRejudgeSuccessToast] = useState<string | null>(null);

  // Filter problems based on search & difficulty
  const filteredProblems = mockProblems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff =
      selectedDifficulty === 'all' || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesSearch && matchesDiff;
  });

  const selectedProblem = mockProblems.find((p) => p.id === selectedProblemId) || mockProblems[0];

  // Mock live testcase state for the selected problem
  const [problemTestcases, setProblemTestcases] = useState<AdminTestcaseItem[]>([
    {
      id: 1,
      name: 'Sample Case #1 (Đề bài)',
      isHidden: false,
      input: selectedProblem?.samples[0]?.input || '4\n0 4\n3 2\n5 3\n8 1',
      output: selectedProblem?.samples[0]?.output || '2',
      weight: 20
    },
    {
      id: 2,
      name: 'Sample Case #2 (Công khai)',
      isHidden: false,
      input: selectedProblem?.samples[1]?.input || '3\n1 2\n2 1\n3 5',
      output: selectedProblem?.samples[1]?.output || '1',
      weight: 20
    },
    {
      id: 3,
      name: 'System Hidden Case #1 (Ranh giới K=0)',
      isHidden: true,
      input: '2\n0 0\n1 1',
      output: '-1',
      weight: 20
    },
    {
      id: 4,
      name: 'System Hidden Case #2 (Số âm & Ngắt quãng)',
      isHidden: true,
      input: '5\n-5 2\n-2 3\n0 1\n5 4\n10 2',
      output: '3',
      weight: 20
    },
    {
      id: 5,
      name: 'System Stress Test (N = 100,000)',
      isHidden: true,
      input: '100000\n[Large Array 10^5 elements]',
      output: '4999',
      weight: 20
    }
  ]);

  // Student roster with privacy-masked emails
  const [userList, setUserList] = useState<AuthUser[]>([
    {
      id: 'usr_01',
      name: 'Trương Quốc Anh',
      email: 'adm***@ahtest.code',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      role: 'super_admin',
      provider: 'google',
      streakDays: 45,
      rating: 2450,
      rankClass: 'Grandmaster',
      lastLoginAt: 'Vừa xong'
    },
    {
      id: 'usr_02',
      name: 'ThS. Nguyễn Thanh Tùng',
      email: 'tha***@academy.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
      role: 'educator',
      provider: 'google',
      streakDays: 21,
      rating: 1980,
      rankClass: 'Master',
      lastLoginAt: '12 phút trước'
    },
    {
      id: 'usr_03',
      name: 'Nguyễn Hà An (fextivity)',
      email: 'fex***@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      role: 'student',
      provider: 'google',
      streakDays: 7,
      rating: 1540,
      rankClass: 'Pupil',
      lastLoginAt: 'Vừa xong'
    },
    {
      id: 'usr_04',
      name: 'Lê Hoàng Long',
      email: 'lon***@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      role: 'student',
      provider: 'google',
      streakDays: 14,
      rating: 1720,
      rankClass: 'Specialist',
      lastLoginAt: '1 giờ trước'
    }
  ]);

  useEffect(() => {
    let mounted = true;
    adminListUsersSafe().then((users) => {
      if (mounted && users.length > 0) {
        setUserList(users);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!isAuthorizedStaff) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-6 bg-slate-950 text-white font-sans">
        <div className="max-w-md w-full p-7 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl text-center space-y-5 animate-scaleUp">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
              403 • Khu Vực Giới Hạn Quyền Truy Cập
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Yêu cầu quyền Giảng viên hoặc Super Admin
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Khu vực Quản trị Hệ thống chứa thông tin nhạy cảm và công cụ điều phối đề thi. Vui lòng đăng nhập bằng tài khoản được cấp quyền trên cơ sở dữ liệu Supabase.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              onClick={() => onNavigateTab?.('home')}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            >
              Về Trang Chủ
            </button>
            <button
              onClick={() => onOpenAuthModal?.('login')}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              Đăng Nhập Quản Trị
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleUserRole = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextRole =
            u.role === 'student' ? 'educator' : u.role === 'educator' ? 'super_admin' : 'student';
          adminSetUserRole(userId, nextRole).catch(() => {});
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
  };

  const handleRejudgeAll = () => {
    setRejudgeSuccessToast('Đã kích hoạt Re-Judge toàn bộ 412 bài nộp trên cụm Wasm Judge Sandbox!');
    setTimeout(() => setRejudgeSuccessToast(null), 4000);
  };

  const handleToggleTestcaseHidden = (id: number) => {
    setProblemTestcases((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isHidden: !t.isHidden } : t))
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex flex-col bg-slate-950 text-white font-sans">
      {/* Toast Notification */}
      {rejudgeSuccessToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{rejudgeSuccessToast}</span>
        </div>
      )}

      {/* TOP COMMAND & STATUS BAR */}
      <div className="h-14 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 select-none">
        {/* Breadcrumb & Section indicator */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="w-7 h-7 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-slate-200">Hệ Thống Quản Trị</span>
          <span className="text-slate-600">/</span>
          <span className="text-rose-400 font-semibold uppercase tracking-wider text-[11px] font-mono">
            {activeSection === 'overview' && 'Tổng quan & Metrics'}
            {activeSection === 'problems' && 'Kho Đề Bài (Problems)'}
            {activeSection === 'testcases' && 'Quản Lý Testcases 2 Tầng'}
            {activeSection === 'users' && 'Thí Sinh & Phân Quyền RBAC'}
            {activeSection === 'audit' && 'Audit Log & Bảo Mật RLS'}
          </span>
        </div>

        {/* Global Live Judge Status + Admin Identity Hub */}
        <div className="flex items-center gap-3">
          <span className="hidden lg:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Chế độ Mô phỏng Dữ liệu
          </span>
          {/* Judge Health Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Judge Wasm Sandbox:</span>
            <span className="text-emerald-400 font-bold">Sẵn sàng (18ms)</span>
          </div>

          {/* Current Admin Profile */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700/80">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-600"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-none">{currentUser.name}</span>
              <span className="text-[9px] text-rose-400 font-semibold font-mono leading-none mt-0.5">
                {currentUser.role === 'super_admin'
                  ? 'Super Admin'
                  : currentUser.role === 'educator'
                  ? 'Giáo viên'
                  : 'Sinh viên'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE BODY WITH DEDICATED SIDEBAR */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT NAV SIDEBAR (Linear Style) */}
        <div className="w-full md:w-60 bg-slate-900/60 border-r border-slate-800 p-3 space-y-1 shrink-0 flex md:flex-col justify-start overflow-x-auto md:overflow-x-visible">
          <button
            onClick={() => setActiveSection('overview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'overview'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Tổng quan Metrics</span>
          </button>

          <button
            onClick={() => setActiveSection('problems')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'problems'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-4 h-4 shrink-0" />
            <span>Kho Đề bài ({mockProblems.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('testcases')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'testcases'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-4 h-4 shrink-0" />
            <span>Quản lý Testcases</span>
          </button>

          <button
            onClick={() => setActiveSection('users')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'users'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Thí sinh & RBAC ({userList.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('audit')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'audit'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>Audit Log & RLS</span>
          </button>

          {/* Quick return button to user view */}
          <div className="pt-4 md:mt-auto border-t border-slate-800/80">
            <button
              onClick={() => onNavigateTab?.('problems')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>Về phòng luyện tập</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT WORKSPACE */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeSection === 'overview' && (
            <AdminOverviewSection onRejudgeAll={handleRejudgeAll} />
          )}

          {activeSection === 'problems' && (
            <AdminProblemsSection
              problems={filteredProblems}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={setSelectedDifficulty}
              isAddingProblem={isAddingProblem}
              onToggleAddProblem={() => setIsAddingProblem(!isAddingProblem)}
              onSelectProblemTestcases={(probId) => {
                setSelectedProblemId(probId);
                setActiveSection('testcases');
              }}
            />
          )}

          {activeSection === 'testcases' && (
            <AdminTestcasesSection
              problems={mockProblems}
              selectedProblemId={selectedProblemId}
              onSelectProblemId={setSelectedProblemId}
              testcases={problemTestcases}
              onToggleTestcaseHidden={handleToggleTestcaseHidden}
            />
          )}

          {activeSection === 'users' && (
            <AdminUsersSection
              userList={userList}
              onToggleUserRole={handleToggleUserRole}
            />
          )}

          {activeSection === 'audit' && <AdminAuditSection />}
        </div>
      </div>
    </div>
  );
};
