# Navbar Specification

## Overview
- **Target file:** `src/components/Navbar.tsx`
- **Interaction model:** Sticky on scroll (position: sticky, top: 0, z-index: 1000)

## DOM Structure
- `<nav>` (Main container, white background with opacity, sticky)
  - `<div className="container mx-auto px-3 max-w-[1320px]">`
    - `<div className="flex items-center justify-between h-[64px]">`
      - **Brand**: Icon + Text ("Homeseeker")
      - **Center Links**: Trang chủ, Phòng trọ, Tìm gần bạn (with "MỚI" badge), Săn phòng, Blog (hidden on mobile `hidden lg:flex`)
      - **Right Actions**: Đăng nhập, Đăng ký (hidden on mobile), Đăng tin miễn phí (orange button with shadow)

## Computed Styles

### `<nav>`
- backgroundColor: `rgba(255, 255, 255, 0.8)` (can use `bg-white/80 backdrop-blur-md` for the modern feel often paired with opacity)
- height: `64px`
- borderBottom: `1px solid rgba(0,0,0,0.06)`
- position: `sticky`, `top: 0`, `z-index: 1000`

### Brand (`navbar-brand-hs`)
- color: `#f97316` (orange-500) for the icon and "Home" part.
- color: `#0a0a0f` for the "seeker" part.
- fontSize: `25.6px`, fontWeight: `900`

### Center Links
- fontSize: `14.4px`, fontWeight: `500`
- color: `#0a0a0f`
- padding: `8px 14px`
- gap: `4px`

### Button: Đăng tin miễn phí
- fontSize: `14.4px`, fontWeight: `700`
- color: `#ffffff`
- padding: `9px 22px`
- borderRadius: `10px`
- boxShadow: `0 4px 15px rgba(249, 115, 22, 0.3)`
- background: `bg-primary` (orange)

## Text Content (verbatim)
- Homeseeker
- Trang chủ
- Phòng trọ
- Tìm gần bạn MỚI
- Săn phòng
- Blog
- Đăng nhập
- Đăng ký
- Đăng tin miễn phí

## Responsive Behavior
- **Desktop (1440px):** All links visible.
- **Tablet (768px):** Center links hidden (`hidden lg:flex`), right actions "Đăng nhập", "Đăng ký" hidden (`hidden md:inline-flex`), only Brand and "Đăng tin miễn phí" button visible. A hamburger menu would be needed for mobile nav.
