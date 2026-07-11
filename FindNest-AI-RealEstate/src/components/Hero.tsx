import { Search, Sparkles, MapPin, Zap } from "lucide-react";
import SearchFilter from "./SearchFilter";

export default function Hero() {
  return (
    <section className="relative pt-[120px] pb-24 md:pt-[160px] md:pb-32 overflow-hidden bg-slate-50">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-100/50 to-transparent"></div>
        <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[30%] right-[10%] w-96 h-96 bg-indigo-400/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 max-w-[1000px] relative z-10 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm mb-8 mx-auto hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold text-slate-700">FindNest AI Version 2.0 đã ra mắt</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
          Tìm phòng trọ lý tưởng<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">bằng Trí Tuệ Nhân Tạo</span>
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
            <button key={idx} className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:border-primary hover:text-primary transition-colors shadow-sm">
              {tag}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
