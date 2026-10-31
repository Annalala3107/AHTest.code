import { Submission } from '../types';

export const mockSubmissions: Submission[] = [
  {
    id: '13791144',
    problemId: '2',
    problemTitle: 'Rước đuốc Olympic',
    problemSlug: 'torch',
    user: {
      username: 'iwantagf',
      fullName: 'Vũ Minh Quân',
      rating: 1945,
      rankClass: 'rate-candidate-master'
    },
    language: 'C++17',
    verdict: 'AC',
    score: 100,
    maxScore: 100,
    time: 0.12,
    memory: 24.5,
    submittedAt: 'Vài giây trước',
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (cin >> n) {
        // Solution implementation
        cout << 2 << "\\n";
    }
    return 0;
}`,
    tests: [
      { testId: 1, verdict: 'AC', time: 10, memory: 4096, score: 20, maxScore: 20 },
      { testId: 2, verdict: 'AC', time: 15, memory: 5120, score: 30, maxScore: 30 },
      { testId: 3, verdict: 'AC', time: 35, memory: 8192, score: 50, maxScore: 50 }
    ]
  },
  {
    id: '13791143',
    problemId: '3',
    problemTitle: 'VOI 26 Bài 5 - Cây thông',
    problemSlug: 'voi26_pine',
    user: {
      username: 'Storm',
      fullName: 'Lê Anh Dũng',
      rating: 1320,
      rankClass: 'rate-pupil'
    },
    language: 'C++14',
    verdict: 'TLE',
    score: 80,
    maxScore: 100,
    time: 1.55,
    memory: 64.2,
    submittedAt: '2 phút trước',
    code: `// Brute force subtask 1 & 2`,
    tests: [
      { testId: 1, verdict: 'AC', time: 15, memory: 4096, score: 20, maxScore: 20 },
      { testId: 2, verdict: 'AC', time: 30, memory: 6144, score: 30, maxScore: 30 },
      { testId: 3, verdict: 'AC', time: 45, memory: 10240, score: 30, maxScore: 30 },
      { testId: 4, verdict: 'TLE', time: 1550, memory: 65536, score: 0, maxScore: 20 }
    ]
  },
  {
    id: '13791140',
    problemId: '1',
    problemTitle: 'Sodium Sort',
    problemSlug: 'icpc26_mn_c',
    user: {
      username: 'fextivity',
      fullName: 'Trần Xuân Bách',
      rating: 3236,
      rankClass: 'rate-legendary-grandmaster'
    },
    language: 'C++20',
    verdict: 'AC',
    score: 100,
    maxScore: 100,
    time: 0.08,
    memory: 18.2,
    submittedAt: '5 phút trước',
    code: `// Optimal solution with Fenwick Tree & coordinate compression`,
    tests: [
      { testId: 1, verdict: 'AC', time: 8, memory: 3100, score: 20, maxScore: 20 },
      { testId: 2, verdict: 'AC', time: 18, memory: 5600, score: 30, maxScore: 30 },
      { testId: 3, verdict: 'AC', time: 42, memory: 12400, score: 50, maxScore: 50 }
    ]
  },
  {
    id: '13791118',
    problemId: '4',
    problemTitle: 'CẶP SỐ (OLP 2025)',
    problemSlug: 'olp_ct25_lgsqr',
    user: {
      username: 'notacoder',
      fullName: 'Hoàng Minh',
      rating: 1150,
      rankClass: 'rate-none'
    },
    language: 'Python 3',
    verdict: 'WA',
    score: 0,
    maxScore: 20,
    time: 0.45,
    memory: 12.0,
    submittedAt: '12 phút trước',
    code: `import sys\n# Incomplete sieve`,
    tests: [
      { testId: 1, verdict: 'WA', time: 45, memory: 8192, score: 0, maxScore: 20 }
    ]
  }
];
