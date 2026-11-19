-- =========================================================================
-- AHtest.code Initial Seed Data
-- =========================================================================

-- 1. Insert Core Competitive Problems
insert into public.problems (
  id, title, title_en, difficulty, points, category, tags,
  time_limit_ms, memory_limit_kb, statement, input_format, output_format, constraints,
  samples, is_published, track
) values
(
  'icpc26_mn_c',
  'Cây Khung Cân Bằng (Balanced Spanning Tree)',
  'Balanced Spanning Tree',
  'Hard',
  100,
  'Đồ thị & Cây',
  array['Graph', 'Spanning Tree', 'ICPC', 'DSU'],
  2000,
  262144,
  'Cho một đơn đồ thị vô hướng liên thông gồm N đỉnh và M cạnh có trọng số...',
  'Dòng đầu tiên chứa hai số nguyên N và M...',
  'In ra một số nguyên duy nhất là độ chênh lệch nhỏ nhất...',
  '2 <= N <= 1000, N - 1 <= M <= 5000',
  '[{"input": "4 5\\n1 2 3\\n2 3 5\\n3 4 8\\n4 1 2\\n1 3 6", "output": "3"}]'::jsonb,
  true,
  'competitive'
),
(
  'torch',
  'Rước Đuốc Olympic (Torch Relay)',
  'Torch Relay',
  'Medium',
  100,
  'Quy hoạch động',
  array['DP', 'Olympic', 'Binary Search'],
  1000,
  262144,
  'Ban tổ chức Olympic chuẩn bị tổ chức lễ rước đuốc qua N địa điểm...',
  'Dòng đầu chứa N và K...',
  'In ra thời gian tối thiểu...',
  '1 <= N <= 100000, 1 <= K <= N',
  '[{"input": "5 2\\n1 3 6 8 10", "output": "3"}]'::jsonb,
  true,
  'competitive'
),
(
  'voi26_pine',
  'Rừng Thông Đà Lạt (Pine Forest)',
  'Pine Forest',
  'Hard',
  100,
  'Hình học & Cây',
  array['Geometry', 'Convex Hull', 'VOI'],
  2000,
  262144,
  'Thành phố Đà Lạt nổi tiếng với những cánh rừng thông xanh ngát...',
  'Dòng đầu chứa số nguyên N...',
  'In ra diện tích đa giác lồi nhỏ nhất...',
  '3 <= N <= 50000',
  '[{"input": "4\\n0 0\\n0 4\\n4 0\\n4 4", "output": "16.0"}]'::jsonb,
  true,
  'competitive'
),
(
  'olp_ct25_lgsqr',
  'Hình Vuông Lớn Nhất (Largest Square)',
  'Largest Square',
  'Medium',
  100,
  'Quy hoạch động',
  array['DP', 'Matrix', 'Olympic'],
  1000,
  262144,
  'Cho một ma trận nhị phân kích thước M x N chỉ gồm các ký tự 0 và 1...',
  'Dòng đầu chứa hai số M và N...',
  'In ra diện tích hình vuông lớn nhất chỉ gồm toàn số 1...',
  '1 <= M, N <= 1000',
  '[{"input": "4 5\\n1 0 1 0 0\\n1 0 1 1 1\\n1 1 1 1 1\\n1 0 0 1 0", "output": "4"}]'::jsonb,
  true,
  'competitive'
)
on conflict (id) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  samples = excluded.samples;

-- 2. Insert Core Contests
insert into public.contests (
  slug, title, description, start_time, end_time, duration_minutes,
  status, is_rated, tags, registration_count
) values
(
  'icpc_national_2026',
  'Kỳ thi Lập trình Sinh viên Quốc tế ICPC Quốc gia 2026',
  'Vòng thi chính thức lựa chọn các đội tuyển xuất sắc nhất tham dự Vòng khu vực Châu Á.',
  now() - interval '1 hour',
  now() + interval '4 hours',
  300,
  'RUNNING',
  true,
  array['ICPC', 'National', 'Algorithms', 'Team'],
  342
),
(
  'vnoi_cup_2026',
  'VNOI Cup 2026 - Vòng Loại Trực Tuyến #1',
  'Giải đấu cá nhân đỉnh cao dành cho các lập trình viên thi đấu chuyên nghiệp toàn quốc.',
  now() + interval '2 days',
  now() + interval '2 days 3 hours',
  180,
  'UPCOMING',
  true,
  array['VNOI Cup', 'Rated', 'Individual'],
  518
)
on conflict (slug) do nothing;

-- 3. Insert Problem Collections
insert into public.problem_collections (
  id, title, description, icon, color, category, problem_ids, is_official
) values
(
  'col_national_olympiad',
  'Bộ Đề Tuyển Chọn Olympic Tin Học Quốc Gia (VOI)',
  'Tổng hợp các bài toán kinh điển phân loại cao từ kỳ thi Chọn học sinh giỏi Quốc gia.',
  'Trophy',
  'amber',
  'Olympic',
  array['voi26_pine', 'torch', 'icpc26_mn_c', 'olp_ct25_lgsqr'],
  true
),
(
  'col_icpc_regional',
  'Luyện Tập ICPC Regional & Asia Pacific',
  'Bộ đề kiểm thử kỹ năng phối hợp thuật toán, cấu trúc dữ liệu nâng cao và tối ưu thời gian.',
  'Cpu',
  'rose',
  'ICPC',
  array['icpc26_mn_c', 'olp_ct25_lgsqr', 'torch'],
  true
)
on conflict (id) do nothing;
