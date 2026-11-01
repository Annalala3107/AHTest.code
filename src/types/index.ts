export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export interface SampleCase {
  input: string;
  output: string;
  explanation?: string;
}

export interface Subtask {
  id: number;
  points: number;
  description: string;
}

export interface TestCaseItem {
  id?: number;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
  weight?: number;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  points: number;
  timeLimit: number; // in seconds
  memoryLimit: number; // in MB
  tags: string[];
  solvedCount: number;
  totalSubmissions: number;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  samples: SampleCase[];
  subtasks?: Subtask[];
  editorial?: string;
  author: string;
  source: string;
  createdAt: string;
  testcases?: TestCaseItem[];
  isCustom?: boolean;
  collectionId?: string;
  progressiveHints?: ProgressiveHint[];
}

export interface ProgressiveHint {
  tier: 1 | 2 | 3;
  title: string;
  content: string;
}

export interface ProblemCollection {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  category: string;
  icon: string;
  color: 'rose' | 'amber' | 'emerald' | 'blue' | 'purple' | 'cyan';
  difficultySummary: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  isSystem?: boolean;
  problems: Problem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamSessionConfig {
  collectionId: string;
  collectionTitle: string;
  totalQuestions: number; // 10 to 20
  timeLimitMinutes: number; // 45, 60, 90
  problems: Problem[];
}

export interface ExamQuestionState {
  problemId: string;
  code: string;
  status: 'unattempted' | 'in_progress' | 'passed' | 'failed';
  score: number; // 0 to 100
  testResults: TestResult[];
  lastRunStdout?: string;
  lastRunStderr?: string;
}

export interface ExamScorecard {
  examId: string;
  collectionTitle: string;
  totalQuestions: number;
  passedQuestions: number;
  totalScore: number; // 0 to 10.0 scale
  timeSpentSeconds: number;
  timeLimitSeconds: number;
  submittedAt: string;
  questionDetails: {
    questionIndex: number;
    title: string;
    difficulty: Difficulty;
    status: 'passed' | 'failed' | 'unattempted';
    score: number;
    passedTests: number;
    totalTests: number;
  }[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export type Verdict = 'AC' | 'WA' | 'TLE' | 'MLE' | 'RTE' | 'CE' | 'PENDING' | 'GRADING';

export interface TestResult {
  testId: number;
  verdict: Verdict;
  time: number; // in ms
  memory: number; // in KB
  score: number;
  maxScore: number;
  message?: string;
  isHidden?: boolean;
  testName?: string;
  input?: string;
  actualOutput?: string;
  expectedOutput?: string;
}

export interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  problemSlug: string;
  user: {
    username: string;
    fullName: string;
    rating: number;
    rankClass: string;
  };
  language: string;
  verdict: Verdict;
  score: number;
  maxScore: number;
  time: number; // in seconds
  memory: number; // in MB
  submittedAt: string;
  code: string;
  tests: TestResult[];
}

export interface ContestProblem {
  code: string;
  slug: string;
  title: string;
  points: number;
  solvedCount: number;
}

export interface Contest {
  id: string;
  slug: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  isRated: boolean;
  status: 'UPCOMING' | 'RUNNING' | 'PAST';
  tags: string[];
  participantsCount: number;
  problems: ContestProblem[];
}

export interface AppliedTestCase {
  input: string;
  expectedOutput: string;
  explanationVi?: string;
  explanationEn?: string;
  isHidden?: boolean;
}

export interface AppliedExercise {
  id: string; // e.g. 'q1', 'q2', 'q12', 'q78', 'q87'
  questionCode: string; // e.g. 'Q001', 'Q002'
  titleVi: string;
  titleEn: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  descriptionVi: string;
  descriptionEn: string;
  initialCode: string;
  solutionCode?: string;
  testcases: AppliedTestCase[];
  hintsVi: string[];
  hintsEn: string[];
}

export interface AcademyLesson {
  id: string;
  title: string;
  titleEn?: string;
  durationMinutes: number;
  summary: string;
  summaryEn?: string;
  content: string; // Markdown / KaTeX (Vietnamese)
  contentEn?: string; // Markdown / KaTeX (English)
  initialCode: string;
  expectedOutputRegex?: string;
  solutionCode: string;
  hints: string[];
  hintsEn?: string[];
  testcases: AppliedTestCase[];
  appliedExercises?: AppliedExercise[];
}

export interface AcademyModule {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  lessons: AcademyLesson[];
}

export interface AcademyCourse {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  language: 'c' | 'cpp' | 'python';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  descriptionEn?: string;
  totalLessons: number;
  estimatedHours: number;
  modules: AcademyModule[];
  isComingSoon?: boolean;
}

export interface ImportedTestCase {
  id: number;
  inputName: string;
  outputName: string;
  inputContent: string;
  outputContent: string;
  sizeBytes: number;
  status: 'VALID' | 'EMPTY' | 'MISMATCH';
}

export interface ProblemPackage {
  title: string;
  slug: string;
  timeLimit: number;
  memoryLimit: number;
  category: string;
  tags: string[];
  difficulty: Difficulty;
  author: string;
  source: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  tests: ImportedTestCase[];
  modelSolutionCpp?: string;
  status: 'DRAFT' | 'VALIDATED' | 'PUBLISHED';
}

export type UserRole = 'super_admin' | 'educator' | 'student';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  provider: 'google' | 'email';
  streakDays: number;
  rating?: number;
  rankClass?: string;
  lastLoginAt?: string;
}

