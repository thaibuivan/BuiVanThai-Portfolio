import { Search, Sparkles, MapPin, Zap } from "lucide-react";
import SearchFilter from "./SearchFilter";

export default function Hero() {
  return (
    <section className="relative pt-[120px] pb-24 md:pt-[160px] md:pb-32 overflow-hidden bg-transparent">

      <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 mx-auto hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] hover:-translate-y-0.5 transition-all cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900">FindNest AI Version 2.0 đã ra mắt</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6 drop-shadow-sm">
          Tìm phòng trọ lý tưởng<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 animate-gradient-x">bằng Trí Tuệ Nhân Tạo</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Đừng lãng phí thời gian lọc hàng ngàn tin rác. Trợ lý AI của chúng tôi sẽ tự động phân tích mức giá, vị trí và tiện ích để mang đến cho bạn không gian sống hoàn hảo nhất.
        </p>

        {/* AI Search Interface -> Replaced by the comprehensive 5-criteria Filter */}
        <SearchFilter />

        {/* Quick Tags */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <span className="text-sm text-slate-400 font-medium mr-2">Gợi ý:</span>
          {['Gần Đại học Quốc Gia', 'Chung cư mini Cầu Giấy', 'Studio Quận 1', 'Có gác lửng'].map((tag, idx) => (
            <button key={idx} className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-sm font-medium text-slate-600 hover:border-primary hover:text-primary transition-colors shadow-sm hover:bg-white/90">
              {tag}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
