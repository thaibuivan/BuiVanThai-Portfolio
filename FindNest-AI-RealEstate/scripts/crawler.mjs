import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lklgfcsrascmbqzrurqg.supabase.co';
const supabaseKey = 'sb_publishable_f1uhwplCKyljankMCR5RDA_y2FlH4t6';
const supabase = createClient(supabaseUrl, supabaseKey);

async function crawlDuLieuChuanThoiGianThuc() {
  console.log("Bắt đầu chiến dịch: CÀO CHO BẰNG ĐỦ 500 PHÒNG (Cân bằng 3 chuyên mục)...");
  
  try {
    const targetDistricts = ['Hà Đông', 'Thanh Xuân', 'Đống Đa', 'Hai Bà Trưng'];
    const allRooms = [];
    
    const categories = [
      { id: 1050, name: "Phòng trọ" },
      { id: 1010, name: "Chung cư mini" },
      { id: 1020, name: "Nhà nguyên căn" }
    ];

    for (let cat of categories) {
      console.log(`Đang quét chuyên mục ${cat.name} (Mục tiêu: 170 phòng)...`);
      let offset = 0;
      let catCount = 0; // Đếm số phòng đã lấy được của riêng chuyên mục này
      
      // Vòng lặp sẽ chạy liên tục cho đến khi gom đủ 170 phòng chuẩn (hoặc quét tối đa 80 trang để chống kẹt)
      while (catCount < 170 && offset <= 8000) {
        const url = `https://gateway.chotot.com/v1/public/ad-listing?region_v2=12000&cg=${cat.id}&limit=100&o=${offset}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (!data.ads || data.ads.length === 0) break; // Hết dữ liệu trên Chợ Tốt thì dừng lại

          data.ads.forEach(ad => {
            if (!ad.area_name) return;
            const isTargetArea = targetDistricts.some(district => ad.area_name.includes(district));
            
            // Nếu phòng đạt chuẩn VÀ chuyên mục này chưa gom đủ 170 phòng
            if (ad.images && ad.images.length > 0 && isTargetArea && ad.size && ad.type === 'u' && ad.list_time && catCount < 170) {
              allRooms.push({
                title: ad.subject,
                price: ad.price,
                area: ad.size,
                location: `${ad.ward_name_v3 || ad.ward_name}, ${ad.area_name}, Hà Nội`,
                description: ad.body,
                images: ad.images,
                match_score: Math.floor(Math.random() * (99 - 80 + 1)) + 80,
                landlord_name: ad.account_name || 'Chủ nhà',
                posted_time: new Date(ad.list_time).toISOString(), 
                source_url: `https://nha.chotot.com/thue-phong-tro/${ad.list_id}.htm`,
                room_type: cat.name,
                
                latitude: ad.latitude || null,
                longitude: ad.longitude || null,
                district: ad.area_name || null,
                ward: ad.ward_name_v3 || ad.ward_name || null,
                bedrooms: ad.rooms || 1,
                bathrooms: ad.toilets || 1,
                contact_phone: null
              });
              catCount++; // Tăng biến đếm lên
            }
          });
          
          // Chuyển sang trang tiếp theo
          offset += 100;
        } catch(e) {
          console.log("Lỗi mạng, thử lại trang tiếp theo...");
          offset += 100;
        }
      }
      console.log(`✅ Đã gom xong ${catCount} phòng cho chuyên mục ${cat.name}.`);
    }

    if (allRooms.length > 0) {
      console.log(`\n🎉 Đang nạp tổng cộng ${allRooms.length} tin đăng siêu chuẩn vào Database...`);
      const { error } = await supabase.from('rooms').insert(allRooms);
      if (error) console.error("Lỗi khi lưu Database:", error.message);
      else console.log(`✅ Xong! Database của bạn đã có chính xác ${allRooms.length} phòng!`);
    } else {
      console.log("Không lấy được dữ liệu nào.");
    }

  } catch (error) {
    console.error("Lỗi tổng:", error);
  }
}

crawlDuLieuChuanThoiGianThuc();
