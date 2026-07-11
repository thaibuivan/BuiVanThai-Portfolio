-- BẠN HÃY CHẠY ĐOẠN MÃ NÀY TRONG SQL EDITOR CỦA SUPABASE NHÉ
-- Nó sẽ thêm cột Phân loại phòng (room_type) vào bảng rooms hiện tại của bạn

ALTER TABLE rooms 
ADD COLUMN room_type TEXT;
