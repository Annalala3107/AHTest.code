import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { LANGUAGE_LABELS, executeCodeAsync } from '../src/services/executionManager.ts';
import { javaCourse } from '../src/data/academy/javaCourse.ts';
import { sqlCourse } from '../src/data/academy/sqlCourse.ts';
import { fetchProblems, fetchUserProgress } from '../src/services/repositories/problemRepository.ts';
import { submitSolution, fetchRecentSubmissions } from '../src/services/repositories/submissionRepository.ts';
import { fetchLeaderboard } from '../src/services/repositories/leaderboardRepository.ts';
import { fetchContests, registerForContest, fetchContestScoreboard } from '../src/services/repositories/contestRepository.ts';

// Mock localStorage for Node.js test environment
const storageMap = new Map();
globalThis.localStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear(),
  get length() {
    return storageMap.size;
  },
  key: (idx) => Array.from(storageMap.keys())[idx] || null,
};

test('1. Sodium Sort fallback bug is permanently purged from WorkbenchView', () => {
  const workbenchSrc = fs.readFileSync(path.resolve('src/components/WorkbenchView.tsx'), 'utf-8');
  assert.ok(
    !workbenchSrc.includes('mockProblems[0].testcases'),
    'WorkbenchView must NEVER fall back to Sodium Sort (mockProblems[0].testcases)'
  );
  assert.ok(
    !workbenchSrc.includes('mockProblems[0]!.testcases'),
    'WorkbenchView must NEVER fall back to Sodium Sort'
  );
  assert.ok(
    workbenchSrc.includes('problem.samples.map'),
    'WorkbenchView must fall back strictly to problem.samples when testcases are absent'
  );
});

test('2. Human-readable language labels are defined for all supported compilers', () => {
  assert.equal(LANGUAGE_LABELS['c17'], 'C (GCC 11.4)');
  assert.equal(LANGUAGE_LABELS['cpp20'], 'C++20 (G++ 13)');
  assert.equal(LANGUAGE_LABELS['py3'], 'Python 3.11');
  assert.equal(LANGUAGE_LABELS['java'], 'Java 21 (OpenJDK)');
  assert.equal(LANGUAGE_LABELS['sql'], 'PostgreSQL 16 Dialect');
});

test('3. All 6 God Components are decomposed and modularized into focused files', () => {
  const componentPaths = [
    'src/components/WorkbenchView.tsx',
    'src/components/workbench/WorkbenchHeader.tsx',
    'src/components/workbench/WorkbenchLeftPane.tsx',
    'src/components/workbench/WorkbenchConsoleDrawer.tsx',
    'src/components/workbench/ProgressiveHintDrawer.tsx',

    'src/components/AcademyView.tsx',
    'src/components/academy/AcademyBreadcrumbBar.tsx',
    'src/components/academy/AcademyCurriculumSidebar.tsx',
    'src/components/academy/AcademyLessonPane.tsx',
    'src/components/academy/AcademyConsoleDrawer.tsx',
    'src/components/academy/AcademyModals.tsx',

    'src/components/ProblemImporterView.tsx',
    'src/components/importer/CollectionHubView.tsx',
    'src/components/importer/CollectionDetailView.tsx',
    'src/components/importer/CreateCollectionModal.tsx',
    'src/components/importer/ImportProblemModal.tsx',
    'src/components/importer/ExamSetupModal.tsx',
    'src/components/importer/ProblemPreviewModal.tsx',
    'src/components/importer/BatchDocxReviewModal.tsx',

    'src/components/ExamSimulationView.tsx',
    'src/components/exam/ExamHeaderBar.tsx',
    'src/components/exam/ExamQuestionMatrix.tsx',
    'src/components/exam/ExamScorecardModal.tsx',

    'src/components/AdminDashboardView.tsx',
    'src/components/admin/AdminOverviewSection.tsx',
    'src/components/admin/AdminProblemsSection.tsx',
    'src/components/admin/AdminTestcasesSection.tsx',
    'src/components/admin/AdminUsersSection.tsx',
    'src/components/admin/AdminAuditSection.tsx',

    'src/components/VnoiAuthModal.tsx',
    'src/components/auth/AuthLoginForm.tsx',
    'src/components/auth/AuthRegisterForm.tsx',
    'src/components/auth/SupabaseConfigDrawer.tsx',
  ];

  for (const relPath of componentPaths) {
    const fullPath = path.resolve(relPath);
    assert.ok(fs.existsSync(fullPath), `Expected file to exist: ${relPath}`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lineCount = content.split('\n').length;
    assert.ok(
      lineCount <= 650,
      `Expected ${relPath} to be modular (<= 650 lines), got ${lineCount} lines`
    );
  }
});

test('4. Problem Repository falls back gracefully to offline dataset without network', async () => {
  const problems = await fetchProblems();
  assert.ok(Array.isArray(problems) && problems.length > 0, 'fetchProblems must return problem list');
  const slugs = problems.map((p) => p.slug || p.id);
  assert.ok(slugs.includes('torch'), 'Must include torch problem');
  assert.ok(slugs.includes('icpc26_mn_c'), 'Must include icpc26_mn_c problem');

  // Verify progress map
  localStorage.setItem('ahtest_solved_torch', '100');
  const progress = await fetchUserProgress();
  assert.equal(progress['torch']?.status, 'solved');
  assert.equal(progress['torch']?.starScore, 100);
});

test('5. Submission Repository persists solutions locally and returns recent stream', async () => {
  const result = await submitSolution({
    problemId: 'torch',
    language: 'cpp20',
    code: '#include <iostream>\nint main() { return 0; }',
    verdict: 'AC',
    score: 100,
    maxScore: 100,
    timeMs: 15,
    memoryKb: 2048,
    passedTests: 5,
    totalTests: 5,
  });

  assert.ok(result.success, 'submitSolution should succeed');
  assert.ok(result.submissionId.startsWith('sub_'), 'Should return valid submissionId');

  const recents = await fetchRecentSubmissions(5);
  assert.ok(Array.isArray(recents) && recents.length > 0, 'Should return recent submissions list');
  assert.ok(recents.some((s) => s.problemId === 'torch'), 'Should include recent torch submission');
});

test('6. Leaderboard & Contest Repositories return structured data with fallbacks', async () => {
  const leaderboard = await fetchLeaderboard();
  assert.ok(Array.isArray(leaderboard) && leaderboard.length > 0, 'Must return leaderboard list');
  assert.ok(leaderboard[0].rating > 0, 'Top user must have positive rating');

  const contests = await fetchContests();
  assert.ok(Array.isArray(contests) && contests.length > 0, 'Must return contests list');
  const contestSlugs = contests.map((c) => c.slug);
  assert.ok(
    contestSlugs.includes('ahcup26_final') ||
    contestSlugs.includes('icpc_national_2026') ||
    contestSlugs.includes('vnoi_cup_2026')
  );

  const regResult = await registerForContest('test-contest-id', '');
  assert.ok(regResult.success, 'Contest registration should succeed');

  const scoreboard = await fetchContestScoreboard('icpc_national_2026');
  assert.ok(Array.isArray(scoreboard) && scoreboard.length > 0, 'Must return contest scoreboard');
  assert.ok(scoreboard[0].totalScore >= 0, 'Scoreboard entries must have totalScore');
});

test('7. Phase 3 SQL Migration defines contests, collections, progress, and RPCs', () => {
  const sql = fs.readFileSync(
    path.resolve('supabase/migrations/20261119_phase3_real_oj_contests_and_collections.sql'),
    'utf-8'
  );

  assert.ok(sql.includes('problem_collections'), 'Must create problem_collections table');
  assert.ok(sql.includes('contests'), 'Must create contests table');
  assert.ok(sql.includes('contest_problems'), 'Must create contest_problems table');
  assert.ok(sql.includes('contest_registrations'), 'Must create contest_registrations table');
  assert.ok(sql.includes('user_problem_progress'), 'Must create user_problem_progress table');
  assert.ok(sql.includes('problem_comments'), 'Must create problem_comments table');
  assert.ok(sql.includes('audit_logs'), 'Must create audit_logs table');

  // Verify SECURITY DEFINER RPCs
  assert.ok(sql.includes('get_organization_leaderboard()'), 'Must define get_organization_leaderboard RPC');
  assert.ok(sql.includes('get_recent_public_submissions'), 'Must define get_recent_public_submissions RPC');
  assert.ok(sql.includes('get_contest_scoreboard'), 'Must define get_contest_scoreboard RPC');
  assert.ok(sql.includes('admin_list_users_safe()'), 'Must define admin_list_users_safe RPC');
  assert.ok(sql.includes('admin_set_user_role'), 'Must define admin_set_user_role RPC');
});

test('8. Initial Seed Data contains core problems, contests, and official collections', () => {
  const seedSql = fs.readFileSync(path.resolve('supabase/seed_initial_data.sql'), 'utf-8');
  assert.ok(seedSql.includes('icpc26_mn_c'), 'Must seed icpc26_mn_c');
  assert.ok(seedSql.includes('torch'), 'Must seed torch');
  assert.ok(seedSql.includes('voi26_pine'), 'Must seed voi26_pine');
  assert.ok(seedSql.includes('olp_ct25_lgsqr'), 'Must seed olp_ct25_lgsqr');
  assert.ok(seedSql.includes('icpc_national_2026'), 'Must seed icpc_national_2026 contest');
  assert.ok(seedSql.includes('col_national_olympiad'), 'Must seed col_national_olympiad collection');
});

test('9. Academy Java and SQL courses are unlocked and every lesson solution passes its testcases', async () => {
  assert.equal(javaCourse.isComingSoon, false, 'javaCourse must be unlocked');
  assert.equal(sqlCourse.isComingSoon, false, 'sqlCourse must be unlocked');

  const academyIndexSrc = fs.readFileSync(path.resolve('src/data/academy/index.ts'), 'utf-8');
  assert.ok(academyIndexSrc.includes('javaCourse') && academyIndexSrc.includes('sqlCourse'));

  for (const mod of javaCourse.modules) {
    for (const lesson of mod.lessons) {
      for (const tc of lesson.testcases || []) {
        const res = await executeCodeAsync('java', lesson.solutionCode, tc.input);
        assert.equal(res.status, 'SUCCESS', `Java lesson ${lesson.id} failed: ${res.stderr}`);
        assert.equal(
          res.stdout.replace(/\r\n/g, '\n').trim(),
          tc.expectedOutput.replace(/\r\n/g, '\n').trim(),
          `Java lesson ${lesson.id} output mismatch`
        );
      }
    }
  }

  for (const mod of sqlCourse.modules) {
    for (const lesson of mod.lessons) {
      for (const tc of lesson.testcases || []) {
        const res = await executeCodeAsync('sql', lesson.solutionCode, tc.input);
        assert.equal(res.status, 'SUCCESS', `SQL lesson ${lesson.id} failed: ${res.stderr}`);
        assert.equal(
          res.stdout.replace(/\r\n/g, '\n').trim(),
          tc.expectedOutput.replace(/\r\n/g, '\n').trim(),
          `SQL lesson ${lesson.id} output mismatch`
        );
      }
    }
  }
});

test('10. WorkbenchView renders ProgressiveHintDrawer as a visible right slide-over drawer', () => {
  const workbenchSrc = fs.readFileSync(path.resolve('src/components/WorkbenchView.tsx'), 'utf-8');
  assert.ok(
    workbenchSrc.includes('<ProgressiveHintDrawer') && workbenchSrc.includes('justify-end'),
    'WorkbenchView must render ProgressiveHintDrawer inside a right slide-over overlay drawer'
  );
});
