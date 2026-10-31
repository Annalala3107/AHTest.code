import React from 'react';
import { Heart, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold text-xs">
                AH
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                AHtest.code
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed mb-4">
              Hệ thống luyện tập và thi đấu Tin học thế hệ mới AHtest.code.
              Tối ưu hóa trải nghiệm tương tác với KaTeX, Split-Workbench và AHtest Academy.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>12/12 Cụm máy chấm Sandbox sẵn sàng</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Tài nguyên & Học tập
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="https://wiki.vnoi.info/" target="_blank" rel="noreferrer" className="hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> VNOI Wiki Thuật toán
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-rose-600 dark:hover:text-rose-400">C++ Reference chuẩn thi đấu</a>
              </li>
              <li>
                <a href="#" className="hover:text-rose-600 dark:hover:text-rose-400">Trình chấm ngoài (Custom Checkers)</a>
              </li>
              <li>
                <a href="#" className="hover:text-rose-600 dark:hover:text-rose-400">Thư viện đề thi HSG & OLP</a>
              </li>
            </ul>
          </div>

          {/* Governance & Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Cộng đồng & Hệ thống
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="https://github.com/Annalala3107/AHTest.code" target="_blank" rel="noreferrer" className="hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  Mã nguồn mở GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-rose-600 dark:hover:text-rose-400">Trạng thái máy chấm (Status)</a>
              </li>
              <li>
                <a href="#" className="hover:text-rose-600 dark:hover:text-rose-400">Quy chế thi đấu AHtest.code</a>
              </li>
              <li>
                <a href="#" className="hover:text-rose-600 dark:hover:text-rose-400">Chính sách Hạn mức Tổ chức</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-4">
          <p>© 2026 AHtest.code. Phát triển và nâng cấp vì cộng đồng lập trình viên.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by AHtest.code Community
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
