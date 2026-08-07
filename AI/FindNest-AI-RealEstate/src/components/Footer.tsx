"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/san-phong') {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800">
      <div className="container mx-auto px-4 max-w-[1320px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & Info */}
          <div>
            <Link href="/" className="flex items-center text-[25.6px] font-black leading-none mb-6">
              <Sparkles className="text-primary w-6 h-6 mr-1" strokeWidth={2.5} />
              <span className="text-primary">Find</span>
              <span className="text-white">Nest</span>
              <span className="text-blue-400 font-mono text-[14px] ml-1 tracking-normal pt-1">AI</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-slate-400">
              Nền tảng tiên phong ứng dụng Trí tuệ Nhân tạo (AI) trong việc phân tích, định giá và tìm kiếm không gian sống tối ưu tại Việt Nam.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.325V1.325C24 .597 23.403 0 22.675 0z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Links: Về chúng tôi */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Về FindNest AI</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">Công nghệ lõi AI</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Về chúng tôi</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Quy chế hoạt động</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Links: Hỗ trợ */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Hỗ trợ khách hàng</h3>
            <ul className="space-y-3">
              <li><Link href="/huong-dan-dang-tin" className="hover:text-primary transition-colors">Hướng dẫn đăng tin</Link></li>
              <li><Link href="/bang-gia" className="hover:text-primary transition-colors">Bảng giá dịch vụ</Link></li>
              <li><Link href="/cau-hoi-thuong-gap" className="hover:text-primary transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link href="/canh-bao-lua-dao" className="hover:text-primary transition-colors">Cảnh báo lừa đảo</Link></li>
            </ul>
          </div>

          {/* Contact & App */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Liên hệ</h3>
            <ul className="space-y-4">
              <div className="mb-6">
                <span className="block text-sm mb-1 text-slate-400">Hotline hỗ trợ:</span>
                <span className="text-white font-bold text-xl">1800 8888</span>
              </div>
              <div className="mb-6">
                <span className="block text-sm mb-1 text-slate-400">Email:</span>
                <span className="text-white">hello@findnest.ai</span>
              </div>
              <li className="flex flex-col mt-4">
                <span className="text-sm text-slate-500 mb-2">Tải ứng dụng:</span>
                <div className="flex gap-2">
                  {/* App Store / CH Play placeholders */}
                  <div className="bg-slate-800 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-slate-700">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-slate-900">A</div>
                    <div className="flex flex-col">
                      <span className="text-[10px] leading-tight">Download on the</span>
                      <span className="text-xs font-bold leading-tight text-white">App Store</span>
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-slate-700">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">G</div>
                    <div className="flex flex-col">
                      <span className="text-[10px] leading-tight">GET IT ON</span>
                      <span className="text-xs font-bold leading-tight text-white">Google Play</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} FindNest AI. Tất cả các quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <span>Việt Nam</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>Tiếng Việt</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
