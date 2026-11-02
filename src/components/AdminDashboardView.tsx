import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Code2, 
  Database, 
  Users, 
  Shield, 
  Terminal, 
  Search, 
  Plus, 
  RotateCcw, 
  CheckCircle2, 
  HardDrive, 
  Cpu, 
  Activity, 
  Lock, 
  Unlock, 
  Edit3, 
  ArrowUpRight
} from 'lucide-react';
import { AuthUser } from '../types';
import { mockProblems } from '../data/mockProblems';

interface AdminDashboardViewProps {
  currentUser: AuthUser;
  onNavigateTab?: (tab: any) => void;
}

type AdminSection = 'overview' | 'problems' | 'testcases' | 'users' | 'audit';

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  onNavigateTab
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedProblemId, setSelectedProblemId] = useState<string>(mockProblems[0]?.id || '');
  const [isAddingProblem, setIsAddingProblem] = useState<boolean>(false);
  const [rejudgeSuccessToast, setRejudgeSuccessToast] = useState<string | null>(null);

  // Filter problems based on search & difficulty
  const filteredProblems = mockProblems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = selectedDifficulty === 'all' || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesSearch && matchesDiff;
  });

  const selectedProblem = mockProblems.find((p) => p.id === selectedProblemId) || mockProblems[0];

  // Mock live testcase state for the selected problem
  const [problemTestcases, setProblemTestcases] = useState([
    { id: 1, name: 'Sample Case #1 (Đề bài)', isHidden: false, input: selectedProblem?.samples[0]?.input || '4\n0 4\n3 2\n5 3\n8 1', output: selectedProblem?.samples[0]?.output || '2', weight: 20 },
    { id: 2, name: 'Sample Case #2 (Công khai)', isHidden: false, input: selectedProblem?.samples[1]?.input || '3\n1 2\n2 1\n3 5', output: selectedProblem?.samples[1]?.output || '1', weight: 20 },
    { id: 3, name: 'System Hidden Case #1 (Ranh giới K=0)', isHidden: true, input: '2\n0 0\n1 1', output: '-1', weight: 20 },
    { id: 4, name: 'System Hidden Case #2 (Số âm & Ngắt quãng)', isHidden: true, input: '5\n-5 2\n-2 3\n0 1\n5 4\n10 2', output: '3', weight: 20 },
    { id: 5, name: 'System Stress Test (N = 100,000)', isHidden: true, input: '100000\n[Large Array 10^5 elements]', output: '4999', weight: 20 }
  ]);

  // Mock student roster
  const [userList, setUserList] = useState<AuthUser[]>([
    {
      id: 'usr_01',
      name: 'Trương Quốc Anh',
      email: 'admin.truong@ahtest.code',
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
      email: 'thay.tung@academy.edu',
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
      email: 'fextivity@gmail.com',
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
      email: 'longlh@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      role: 'student',
      provider: 'google',
      streakDays: 14,
      rating: 1720,
      rankClass: 'Specialist',
      lastLoginAt: '1 giờ trước'
    }
  ]);

  const handleToggleUserRole = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextRole = u.role === 'student' ? 'educator' : u.role === 'educator' ? 'super_admin' : 'student';
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
          {/* Judge Health Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Judge Wasm Sandbox:</span>
            <span className="text-emerald-400 font-bold">Sẵn sàng (18ms)</span>
          </div>

          {/* Current Admin Profile */}
          <div
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700/80"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-600"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-none">{currentUser.name}</span>
              <span className="text-[9px] text-rose-400 font-semibold font-mono leading-none mt-0.5">
                {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role === 'educator' ? 'Giáo viên' : 'Sinh viên'}
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
              onClick={() => onNavigateTab && onNavigateTab('problems')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>Về phòng luyện tập</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT WORKSPACE */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

          {/* ======================================================== */}
          {/* SECTION 1: OVERVIEW & SYSTEM METRICS                      */}
          {/* ======================================================== */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Top 4 KPI Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Thí sinh Hoạt động</span>
                    <Users className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-white">1,248</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <span>↑ +14.2%</span> <span className="text-slate-500 font-normal">so với tuần trước</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Tổng lượt nộp bài</span>
                    <Activity className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-black text-white">18,920</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <span>AC Rate: 64.2%</span> <span className="text-slate-500 font-normal">(12,146 AC)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Độ trễ Judge Trung bình</span>
                    <Cpu className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">18.4 ms</div>
                  <div className="text-[11px] text-slate-400">
                    Client Wasm Sandbox 0ms network
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Tài nguyên Máy ảo Judge</span>
                    <HardDrive className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">128 MB <span className="text-xs text-slate-400 font-normal">/ 4 GB</span></div>
                  <div className="text-[11px] text-emerald-400 font-semibold">
                    CPU: 4.1% • Tải cực kỳ ổn định
                  </div>
                </div>
              </div>

              {/* Verdict Distribution Bar */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Phân bổ Kết quả Chấm thi (Verdict Distribution)
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">18,920 Submissions</span>
                </div>

                {/* Progress bar stack */}
                <div className="h-4 rounded-full bg-slate-950 overflow-hidden flex">
                  <div style={{ width: '64%' }} className="bg-emerald-500" title="Accepted (AC): 64%" />
                  <div style={{ width: '22%' }} className="bg-rose-500" title="Wrong Answer (WA): 22%" />
                  <div style={{ width: '8%' }} className="bg-amber-500" title="Time Limit Exceeded (TLE): 8%" />
                  <div style={{ width: '4%' }} className="bg-purple-500" title="Runtime Error (RTE): 4%" />
                  <div style={{ width: '2%' }} className="bg-slate-600" title="Compile Error (CE): 2%" />
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs pt-1">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Accepted (64%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Wrong Answer (22%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> TLE (8%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> RTE (4%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> CE (2%)</span>
                </div>
              </div>

              {/* Live Submissions Feed */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-rose-500" />
                    <h3 className="text-sm font-bold text-white">Lịch sử Chấm bài Thời gian thực (Live Judge Stream)</h3>
                  </div>
                  <button
                    onClick={handleRejudgeAll}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-Judge Toàn bộ</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Mã Nộp</th>
                        <th className="py-2.5 px-3">Thí sinh</th>
                        <th className="py-2.5 px-3">Bài toán</th>
                        <th className="py-2.5 px-3">Ngôn ngữ</th>
                        <th className="py-2.5 px-3">Kết quả</th>
                        <th className="py-2.5 px-3">Thời gian</th>
                        <th className="py-2.5 px-3">Bộ nhớ</th>
                        <th className="py-2.5 px-3">Thời điểm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-mono">
                      <tr className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-slate-500">#SUB-9841</td>
                        <td className="py-2.5 px-3 font-sans font-bold text-white">fextivity</td>
                        <td className="py-2.5 px-3 font-sans text-rose-400">Rước đuốc Olympic</td>
                        <td className="py-2.5 px-3">C++20 (GCC)</td>
                        <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AC 100/100</span></td>
                        <td className="py-2.5 px-3">18ms</td>
                        <td className="py-2.5 px-3">1.2MB</td>
                        <td className="py-2.5 px-3 text-slate-500 font-sans">1 phút trước</td>
                      </tr>
                      <tr className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-slate-500">#SUB-9840</td>
                        <td className="py-2.5 px-3 font-sans font-bold text-white">longlh.se17</td>
                        <td className="py-2.5 px-3 font-sans text-slate-300">Dãy con tăng dài nhất (LIS)</td>
                        <td className="py-2.5 px-3">C17</td>
                        <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">TLE (2.01s)</span></td>
                        <td className="py-2.5 px-3">2010ms</td>
                        <td className="py-2.5 px-3">18.4MB</td>
                        <td className="py-2.5 px-3 text-slate-500 font-sans">4 phút trước</td>
                      </tr>
                      <tr className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-slate-500">#SUB-9839</td>
                        <td className="py-2.5 px-3 font-sans font-bold text-white">tranduluong</td>
                        <td className="py-2.5 px-3 font-sans text-slate-300">Biến đổi ma trận xoắn ốc</td>
                        <td className="py-2.5 px-3">C++20</td>
                        <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">WA (Diff #2)</span></td>
                        <td className="py-2.5 px-3">34ms</td>
                        <td className="py-2.5 px-3">2.4MB</td>
                        <td className="py-2.5 px-3 text-slate-500 font-sans">8 phút trước</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 2: PROBLEMS MANAGEMENT                            */}
          {/* ======================================================== */}
          {activeSection === 'problems' && (
            <div className="space-y-4">
              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm bài theo tên, slug..."
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
                  >
                    <option value="all">Tất cả độ khó</option>
                    <option value="easy">Dễ (Easy)</option>
                    <option value="medium">Trung bình (Medium)</option>
                    <option value="hard">Khó (Hard)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setIsAddingProblem(!isAddingProblem)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm bài toán mới</span>
                  </button>
                </div>
              </div>

              {/* Problems Table */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Mã / Slug</th>
                      <th className="py-3 px-4">Tên bài toán</th>
                      <th className="py-3 px-4">Thể loại</th>
                      <th className="py-3 px-4">Độ khó</th>
                      <th className="py-3 px-4">Giới hạn</th>
                      <th className="py-3 px-4">Lượt nộp</th>
                      <th className="py-3 px-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredProblems.map((prob) => (
                      <tr key={prob.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-400">{prob.slug}</td>
                        <td className="py-3 px-4 font-bold text-white">
                          <span>{prob.title}</span>
                          <span className="block text-[10px] text-slate-500 font-normal">Tác giả: {prob.author}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                            {prob.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            prob.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                            prob.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {prob.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {prob.timeLimit}s • {prob.memoryLimit}MB
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {prob.solvedCount} / {prob.totalSubmissions}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedProblemId(prob.id);
                                setActiveSection('testcases');
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-white transition-colors cursor-pointer"
                              title="Xem & sửa Testcases"
                            >
                              <Database className="w-3.5 h-3.5" />
                            </button>
                            <button
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Chỉnh sửa đề bài"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 3: TESTCASE 2-TIER MANAGEMENT                     */}
          {/* ======================================================== */}
          {activeSection === 'testcases' && (
            <div className="space-y-4">
              {/* Problem Selector Bar */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-xs font-semibold text-slate-400">Chọn bài toán:</span>
                  <select
                    value={selectedProblemId}
                    onChange={(e) => setSelectedProblemId(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer font-bold"
                  >
                    {mockProblems.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.slug}] {p.title} ({p.difficulty})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 text-emerald-400 border border-emerald-800/80 font-mono">
                    2 Test Công khai
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 text-amber-400 border border-amber-800/80 font-mono flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    3 Test Ẩn RLS Guard
                  </span>
                </div>
              </div>

              {/* Testcases List */}
              <div className="grid grid-cols-1 gap-3">
                {problemTestcases.map((tc) => (
                  <div key={tc.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          tc.isHidden 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          {tc.isHidden ? '🔒 Testcase Ẩn (System Case)' : '🌐 Testcase Công khai'}
                        </span>
                        <span className="text-xs font-bold text-white">{tc.name}</span>
                        <span className="text-[11px] text-slate-500 font-mono">Trọng số: {tc.weight} điểm</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setProblemTestcases((prev) =>
                              prev.map((t) => t.id === tc.id ? { ...t, isHidden: !t.isHidden } : t)
                            );
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 cursor-pointer"
                          title="Bật/Tắt chế độ ẩn (RLS Row Level Security)"
                        >
                          {tc.isHidden ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3 text-amber-400" />}
                          <span>{tc.isHidden ? 'Chuyển thành Công khai' : 'Khóa bảo mật Ẩn'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block mb-1">Input Data:</span>
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 whitespace-pre-wrap max-h-28 overflow-y-auto">
                          {tc.input}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-500 uppercase block mb-1">Expected Output:</span>
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 whitespace-pre-wrap max-h-28 overflow-y-auto">
                          {tc.output}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 4: USERS & RBAC ROLE-BASED ACCESS CONTROL         */}
          {/* ======================================================== */}
          {activeSection === 'users' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Quản lý Thí sinh & Phân quyền Truy cập (RBAC)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Đồng bộ tự động qua tài khoản Google SSO. Chỉ các tài khoản được cấp quyền Super Admin mới truy cập được bảng này.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Thí sinh / Cán bộ</th>
                      <th className="py-3 px-4">Email Google SSO</th>
                      <th className="py-3 px-4">Vai trò (Role)</th>
                      <th className="py-3 px-4">Rating Elo</th>
                      <th className="py-3 px-4">Hoạt động cuối</th>
                      <th className="py-3 px-4 text-right">Thao tác Quyền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {userList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700" />
                            <div>
                              <span className="font-bold text-white block">{u.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">Hoạt động: {u.streakDays} ngày</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                            u.role === 'super_admin' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                            u.role === 'educator' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' :
                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}>
                            {u.role === 'super_admin' ? '👑 Super Admin' : u.role === 'educator' ? '⭐ Giảng viên' : 'Học viên'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                          {u.rating || 1500} ({u.rankClass || 'Pupil'})
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-sans">{u.lastLoginAt || 'Hôm nay'}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleToggleUserRole(u.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-rose-400 hover:text-white transition-colors cursor-pointer"
                            title="Chuyển đổi vai trò: Student -> Educator -> Super Admin"
                          >
                            Đổi vai trò
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 5: AUDIT LOGS & ROW LEVEL SECURITY               */}
          {/* ======================================================== */}
          {activeSection === 'audit' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Chính Sách Bảo Mật Cấp Hàng (Supabase RLS Status)</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Toàn bộ bảng dữ liệu nhạy cảm (<code className="text-rose-400">problem_testcases</code>, <code className="text-rose-400">submissions.code</code>) được bảo vệ bằng chính sách RLS. Người dùng nặc danh không thể truy vấn trái phép dữ liệu ẩn.
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs font-mono">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> RLS Enabled: ON
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-indigo-400">Domain Whitelist: Toàn bộ Email Google hợp lệ</span>
                </div>
              </div>

              {/* Audit Trail Timeline */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Nhật Ký Hành Động Quản Trị (Immutable Audit Trail)
                </h4>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-emerald-400 font-bold">[LOGIN_SUCCESS]</span> Google SSO Auth: <strong className="text-white">admin.truong@ahtest.code</strong> (IP: 14.232.208.12)
                    </div>
                    <span className="text-slate-500 text-[11px]">Vừa xong</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-indigo-400 font-bold">[REJUDGE_ALL]</span> Kích hoạt re-judge 412 bài nộp bài toán [torch]
                    </div>
                    <span className="text-slate-500 text-[11px]">2 phút trước</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-amber-400 font-bold">[TESTCASE_UPDATE]</span> Đổi cờ bảo mật RLS sang Hidden cho Test #3 [torch]
                    </div>
                    <span className="text-slate-500 text-[11px]">15 phút trước</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
