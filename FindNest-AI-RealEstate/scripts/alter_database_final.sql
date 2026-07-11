-- BẠN HÃY CHẠY ĐOẠN MÃ NÀY TRONG SQL EDITOR CỦA SUPABASE NHÉ
-- Lệnh này sẽ mở rộng móng nhà của chúng ta, thêm 7 cột mới cực kỳ quan trọng
-- để đón mẻ dữ liệu Vàng 500 phòng cuối cùng.

ALTER TABLE rooms
ADD COLUMN latitude NUMERIC,
ADD COLUMN longitude NUMERIC,
ADD COLUMN district TEXT,
ADD COLUMN ward TEXT,
ADD COLUMN bedrooms INTEGER,
ADD COLUMN bathrooms INTEGER,
ADD COLUMN contact_phone TEXT;
