# AHtest.code - Nền Tảng Lập Trình Thi Đấu & Academy Thế Hệ Mới

Hệ thống thi đấu lập trình và học tập thuật toán **AHtest.code** được thiết kế hiện đại, giải quyết triệt để các hạn chế của nền tảng Online Judge truyền thống. 

🔗 **GitHub Repository**: [https://github.com/Annalala3107/AHTest.code](https://github.com/Annalala3107/AHTest.code)

---

## 🚀 Đột Phá Kỹ Thuật & Tính Năng Nổi Bật

### 1. In-Context Split-Workbench (Giải bài tập hợp nhất 2 cột)
* **Xóa bỏ tình trạng chuyển trang rườm rà**: Đọc đề và viết code trên cùng một màn hình (Split-View 50/50 phong cách LeetCode / Codeforces).
* **Render Toán học KaTeX siêu tốc**: Triệt tiêu hoàn toàn độ trễ và hiện tượng giật trang (0% Cumulative Layout Shift).
* **Console chạy thử Sample & Custom Test**: Chạy nghiệm thử ngay trên trình duyệt mà không cần submit chính thức.
* **Chấm điểm theo thời gian thực (Real-time Verdict Stream)**: Hiệu ứng WebSocket mô phỏng chấm từng test case (`Test 1: AC`, `Test 2: AC`...) kèm hiệu ứng pháo hoa ăn mừng khi đạt 100/100 AC.
* **Gợi ý thuật toán AI Trợ giảng (AI Hint)**: Phân tích hướng tiếp cận (nén tọa độ, Fenwick Tree, bẫy tràn số) mà không làm lộ code giải.

### 2. AHtest Academy (Phân hệ Học Ngôn Ngữ Tương Tác)
* **Khắc phục nghẽn máy chấm**: Toàn bộ các bài học vỡ lòng (C++20 & Python) chạy bằng **Client-Side WebAssembly Sandbox**, không tốn 1ms CPU của cụm Judge thi đấu.
* **Mô hình Micro-learning**: Lý thuyết ngắn 3 phút kèm 1 thử thách gõ code trực tiếp, chấm tự động, hỗ trợ gợi ý step-by-step.

### 3. Bộ Công Cụ Import Đề & Themis Converter
* **Hỗ trợ gói đề Themis**: Tự động nhận diện cấu trúc folder `TEST01..TESTN`, tự động map file `.INP` và `.OUT`.
* **Auditor tính toàn vẹn bộ test**: Quét lỗi test rỗng (0 bytes), lệch số lượng test, tự động chuẩn hóa xuống dòng Windows CRLF -> Linux LF.
* **Model Solution Sandbox Benchmarking**: Chạy code mẫu C++ để đo thời gian thực thi tối đa trên phần cứng sandbox, tự động đề xuất **Time Limit an toàn (3x safety margin)** trước khi xuất bản.
* **Cơ chế Staging**: Đề mới đưa vào trạng thái chờ duyệt của cộng đồng trước khi tính điểm chính thức.

### 4. Kiến Trúc Thông Tin & Giao Diện Hiện Đại
* **Menu tinh gọn**: Xóa bỏ menu rác, phân nhóm logic: *Trang chủ*, *Luyện tập*, *Khóa học (Mới)*, *Kỳ thi*, *Import Đề (Pro)*, *Xếp hạng*.
* **Mobile-First Responsive**: Gỡ bỏ triệt để hack `min-width: 480px`, tương thích 100% điện thoại và máy tính bảng.
* **Dark / Light Mode**: Tối ưu độ tương phản, sử dụng bộ font chuẩn lập trình **JetBrains Mono** và **Inter**.
* **Gamification & Heatmap**: Theo dõi chuỗi ngày Streak liên tục, biểu đồ đóng góp dạng GitHub và đường cong Rating cá nhân.

---

## 🛠 Hướng Dẫn Cài Đặt & Phát Triển

Dự án sử dụng **React 19 + TypeScript + Vite + Tailwind CSS v4 + KaTeX + Lucide Icons**:

```bash
# 1. Clone repository
git clone https://github.com/Annalala3107/AHTest.code.git
cd AHTest.code

# 2. Cài đặt thư viện phụ thuộc
npm install

# 3. Khởi chạy môi trường phát triển (Dev Server)
npm run dev

# 4. Biên dịch bản sản xuất (Production Build)
npm run build
```

Mở trình duyệt tại: **http://127.0.0.1:5173/**
