# Interaction Behaviors: homeseeker.vn

This document outlines the interaction patterns observed during the reconnaissance phase.

## Global Behaviors
- **Scroll Behavior**: Smooth scrolling is observed on the page. Need to verify if it's native or via a library like Lenis.
- **Header**: The navigation bar (`nav#main-navbar`) is sticky (`sticky-top`). It remains visible at the top of the viewport when scrolling down. It has a slight shadow (`shadow-sm`) and a white background.

## Hover States (Inferred)
- **Buttons (e.g., "Đăng tin miễn phí", "Tìm kiếm")**: Likely have a slight color darken/lighten or shadow change on hover. The primary orange `bg-orange-500` will likely transition to `bg-orange-600`.
- **Room Cards**: The room listing cards in `featured-section` and `latest-listings-section` likely have a slight elevation (box-shadow increase) or image zoom on hover to indicate they are clickable.
- **Navigation Links**: Links like "Phòng trọ", "Blog" likely change color to the primary orange or have an underline effect on hover.

## Click & State Behaviors
- **Search Bar**: Clicking the "Loại phòng" (Room Type) dropdown opens a selection menu.
- **FAQ Accordion**: Clicking a question in the `faq-section` expands the answer below it, likely with a smooth height/opacity transition.

## Responsive Layouts
- **Desktop (1440px)**: Multi-column layout. The "3 bước" (steps) are 3 columns. Cards are in a 4-column grid.
- **Tablet (768px)**: Steps likely collapse to 2 or 1 column. Card grid becomes 2 columns.
- **Mobile (390px)**: All multi-column layouts stack into a single column. The navigation bar links collapse into a hamburger menu.

*Note: As this was extracted via DOM structural analysis, exact CSS transitions will be measured during the individual component specification phase.*
