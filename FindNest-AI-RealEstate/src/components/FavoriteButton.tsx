"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('room_id', roomId)
          .maybeSingle();
        
        if (data) setIsFavorite(true);
      }
      setLoading(false);
    };
    
    fetchUserAndStatus();
  }, [roomId]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn click xuyên xuống Link của thẻ
    e.stopPropagation();

    if (!userId) {
      alert("Bạn cần đăng nhập để lưu phòng này!");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('room_id', roomId);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: userId, room_id: roomId });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      title={isFavorite ? "Bỏ lưu phòng" : "Lưu phòng này"}
      className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all shadow-sm z-20 ${
        isFavorite 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-white/80 text-slate-500 hover:bg-white hover:text-red-500'
      }`}
    >
      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  );
}
