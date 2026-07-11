"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, DollarSign, Maximize, Bed } from "lucide-react";

interface SearchFilterProps {
  initialDistrict?: string;
  initialRoomType?: string;
  initialPrice?: string;
  initialArea?: string;
  initialBedrooms?: string;
}

export default function SearchFilter({
  initialDistrict = "",
  initialRoomType = "",
  initialPrice = "",
  initialArea = "",
  initialBedrooms = "",
}: SearchFilterProps = {}) {
  const router = useRouter();
  const [district, setDistrict] = useState(initialDistrict);
  const [roomType, setRoomType] = useState(initialRoomType);
  const [price, setPrice] = useState(initialPrice);
  const [area, setArea] = useState(initialArea);
  const [bedrooms, setBedrooms] = useState(initialBedrooms);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (district) params.append("district", district);
    if (roomType) params.append("room_type", roomType);
    if (price) params.append("price", price);
    if (area) params.append("area", area);
    if (bedrooms) params.append("bedrooms", bedrooms);

    router.push(`/phong?${params.toString()}`);
  };

  return (
    <div className="bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-[0_20px_60px_rgba(29,78,216,0.12)] border border-blue-50 w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {/* District */}
        <div className="relative col-span-2 md:col-span-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full h-12 pl-10 pr-4 bg-slate-50 border-none rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-primary/20 appearance-none font-medium text-slate-700"
          >
            <option value="">Khu vực (Tất cả)</option>
            <option value="Cầu Giấy">Cầu Giấy</option>
            <option value="Thanh Xuân">Thanh Xuân</option>
            <option value="Đống Đa">Đống Đa</option>
            <option value="Hai Bà Trưng">Hai Bà Trưng</option>
            <option value="Nam Từ Liêm">Nam Từ Liêm</option>
            <option value="Hoàng Mai">Hoàng Mai</option>
          </select>
        </div>

        {/* Room Type */}
        <div className="relative">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full h-12 pl-10 pr-4 bg-slate-50 border-none rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-primary/20 appearance-none font-medium text-slate-700"
          >
            <option value="">Loại phòng</option>
            <option value="Phòng trọ">Phòng trọ</option>
            <option value="Chung cư mini">Chung cư mini</option>
            <option value="Nhà nguyên căn">Nhà nguyên căn</option>
          </select>
        </div>

        {/* Price */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full h-12 pl-10 pr-4 bg-slate-50 border-none rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-primary/20 appearance-none font-medium text-slate-700"
          >
            <option value="">Mức giá</option>
            <option value="0-2000000">Dưới 2 triệu</option>
            <option value="2000000-4000000">2 - 4 triệu</option>
            <option value="4000000-7000000">4 - 7 triệu</option>
            <option value="7000000-">Trên 7 triệu</option>
          </select>
        </div>

        {/* Area */}
        <div className="relative">
          <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full h-12 pl-10 pr-4 bg-slate-50 border-none rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-primary/20 appearance-none font-medium text-slate-700"
          >
            <option value="">Diện tích</option>
            <option value="0-20">Dưới 20m²</option>
            <option value="20-40">20m² - 40m²</option>
            <option value="40-">Trên 40m²</option>
          </select>
        </div>

        {/* Bedrooms & Search Button */}
        <div className="flex gap-2 col-span-2 md:col-span-2">
          <div className="relative flex-1">
            <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-slate-50 border-none rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-primary/20 appearance-none font-medium text-slate-700"
            >
              <option value="">Ngủ</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3+</option>
            </select>
          </div>
          <button 
            onClick={handleSearch}
            className="h-12 px-6 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center shrink-0 shadow-md shadow-primary/30"
          >
            <Search className="w-5 h-5 md:mr-2" />
            <span className="hidden md:inline">Tìm</span>
          </button>
        </div>
      </div>
    </div>
  );
}
