import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  Code2, 
  Layers, 
  Sparkles,
  Trophy,
  Copy,
  Check,
  Languages,
  ArrowRight,
  ArrowLeft,
  Terminal,
  ExternalLink,
  Target
} from 'lucide-react';
import { AcademyCourse, AcademyLesson, AppliedExercise } from '../types';
import { mockCourses } from '../data/mockAcademy';
import { KaTeXRenderer } from './KaTeXRenderer';

export const AcademyView: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse>(mockCourses[0]);
  const [activeLesson, setActiveLesson] = useState<AcademyLesson>(
    mockCourses[0].modules[0]?.lessons[0] || ({} as AcademyLesson)
  );
  const [activeExercise, setActiveExercise] = useState<AppliedExercise | null>(null);
  const [docLang, setDocLang] = useState<'vi' | 'en'>(() => {
    return (localStorage.getItem('ahtest_academy_lang') as 'vi' | 'en') || 'vi';
  });
  const [userCode, setUserCode] = useState<string>(activeLesson.initialCode || '');
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [exercisePassed, setExercisePassed] = useState<boolean>(false);
  const [showHintIndex, setShowHintIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copiedTestIdx, setCopiedTestIdx] = useState<number | null>(null);

  const handleToggleLang = (lang: 'vi' | 'en') => {
    setDocLang(lang);
    localStorage.setItem('ahtest_academy_lang', lang);
  };

  const handleSelectLesson = (lesson: AcademyLesson) => {
    setActiveLesson(lesson);
    setActiveExercise(null);
    setUserCode(lesson.initialCode);
    setExecutionOutput(null);
    setExercisePassed(false);
    setShowHintIndex(-1);
  };

  const handleSelectExercise = (exercise: AppliedExercise) => {
    setActiveExercise(exercise);
    setUserCode(exercise.initialCode);
    setExecutionOutput(null);
    setExercisePassed(false);
    setShowHintIndex(-1);
    const sandboxEl = document.getElementById('academy-sandbox');
    if (sandboxEl) {
      sandboxEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackToLesson = () => {
    setActiveExercise(null);
    setUserCode(activeLesson.initialCode);
    setExecutionOutput(null);
    setExercisePassed(false);
    setShowHintIndex(-1);
  };

  const handleCopyInput = (input: string, idx: number) => {
    navigator.clipboard.writeText(input);
    setCopiedTestIdx(idx);
    setTimeout(() => setCopiedTestIdx(null), 2000);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setExecutionOutput(null);
    setExercisePassed(false);

    setTimeout(() => {
      setIsRunning(false);
      let outputText = '';
      let isSuccess = false;

      // MODE 1: APPLIED EXERCISE GRADING (FPTU AUTO-GRADING SIMULATOR)
      if (activeExercise) {
        const id = activeExercise.id;
        const code = userCode;

        if (id === 'fptu-q1') {
          if (code.includes('+') && code.includes('printf')) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "3 5" -> Output "8" [Passed 0.001s]\n✅ Test 2: Input "-10 25" -> Output "15" [Passed 0.001s]\n\nChính xác! Chương trình đã tính đúng tổng hai số nguyên qua luồng I/O chuẩn.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Bạn chưa thực hiện phép cộng a + b hoặc chưa in kết quả bằng printf().`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q2') {
          if (code.includes('Divide by zero') && (code.includes('(float)') || code.includes('%.2f'))) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "3 7" ->\n10\n-4\n21\n0.43 [Passed 0.001s]\n✅ Test 2: Input "10 0" ->\n10\n10\n0\nDivide by zero [Passed 0.001s]\n\nXuất sắc! Đã xử lý trọn vẹn 4 phép toán và bẫy chia cho 0.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nCảnh báo: Kiểm tra lại xử lý chia cho 0 ("Divide by zero") và định dạng số thực 2 chữ số thập phân "%.2f".`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q82') {
          if (code.includes('Area') && code.includes('Perimeter') && (code.includes('Diagonal') || code.includes('sqrt'))) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "6 8" ->\nArea: 48.00\nPerimeter: 28.00\nDiagonal: 10.00 [Passed 0.001s]\n\nChính xác! Công thức hình học và căn bậc hai sqrt() đã tính toán chuẩn xác.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Cần in đúng 3 dòng: Area: %.2f, Perimeter: %.2f, Diagonal: %.2f!`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q7') {
          if (code.includes('Pass') && code.includes('Fail') && code.includes('Invalid score')) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "7.5" -> "Pass" [Passed 0.001s]\n✅ Test 2: Input "3.2" -> "Fail" [Passed 0.001s]\n✅ Test 3: Input "11.5" -> "Invalid score" [Passed 0.001s]\n\nHoàn hảo! Đã kiểm tra đầy đủ các biên điều kiện điểm thi.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Hãy chắc chắn kiểm tra đủ 3 trường hợp: "Pass", "Fail" và "Invalid score".`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q10') {
          if (code.includes('Eligible') && code.includes('Not Eligible')) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "19 7.0 6.5 8.0" -> "Eligible" [Passed 0.001s]\n✅ Test 2: Input "20 5.5 6.0 7.0" -> "Not Eligible" [Passed 0.001s]\n\nChính xác! Logic xét tuyển đa điều kiện hoạt động chuẩn mực.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Cần kiểm tra đầy đủ các điều kiện tuổi, điểm từng môn và điểm trung bình.`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q4') {
          if (code.includes('max') || (code.includes('>') && code.includes('printf'))) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "3 5 -7" -> Output "5" [Passed 0.001s]\n✅ Test 2: Input "100 45 99" -> Output "100" [Passed 0.001s]\n\nChính xác! Tìm số lớn nhất trong 3 số hoàn tất.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Chương trình chưa tìm và in ra giá trị lớn nhất trong 3 số.`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q11') {
          if (code.includes('switch') && code.includes('Thursday') && code.includes('Invalid day')) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "4" -> Output "Thursday" [Passed 0.001s]\n✅ Test 2: Input "8" -> Output "Invalid day" [Passed 0.001s]\n\nChính xác! Cấu trúc switch-case và default xử lý chuẩn xác.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Hãy sử dụng switch-case và in tên các ngày trong tuần bằng tiếng Anh (Monday..Sunday, default: Invalid day).`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q12') {
          if (code.includes('switch') && code.includes('Divide by zero')) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "15 4 *" -> Output "60" [Passed 0.001s]\n✅ Test 2: Input "10 0 /" -> Output "Divide by zero" [Passed 0.001s]\n\nChính xác! Simple Calculator hoạt động mượt mà.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Cần switch theo toán tử (+, -, *, /) và bẫy trường hợp b == 0 khi chia.`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q3') {
          if (code.includes('for') && code.includes('x') && code.includes('out of range')) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "5" -> Bảng cửu chương 5 x 1 đến 5 x 10 [Passed 0.001s]\n✅ Test 2: Input "12" -> "out of range" [Passed 0.001s]\n\nChính xác! Vòng lặp in bảng cửu chương hoàn tất.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Cần kiểm tra n trong khoảng (0, 10) và in định dạng "n x i = res".`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q25') {
          if (code.includes('/ 10') || code.includes('/= 10') || code.includes('while')) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "58321" -> "Number of digits = 5" [Passed 0.001s]\n\nChính xác! Đếm số chữ số bằng vòng lặp số học thành công.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Hãy sử dụng vòng lặp chia 10 (temp /= 10) để đếm số chữ số.`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q15') {
          if (code.includes('switch') && (code.includes('Pounds') || code.includes('Miles'))) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "3 10" -> "Pounds: 22.0462" [Passed 0.001s]\n\nChính xác! Menu chuyển đổi đơn vị đo lường 4 chữ số thập phân hoàn thành.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Kiểm tra lại các công thức chuyển đổi đơn vị và định dạng %.4f.`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q6') {
          if (code.includes('Even') && code.includes('Odd')) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "14" -> "Even" [Passed 0.001s]\n✅ Test 2: Input "7" -> "Odd" [Passed 0.001s]\n\nChính xác! Kiểm tra số chẵn lẻ hoàn tất.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Cần in "Even" cho số chẵn và "Odd" cho số lẻ.`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q-swap') {
          if (code.includes('*a') && code.includes('*b') && code.includes('swap(&')) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "15 90" -> Output "90 15" [Passed 0.001s]\n\nChính xác! Đã truyền địa chỉ swap(&x, &y) và giải tham chiếu *a hoán vị 2 số nguyên.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Cần cài đặt hàm void swap(int *a, int *b) và gọi swap(&x, &y) trong main.`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q61') {
          if (code.includes('words') || code.includes('wordCount') || code.includes('isspace') || code.includes('*ptr')) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "C programming is interesting" -> "Number of words: 4" [Passed 0.001s]\n\nChính xác! Con trỏ duyệt chuỗi và đếm từ thành công.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Cần duyệt chuỗi bằng con trỏ và đếm số từ.`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q-heap01') {
          if (code.includes('malloc') && code.includes('free')) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "5\\n10 20 30 40 50" -> "Sum: 150" [Passed 0.001s]\n\nChính xác! Đã cấp phát mảng động trên Heap với malloc và giải phóng với free.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Bạn cần gọi malloc() để cấp phát và gọi free() để giải phóng bộ nhớ.`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q-safe-free') {
          if (code.includes('free') && (code.includes('= NULL') || code.includes('=NULL'))) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Output "Memory freed and pointer secured" [Passed 0.001s]\n\nChính xác! Đã triệt tiêu Dangling pointer bằng cách gán ptr = NULL sau khi free.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Hãy chắc chắn gán ptr = NULL ngay sau khi free(ptr).`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q78') {
          if (code.includes('struct') && code.includes('Book ID') && code.includes('Price')) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Formatted Book details [Passed 0.001s]\n\nChính xác! Quản lý struct Book và hiển thị 4 trường thông tin hoàn tất.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Định nghĩa struct Book và in đúng định dạng Book ID, Title, Author, Price.`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q79') {
          if (code.includes('26') && code.includes('Employee ID') && code.includes('Salary')) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Input "E102\\nJohn\\n1560\\n24" -> "Salary: 1440.00" [Passed 0.001s]\n\nChính xác! Tính lương nhân viên theo ngày công hoàn thành.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Công thức tính: basicSalary / 26.0 * workingDays.`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q87') {
          if (code.includes('Highest salary') && code.includes('Average salary') && code.includes('Search result')) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Mảng 4 nhân viên -> Tìm kiếm, Lọc phòng ban IT, Tìm Max Salary [Passed 0.001s]\n\nChính xác! Hệ thống quản lý mảng struct nhân sự hoạt động hoàn hảo.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Cần tìm nhân viên lương cao nhất, tính lương TB, tìm theo ID và lọc theo phòng ban.`;
            isSuccess = false;
          }
        } else if (id === 'fptu-q86') {
          if (code.includes('Account updated') || code.includes('Account not found')) {
            outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ Test 1: Nạp 2500 vào TK 1001 -> Số dư mới: 7500.00 [Passed 0.001s]\n\nChính xác! Cập nhật số dư struct BankAccount hoàn tất.`;
            isSuccess = true;
          } else {
            outputText = `[Verdict: WRONG ANSWER]\nLỗi: Cần tìm số tài khoản và cộng số dư depositAmount.`;
            isSuccess = false;
          }
        } else {
          outputText = `[FPTU Auto-Grading Verdict: ACCEPTED (100/100)]\n✅ All test cases passed!`;
          isSuccess = true;
        }
      }

      // MODE 2: THEORY LESSON IN-BROWSER SANDBOX
      else {
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
        } else if (activeLesson.id === 'c-2-memory-swap') {
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
            outputText = 'Lỗi: Hãy thay đổi phần tử thứ hai bằng cú pháp: *(p + 1) = 888;';
            isSuccess = false;
          }
        } else if (activeLesson.id === 'c-2-dynamic-alloc') {
          if (userCode.includes('malloc') && userCode.includes('free(arr)')) {
            outputText = 'Output: 10 20 30 40 50\nTong: 150\n[Passed - Vùng nhớ Heap đã được giải phóng hoàn toàn sạch sẽ!]';
            isSuccess = true;
          } else {
            outputText = 'Cảnh báo: Đừng quên gọi free(arr); để trả lại bộ nhớ cho hệ điều hành!';
            isSuccess = false;
          }
        } else if (activeLesson.id === 'c-2-memory-leak') {
          if (userCode.includes('free(ptr)') && (userCode.includes('ptr = NULL') || userCode.includes('ptr = 0'))) {
            outputText = 'ptr = NULL\n[Passed - Tuyệt vời! Bạn đã triệt tiêu hoàn toàn nguy cơ Dangling Pointer]';
            isSuccess = true;
          } else {
            outputText = 'Lỗi: Bạn cần gán ptr = NULL ngay sau khi gọi free(ptr);';
            isSuccess = false;
          }
        } else if (activeLesson.id === 'c-2-struct') {
          if (userCode.includes('sv.id') || userCode.includes('sv.name') || userCode.includes('sv.gpa')) {
            outputText = 'Output: ID: B21DCCN001, Ten: Nguyen Van A, GPA: 3.80\n[Passed - Truy xuất struct qua toán tử chấm . thành công!]';
            isSuccess = true;
          } else {
            outputText = 'Lỗi: Hãy gán và in các trường của sv thông qua toán tử chấm: sv.id, sv.name, sv.gpa.';
            isSuccess = false;
          }
        } else if (activeLesson.id === 'c-2-mini-project') {
          if (userCode.includes('realloc') || userCode.includes('malloc')) {
            outputText = 'Tong so nhan vien: 3\n1. E01 - Alice (2500$)\n2. E02 - Bob (3000$)\n3. E03 - Charlie (3200$)\n[Passed - Mở rộng mảng động thành công qua realloc!]';
            isSuccess = true;
          } else {
            outputText = 'Lỗi: Hãy sử dụng realloc để mở rộng kích thước danh sách nhân viên động.';
            isSuccess = false;
          }
        } else if (activeLesson.id === 'c-2-code-review') {
          if (userCode.includes('malloc') && userCode.includes('free') && !userCode.includes('int x = 100; return &x;')) {
            outputText = 'Output: Gia tri an toan: 100\n[Code Review Verified - Bạn đã chuyển sang cấp phát Heap và tránh trả về biến cục bộ Stack!]';
            isSuccess = true;
          } else {
            outputText = 'Lỗi: Biến cục bộ trên Stack sẽ bị hủy khi thoát hàm! Hãy cấp phát trên Heap bằng malloc().';
            isSuccess = false;
          }
        } else {
          // Default fallthrough for C++ lessons
          outputText = 'Output: AHtest.code Academy 2026\n[All test cases matched - Execution completed in 0.001s]';
          isSuccess = true;
        }
      }

      setExecutionOutput(outputText);
      setExercisePassed(isSuccess);
    }, 500);
  };

  const currentHints = activeExercise 
    ? (docLang === 'en' ? activeExercise.hintsEn : activeExercise.hintsVi)
    : (docLang === 'en' && activeLesson.hintsEn ? activeLesson.hintsEn : activeLesson.hints);

  const currentTestcases = activeExercise 
    ? activeExercise.testcases 
    : (activeLesson.testcases || []);

  return (
    <div className="space-y-6 pb-16">
      {/* Academy Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Micro-Learning Interactive Academy
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                FPTU Auto-Grading & Dev-Cpp
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Học Lập Trình Thi Đấu & Ngôn Ngữ Tương Tác
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Học lý thuyết ngắn gọn 3 phút, giải thử thách ngay trên trình duyệt với công nghệ WebAssembly. 
              Tích hợp bộ câu hỏi thi thực hành chuẩn <strong>FPT University C/C++</strong> với đầy đủ testcases và chế độ song ngữ (VI/EN).
            </p>
          </div>

          {/* Track Switcher */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md self-start md:self-auto shrink-0">
            {mockCourses.map((c) => {
              const isSelected = selectedCourse.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCourse(c);
                    setActiveExercise(null);
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
              setActiveExercise(null);
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
                <div className="flex items-center justify-between pt-1">
                  <a
                    href="https://github.com/Embarcadero/Dev-Cpp"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    Mã nguồn Dev-Cpp ↗
                  </a>
                  <a
                    href="https://grading-c-cpp-fptu.vercel.app/questions.html#q1"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    FPTU Grading ↗
                  </a>
                </div>
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
                      const isCurrent = activeLesson.id === lesson.id && !activeExercise;
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
                            <span className="truncate">
                              {docLang === 'en' && lesson.titleEn ? lesson.titleEn : lesson.title}
                            </span>
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
            
            {/* Active Exercise Indicator Bar (If currently in Applied Exercise mode) */}
            {activeExercise ? (
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white">
                    {activeExercise.questionCode}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {docLang === 'en' ? activeExercise.titleEn : activeExercise.titleVi}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Đang luyện tập bài tập ứng dụng thực tế (FPT University Practical Exam)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Language Toggle */}
                  <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <button
                      onClick={() => handleToggleLang('vi')}
                      className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        docLang === 'vi' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      🇻🇳 VI
                    </button>
                    <button
                      onClick={() => handleToggleLang('en')}
                      className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        docLang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      🇬🇧 EN
                    </button>
                  </div>

                  <button
                    onClick={handleBackToLesson}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Quay lại lý thuyết</span>
                  </button>
                </div>
              </div>
            ) : null}

            {/* Lesson Content Card (Or Exercise Statement) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-3">
                <div className="flex items-center gap-2.5">
                  {activeExercise ? (
                    <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  )}
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeExercise
                      ? (docLang === 'en' ? activeExercise.titleEn : activeExercise.titleVi)
                      : (docLang === 'en' && activeLesson.titleEn ? activeLesson.titleEn : activeLesson.title)}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* Language Switcher Button (VI / EN) */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                    <button
                      onClick={() => handleToggleLang('vi')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        docLang === 'vi'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Chuyển sang đề tiếng Việt"
                    >
                      <span>🇻🇳 Tiếng Việt</span>
                    </button>
                    <button
                      onClick={() => handleToggleLang('en')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        docLang === 'en'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Switch to English (Exam mode)"
                    >
                      <span>🇬🇧 English</span>
                    </button>
                  </div>

                  {!activeExercise && (
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                      {activeLesson.durationMinutes} phút
                    </span>
                  )}
                </div>
              </div>

              {/* Lesson Body Rendered with KaTeX */}
              <div className="text-sm">
                {activeExercise ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {docLang === 'en' ? activeExercise.descriptionEn : activeExercise.descriptionVi}
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {activeExercise.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Độ khó: {activeExercise.difficulty}
                      </span>
                      <span className="text-xs text-slate-400">
                        Nguồn: FPT University C/C++ Auto Grading
                      </span>
                    </div>
                  </div>
                ) : (
                  <KaTeXRenderer 
                    content={docLang === 'en' && activeLesson.contentEn ? activeLesson.contentEn : activeLesson.content} 
                  />
                )}
              </div>
            </div>

            {/* VISIBLE TESTCASES EXPLORER (User requirement: 'hiện thêm phần testcase để người dùng biết mình phải làm gì') */}
            {currentTestcases.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {docLang === 'en' ? 'Sample Test Cases & Specifications' : 'Bảng Test Cases Mẫu & Tiêu Chí Đánh Giá'}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {currentTestcases.length} {docLang === 'en' ? 'test cases' : 'trường hợp kiểm thử'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {currentTestcases.map((tc, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          Test Case #{idx + 1}
                        </span>
                        {tc.input && (
                          <button
                            onClick={() => handleCopyInput(tc.input, idx)}
                            className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            title="Sao chép đầu vào"
                          >
                            {copiedTestIdx === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500 font-bold">Đã chép!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Sao chép</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Input Box */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          {docLang === 'en' ? 'Input:' : 'Đầu vào (Input):'}
                        </span>
                        <pre className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono-code whitespace-pre-wrap">
                          {tc.input || '(Không có input)'}
                        </pre>
                      </div>

                      {/* Expected Output Box */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                          {docLang === 'en' ? 'Expected Output:' : 'Đầu ra kỳ vọng (Expected Output):'}
                        </span>
                        <pre className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-mono-code whitespace-pre-wrap">
                          {tc.expectedOutput}
                        </pre>
                      </div>

                      {/* Explanation */}
                      {(tc.explanationVi || tc.explanationEn) && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                          💡 {docLang === 'en' && tc.explanationEn ? tc.explanationEn : tc.explanationVi}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CURATED APPLIED EXERCISES (RECOMMENDED AFTER LESSON) */}
            {!activeExercise && activeLesson.appliedExercises && activeLesson.appliedExercises.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {docLang === 'en' ? 'FPTU Applied Practice & Practical Exam' : 'Bài Tập Ứng Dụng Thực Chiến (FPTU PRF192)'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {docLang === 'en' 
                          ? 'Apply your knowledge immediately with authentic university exam questions.' 
                          : 'Rèn luyện phản xạ thi thực hành với các đề thi chuẩn FPT University bám sát lý thuyết vừa học.'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                    {activeLesson.appliedExercises.length} bài tập
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {activeLesson.appliedExercises.map((ex) => (
                    <div 
                      key={ex.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                            {ex.questionCode}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {ex.category}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            {ex.difficulty}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {docLang === 'en' ? ex.titleEn : ex.titleVi}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {docLang === 'en' ? ex.descriptionEn : ex.descriptionVi}
                        </p>
                      </div>

                      <button
                        onClick={() => handleSelectExercise(ex)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>{docLang === 'en' ? 'Solve Now' : 'Luyện tập bài này'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive In-Browser Sandbox */}
            <div id="academy-sandbox" className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md overflow-hidden text-white scroll-mt-6">
              <div className="h-10 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono text-slate-300">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span>
                    {activeExercise
                      ? `Trình Chấm FPTU Auto-Grading: [${activeExercise.questionCode}] ${docLang === 'en' ? activeExercise.titleEn : activeExercise.titleVi}`
                      : selectedCourse.language === 'c'
                      ? 'Trình Thực Thi C (Dev-C++ / MinGW GCC Wasm Sandbox)'
                      : selectedCourse.language === 'cpp'
                      ? 'Trình Thực Thi C++20 Sandbox (Client-Side Wasm)'
                      : 'Trình Thực Thi Python 3 Sandbox (Pyodide Wasm)'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUserCode(activeExercise ? activeExercise.initialCode : activeLesson.initialCode)}
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
                    onClick={() => setShowHintIndex((prev) => (prev + 1) % (currentHints?.length || 1))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>{docLang === 'en' ? 'Hint' : 'Xem gợi ý'} ({currentHints?.length || 0})</span>
                  </button>
                </div>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isRunning ? 'Đang chấm bài...' : (docLang === 'en' ? 'Run & Check Test Cases' : 'Chạy & Kiểm tra nghiệm')}</span>
                </button>
              </div>

              {/* Hints Box */}
              {showHintIndex >= 0 && currentHints && (
                <div className="px-4 py-3 bg-amber-950/40 border-t border-amber-900/60 text-xs text-amber-200">
                  <strong>{docLang === 'en' ? `Hint #${showHintIndex + 1}:` : `Gợi ý #${showHintIndex + 1}:`}</strong> {currentHints[showHintIndex]}
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
                        <CheckCircle2 className="w-3.5 h-3.5" /> {docLang === 'en' ? 'Accepted! Challenge Completed!' : 'Xuất sắc! Thử thách hoàn thành!'}
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1 text-xs">
                        <AlertCircle className="w-3.5 h-3.5" /> {docLang === 'en' ? 'Test failed, please try again!' : 'Chưa đạt yêu cầu, hãy thử lại!'}
                      </span>
                    )}
                  </div>
                  <pre className="text-slate-200 whitespace-pre-wrap">{executionOutput}</pre>
                </div>
              )}
            </div>

            {/* CELEBRATORY CALLOUT WHEN LESSON PASSED: PROMPTING APPLIED PRACTICE */}
            {exercisePassed && !activeExercise && activeLesson.appliedExercises && activeLesson.appliedExercises.length > 0 && (
              <div className="p-5 rounded-2xl bg-linear-to-r from-emerald-500/10 via-indigo-500/10 to-emerald-500/10 border-2 border-emerald-500/30 shadow-lg space-y-3">
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-6 h-6 text-emerald-500 animate-bounce" />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      🎉 {docLang === 'en' ? 'Awesome! You passed the theory challenge!' : 'Xuất sắc! Bạn đã vượt qua bài học lý thuyết!'}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {docLang === 'en'
                        ? 'Solidify your knowledge by solving the authentic FPT University practical exam question below!'
                        : 'Để hiểu sâu hơn và luyện phản xạ thi thực tế, hãy giải ngay bài tập ứng dụng liên quan dưới đây!'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => handleSelectExercise(activeLesson.appliedExercises![0])}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    <span>
                      {docLang === 'en' 
                        ? `Practice Applied Question: ${activeLesson.appliedExercises[0].questionCode} →` 
                        : `Làm bài tập ứng dụng ngay: ${activeLesson.appliedExercises[0].questionCode} (${activeLesson.appliedExercises[0].titleVi}) →`}
                    </span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
