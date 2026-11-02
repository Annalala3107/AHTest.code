import React, { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { Navbar, NavTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ProblemsView } from './components/ProblemsView';
import { ViewLoadingFallback } from './components/ViewLoadingFallback';
import { Problem, AuthUser, ExamSessionConfig } from './types';
import { getStreakState } from './services/streakService';
import { findProblemById } from './services/problemResolver';

// Default system administrator account for open access
const SYSTEM_ADMIN: AuthUser = {
  id: 'usr_admin',
  name: 'Quản trị viên',
  email: 'admin@ahtest.code',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
  role: 'super_admin',
  provider: 'email',
  streakDays: 30,
  rating: 2400,
  rankClass: 'Grandmaster'
};

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        streakCount={streakCount}
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
              <Suspense fallback={<ViewLoadingFallback />}>
                <AdminDashboardView
                  currentUser={SYSTEM_ADMIN}
                  onNavigateTab={handleSelectTab}
                />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

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
