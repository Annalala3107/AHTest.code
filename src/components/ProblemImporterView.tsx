import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  UploadCloud, 
  Plus, 
  Search, 
  CheckCircle2, 
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
  FolderPlus
} from 'lucide-react';
import { Problem, Difficulty, TestCaseItem, ProblemCollection, ExamSessionConfig } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';
import {
  loadCollections,
  saveCollections,
  resetCollectionsToDefault,
  createCollection,
  deleteCollection,
  addProblemToCollection,
  deleteProblemFromCollection,
  createExamSession
} from '../services/collectionStorage';

interface ProblemImporterViewProps {
  onSelectProblem?: (problem: Problem) => void;
}

export const ProblemImporterView: React.FC<ProblemImporterViewProps> = ({ onSelectProblem }) => {
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

  // Exam Simulation Mode State
  const [examQuestionCount, setExamQuestionCount] = useState<number>(10);
  const [examDurationMinutes, setExamDurationMinutes] = useState<number>(60);
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

    const created: Problem = {
      id: `imported_${Date.now()}`,
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

    const updated = addProblemToCollection(targetCollectionId, created);
    setCollections(updated);
    setIsAddProblemModalOpen(false);

    // Reset Form
    setNewTitle('');
    setNewSlug('');
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

  // Handle File Upload into Target Collection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

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
          const prob: Problem = {
            id: `imported_${Date.now()}`,
            slug: file.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            title: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
            category: 'Thực hành C/C++',
            difficulty: 'Easy',
            points: 100,
            timeLimit: 1.0,
            memoryLimit: 128,
            tags: ['SourceFile', 'Imported'],
            solvedCount: 0,
            totalSubmissions: 0,
            statement: `### Đề bài nạp từ tập tin: \`${file.name}\`\n\n\`\`\`c\n${text.slice(0, 1500)}\n\`\`\``,
            inputFormat: 'Xem nội dung đề bài.',
            outputFormat: 'Xem nội dung đề bài.',
            constraints: 'Theo chuẩn Sandbox.',
            samples: [{ input: '1', output: '1' }],
            testcases: [{ id: 1, input: '1', expectedOutput: '1', isHidden: false }],
            author: 'Tập tin nạp ngoài',
            source: file.name,
            createdAt: new Date().toISOString().split('T')[0],
            isCustom: true,
            collectionId: targetCollectionId
          };
          const updated = addProblemToCollection(targetCollectionId, prob);
          setCollections(updated);
          setIsAddProblemModalOpen(false);
          alert(`Đã nạp bài toán từ file ${file.name} vào thư mục!`);
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
    const firstProblem = pendingExamSession.problems[0];
    setIsExamModalOpen(false);
    if (onSelectProblem) {
      // Open problem in exam mode
      onSelectProblem({
        ...firstProblem,
        source: `Kỳ thi thử: ${pendingExamSession.collectionTitle} (${pendingExamSession.timeLimitMinutes}p)`
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
                onClick={handleResetCollections}
                title="Khôi phục các thư mục PRF192 chuẩn hóa ban đầu"
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chuẩn Hóa PRF192</span>
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

                    <div className={`flex items-center gap-1 font-bold ${styles.text} text-xs group-hover:translate-x-1 transition-transform`}>
                      <span>Mở Thư Mục</span>
                      <ChevronRight className="w-4 h-4" />
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
                      {[10, 15, 20].map((num) => (
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
                      {[45, 60, 90].map((min) => (
                        <button
                          key={min}
                          onClick={() => setExamDurationMinutes(min)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            examDurationMinutes === min
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {min} phút
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

              <a
                href="#problem-list-section"
                className="w-full py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Khám Phá Danh Sách Bài Tập Bên Dưới ↓</span>
              </a>
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

                        {/* Progressive hints availability badge */}
                        {prob.progressiveHints && prob.progressiveHints.length > 0 && (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                            <Lightbulb className="w-3 h-3" />
                            <span>Có sẵn 3 Tầng Gợi Ý Thông Minh</span>
                          </div>
                        )}
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
                            onClick={() => onSelectProblem && onSelectProblem(prob)}
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
                      Hỗ trợ: .json (cấu trúc đề hoàn chỉnh), .c, .cpp, .txt
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".json,.c,.cpp,.txt"
                    onChange={handleFileUpload}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-500/10 file:text-rose-500 hover:file:bg-rose-500/20 cursor-pointer"
                  />
                </div>

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
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Thời gian làm bài:</span>
                  <span className="font-bold text-amber-400">{pendingExamSession.timeLimitMinutes} phút</span>
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

            {/* Statement rendered via KaTeX */}
            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm">
              <KaTeXRenderer content={previewProblem.statement} />
            </div>

            {/* Samples */}
            {previewProblem.samples && previewProblem.samples.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Ví Dụ Minh Họa (Samples):
                </span>
                {previewProblem.samples.map((s, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="font-bold text-slate-500 block mb-1">Input:</span>
                        <pre className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] overflow-x-auto">
                          {s.input}
                        </pre>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500 block mb-1">Expected Output:</span>
                        <pre className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] overflow-x-auto">
                          {s.output}
                        </pre>
                      </div>
                    </div>
                    {s.explanation && (
                      <p className="text-[11px] text-slate-400 italic">
                        💡 Giải thích: {s.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

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
    </div>
  );
};
