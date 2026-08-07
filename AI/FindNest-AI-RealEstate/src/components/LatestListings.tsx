import { MapPin, ArrowRight, Bed, Maximize } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { timeAgo } from "@/lib/utils";
import FavoriteButton from "./FavoriteButton";

export default async function LatestListings() {
  // Bỏ qua 3 phòng đầu (đã hiển thị ở Featured), lấy 6 phòng tiếp theo
  const { data: latestListings } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false })
    .range(3, 8);

  if (!latestListings || latestListings.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <section className="py-16 md:py-24 bg-transparent relative z-10">
      <div className="container mx-auto px-4 max-w-[1320px]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Tin đăng <span className="text-primary">mới nhất</span>
            </h2>
            <p className="text-slate-500 mt-2 text-lg">
              Cập nhật liên tục hàng nghìn phòng trọ, căn hộ, nhà nguyên căn từ chính chủ.
            </p>
          </div>
          <Link href="/phong" className="inline-flex items-center text-primary font-bold hover:text-blue-800 transition-colors">
            Xem tất cả <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestListings.map((listing) => (
            <Link href={`/phong/${listing.id}`} key={listing.id} className="group flex flex-col sm:flex-row bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 overflow-hidden hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.15)] hover:-translate-y-1 transition-all duration-300 h-full">
              
              {/* Image (Left side on desktop, top on mobile) */}
              <div className="w-full sm:w-2/5 shrink-0 relative aspect-video sm:aspect-auto sm:h-full overflow-hidden bg-slate-100">
                <div 
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  style={{ backgroundImage: `url(${listing.images[0]})` }}
                />
                <div className="absolute top-2 left-2 bg-slate-900/70 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded">
                  {timeAgo(listing.posted_time)}
                </div>
                <FavoriteButton roomId={listing.id} />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col justify-between w-full">
                <div>
                  <h3 className="text-slate-900 font-bold text-[14px] leading-[1.4] mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {listing.title}
                  </h3>
                  <div className="text-primary font-black text-lg mb-3">
                    {formatPrice(listing.price)} <span className="text-xs font-medium text-slate-500">đ/tháng</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 text-slate-500 text-xs mb-3">
                    <div className="flex items-center gap-1">
                      <Maximize className="w-3.5 h-3.5" />
                      <span>{listing.area}m²</span>
                    </div>
                  </div>

                  <div className="flex items-center text-slate-500 text-xs pt-3 border-t border-slate-100">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                  
                  <div className="mt-2 text-[11px] text-blue-600 font-medium">
                    👤 {listing.landlord_name || 'Chủ nhà'}
                  </div>
                </div>
              </div>

            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/phong" className="inline-flex items-center justify-center bg-blue-50 text-primary font-bold px-8 py-3.5 rounded-full hover:bg-primary hover:text-white transition-colors border border-blue-200 hover:border-primary shadow-sm">
            Tải thêm phòng trọ mới
          </Link>
        </div>

      </div>
    </section>
  );
}
