import { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "FindNest AI - Nền tảng tìm phòng thông minh",
  description: "Phân tích giá, gợi ý phòng trọ bằng AI nhanh chóng và chính xác.",
  icons: {
    icon: "https://findnest.vn/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 relative selection:bg-blue-500/20 selection:text-blue-900">
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-white/40"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] rounded-full bg-gradient-to-br from-blue-400/40 via-purple-400/30 to-transparent blur-[100px] animate-[pulse_8s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[70%] rounded-full bg-gradient-to-tl from-indigo-400/40 via-emerald-300/30 to-transparent blur-[100px] animate-[pulse_10s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
