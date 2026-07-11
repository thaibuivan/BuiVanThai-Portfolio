"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { LogIn, User, LogOut, Heart } from "lucide-react";

export default function AuthStatus() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="w-24 h-10 animate-pulse bg-slate-100 rounded-xl hidden md:block"></div>;

  if (!session) {
    return (
      <div className="hidden md:flex items-center gap-1">
        <Link href="/login" className="flex items-center gap-2 px-4 py-2 text-[15px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
          <LogIn className="w-4 h-4" /> Đăng nhập
        </Link>
        <Link href="/dang-ky" className="flex items-center gap-2 px-4 py-2 text-[15px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
          Đăng ký
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-2">
      <Link href="/favorites" className="flex items-center gap-2 px-4 py-2 text-[15px] font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all">
        <Heart className="w-4 h-4 fill-current" /> Đã lưu
      </Link>
      <div className="flex items-center gap-2 px-4 py-2 text-[15px] font-semibold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl shadow-sm">
        <User className="w-4 h-4 text-primary" /> {session.user.email.split('@')[0]}
      </div>
      <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Đăng xuất">
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
