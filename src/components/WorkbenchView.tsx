import React, { useState, useRef, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Send, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles, 
  FileText, 
  Clock, 
  MessageSquare, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp,
  Terminal, 
  Lock, 
  Save,
  PanelLeftClose,
  PanelLeft,
  Maximize2,
  Minimize2,
  Trash2,
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  Star,
  ArrowRight,
  ShieldAlert,
  BookOpen,
  FolderGit2,
  Code2
} from 'lucide-react';
import { Problem, Verdict, TestResult } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';
import { DiffViewer } from './DiffViewer';
import { executeCCode, ExecutionResult, PedagogicalDiagnosis, generatePedagogicalDiagnosis } from '../services/cExecutionEngine';
import { resolveProgressiveHints } from '../services/progressiveHintService';
import { ProblemSpecificationView } from './ProblemSpecificationView';
import { getProblemTitle } from '../services/problemBilingualService';
import { CodeEditor } from './CodeEditor';
import { recordStreakActivity } from '../services/streakService';

interface WorkbenchViewProps {
  problem: Problem;
  onBack: () => void;
  onNextProblem?: () => void;
  hasNextProblem?: boolean;
  collectionTitle?: string;
}

export const WorkbenchView: React.FC<WorkbenchViewProps> = ({ 
  problem, 
  onBack,
  onNextProblem,
  hasNextProblem = false,
  collectionTitle
}) => {
  const [activeTab, setActiveTab] = useState<'statement' | 'editorial' | 'submissions' | 'comments'>('statement');
  const [language, setLanguage] = useState<'c17' | 'cpp20' | 'cpp17' | 'py3' | 'java' | 'rust'>('cpp20');
  const [copiedSample, setCopiedSample] = useState<number | null>(null);

  // Bilingual state (VI / EN)
  const [docLang, setDocLang] = useState<'vi' | 'en'>(() => {
    return (localStorage.getItem('ahtest_doc_lang') as 'vi' | 'en') || 'vi';
  });

  const handleToggleLang = (lang: 'vi' | 'en') => {
    setDocLang(lang);
    try {
      localStorage.setItem('ahtest_doc_lang', lang);
    } catch {
      // ignore
    }
  };

  // Code editor state
  const defaultCodes: Record<string, string> = {
    c17: `#include <stdio.h>
#include <stdlib.h>

// Problem: ${problem.title} (${problem.slug})
// Environment: C17 (GCC 16.2 / Embarcadero Dev-C++ Standard)

int main() {
    // TODO: Viết thuật toán giải bằng ngôn ngữ C tại đây
    
    return 0;
}`,
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Problem: ${problem.title} (${problem.slug})
// Time Limit: ${problem.timeLimit}s, Memory Limit: ${problem.memoryLimit}MB

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // TODO: Viết thuật toán giải tại đây
    
    return 0;
}`,
    cpp17: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    // Code C++17
    return 0;
}`,
    py3: `import sys

def solve():
    input = sys.stdin.readline
    # Đọc dữ liệu và xử lý thuật toán
    pass

if __name__ == '__main__':
    solve()`,
    java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        // Code Java
    }
}`,
    rust: `use std::io::{self, BufRead};

fn main() {
    // Rust CP Solution
}`
  };

  const [code, setCode] = useState<string>(defaultCodes['cpp20']);
  const [customInput, setCustomInput] = useState<string>(problem.samples[0]?.input || '');
  const [customOutput, setCustomOutput] = useState<string>('');
  const [customExpected, setCustomExpected] = useState<string>('');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [splitPercent, setSplitPercent] = useState<number>(() => {
    return Number(localStorage.getItem('ahtest_workbench_split')) || 50;
  });
  const [isLgScreen, setIsLgScreen] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });
  const [mobileActiveTab, setMobileActiveTab] = useState<'statement' | 'editor'>('statement');

  useEffect(() => {
    const handleResize = () => {
      setIsLgScreen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [isDraggingSplitter, setIsDraggingSplitter] = useState<boolean>(false);
  const [consoleHeight, setConsoleHeight] = useState<number>(() => {
    const saved = localStorage.getItem('ahtest_workbench_console_height');
    return saved ? Math.max(36, Math.min(650, Number(saved))) : 260;
  });
  const [showConsole, setShowConsole] = useState<boolean>(true);
  const [consoleTab, setConsoleTab] = useState<'testcase' | 'custom' | 'result'>('testcase');
  const [isDraggingConsole, setIsDraggingConsole] = useState<boolean>(false);
  const [isConsoleMaximized, setIsConsoleMaximized] = useState<boolean>(false);
  const [customExecResult, setCustomExecResult] = useState<ExecutionResult | null>(null);
  const [pedagogicalDiagnosis, setPedagogicalDiagnosis] = useState<PedagogicalDiagnosis | null>(null);
  const workspaceContainerRef = useRef<HTMLDivElement>(null);
  const editorColumnRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<any>(null);

  // Jump to specific line and column in Monaco Editor
  const jumpToLine = (line: number, col: number = 1) => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.revealLineInCenter(line);
      monacoEditorRef.current.setPosition({ lineNumber: line, column: col });
      monacoEditorRef.current.focus();
    }
  };

  // Helper to extract diagnostic line/column from compiler error message
  const parseDiagnosticError = (output: string) => {
    if (!output) return null;
    const match = output.match(/(?:solution\.c)?:?(\d+):(\d+):\s*(error|warning)/i) || output.match(/:(\d+):(\d+):/);
    if (match) {
      return {
        line: parseInt(match[1], 10),
        col: parseInt(match[2], 10),
      };
    }
    const lineMatch = output.match(/dòng\s*(\d+)/i) || output.match(/line\s*(\d+)/i);
    if (lineMatch) {
      return {
        line: parseInt(lineMatch[1], 10),
        col: 1,
      };
    }
    return null;
  };

  // Dragging handler for smooth 2-panel splitter and vertical console splitter
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 1. Horizontal Left/Right Workspace Splitter
      if (isDraggingSplitter && workspaceContainerRef.current) {
        const rect = workspaceContainerRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const newPercent = Math.min(Math.max((offsetX / rect.width) * 100, 20), 80);
        setSplitPercent(Math.round(newPercent));
        localStorage.setItem('ahtest_workbench_split', String(Math.round(newPercent)));
      }

      // 2. Vertical Up/Down Console Splitter
      if (isDraggingConsole && editorColumnRef.current) {
        const rect = editorColumnRef.current.getBoundingClientRect();
        const newHeight = rect.bottom - e.clientY;
        const maxHeight = Math.max(100, rect.height - 100);
        const clamped = Math.max(36, Math.min(maxHeight, newHeight));
        setConsoleHeight(Math.round(clamped));
        if (clamped > 36 && !showConsole) {
          setShowConsole(true);
        }
        if (isConsoleMaximized) {
          setIsConsoleMaximized(false);
        }
        localStorage.setItem('ahtest_workbench_console_height', Math.round(clamped).toString());
      }
    };

    const handleMouseUp = () => {
      if (isDraggingSplitter) setIsDraggingSplitter(false);
      if (isDraggingConsole) setIsDraggingConsole(false);
    };

    if (isDraggingSplitter || isDraggingConsole) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSplitter, isDraggingConsole, showConsole, isConsoleMaximized]);

  // Helper for unique localStorage draft key per problem & language
  const getWorkbenchDraftKey = (probId: string, lang: string) => {
    return `ahtest_draft_workbench_${probId}_${lang}`;
  };

  const [draftSaved, setDraftSaved] = useState<boolean>(false);
  const gradingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sampleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to immediately flush any pending draft to localStorage
  const flushPendingDraft = (curCode?: string) => {
    if (debounceSaveRef.current) {
      clearTimeout(debounceSaveRef.current);
      debounceSaveRef.current = null;
    }
    const targetCode = curCode !== undefined ? curCode : code;
    const key = getWorkbenchDraftKey(problem.id, language);
    try {
      localStorage.setItem(key, targetCode);
      setDraftSaved(true);
    } catch {
      // ignore
    }
  };

  // Cleanup timers on problem change or unmount to eliminate memory leaks and race conditions
  useEffect(() => {
    setMobileActiveTab('statement');
    return () => {
      if (gradingTimerRef.current) {
        clearInterval(gradingTimerRef.current);
        gradingTimerRef.current = null;
      }
      if (sampleTimerRef.current) {
        clearTimeout(sampleTimerRef.current);
        sampleTimerRef.current = null;
      }
      if (debounceSaveRef.current) {
        clearTimeout(debounceSaveRef.current);
        debounceSaveRef.current = null;
      }
    };
  }, [problem.id]);

  // Load draft on mount / problem or lang change
  useEffect(() => {
    const key = getWorkbenchDraftKey(problem.id, language);
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      setCode(saved);
      setDraftSaved(true);
    } else {
      setCode(defaultCodes[language] || '');
      setDraftSaved(false);
    }
  }, [problem.id, language]);

  // Debounced auto-save (400ms) for smooth 60fps typing without disk thrashing
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setDraftSaved(false);

    if (debounceSaveRef.current) {
      clearTimeout(debounceSaveRef.current);
    }
    debounceSaveRef.current = setTimeout(() => {
      const key = getWorkbenchDraftKey(problem.id, language);
      try {
        localStorage.setItem(key, newCode);
        setDraftSaved(true);
      } catch {
        // ignore
      }
      debounceSaveRef.current = null;
    }, 400);
  };

  const handleResetCode = () => {
    if (debounceSaveRef.current) {
      clearTimeout(debounceSaveRef.current);
      debounceSaveRef.current = null;
    }
    const key = getWorkbenchDraftKey(problem.id, language);
    localStorage.removeItem(key);
    setCode(defaultCodes[language] || '');
    setDraftSaved(false);
  };
  
  // Grading & Execution State
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradingProgress, setGradingProgress] = useState<number>(0);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [selectedTestResult, setSelectedTestResult] = useState<TestResult | null>(null);
  const [finalVerdict, setFinalVerdict] = useState<Verdict | null>(null);
  const [aiHint, setAiHint] = useState<string | null>(null);

  // Progressive Hints & Mastery Star System (Deep Practice Mode)
  const progressiveHints = useMemo(() => resolveProgressiveHints(problem), [problem]);
  const [isHintDrawerOpen, setIsHintDrawerOpen] = useState<boolean>(false);
  const [unlockedHintTier, setUnlockedHintTier] = useState<number>(() => {
    const saved = localStorage.getItem(`ahtest_hint_tier_${problem.id}`);
    return saved ? Number(saved) : 0;
  });
  const [copiedTier3Code, setCopiedTier3Code] = useState<boolean>(false);

  // Sync unlocked hint tier when problem changes
  useEffect(() => {
    const saved = localStorage.getItem(`ahtest_hint_tier_${problem.id}`);
    setUnlockedHintTier(saved ? Number(saved) : 0);
    setIsHintDrawerOpen(false);
  }, [problem.id]);

  // Keyboard shortcut: Shift + Enter to go to next problem when AC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'Enter' && finalVerdict === 'AC' && hasNextProblem && onNextProblem) {
        e.preventDefault();
        onNextProblem();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [finalVerdict, hasNextProblem, onNextProblem]);

  const handleUnlockHintTier = (tier: number) => {
    if (tier > unlockedHintTier) {
      setUnlockedHintTier(tier);
      localStorage.setItem(`ahtest_hint_tier_${problem.id}`, String(tier));
    }
  };

  const getMasteryRating = (tier: number) => {
    if (tier === 0) {
      return {
        stars: 3,
        badge: '⭐⭐⭐ Tự Lực 100%',
        title: 'Bậc Thầy Thuật Toán (Tự Lực Đỉnh Cao)',
        description: 'Bạn đã độc lập giải quyết bài toán và vượt qua 100% test cases mà không cần bất kỳ gợi ý nào!',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/30',
        bgColor: 'bg-amber-500/10'
      };
    }
    if (tier === 1 || tier === 2) {
      return {
        stars: 2,
        badge: '⭐⭐ Khá Giỏi (Gợi Ý Tư Duy)',
        title: 'Hiểu Sâu Bản Chất (Tiếp Thu Nhanh)',
        description: 'Bạn đã tận dụng tốt gợi ý thuật toán / cảnh báo bẫy ngầm và tự tay cài đặt thuật toán chuẩn xác.',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        bgColor: 'bg-emerald-500/10'
      };
    }
    return {
      stars: 1,
      badge: '⭐ Đã Thông Suốt',
      title: 'Học Qua Khung Mã Giả (Xây Dựng Nền Móng)',
      description: 'Bạn đã tham khảo khung mã giả để vượt qua bế tắc cú pháp. Hãy thử làm thêm bài tương tự tự lực nhé!',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-500/10'
    };
  };

  const handleCopyTier3Code = (scaffoldText: string) => {
    navigator.clipboard.writeText(scaffoldText);
    setCopiedTier3Code(true);
    setTimeout(() => setCopiedTier3Code(false), 2000);
  };

  const handleCopySample = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSample(index);
    setTimeout(() => setCopiedSample(null), 2000);
  };

  const handleRunSample = () => {
    if (isGrading) return; // Prevent spam clicks
    flushPendingDraft();
    if (!isLgScreen) setMobileActiveTab('editor');
    if (sampleTimerRef.current) clearTimeout(sampleTimerRef.current);
    if (gradingTimerRef.current) clearInterval(gradingTimerRef.current);

    setConsoleTab('result');
    setShowConsole(true);
    setIsGrading(true);
    setFinalVerdict(null);
    setTestResults(null);
    setSelectedTestResult(null);
    setPedagogicalDiagnosis(null);

    // Enforce 5,000 character limit
    if (code.length > 5000) {
      setIsGrading(false);
      const diag = generatePedagogicalDiagnosis('CE', 'MAX_CODE_LENGTH_EXCEEDED', code);
      setPedagogicalDiagnosis(diag || null);
      const ceResult: TestResult = {
        testId: 1,
        testName: 'Giới hạn kích thước mã nguồn',
        verdict: 'CE',
        time: 0,
        memory: 0,
        score: 0,
        maxScore: problem.points,
        isHidden: false,
        input: 'Kiểm tra độ dài code',
        actualOutput: `[Lỗi dung lượng: TỐI ĐA 5,000 KÝ TỰ]\nMã nguồn hiện tại chứa ${code.length.toLocaleString('vi-VN')} ký tự, vượt quá giới hạn tối đa 5,000 ký tự.`,
        expectedOutput: 'Dưới 5,000 ký tự'
      };
      setCustomOutput(ceResult.actualOutput || '');
      setTestResults([ceResult]);
      setSelectedTestResult(ceResult);
      setFinalVerdict('CE');
      return;
    }

    sampleTimerRef.current = setTimeout(() => {
      sampleTimerRef.current = null;
      setIsGrading(false);
      const sampleInput = problem.samples[0]?.input ?? (problem.testcases?.[0]?.input || '');
      const sampleOutput = problem.samples[0]?.output ?? (problem.testcases?.[0]?.expectedOutput || '');
      const exec = executeCCode(code, sampleInput);
      setPedagogicalDiagnosis(exec.pedagogicalDiagnosis || null);

      let verdict: 'AC' | 'WA' | 'TLE' | 'RTE' | 'CE' = 'WA';
      if (exec.status === 'CE') verdict = 'CE';
      else if (exec.status === 'RTE') verdict = 'RTE';
      else if (exec.status === 'TLE') verdict = 'TLE';
      else if (exec.stdout.replace(/\r\n/g, '\n').trim() === sampleOutput.replace(/\r\n/g, '\n').trim()) {
        verdict = 'AC';
      }

      if (verdict === 'WA' && !exec.pedagogicalDiagnosis) {
        setPedagogicalDiagnosis({
          category: 'LOGIC',
          badge: 'Chưa đạt (Wrong Answer)',
          title: 'Kết quả in ra (Stdout) chưa khớp với đáp án mẫu',
          explanation: 'Chương trình chạy hoàn tất không bị crash, nhưng nội dung in ra màn hình khác với kết quả mong đợi của ví dụ.',
          suggestion: 'Hãy quan sát Bảng So Sánh Output (Diff Inspector) bên dưới. Chú ý các khoảng trắng thừa, dấu xuống dòng \\n hoặc định dạng số.'
        });
      }

      const singleResult: TestResult = {
        testId: 1,
        testName: 'Sample Case #1 (Ví dụ đề bài)',
        verdict,
        time: exec.executionTimeMs,
        memory: exec.memoryKb,
        score: verdict === 'AC' ? problem.points : 0,
        maxScore: problem.points,
        isHidden: false,
        input: sampleInput,
        actualOutput: exec.status === 'CE' ? exec.stderr : (exec.stdout || '(Không có output ra stdout)'),
        expectedOutput: sampleOutput || '3'
      };

      setCustomOutput(exec.status === 'CE' ? exec.stderr : (exec.stdout || 'Chương trình thực thi không có output.'));
      setTestResults([singleResult]);
      setSelectedTestResult(singleResult);
      setFinalVerdict(verdict);
    }, 350);
  };

  const handleRunSpecificSample = (index: number) => {
    if (isGrading) return; // Prevent spam clicks
    flushPendingDraft();
    if (!isLgScreen) setMobileActiveTab('editor');
    if (sampleTimerRef.current) clearTimeout(sampleTimerRef.current);
    if (gradingTimerRef.current) clearInterval(gradingTimerRef.current);

    setConsoleTab('result');
    setShowConsole(true);
    setIsGrading(true);
    setFinalVerdict(null);
    setTestResults(null);
    setSelectedTestResult(null);
    setPedagogicalDiagnosis(null);

    // Enforce 5,000 character limit
    if (code.length > 5000) {
      setIsGrading(false);
      const diag = generatePedagogicalDiagnosis('CE', 'MAX_CODE_LENGTH_EXCEEDED', code);
      setPedagogicalDiagnosis(diag || null);
      const ceResult: TestResult = {
        testId: index + 1,
        testName: `Kiểm tra dung lượng code`,
        verdict: 'CE',
        time: 0,
        memory: 0,
        score: 0,
        maxScore: problem.points,
        isHidden: false,
        input: 'Kiểm tra độ dài code',
        actualOutput: `[Lỗi dung lượng: TỐI ĐA 5,000 KÝ TỰ]\nMã nguồn hiện tại chứa ${code.length.toLocaleString('vi-VN')} ký tự, vượt quá giới hạn tối đa 5,000 ký tự.`,
        expectedOutput: 'Dưới 5,000 ký tự'
      };
      setCustomOutput(ceResult.actualOutput || '');
      setTestResults([ceResult]);
      setSelectedTestResult(ceResult);
      setFinalVerdict('CE');
      return;
    }

    sampleTimerRef.current = setTimeout(() => {
      sampleTimerRef.current = null;
      setIsGrading(false);
      const sample = problem.samples[index] || (problem.testcases?.[index] ? { input: problem.testcases[index].input, output: problem.testcases[index].expectedOutput } : problem.samples[0]);
      const sampleInput = sample?.input ?? (problem.testcases?.[index]?.input || '');
      const sampleOutput = sample?.output ?? (problem.testcases?.[index]?.expectedOutput || '');
      const exec = executeCCode(code, sampleInput);
      setPedagogicalDiagnosis(exec.pedagogicalDiagnosis || null);

      let verdict: 'AC' | 'WA' | 'TLE' | 'RTE' | 'CE' = 'WA';
      if (exec.status === 'CE') verdict = 'CE';
      else if (exec.status === 'RTE') verdict = 'RTE';
      else if (exec.status === 'TLE') verdict = 'TLE';
      else if (exec.stdout.replace(/\r\n/g, '\n').trim() === sampleOutput.replace(/\r\n/g, '\n').trim()) {
        verdict = 'AC';
      }

      if (verdict === 'WA' && !exec.pedagogicalDiagnosis) {
        setPedagogicalDiagnosis({
          category: 'LOGIC',
          badge: 'Chưa đạt (Wrong Answer)',
          title: 'Kết quả in ra (Stdout) chưa khớp với đáp án mẫu',
          explanation: 'Chương trình chạy hoàn tất không bị crash, nhưng nội dung in ra màn hình khác với kết quả mong đợi của ví dụ.',
          suggestion: 'Hãy quan sát Bảng So Sánh Output (Diff Inspector) bên dưới. Chú ý các khoảng trắng thừa, dấu xuống dòng \\n hoặc định dạng số.'
        });
      }

      const singleResult: TestResult = {
        testId: index + 1,
        testName: `Sample Case #${index + 1} (Ví dụ đề bài)`,
        verdict,
        time: exec.executionTimeMs,
        memory: exec.memoryKb,
        score: verdict === 'AC' ? problem.points : 0,
        maxScore: problem.points,
        isHidden: false,
        input: sample?.input || '',
        actualOutput: exec.status === 'CE' ? exec.stderr : (exec.stdout || '(Không có output ra stdout)'),
        expectedOutput: sample?.output || ''
      };

      setCustomOutput(exec.status === 'CE' ? exec.stderr : (exec.stdout || 'Chương trình thực thi không có output.'));
      setTestResults([singleResult]);
      setSelectedTestResult(singleResult);
      setFinalVerdict(verdict);
    }, 350);
  };

  const handleRunCustomTest = () => {
    if (isGrading) return; // Prevent spam clicks
    flushPendingDraft();
    if (!isLgScreen) setMobileActiveTab('editor');
    setShowConsole(true);
    setConsoleTab('custom');
    setPedagogicalDiagnosis(null);

    // Enforce 5,000 character limit
    if (code.length > 5000) {
      const diag = generatePedagogicalDiagnosis('CE', 'MAX_CODE_LENGTH_EXCEEDED', code);
      setPedagogicalDiagnosis(diag || null);
      setCustomOutput(`[Lỗi dung lượng: TỐI ĐA 5,000 KÝ TỰ]\nMã nguồn hiện tại chứa ${code.length.toLocaleString('vi-VN')} ký tự, vượt quá giới hạn 5,000 ký tự.`);
      return;
    }

    const exec = executeCCode(code, customInput);
    setCustomExecResult(exec);
    setPedagogicalDiagnosis(exec.pedagogicalDiagnosis || null);

    if (exec.status === 'CE') {
      setCustomOutput(exec.stderr);
    } else if (exec.status === 'RTE') {
      setCustomOutput(exec.stderr || exec.stdout || 'Runtime error: Chương trình dừng bất thường');
    } else if (exec.status === 'TLE') {
      setCustomOutput('Time Limit Exceeded: Vượt quá thời gian thực thi cho phép (vòng lặp vô hạn)');
    } else {
      setCustomOutput(exec.stdout || '(Chương trình thực thi thành công nhưng không in gì ra stdout)');
    }
  };

  const handleSubmitSolution = () => {
    if (isGrading) return; // Prevent spam submit clicks
    flushPendingDraft();
    if (!isLgScreen) setMobileActiveTab('editor');
    if (gradingTimerRef.current) clearInterval(gradingTimerRef.current);
    if (sampleTimerRef.current) clearTimeout(sampleTimerRef.current);

    setShowConsole(true);
    setConsoleTab('result');
    setIsGrading(true);
    setGradingProgress(0);
    setFinalVerdict(null);
    setTestResults(null);
    setSelectedTestResult(null);
    setAiHint(null);
    setPedagogicalDiagnosis(null);

    // Enforce 5,000 character limit
    if (code.length > 5000) {
      setIsGrading(false);
      const diag = generatePedagogicalDiagnosis('CE', 'MAX_CODE_LENGTH_EXCEEDED', code);
      setPedagogicalDiagnosis(diag || null);
      const ceResult: TestResult = {
        testId: 1,
        testName: 'Giới hạn kích thước mã nguồn',
        verdict: 'CE',
        time: 0,
        memory: 0,
        score: 0,
        maxScore: 100,
        isHidden: false,
        input: 'Kích thước mã nguồn',
        actualOutput: `[Lỗi dung lượng: TỐI ĐA 5,000 KÝ TỰ]\nMã nguồn hiện tại chứa ${code.length.toLocaleString('vi-VN')} ký tự, vượt quá giới hạn tối đa 5,000 ký tự.`,
        expectedOutput: 'Tối đa 5,000 ký tự'
      };
      setTestResults([ceResult]);
      setSelectedTestResult(ceResult);
      setFinalVerdict('CE');
      return;
    }

    // Check for Compile Error once first
    const syntaxCheck = executeCCode(code, '');
    if (syntaxCheck.status === 'CE') {
      setIsGrading(false);
      setPedagogicalDiagnosis(syntaxCheck.pedagogicalDiagnosis || null);
      const ceResult: TestResult = {
        testId: 1,
        testName: 'Compilation Check',
        verdict: 'CE',
        time: 0,
        memory: 0,
        score: 0,
        maxScore: 100,
        isHidden: false,
        input: 'gcc solution.c',
        actualOutput: syntaxCheck.stderr,
        expectedOutput: 'Biên dịch không lỗi'
      };
      setTestResults([ceResult]);
      setSelectedTestResult(ceResult);
      setFinalVerdict('CE');
      return;
    }

    // Dynamic Testcases: Custom imported testcases OR Default 2-Tier Testcases
    const testDefinitions = (problem.testcases && problem.testcases.length > 0)
      ? problem.testcases.map((tc, idx) => ({
          id: tc.id || (idx + 1),
          testName: tc.isHidden ? `Test ẩn #${idx + 1}` : `Test #${idx + 1}${idx < problem.samples.length ? ' (Mẫu)' : ''}`,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: !!tc.isHidden,
          weight: tc.weight || Math.max(1, Math.round(100 / problem.testcases!.length))
        }))
      : [
          {
            id: 1,
            testName: 'Sample 1',
            input: problem.samples[0]?.input || '5 3\n4 2 1 5 3',
            expectedOutput: problem.samples[0]?.output || '3',
            isHidden: false,
            weight: 20
          },
          {
            id: 2,
            testName: 'Sample 2',
            input: problem.samples[1]?.input || '3 1\n10 1 5',
            expectedOutput: problem.samples[1]?.output || '-1',
            isHidden: false,
            weight: 20
          },
          {
            id: 3,
            testName: 'Hidden Case 3 (Ràng buộc biên K = 0)',
            input: '4 0\n2 2 2 2',
            expectedOutput: '0',
            isHidden: true,
            weight: 20
          },
          {
            id: 4,
            testName: 'Hidden Case 4 (Số âm & Nghịch thế)',
            input: '5 5\n10 8 6 4 2',
            expectedOutput: '10',
            isHidden: true,
            weight: 20
          },
          {
            id: 5,
            testName: 'Hidden Case 5 (Stress Test quy mô lớn)',
            input: '5 2\n1 2 3 4 5',
            expectedOutput: '2',
            isHidden: true,
            weight: 20
          }
        ];

    const mockTotalTests = testDefinitions.length;
    const simulatedTests: TestResult[] = [];

    gradingTimerRef.current = setInterval(() => {
      const currentIdx = simulatedTests.length;
      const tDef = testDefinitions[currentIdx];
      
      const exec = executeCCode(code, tDef.input);
      let verdict: 'AC' | 'WA' | 'TLE' | 'RTE' | 'CE' = 'WA';
      if (exec.status === 'CE') verdict = 'CE';
      else if (exec.status === 'RTE') verdict = 'RTE';
      else if (exec.status === 'TLE') verdict = 'TLE';
      else if (exec.stdout.replace(/\r\n/g, '\n').trim() === tDef.expectedOutput.replace(/\r\n/g, '\n').trim()) {
        verdict = 'AC';
      }

      const mockResult: TestResult = {
        testId: tDef.id,
        testName: tDef.testName,
        verdict,
        time: exec.executionTimeMs,
        memory: exec.memoryKb,
        score: verdict === 'AC' ? tDef.weight : 0,
        maxScore: tDef.weight,
        isHidden: tDef.isHidden,
        input: tDef.isHidden ? '[Test ẩn được bảo vệ]' : tDef.input,
        actualOutput: exec.stdout || exec.stderr,
        expectedOutput: tDef.expectedOutput
      };

      simulatedTests.push(mockResult);
      setTestResults([...simulatedTests]);
      setGradingProgress((simulatedTests.length / mockTotalTests) * 100);

      if (simulatedTests.length === mockTotalTests) {
        if (gradingTimerRef.current) {
          clearInterval(gradingTimerRef.current);
          gradingTimerRef.current = null;
        }
        setIsGrading(false);
        const allAC = simulatedTests.every(t => t.verdict === 'AC');
        const hasCE = simulatedTests.some(t => t.verdict === 'CE');
        const hasRTE = simulatedTests.some(t => t.verdict === 'RTE');
        const hasTLE = simulatedTests.some(t => t.verdict === 'TLE');
        
        let finalV: Verdict = 'WA';
        if (allAC) finalV = 'AC';
        else if (hasCE) finalV = 'CE';
        else if (hasTLE) finalV = 'TLE';
        else if (hasRTE) finalV = 'RTE';

        setFinalVerdict(finalV);
        
        // Auto-select first failing test, or test 1
        const firstFail = simulatedTests.find(t => t.verdict !== 'AC');
        setSelectedTestResult(firstFail || simulatedTests[0]);

        if (firstFail) {
          const failDef = testDefinitions.find(t => t.id === firstFail.testId);
          const failExec = executeCCode(code, failDef?.input || '');
          if (failExec.pedagogicalDiagnosis) {
            setPedagogicalDiagnosis(failExec.pedagogicalDiagnosis);
          } else {
            setPedagogicalDiagnosis({
              category: 'LOGIC',
              badge: 'Chưa đạt (Wrong Answer)',
              title: 'Kết quả in ra (Stdout) chưa khớp với đáp án mẫu',
              explanation: 'Chương trình biên dịch và chạy thành công mà không bị crash, nhưng dữ liệu in ra màn hình khác với kết quả mong đợi của bộ test.',
              suggestion: 'Hãy quan sát Bảng So Sánh Output (Diff Inspector) bên dưới. Chú ý các khoảng trắng thừa, dấu xuống dòng \\n hoặc trường hợp biên.'
            });
          }
        } else {
          setPedagogicalDiagnosis(null);
        }

        if (allAC) {
          recordStreakActivity();
          const rating = getMasteryRating(unlockedHintTier);
          try {
            localStorage.setItem(`ahtest_star_${problem.id}`, String(rating.stars));
          } catch {
            // ignore
          }
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    }, 120);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] w-full bg-slate-50 dark:bg-slate-950">
      {/* Top Workbench Action Bar */}
      <div className="h-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer"
          >
            ← Danh sách bài
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          {collectionTitle && (
            <>
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800/80 text-rose-500 dark:text-rose-400 border border-slate-200 dark:border-slate-700">
                <FolderGit2 className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{collectionTitle}</span>
              </div>
              <span className="hidden lg:inline text-slate-300 dark:text-slate-700">•</span>
            </>
          )}
          <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
            {getProblemTitle(problem, docLang)}
          </h2>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
            {problem.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Bilingual Switcher (VI / EN) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs shadow-2xs">
            <button
              onClick={() => handleToggleLang('vi')}
              className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer flex items-center gap-1 text-[10px] ${
                docLang === 'vi'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Đề bài Tiếng Việt"
            >
              <span>🇻🇳</span>
              <span>VI</span>
            </button>
            <button
              onClick={() => handleToggleLang('en')}
              className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer flex items-center gap-1 text-[10px] ${
                docLang === 'en'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="English Statement"
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>

          {/* Zen Mode Toggle */}
          <button
            onClick={() => setIsZenMode(!isZenMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isZenMode
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={isZenMode ? "Thoát chế độ Zen (Mở lại cửa sổ đề bài)" : "Bật chế độ Zen Code (Mở rộng 100% khung gõ)"}
          >
            {isZenMode ? <PanelLeft className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isZenMode ? 'Hiện Đề' : 'Zen Mode'}</span>
          </button>

          {/* Quick Split Ratio Selector */}
          {!isZenMode && (
            <div className="hidden xl:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setSplitPercent(40)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${splitPercent === 40 ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'hover:text-slate-800 dark:hover:text-slate-200'}`}
                title="Tỷ lệ: Đề bài 40% - Code 60%"
              >
                4:6
              </button>
              <button
                onClick={() => setSplitPercent(50)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${splitPercent === 50 ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'hover:text-slate-800 dark:hover:text-slate-200'}`}
                title="Tỷ lệ: Đề bài 50% - Code 50%"
              >
                5:5
              </button>
              <button
                onClick={() => setSplitPercent(60)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${splitPercent === 60 ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'hover:text-slate-800 dark:hover:text-slate-200'}`}
                title="Tỷ lệ: Đề bài 60% - Code 40%"
              >
                6:4
              </button>
            </div>
          )}

          {/* Progressive 3-Tier Hint Trigger */}
          <button
            onClick={() => {
              const willOpen = !isHintDrawerOpen;
              setIsHintDrawerOpen(willOpen);
              if (willOpen && unlockedHintTier === 0) {
                setUnlockedHintTier(1);
                localStorage.setItem(`ahtest_hint_tier_${problem.id}`, '1');
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isHintDrawerOpen
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-xs'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40'
            }`}
            title="Mở Ngăn Kéo Gợi Ý 3 Tầng (Chống Mất Gốc Ngầm)"
          >
            <Lightbulb className={`w-3.5 h-3.5 ${unlockedHintTier > 0 ? 'text-amber-400' : 'text-indigo-400'}`} />
            <span className="hidden sm:inline">Gợi Ý 3 Tầng</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-black border ${
              unlockedHintTier > 0 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
            }`}>
              {unlockedHintTier === 0 ? 'Mở' : `T${unlockedHintTier}/3`}
            </span>
          </button>

          {/* Next Problem Shortcut in Action Bar */}
          {hasNextProblem && onNextProblem && (
            <button
              onClick={onNextProblem}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 cursor-pointer transition-colors"
              title="Chuyển sang bài tập tiếp theo trong bộ đề (Shift + Enter sau khi AC)"
            >
              <span className="hidden sm:inline">Bài sau</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Run & Submit CTAs with Keyboard Shortcut Badges */}
          <button
            onClick={handleRunSample}
            disabled={isGrading || code.length > 5000}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              code.length > 5000 
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800 opacity-80 cursor-not-allowed' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 cursor-pointer'
            }`}
            title={code.length > 5000 ? `Mã nguồn (${code.length.toLocaleString('vi-VN')} ký tự) vượt quá 5,000 ký tự!` : "Phím tắt: F9"}
          >
            <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>{code.length > 5000 ? 'Quá 5,000 ký tự' : 'Chạy thử'}</span>
            {code.length <= 5000 && (
              <kbd className="hidden sm:inline-block text-[10px] ml-0.5 px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-mono">
                F9
              </kbd>
            )}
          </button>

          <button
            onClick={handleSubmitSolution}
            disabled={isGrading || code.length > 5000}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              code.length > 5000
                ? 'bg-rose-950 text-rose-300 border border-rose-800 opacity-80 cursor-not-allowed'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs shadow-rose-600/30 disabled:opacity-50 cursor-pointer'
            }`}
            title={code.length > 5000 ? `Mã nguồn (${code.length.toLocaleString('vi-VN')} ký tự) vượt quá 5,000 ký tự!` : "Phím tắt: Ctrl + Enter"}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{code.length > 5000 ? 'Quá giới hạn' : 'Nộp bài'}</span>
            {code.length <= 5000 && (
              <kbd className="hidden sm:inline-block text-[10px] ml-0.5 px-1.5 py-0.2 rounded bg-rose-700 text-rose-200 border border-rose-500/40 font-mono">
                Ctrl+↵
              </kbd>
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Dual-Tab Switcher (Viewport < 1024px) */}
      <div className="lg:hidden flex items-center bg-slate-100 dark:bg-slate-800 p-1 border-b border-slate-200 dark:border-slate-700 shrink-0">
        <button
          onClick={() => setMobileActiveTab('statement')}
          className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileActiveTab === 'statement'
              ? 'bg-white dark:bg-slate-900 shadow-xs text-rose-600 dark:text-rose-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>📖 Đề bài & Mô tả</span>
        </button>
        <button
          onClick={() => setMobileActiveTab('editor')}
          className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileActiveTab === 'editor'
              ? 'bg-white dark:bg-slate-900 shadow-xs text-rose-600 dark:text-rose-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>💻 Trình soạn thảo & Chấm</span>
        </button>
      </div>

      {/* Main Split-Screen Workspace with Real Draggable Splitter */}
      <div 
        ref={workspaceContainerRef}
        className={`flex-1 flex flex-col lg:flex-row overflow-hidden relative ${isDraggingSplitter ? 'cursor-col-resize select-none' : ''}`}
      >
        {/* LEFT COLUMN: Problem Statement & Documentation (Collapsible in Zen Mode) */}
        {!isZenMode && (
          <div 
            style={{ width: isLgScreen ? `${splitPercent}%` : '100%' }}
            className={`w-full flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden ${
              !isLgScreen && mobileActiveTab !== 'statement' ? 'hidden' : 'flex'
            }`}
          >
          {/* Tabs */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 bg-slate-50/50 dark:bg-slate-800/40">
            <button
              onClick={() => setActiveTab('statement')}
              className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'statement'
                  ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Đề bài
            </button>
            <button
              onClick={() => setActiveTab('editorial')}
              className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'editorial'
                  ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" /> Lời giải (Editorial)
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'submissions'
                  ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Lịch sử nộp
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'comments'
                  ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Thảo luận
            </button>
          </div>

          {/* Content Area with smooth scrolling */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Deep Practice Solved Banner (Mastery Star Rating & Next Problem CTA) */}
            {finalVerdict === 'AC' && (() => {
              const rating = getMasteryRating(unlockedHintTier);
              return (
                <div className={`p-5 rounded-2xl border ${rating.borderColor} ${rating.bgColor} space-y-3 shadow-lg animate-fadeIn relative overflow-hidden`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xl">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < rating.stars
                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                : 'text-slate-600 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${rating.borderColor} ${rating.textColor}`}>
                            {rating.badge}
                          </span>
                          <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                            {rating.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {rating.description}
                        </p>
                      </div>
                    </div>

                    {hasNextProblem && onNextProblem && (
                      <button
                        onClick={onNextProblem}
                        className="px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 shrink-0"
                      >
                        <span>Luyện Tập Bài Tiếp Theo →</span>
                        <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-emerald-800/80 border border-emerald-500/40 text-emerald-200 font-mono">
                          Shift+↵
                        </kbd>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Progressive 3-Tier Hint Drawer (Chống Mất Gốc Ngầm) */}
            {isHintDrawerOpen && (
              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 text-white space-y-4 shadow-xl animate-fadeIn relative">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <span>Trợ Lý Gợi Ý 3 Tầng</span>
                        <span className="text-[10px] text-slate-400 font-normal">| Học sâu • Tránh mất gốc</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {unlockedHintTier === 0 
                          ? 'Đang giữ: ⭐⭐⭐ Tự Lực (100% sao)' 
                          : unlockedHintTier <= 2 
                            ? 'Đang nhận: ⭐⭐ Khá Giỏi (Gợi ý tư duy)' 
                            : 'Đang nhận: ⭐ Đã Thông Suốt (Dùng mã giả)'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsHintDrawerOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
                  >
                    <span>Thu gọn</span>
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>

                {/* 3 Tiers Stack */}
                <div className="space-y-3">
                  {/* TIER 1: CONCEPTUAL (Always unlocked when drawer is open) */}
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Tầng 1: Tư Duy Thuật Toán Cốt Lõi
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400">Đã mở khóa</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-200">
                      {progressiveHints[0]?.title}
                    </h5>
                    <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 font-sans">
                      <KaTeXRenderer content={progressiveHints[0]?.content || ''} />
                    </div>
                  </div>

                  {/* TIER 2: TRAP & MEMORY PITFALL WARNING */}
                  <div className={`p-3.5 rounded-xl border transition-all ${
                    unlockedHintTier >= 2 
                      ? 'bg-slate-800/80 border-amber-500/40' 
                      : 'bg-slate-950/60 border-slate-800'
                  } space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Tầng 2: Cảnh Báo Bẫy Ngầm & Bộ Nhớ C
                      </span>
                      {unlockedHintTier >= 2 ? (
                        <span className="text-[10px] font-bold text-amber-400">Đã mở khóa</span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Đang khóa (⭐ Giữ 3 Sao)
                        </span>
                      )}
                    </div>

                    {unlockedHintTier >= 2 ? (
                      <>
                        <h5 className="text-xs font-bold text-slate-200">
                          {progressiveHints[1]?.title}
                        </h5>
                        <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 font-sans">
                          <KaTeXRenderer content={(progressiveHints[1]?.content || '').replace(/\\`/g, '`')} />
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                          Cảnh báo bẫy khoảng trắng scanf, null-terminator '\0', tràn mảng char, và lỗi rác bộ nhớ...
                        </p>
                        <button
                          onClick={() => handleUnlockHintTier(2)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shrink-0 shadow-xs cursor-pointer transition-colors"
                        >
                          Mở Khóa Tầng 2
                        </button>
                      </div>
                    )}
                  </div>

                  {/* TIER 3: PSEUDOCODE SCAFFOLD */}
                  <div className={`p-3.5 rounded-xl border transition-all ${
                    unlockedHintTier >= 3 
                      ? 'bg-slate-800/80 border-blue-500/40' 
                      : 'bg-slate-950/60 border-slate-800'
                  } space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> Tầng 3: Khung Mã Giả Định Hướng (Pseudocode)
                      </span>
                      {unlockedHintTier >= 3 ? (
                        <span className="text-[10px] font-bold text-blue-400">Đã mở khóa</span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Đang khóa (⭐ Giữ 2 Sao)
                        </span>
                      )}
                    </div>

                    {unlockedHintTier >= 3 ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-200">
                            {progressiveHints[2]?.title}
                          </h5>
                          <button
                            onClick={() => handleCopyTier3Code((progressiveHints[2]?.content || '').replace(/\\`/g, '`'))}
                            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {copiedTier3Code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedTier3Code ? 'Đã chép khung' : 'Sao chép khung code'}</span>
                          </button>
                        </div>
                        <pre className="text-[11px] font-mono text-blue-100 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto leading-relaxed">
                          {(progressiveHints[2]?.content || '').replace(/\\`/g, '`')}
                        </pre>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                          Cung cấp sườn code chuẩn C từ khai báo, xử lý chuỗi đến in kết quả để người học điền vào...
                        </p>
                        <button
                          onClick={() => handleUnlockHintTier(3)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shrink-0 shadow-xs cursor-pointer transition-colors"
                        >
                          Mở Khóa Mã Giả
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* AI Hint Banner if triggered */}
            {aiHint && (
              <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between font-bold text-indigo-700 dark:text-indigo-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-500" /> Gợi ý thuật toán AI
                  </span>
                  <button onClick={() => setAiHint(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">×</button>
                </div>
                <p className="leading-relaxed">{aiHint}</p>
              </div>
            )}

            {activeTab === 'statement' && (
              <div className="space-y-4">
                <ProblemSpecificationView
                  problem={problem}
                  lang={docLang}
                  onToggleLang={handleToggleLang}
                  showLangToggle={false}
                  scoreWeight={`${problem.points}đ`}
                  isExamMode={false}
                />

                {/* Source & Attribution */}
                {(problem.author || problem.source) && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 space-y-1">
                    {problem.author && <p>Tác giả: <strong className="text-slate-600 dark:text-slate-300">{problem.author}</strong></p>}
                    {problem.source && <p>Nguồn đề: <strong className="text-slate-600 dark:text-slate-300">{problem.source}</strong></p>}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'editorial' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs">
                  💡 Hướng dẫn giải chi tiết được kiểm duyệt bởi ban chuyên môn AHtest.code.
                </div>
                <KaTeXRenderer content={problem.editorial || 'Lời giải chi tiết đang được cập nhật.'} />
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-600">AC • 100/100</span>
                    <p className="text-[11px] text-slate-400">C++20 • 0.08s • 18.2MB • 10 phút trước</p>
                  </div>
                  <button className="text-rose-600 font-semibold hover:underline">Xem code</button>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-amber-600">TLE • 60/100</span>
                    <p className="text-[11px] text-slate-400">C++17 • 2.05s • 24.1MB • 2 giờ trước</p>
                  </div>
                  <button className="text-rose-600 font-semibold hover:underline">Xem code</button>
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-4 text-xs">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Viết câu hỏi hoặc thảo luận về bài toán..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                  <button className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl">Gửi</button>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>Trần Đức Lương (Grandmaster)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Hôm qua</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Các bạn chú ý Subtask 3 có các giá trị $A_i$ lên tới $10^9$ nên bắt buộc phải nén tọa độ trước khi dựng Fenwick Tree nhé!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* DRAGGABLE SPLITTER HANDLE (Desktop Only) */}
        {!isZenMode && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDraggingSplitter(true);
            }}
            className="hidden lg:flex items-center justify-center w-2 hover:w-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 dark:hover:bg-rose-500 transition-colors cursor-col-resize group shrink-0 relative z-20 select-none"
            title="Kéo sang trái hoặc phải để điều chỉnh tỷ lệ khung làm việc (20% - 80%)"
          >
            <div className="w-0.5 h-8 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-white" />
          </div>
        )}

        {/* RIGHT COLUMN: Professional Monaco Code Editor & Execution Console */}
        <div 
          ref={editorColumnRef}
          style={{ width: isLgScreen ? (isZenMode ? '100%' : `${100 - splitPercent}%`) : '100%' }}
          className={`flex-1 flex flex-col bg-slate-900 text-white overflow-hidden transition-[width] duration-75 relative ${
            isDraggingConsole ? 'select-none cursor-row-resize' : ''
          } ${!isLgScreen && mobileActiveTab !== 'editor' ? 'hidden' : 'flex'}`}
        >
          {/* Editor Controls Bar */}
          <div className="h-10 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between shrink-0 text-xs">
            <div className="flex items-center gap-3">
              <label htmlFor="lang-select" className="text-slate-400 font-semibold">Ngôn ngữ:</label>
              <select
                id="lang-select"
                value={language}
                onChange={(e) => {
                  const newLang = e.target.value as any;
                  setLanguage(newLang);
                }}
                className="bg-slate-800 text-slate-200 text-xs rounded px-2 py-1 border border-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="cpp20">C++20 (GCC 16.2 FastIO) • Khuyên Dùng</option>
                <option value="c17">C17 (GCC 16.2 Dev-C++) • Sẵn sàng</option>
                <option value="cpp17">C++17 (g++ 16.2) • Sẵn sàng</option>
                <option value="py3" disabled className="text-slate-500">Python 3 (PyPy 3.10) • Sắp ra mắt (Wasm VM)</option>
                <option value="java" disabled className="text-slate-500">Java 21 LTS • Sắp ra mắt</option>
                <option value="rust" disabled className="text-slate-500">Rust 1.82 • Sắp ra mắt</option>
              </select>
            </div>

            <div className="flex items-center gap-2.5">
              {/* 5000-character limit counter */}
              <div 
                className={`text-[11px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1.5 transition-colors ${
                  code.length > 5000 
                    ? 'text-rose-400 bg-rose-950/80 border-rose-600 font-bold animate-pulse'
                    : code.length > 4500
                    ? 'text-amber-300 bg-amber-950/60 border-amber-600 font-semibold'
                    : 'text-slate-400 bg-slate-900 border-slate-800'
                }`}
                title={`Dung lượng code: ${code.length.toLocaleString('vi-VN')} / 5,000 ký tự tối đa`}
              >
                <span>{code.length.toLocaleString('vi-VN')}/5,000</span>
                <span className="hidden md:inline text-[10px] text-slate-500">ký tự</span>
              </div>

              {draftSaved && (
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                  <Save className="w-3 h-3 text-emerald-400" />
                  <span>Đã lưu nháp</span>
                </span>
              )}

              <button
                onClick={handleResetCode}
                title="Khôi phục code mẫu ban đầu (Xóa bản nháp đã lưu)"
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Professional Monaco Code Editor (Responsive min-height) */}
          <div className="flex-1 relative overflow-hidden bg-slate-950 min-h-[100px]">
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              language={language}
              onRun={handleRunSample}
              onSubmit={handleSubmitSolution}
              onMount={(editor) => {
                monacoEditorRef.current = editor;
              }}
            />
          </div>

          {/* DRAGGABLE CONSOLE SPLITTER (Resize Console Up/Down) */}
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDraggingConsole(true);
            }}
            className={`h-2 hover:h-2.5 bg-slate-800 hover:bg-rose-500 transition-colors cursor-row-resize flex items-center justify-center shrink-0 group relative z-20 select-none ${
              isDraggingConsole ? 'bg-rose-500' : ''
            }`}
            title="Kéo lên / kéo xuống để điều chỉnh độ cao khung Console & Test Cases"
          >
            <div className="w-12 h-1 rounded-full bg-slate-600 group-hover:bg-white transition-colors" />
          </div>

          {/* Bottom Terminal / Drawer */}
          <div 
            style={{
              height: !showConsole 
                ? '36px' 
                : isConsoleMaximized 
                ? 'calc(100% - 40px)' 
                : `${consoleHeight}px`,
              maxHeight: !showConsole ? '36px' : 'calc(100% - 90px)'
            }}
            className="border-t border-slate-800 bg-slate-900 flex flex-col shrink-0 overflow-hidden transition-all duration-75"
          >
            {/* Drawer Header */}
            <div className="h-9 px-4 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-xs shrink-0 select-none">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setConsoleTab('testcase');
                    setShowConsole(true);
                  }}
                  className={`font-semibold cursor-pointer pb-0.5 border-b-2 transition-colors ${
                    consoleTab === 'testcase' 
                      ? 'text-rose-400 border-rose-500 font-bold' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sample Input ({problem.samples.length})
                </button>
                <button
                  onClick={() => {
                    setConsoleTab('custom');
                    setShowConsole(true);
                  }}
                  className={`font-semibold cursor-pointer pb-0.5 border-b-2 transition-colors ${
                    consoleTab === 'custom' 
                      ? 'text-rose-400 border-rose-500 font-bold' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Custom Test
                </button>
                <button
                  onClick={() => {
                    setConsoleTab('result');
                    setShowConsole(true);
                  }}
                  className={`font-semibold cursor-pointer pb-0.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                    consoleTab === 'result' 
                      ? 'text-rose-400 border-rose-500 font-bold' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Kết quả chấm</span>
                  {finalVerdict && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                      finalVerdict === 'AC' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {finalVerdict}
                    </span>
                  )}
                </button>
              </div>

              {/* Right controls: Presets, Maximize, Collapse/Expand */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Presets */}
                <div className="hidden sm:flex items-center bg-slate-800 rounded-md p-0.5 text-[10px] font-mono text-slate-400">
                  <button
                    onClick={() => {
                      setShowConsole(true);
                      setIsConsoleMaximized(false);
                      setConsoleHeight(160);
                      localStorage.setItem('ahtest_workbench_console_height', '160');
                    }}
                    className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                      showConsole && !isConsoleMaximized && consoleHeight === 160 ? 'bg-slate-700 text-white font-bold' : 'hover:text-slate-200'
                    }`}
                    title="Thu gọn vừa phải (160px)"
                  >
                    Nhỏ
                  </button>
                  <button
                    onClick={() => {
                      setShowConsole(true);
                      setIsConsoleMaximized(false);
                      setConsoleHeight(260);
                      localStorage.setItem('ahtest_workbench_console_height', '260');
                    }}
                    className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                      showConsole && !isConsoleMaximized && consoleHeight === 260 ? 'bg-slate-700 text-white font-bold' : 'hover:text-slate-200'
                    }`}
                    title="Chiều cao chuẩn (260px)"
                  >
                    Vừa
                  </button>
                  <button
                    onClick={() => {
                      setShowConsole(true);
                      setIsConsoleMaximized(false);
                      setConsoleHeight(380);
                      localStorage.setItem('ahtest_workbench_console_height', '380');
                    }}
                    className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                      showConsole && !isConsoleMaximized && consoleHeight === 380 ? 'bg-slate-700 text-white font-bold' : 'hover:text-slate-200'
                    }`}
                    title="Mở rộng lớn (380px - xem trọn vẹn Testcase & Diff)"
                  >
                    Lớn
                  </button>
                </div>

                {/* Maximize / Restore Console */}
                <button
                  onClick={() => {
                    setShowConsole(true);
                    setIsConsoleMaximized(!isConsoleMaximized);
                  }}
                  className={`p-1 rounded transition-colors cursor-pointer ${
                    isConsoleMaximized 
                      ? 'bg-rose-600 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title={isConsoleMaximized ? "Thu nhỏ về kích thước cũ" : "Phóng to Console toàn màn hình"}
                >
                  {isConsoleMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                {/* Collapse / Expand Toggle */}
                <button
                  onClick={() => {
                    if (showConsole) {
                      setShowConsole(false);
                      setIsConsoleMaximized(false);
                    } else {
                      setShowConsole(true);
                    }
                  }}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title={showConsole ? "Thu gọn Console" : "Mở rộng Console"}
                >
                  {showConsole ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            {showConsole && (
              <div className="p-4 flex-1 min-h-0 overflow-y-auto font-mono-code text-xs space-y-4">
                {consoleTab === 'testcase' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-300 font-sans">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-rose-500" />
                        <span className="font-bold">Bảng Kiểm Thử 2 Tầng: Công khai & Test Ẩn</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {problem.testcases 
                          ? `${problem.testcases.filter(t => !t.isHidden).length} Test mẫu • ${problem.testcases.filter(t => t.isHidden).length} Test ẩn`
                          : `${problem.samples.length} Test mẫu • 3 Test ẩn của hệ thống`}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {problem.samples.map((sample, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-between">
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              Test #{idx + 1} (Công khai)
                            </span>
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <button
                                onClick={() => handleCopySample(sample.input, idx)}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                                title="Sao chép Input test này"
                              >
                                {copiedSample === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedSample === idx ? 'Đã chép' : 'Sao chép'}</span>
                              </button>
                              <button
                                onClick={() => {
                                  setCustomInput(sample.input);
                                  setCustomExpected(sample.output);
                                  setConsoleTab('custom');
                                  setShowConsole(true);
                                }}
                                className="px-2 py-0.5 rounded bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-700/60 text-indigo-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                                title="Chuyển test này sang Custom Test để chỉnh sửa hoặc chạy thử riêng"
                              >
                                <FlaskConical className="w-3 h-3" />
                                <span>Vào Custom Test</span>
                              </button>
                              <button
                                onClick={() => handleRunSpecificSample(idx)}
                                className="px-2 py-0.5 rounded bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer font-bold"
                                title="Chạy thử ngay giải thuật của bạn với test này"
                              >
                                <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                                <span>Chạy</span>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Input (Đầu vào):</span>
                            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 max-h-32 overflow-y-auto">
                              <pre className="text-slate-200 whitespace-pre-wrap select-all font-mono leading-relaxed">{sample.input}</pre>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Expected Output (Đầu ra chuẩn):</span>
                            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40 max-h-32 overflow-y-auto">
                              <pre className="text-emerald-300 whitespace-pre-wrap select-all font-mono leading-relaxed">{sample.output}</pre>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 border-dashed space-y-2 flex flex-col justify-center text-center">
                        <Lock className="w-6 h-6 text-amber-500/70 mx-auto" />
                        <span className="font-bold text-slate-300 text-xs">3 Testcases Ẩn (Hidden System Cases)</span>
                        <p className="text-[11px] text-slate-500">
                          Bao gồm các ca kiểm tra biên ranh giới (K=0), số âm và Stress Test N = 200,000. Chỉ được chấm khi bạn bấm "Nộp bài".
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {consoleTab === 'custom' && (
                  <div className="space-y-3 font-sans">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs text-slate-400 font-semibold mr-1">Mẫu nhanh:</span>
                        <button
                          onClick={() => {
                            setCustomInput(problem.samples[0]?.input || '');
                            setCustomExpected(problem.samples[0]?.output || '');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>📥 Nạp Test #1</span>
                        </button>
                        {problem.samples.length > 1 && (
                          <button
                            onClick={() => {
                              setCustomInput(problem.samples[1]?.input || '');
                              setCustomExpected(problem.samples[1]?.output || '');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>📥 Nạp Test #2</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setCustomInput('');
                            setCustomExpected('');
                            setCustomOutput('');
                            setCustomExecResult(null);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-xs transition-colors cursor-pointer flex items-center gap-1"
                          title="Xóa trắng input & output"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Xóa trắng</span>
                        </button>
                      </div>

                      <button
                        onClick={handleRunCustomTest}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-rose-600/30 cursor-pointer flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Chạy thử Custom Test</span>
                      </button>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Custom Input (Dữ liệu vào / stdin):
                        </span>
                        <textarea
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          rows={4}
                          className="w-full p-2.5 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 text-xs font-mono-code focus:outline-none focus:border-rose-500 transition-colors"
                          placeholder="Nhập input tùy ý của bạn..."
                        />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Expected Output (Tùy chọn - Dữ liệu ra mong đợi để so sánh Diff):
                        </span>
                        <textarea
                          value={customExpected}
                          onChange={(e) => setCustomExpected(e.target.value)}
                          rows={4}
                          className="w-full p-2.5 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 text-xs font-mono-code focus:outline-none focus:border-rose-500 transition-colors"
                          placeholder="Nhập output chuẩn bạn mong đợi (để hệ thống tạo bảng so sánh Diff)..."
                        />
                      </div>
                    </div>

                    {/* Output Section */}
                    {customOutput && (
                      <div className="pt-2 space-y-2">
                        {/* Pedagogical Diagnosis Explainer Card in Custom tab */}
                        {pedagogicalDiagnosis && (
                          <div className="p-3.5 rounded-xl border border-amber-500/40 bg-linear-to-r from-amber-950/40 via-slate-900 to-slate-950 shadow-md font-sans space-y-2.5">
                            <div className="flex items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
                                  <Lightbulb className="w-4 h-4" />
                                </span>
                                <span className="font-bold text-amber-300 text-xs sm:text-sm">
                                  {pedagogicalDiagnosis.title}
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                                {pedagogicalDiagnosis.badge}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed">
                              {pedagogicalDiagnosis.explanation}
                            </p>

                            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                              <span className="font-bold text-emerald-400 text-[11px] block">
                                💡 Hướng dẫn sửa nhanh:
                              </span>
                              <p className="text-slate-300 whitespace-pre-line font-mono text-[11px] leading-relaxed">
                                {pedagogicalDiagnosis.suggestion}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Status bar */}
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
                          <div className="flex items-center gap-2">
                            {customExecResult?.status === 'SUCCESS' ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Thực thi thành công
                              </span>
                            ) : (
                              <span className="text-rose-400 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {customExecResult?.status || 'LỖI'}
                              </span>
                            )}
                            {customExecResult && (
                              <span className="text-slate-400 text-[11px]">
                                • {customExecResult.executionTimeMs}ms • {customExecResult.memoryKb}KB
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(customOutput);
                            }}
                            className="text-slate-400 hover:text-white text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Sao chép Output</span>
                          </button>
                        </div>

                        {/* Compiler / Runtime Diagnostic Jump if error */}
                        {(() => {
                          const err = parseDiagnosticError(customOutput);
                          if (err) {
                            return (
                              <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-800/80 flex items-center justify-between shadow-xs">
                                <span className="text-rose-200 text-xs font-mono">
                                  Lỗi cú pháp tại <strong className="text-rose-400 font-bold">Dòng {err.line}</strong>, Cột <strong className="text-rose-400 font-bold">{err.col}</strong>
                                </span>
                                <button
                                  onClick={() => jumpToLine(err.line, err.col)}
                                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                                >
                                  <span>👉 Nhảy đến dòng lỗi</span>
                                </button>
                              </div>
                            );
                          }
                          return null;
                        })()}

                        {/* If customExpected is provided, show DiffViewer! Otherwise show clean Output block */}
                        {customExpected.trim() ? (
                          <DiffViewer
                            actual={customOutput}
                            expected={customExpected}
                            title="Bảng So Sánh Custom Test vs Expected"
                            input={customInput}
                            isPassed={customOutput.trim() === customExpected.trim()}
                            verdict={customOutput.trim() === customExpected.trim() ? 'AC' : 'WA'}
                          />
                        ) : (
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                              Chương trình in ra (stdout):
                            </span>
                            <pre className="text-slate-200 whitespace-pre-wrap font-mono text-xs leading-relaxed max-h-48 overflow-y-auto">
                              {customOutput}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {consoleTab === 'result' && (
                  <div className="space-y-4">
                    {isGrading ? (
                      <div className="flex flex-col items-center justify-center py-8 space-y-3">
                        <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-slate-300 font-semibold animate-pulse text-xs">
                          Đang biên dịch và thực thi trên cụm Judge Sandbox... ({Math.round(gradingProgress)}%)
                        </span>
                        <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-linear-to-r from-rose-500 to-amber-500 transition-all duration-200"
                            style={{ width: `${gradingProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : testResults ? (
                      <div className="space-y-4 font-sans">
                        {/* Pedagogical Diagnosis Explainer Card in Result tab */}
                        {pedagogicalDiagnosis && (
                          <div className="p-3.5 rounded-xl border border-amber-500/40 bg-linear-to-r from-amber-950/40 via-slate-900 to-slate-950 shadow-md font-sans space-y-2.5">
                            <div className="flex items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
                                  <Lightbulb className="w-4 h-4" />
                                </span>
                                <span className="font-bold text-amber-300 text-xs sm:text-sm">
                                  {pedagogicalDiagnosis.title}
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                                {pedagogicalDiagnosis.badge}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed">
                              {pedagogicalDiagnosis.explanation}
                            </p>

                            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                              <span className="font-bold text-emerald-400 text-[11px] block">
                                💡 Hướng dẫn sửa nhanh:
                              </span>
                              <p className="text-slate-300 whitespace-pre-line font-mono text-[11px] leading-relaxed">
                                {pedagogicalDiagnosis.suggestion}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Overall Verdict Banner */}
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                              finalVerdict === 'AC' 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            }`}>
                              {finalVerdict === 'AC' ? 'ACCEPTED (100/100)' : 'WRONG ANSWER'}
                            </span>
                            <span className="text-slate-300 text-xs font-bold">
                              {testResults.filter(t => t.verdict === 'AC').length}/{testResults.length} Test cases đạt yêu cầu
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">
                            Bấm vào từng testcase bên dưới để xem so sánh Diff chi tiết
                          </span>
                        </div>

                        {/* Interactive Test Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {testResults.map((tr) => {
                            const isSelected = selectedTestResult?.testId === tr.testId;
                            return (
                              <button
                                key={tr.testId}
                                onClick={() => setSelectedTestResult(tr)}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                                  isSelected
                                    ? 'bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/40 shadow-md'
                                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="flex items-center gap-1 text-slate-300">
                                    {tr.isHidden && <Lock className="w-3 h-3 text-amber-400" />}
                                    Test #{tr.testId}
                                  </span>
                                  <span className={tr.verdict === 'AC' ? 'text-emerald-400' : 'text-rose-400'}>
                                    {tr.verdict}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-slate-500">
                                  <span>{tr.score}/{tr.maxScore}đ</span>
                                  <span>{tr.time}ms</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Diff Inspector for the Selected Testcase */}
                        {selectedTestResult && (
                          <div className="pt-2 animate-fadeIn space-y-2">
                            {(() => {
                              const err = parseDiagnosticError(selectedTestResult.actualOutput || '');
                              if (err) {
                                return (
                                  <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-800/80 flex items-center justify-between shadow-xs">
                                    <span className="text-rose-200 text-xs font-mono">
                                      Phát hiện lỗi cú pháp tại <strong className="text-rose-400 font-bold">Dòng {err.line}</strong>, Cột <strong className="text-rose-400 font-bold">{err.col}</strong>
                                    </span>
                                    <button
                                      onClick={() => jumpToLine(err.line, err.col)}
                                      className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                                    >
                                      <span>👉 Nhảy đến dòng lỗi</span>
                                    </button>
                                  </div>
                                );
                              }
                              return null;
                            })()}

                            <DiffViewer
                              actual={selectedTestResult.actualOutput || ''}
                              expected={selectedTestResult.expectedOutput || ''}
                              title={`Chi tiết: ${selectedTestResult.testName || `Test #${selectedTestResult.testId}`}`}
                              testId={selectedTestResult.testId}
                              input={selectedTestResult.input}
                              verdict={selectedTestResult.verdict}
                              isPassed={selectedTestResult.verdict === 'AC'}
                            />
                          </div>
                        )}
                      </div>
                    ) : customOutput ? (
                      <div className="space-y-3">
                        <DiffViewer
                          actual={customOutput}
                          expected={problem.samples[0]?.output || ''}
                          title="Kết quả chạy thử mẫu (Sample Output)"
                          testId={1}
                          input={problem.samples[0]?.input}
                          isPassed={customOutput.trim() === (problem.samples[0]?.output || '').trim()}
                          verdict={customOutput.trim() === (problem.samples[0]?.output || '').trim() ? 'AC' : 'WA'}
                        />
                      </div>
                    ) : (
                      <p className="text-slate-500 text-center py-10 font-sans">
                        Chưa có kết quả. Bấm "Chạy thử" hoặc "Nộp bài" để kiểm tra nghiệm với bộ Diff Inspector.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
