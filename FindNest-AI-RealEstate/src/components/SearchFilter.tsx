"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, DollarSign, Maximize, Bed } from "lucide-react";
import MultiSelect from "./MultiSelect";

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
  
  const [district, setDistrict] = useState<string[]>(initialDistrict ? initialDistrict.split(",") : []);
  const [roomType, setRoomType] = useState<string[]>(initialRoomType ? initialRoomType.split(",") : []);
  const [price, setPrice] = useState<string[]>(initialPrice ? initialPrice.split(",") : []);
  const [area, setArea] = useState<string[]>(initialArea ? initialArea.split(",") : []);
  const [bedrooms, setBedrooms] = useState<string[]>(initialBedrooms ? initialBedrooms.split(",") : []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (district.length > 0) params.append("district", district.join(","));
    if (roomType.length > 0) params.append("room_type", roomType.join(","));
    if (price.length > 0) params.append("price", price.join(","));
    if (area.length > 0) params.append("area", area.join(","));
    if (bedrooms.length > 0) params.append("bedrooms", bedrooms.join(","));

    router.push(`/phong?${params.toString()}`);
  };

  const districtOptions = [
    { value: "Cầu Giấy", label: "Cầu Giấy" },
    { value: "Thanh Xuân", label: "Thanh Xuân" },
    { value: "Đống Đa", label: "Đống Đa" },
    { value: "Hai Bà Trưng", label: "Hai Bà Trưng" },
    { value: "Nam Từ Liêm", label: "Nam Từ Liêm" },
    { value: "Hoàng Mai", label: "Hoàng Mai" },
  ];

  const roomTypeOptions = [
    { value: "Phòng trọ", label: "Phòng trọ" },
    { value: "Chung cư mini", label: "Chung cư mini" },
    { value: "Nhà nguyên căn", label: "Nhà nguyên căn" },
  ];

  const priceOptions = [
    { value: "0-2000000", label: "Dưới 2 triệu" },
    { value: "2000000-4000000", label: "2 - 4 triệu" },
    { value: "4000000-7000000", label: "4 - 7 triệu" },
    { value: "7000000-", label: "Trên 7 triệu" },
  ];

  const areaOptions = [
    { value: "0-20", label: "Dưới 20m²" },
    { value: "20-40", label: "20m² - 40m²" },
    { value: "40-", label: "Trên 40m²" },
  ];

  const bedroomOptions = [
    { value: "1", label: "1 Ngủ" },
    { value: "2", label: "2 Ngủ" },
    { value: "3+", label: "3+ Ngủ" },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-[0_20px_60px_rgba(29,78,216,0.12)] border border-white/50 w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="col-span-2 md:col-span-1">
          <MultiSelect
            options={districtOptions}
            selectedValues={district}
            onChange={setDistrict}
            placeholder="Khu vực"
            icon={<MapPin className="w-4 h-4" />}
          />
        </div>

        <div>
          <MultiSelect
            options={roomTypeOptions}
            selectedValues={roomType}
            onChange={setRoomType}
            placeholder="Loại phòng"
            icon={<Home className="w-4 h-4" />}
          />
        </div>

        <div>
          <MultiSelect
            options={priceOptions}
            selectedValues={price}
            onChange={setPrice}
            placeholder="Mức giá"
            icon={<DollarSign className="w-4 h-4" />}
          />
        </div>

        <div>
          <MultiSelect
            options={areaOptions}
            selectedValues={area}
            onChange={setArea}
            placeholder="Diện tích"
            icon={<Maximize className="w-4 h-4" />}
          />
        </div>

        <div className="flex gap-2 col-span-2 md:col-span-2">
          <div className="flex-1">
            <MultiSelect
              options={bedroomOptions}
              selectedValues={bedrooms}
              onChange={setBedrooms}
              placeholder="Ngủ"
              icon={<Bed className="w-4 h-4" />}
            />
          </div>
          <button 
            onClick={handleSearch}
            className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center shrink-0 shadow-md shadow-primary/30 relative overflow-hidden group"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out"></div>
            <Search className="w-5 h-5 md:mr-2 relative z-10" />
            <span className="hidden md:inline relative z-10">Tìm</span>
          </button>
        </div>
      </div>
    </div>
  );
}
