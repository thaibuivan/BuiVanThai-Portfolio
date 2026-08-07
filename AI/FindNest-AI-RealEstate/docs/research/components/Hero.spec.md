# Hero Specification

## Overview
- **Target file:** `src/components/Hero.tsx`
- **Screenshot:** Provided by user in context.
- **Interaction model:** Static layout with hover states on buttons.

## Visual Structure

### Section Container
- `backgroundColor`: `bg-slate-900`
- `backgroundImage`: A subtle grid pattern.
- Layout: Grid or Flex with 2 main columns on Desktop. Left for content, right for the hero card.

### Left Column: Text & Search
1. **Badge**: 
   - Pill shape (`rounded-full`), dark semi-transparent background (`bg-white/10`).
   - Content: Green dot (`bg-green-500 rounded-full w-2 h-2`), fire emoji 🔥, text "#1 Nền tảng thuê nhà Việt Nam" (`text-sm text-gray-300`).
2. **Headline**:
   - Line 1: "Tìm phòng trọ" (`text-white font-black text-6xl md:text-7xl tracking-tight`).
   - Line 2: "Nhanh · Đúng · Tin cậy" (`text-primary font-black text-6xl md:text-7xl tracking-tight`).
3. **Sub-headline**:
   - "Hàng nghìn phòng trọ, chung cư mini, nhà nguyên căn được đăng mới mỗi ngày. Xem bản đồ thực tế, liên hệ trực tiếp chủ nhà — không qua trung gian."
   - `text-lg md:text-xl text-gray-400 max-w-lg mt-6`.
4. **Search Bar**:
   - Container: `bg-slate-800/80 border border-slate-700 p-2 rounded-full flex items-center mt-8`.
   - Input: "Nhập địa chỉ, quận, tỉnh thành..." (`bg-transparent text-white w-full px-4 focus:outline-none`).
   - Divider: Vertical line `border-r border-slate-700 h-8`.
   - Dropdown: "Loại phòng" with chevron (`bg-transparent text-white px-4 flex items-center gap-2`).
   - Button: "Tìm kiếm" with Search icon (`bg-primary text-white rounded-full px-6 py-3 font-bold`).
5. **Suggestions**:
   - "Gợi ý:" (`text-gray-400 text-sm mt-4`).
   - Badges: Bình Dương, TP. Hồ Chí Minh, Hà Nội, Đà Nẵng (`border border-slate-700 rounded-full px-3 py-1 text-sm text-gray-300 hover:bg-slate-800 cursor-pointer transition-colors`).

### Right Column: Hero Card
- A card representing a featured listing, tilted or positioned nicely.
- Container: `bg-white rounded-2xl overflow-hidden shadow-2xl max-w-sm relative mt-12 lg:mt-0`.
- Image: A room interior with a mezzanine.
- Content:
  - Price: "2.900.000 đ/tháng" (`text-primary font-bold text-xl`).
  - Title: "TRỐNG NHIỀU PHÒNG CÓ GÁC NGAY PHẠM VĂN CHIÊU..." (`text-slate-900 font-bold text-sm line-clamp-2 mt-2`).
  - Location: "Quận Bình Thạnh" with map pin icon (`text-gray-500 text-xs flex items-center mt-2`).
- Floating Badges (Absolute positioning):
  - Top Right: "Mới đăng" (2 tuần trước).
  - Bottom Right: "Đã xác minh" (Chủ nhà uy tín).
  - Bottom Left: "27 tin đăng" (Đang hoạt động).

## Text Content
- #1 Nền tảng thuê nhà Việt Nam
- Tìm phòng trọ
- Nhanh · Đúng · Tin cậy
- Hàng nghìn phòng trọ, chung cư mini, nhà nguyên căn được đăng mới mỗi ngày. Xem bản đồ thực tế, liên hệ trực tiếp chủ nhà — không qua trung gian.
- Nhập địa chỉ, quận, tỉnh thành...
- Loại phòng
- Tìm kiếm
- Gợi ý: Bình Dương, TP. Hồ Chí Minh, Hà Nội, Đà Nẵng

## Responsive Behavior
- **Desktop (1440px):** 2 Columns (Content left, Card right).
- **Tablet (768px):** Stacked. Card goes below the content. Search bar might stack its elements.
- **Mobile (390px):** Search bar completely stacks vertically. Badges wrap.

## Assets
- None specifically needed, use Lucide icons for UI elements and a placeholder image for the card.
