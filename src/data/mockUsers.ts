export interface UserItem {
  id: string;
  username: string;
  fullName: string;
  rating: number;
  rankTitle: string;
  rankColor: string;
  organization: string;
  solvedCount: number;
  points: number;
  avatar: string;
  ratingHistory: { contest: string; rating: number; date: string; rank: number }[];
}

export const mockUsers: UserItem[] = [
  {
    id: 'u-1',
    username: 'fextivity',
    fullName: 'Trần Xuân Bách',
    rating: 3236,
    rankTitle: 'Legendary Grandmaster',
    rankColor: 'text-red-500 font-bold',
    organization: 'THPT chuyên Khoa học Tự nhiên - ĐHQG Hà Nội',
    solvedCount: 336,
    points: 88.41,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    ratingHistory: [
      { contest: 'Bedao Testing Contest 01', rating: 1916, date: '2021-08-08', rank: 5 },
      { contest: 'Bedao Regular Contest 01', rating: 2316, date: '2021-09-19', rank: 1 },
      { contest: 'Bedao Regular Contest 02', rating: 2485, date: '2021-10-15', rank: 2 },
      { contest: 'Bedao Hay Khong? Hay Hay', rating: 2636, date: '2022-01-01', rank: 1 },
      { contest: 'Bedao Regular Contest 04', rating: 2731, date: '2022-03-20', rank: 1 },
      { contest: 'Bedao Regular Contest 05', rating: 2808, date: '2022-04-17', rank: 1 },
      { contest: 'AH CUP 2022 - Vòng loại 1', rating: 2961, date: '2022-06-18', rank: 1 },
      { contest: 'AH CUP 2023 - Vòng loại 1', rating: 3109, date: '2023-05-13', rank: 1 },
      { contest: 'AH CUP 2024 - Vòng loại 2', rating: 3142, date: '2024-06-16', rank: 1 },
      { contest: 'DYTECHLAB ALGORITHMS BATTLE', rating: 3236, date: '2024-11-02', rank: 1 },
    ]
  },
  {
    id: 'u-2',
    username: 'hollwo_pelw',
    fullName: 'Phạm Quốc Hùng',
    rating: 2814,
    rankTitle: 'International Grandmaster',
    rankColor: 'text-red-500 font-bold',
    organization: 'Trường Đại học Công nghệ - ĐHQG Hà Nội',
    solvedCount: 139,
    points: 44.60,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ratingHistory: [
      { contest: 'Bedao Regular 10', rating: 2400, date: '2022-09-01', rank: 3 },
      { contest: 'AH CUP 2023', rating: 2650, date: '2023-06-01', rank: 2 },
      { contest: 'AH CUP 2024', rating: 2814, date: '2024-06-20', rank: 2 },
    ]
  },
  {
    id: 'u-3',
    username: 'Hollowed',
    fullName: 'Lê Hoàng Đăng',
    rating: 2785,
    rankTitle: 'International Grandmaster',
    rankColor: 'text-red-500 font-bold',
    organization: 'Trường Phổ thông Năng khiếu - ĐHQG TP.HCM',
    solvedCount: 110,
    points: 66.56,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    ratingHistory: [
      { contest: 'Bedao Regular 12', rating: 2500, date: '2022-11-01', rank: 4 },
      { contest: 'AH CUP 2024', rating: 2785, date: '2024-06-25', rank: 3 },
    ]
  },
  {
    id: 'u-4',
    username: 'marvinthang',
    fullName: 'Nguyễn Đức Thắng',
    rating: 2759,
    rankTitle: 'International Grandmaster',
    rankColor: 'text-red-500 font-bold',
    organization: 'Đại học Bách Khoa Hà Nội',
    solvedCount: 1059,
    points: 148.46,
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    ratingHistory: [
      { contest: 'Bedao Regular 20', rating: 2600, date: '2023-01-01', rank: 2 },
      { contest: 'ICPC 2024 Final', rating: 2759, date: '2024-12-10', rank: 1 },
    ]
  }
];
