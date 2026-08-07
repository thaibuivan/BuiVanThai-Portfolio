# Featured Section Specification

## Overview
- **Target file:** `src/components/Featured.tsx`
- **Description:** A section displaying premium or featured property listings.
- **Brand Consistency:** Uses the primary orange color, Nunito font, and standard border radii.

## Visual Structure

### Container
- Padding: `py-16 md:py-24`
- Background: White (`bg-white`)
- Max-width constraint: `container mx-auto px-4 max-w-[1320px]`

### Header Area
- Title: "Tin đăng nổi bật" (`text-3xl md:text-4xl font-black text-slate-900`)
- Subtitle: "Những phòng trọ chất lượng tốt nhất được chúng tôi tuyển chọn." (`text-slate-500 mt-2`)
- Action: "Xem tất cả" button (`text-primary font-bold hover:underline flex items-center`)

### Grid Layout
- `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10`

### Property Card
- Container: `group border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white relative cursor-pointer`
- Image Area: 
  - `aspect-[4/3] bg-slate-100 overflow-hidden relative`
  - Image scales up slightly on hover (`group-hover:scale-105 transition-transform duration-500`)
  - Badge: "Nổi bật" (`absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm z-10`)
  - Image count: Icon + number (`absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm z-10`)
- Content Area: `p-5`
  - Price: `text-primary font-black text-lg mb-2`
  - Title: `text-slate-900 font-bold text-[15px] leading-snug line-clamp-2 group-hover:text-primary transition-colors`
  - Details Row: Area (m²), Beds, Baths (`flex items-center gap-3 text-slate-500 text-sm mt-3`)
  - Location: `flex items-center text-slate-500 text-sm mt-3 pt-3 border-t border-slate-100`

## Responsive Behavior
- **Desktop:** 4 columns.
- **Tablet:** 2 columns.
- **Mobile:** 1 column, smaller header text.
