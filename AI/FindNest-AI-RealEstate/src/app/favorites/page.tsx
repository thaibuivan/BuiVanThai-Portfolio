"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { timeAgo } from "@/lib/utils";
import { MapPin, Bed, Maximize, ArrowLeft, HeartCrack } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FavoriteButton from "@/components/FavoriteButton";

export default function FavoritesPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from('favorites')
        .select(`
          room_id,
          rooms (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setRooms(data.map(f => f.rooms));
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen pt-40 pb-24 bg-slate-50 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary font-medium hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Về trang chủ
          </Link>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            Phòng đã lưu
          </h1>
          <p className="text-slate-500 mt-2">
            Bạn đang có <strong className="text-primary">{rooms.length}</strong> phòng trong bộ sưu tập yêu thích.
          </p>
        </div>

        {rooms && rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="relative group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col">
                <FavoriteButton roomId={room.id} />
                <Link href={`/phong/${room.id}`} className="flex flex-col flex-1">
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
                      <div className="text-xl font-black text-primary">
                        {room.price >= 1000000 
                          ? `${(room.price / 1000000).toFixed(1)} triệu`
                          : `${(room.price / 1000).toLocaleString()}k`}
                        <span className="text-sm text-slate-500 font-normal">/tháng</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <HeartCrack className="w-8 h-8 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Chưa có phòng nào được lưu</h2>
            <p className="text-slate-500 max-w-md mx-auto">Hãy dạo quanh trang chủ và thả tim cho những căn phòng bạn ưng ý nhé.</p>
            <Link href="/" className="inline-block mt-8 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-primary/20">
              Khám phá ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
