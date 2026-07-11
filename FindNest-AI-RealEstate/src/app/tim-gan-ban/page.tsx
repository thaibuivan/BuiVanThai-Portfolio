import { supabase } from "@/lib/supabase";
import MapWrapper from "@/components/MapWrapper";

export default async function MapPage() {
  // Lấy toàn bộ 500 phòng có tọa độ
  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);

  return (
    <div className="pt-[72px] h-screen w-full relative">
      <div className="absolute top-[88px] left-4 md:left-8 z-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 max-w-sm pointer-events-auto">
        <h1 className="text-xl font-black text-slate-900 mb-1">Bản đồ Phòng Trọ</h1>
        <p className="text-sm text-slate-500 mb-3">
          Khám phá <strong className="text-primary">{rooms?.length || 0}</strong> phòng đang trống trên bản đồ trực quan.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded">Hà Đông</span>
          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded">Thanh Xuân</span>
          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded">Cầu Giấy</span>
        </div>
      </div>

      <MapWrapper rooms={rooms || []} />
    </div>
  );
}
