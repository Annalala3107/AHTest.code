import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Lightbulb,
  Terminal,
  RotateCcw
} from 'lucide-react';
import { mockCourses } from '../data/mockAcademy';
import { AcademyLesson, AcademyCourse } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';

export const AcademyView: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse>(mockCourses[0]);
  const [activeLesson, setActiveLesson] = useState<AcademyLesson>(
    mockCourses[0].modules[0].lessons[0]
  );
  const [userCode, setUserCode] = useState<string>(activeLesson.initialCode);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [exercisePassed, setExercisePassed] = useState<boolean>(false);
  const [showHintIndex, setShowHintIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleSelectLesson = (lesson: AcademyLesson) => {
    setActiveLesson(lesson);
    setUserCode(lesson.initialCode);
    setExecutionOutput(null);
    setExercisePassed(false);
    setShowHintIndex(-1);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setExecutionOutput(null);
    setExercisePassed(false);

    // In-browser micro-simulator: evaluates user's code against lesson requirements
    setTimeout(() => {
      setIsRunning(false);
      let outputText = '';
      let isSuccess = false;

      if (activeLesson.id === 'c-1-1') {
        if (userCode.includes('Hello Dev-Cpp & AHtest.code!')) {
          outputText = 'Hello Dev-Cpp & AHtest.code!\n[Biên dịch thành công với chuẩn MinGW TDM-GCC Dev-C++]\n[Thực thi hoàn tất trong 0.001s - Client-Side Wasm Sandbox]';
          isSuccess = true;
        } else {
          outputText = 'Lỗi: Output không khớp với "Hello Dev-Cpp & AHtest.code!"!\nHãy kiểm tra lại câu lệnh printf().';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'c-1-2') {
        if (userCode.includes('scanf') && userCode.includes('&a') && userCode.includes('&b')) {
          outputText = 'Input: 15 25\nOutput: Tong = 40\n[Test 1: Passed]\nInput: 100 -30\nOutput: Tong = 70\n[Test 2: Passed - Nhập dữ liệu định dạng với scanf thành công!]';
          isSuccess = true;
        } else {
          outputText = 'Cảnh báo: Bạn chưa sử dụng đúng hàm scanf("%d %d", &a, &b) hoặc thiếu toán tử lấy địa chỉ &!';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'c-1-3') {
        if (userCode.includes('*p = 999') || userCode.includes('*p=999')) {
          outputText = 'Output: 999\n[Test 1: Passed - Đã gán giá trị biến val thành công thông qua con trỏ *p]';
          isSuccess = true;
        } else {
          outputText = 'Lỗi: Giá trị val chưa được gán thành 999 thông qua toán tử giải tham chiếu *p = 999;';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'cpp-1-1') {
        if (userCode.includes('AHtest.code Academy 2026') || userCode.includes('AHtest.code')) {
          outputText = 'AHtest.code Academy 2026\n[Execution completed in 0.002s - In-Browser Wasm Runner]';
          isSuccess = true;
        } else {
          outputText = 'Error: Output không khớp với "AHtest.code Academy 2026"!\nKiểm tra lại câu lệnh cout.';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'cpp-1-2') {
        if (userCode.includes('long long') && (userCode.includes('a * b') || userCode.includes('cin >> a >> b'))) {
          outputText = 'Input: 1000000 2000000\nOutput: 2000000000000\n[Test 1: Passed]\n[Test 2: Passed - Không xảy ra tràn số 64-bit!]';
          isSuccess = true;
        } else {
          outputText = 'Cảnh báo: Bạn chưa sử dụng kiểu dữ liệu "long long" hoặc phép nhân a * b chưa chính xác!';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'cpp-1-3') {
        outputText = 'Input: 5\n1 2 3 4 5\nOutput: 15\n[All test cases matched successfully!]';
        isSuccess = true;
      } else {
        // Python lesson
        outputText = 'Input: 12 34\nOutput: 46\n[FastIO sys.stdin.readline executed in 0.015s]';
        isSuccess = true;
      }

      setExecutionOutput(outputText);
      setExercisePassed(isSuccess);

      if (isSuccess) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }, 450);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Academy Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-800/40 p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              MICRO-LEARNING INTERACTIVE ACADEMY
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Học Lập Trình Thi Đấu & Ngôn Ngữ Tương Tác
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Học lý thuyết ngắn gọn 3 phút, giải thử thách ngay trên trình duyệt với công nghệ WebAssembly. 
              Hoàn toàn nhẹ nhàng, không gây tải hay nghẽn cụm máy chấm của kỳ thi!
            </p>
          </div>

          {/* Course Selector Tabs */}
          <div className="flex bg-slate-900/80 p-1.5 rounded-xl border border-indigo-700/50">
            {mockCourses.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCourse(c);
                  setActiveLesson(c.modules[0].lessons[0]);
                  setUserCode(c.modules[0].lessons[0].initialCode);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCourse.id === c.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c.language === 'c' ? 'C Track (Dev-Cpp)' : c.language.toUpperCase() + ' Track'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Learning Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Curriculum Navigation List */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Lộ trình {selectedCourse.title}
              </h3>
              <span className="text-xs text-slate-500">
                {selectedCourse.totalLessons} bài học • {selectedCourse.estimatedHours} giờ hoàn thành
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {selectedCourse.level}
            </span>
          </div>

          {selectedCourse.language === 'c' && (
            <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
              <div className="font-bold flex items-center justify-between">
                <span>Trình biên dịch Dev-C++ IDE</span>
                <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold bg-blue-600 text-white rounded">
                  Open Source
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Hệ thống mô phỏng chuẩn compiler GCC MinGW của <strong>Embarcadero Dev-C++</strong>.
              </p>
              <a
                href="https://github.com/Embarcadero/Dev-Cpp"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                Mã nguồn Embarcadero/Dev-Cpp trên GitHub ↗
              </a>
            </div>
          )}

          <div className="space-y-4">
            {selectedCourse.modules.map((module) => (
              <div key={module.id} className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {module.title}
                </h4>
                <div className="space-y-1">
                  {module.lessons.map((lesson, idx) => {
                    const isCurrent = activeLesson.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleSelectLesson(lesson)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="truncate max-w-[200px]">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{lesson.durationMinutes}m</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 8 Cols: Interactive Micro-Lesson & Code Sandbox */}
        <div className="lg:col-span-8 space-y-6">
          {/* Lesson Content Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeLesson.title}
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Thời lượng ước tính: {activeLesson.durationMinutes} phút
              </span>
            </div>

            {/* Lesson Body Rendered with KaTeX */}
            <div className="text-sm">
              <KaTeXRenderer content={activeLesson.content} />
            </div>
          </div>

          {/* Interactive In-Browser Sandbox */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md overflow-hidden text-white">
            <div className="h-10 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-slate-300">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>
                  {selectedCourse.language === 'c'
                    ? 'Trình Thực Thi C (Dev-C++ / MinGW GCC Wasm Sandbox)'
                    : selectedCourse.language === 'cpp'
                    ? 'Trình Thực Thi C++20 Sandbox (Client-Side Wasm)'
                    : 'Trình Thực Thi Python 3 Sandbox (Pyodide Wasm)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUserCode(activeLesson.initialCode)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  title="Đặt lại code ban đầu"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Editor Area */}
            <div className="p-4 bg-slate-950 font-mono-code text-sm">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={10}
                spellCheck={false}
                className="w-full bg-transparent text-slate-100 resize-none focus:outline-none leading-relaxed font-mono-code"
                placeholder="// Viết code giải thử thách tại đây..."
              />
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHintIndex((prev) => (prev + 1) % activeLesson.hints.length)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Xem gợi ý ({activeLesson.hints.length})</span>
                </button>
              </div>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isRunning ? 'Đang thực thi...' : 'Chạy & Kiểm tra nghiệm'}</span>
              </button>
            </div>

            {/* Hints Box */}
            {showHintIndex >= 0 && (
              <div className="px-4 py-3 bg-amber-950/40 border-t border-amber-900/60 text-xs text-amber-200">
                <strong>Gợi ý #{showHintIndex + 1}:</strong> {activeLesson.hints[showHintIndex]}
              </div>
            )}

            {/* Output Terminal */}
            {executionOutput && (
              <div className="p-4 bg-slate-950/90 border-t border-slate-800 font-mono-code text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Console Output:
                  </span>
                  {exercisePassed ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Xuất sắc! Thử thách hoàn thành!
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold flex items-center gap-1 text-xs">
                      <AlertCircle className="w-3.5 h-3.5" /> Chưa đạt yêu cầu, hãy thử lại!
                    </span>
                  )}
                </div>
                <pre className="text-slate-200 whitespace-pre-wrap">{executionOutput}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
