import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileArchive, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Download, 
  FileCode, 
  Clock, 
  HardDrive, 
  Sparkles,
  Info,
  Check,
  Cpu
} from 'lucide-react';
import { ProblemPackage, ImportedTestCase } from '../types';

export const ProblemImporterView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [benchmarkResult, setBenchmarkResult] = useState<{ maxTime: number; suggestedLimit: number } | null>(null);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  // Mock initial imported package
  const [currentPackage, setCurrentPackage] = useState<ProblemPackage>({
    title: 'Đếm Cặp Số Nguyên Tố Cùng Nhau (Coprime Pairs)',
    slug: 'coprime_pairs_2026',
    timeLimit: 1.0,
    memoryLimit: 256,
    category: 'Số học & Sàng nguyên tố',
    difficulty: 'Medium',
    tags: ['Math', 'Number Theory', 'Inclusion-Exclusion', 'Sieve'],
    author: 'Nguyễn Tiến Trung (THPT Chuyên Lam Sơn)',
    source: 'Kỳ thi Học sinh giỏi Duyên hải Bắc Bộ 2026',
    statement: `Cho dãy gồm $N$ số nguyên dương $A_1, A_2, \\dots, A_N$.
Hãy đếm số lượng cặp chỉ số $(i, j)$ sao cho $1 \\le i < j \\le N$ và:
$$\\gcd(A_i, A_j) = 1$$

Với $\\gcd(x, y)$ là ước chung lớn nhất của hai số $x$ và $y$.`,
    inputFormat: `* Dòng 1: Số nguyên dương $N$ ($2 \\le N \\le 10^5$).
* Dòng 2: $N$ số nguyên dương $A_1, A_2, \\dots, A_N$ ($1 \\le A_i \\le 10^6$).`,
    outputFormat: `In ra một số nguyên duy nhất là số cặp nguyên tố cùng nhau.`,
    constraints: `* Subtask 1 (30% điểm): $N \\le 1000$.
* Subtask 2 (70% điểm): $N \\le 10^5, A_i \\le 10^6$.`,
    tests: [
      { id: 1, inputName: 'TEST01/COPRIME.INP', outputName: 'TEST01/COPRIME.OUT', inputContent: '4\n2 3 4 5', outputContent: '5', sizeBytes: 120, status: 'VALID' },
      { id: 2, inputName: 'TEST02/COPRIME.INP', outputName: 'TEST02/COPRIME.OUT', inputContent: '5\n2 4 6 8 10', outputContent: '0', sizeBytes: 250, status: 'VALID' },
      { id: 3, inputName: 'TEST03/COPRIME.INP', outputName: 'TEST03/COPRIME.OUT', inputContent: '100\n...', outputContent: '4210', sizeBytes: 1420, status: 'VALID' },
      { id: 4, inputName: 'TEST04/COPRIME.INP', outputName: 'TEST04/COPRIME.OUT', inputContent: '5000\n...', outputContent: '120531', sizeBytes: 24500, status: 'VALID' },
      { id: 5, inputName: 'TEST05/COPRIME.INP', outputName: 'TEST05/COPRIME.OUT', inputContent: '100000\n...', outputContent: '4821034', sizeBytes: 850200, status: 'VALID' },
    ],
    modelSolutionCpp: `#include <bits/stdc++.h>
using namespace std;

// Model solution using Mobius inversion / Sieve
int cnt[1000005];
int mu[1000005];

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    // Reference Solution
    return 0;
}`,
    status: 'VALIDATED'
  });

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActiveStep(2);
    }, 800);
  };

  const handleRunBenchmark = () => {
    setIsBenchmarking(true);
    setBenchmarkResult(null);

    // Simulate running model solution on real AHtest.code hardware
    setTimeout(() => {
      setIsBenchmarking(false);
      const maxMeasuredTime = 0.28; // 280ms
      const suggested = 1.0; // 3x safety margin
      setBenchmarkResult({
        maxTime: maxMeasuredTime,
        suggestedLimit: suggested
      });
      setActiveStep(3);
    }, 1200);
  };

  const handlePublish = () => {
    setPublishStatus('SUCCESS');
    setTimeout(() => {
      setActiveStep(4);
    }, 500);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Importer Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 border border-emerald-800/40 p-6 sm:p-8 text-white shadow-lg">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            STANDARDIZED PROBLEM INGESTION PIPELINE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bộ Công Cụ Import & Thẩm Định Đề Thi
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Tự động chuyển đổi gói đề từ Themis, Polygon sang chuẩn AHtest.code. Kiểm tra tính toàn vẹn của test case 
            (bẫy 0-byte, lỗi CRLF, thiếu test góc) và đo benchmark Time Limit bằng code nghiệm mẫu.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 pt-6 mt-4 border-t border-emerald-800/60 text-xs font-semibold">
          {[
            { step: 1, title: '1. Tải lên gói đề (.zip)' },
            { step: 2, title: '2. Thẩm định bộ test' },
            { step: 3, title: '3. Chạy Benchmark Time' },
            { step: 4, title: '4. Xuất bản kho đề' },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setActiveStep(item.step as any)}
              className={`p-2 rounded-lg text-left transition-all cursor-pointer ${
                activeStep === item.step
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : activeStep > item.step
                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                  : 'text-slate-400 bg-slate-900/60'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Upload Zone */}
      {activeStep === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-6 text-center">
          <div 
            onClick={handleSimulateUpload}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-10 cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/30 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
              Kéo thả gói file (.zip) hoặc click để tải lên
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
              Hỗ trợ gói thư mục Themis (chứa các folder con Test01..TestN kèm file .INP/.OUT) hoặc cấu trúc gói Polygon BAPCtools.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold">
              <FileArchive className="w-4 h-4" /> Đã chọn mẫu: COPRIME_PAIRS_THEMIS.zip (1.2 MB)
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleSimulateUpload}
              disabled={isProcessing}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? 'Đang giải nén & phân tích file...' : 'Bắt đầu phân tích cấu trúc đề'}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Package Validation & Metadata Editor */}
      {activeStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Metadata Inspector (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-600" />
                Thông Tin & Cấu Hình Đề Thi
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Themis Package Auto-Detected
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tên bài toán:</label>
                <input
                  type="text"
                  value={currentPackage.title}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Mã bài (Slug):</label>
                  <input
                    type="text"
                    value={currentPackage.slug}
                    onChange={(e) => setCurrentPackage({ ...currentPackage, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Độ khó:</label>
                  <select
                    value={currentPackage.difficulty}
                    onChange={(e) => setCurrentPackage({ ...currentPackage, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tác giả (Author):</label>
                  <input
                    type="text"
                    value={currentPackage.author}
                    onChange={(e) => setCurrentPackage({ ...currentPackage, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nguồn đề (Source/Event):</label>
                  <input
                    type="text"
                    value={currentPackage.source}
                    onChange={(e) => setCurrentPackage({ ...currentPackage, source: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nội dung đề bài (Markdown & KaTeX):</label>
                <textarea
                  value={currentPackage.statement}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, statement: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono-code text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={handleRunBenchmark}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                Chuyển sang Bước 3: Benchmark nghiệm mẫu →
              </button>
            </div>
          </div>

          {/* Test Case Quality Audit (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Kiểm Tra Chất Lượng Bộ Test
              </h3>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {currentPackage.tests.length} tests hợp lệ
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5 text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Toàn vẹn cặp Input/Output:</strong> Tất cả các file `.INP` đều có file `.OUT` đối ứng chính xác.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5 text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Chuẩn hóa ký tự xuống dòng:</strong> Tự động chuyển đổi toàn bộ `CRLF (\\r\\n)` của Windows sang `LF (\\n)` chuẩn Linux.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Kích thước test lớn nhất:</strong> 850 KB (Test #5 - Phù hợp giới hạn I/O của Sandbox).
                </div>
              </div>
            </div>

            {/* Test inventory list */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-50 dark:bg-slate-800 px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 flex justify-between">
                <span>Tên test</span>
                <span>Kích thước</span>
              </div>
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {currentPackage.tests.map((t) => (
                  <div key={t.id} className="p-2.5 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-800 dark:text-slate-200">{t.inputName}</span>
                    <span className="text-slate-400">{(t.sizeBytes / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Benchmarking Sandbox */}
      {activeStep === 3 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-6">
          <div className="max-w-xl mx-auto text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Đo Benchmark Thời Gian Chạy Thực Tế
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chạy code nghiệm mẫu C++ đối đầu với toàn bộ 5 test case trên phần cứng Sandbox của AHtest.code để tự động xác định Time Limit tối ưu nhất.
            </p>
          </div>

          <div className="max-w-2xl mx-auto p-4 rounded-xl bg-slate-950 font-mono-code text-xs text-slate-300">
            <span className="text-slate-500">// Model Solution được nhúng trong gói đề:</span>
            <pre className="mt-2 text-emerald-400">{currentPackage.modelSolutionCpp}</pre>
          </div>

          <div className="text-center">
            <button
              onClick={handleRunBenchmark}
              disabled={isBenchmarking}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isBenchmarking ? 'Đang thực thi 5/5 test cases...' : 'Chạy thử nghiệm Sandbox Benchmarking'}
            </button>
          </div>

          {benchmarkResult && (
            <div className="max-w-xl mx-auto p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-3 animate-fadeIn">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Kết quả đo nghiệm mẫu hoàn tất (5/5 AC):
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <span className="text-slate-400 block mb-1">Thời gian chạy tối đa:</span>
                  <strong className="text-base text-slate-900 dark:text-white">{benchmarkResult.maxTime}s</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <span className="text-slate-400 block mb-1">Time Limit khuyến nghị (3x):</span>
                  <strong className="text-base text-emerald-600 dark:text-emerald-400">{benchmarkResult.suggestedLimit}s</strong>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handlePublish}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  Xác nhận & Chuyển sang Xuất bản →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Publish & Package Export */}
      {activeStep === 4 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Gói Đề Đã Được Chuẩn Hóa Thành Công!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Bài toán <strong>{currentPackage.title}</strong> [{currentPackage.slug}] đã vượt qua toàn bộ quy trình kiểm duyệt chất lượng test và sẵn sàng cho các kỳ thi.
            </p>
          </div>

          <div className="inline-flex flex-wrap justify-center gap-3 pt-3">
            <button
              onClick={() => alert('Đã xuất bản bài toán sang Kho đề chính thức AHtest.code!')}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 cursor-pointer"
            >
              Đưa vào Kho đề chính thức (Publish)
            </button>
            <button
              onClick={() => alert('Đã lưu bài toán ở trạng thái Staging - Chờ cộng đồng giải thử.')}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              Lưu vào Chờ duyệt (Staging Review)
            </button>
            <button
              onClick={() => alert('Đang tải file AHTEST_PACKAGE_coprime_pairs.zip...')}
              className="px-5 py-3 rounded-xl font-semibold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Tải gói chuẩn AHtest.code (.zip)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
