import Link from "next/link";
import { Sparkles, Search, UserCircle, Menu, X, LogIn, UserPlus } from "lucide-react";
import AuthStatus from "./AuthStatus";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-2 pointer-events-none">
      <nav className="pointer-events-auto mx-auto max-w-[1320px] bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl">
        <div className="px-6 h-[72px]">
          <div className="flex items-center justify-between h-full gap-4">
            
            {/* Brand */}
            <Link href="/" className="flex items-center text-2xl font-black tracking-tight shrink-0 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3 group-hover:scale-105 transition-transform shadow-md shadow-blue-500/20">
                <Sparkles className="text-white w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className="text-slate-900">Find</span>
              <span className="text-primary">Nest</span>
              <span className="bg-blue-100 text-blue-700 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full ml-2">AI</span>
            </Link>

            {/* Center Links (Desktop only) */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl">
              <Link href="/phong" className="px-4 py-2 text-[15px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all">
                Danh sách phòng
              </Link>
              <Link href="/tim-gan-ban" className="px-4 py-2 text-[15px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all flex items-center gap-1.5">
                Bản đồ AI
              </Link>
              <Link href="/san-phong" className="px-4 py-2 text-[15px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all">
                Săn phòng tự động
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <AuthStatus />
              <Link 
                href="/dang-tin" 
                className="hidden md:flex items-center gap-2 px-5 py-2.5 text-[15px] font-bold text-white bg-slate-900 rounded-xl shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all"
              >
                + Đăng tin miễn phí
              </Link>
              
              {/* Mobile Menu Button */}
              <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </div>
            
          </div>
        </div>
      </nav>
    </div>
  );
}
