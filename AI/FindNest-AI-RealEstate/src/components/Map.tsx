"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { Maximize, Bed } from "lucide-react";

export default function MapComponent({ rooms }: { rooms: any[] }) {
  // Mặc định tâm bản đồ ở Hà Nội
  const center = [21.016, 105.808];

  const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <MapContainer 
      center={center as any} 
      zoom={13} 
      scrollWheelZoom={true} 
      style={{ height: "100%", width: "100%", zIndex: 10 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {rooms.map(room => {
        if (!room.latitude || !room.longitude) return null;
        return (
          <Marker key={room.id} position={[room.latitude, room.longitude]} icon={customIcon}>
            <Popup className="p-0 m-0 overflow-hidden rounded-xl border-none shadow-xl">
              <div className="w-[220px] -m-5">
                <img src={room.images[0]} className="w-full h-[130px] object-cover" />
                <div className="p-3 bg-white">
                  <div className="font-black text-primary text-sm mb-1">
                    {room.price >= 1000000 
                        ? `${(room.price / 1000000).toFixed(1)} triệu/tháng`
                        : `${(room.price / 1000).toLocaleString()}k/tháng`}
                  </div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-2 mb-2 leading-tight">
                    {room.title}
                  </div>
                  <div className="flex gap-3 text-[11px] text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><Maximize className="w-3 h-3"/> {room.area}m²</span>
                    <span className="flex items-center gap-1"><Bed className="w-3 h-3"/> {room.bedrooms} PN</span>
                  </div>
                  <Link href={`/phong/${room.id}`} target="_blank" className="block w-full text-center bg-blue-50 text-primary font-bold py-2 rounded-lg hover:bg-primary hover:text-white transition-colors text-xs">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
