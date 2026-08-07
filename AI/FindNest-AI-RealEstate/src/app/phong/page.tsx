import { supabase } from "@/lib/supabase";
import { timeAgo } from "@/lib/utils";
import { MapPin, Bed, Maximize, ArrowLeft } from "lucide-react";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import SearchFilter from "@/components/SearchFilter";

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const district = resolvedSearchParams.district as string;
  const roomType = resolvedSearchParams.room_type as string;
  const price = resolvedSearchParams.price as string;
  const area = resolvedSearchParams.area as string;
  const bedrooms = resolvedSearchParams.bedrooms as string;

  let query = supabase.from('rooms').select('*').order('posted_time', { ascending: false });

  if (district) {
    const districts = district.split(',');
    if (districts.length > 0) {
      const orCondition = districts.map(d => `district.ilike.%${d}%`).join(',');
      query = query.or(orCondition);
    }
  }
  
  if (roomType) {
    const types = roomType.split(',');
    if (types.length > 0) {
      query = query.in('room_type', types);
    }
  }
  
  if (price) {
    const priceRanges = price.split(',');
    if (priceRanges.length > 0) {
      const orCond = priceRanges.map(p => {
        const [min, max] = p.split('-');
        const conditions = [];
        if (min) conditions.push(`price.gte.${parseInt(min)}`);
        if (max) conditions.push(`price.lte.${parseInt(max)}`);
        return `and(${conditions.join(',')})`;
      }).join(',');
      query = query.or(orCond);
    }
  }
  
  if (area) {
    const areaRanges = area.split(',');
    if (areaRanges.length > 0) {
      const orCond = areaRanges.map(a => {
        const [min, max] = a.split('-');
        const conditions = [];
        if (min) conditions.push(`area.gte.${parseInt(min)}`);
        if (max) conditions.push(`area.lte.${parseInt(max)}`);
        return `and(${conditions.join(',')})`;
      }).join(',');
      query = query.or(orCond);
    }
  }
  
  if (bedrooms) {
    const beds = bedrooms.split(',');
    if (beds.length > 0) {
      const orCond = beds.map(b => {
        if (b.includes('+')) return `bedrooms.gte.${parseInt(b)}`;
        return `bedrooms.eq.${parseInt(b)}`;
      }).join(',');
      query = query.or(orCond);
    }
  }

  const { data: rooms, error } = await query;

  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-transparent relative">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary font-medium hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Về trang chủ
          </Link>
          <h1 className="text-3xl font-black text-slate-900 mb-6">
            Kết quả tìm kiếm
          </h1>
          
          <div className="relative z-50 mb-8">
            <SearchFilter 
              initialDistrict={district || ""}
              initialRoomType={roomType || ""}
              initialPrice={price || ""}
              initialArea={area || ""}
              initialBedrooms={bedrooms || ""}
            />
          </div>

          <p className="text-slate-500 mt-2">
            Tìm thấy <strong className="text-primary">{rooms?.length || 0}</strong> phòng thỏa mãn điều kiện của bạn.
          </p>
        </div>

        {rooms && rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Link key={room.id} href={`/phong/${room.id}`} className="group bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/60 hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.15)] hover:-translate-y-2 transition-all duration-500 flex flex-col ring-1 ring-white/50 hover:ring-indigo-300/50">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(${room.images[0]})` }}
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/70 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded">
                    {timeAgo(room.posted_time)}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-2.5 py-1 rounded-lg">
                    {room.room_type}
                  </div>
                  <FavoriteButton roomId={room.id} />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="line-clamp-1">{room.location}</span>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {room.title}
                  </h3>

                  <div className="flex items-center gap-4 text-slate-500 text-sm mb-4">
                    <span className="flex items-center gap-1.5">
                      <Maximize className="w-4 h-4" /> {room.area}m²
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bed className="w-4 h-4" /> {room.bedrooms} PN
                    </span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm">
                      {room.price >= 1000000 
                        ? `${(room.price / 1000000).toFixed(1)} triệu`
                        : `${(room.price / 1000).toLocaleString()}k`}
                      <span className="text-sm text-slate-500 font-normal ml-1">/tháng</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Không tìm thấy phòng nào!</h2>
            <p className="text-slate-500 max-w-md mx-auto"> Rất tiếc, hiện tại không có căn phòng nào khớp với toàn bộ các điều kiện khắt khe của bạn. Hãy thử nới lỏng bộ lọc (Giá, Diện tích) để xem thêm các kết quả khác nhé.</p>
            <Link href="/" className="inline-block mt-8 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-primary/20">
              Xóa bộ lọc và thử lại
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
