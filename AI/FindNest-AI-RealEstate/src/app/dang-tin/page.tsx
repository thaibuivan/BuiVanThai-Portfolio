import { Upload, MapPin, CheckCircle2 } from "lucide-react";

export default function DangTinPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Đăng tin cho thuê mới</h1>
          <p className="text-slate-500 text-lg">AI sẽ tự động tối ưu hóa tiêu đề và mô tả của bạn để tiếp cận nhiều người thuê nhất.</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          <div className="p-8 md:p-10 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center text-sm">1</span>
              Thông tin cơ bản
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Tiêu đề tin đăng *</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="VD: Cho thuê phòng trọ khép kín quận Cầu Giấy..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Loại chuyên mục *</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                    <option>Phòng trọ, nhà trọ</option>
                    <option>Nhà thuê nguyên căn</option>
                    <option>Cho thuê căn hộ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Giá cho thuê (VND/tháng) *</label>
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="VD: 3000000" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Diện tích (m²) *</label>
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="VD: 25" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center text-sm">2</span>
              Hình ảnh & Video
            </h2>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="text-slate-900 font-bold text-lg mb-1">Bấm để tải ảnh lên</p>
              <p className="text-slate-500 text-sm">hoặc kéo thả ảnh vào đây (Tối đa 10 ảnh)</p>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-slate-50">
            <button className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Hoàn tất đăng tin
            </button>
            <p className="text-center text-slate-500 text-sm mt-4">Tin đăng của bạn sẽ được AI kiểm duyệt và hiển thị trong vài phút.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
