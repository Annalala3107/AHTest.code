import React, { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { Navbar, NavTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ProblemsView } from './components/ProblemsView';
import { ViewLoadingFallback } from './components/ViewLoadingFallback';
import { AuthModal } from './components/AuthModal';
import { Problem, AuthUser, ExamSessionConfig } from './types';
import { getStreakState } from './services/streakService';
import { GUEST_USER } from './services/authService';
import { setupSupabaseAuthListener, signOutSupabase } from './services/supabaseAuth';
import { findProblemById } from './services/problemResolver';
import { Shield } from 'lucide-react';

// Lazy-loaded heavy views for on-demand code-splitting
const WorkbenchView = lazy(() =>
  import('./components/WorkbenchView').then((m) => ({ default: m.WorkbenchView }))
);
const AcademyView = lazy(() =>
  import('./components/AcademyView').then((m) => ({ default: m.AcademyView }))
);
const ProblemImporterView = lazy(() =>
  import('./components/ProblemImporterView').then((m) => ({ default: m.ProblemImporterView }))
);
const AdminDashboardView = lazy(() =>
  import('./components/AdminDashboardView').then((m) => ({ default: m.AdminDashboardView }))
);
const ExamSimulationView = lazy(() =>
  import('./components/ExamSimulationView').then((m) => ({ default: m.ExamSimulationView }))
);

function WorkbenchRouteWrapper() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();

  const resolved = useMemo(() => {
    return problemId ? findProblemById(problemId) : null;
  }, [problemId]);

  if (!resolved) {
    return <Navigate to="/problems" replace />;
  }

  const { problem, collectionTitle, contextList } = resolved;
  const currentIdx = contextList.findIndex((p) => p.id === problem.id);
  const hasNext = currentIdx >= 0 && currentIdx < contextList.length - 1;

  const handleNext = () => {
    if (hasNext) {
      const nextProblem = contextList[currentIdx + 1];
      navigate(`/problems/${nextProblem.id}`);
    }
  };

  return (
    <Suspense fallback={<ViewLoadingFallback />}>
      <WorkbenchView
        problem={problem}
        onBack={() => navigate('/problems')}
        onNextProblem={handleNext}
        hasNextProblem={hasNext}
        collectionTitle={collectionTitle}
      />
    </Suspense>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const isWorkbenchActive = location.pathname.startsWith('/problems/') && location.pathname !== '/problems';
  const isAcademyActive = location.pathname.startsWith('/academy');
  const isAdminActive = location.pathname.startsWith('/admin');

  // Derive active NavTab from current URL pathname
  const currentTab: NavTab = useMemo(() => {
    if (location.pathname.startsWith('/problems')) return 'problems';
    if (location.pathname.startsWith('/academy')) return 'academy';
    if (location.pathname.startsWith('/importer')) return 'importer';
    if (location.pathname.startsWith('/admin')) return 'admin';
    return 'home';
  }, [location.pathname]);

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
  const [currentUser, setCurrentUser] = useState<AuthUser>(GUEST_USER);

  // Listen for Supabase OAuth redirects and restore authenticated session
  useEffect(() => {
    const unsubscribe = setupSupabaseAuthListener(
      (user) => {
        setCurrentUser(user);
      },
      () => {
        setCurrentUser(GUEST_USER);
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

  const handleSelectProblem = (problem: Problem) => {
    navigate(`/problems/${problem.id}`);
  };

  const handleSelectTab = (tab: NavTab) => {
    const tabRoutes: Record<NavTab, string> = {
      home: '/',
      problems: '/problems',
      academy: '/academy',
      importer: '/importer',
      admin: '/admin',
      contests: '/problems',
      leaderboard: '/problems',
    };
    navigate(tabRoutes[tab] || '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    signOutSupabase();
    setCurrentUser(GUEST_USER);
  };

  const handleOpenAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        streakCount={streakCount}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      {/* Main View Container */}
      <main
        className={`flex-1 w-full ${
          isWorkbenchActive || isAcademyActive || isAdminActive
            ? ''
            : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
        }`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <HomeView
                onSelectProblem={handleSelectProblem}
                onNavigateTab={handleSelectTab}
                streakCount={streakCount}
              />
            }
          />
          <Route
            path="/problems"
            element={<ProblemsView onSelectProblem={handleSelectProblem} />}
          />
          <Route path="/problems/:problemId" element={<WorkbenchRouteWrapper />} />
          <Route
            path="/academy"
            element={
              <Suspense fallback={<ViewLoadingFallback />}>
                <AcademyView />
              </Suspense>
            }
          />
          <Route
            path="/importer"
            element={
              <Suspense fallback={<ViewLoadingFallback />}>
                <ProblemImporterView
                  onSelectProblem={handleSelectProblem}
                  onStartExam={(session) => setActiveExamSession(session)}
                />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              currentUser.role === 'super_admin' ? (
                <Suspense fallback={<ViewLoadingFallback />}>
                  <AdminDashboardView
                    currentUser={currentUser}
                    onNavigateTab={handleSelectTab}
                    onOpenAuthModal={() => handleOpenAuthModal('login')}
                  />
                </Suspense>
              ) : (
                <div className="flex-1 flex items-center justify-center py-20 px-4">
                  <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto ring-8 ring-rose-50/50 dark:ring-rose-950/20">
                      <Shield className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Khu Vực Quản Trị Hệ Thống
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Bạn cần đăng nhập bằng tài khoản Quản trị viên (Super Admin) được phân quyền bảo
                      mật trong hệ thống để truy cập vào phân hệ này.
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
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
        <Suspense fallback={<ViewLoadingFallback />}>
          <ExamSimulationView
            session={activeExamSession}
            onExit={() => setActiveExamSession(null)}
          />
        </Suspense>
      )}

      {/* Footer */}
      {!isWorkbenchActive && !isAcademyActive && !isAdminActive && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
