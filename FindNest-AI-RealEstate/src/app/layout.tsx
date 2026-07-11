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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white/50 to-slate-50/50"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-gradient-to-tr from-indigo-400/20 to-emerald-400/20 blur-[120px] animate-[pulse_10s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
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
