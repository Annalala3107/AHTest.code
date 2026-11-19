export const POPULAR_ORGANIZATIONS = [
  'Trường THPT Chuyên Khoa học Tự nhiên - ĐHQG HN',
  'Trường Phổ thông Năng khiếu - ĐHQG TP.HCM',
  'Trường THPT Chuyên Sư Phạm Hà Nội',
  'Trường THPT Chuyên Lê Hồng Phong - TP.HCM',
  'Trường THPT Chuyên Lương Văn Chánh - Phú Yên',
  'Trường Đại học Công nghệ - ĐHQG Hà Nội (UET)',
  'Trường Đại học Bách Khoa Hà Nội (HUST)',
  'Trường Đại học Bách Khoa - ĐHQG TP.HCM (HCMUT)',
  'Trường Đại học FPT (FPT University)',
  'Tự do / Khác',
];

export interface PasswordStrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  barColor: string;
  textColor: string;
}

export function evaluatePasswordStrength(pwd: string): PasswordStrengthResult {
  if (!pwd) {
    return {
      score: 0,
      label: 'Chưa nhập',
      barColor: 'bg-slate-200 dark:bg-slate-700',
      textColor: 'text-slate-400',
    };
  }
  let points = 0;
  if (pwd.length >= 8) points += 1;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) points += 1;
  if (/\d/.test(pwd)) points += 1;
  if (/[^a-zA-Z0-9]/.test(pwd)) points += 1;

  if (pwd.length < 8) {
    return {
      score: 1,
      label: 'Yếu (cần tối thiểu 8 ký tự)',
      barColor: 'bg-rose-500',
      textColor: 'text-rose-500',
    };
  }
  if (points <= 2) {
    return {
      score: 2,
      label: 'Trung bình (nên thêm chữ hoa, số hoặc ký tự đặc biệt)',
      barColor: 'bg-amber-500',
      textColor: 'text-amber-500',
    };
  }
  if (points === 3) {
    return {
      score: 3,
      label: 'Khá tốt',
      barColor: 'bg-sky-500',
      textColor: 'text-sky-500',
    };
  }
  return {
    score: 4,
    label: 'Mạnh (Chuẩn bảo mật)',
    barColor: 'bg-emerald-500',
    textColor: 'text-emerald-500',
  };
}
