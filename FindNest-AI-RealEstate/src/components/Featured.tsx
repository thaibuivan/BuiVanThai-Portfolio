import { MapPin, Maximize, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import FavoriteButton from "./FavoriteButton";

export default async function Featured() {
  // Lấy 3 phòng mới nhất từ Supabase
  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  if (!rooms || rooms.length < 3) {
    return null; // Trả về rỗng nếu chưa có đủ dữ liệu
  }

  const mainListing = rooms[0];
  const sideListings = [rooms[1], rooms[2]];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-[1320px]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4" /> AI Đề xuất
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Top không gian sống hoàn hảo
            </h2>
          </div>
          <Link href="/phong-tro" className="inline-flex items-center text-slate-500 font-bold hover:text-primary transition-colors group">
            Khám phá thêm <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
          
          {/* Main Large Card */}
          <Link href={`/phong/${mainListing.id}`} className="lg:col-span-2 group relative rounded-[2rem] overflow-hidden bg-slate-100 flex h-[400px] lg:h-full">
            <div className="absolute inset-0">
              <img src={mainListing.images[0]} alt={mainListing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
            <FavoriteButton roomId={mainListing.id} />
            
            {/* Content overlay */}
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 flex flex-col justify-end">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-primary text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                  Độ phù hợp: {mainListing.match_score}%
                </div>
                <div className="text-3xl font-black text-white">
                  {formatPrice(mainListing.price)} <span className="text-lg font-medium text-white/70">đ/tháng</span>
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                {mainListing.title}
              </h3>
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {mainListing.location}</div>
                <div className="flex items-center gap-2"><Maximize className="w-5 h-5" /> {mainListing.area}m²</div>
              </div>
            </div>
          </Link>

          {/* Side Cards */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {sideListings.map((listing) => (
              <Link href={`/phong/${listing.id}`} key={listing.id} className="group relative rounded-[2rem] overflow-hidden bg-slate-100 flex-1 h-[250px] lg:h-auto">
                <div className="absolute inset-0">
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                <FavoriteButton roomId={listing.id} />
                
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="text-xl font-black text-primary mb-2">
                    {formatPrice(listing.price)} <span className="text-sm font-medium text-white/70">đ/tháng</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-snug">
                    {listing.title}
                  </h3>
                  <div className="flex items-center justify-between text-white/80 text-sm">
                    <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {listing.location.split(',')[0]}</div>
                    <div className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-yellow-400" /> {listing.match_score}% Match</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
