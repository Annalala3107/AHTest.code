import type { AcademyCourse } from '../../types/index.ts';

export const sqlCourse: AcademyCourse = {
  id: 'sql-mastery',
  slug: 'sql-postgresql-database',
  title: 'SQL & PostgreSQL Thực Chiến (DQL -> Analytics)',
  titleEn: 'SQL & PostgreSQL Mastery',
  language: 'sql',
  level: 'Beginner',
  description:
    'Làm chủ ngôn ngữ truy vấn SQL chuẩn PostgreSQL: SELECT, WHERE, ORDER BY, hàm tổng hợp COUNT/SUM/GROUP BY và thao tác DDL/DML.',
  descriptionEn:
    'Master PostgreSQL SQL querying: SELECT, WHERE, ORDER BY, COUNT/SUM/GROUP BY aggregates, and DDL/DML schemas.',
  totalLessons: 3,
  estimatedHours: 3,
  isComingSoon: false,
  modules: [
    {
      id: 'sql-mod-1',
      title: 'Chương 1: Truy Vấn & Phân Tích Dữ Liệu SQL',
      titleEn: 'Chapter 1: SQL Querying & Data Analytics',
      description: 'Lọc dữ liệu, sắp xếp kết quả và thống kê tổng hợp trên cơ sở dữ liệu quan hệ.',
      descriptionEn: 'Filter records, sort results, and aggregate data across relational tables.',
      lessons: [
        {
          id: 'sql-1-select',
          title: 'Bài 1: Truy vấn lọc & sắp xếp với SELECT, WHERE, ORDER BY',
          titleEn: 'Lesson 1: Filtering & Sorting with SELECT, WHERE, ORDER BY',
          durationMinutes: 6,
          summary: 'Lọc sinh viên có GPA >= 3.5 và sắp xếp giảm dần theo điểm GPA.',
          summaryEn: 'Filter students with GPA >= 3.5 and order descending by GPA.',
          content: `### 1. Truy vấn dữ liệu chuẩn PostgreSQL
Cơ sở dữ liệu trường đại học có sẵn bảng \`students(id, name, major, gpa)\`.
Để lọc các hàng thỏa điều kiện và sắp xếp kết quả, ta dùng \`WHERE\` và \`ORDER BY ... DESC\`:
\`\`\`sql
SELECT name, major, gpa
FROM students
WHERE gpa >= 3.5
ORDER BY gpa DESC;
\`\`\`

### 2. Nhiệm vụ của bạn:
Hãy viết câu truy vấn lấy 2 cột \`name\` và \`gpa\` từ bảng \`students\` của những sinh viên có \`gpa >= 3.5\`, sắp xếp theo \`gpa\` **giảm dần**.`,
          contentEn: `### 1. Standard PostgreSQL Querying
The university database contains \`students(id, name, major, gpa)\`.
Filter records with \`WHERE\` and sort them with \`ORDER BY ... DESC\`.

### 2. Your Task:
Select \`name\` and \`gpa\` from \`students\` where \`gpa >= 3.5\`, ordered by \`gpa\` descending.`,
          initialCode: `-- Truy vấn danh sách sinh viên có gpa >= 3.5, sắp xếp giảm dần theo gpa
SELECT name, gpa
FROM students
-- TODO: Thêm điều kiện WHERE và sắp xếp ORDER BY
;
`,
          solutionCode: `SELECT name, gpa
FROM students
WHERE gpa >= 3.5
ORDER BY gpa DESC;`,
          hints: [
            'Dùng `WHERE gpa >= 3.5` để lọc sinh viên đạt yêu cầu.',
            'Dùng `ORDER BY gpa DESC` để sắp xếp từ cao xuống thấp.'
          ],
          hintsEn: [
            'Use `WHERE gpa >= 3.5` to filter qualified students.',
            'Use `ORDER BY gpa DESC` for descending order.'
          ],
          testcases: [
            {
              input: '',
              expectedOutput: 'name | gpa\nTran Thi Binh | 3.92\nNguyen Van An | 3.85\nPham Minh Duc | 3.55'
            }
          ]
        },
        {
          id: 'sql-1-aggregate',
          title: 'Bài 2: Thống kê dữ liệu với COUNT, SUM & WHERE',
          titleEn: 'Lesson 2: Data Aggregation with COUNT, SUM & WHERE',
          durationMinutes: 7,
          summary: 'Sử dụng hàm COUNT(*) và SUM() để thống kê điểm thí sinh đạt chuẩn.',
          summaryEn: 'Compute contest statistics using COUNT(*) and SUM().',
          content: `### 1. Các hàm tổng hợp trong SQL (Aggregate Functions)
SQL cung cấp các hàm tổng hợp giúp tính toán thống kê trực tiếp trên tập bản ghi:
* \`COUNT(*)\`: Đếm số lượng dòng.
* \`SUM(col)\`: Tính tổng giá trị cột \`col\`.
* Đặt tên cột đầu ra bằng từ khóa \`AS\`.

### 2. Nhiệm vụ của bạn:
Hệ thống đã nạp sẵn bảng \`contest_scores(id, handle, team, points)\`.
Hãy viết câu truy vấn trả về 2 cột \`passed_count\` (tổng số bài đạt điểm) và \`total_points\` (tổng điểm) của riêng đội \`team = 'A'\`.`,
          contentEn: `### 1. Aggregate Functions in SQL
Use \`COUNT(*)\` and \`SUM(col)\` with column aliases via \`AS\`.

### 2. Your Task:
Given table \`contest_scores(id, handle, team, points)\`, select \`COUNT(*) AS passed_count\` and \`SUM(points) AS total_points\` where \`team = 'A'\`.`,
          initialCode: `-- Thống kê số lượng và tổng điểm của team 'A' từ bảng contest_scores
SELECT
  -- TODO: COUNT(*) AS passed_count, SUM(points) AS total_points
FROM contest_scores
WHERE team = 'A';
`,
          solutionCode: `SELECT COUNT(*) AS passed_count, SUM(points) AS total_points
FROM contest_scores
WHERE team = 'A';`,
          hints: [
            'Sử dụng `SELECT COUNT(*) AS passed_count, SUM(points) AS total_points`',
            'Lọc theo đội bằng mệnh đề `WHERE team = \'A\'`.'
          ],
          hintsEn: [
            'Use `SELECT COUNT(*) AS passed_count, SUM(points) AS total_points`',
            'Filter with `WHERE team = \'A\'`.'
          ],
          testcases: [
            {
              input: `CREATE TABLE contest_scores (id INT, handle TEXT, team TEXT, points INT);
INSERT INTO contest_scores VALUES (1, 'an_coder', 'A', 120), (2, 'binh_cp', 'B', 95), (3, 'chi_algo', 'A', 150);`,
              expectedOutput: 'passed_count | total_points\n2 | 270'
            },
            {
              input: `CREATE TABLE contest_scores (id INT, handle TEXT, team TEXT, points INT);
INSERT INTO contest_scores VALUES (1, 'duy_dp', 'A', 100), (2, 'lan_graph', 'A', 200), (3, 'minh_sql', 'A', 50);`,
              expectedOutput: 'passed_count | total_points\n3 | 350'
            }
          ]
        },
        {
          id: 'sql-1-ddl',
          title: 'Bài 3: Khởi tạo bảng CREATE TABLE, INSERT INTO & Xếp hạng',
          titleEn: 'Lesson 3: Schema Creation DDL & Ranking Query',
          durationMinutes: 8,
          summary: 'Tự tạo bảng dữ liệu bằng CREATE TABLE, chèn dữ liệu INSERT INTO và truy vấn xếp hạng.',
          summaryEn: 'Create a table with CREATE TABLE, insert rows, and query top ranked entries.',
          content: `### 1. Thao tác định nghĩa & chèn dữ liệu (DDL & DML)
Trong PostgreSQL, bạn có thể tạo bảng mới và nạp nhiều dòng dữ liệu cùng lúc:
\`\`\`sql
CREATE TABLE leaderboard (handle TEXT, rating INT);
INSERT INTO leaderboard VALUES ('alpha', 2100), ('beta', 1850), ('gamma', 2400);
SELECT handle, rating FROM leaderboard WHERE rating >= 2000 ORDER BY rating DESC;
\`\`\`

### 2. Nhiệm vụ của bạn:
Viết kịch bản SQL thực hiện đủ 3 bước:
1. Tạo bảng \`top_coders(handle TEXT, rating INT)\`.
2. Chèn 3 bản ghi: \`('alice', 2200)\`, \`('bob', 1900)\`, \`('charlie', 2500)\`.
3. Truy vấn \`handle, rating\` của những coder có \`rating >= 2000\`, sắp xếp \`rating\` giảm dần.`,
          contentEn: `### 1. Schema DDL & DML
Create tables with \`CREATE TABLE\` and insert multiple tuples with \`INSERT INTO ... VALUES (...), (...)\`.

### 2. Your Task:
1. Create table \`top_coders(handle TEXT, rating INT)\`.
2. Insert \`('alice', 2200), ('bob', 1900), ('charlie', 2500)\`.
3. Select \`handle, rating\` where \`rating >= 2000\` ordered by \`rating DESC\`.`,
          initialCode: `-- 1. Tạo bảng top_coders
CREATE TABLE top_coders (handle TEXT, rating INT);

-- 2. Chèn 3 bản ghi vào top_coders
INSERT INTO top_coders VALUES ('alice', 2200), ('bob', 1900), ('charlie', 2500);

-- 3. Truy vấn coder có rating >= 2000 theo thứ tự rating giảm dần
`,
          solutionCode: `CREATE TABLE top_coders (handle TEXT, rating INT);
INSERT INTO top_coders VALUES ('alice', 2200), ('bob', 1900), ('charlie', 2500);
SELECT handle, rating FROM top_coders WHERE rating >= 2000 ORDER BY rating DESC;`,
          hints: [
            'Viết câu lệnh `SELECT handle, rating FROM top_coders WHERE rating >= 2000 ORDER BY rating DESC;` ở cuối.',
            'Nhớ đặt dấu chấm phẩy `;` kết thúc mỗi câu lệnh SQL.'
          ],
          hintsEn: [
            'End with `SELECT handle, rating FROM top_coders WHERE rating >= 2000 ORDER BY rating DESC;`',
            'Separate each SQL statement with a semicolon `;`.'
          ],
          testcases: [
            {
              input: '',
              expectedOutput: 'handle | rating\ncharlie | 2500\nalice | 2200'
            }
          ]
        }
      ]
    }
  ]
};
