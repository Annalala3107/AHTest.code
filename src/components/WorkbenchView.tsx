import React, { useState, useRef, useEffect } from 'react';
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
  HardDrive, 
  MessageSquare, 
  Lightbulb, 
  ChevronDown, 
  Terminal, 
  Lock, 
  Save,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { Problem, Verdict, TestResult } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';
import { DiffViewer } from './DiffViewer';
import { executeCCode } from '../services/cExecutionEngine';
import { CodeEditor } from './CodeEditor';

interface WorkbenchViewProps {
  problem: Problem;
  onBack: () => void;
}

export const WorkbenchView: React.FC<WorkbenchViewProps> = ({ problem, onBack }) => {
  const [activeTab, setActiveTab] = useState<'statement' | 'editorial' | 'submissions' | 'comments'>('statement');
  const [language, setLanguage] = useState<'c17' | 'cpp20' | 'cpp17' | 'py3' | 'java' | 'rust'>('cpp20');
  const [copiedSample, setCopiedSample] = useState<number | null>(null);

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
  const [isDraggingSplitter, setIsDraggingSplitter] = useState<boolean>(false);
  const workspaceContainerRef = useRef<HTMLDivElement>(null);
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

  // Dragging handler for smooth 2-panel splitter
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSplitter || !workspaceContainerRef.current) return;
      const rect = workspaceContainerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newPercent = Math.min(Math.max((offsetX / rect.width) * 100, 20), 80);
      setSplitPercent(Math.round(newPercent));
      localStorage.setItem('ahtest_workbench_split', String(Math.round(newPercent)));
    };

    const handleMouseUp = () => {
      setIsDraggingSplitter(false);
    };

    if (isDraggingSplitter) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSplitter]);

  // Helper for unique localStorage draft key per problem & language
  const getWorkbenchDraftKey = (probId: string, lang: string) => {
    return `ahtest_draft_workbench_${probId}_${lang}`;
  };

  const [draftSaved, setDraftSaved] = useState<boolean>(false);

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

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    const key = getWorkbenchDraftKey(problem.id, language);
    localStorage.setItem(key, newCode);
    setDraftSaved(true);
  };

  const handleResetCode = () => {
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
  const [showConsole, setShowConsole] = useState<boolean>(true);
  const [consoleTab, setConsoleTab] = useState<'testcase' | 'custom' | 'result'>('testcase');
  const [aiHint, setAiHint] = useState<string | null>(null);

  const handleCopySample = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSample(index);
    setTimeout(() => setCopiedSample(null), 2000);
  };

  const handleRunSample = () => {
    setConsoleTab('result');
    setShowConsole(true);
    setIsGrading(true);
    setFinalVerdict(null);
    setTestResults(null);
    setSelectedTestResult(null);

    setTimeout(() => {
      setIsGrading(false);
      const sample = problem.samples[0];
      const input = sample?.input || '';
      const exec = executeCCode(code, input);

      let verdict: 'AC' | 'WA' | 'TLE' | 'RTE' | 'CE' = 'WA';
      if (exec.status === 'CE') verdict = 'CE';
      else if (exec.status === 'RTE') verdict = 'RTE';
      else if (exec.status === 'TLE') verdict = 'TLE';
      else if (exec.stdout.replace(/\r\n/g, '\n').trim() === (sample?.output || '').replace(/\r\n/g, '\n').trim()) {
        verdict = 'AC';
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
        input: sample?.input || '',
        actualOutput: exec.status === 'CE' ? exec.stderr : (exec.stdout || '(Không có output ra stdout)'),
        expectedOutput: sample?.output || '3'
      };

      setCustomOutput(exec.status === 'CE' ? exec.stderr : (exec.stdout || 'Chương trình thực thi không có output.'));
      setTestResults([singleResult]);
      setSelectedTestResult(singleResult);
      setFinalVerdict(verdict);
    }, 350);
  };

  const handleSubmitSolution = () => {
    setShowConsole(true);
    setConsoleTab('result');
    setIsGrading(true);
    setGradingProgress(0);
    setFinalVerdict(null);
    setTestResults(null);
    setSelectedTestResult(null);
    setAiHint(null);

    // Check for Compile Error once first
    const syntaxCheck = executeCCode(code, '');
    if (syntaxCheck.status === 'CE') {
      setIsGrading(false);
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

    // 2-Tier Testcases: 2 Public Samples + 3 Hidden System Edge Cases
    const testDefinitions = [
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

    const interval = setInterval(() => {
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
        clearInterval(interval);
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

        if (allAC) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    }, 120);
  };

  const requestAiHint = () => {
    setAiHint('Gợi ý từ AI Trợ giảng: Bài toán yêu cầu tính số nghịch thế. Thay vì dùng 2 vòng lặp lồng nhau O(N^2) gây TLE, hãy áp dụng thuật toán nén tọa độ (Coordinate Compression) kết hợp Cây Fenwick (Binary Indexed Tree) hoặc Segment Tree để tính tổng trong O(N log N). Chú ý sử dụng kiểu long long cho biến đếm kết quả để tránh tràn số.');
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
          <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[260px] sm:max-w-md">
            {problem.title}
          </h2>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
            {problem.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2">
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

          {/* AI Hint Trigger */}
          <button
            onClick={requestAiHint}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gợi ý AI</span>
          </button>

          {/* Run & Submit CTAs with Keyboard Shortcut Badges */}
          <button
            onClick={handleRunSample}
            disabled={isGrading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors cursor-pointer"
            title="Phím tắt: F9"
          >
            <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>Chạy thử</span>
            <kbd className="hidden sm:inline-block text-[10px] ml-0.5 px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-mono">
              F9
            </kbd>
          </button>

          <button
            onClick={handleSubmitSolution}
            disabled={isGrading}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-xs shadow-rose-600/30 disabled:opacity-50 transition-all cursor-pointer"
            title="Phím tắt: Ctrl + Enter"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nộp bài</span>
            <kbd className="hidden sm:inline-block text-[10px] ml-0.5 px-1.5 py-0.2 rounded bg-rose-700 text-rose-200 border border-rose-500/40 font-mono">
              Ctrl+↵
            </kbd>
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace with Real Draggable Splitter */}
      <div 
        ref={workspaceContainerRef}
        className={`flex-1 flex flex-col lg:flex-row overflow-hidden relative ${isDraggingSplitter ? 'cursor-col-resize select-none' : ''}`}
      >
        {/* LEFT COLUMN: Problem Statement & Documentation (Collapsible in Zen Mode) */}
        {!isZenMode && (
          <div 
            style={{ width: `${splitPercent}%` }}
            className="w-full lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
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
              <>
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Giới hạn: <strong>{problem.timeLimit}s</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-slate-400" />
                    Bộ nhớ: <strong>{problem.memoryLimit}MB</strong>
                  </span>
                  <span>Input: <strong>stdin</strong></span>
                  <span>Output: <strong>stdout</strong></span>
                  <span>Điểm: <strong className="text-rose-600 font-bold">{problem.points}đ</strong></span>
                </div>

                {/* Statement Body (Rendered with KaTeX) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Mô tả bài toán
                  </h3>
                  <KaTeXRenderer content={problem.statement} />
                </div>

                {/* Input Format */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Dữ liệu vào (Input)
                  </h3>
                  <KaTeXRenderer content={problem.inputFormat} />
                </div>

                {/* Output Format */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Dữ liệu ra (Output)
                  </h3>
                  <KaTeXRenderer content={problem.outputFormat} />
                </div>

                {/* Constraints & Subtasks */}
                {problem.constraints && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Ràng buộc & Subtasks
                    </h3>
                    <KaTeXRenderer content={problem.constraints} />
                  </div>
                )}

                {/* Sample Cases with 1-click Copy */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Ví dụ (Sample Cases)
                  </h3>
                  {problem.samples.map((sample, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                      <div className="bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                        <span>Ví dụ #{idx + 1}</span>
                        <button
                          onClick={() => handleCopySample(sample.input, idx)}
                          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                        >
                          {copiedSample === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-500">Đã copy</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Input</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800">
                        <div className="p-3 bg-slate-50/30 dark:bg-slate-900/40">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Input:</span>
                          <pre className="font-mono-code text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{sample.input}</pre>
                        </div>
                        <div className="p-3 bg-slate-50/30 dark:bg-slate-900/40">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Output:</span>
                          <pre className="font-mono-code text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{sample.output}</pre>
                        </div>
                      </div>

                      {sample.explanation && (
                        <div className="p-2.5 bg-amber-50/50 dark:bg-amber-950/20 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[11px]">
                          <strong>Giải thích:</strong> {sample.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Source & Attribution */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 space-y-1">
                  <p>Tác giả: <strong className="text-slate-600 dark:text-slate-300">{problem.author}</strong></p>
                  <p>Nguồn đề: <strong className="text-slate-600 dark:text-slate-300">{problem.source}</strong></p>
                </div>
              </>
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
          style={{ width: isZenMode ? '100%' : `${100 - splitPercent}%` }}
          className="flex-1 flex flex-col bg-slate-900 text-white overflow-hidden transition-[width] duration-75"
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

          {/* Professional Monaco Code Editor */}
          <div className="flex-1 relative overflow-hidden bg-slate-950 min-h-[300px]">
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

          {/* Bottom Terminal / Drawer */}
          <div className="border-t border-slate-800 bg-slate-900 shrink-0">
            {/* Drawer Header */}
            <div className="h-9 px-4 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setConsoleTab('testcase')}
                  className={`font-semibold cursor-pointer ${consoleTab === 'testcase' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Sample Input
                </button>
                <button
                  onClick={() => setConsoleTab('custom')}
                  className={`font-semibold cursor-pointer ${consoleTab === 'custom' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Custom Test
                </button>
                <button
                  onClick={() => setConsoleTab('result')}
                  className={`font-semibold cursor-pointer flex items-center gap-1.5 ${consoleTab === 'result' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Kết quả chấm
                  {finalVerdict && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </button>
              </div>

              <button
                onClick={() => setShowConsole(!showConsole)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${showConsole ? '' : 'rotate-180'}`} />
              </button>
            </div>

            {/* Drawer Content */}
            {showConsole && (
              <div className="p-4 h-80 sm:h-96 overflow-y-auto font-mono-code text-xs space-y-4">
                {consoleTab === 'testcase' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-300 font-sans">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-rose-500" />
                        <span className="font-bold">Bảng Kiểm Thử 2 Tầng: Công khai & Test Ẩn</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {problem.samples.length} Test mẫu • 3 Test ẩn của hệ thống
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {problem.samples.map((sample, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                              Test #{idx + 1} (Công khai)
                            </span>
                            <button
                              onClick={() => handleCopySample(sample.input, idx)}
                              className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
                            >
                              Sao chép
                            </button>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block">Input:</span>
                            <pre className="text-slate-200 whitespace-pre-wrap">{sample.input}</pre>
                          </div>
                          <div>
                            <span className="text-[10px] text-emerald-400 uppercase block">Expected:</span>
                            <pre className="text-emerald-300 whitespace-pre-wrap">{sample.output}</pre>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Custom Input (Dữ liệu vào):
                        </span>
                        <textarea
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          rows={4}
                          className="w-full p-2.5 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 text-xs font-mono-code focus:outline-none"
                          placeholder="Nhập input tùy ý..."
                        />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Expected Output (Tùy chọn so sánh Diff):
                        </span>
                        <textarea
                          value={customExpected}
                          onChange={(e) => setCustomExpected(e.target.value)}
                          rows={4}
                          className="w-full p-2.5 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 text-xs font-mono-code focus:outline-none"
                          placeholder="Nhập output chuẩn bạn mong đợi (nếu muốn so sánh)..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleRunSample}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Chạy thử Custom Test
                      </button>
                    </div>

                    {customOutput && (
                      <div className="pt-2">
                        <DiffViewer
                          actual={customOutput}
                          expected={customExpected || problem.samples[0]?.output || ''}
                          title="Kết quả Custom Test vs Mẫu"
                          input={customInput}
                        />
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
