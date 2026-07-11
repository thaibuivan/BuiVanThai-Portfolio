-- BẠN HÃY CHẠY ĐOẠN MÃ NÀY TRONG SQL EDITOR CỦA SUPABASE NHÉ
-- Nó sẽ thêm 3 cột mới vào bảng rooms hiện tại của bạn

ALTER TABLE rooms 
ADD COLUMN landlord_name TEXT,
ADD COLUMN posted_time TEXT,
ADD COLUMN original_url TEXT;
