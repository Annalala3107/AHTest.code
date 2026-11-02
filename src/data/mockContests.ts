import { Contest } from '../types';

export const mockContests: Contest[] = [
  {
    id: 'c-1',
    slug: 'ahcup26_final',
    title: '[Official] AH CUP 2026 - Chung Kết Toàn Quốc 🔥',
    description: 'Vòng chung kết trực tiếp quy tụ 12 cao thủ thuật toán xuất sắc nhất Việt Nam và bảng đấu mở rộng.',
    startTime: '2026-11-15T09:00:00Z',
    endTime: '2026-11-15T14:00:00Z',
    durationMinutes: 300,
    isRated: true,
    status: 'UPCOMING',
    tags: ['AH Cup', 'Rated', 'IOI Style', 'Grand Final'],
    participantsCount: 1450,
    problems: [
      { code: 'A', slug: 'icpc26_mn_c', title: 'Sodium Sort', points: 100, solvedCount: 45 },
      { code: 'B', slug: 'torch', title: 'Rước đuốc Olympic', points: 100, solvedCount: 31 },
      { code: 'C', slug: 'voi26_pine', title: 'Cây thông', points: 100, solvedCount: 8 }
    ]
  },
  {
    id: 'c-2',
    slug: 'bedao_r35',
    title: 'Bedao Regular Contest 35 ⚡',
    description: 'Kỳ thi đánh giá rating định kỳ cuối tuần do nhóm tác giả Bedao biên soạn với phong cách đề hiện đại.',
    startTime: '2026-10-31T13:30:00Z',
    endTime: '2026-10-31T16:00:00Z',
    durationMinutes: 150,
    isRated: true,
    status: 'RUNNING',
    tags: ['Bedao', 'Rated', 'ICPC Rule'],
    participantsCount: 890,
    problems: [
      { code: 'A', slug: 'olp_ct25_lgsqr', title: 'Cặp số', points: 100, solvedCount: 420 },
      { code: 'B', slug: 'torch', title: 'Rước đuốc Olympic', points: 100, solvedCount: 185 },
      { code: 'C', slug: 'icpc26_mn_c', title: 'Sodium Sort', points: 100, solvedCount: 52 }
    ]
  },
  {
    id: 'c-3',
    slug: 'icpc26_mt_mirror',
    title: '[Mirror] ICPC 2026 Miền Trung - Central Regional',
    description: 'Bản thi ảo chính thức kỳ thi Lập trình sinh viên quốc tế ICPC khu vực miền Trung.',
    startTime: '2026-10-25T07:00:00Z',
    endTime: '2026-10-25T12:00:00Z',
    durationMinutes: 300,
    isRated: false,
    status: 'PAST',
    tags: ['ICPC', 'Virtual Allowed', 'ACM Style'],
    participantsCount: 312,
    problems: [
      { code: 'A', slug: 'torch', title: 'Rước đuốc', points: 100, solvedCount: 204 },
      { code: 'B', slug: 'icpc26_mn_c', title: 'Sodium Sort', points: 100, solvedCount: 89 }
    ]
  }
];
