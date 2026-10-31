import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ProblemsView } from './components/ProblemsView';
import { WorkbenchView } from './components/WorkbenchView';
import { AcademyView } from './components/AcademyView';
import { ProblemImporterView } from './components/ProblemImporterView';
import { ContestsView } from './components/ContestsView';
import { LeaderboardView } from './components/LeaderboardView';
import { Problem } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ahtest_theme');
    if (saved !== null) return saved === 'dark';
    return true; // Default to dark on initial visit
  });
  const [streakCount] = useState<number>(7);

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        currentTab={selectedProblem ? ('problems' as NavTab) : currentTab}
        onSelectTab={handleSelectTab}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        streakCount={streakCount}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            {currentTab === 'importer' && <ProblemImporterView />}
            {currentTab === 'contests' && <ContestsView />}
            {currentTab === 'leaderboard' && <LeaderboardView />}
          </>
        )}
      </main>

      {/* Footer (hidden on Workbench split mode to maximize vertical space) */}
      {!selectedProblem && <Footer />}
    </div>
  );
}

export default App;
