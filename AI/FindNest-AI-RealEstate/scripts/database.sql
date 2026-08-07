-- Chạy đoạn mã này trong thẻ SQL Editor trên trang quản trị Supabase của bạn
-- Nó sẽ tự động tạo bảng dữ liệu lưu trữ các phòng trọ.

CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  area NUMERIC NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  match_score INTEGER DEFAULT 95,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cho phép đọc dữ liệu (cần thiết để web hiển thị ra ngoài)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON rooms FOR SELECT
  USING ( true );

CREATE POLICY "Anyone can insert rooms."
  ON rooms FOR INSERT
  WITH CHECK ( true );
