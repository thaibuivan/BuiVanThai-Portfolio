"use client";

import dynamic from "next/dynamic";

// Import động với ssr: false BẮT BUỘC phải nằm trong một Client Component
const Map = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium">Đang tải bản đồ AI...</p>
    </div>
  )
});

export default function MapWrapper({ rooms }: { rooms: any[] }) {
  return <Map rooms={rooms} />;
}
