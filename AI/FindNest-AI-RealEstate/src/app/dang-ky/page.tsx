"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Since user confirmed email confirmation is OFF, they are logged in immediately if data.session exists
    setSuccess(true);
    setLoading(false);
    
    // Redirect to home after a short delay
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[80px]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="text-white w-8 h-8" />
            </div>
          </Link>
        </div>
        <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight">
          Tạo tài khoản mới
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap" className="font-bold text-primary hover:text-blue-700 transition-colors">
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-[2rem] sm:px-10 border border-slate-100">
          <form className="space-y-5" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm border border-green-100 font-medium">
                Đăng ký thành công! Đang chuyển hướng...
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Họ và Tên
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-slate-50 transition-colors"
                  placeholder="Nguyễn Văn A"
                  disabled={loading || success}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-slate-50 transition-colors"
                  placeholder="name@example.com"
                  disabled={loading || success}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Mật khẩu
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-slate-50 transition-colors"
                  placeholder="••••••••"
                  disabled={loading || success}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Bạn là ai?
              </label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <label className="cursor-pointer">
                  <input type="radio" name="role" className="peer sr-only" defaultChecked disabled={loading} />
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100 peer-checked:border-primary peer-checked:bg-blue-50 peer-checked:ring-1 peer-checked:ring-primary transition-all text-center">
                    <span className="text-sm font-bold text-slate-900">Người đi thuê</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="role" className="peer sr-only" disabled={loading} />
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100 peer-checked:border-primary peer-checked:bg-blue-50 peer-checked:ring-1 peer-checked:ring-primary transition-all text-center">
                    <span className="text-sm font-bold text-slate-900">Chủ nhà</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors group"
              >
                {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
                {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 text-center mt-4">
              Bằng việc đăng ký, bạn đồng ý với <Link href="#" className="text-primary">Điều khoản sử dụng</Link> và <Link href="#" className="text-primary">Chính sách bảo mật</Link> của chúng tôi.
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}
