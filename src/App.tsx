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

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [activeExamSession, setActiveExamSession] = useState<ExamSessionConfig | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ahtest_theme');
    if (saved !== null) return saved === 'dark';
    return true; // Default to dark on initial visit
  });
  const [streakCount] = useState<number>(7);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Current authenticated user (synced with localStorage & Google SSO)
  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    try {
      const saved = localStorage.getItem('ahtest_auth_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      id: 'usr_admin_01',
      name: 'Trương Quốc Anh',
      email: 'admin.truong@ahtest.code',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      role: 'super_admin',
      provider: 'google',
      streakDays: 45,
      rating: 2450,
      rankClass: 'Grandmaster'
    };
  });

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
    setSelectedProblem(problem);
  };

  const handleBackFromWorkbench = () => {
    setSelectedProblem(null);
  };

  const handleSelectTab = (tab: NavTab) => {
    setSelectedProblem(null);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    const guestUser: AuthUser = {
      id: 'usr_guest',
      name: 'Khách',
      email: 'guest@ahtest.code',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest',
      role: 'student',
      provider: 'email',
      streakDays: 0,
      rating: 1200,
      rankClass: 'Newbie'
    };
    setCurrentUser(guestUser);
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
              <AdminDashboardView
                currentUser={currentUser}
                onNavigateTab={handleSelectTab}
                onOpenAuthModal={() => handleOpenAuthModal('login')}
              />
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
