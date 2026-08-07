import { MapPin, Maximize, Bed, Bath, Clock, CheckCircle2, Phone, Share2, Heart, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { timeAgo } from "@/lib/utils";

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // Lấy dữ liệu chi tiết của phòng từ Supabase dựa trên ID
  const { data: room, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error) {
    console.error("Supabase Error:", error);
  }

  if (!room) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 max-w-[1320px] py-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <span className="mx-2">›</span>
        <Link href="/phong-tro" className="hover:text-primary">{room.room_type || 'Phòng trọ'}</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-900 font-medium line-clamp-1">{room.title}</span>
      </div>

      <div className="container mx-auto px-4 max-w-[1320px]">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content (Left) */}
          <div className="w-full lg:w-2/3">
            
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 mb-8">
              <div className="aspect-video w-full bg-slate-100 relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${room.images[0]})` }}
                />
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                  1/{room.images.length} Hình ảnh
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1 p-1">
                {room.images.slice(1, 5).map((imgUrl: string, i: number) => (
                  <div key={i} className="aspect-[4/3] bg-slate-200 relative cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${imgUrl})` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Room Info */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">HOT</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">{room.room_type || 'Phòng trọ'}</span>
                <span className="text-slate-500 text-sm flex items-center ml-2"><Clock className="w-3.5 h-3.5 mr-1" /> Đăng {timeAgo(room.posted_time)}</span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-4">
                {room.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                <div className="text-primary font-black text-3xl">
                  {formatPrice(room.price)} <span className="text-base font-medium text-slate-500">đ/tháng</span>
                </div>
                <div className="flex gap-2">
                  <div className="bg-yellow-100 text-yellow-800 text-sm font-bold px-3 py-1.5 rounded-lg flex items-center">
                     Độ phù hợp (AI Match): {room.match_score}%
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 mb-8">
                <div className="mt-1 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-slate-500 text-sm mb-1">Địa chỉ</div>
                  <div className="text-slate-900 font-medium leading-relaxed">
                    {room.location}
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl mb-8 border border-slate-100">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 text-sm flex items-center gap-1.5"><Maximize className="w-4 h-4" /> Diện tích</span>
                  <span className="text-slate-900 font-bold">{room.area} m²</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 text-sm flex items-center gap-1.5"><Bed className="w-4 h-4" /> Phòng ngủ</span>
                  <span className="text-slate-900 font-bold">1</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 text-sm flex items-center gap-1.5"><Bath className="w-4 h-4" /> Phòng tắm</span>
                  <span className="text-slate-900 font-bold">1 khép kín</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 text-sm flex items-center gap-1.5"><Clock className="w-4 h-4" /> Giờ giấc</span>
                  <span className="text-slate-900 font-bold text-green-600">Tự do</span>
                </div>
              </div>

              {/* Description */}
              <h3 className="font-bold text-xl text-slate-900 mb-4">Thông tin mô tả</h3>
              <div className="text-slate-700 leading-relaxed whitespace-pre-line text-[15px]">
                {room.description}
              </div>

            </div>
          </div>

          {/* Sidebar (Right) */}
          <aside className="w-full lg:w-1/3">
            <div className="sticky top-[100px] space-y-6">
              
              {/* Landlord Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden relative border border-slate-100 shrink-0">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(room.landlord_name || 'A')}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-1.5 line-clamp-1">
                      {room.landlord_name || 'Chủ nhà'}
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-1">Trạng thái: Hoạt động {timeAgo(room.posted_time)}</p>
                  </div>
                </div>

                <a href={room.source_url} target="_blank" rel="noopener noreferrer" className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mb-3">
                  <Phone className="w-5 h-5" />
                  Bấm để hiện số & Liên hệ
                </a>
                <button className="w-full bg-blue-50 text-blue-600 font-bold py-3.5 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                  Nhắn tin Zalo
                </button>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-medium w-full justify-center">
                    <AlertTriangle className="w-4 h-4" /> Báo cáo tin giả / lừa đảo
                  </button>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <span className="text-xl">💡</span> Lời khuyên an toàn
                </h4>
                <ul className="text-sm text-slate-700 space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Luôn đến xem phòng trực tiếp trước khi đặt cọc.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Kiểm tra kỹ hợp đồng, các khoản phí phát sinh.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Xác minh rõ danh tính chủ nhà và giấy tờ sở hữu/cho thuê hợp lệ.
                  </li>
                </ul>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
