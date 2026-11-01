import test from 'node:test';
import assert from 'node:assert/strict';

// Mock localStorage for Node environment
const localStorageMock = (() => {
  let store = {};
  let setItemCalls = 0;
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      setItemCalls++;
      store[key] = String(value);
    },
    removeItem: (key) => delete store[key],
    clear: () => {
      store = {};
      setItemCalls = 0;
    },
    getSetItemCallCount: () => setItemCalls,
    resetSetItemCallCount: () => { setItemCalls = 0; }
  };
})();

globalThis.localStorage = localStorageMock;

// Dynamically import collectionStorage
const {
  loadCollections,
  addProblemsBatchToCollections
} = await import('../src/services/collectionStorage.ts');

test('Solution 3: addProblemsBatchToCollections performs O(1) single disk write for 100 items', () => {
  localStorage.clear();
  
  // Seed default collections first
  const initialCols = loadCollections();
  assert.ok(initialCols.length > 0, 'Initial collections should be loaded');

  // Reset write counter
  localStorage.resetSetItemCallCount();

  // Create 100 mock problems distributed across collections
  const targetColId = initialCols[0].id;
  const targetCol2Id = initialCols[1].id;

  const batchItems = [];
  for (let i = 1; i <= 100; i++) {
    batchItems.push({
      collectionId: i % 2 === 0 ? targetColId : targetCol2Id,
      problem: {
        id: `mock_batch_${i}`,
        slug: `mock_slug_${i}`,
        title: `Mock Batch Problem #${i}`,
        category: 'Batch Category',
        difficulty: 'Easy',
        points: 100,
        timeLimit: 1.0,
        memoryLimit: 128,
        tags: ['BatchTest'],
        solvedCount: 0,
        totalSubmissions: 0,
        statement: 'Test statement',
        inputFormat: 'None',
        outputFormat: 'None',
        constraints: 'None',
        samples: [{ input: '1', output: '1' }],
        testcases: [{ id: 1, input: '1', expectedOutput: '1', isHidden: false }],
        createdAt: '2026-11-01',
        isCustom: true
      }
    });
  }

  // Execute batch addition
  const updatedCollections = addProblemsBatchToCollections(batchItems);

  // Assert: localStorage.setItem MUST only be called ONCE for the entire batch of 100 items!
  const diskWrites = localStorage.getSetItemCallCount();
  assert.strictEqual(diskWrites, 1, `Expected exactly 1 disk write operation, but got ${diskWrites}`);

  // Assert: All 100 problems were added properly
  const col1 = updatedCollections.find(c => c.id === targetColId);
  const col2 = updatedCollections.find(c => c.id === targetCol2Id);

  const col1BatchProbs = col1.problems.filter(p => p.id.startsWith('mock_batch_'));
  const col2BatchProbs = col2.problems.filter(p => p.id.startsWith('mock_batch_'));

  assert.strictEqual(col1BatchProbs.length, 50, 'Col 1 should receive 50 problems');
  assert.strictEqual(col2BatchProbs.length, 50, 'Col 2 should receive 50 problems');

  // Assert: problem attributes are properly set
  assert.strictEqual(col1BatchProbs[0].collectionId, targetColId);
  assert.strictEqual(col1BatchProbs[0].isCustom, true);
});

test('Solution 3: Updating an existing problem in batch replaces it without duplicate ids', () => {
  const initialCols = loadCollections();
  const targetColId = initialCols[0].id;

  const originalItem = {
    collectionId: targetColId,
    problem: {
      id: 'mock_unique_prob_1',
      slug: 'mock_unique_prob_1',
      title: 'Original Title',
      category: 'Math',
      difficulty: 'Easy',
      points: 100,
      timeLimit: 1.0,
      memoryLimit: 128,
      tags: [],
      solvedCount: 0,
      totalSubmissions: 0,
      statement: 'Original',
      inputFormat: '',
      outputFormat: '',
      constraints: '',
      samples: [],
      testcases: []
    }
  };

  addProblemsBatchToCollections([originalItem]);

  const updatedItem = {
    collectionId: targetColId,
    problem: {
      ...originalItem.problem,
      title: 'Updated Title'
    }
  };

  const finalCols = addProblemsBatchToCollections([updatedItem]);
  const col = finalCols.find(c => c.id === targetColId);
  const matched = col.problems.filter(p => p.id === 'mock_unique_prob_1');

  assert.strictEqual(matched.length, 1, 'Should not create duplicate problem id');
  assert.strictEqual(matched[0].title, 'Updated Title', 'Should update problem in place');
});
