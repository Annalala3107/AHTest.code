import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  UploadCloud, 
  Plus, 
  Search, 
  Play, 
  Eye, 
  Trash2, 
  RefreshCw, 
  X, 
  BookOpen, 
  Folder,
  Shapes,
  Layers,
  Type,
  Calculator,
  ArrowLeft,
  Sparkles,
  Timer,
  ChevronRight,
  Lightbulb,
  ShieldAlert,
  Flame,
  Award,
  FolderPlus,
  ShieldCheck,
  Zap,
  FileCheck,
  Check,
  Star
} from 'lucide-react';
import { Problem, Difficulty, TestCaseItem, ProblemCollection, ExamSessionConfig } from '../types';
import { ProblemSpecificationView } from './ProblemSpecificationView';
import {
  loadCollections,
  saveCollections,
  resetCollectionsToDefault,
  restoreFull115MasterBank,
  createCollection,
  deleteCollection,
  addProblemToCollection,
  addProblemsBatchToCollections,
  deleteProblemFromCollection,
  createExamSession
} from '../services/collectionStorage';
import {
  sanitizeSingleProblem,
  processDocxFile,
  classifyProblemCategory,
  SanitizedProblemResult,
  SanitizationReport
} from '../services/dataSanitizationPipeline';

interface ProblemImporterViewProps {
  onSelectProblem?: (problem: Problem, list?: Problem[], collectionTitle?: string) => void;
  onStartExam?: (session: ExamSessionConfig) => void;
}

export const ProblemImporterView: React.FC<ProblemImporterViewProps> = ({ onSelectProblem, onStartExam }) => {
  // Collection Hub State
  const [collections, setCollections] = useState<ProblemCollection[]>(() => loadCollections());
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);

  // Global & In-collection Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals & Panels
  const [isAddCollectionModalOpen, setIsAddCollectionModalOpen] = useState(false);
  const [isAddProblemModalOpen, setIsAddProblemModalOpen] = useState(false);
  const [targetCollectionId, setTargetCollectionId] = useState<string>('user_custom_library');
  const [previewProblem, setPreviewProblem] = useState<Problem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'form' | 'file'>('form');

  // Exam Simulation Mode State (Default: 90 minutes standard Lab Practical Exam)
  const [examQuestionCount, setExamQuestionCount] = useState<number>(10);
  const [examDurationMinutes, setExamDurationMinutes] = useState<number>(90);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [pendingExamSession, setPendingExamSession] = useState<ExamSessionConfig | null>(null);

  // New Collection Form
  const [newColTitle, setNewColTitle] = useState('');
  const [newColDescription, setNewColDescription] = useState('');
  const [newColCategory, setNewColCategory] = useState('Chuyên đề Tự chọn');
  const [newColColor, setNewColColor] = useState<'rose' | 'amber' | 'emerald' | 'blue' | 'purple' | 'cyan'>('blue');
  const [newColIcon, setNewColIcon] = useState('folder');

  // New Problem Form
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newCategory, setNewCategory] = useState('Thực hành C/C++');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('Easy');
  const [newStatement, setNewStatement] = useState('');
  const [newInputFormat, setNewInputFormat] = useState('');
  const [newOutputFormat, setNewOutputFormat] = useState('');
  const [newConstraints, setNewConstraints] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTestcases, setNewTestcases] = useState<Array<{ input: string; output: string; isHidden: boolean }>>([
    { input: '', output: '', isHidden: false },
    { input: '', output: '', isHidden: false }
  ]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Data Sanitization Pipeline States (Giai Đoạn 1)
  const [rawSourceCodeInput, setRawSourceCodeInput] = useState<string>('');
  const [isAutoSanitizeActive, setIsAutoSanitizeActive] = useState<boolean>(true);
  const [pipelineReport, setPipelineReport] = useState<SanitizationReport | null>(null);
  const [isBatchDocxProcessing, setIsBatchDocxProcessing] = useState<boolean>(false);
  const [batchSanitizedResults, setBatchSanitizedResults] = useState<SanitizedProblemResult[]>([]);
  const [showBatchReviewModal, setShowBatchReviewModal] = useState<boolean>(false);
  const [autoRouteTo4Categories, setAutoRouteTo4Categories] = useState<boolean>(true);

  // Sync collections with localStorage when state changes
  useEffect(() => {
    saveCollections(collections);
  }, [collections]);

  // Derived current active collection
  const activeCollection = collections.find(c => c.id === activeCollectionId) || null;

  // Icon Resolver
  const renderCollectionIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName.toLowerCase()) {
      case 'shapes':
        return <Shapes className={className} />;
      case 'layers':
        return <Layers className={className} />;
      case 'type':
        return <Type className={className} />;
      case 'calculator':
        return <Calculator className={className} />;
      case 'folder-git-2':
      case 'foldergit2':
        return <FolderGit2 className={className} />;
      default:
        return <Folder className={className} />;
    }
  };

  // Color Theme Resolver
  const getColorStyles = (color: string) => {
    switch (color) {
      case 'rose':
        return {
          border: 'border-rose-500/30 hover:border-rose-500/70',
          bgLight: 'bg-rose-500/10',
          text: 'text-rose-400',
          accentBg: 'bg-rose-600',
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          glow: 'from-rose-600/15'
        };
      case 'emerald':
        return {
          border: 'border-emerald-500/30 hover:border-emerald-500/70',
          bgLight: 'bg-emerald-500/10',
          text: 'text-emerald-400',
          accentBg: 'bg-emerald-600',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          glow: 'from-emerald-600/15'
        };
      case 'amber':
        return {
          border: 'border-amber-500/30 hover:border-amber-500/70',
          bgLight: 'bg-amber-500/10',
          text: 'text-amber-400',
          accentBg: 'bg-amber-600',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          glow: 'from-amber-600/15'
        };
      case 'purple':
        return {
          border: 'border-purple-500/30 hover:border-purple-500/70',
          bgLight: 'bg-purple-500/10',
          text: 'text-purple-400',
          accentBg: 'bg-purple-600',
          badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          glow: 'from-purple-600/15'
        };
      case 'blue':
      default:
        return {
          border: 'border-blue-500/30 hover:border-blue-500/70',
          bgLight: 'bg-blue-500/10',
          text: 'text-blue-400',
          accentBg: 'bg-blue-600',
          badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          glow: 'from-blue-600/15'
        };
    }
  };

  // Reset to Factory Collections
  const handleResetCollections = () => {
    if (window.confirm('Khôi phục toàn bộ Thư mục & Bộ Đề PRF192 chuẩn hóa ban đầu? (Các bài tập tự tạo cá nhân có thể được làm mới)')) {
      const defaults = resetCollectionsToDefault();
      setCollections(defaults);
      setActiveCollectionId(null);
    }
  };

  // Delete Collection
  const handleDeleteCollection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa thư mục bộ đề này?')) {
      const updated = deleteCollection(id);
      setCollections(updated);
      if (activeCollectionId === id) {
        setActiveCollectionId(null);
      }
    }
  };

  // Save New Collection
  const handleCreateCollection = () => {
    if (!newColTitle.trim()) {
      alert('Vui lòng nhập tên thư mục!');
      return;
    }
    const created = createCollection(
      newColTitle,
      newColDescription || 'Bộ sưu tập bài tập tùy chỉnh',
      newColCategory,
      newColColor,
      newColIcon
    );
    setCollections(loadCollections());
    setIsAddCollectionModalOpen(false);
    setNewColTitle('');
    setNewColDescription('');
    setActiveCollectionId(created.id);
  };

  // Save New Problem
  const handleSaveProblem = (autoStart: boolean = false) => {
    if (!newTitle.trim()) {
      alert('Vui lòng nhập Tên bài toán!');
      return;
    }
    const slug = newSlug.trim() || newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const validTests = newTestcases.filter(t => t.input.trim() || t.output.trim());
    if (validTests.length === 0) {
      alert('Vui lòng nhập ít nhất 1 test case!');
      return;
    }

    const publicSamples = validTests
      .filter(t => !t.isHidden)
      .map(t => ({ input: t.input, output: t.output }));

    const formattedTestcases: TestCaseItem[] = validTests.map((t, i) => ({
      id: i + 1,
      input: t.input,
      expectedOutput: t.output,
      isHidden: t.isHidden
    }));

    const probId = `imported_${Date.now()}`;
    const created: Problem = {
      id: probId,
      slug,
      title: newTitle.trim(),
      category: newCategory,
      difficulty: newDifficulty,
      points: 100,
      timeLimit: 1.0,
      memoryLimit: 128,
      tags: [newCategory.split(' ')[0], 'Custom', 'Lab'],
      solvedCount: 0,
      totalSubmissions: 0,
      statement: newStatement || `Mô tả bài toán cho **${newTitle}**`,
      inputFormat: newInputFormat || 'Đọc dữ liệu từ stdin.',
      outputFormat: newOutputFormat || 'In kết quả ra stdout.',
      constraints: newConstraints || 'Theo chuẩn đề bài.',
      samples: publicSamples.length > 0 ? publicSamples : [{ input: validTests[0].input, output: validTests[0].output }],
      testcases: formattedTestcases,
      author: newAuthor.trim() || 'Người dùng nhập',
      source: 'Kho Đề Ngoại Nhập',
      createdAt: new Date().toISOString().split('T')[0],
      isCustom: true,
      collectionId: targetCollectionId
    };

    // If source code was provided, seed into localStorage draft for instant running in Workbench
    if (rawSourceCodeInput.trim()) {
      localStorage.setItem(`ahtest_draft_workbench_${probId}_c17`, rawSourceCodeInput.trim());
      localStorage.setItem(`ahtest_draft_workbench_${probId}_cpp20`, rawSourceCodeInput.trim());
    }

    const updated = addProblemToCollection(targetCollectionId, created);
    setCollections(updated);
    setIsAddProblemModalOpen(false);

    // Reset Form
    setNewTitle('');
    setNewSlug('');
    setRawSourceCodeInput('');
    setPipelineReport(null);
    setNewStatement('');
    setNewInputFormat('');
    setNewOutputFormat('');
    setNewConstraints('');
    setNewTestcases([
      { input: '', output: '', isHidden: false },
      { input: '', output: '', isHidden: false }
    ]);

    if (autoStart && onSelectProblem) {
      onSelectProblem(created);
    }
  };

  // Trigger Data Sanitization Pipeline on Manual Form Input
  const handleTriggerSanitization = () => {
    if (!rawSourceCodeInput.trim()) {
      alert('Vui lòng dán mã nguồn C cần làm sạch vào ô nhập liệu!');
      return;
    }
    const res = sanitizeSingleProblem(rawSourceCodeInput, newTitle || 'Bài Tập Ngoại Nhập PRF192', newStatement);
    setNewTitle(res.title);
    setNewCategory(res.category);
    setNewDifficulty(res.difficulty);
    setRawSourceCodeInput(res.code);
    setNewStatement(res.statement);
    setNewInputFormat(res.inputFormat);
    setNewOutputFormat(res.outputFormat);
    setNewConstraints(res.constraints);
    setNewTestcases(res.testcases.map(t => ({ input: t.input, output: t.expectedOutput, isHidden: !!t.isHidden })));
    setPipelineReport(res.report);
  };

  // Handle Batch Import of all sanitized problems from DOCX (O(1) disk writes)
  const handleBatchImportDocx = () => {
    if (batchSanitizedResults.length === 0) return;

    const batchItems: Array<{ collectionId: string; problem: Problem }> = [];

    batchSanitizedResults.forEach((item, idx) => {
      const destinationColId = autoRouteTo4Categories
        ? (item.collectionId || classifyProblemCategory(item.title, item.code).collectionId)
        : targetCollectionId;

      const probId = `docx_${Date.now()}_${idx}`;
      const prob: Problem = {
        id: probId,
        slug: `prf192_${idx + 1}_${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`.slice(0, 40),
        title: item.title,
        category: item.category,
        difficulty: item.difficulty,
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: ['PRF192', 'Sanitized', destinationColId.replace('prf192_', '').toUpperCase()],
        solvedCount: 0,
        totalSubmissions: 0,
        statement: `${item.statement}\n\n\`\`\`c\n${item.code.slice(0, 2000)}\n\`\`\``,
        inputFormat: item.inputFormat,
        outputFormat: item.outputFormat,
        constraints: item.constraints,
        samples: item.samples,
        testcases: item.testcases,
        author: 'PRF192 Master Docx (Đã Làm Sạch)',
        source: '1_TỔNG-HỢP-CÁC-SOURCE-MÔN-PRF192.docx',
        createdAt: new Date().toISOString().split('T')[0],
        isCustom: true,
        collectionId: destinationColId
      };

      // Seed draft
      try {
        localStorage.setItem(`ahtest_draft_workbench_${probId}_c17`, item.code);
        localStorage.setItem(`ahtest_draft_workbench_${probId}_cpp20`, item.code);
      } catch {
        // ignore
      }

      batchItems.push({ collectionId: destinationColId, problem: prob });
    });

    const updated = addProblemsBatchToCollections(batchItems);
    setCollections(updated);
    setShowBatchReviewModal(false);
    setBatchSanitizedResults([]);
    alert(`🎉 Thành công! Đã nạp và phân bổ ${batchSanitizedResults.length} bài tập chuẩn hóa ${autoRouteTo4Categories ? 'vào đúng 4 Bộ Đề Lớn!' : 'vào thư mục đích!'} (Tối ưu O(1) ghi đĩa)`);
  };

  // Handle File Upload into Target Collection with Data Sanitization Pipeline
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    // 1. DOCX File Pipeline (Unpack ZIP, decode XML, clean C code, synthesize testcases)
    if (file.name.endsWith('.docx')) {
      setIsBatchDocxProcessing(true);
      try {
        const buffer = await file.arrayBuffer();
        const results = await processDocxFile(buffer);
        setIsBatchDocxProcessing(false);
        if (results.length === 0) {
          setUploadError('Không tìm thấy đoạn mã nguồn C nào hợp lệ trong tệp DOCX này.');
          return;
        }
        setBatchSanitizedResults(results);
        setShowBatchReviewModal(true);
        setIsAddProblemModalOpen(false);
      } catch (err: any) {
        setIsBatchDocxProcessing(false);
        setUploadError(`Lỗi xử lý file DOCX: ${err.message}`);
      }
      return;
    }

    // 2. JSON or Text/C files
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          const prob: Problem = {
            id: `imported_${Date.now()}`,
            slug: parsed.slug || `prob_${Date.now()}`,
            title: parsed.title || file.name.replace(/\.[^/.]+$/, ""),
            category: parsed.category || 'Tùy biến ngoại nhập',
            difficulty: (parsed.difficulty as Difficulty) || 'Medium',
            points: parsed.points || 100,
            timeLimit: parsed.timeLimit || 1.0,
            memoryLimit: 128,
            tags: parsed.tags || ['Custom', 'FileImport'],
            solvedCount: 0,
            totalSubmissions: 0,
            statement: parsed.statement || 'Không có mô tả chi tiết.',
            inputFormat: parsed.inputFormat || 'Dữ liệu đầu vào.',
            outputFormat: parsed.outputFormat || 'Dữ liệu đầu ra.',
            constraints: parsed.constraints || 'Theo chuẩn.',
            samples: parsed.samples || [{ input: '1', output: '1' }],
            testcases: parsed.testcases || [
              { id: 1, input: parsed.samples?.[0]?.input || '1', expectedOutput: parsed.samples?.[0]?.output || '1', isHidden: false }
            ],
            author: parsed.author || 'Tập tin nạp ngoài',
            source: file.name,
            createdAt: new Date().toISOString().split('T')[0],
            isCustom: true,
            collectionId: targetCollectionId
          };
          const updated = addProblemToCollection(targetCollectionId, prob);
          setCollections(updated);
          setIsAddProblemModalOpen(false);
          alert(`Đã nạp thành công bài tập "${prob.title}" vào thư mục!`);
        } else {
          // .c, .cpp, .txt: RUN THROUGH DATA SANITIZATION PIPELINE
          const sanitized = sanitizeSingleProblem(text, file.name);
          const probId = `imported_${Date.now()}`;
          const prob: Problem = {
            id: probId,
            slug: file.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            title: sanitized.title || file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
            category: sanitized.category,
            difficulty: sanitized.difficulty,
            points: 100,
            timeLimit: 1.0,
            memoryLimit: 128,
            tags: ['SourceFile', 'AutoSanitized', 'PRF192'],
            solvedCount: 0,
            totalSubmissions: 0,
            statement: `${sanitized.statement}\n\n\`\`\`c\n${sanitized.code.slice(0, 2000)}\n\`\`\``,
            inputFormat: sanitized.inputFormat,
            outputFormat: sanitized.outputFormat,
            constraints: sanitized.constraints,
            samples: sanitized.samples,
            testcases: sanitized.testcases,
            author: 'Đã chuẩn hóa qua Pipeline',
            source: file.name,
            createdAt: new Date().toISOString().split('T')[0],
            isCustom: true,
            collectionId: targetCollectionId
          };

          // Seed code into drafts so Monaco editor has cleaned code immediately
          localStorage.setItem(`ahtest_draft_workbench_${probId}_c17`, sanitized.code);
          localStorage.setItem(`ahtest_draft_workbench_${probId}_cpp20`, sanitized.code);

          const updated = addProblemToCollection(targetCollectionId, prob);
          setCollections(updated);
          setIsAddProblemModalOpen(false);
          alert(`🛡️ Đã nạp & làm sạch thành công bài tập "${prob.title}"!\n- Lệnh rác đã loại bỏ: ${sanitized.report.windowsCommandsRemoved.join(', ') || '0 lệnh'}\n- Tự động sinh ${sanitized.testcases.length} test cases hợp lệ.`);
        }
      } catch (err: any) {
        setUploadError(`Lỗi phân tích tập tin: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  // Delete problem from active collection
  const handleDeleteProblem = (probId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa bài tập này khỏi thư mục?')) {
      if (activeCollectionId) {
        const updated = deleteProblemFromCollection(activeCollectionId, probId);
        setCollections(updated);
      }
    }
  };

  // Launch Grand Exam Simulation across all 4 collections
  const handleTriggerGrandExam = () => {
    const systemCols = collections.filter(c => c.isSystem);
    if (systemCols.length === 0 || systemCols.every(c => c.problems.length === 0)) {
      alert('Chưa có bài tập nào trong các Bộ đề lớn để tạo kỳ thi!');
      return;
    }
    const session = createExamSession(systemCols, examQuestionCount, examDurationMinutes, 'Kỳ Thi Thử Phòng Lab Toàn Diện PRF192');
    setPendingExamSession(session);
    setIsExamModalOpen(true);
  };

  // Restore/Sync Full 115 Master Problems
  const handleRestore115MasterProblems = () => {
    if (window.confirm('Bạn có muốn đồng bộ lại toàn bộ 115+ bài tập chuẩn hóa PRF192 vào 4 Bộ Đề Lớn không? (Các bài tập tự tạo cá nhân vẫn được bảo lưu an toàn).')) {
      const fresh = restoreFull115MasterBank();
      setCollections(fresh);
      alert('🎉 Đã đồng bộ thành công 115+ bài tập chuẩn hóa vào 4 Bộ Đề Lớn!');
    }
  };

  // Launch Exam Simulation
  const handleTriggerExamSetup = (collection: ProblemCollection) => {
    if (collection.problems.length === 0) {
      alert('Thư mục này hiện chưa có bài tập nào để tạo đề thi!');
      return;
    }
    const session = createExamSession(collection, examQuestionCount, examDurationMinutes);
    setPendingExamSession(session);
    setIsExamModalOpen(true);
  };

  const handleStartExamSession = () => {
    if (!pendingExamSession || pendingExamSession.problems.length === 0) return;
    const sessionToStart = pendingExamSession;
    setIsExamModalOpen(false);
    if (onStartExam) {
      onStartExam(sessionToStart);
    } else if (onSelectProblem) {
      // Open problem in exam mode
      onSelectProblem({
        ...sessionToStart.problems[0],
        source: `Kỳ thi thử: ${sessionToStart.collectionTitle} (${sessionToStart.timeLimitMinutes}p)`
      });
    }
  };

  // Aggregate Metrics across all collections
  const totalCollections = collections.length;
  const totalProblemsCount = collections.reduce((acc, c) => acc + (c.problems?.length || 0), 0);
  const totalTestcasesCount = collections.reduce((acc, c) => 
    acc + c.problems.reduce((pAcc, p) => pAcc + (p.testcases?.length || p.samples?.length || 0), 0), 0
  );

  // Filtered collections on top view
  const filteredCollections = collections.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.problems.some(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered problems inside active collection
  const activeProblemsFiltered = activeCollection ? activeCollection.problems.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  }) : [];

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* VIEW 1: FOLDER HUB (COLLECTIONS OVERVIEW) */}
      {!activeCollection && (
        <>
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-rose-950/40 to-slate-950 border border-rose-900/40 p-6 sm:p-8 text-white shadow-2xl">
            <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-300">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>Kho Đề Ngoại Nhập 2.0 • Kiến Trúc Thư Mục Phân Cấp</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Trung Tâm Quản Lý <span className="text-rose-400">Bộ Đề & Thư Mục Luyện Thi</span>
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Thay vì danh sách phẳng rườm rà, các bài thi thực hành PRF192 được phân loại chuẩn chỉ theo từng chuyên đề. 
                  Chọn thư mục để bắt đầu <strong>Ôn thi có bấm giờ</strong> hoặc <strong>Luyện tập tự do với gợi ý 3 tầng</strong>.
                </p>
              </div>

              {/* Quick Metrics */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[95px] shadow-sm">
                  <span className="block text-2xl font-black text-rose-400">{totalCollections}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thư Mục</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[95px] shadow-sm">
                  <span className="block text-2xl font-black text-emerald-400">{totalProblemsCount}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bài Tập</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[95px] shadow-sm">
                  <span className="block text-2xl font-black text-blue-400">{totalTestcasesCount}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Testcases</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hub Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm thư mục, tên bài tập, hoặc mã kỹ thuật..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-rose-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer shrink-0"
            >
              <option value="All">Tất cả danh mục</option>
              {Array.from(new Set(collections.map(c => c.category))).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleRestore115MasterProblems}
                title="Đồng bộ lại toàn bộ 115+ bài tập chuẩn hóa PRF192 vào 4 Bộ Đề Lớn"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đồng Bộ 115 Đề Chuẩn Hóa</span>
              </button>

              <button
                onClick={() => setIsAddCollectionModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-rose-400" />
                <span>+ Thư Mục Mới</span>
              </button>

              <button
                onClick={() => {
                  setTargetCollectionId('user_custom_library');
                  setIsAddProblemModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nhập Đề Mới</span>
              </button>
            </div>
          </div>

          {/* GRAND EXAM HERO ARENA BANNER (KỲ THI THỬ PHÒNG LAB TOÀN DIỆN PRF192) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-indigo-950/80 border border-rose-500/40 p-6 text-white shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <Flame className="w-3.5 h-3.5 text-rose-400 fill-current" />
                <span>Mô Phỏng 100% Đề Thi PE Phòng Lab Đại Học</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>🏆 Kỳ Thi Thử Phòng Lab Toàn Diện (All-in-One Grand Exam)</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hệ thống tự động bốc ngẫu nhiên từ <strong>10 đến 20 câu</strong> phân bổ cân bằng qua <strong>cả 4 Bộ Đề Lớn</strong> (Vẽ Hình, Mảng, Chuỗi, Số Học). Đồng hồ đếm ngược nghiêm ngặt, khóa toàn bộ gợi ý, chấm điểm tự động và xuất <strong>Bảng Điểm Scorecard</strong> ngay khi nộp bài.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5 font-semibold text-rose-300"><Timer className="w-3.5 h-3.5 text-rose-400" /> 90 phút (Chuẩn Lab PE) • 45 - 120 phút</span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-semibold text-amber-300"><ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Khóa Gợi Ý Thi Thật</span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-semibold text-emerald-300"><Award className="w-3.5 h-3.5 text-emerald-400" /> Thang Điểm 10 Chuẩn Lab</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col justify-center gap-2.5 shrink-0 min-w-[240px]">
              <button
                onClick={handleTriggerGrandExam}
                className="px-5 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white shadow-lg shadow-rose-600/40 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>Vào Thi Thử Toàn Diện (90 phút) →</span>
              </button>
            </div>
          </div>

          {/* Section Header: DANH MỤC CÁC BỘ ĐỀ & THƯ MỤC CHUYÊN ĐỀ */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Folder className="w-4 h-4 text-rose-500" />
                <span>DANH MỤC CÁC BỘ ĐỀ LUYỆN TẬP (COLLECTIONS HUB)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Chọn một thư mục để truy cập bài tập hoặc khởi tạo phòng thi thử nghiệm.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Hiển thị {filteredCollections.length} / {collections.length} bộ đề
            </span>
          </div>

          {/* Collection Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCollections.map((col) => {
              const styles = getColorStyles(col.color);
              const problemCount = col.problems?.length || 0;
              const testsCount = col.problems.reduce((acc, p) => acc + (p.testcases?.length || p.samples?.length || 0), 0);

              return (
                <div
                  key={col.id}
                  onClick={() => {
                    setActiveCollectionId(col.id);
                    setSearchQuery('');
                  }}
                  className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border ${styles.border} p-5 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer`}
                >
                  <div className={`absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br ${styles.glow} to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform`} />

                  <div className="space-y-4 relative z-10">
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-3">
                      <div className={`w-11 h-11 rounded-xl ${styles.bgLight} ${styles.text} flex items-center justify-center shrink-0 border border-current/20 shadow-xs`}>
                        {renderCollectionIcon(col.icon, 'w-5 h-5')}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${styles.badge}`}>
                          {col.category}
                        </span>
                        {!col.isSystem && (
                          <button
                            onClick={(e) => handleDeleteCollection(col.id, e)}
                            title="Xóa thư mục tự tạo"
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-rose-400 transition-colors flex items-center gap-1.5">
                        <span>{col.title}</span>
                      </h3>
                      {col.titleEn && (
                        <p className="text-[11px] font-medium text-slate-400 tracking-wide">
                          {col.titleEn}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {col.description}
                      </p>
                    </div>

                    {/* Problem Preview Snippets */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Bài tập tiêu biểu:
                      </span>
                      <div className="space-y-1">
                        {col.problems.slice(0, 3).map((p, idx) => (
                          <div key={p.id} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                            <span className="truncate">{idx + 1}. {p.title}</span>
                          </div>
                        ))}
                        {col.problems.length > 3 && (
                          <span className="text-[10px] text-slate-400 italic block pl-3">
                            + thêm {col.problems.length - 3} bài tập khác...
                          </span>
                        )}
                        {col.problems.length === 0 && (
                          <span className="text-[11px] text-slate-400 italic block">
                            Chưa có bài tập nào. Hãy nhập bài mới!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Metrics & CTA */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs relative z-10">
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{problemCount} bài</span>
                      <span>•</span>
                      <span>{testsCount} tests</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTriggerExamSetup(col);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 transition-all flex items-center gap-1 cursor-pointer"
                        title="Thi thử 10-20 câu trong bộ đề này"
                      >
                        <Flame className="w-3 h-3" />
                        <span>Thi Thử</span>
                      </button>

                      <div className={`flex items-center gap-1 font-bold ${styles.text} text-xs group-hover:translate-x-1 transition-transform`}>
                        <span>Luyện Tập</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* VIEW 2: COLLECTION DETAIL WORKSPACE */}
      {activeCollection && (
        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => {
                setActiveCollectionId(null);
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-rose-500" />
              <span>← Quay lại Kho Thư Mục</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTargetCollectionId(activeCollection.id);
                  setIsAddProblemModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Thêm bài vào thư mục này</span>
              </button>
            </div>
          </div>

          {/* Collection Header Banner */}
          {(() => {
            const styles = getColorStyles(activeCollection.color);
            return (
              <div className={`relative overflow-hidden rounded-3xl bg-slate-950 border ${styles.border} p-6 sm:p-8 text-white shadow-xl`}>
                <div className={`absolute -right-10 -top-10 w-80 h-80 bg-gradient-to-br ${styles.glow} to-transparent rounded-full blur-3xl pointer-events-none`} />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles.badge}`}>
                        {activeCollection.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {activeCollection.problems.length} bài tập sẵn sàng
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
                      <span className={styles.text}>{renderCollectionIcon(activeCollection.icon, 'w-7 h-7')}</span>
                      <span>{activeCollection.title}</span>
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {activeCollection.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTriggerExamSetup(activeCollection)}
                      className="px-5 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                    >
                      <Timer className="w-4 h-4" />
                      <span>THI THỬ PHÒNG THI</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Section Header: PHƯƠNG THỨC TRẢI NGHIỆM */}
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>BẢNG LỰA CHỌN PHƯƠNG THỨC TRẢI NGHIỆM (DUAL-MODE ARENA)</span>
            </h2>
            <span className="text-[11px] text-slate-400">
              Chọn Ôn thi bấm giờ hoặc Luyện tập có trợ lý gợi ý
            </span>
          </div>

          {/* DUAL MODE SELECTION HERO CARDS (Chế độ Ôn thi vs Chế độ Luyện tập) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Mode 1: Ôn Thi (Exam Simulation) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/30 border border-rose-500/40 p-6 text-white shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                    <Timer className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Áp Lực Phòng Thi
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-rose-300">
                    🎯 Chế Độ Ôn Thi (Exam Simulation)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    Mô phỏng 100% không khí thi PE FPTU: Hệ thống tự động <strong>trộn ngẫu nhiên câu hỏi</strong>, kích hoạt <strong>đồng hồ đếm ngược</strong>, và <strong>khóa toàn bộ gợi ý</strong>.
                  </p>
                </div>

                {/* Exam Configuration Parameters */}
                <div className="space-y-3 pt-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  {/* Question Count Pill Selector */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Số lượng câu thi:</span>
                    <div className="flex items-center gap-1.5">
                      {[10, 12, 15, 18, 20].map((num) => (
                        <button
                          key={num}
                          onClick={() => setExamQuestionCount(num)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            examQuestionCount === num
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {num} câu
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Duration Pill Selector */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Thời gian thi:</span>
                    <div className="flex items-center gap-1.5">
                      {[
                        { mins: 45, label: '45p' },
                        { mins: 90, label: '⭐ 90p' },
                        { mins: 120, label: '120p' }
                      ].map(({ mins, label }) => (
                        <button
                          key={mins}
                          onClick={() => setExamDurationMinutes(mins)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            examDurationMinutes === mins
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                          title={mins === 90 ? '90 phút - Chuẩn khảo thí Lab PE' : `${mins} phút`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleTriggerExamSetup(activeCollection)}
                className="w-full py-2.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4" />
                <span>Bắt Đầu Ôn Thi Ngay ({examQuestionCount} câu • {examDurationMinutes}p)</span>
              </button>
            </div>

            {/* Mode 2: Luyện Tập Tự Do (Deep Practice) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30 border border-emerald-500/40 p-6 text-white shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Học Sâu • Nhớ Lâu
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-emerald-300">
                    💡 Chế Độ Luyện Tập (Deep Practice)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    <strong>Không giới hạn thời gian</strong>, tự do giải từng bài toán. Trang bị hệ thống <strong>3 Tầng Gợi Ý Tiến Trình (Progressive Hints)</strong> giúp ghi nhớ bản chất và chống mất gốc ngầm.
                  </p>
                </div>

                {/* 3-Tier Hint Feature Showcase */}
                <div className="space-y-2 pt-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-[11px]">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tầng 1: Tư duy thuật toán cốt lõi</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400 font-semibold">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Tầng 2: Cảnh báo bẫy ngầm & Lỗi bộ nhớ C</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400 font-semibold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Tầng 3: Khung mã giả (Pseudocode Scaffold)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (onSelectProblem && activeCollection.problems.length > 0) {
                      onSelectProblem(activeCollection.problems[0], activeCollection.problems, activeCollection.title);
                    }
                  }}
                  disabled={activeCollection.problems.length === 0}
                  className="w-full py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Bắt Đầu Luyện Tập Từ Câu 1 →</span>
                </button>
                <a
                  href="#problem-list-section"
                  className="w-full py-2 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <span>Xem Toàn Bộ {activeCollection.problems.length} Bài Tập Bên Dưới ↓</span>
                </a>
              </div>
            </div>
          </div>

          {/* Problem List Section in Active Collection */}
          <div id="problem-list-section" className="space-y-4 pt-4">
            {/* Inner Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Tìm bài tập trong ${activeCollection.title}...`}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-rose-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <option value="All">Tất cả độ khó</option>
                  <option value="Easy">Dễ (Easy)</option>
                  <option value="Medium">Trung bình (Medium)</option>
                  <option value="Hard">Khó (Hard)</option>
                </select>
              </div>
            </div>

            {/* Problems Grid / List */}
            {activeProblemsFiltered.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                  <FolderGit2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                  Không tìm thấy bài tập nào trong thư mục này
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Hãy thử đổi từ khóa tìm kiếm hoặc bấm nút "+ Thêm bài vào thư mục này" để tạo bài tập mới.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeProblemsFiltered.map((prob) => {
                  const testsCount = prob.testcases?.length || prob.samples.length || 0;
                  const difficultyColor = 
                    prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                    prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                    'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';

                  return (
                    <div
                      key={prob.id}
                      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${difficultyColor}`}>
                            {prob.difficulty}
                          </span>

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-rose-500">{prob.points} pts</span>
                            <span>•</span>
                            <span>{testsCount} tests</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-rose-500 transition-colors">
                            {prob.title}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-400">
                            slug: {prob.slug}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {prob.statement.replace(/[#*`$]/g, '')}
                        </p>

                        {/* Progressive hints & Mastery Stars */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {prob.progressiveHints && prob.progressiveHints.length > 0 && (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                              <Lightbulb className="w-3 h-3" />
                              <span>Gợi Ý 3 Tầng</span>
                            </div>
                          )}

                          {(() => {
                            const savedStar = Number(localStorage.getItem(`ahtest_star_${prob.id}`) || 0);
                            if (savedStar > 0) {
                              return (
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                                  <div className="flex items-center">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${i < savedStar ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                                      />
                                    ))}
                                  </div>
                                  <span>{savedStar === 3 ? '3★ Tự lực' : savedStar === 2 ? '2★ Gợi ý' : '1★ Khung code'}</span>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>

                      {/* Problem Actions */}
                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <span>{prob.author}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewProblem(prob)}
                            className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Xem trước đề bài & test mẫu"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {prob.isCustom && (
                            <button
                              onClick={(e) => handleDeleteProblem(prob.id, e)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Xóa bài tập"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => onSelectProblem && onSelectProblem(prob, activeCollection.problems, activeCollection.title)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Làm bài</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE NEW COLLECTION */}
      {isAddCollectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-500">
                <FolderPlus className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Tạo Thư Mục / Bộ Đề Mới
                </h3>
              </div>
              <button
                onClick={() => setIsAddCollectionModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên Thư Mục *
                </label>
                <input
                  type="text"
                  value={newColTitle}
                  onChange={(e) => setNewColTitle(e.target.value)}
                  placeholder="Ví dụ: Đề Ôn Thi PE Summer 2026"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mô Tả Ngắn
                </label>
                <textarea
                  value={newColDescription}
                  onChange={(e) => setNewColDescription(e.target.value)}
                  placeholder="Tóm tắt nội dung và mục tiêu luyện tập của thư mục này..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Danh Mục Phân Loại
                </label>
                <input
                  type="text"
                  value={newColCategory}
                  onChange={(e) => setNewColCategory(e.target.value)}
                  placeholder="Ví dụ: Luyện Thi PE, Mảng & Con Trỏ..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Màu Sắc Đại Diện
                </label>
                <div className="flex gap-2">
                  {(['rose', 'blue', 'emerald', 'amber', 'purple'] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewColColor(color)}
                      className={`w-7 h-7 rounded-xl border-2 transition-transform cursor-pointer ${
                        color === 'rose' ? 'bg-rose-500' :
                        color === 'blue' ? 'bg-blue-500' :
                        color === 'emerald' ? 'bg-emerald-500' :
                        color === 'amber' ? 'bg-amber-500' : 'bg-purple-500'
                      } ${newColColor === color ? 'scale-110 border-white' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Biểu Tượng (Icon)
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'folder', icon: <Folder className="w-4 h-4" /> },
                    { id: 'shapes', icon: <Shapes className="w-4 h-4" /> },
                    { id: 'layers', icon: <Layers className="w-4 h-4" /> },
                    { id: 'type', icon: <Type className="w-4 h-4" /> },
                    { id: 'calculator', icon: <Calculator className="w-4 h-4" /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setNewColIcon(item.id)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        newColIcon === item.id
                          ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAddCollectionModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateCollection}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Tạo Thư Mục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / IMPORT PROBLEM (Form or File) */}
      {isAddProblemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Nhập Bài Tập Mới Vào Kho Đề
                </h3>
                <p className="text-xs text-slate-400">
                  Thêm bài tập thủ công hoặc tải lên file .json, .c, .cpp
                </p>
              </div>
              <button
                onClick={() => setIsAddProblemModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Collection Selector */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Thư mục lưu trữ đích:
              </label>
              <select
                value={targetCollectionId}
                onChange={(e) => setTargetCollectionId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                {collections.map(c => (
                  <option key={c.id} value={c.id}>
                    📁 {c.title} ({c.problems.length} bài)
                  </option>
                ))}
              </select>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
              <button
                onClick={() => setActiveModalTab('form')}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeModalTab === 'form'
                    ? 'border-rose-500 text-rose-500'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Nhập Thủ Công (Form Chi Tiết)
              </button>
              <button
                onClick={() => setActiveModalTab('file')}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeModalTab === 'file'
                    ? 'border-rose-500 text-rose-500'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Nạp Tập Tin (.json / .c / .cpp)
              </button>
            </div>

            {/* Tab: Form */}
            {activeModalTab === 'form' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tên bài toán *
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ví dụ: Đảo ngược từng từ trong câu"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mã định danh (Slug)
                    </label>
                    <input
                      type="text"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      placeholder="reverse_words_c"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Danh mục
                    </label>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Thực hành C/C++"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Độ khó
                    </label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value as Difficulty)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="Easy">Dễ (Easy)</option>
                      <option value="Medium">Trung bình (Medium)</option>
                      <option value="Hard">Khó (Hard)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tác giả / Nguồn đề
                    </label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="Đề PE FPTU / Thầy cô"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                {/* GIAI ĐOẠN 1: DATA SANITIZATION PIPELINE INTEGRATION */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-rose-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-400">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span className="font-black text-xs uppercase tracking-wider text-slate-100">
                        Pipeline Chuẩn Hóa & Làm Sạch Dữ Liệu C (Data Sanitization)
                      </span>
                    </div>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
                      <input
                        type="checkbox"
                        checked={isAutoSanitizeActive}
                        onChange={(e) => setIsAutoSanitizeActive(e.target.checked)}
                        className="rounded text-rose-500"
                      />
                      <span>Tự động làm sạch</span>
                    </label>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Dán mã nguồn C từ tài liệu hoặc file vào đây. Hệ thống sẽ tự động <strong>loại bỏ lệnh Windows rác (system("cls"), system("pause"), getch(), fflush)</strong>, <strong>giải mã XML</strong>, <strong>đóng gói main()</strong> và <strong>sinh test cases hợp lệ</strong>.
                  </p>

                  <div className="space-y-1.5">
                    <textarea
                      value={rawSourceCodeInput}
                      onChange={(e) => setRawSourceCodeInput(e.target.value)}
                      placeholder="#include <stdio.h>&#10;int main() {&#10;    system(&quot;cls&quot;); // Pipeline sẽ tự động gỡ bỏ lệnh này&#10;    ...&#10;}"
                      rows={5}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-300 border border-slate-800 focus:outline-rose-500 leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleTriggerSanitization}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Kích Hoạt Làm Sạch & Trích Xuất Test Cases</span>
                    </button>

                    {pipelineReport && (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Đã làm sạch ({pipelineReport.cleanedLength} ký tự C chuẩn)
                      </span>
                    )}
                  </div>

                  {/* Sanitization Report Banner */}
                  {pipelineReport && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1 text-slate-300">
                      <div className="font-bold text-emerald-400">Kết quả kiểm tra bộ lọc:</div>
                      {pipelineReport.windowsCommandsRemoved.length > 0 ? (
                        <div className="text-amber-400">
                          • Đã loại bỏ lệnh Windows: <code className="bg-amber-950/60 px-1 rounded">{pipelineReport.windowsCommandsRemoved.join(', ')}</code>
                        </div>
                      ) : (
                        <div className="text-emerald-400">• Không phát hiện lệnh Windows không tương thích.</div>
                      )}
                      {pipelineReport.mainHarnessSynthesized && (
                        <div className="text-blue-400">• Đã tự động đóng gói hàm main() điểm vào để thực thi trong Sandbox.</div>
                      )}
                      <div>• Đã số hóa và chuẩn bị {pipelineReport.synthesizedTestCasesCount} test cases kiểm thử.</div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Đề bài chi tiết (Hỗ trợ Markdown & KaTeX)
                  </label>
                  <textarea
                    value={newStatement}
                    onChange={(e) => setNewStatement(e.target.value)}
                    placeholder="Mô tả yêu cầu bài toán... Ví dụ: Cho một mảng $N$ phần tử..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                {/* Testcases Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                      Bộ Testcases (Input / Expected Output)
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewTestcases(prev => [...prev, { input: '', output: '', isHidden: false }])}
                      className="text-rose-500 font-bold hover:underline cursor-pointer"
                    >
                      + Thêm test case
                    </button>
                  </div>

                  {newTestcases.map((tc, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-slate-500">Test #{idx + 1}</span>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={tc.isHidden}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setNewTestcases(prev => prev.map((t, i) => i === idx ? { ...t, isHidden: checked } : t));
                              }}
                              className="rounded text-rose-500"
                            />
                            <span className="text-[10px] text-slate-400">Test ẩn</span>
                          </label>
                          {newTestcases.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setNewTestcases(prev => prev.filter((_, i) => i !== idx))}
                              className="text-slate-400 hover:text-rose-500 cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={tc.input}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewTestcases(prev => prev.map((t, i) => i === idx ? { ...t, input: val } : t));
                          }}
                          placeholder="Input..."
                          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px]"
                        />
                        <input
                          type="text"
                          value={tc.output}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewTestcases(prev => prev.map((t, i) => i === idx ? { ...t, output: val } : t));
                          }}
                          placeholder="Expected Output..."
                          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsAddProblemModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleSaveProblem(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 cursor-pointer"
                  >
                    Lưu Bài Tập Vào Thư Mục
                  </button>
                </div>
              </div>
            )}

            {/* Tab: File Upload */}
            {activeModalTab === 'file' && (
              <div className="space-y-4 text-xs py-4">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-3 hover:border-rose-500 transition-colors">
                  <UploadCloud className="w-10 h-10 text-rose-500 mx-auto" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      Kéo thả hoặc chọn tập tin đề bài
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Hỗ trợ: <strong>.docx (Tài liệu tổng hợp PRF192)</strong>, .json, .c, .cpp, .txt
                    </p>
                    <p className="text-[10px] text-emerald-400 mt-1">
                      🛡️ Tệp .docx sẽ tự động kích hoạt Pipeline giải nén ZIP trong RAM và bóc tách làm sạch toàn bộ bài tập!
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".docx,.json,.c,.cpp,.txt"
                    onChange={handleFileUpload}
                    disabled={isBatchDocxProcessing}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-500/10 file:text-rose-500 hover:file:bg-rose-500/20 cursor-pointer disabled:opacity-50"
                  />
                </div>

                {isBatchDocxProcessing && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-3 animate-pulse">
                    <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                    <span>Đang giải nén DOCX trong bộ nhớ & Chạy Pipeline làm sạch dữ liệu... Vui lòng đợi trong giây lát!</span>
                  </div>
                )}

                {uploadError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                    {uploadError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: EXAM SIMULATION LAUNCH CONFIRMATION */}
      {isExamModalOpen && pendingExamSession && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 text-rose-400">
                <Timer className="w-6 h-6 animate-pulse" />
                <h3 className="font-black text-lg">
                  Xác Nhận Vào Phòng Thi Thử
                </h3>
              </div>
              <button
                onClick={() => setIsExamModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Bộ đề thi:</span>
                  <span className="font-bold text-slate-200">{pendingExamSession.collectionTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Số lượng câu đã trộn:</span>
                  <span className="font-bold text-rose-400">{pendingExamSession.problems.length} câu</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium">Thời gian làm bài:</span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { mins: 45, label: '45p' },
                      { mins: 90, label: '⭐ 90p (Lab PE)' },
                      { mins: 120, label: '120p' }
                    ].map(preset => (
                      <button
                        key={preset.mins}
                        type="button"
                        onClick={() => {
                          setExamDurationMinutes(preset.mins);
                          setPendingExamSession(prev => prev ? { ...prev, timeLimitMinutes: preset.mins } : null);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          pendingExamSession.timeLimitMinutes === preset.mins
                            ? 'bg-amber-500 text-slate-950 font-black shadow-xs ring-1 ring-amber-400'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Cơ chế chấm:</span>
                  <span className="font-bold text-emerald-400">Wasm GCC Sandbox (Đếm điểm tự động)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed">
                ⚠️ <strong>Quy chế phòng thi:</strong> Khi bắt đầu, đồng hồ đếm ngược sẽ chạy liên tục, toàn bộ gợi ý sẽ bị ẩn đi để phản ánh đúng năng lực làm bài thực tế của bạn.
              </div>

              <div>
                <span className="font-bold text-slate-300 block mb-1.5 uppercase text-[10px] tracking-wider">
                  Danh sách câu hỏi bốc ngẫu nhiên ({pendingExamSession.problems.length} câu):
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px]">
                  {pendingExamSession.problems.map((p, idx) => (
                    <div key={p.id} className="flex items-center justify-between py-0.5 text-slate-300">
                      <span className="truncate">{idx + 1}. {p.title}</span>
                      <span className="text-[10px] text-slate-500 shrink-0 ml-2">[{p.difficulty}]</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsExamModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleStartExamSession}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Bắt Đầu Tính Giờ & Vào Thi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PROBLEM PREVIEW MODAL */}
      {previewProblem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-rose-500">Xem Trước Đề Bài</span>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
                  {previewProblem.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewProblem(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Standard Problem Specification Framework (Khung hiển thị chuẩn Khảo Thí) */}
            <div className="py-2">
              <ProblemSpecificationView
                problem={previewProblem}
                showLangToggle={true}
                scoreWeight={`${previewProblem.points || 10}đ`}
                isExamMode={false}
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setPreviewProblem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  const prob = previewProblem;
                  setPreviewProblem(null);
                  if (onSelectProblem) onSelectProblem(prob);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Bắt Đầu Làm Bài Này</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL 5: BATCH REVIEW SANITIZED DOCX PROBLEMS */}
      {showBatchReviewModal && batchSanitizedResults.length > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl max-w-3xl w-full p-6 text-white shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
                <div>
                  <h3 className="font-black text-lg">
                    Báo Cáo Pipeline Làm Sạch Tệp DOCX (Giai Đoạn 1)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Đã trích xuất & làm sạch thành công <strong>{batchSanitizedResults.length} bài tập PRF192</strong> từ tệp Word
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBatchReviewModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pipeline Quality Certification Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs shrink-0">
              <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Làm sạch lệnh Windows:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> 100% C11/C17 Sandbox
                </span>
                <p className="text-[10px] text-slate-400">Đã gỡ bỏ system("cls"), pause, getch</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Số hóa Testcases:</span>
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> {batchSanitizedResults.reduce((acc, p) => acc + p.testcases.length, 0)} Tests Plain Text
                </span>
                <p className="text-[10px] text-slate-400">Chuyển từ ảnh Console sang Text</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Đóng gói Main():</span>
                <span className="font-bold text-blue-400 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4" /> Sẵn sàng chạy thử
                </span>
                <p className="text-[10px] text-slate-400">Không lỗi undefined reference</p>
              </div>
            </div>

            {/* Target Destination & Giai Đoạn 2 Auto-Classification */}
            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2.5 text-xs shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-bold">
                  <input
                    type="checkbox"
                    checked={autoRouteTo4Categories}
                    onChange={(e) => setAutoRouteTo4Categories(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    Tự động phân loại vào 4 Bộ Đề Lớn (Shape / Array / String / Math)
                  </span>
                </label>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Giai Đoạn 2 Khuyến Nghị
                </span>
              </div>

              {autoRouteTo4Categories ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-semibold flex items-center justify-between">
                    <span>1. Vẽ Hình</span>
                    <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-200">
                      {batchSanitizedResults.filter(p => (p.collectionId || classifyProblemCategory(p.title, p.code).collectionId) === 'prf192_shape_matrix').length} bài
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold flex items-center justify-between">
                    <span>2. Mảng 1 Chiều</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200">
                      {batchSanitizedResults.filter(p => (p.collectionId || classifyProblemCategory(p.title, p.code).collectionId) === 'prf192_array_sorting').length} bài
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold flex items-center justify-between">
                    <span>3. Chuỗi Ký Tự</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-200">
                      {batchSanitizedResults.filter(p => (p.collectionId || classifyProblemCategory(p.title, p.code).collectionId) === 'prf192_string_mastery').length} bài
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 font-semibold flex items-center justify-between">
                    <span>4. Số Học</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-200">
                      {batchSanitizedResults.filter(p => (p.collectionId || classifyProblemCategory(p.title, p.code).collectionId) === 'prf192_math_algorithms').length} bài
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
                  <span className="text-slate-300 font-medium">Nạp toàn bộ vào một thư mục được chọn:</span>
                  <select
                    value={targetCollectionId}
                    onChange={(e) => setTargetCollectionId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-100"
                  >
                    {collections.map(c => (
                      <option key={c.id} value={c.id}>
                        📁 {c.title} (hiện có {c.problems.length} bài)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Problem List Preview */}
            <div className="flex-1 overflow-y-auto space-y-2 border border-slate-800 rounded-2xl p-3 bg-slate-950/40 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Danh sách {batchSanitizedResults.length} bài toán đã qua bộ lọc làm sạch:
              </span>
              <div className="space-y-1.5">
                {batchSanitizedResults.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-200 truncate">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        {item.testcases.length} tests
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Đã làm sạch
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowBatchReviewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleBatchImportDocx}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Nạp Toàn Bộ {batchSanitizedResults.length} Bài Tập Vào Thư Mục →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
