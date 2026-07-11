-- BẠN HÃY CHẠY ĐOẠN MÃ NÀY TRONG SUPABASE SQL EDITOR NHÉ
-- 1. Kích hoạt tính năng sinh UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tạo bảng favorites
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  -- Đảm bảo 1 user chỉ có thể thả tim 1 phòng duy nhất 1 lần
  UNIQUE(user_id, room_id)
);

-- 3. Bật tính năng Bảo mật RLS (Row Level Security)
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 4. Tạo các Policy bảo mật (Chỉ ai đăng nhập mới được xem và xóa phòng CỦA CHÍNH HỌ)
CREATE POLICY "Người dùng chỉ được XEM phòng yêu thích của chính mình"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Người dùng tự THÊM phòng yêu thích"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Người dùng tự XÓA phòng yêu thích"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);
