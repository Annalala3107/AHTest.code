import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ProblemsView } from './components/ProblemsView';
import { WorkbenchView } from './components/WorkbenchView';
import { AcademyView } from './components/AcademyView';
import { ProblemImporterView } from './components/ProblemImporterView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { ExamSimulationView } from './components/ExamSimulationView';
import { AuthModal } from './components/AuthModal';
import { Problem, AuthUser, ExamSessionConfig } from './types';
import { getStreakState } from './services/streakService';
import { getStoredAuthUser, GUEST_USER } from './services/authService';
import { setupSupabaseAuthListener, signOutSupabase } from './services/supabaseAuth';
import { mockProblems } from './data/mockProblems';
import { Shield } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [problemContextList, setProblemContextList] = useState<Problem[]>([]);
  const [collectionTitle, setCollectionTitle] = useState<string | undefined>(undefined);
  const [activeExamSession, setActiveExamSession] = useState<ExamSessionConfig | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ahtest_theme');
    if (saved !== null) return saved === 'dark';
    return true; // Default to dark on initial visit
  });
  const [streakCount, setStreakCount] = useState<number>(() => getStreakState().currentStreak);

  // Listen to streak updates from solving problems
  useEffect(() => {
    const handleStreakUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.currentStreak === 'number') {
        setStreakCount(customEvent.detail.currentStreak);
      }
    };
    window.addEventListener('ahtest-streak-updated', handleStreakUpdate);
    return () => {
      window.removeEventListener('ahtest-streak-updated', handleStreakUpdate);
    };
  }, []);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Current authenticated user (Default: GUEST_USER, never hardcode admin)
  const [currentUser, setCurrentUser] = useState<AuthUser>(() => getStoredAuthUser());

  // Listen for Supabase OAuth redirects and restore authenticated session
  useEffect(() => {
    const unsubscribe = setupSupabaseAuthListener(
      (user) => {
        setCurrentUser(user);
        localStorage.setItem('ahtest_auth_user', JSON.stringify(user));
      },
      () => {
        setCurrentUser(GUEST_USER);
        localStorage.removeItem('ahtest_auth_user');
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  // Synchronize dark mode class on HTML element and persist preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ahtest_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ahtest_theme', 'light');
    }
  }, [isDarkMode]);

  const handleSelectProblem = (problem: Problem, problemList?: Problem[], collTitle?: string) => {
    setSelectedProblem(problem);
    if (problemList && problemList.length > 0) {
      setProblemContextList(problemList);
    } else {
      const fallback = mockProblems.some(p => p.id === problem.id) ? mockProblems : [problem, ...mockProblems];
      setProblemContextList(fallback);
    }
    setCollectionTitle(collTitle || 'Kho Bài Tập Tiêu Chuẩn');
  };

  const handleBackFromWorkbench = () => {
    setSelectedProblem(null);
  };

  const currentProblemIndex = problemContextList.findIndex(p => p.id === selectedProblem?.id);
  const hasNextProblem = currentProblemIndex >= 0 && currentProblemIndex < problemContextList.length - 1;

  const handleNextProblem = () => {
    if (hasNextProblem) {
      setSelectedProblem(problemContextList[currentProblemIndex + 1]);
    }
  };

  const handleSelectTab = (tab: NavTab) => {
    setSelectedProblem(null);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    signOutSupabase();
    setCurrentUser(GUEST_USER);
    localStorage.removeItem('ahtest_auth_user');
  };

  const handleOpenAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('ahtest_auth_user', JSON.stringify(user));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        currentTab={selectedProblem ? ('problems' as NavTab) : currentTab}
        onSelectTab={handleSelectTab}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        streakCount={streakCount}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      {/* Main View Container: Full viewport edge-to-edge for IDE Workspaces and Admin, max-w-7xl for browsing */}
      <main className={`flex-1 w-full ${selectedProblem || currentTab === 'academy' || currentTab === 'admin' ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        {selectedProblem ? (
          <WorkbenchView
            problem={selectedProblem}
            onBack={handleBackFromWorkbench}
            onNextProblem={handleNextProblem}
            hasNextProblem={hasNextProblem}
            collectionTitle={collectionTitle}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeView
                onSelectProblem={handleSelectProblem}
                onNavigateTab={handleSelectTab}
                streakCount={streakCount}
              />
            )}
            {currentTab === 'problems' && (
              <ProblemsView onSelectProblem={handleSelectProblem} />
            )}
            {currentTab === 'academy' && <AcademyView />}
            {currentTab === 'importer' && (
              <ProblemImporterView 
                onSelectProblem={handleSelectProblem} 
                onStartExam={(session) => setActiveExamSession(session)}
              />
            )}
            {currentTab === 'admin' && (
              currentUser.role === 'super_admin' ? (
                <AdminDashboardView
                  currentUser={currentUser}
                  onNavigateTab={handleSelectTab}
                  onOpenAuthModal={() => handleOpenAuthModal('login')}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center py-20 px-4">
                  <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto ring-8 ring-rose-50/50 dark:ring-rose-950/20">
                      <Shield className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Khu Vực Quản Trị Hệ Thống</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Bạn cần đăng nhập bằng tài khoản Quản trị viên (Super Admin - <span className="font-mono text-rose-500">Anngoc@.com</span>) để truy cập vào phân hệ này.
                    </p>
                    <button
                      onClick={() => handleOpenAuthModal('login')}
                      className="w-full py-3 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                    >
                      Đăng nhập Quản trị viên
                    </button>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* Google SSO & Email Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalMode}
      />

      {/* Live Exam Simulation Workspace Modal / Overlay */}
      {activeExamSession && (
        <ExamSimulationView
          session={activeExamSession}
          onExit={() => setActiveExamSession(null)}
        />
      )}

      {/* Footer (hidden on Workbench, Academy and Admin split mode to maximize vertical space) */}
      {!selectedProblem && currentTab !== 'academy' && currentTab !== 'admin' && <Footer />}
    </div>
  );
}

export default App;
