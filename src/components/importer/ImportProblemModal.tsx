import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  ShieldCheck,
  Zap,
  Check,
  Loader2
} from 'lucide-react';
import type { Problem, Difficulty, TestCaseItem, ProblemCollection } from '../../types/index.ts';
import {
  sanitizeSingleProblem,
  processDocxFile,
  type SanitizedProblemResult,
  type SanitizationReport,
} from '../../services/dataSanitizationPipeline.ts';
import { showToast } from '../../services/uiFeedback.ts';

export interface ImportProblemModalProps {
  isOpen: boolean;
  collections: ProblemCollection[];
  targetCollectionId: string;
  setTargetCollectionId: (id: string) => void;
  onClose: () => void;
  onSaveManualProblem: (problem: Problem) => void;
  onBatchDocxExtracted: (items: SanitizedProblemResult[]) => void;
}

export const ImportProblemModal: React.FC<ImportProblemModalProps> = ({
  isOpen,
  collections,
  targetCollectionId,
  setTargetCollectionId,
  onClose,
  onSaveManualProblem,
  onBatchDocxExtracted,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'file'>('form');

  // Manual Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Thực hành C/C++');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [statement, setStatement] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [constraints, setConstraints] = useState('');
  const [author, setAuthor] = useState('');
  const [rawSourceCode, setRawSourceCode] = useState('');
  const [isAutoSanitizeActive, setIsAutoSanitizeActive] = useState(true);
  const [pipelineReport, setPipelineReport] = useState<SanitizationReport | null>(null);

  const [testcases, setTestcases] = useState<{ input: string; output: string; isHidden: boolean }[]>([
    { input: '', output: '', isHidden: false },
    { input: '', output: '', isHidden: true },
  ]);

  // File Upload State
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  if (!isOpen) return null;

  const handleTriggerSanitization = () => {
    if (!rawSourceCode.trim()) {
      showToast('Vui lòng dán mã nguồn C cần làm sạch!', 'warning');
      return;
    }
    const result = sanitizeSingleProblem(
      rawSourceCode,
      title || 'Bài tập tự tạo',
      statement || 'Mô tả bài tập...'
    );

    setPipelineReport(result.report);
    if (result.testcases && result.testcases.length > 0) {
      setTestcases(
        result.testcases.map((tc: any) => ({
          input: tc.input,
          output: tc.expectedOutput,
          isHidden: !!tc.isHidden,
        }))
      );
    }
    showToast('Đã làm sạch mã nguồn và đồng bộ testcases!', 'success');
  };

  const handleSaveManual = () => {
    if (!title.trim() || !statement.trim()) {
      showToast('Vui lòng điền tiêu đề và đề bài!', 'warning');
      return;
    }

    const builtTestcases: TestCaseItem[] = testcases
      .filter((t) => t.input.trim() || t.output.trim())
      .map((t, idx) => ({
        id: idx + 1,
        input: t.input,
        expectedOutput: t.output,
        isHidden: t.isHidden,
        weight: Math.max(1, Math.round(100 / Math.max(1, testcases.length))),
      }));

    const newProblem: Problem = {
      id: `custom_${Date.now()}`,
      slug: slug.trim() || `prob_${Date.now()}`,
      title: title.trim(),
      category,
      difficulty,
      points: 100,
      timeLimit: 1.0,
      memoryLimit: 256,
      tags: ['Custom', category],
      solvedCount: 0,
      totalSubmissions: 0,
      statement: statement.trim(),
      inputFormat: inputFormat.trim() || 'Nhập từ bàn phím',
      outputFormat: outputFormat.trim() || 'In ra màn hình',
      constraints: constraints.trim() || 'Không có',
      samples: builtTestcases
        .filter((t) => !t.isHidden)
        .slice(0, 2)
        .map((t) => ({ input: t.input, output: t.expectedOutput })),
      testcases: builtTestcases,
      author: author.trim() || 'Tự biên soạn',
      source: 'Kho Đề Người Dùng',
      createdAt: new Date().toISOString().split('T')[0],
      isCustom: true,
      collectionId: targetCollectionId,
    };

    onSaveManualProblem(newProblem);
    onClose();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    try {
      if (file.name.endsWith('.docx')) {
        const buffer = await file.arrayBuffer();
        const batchResults = await processDocxFile(buffer);
        if (batchResults.length === 0) {
          showToast('Không tìm thấy bài tập hợp lệ trong tệp docx.', 'warning');
        } else {
          onBatchDocxExtracted(batchResults);
          onClose();
        }
      } else if (file.name.endsWith('.json')) {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          const results: SanitizedProblemResult[] = parsed.map((p) =>
            sanitizeSingleProblem(p.code || '', p.title || 'Bài tập JSON', p.statement)
          );
          onBatchDocxExtracted(results);
          onClose();
        } else if (parsed && parsed.title) {
          onSaveManualProblem({ ...parsed, collectionId: targetCollectionId });
          onClose();
        }
      } else {
        showToast('Vui lòng tải lên tệp .docx hoặc .json!', 'warning');
      }
    } catch (err: any) {
      showToast(`Lỗi xử lý tệp: ${err?.message || err}`, 'error');
    } finally {
      setIsProcessingFile(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs select-none">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Thêm Bài Tập Vào Bộ Đề
              </h3>
              <p className="text-[11px] text-slate-400">
                Thư mục đích:
                <select
                  value={targetCollectionId}
                  onChange={(e) => setTargetCollectionId(e.target.value)}
                  className="ml-2 font-bold text-rose-500 bg-transparent outline-hidden cursor-pointer"
                >
                  {collections.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                      {c.title}
                    </option>
                  ))}
                </select>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Nhập tay vs Tải tệp */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 shrink-0">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'form'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Nhập Thủ Công & Làm Sạch Code C
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'file'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Tải Tập Tin (.docx PRF192 / .json)
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
          {activeTab === 'form' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tên bài tập <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Đếm số nguyên tố trong mảng"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mã định danh (Slug)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="Tự động tạo nếu để trống..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Độ khó & Phân loại
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Easy">Dễ (Easy)</option>
                    <option value="Medium">Vừa (Medium)</option>
                    <option value="Hard">Khó (Hard)</option>
                  </select>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Chủ đề..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Data Sanitization Pipeline Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-400">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-black text-xs uppercase tracking-wider text-slate-100">
                      Pipeline Làm Sạch Code C Tự Động
                    </span>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
                    <input
                      type="checkbox"
                      checked={isAutoSanitizeActive}
                      onChange={(e) => setIsAutoSanitizeActive(e.target.checked)}
                      className="rounded text-rose-500"
                    />
                    <span>Tự động gỡ lệnh rác</span>
                  </label>
                </div>

                <textarea
                  value={rawSourceCode}
                  onChange={(e) => setRawSourceCode(e.target.value)}
                  placeholder="Dán code C vào đây. Pipeline sẽ gỡ system('cls'), getch(), và chuẩn hóa testcases..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-300 border border-slate-800"
                />

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleTriggerSanitization}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Làm Sạch & Trích Xuất Testcases</span>
                  </button>
                  {pipelineReport && (
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Đã làm sạch
                    </span>
                  )}
                </div>
              </div>

              {/* Statement */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Đề bài (Markdown & KaTeX) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Mô tả đề bài..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Formats & Constraints */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Định dạng đầu vào (Input Format)
                  </label>
                  <input
                    type="text"
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value)}
                    placeholder="Dòng đầu chứa N..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Định dạng đầu ra (Output Format)
                  </label>
                  <input
                    type="text"
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    placeholder="In ra một số nguyên..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Giới hạn (Constraints)
                  </label>
                  <input
                    type="text"
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="1 <= N <= 10^5..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tác giả / Nguồn đề
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Tên tác giả..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Testcases */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Bộ Testcases
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setTestcases((prev) => [...prev, { input: '', output: '', isHidden: false }])
                    }
                    className="text-rose-500 font-bold hover:underline cursor-pointer"
                  >
                    + Thêm test case
                  </button>
                </div>
                {testcases.map((tc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-slate-400">Test #{idx + 1}</span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-400">
                        <input
                          type="checkbox"
                          checked={tc.isHidden}
                          onChange={(e) =>
                            setTestcases((prev) =>
                              prev.map((t, i) =>
                                i === idx ? { ...t, isHidden: e.target.checked } : t
                              )
                            )
                          }
                          className="rounded text-rose-500"
                        />
                        <span>Test ẩn</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={tc.input}
                        onChange={(e) =>
                          setTestcases((prev) =>
                            prev.map((t, i) => (i === idx ? { ...t, input: e.target.value } : t))
                          )
                        }
                        placeholder="Input..."
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px]"
                      />
                      <input
                        type="text"
                        value={tc.output}
                        onChange={(e) =>
                          setTestcases((prev) =>
                            prev.map((t, i) => (i === idx ? { ...t, output: e.target.value } : t))
                          )
                        }
                        placeholder="Expected Output..."
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'file' && (
            <div className="space-y-4 py-6">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-8 text-center space-y-3 hover:border-rose-500 transition-colors">
                {isProcessingFile ? (
                  <div className="space-y-2">
                    <Loader2 className="w-10 h-10 text-rose-500 animate-spin mx-auto" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      Đang phân tích và bóc tách tệp trong RAM...
                    </p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-rose-500 mx-auto" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        Chọn tệp .docx tổng hợp hoặc .json
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Tệp .docx sẽ được bóc tách và làm sạch toàn bộ bài tập tự động qua RAM Sandbox.
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".docx,.json"
                      onChange={handleFileUpload}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-500/10 file:text-rose-500 hover:file:bg-rose-500/20 cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'form' && (
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveManual}
              disabled={!title.trim() || !statement.trim()}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 cursor-pointer disabled:opacity-50"
            >
              Lưu Bài Tập Vào Bộ Đề
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
