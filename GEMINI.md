# AHTest.code - Quy Tắc & Lời Nhắc Cấu Hình Hệ Thống

## 1. Quy tắc Cấu hình Supabase & Biến Môi Trường Vercel
* **Supabase Project URL**: `https://dcfehiahdpbfvyzekchr.supabase.co`
* **Supabase Public Anon Key**: `sb_publishable_tMRwAPAnrNH--Yrj5thgbQ_xa2q0Bdz`

### Cơ chế Fallback an toàn trong mã nguồn:
* Trong file `src/services/supabaseAuth.ts`, luôn duy trì:
  - `DEFAULT_SUPABASE_URL = 'https://dcfehiahdpbfvyzekchr.supabase.co'`
  - `DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_tMRwAPAnrNH--Yrj5thgbQ_xa2q0Bdz'`
* Mục đích: Đảm bảo trang web khi build và deploy trên Vercel luôn hoạt động ngay lập tức 100%, không bao giờ bị chặn hay báo lỗi đỏ `"Chưa cấu hình Supabase Anon Key"` kể cả khi người dùng chưa kịp nhập biến trên Vercel.

### Quy tắc nhập biến trên Vercel Dashboard (Settings -> Environment Variables):
* **Biến 1**:
  - **Tên biến (Key)**: `VITE_SUPABASE_URL`
  - **Giá trị (Value)**: `https://dcfehiahdpbfvyzekchr.supabase.co`
* **Biến 2**:
  - **Tên biến (Key)**: `VITE_SUPABASE_ANON_KEY`
  - **Giá trị (Value)**: `sb_publishable_tMRwAPAnrNH--Yrj5thgbQ_xa2q0Bdz`
* ⚠️ **Lưu ý quan trọng**: Không được dán chuỗi `sb_publishable_...` vào ô **Key** của Vercel (sẽ bị lỗi cú pháp vì chứa dấu `--`). Ô Key chỉ chứa tên biến viết hoa, còn ô Value mới là nơi dán mã key.

### Cơ chế Cấu hình Nhanh trên Giao diện Web:
* Trong `src/components/VnoiAuthModal.tsx`, luôn giữ nút cài đặt bánh răng ⚙️ và form nhập key trực tiếp để lưu vào `localStorage`, giúp người dùng kiểm thử hoặc đổi key tức thì mà không cần redeploy.
