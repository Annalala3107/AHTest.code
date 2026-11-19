import React, { useState } from 'react';
import type { Problem, ProblemCollection, ExamSessionConfig } from '../types/index.ts';
import {
  loadCollections,
  restoreFull115MasterBank,
  createCollection,
  deleteCollection,
  addProblemToCollection,
  addProblemsBatchToCollections,
  deleteProblemFromCollection,
} from '../services/collectionStorage.ts';
import type { SanitizedProblemResult } from '../services/dataSanitizationPipeline.ts';
import { showToast, askConfirm } from '../services/uiFeedback.ts';
import { CollectionHubView } from './importer/CollectionHubView.tsx';
import { CollectionDetailView } from './importer/CollectionDetailView.tsx';
import { CreateCollectionModal } from './importer/CreateCollectionModal.tsx';
import { ImportProblemModal } from './importer/ImportProblemModal.tsx';
import { ExamSetupModal } from './importer/ExamSetupModal.tsx';
import { ProblemPreviewModal } from './importer/ProblemPreviewModal.tsx';
import { BatchDocxReviewModal } from './importer/BatchDocxReviewModal.tsx';

interface ProblemImporterViewProps {
  onSelectProblem: (problem: Problem) => void;
  onStartExam: (sessionConfig: ExamSessionConfig) => void;
}

export const ProblemImporterView: React.FC<ProblemImporterViewProps> = ({
  onSelectProblem,
  onStartExam,
}) => {
  const [collections, setCollections] = useState<ProblemCollection[]>(() => loadCollections());
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals state
  const [isAddCollectionModalOpen, setIsAddCollectionModalOpen] = useState(false);
  const [isAddProblemModalOpen, setIsAddProblemModalOpen] = useState(false);
  const [targetCollectionId, setTargetCollectionId] = useState<string>('user_custom_library');
  const [previewProblem, setPreviewProblem] = useState<Problem | null>(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examCollection, setExamCollection] = useState<ProblemCollection | null>(null);

  // Batch docx extraction review
  const [batchDocxItems, setBatchDocxItems] = useState<SanitizedProblemResult[]>([]);
  const [isBatchReviewModalOpen, setIsBatchReviewModalOpen] = useState(false);

  const activeCollection = collections.find((c) => c.id === activeCollectionId) || null;

  // Restore 115 Master PRF192 Bank
  const handleRestoreMasterBank = async () => {
    const confirmed = await askConfirm({
      title: 'Khôi phục 115 bài tập gốc?',
      message:
        'Thao tác này sẽ đồng bộ và khôi phục trọn vẹn 115 bài tập mẫu chuẩn PRF192 vào thư viện của bạn.',
      confirmText: 'Đồng bộ ngay',
    });
    if (!confirmed) return;

    const restored = restoreFull115MasterBank();
    setCollections(restored);
    showToast('Đã khôi phục thành công 115 bài tập gốc PRF192!', 'success');
  };

  // Create Collection
  const handleCreateCollection = (data: {
    title: string;
    description: string;
    category: string;
    color: 'rose' | 'amber' | 'emerald' | 'blue' | 'purple' | 'cyan';
    icon: string;
  }) => {
    createCollection(data.title, data.description, data.category, data.color, data.icon);
    setCollections(loadCollections());
    showToast(`Đã tạo thư mục "${data.title}" thành công.`, 'success');
  };

  // Delete Collection
  const handleDeleteCollection = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = await askConfirm({
      title: 'Xóa thư mục bộ đề?',
      message: 'Bạn có chắc chắn muốn xóa thư mục tùy chỉnh này? Hành động này không thể hoàn tác.',
      confirmText: 'Xóa thư mục',
    });
    if (!confirmed) return;

    const updated = deleteCollection(id);
    setCollections(updated);
    if (activeCollectionId === id) {
      setActiveCollectionId(null);
    }
    showToast('Đã xóa thư mục bộ đề.', 'info');
  };

  // Save single manual problem
  const handleSaveManualProblem = (prob: Problem) => {
    const targetId = prob.collectionId || targetCollectionId;
    const updated = addProblemToCollection(targetId, prob);
    setCollections(updated);
    showToast(`Đã thêm bài tập "${prob.title}" thành công!`, 'success');
  };

  // Delete Problem from collection
  const handleDeleteProblem = async (problemId: string) => {
    if (!activeCollectionId) return;
    const confirmed = await askConfirm({
      title: 'Xóa bài tập?',
      message: 'Bạn có chắc chắn muốn xóa bài tập này khỏi bộ đề?',
      confirmText: 'Xóa',
    });
    if (!confirmed) return;

    const updated = deleteProblemFromCollection(activeCollectionId, problemId);
    setCollections(updated);
    showToast('Đã xóa bài tập.', 'info');
  };

  // Start Exam Setup Modal
  const handleStartExamSetup = (collection: ProblemCollection) => {
    if (!collection.problems || collection.problems.length === 0) {
      showToast('Bộ đề này chưa có bài tập nào để tổ chức thi!', 'warning');
      return;
    }
    setExamCollection(collection);
    setIsExamModalOpen(true);
  };

  // Batch docx extraction callback
  const handleBatchDocxExtracted = (items: SanitizedProblemResult[]) => {
    setBatchDocxItems(items);
    setIsBatchReviewModalOpen(true);
  };

  // Confirm committing batch items into collections
  const handleCommitBatchDocx = () => {
    if (batchDocxItems.length === 0) return;
    const batchItems = batchDocxItems.map((item, idx) => ({
      collectionId: item.collectionId || targetCollectionId,
      problem: {
        id: item.id || `docx_${Date.now()}_${idx}`,
        slug: item.id || `docx_${Date.now()}_${idx}`,
        title: item.title,
        category: item.category,
        difficulty: item.difficulty,
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: [item.category],
        solvedCount: 0,
        totalSubmissions: 0,
        statement: item.statement,
        inputFormat: item.inputFormat,
        outputFormat: item.outputFormat,
        constraints: item.constraints,
        samples: item.samples,
        testcases: item.testcases,
        author: 'DOCX Importer',
        source: 'DOCX Upload',
        createdAt: new Date().toISOString().split('T')[0],
      } as Problem,
    }));
    const updated = addProblemsBatchToCollections(batchItems);
    setCollections(updated);
    setIsBatchReviewModalOpen(false);
    setBatchDocxItems([]);
    showToast(`Đã lưu thành công ${batchItems.length} bài tập vào bộ đề!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* View router: Hub vs Detail */}
      {!activeCollection ? (
        <CollectionHubView
          collections={collections}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onSelectCollection={(colId) => setActiveCollectionId(colId)}
          onOpenCreateCollectionModal={() => setIsAddCollectionModalOpen(true)}
          onOpenImportProblemModal={() => {
            setTargetCollectionId(collections[0]?.id || 'user_custom_library');
            setIsAddProblemModalOpen(true);
          }}
          onRestoreMasterBank={handleRestoreMasterBank}
          onDeleteCollection={handleDeleteCollection}
        />
      ) : (
        <CollectionDetailView
          collection={activeCollection}
          onBackToHub={() => setActiveCollectionId(null)}
          onStartExamSetup={handleStartExamSetup}
          onSelectProblem={onSelectProblem}
          onPreviewProblem={(prob) => setPreviewProblem(prob)}
          onDeleteProblem={handleDeleteProblem}
          onOpenImportModal={() => {
            setTargetCollectionId(activeCollection.id);
            setIsAddProblemModalOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <CreateCollectionModal
        isOpen={isAddCollectionModalOpen}
        onClose={() => setIsAddCollectionModalOpen(false)}
        onCreate={handleCreateCollection}
      />

      <ImportProblemModal
        isOpen={isAddProblemModalOpen}
        collections={collections}
        targetCollectionId={targetCollectionId}
        setTargetCollectionId={setTargetCollectionId}
        onClose={() => setIsAddProblemModalOpen(false)}
        onSaveManualProblem={handleSaveManualProblem}
        onBatchDocxExtracted={handleBatchDocxExtracted}
      />

      <ExamSetupModal
        isOpen={isExamModalOpen}
        collection={examCollection}
        onClose={() => setIsExamModalOpen(false)}
        onConfirmStartExam={onStartExam}
      />

      <ProblemPreviewModal
        problem={previewProblem}
        onClose={() => setPreviewProblem(null)}
        onSelectProblem={onSelectProblem}
      />

      <BatchDocxReviewModal
        isOpen={isBatchReviewModalOpen}
        batchItems={batchDocxItems}
        targetCollectionTitle={
          collections.find((c) => c.id === targetCollectionId)?.title || 'Bộ đề chọn'
        }
        onClose={() => {
          setIsBatchReviewModalOpen(false);
          setBatchDocxItems([]);
        }}
        onConfirmCommit={handleCommitBatchDocx}
      />
    </div>
  );
};
