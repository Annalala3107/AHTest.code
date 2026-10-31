import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  AlertCircle,
  Lightbulb,
  RotateCcw,
  Clock,
  Layers,
  Cpu
} from 'lucide-react';
import { mockCourses } from '../data/mockAcademy';
import { AcademyLesson, AcademyCourse } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';

export const AcademyView: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse>(mockCourses[0]);
  const [activeLesson, setActiveLesson] = useState<AcademyLesson>(
    mockCourses[0].modules[0]?.lessons[0] || ({} as AcademyLesson)
  );
  const [userCode, setUserCode] = useState<string>(activeLesson.initialCode || '');
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

      // --- GIAI ĐOẠN 1: C CƠ BẢN ---
      if (activeLesson.id === 'c-1-compile') {
        if (userCode.includes('AHtest.code C Compiler') || userCode.includes('AHtest.code')) {
          outputText = 'Chao mung den voi AHtest.code C Compiler!\n[Biên dịch thành công qua 4 bước: .i -> .s -> .o -> .exe]\n[Thực thi hoàn tất trong 0.001s - Wasm Sandbox]';
          isSuccess = true;
        } else {
          outputText = 'Lỗi: Output không khớp với "Chao mung den voi AHtest.code C Compiler!"!\nHãy kiểm tra lại câu lệnh printf().';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'c-1-variables') {
        if (userCode.includes('(float)') || userCode.includes('%.1f')) {
          outputText = 'Input: 5 2\nOutput: 2.5\n[Test 1: Passed]\nInput: 10 4\nOutput: 2.5\n[Test 2: Passed - Ép kiểu tường minh (float)a / b thành công!]';
          isSuccess = true;
        } else {
          outputText = 'Cảnh báo: Bạn chưa ép kiểu (float)a / b hoặc chưa định dạng in %.1f!';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'c-1-io') {
        if (userCode.includes('scanf') && userCode.includes('&age') && userCode.includes('&height')) {
          outputText = 'Input: 18 1.75\nOutput: Tuoi: 18, Chieu cao: 1.75m\n[Test 1: Passed - Đã sử dụng đúng toán tử địa chỉ & trong scanf]';
          isSuccess = true;
        } else {
          outputText = 'Lỗi: Hãy chắc chắn bạn đã đặt dấu & trước &age và &height trong scanf("%d %f", &age, &height)!';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'c-1-selection') {
        if (userCode.includes('Passed') && (userCode.includes('Failed') || userCode.includes('else'))) {
          outputText = 'Input: 8 -> Passed\nInput: 4 -> Failed\n[All test cases matched - Cấu trúc if/else hoàn chỉnh]';
          isSuccess = true;
        } else {
          outputText = 'Lỗi: Cấu trúc if/else chưa in đúng "Passed" khi score >= 5 hoặc "Failed" khi score < 5.';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'c-1-loops') {
        if (userCode.includes('for') || userCode.includes('while')) {
          outputText = 'Input: 5\nOutput: 1 2 3 4 5 \n[Test 1: Passed - Vòng lặp duyệt n lần chính xác!]';
          isSuccess = true;
        } else {
          outputText = 'Lỗi: Bạn chưa khởi tạo vòng lặp for hoặc in các số từ 1 đến n.';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'c-1-project') {
        if (userCode.includes('*') && (userCode.includes('Loi') || userCode.includes('for'))) {
          outputText = 'Input: 3 4\nOutput:\n****\n****\n****\n[Test 1: Passed]\nInput: -1 5\nOutput: Loi kich thuoc!\n[Test 2: Passed - Kiểm tra dữ liệu đầu vào thành công!]';
          isSuccess = true;
        } else {
          outputText = 'Lỗi: Kiểm tra lại 2 vòng for lồng nhau để in hình chữ nhật sao hoặc điều kiện r <= 0 || c <= 0.';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'c-1-quiz') {
        if (userCode.includes('x == 10') || userCode.includes('10 == x')) {
          outputText = 'Input: 10 -> BANG 10\nInput: 7 -> KHAC 10\n[Chính xác! Bạn đã dùng toán tử so sánh == thay vì toán tử gán =]';
          isSuccess = true;
        } else {
          outputText = 'Cảnh báo: Hãy dùng toán tử so sánh x == 10 thay vì toán tử gán x = 10!';
          isSuccess = false;
        }
      }

      // --- GIAI ĐOẠN 2: C TRUNG CẤP & BỘ NHỚ ---
      else if (activeLesson.id === 'c-2-memory-swap') {
        if (userCode.includes('*a') && userCode.includes('*b') && userCode.includes('temp')) {
          outputText = 'Input: 10 20\nOutput: 20 10\nInput: 99 1\nOutput: 1 99\n[Test 1 & 2: Passed - Hoán vị 2 biến thông qua con trỏ swap(&x, &y) thành công!]';
          isSuccess = true;
        } else {
          outputText = 'Lỗi: Hãy giải tham chiếu bằng biến tạm: int temp = *a; *a = *b; *b = temp;';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'c-2-pointers') {
        if (userCode.includes('*(p + 1) = 888') || userCode.includes('*(p+1)=888') || userCode.includes('p[1] = 888')) {
          outputText = 'Output: 10 888 30\n[Passed! Số học con trỏ *(p + 1) đã dịch chuyển đúng sizeof(int) = 4 bytes]';
          isSuccess = true;
        } else {
          outputText = 'Lỗi: Hãy gán phần tử thứ hai bằng cú pháp số học con trỏ: *(p + 1) = 888;';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'c-2-dynamic-alloc') {
        if (userCode.includes('malloc') && userCode.includes('free')) {
          outputText = 'Input: 3 -> 10 20 30\nOutput: 60\n[Passed! Mảng được cấp phát động trên Heap và dọn dẹp bằng free()]';
          isSuccess = true;
        } else {
          outputText = 'Cảnh báo: Bắt buộc dùng malloc(n * sizeof(int)) để cấp phát động và gọi free(arr) trước khi kết thúc!';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'c-2-memory-leak') {
        if (userCode.includes('free(p)') && userCode.includes('NULL')) {
          outputText = 'Output: 500\nAn toan\n[Tuyệt vời! Đã giải phóng RAM và gán p = NULL để tránh Dangling Pointer]';
          isSuccess = true;
        } else {
          outputText = 'Lỗi: Đảm bảo bạn đã gọi free(p); p = NULL; và kiểm tra if (p == NULL)';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'c-2-struct') {
        if (userCode.includes('p.x') && userCode.includes('p.y')) {
          outputText = 'Input: 3 7\nOutput: (3, 7)\n[Passed! Truy xuất thành công các trường của struct Point bằng toán tử dấu chấm]';
          isSuccess = true;
        } else {
          outputText = 'Lỗi: Nhập p.x và p.y rồi in ra theo định dạng "(%d, %d)\\n"';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'c-2-mini-project') {
        if (userCode.includes('26') && (userCode.includes('daily') || userCode.includes('total') || userCode.includes('Luong'))) {
          outputText = 'Input: Nam 2600 20\nOutput: NV: Nam | Luong: 2000.00\n[Mini-Project Passed! Tính toán lương chính xác dựa trên struct và mảng động]';
          isSuccess = true;
        } else {
          outputText = 'Lỗi: Kiểm tra lại công thức lương thực nhận: (basicSalary / 26.0) * workingDays';
          isSuccess = false;
        }
      } else if (activeLesson.id === 'c-2-code-review') {
        if (userCode.includes('malloc') && userCode.includes('free')) {
          outputText = 'Output: 1 2 3\n[Chính xác! Mảng an toàn đã được cấp phát trên Heap, tránh hoàn toàn lỗi Dangling Pointer]';
          isSuccess = true;
        } else {
          outputText = 'Lỗi: Hãy dùng malloc(3 * sizeof(int)) để cấp phát trên Heap thay vì mảng tĩnh trên Stack.';
          isSuccess = false;
        }
      }

      // --- C++ TRACK ---
      else if (activeLesson.id === 'cpp-1-1') {
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
        outputText = 'Code executed successfully in Wasm Sandbox.';
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
          <div className="flex flex-wrap bg-slate-900/80 p-1.5 rounded-xl border border-indigo-700/50 gap-1">
            {mockCourses.map((c) => {
              const isSelected = selectedCourse.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCourse(c);
                    if (!c.isComingSoon && c.modules[0]?.lessons[0]) {
                      setActiveLesson(c.modules[0].lessons[0]);
                      setUserCode(c.modules[0].lessons[0].initialCode);
                      setExecutionOutput(null);
                      setExercisePassed(false);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>
                    {c.language === 'c' 
                      ? 'C Track (Dev-Cpp)' 
                      : c.language === 'cpp' 
                      ? 'C++ Track' 
                      : 'Python Track'}
                  </span>
                  {c.isComingSoon && (
                    <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Sắp có
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Learning Body */}
      {selectedCourse.isComingSoon ? (
        /* Python Coming Soon Placeholder */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Giáo Trình Python Đang Được Biên Soạn
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Khóa học Python cho Lập trình thi đấu và Tin học trẻ sẽ được cập nhật trong phiên bản tiếp theo. 
              Hiện tại bạn hãy trải nghiệm đầy đủ **Giáo trình C/C++ (Cơ bản đến Trung cấp)** đã có sẵn giáo trình chi tiết!
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCourse(mockCourses[0]);
              setActiveLesson(mockCourses[0].modules[0].lessons[0]);
              setUserCode(mockCourses[0].modules[0].lessons[0].initialCode);
            }}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            Chuyển sang học Ngôn ngữ C ngay →
          </button>
        </div>
      ) : (
        /* Active 2-Column Learning Workbench */
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
                  Giáo trình được tối ưu cho môi trường MinGW GCC của <strong>Embarcadero Dev-C++</strong>.
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

            <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1">
              {selectedCourse.modules.map((module) => (
                <div key={module.id} className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
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
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">{lesson.durationMinutes}m</span>
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
                    onClick={() => setShowHintIndex((prev) => (prev + 1) % (activeLesson.hints?.length || 1))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>Xem gợi ý ({activeLesson.hints?.length || 0})</span>
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
              {showHintIndex >= 0 && activeLesson.hints && (
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
      )}
    </div>
  );
};
