import { Search, Home, Key } from "lucide-react";

export default function Steps() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-[1320px]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Chỉ với <span className="text-primary">3 bước</span> săn phòng
          </h2>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
            Tìm kiếm, liên hệ và dọn vào ở ngay. Mọi thứ trở nên cực kỳ đơn giản với FindNest AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-0.5 bg-slate-100 -z-10" />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative shadow-sm border border-blue-100">
              <Search className="w-12 h-12 text-primary" />
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-xl text-slate-900 shadow-md border border-slate-100">
                1
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Tìm kiếm phòng</h3>
            <p className="text-slate-500 leading-relaxed px-4">
              Sử dụng bộ lọc thông minh để tìm căn phòng ưng ý theo vị trí, giá cả và tiện ích mong muốn.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative shadow-sm border border-blue-100">
              <Home className="w-12 h-12 text-primary" />
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-xl text-slate-900 shadow-md border border-slate-100">
                2
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Xem phòng thực tế</h3>
            <p className="text-slate-500 leading-relaxed px-4">
              Liên hệ trực tiếp chủ nhà qua điện thoại hoặc Zalo để hẹn lịch xem phòng mà không qua trung gian.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative shadow-sm border border-blue-100">
              <Key className="w-12 h-12 text-primary" />
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-xl text-slate-900 shadow-md border border-slate-100">
                3
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Ký hợp đồng & Nhận phòng</h3>
            <p className="text-slate-500 leading-relaxed px-4">
              Thương lượng trực tiếp với chủ nhà, ký hợp đồng và sẵn sàng dọn vào không gian sống mới của bạn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
