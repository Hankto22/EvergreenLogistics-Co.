# Evergreen Logistics Frontend

A modern React application for logistics management with TypeScript, RTK Query, Tailwind CSS, and Framer Motion.

## Tech Stack

- **React 19** with TypeScript
- **RTK Query** for state management and API calls
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Headless UI** for accessible components
- **React Router** for navigation

## Folder Structure

```
src/
│
├── app/
│   ├── page.tsx                 // Home (/)
│   ├── about/page.tsx           // About (video section lives here)
│   ├── services/page.tsx
│   ├── tracking/page.tsx
│   ├── sustainability/page.tsx
│   ├── gallery/page.tsx         // Community Impact (NEW)
│   ├── login/page.tsx
│   │
│   ├── dashboard/
│   │   ├── admin/page.tsx
│   │   ├── staff/page.tsx
│   │   └── client/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── MobileSidebar.tsx
│   │
│   ├── hero/
│   │   ├── HeroSlider.tsx
│   │   └── HeroBars.tsx
│   │
│   ├── animations/
│   │   └── motionVariants.ts
│   │
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   └── ShipmentCard.tsx
│   │
│   ├── gallery/
│   │   ├── GalleryGrid.tsx
│   │   ├── GalleryCard.tsx
│   │   └── GalleryModal.tsx
│
└── lib/
    └── mockData.ts
```

## Gallery & Community Impact – Frontend Alignment Checklist

### Pages
- [x] /gallery route created
- [x] Category filters (Children's Homes, Orphan Support, School Support, Donations, Events)
- [x] Responsive grid (image & video cards)
- [x] Modal-based media viewer (image zoom / video player)

### Animations
- [x] Gallery cards: fade + scale
- [x] Filter changes animated
- [x] Modal enter/exit animation ready

### State Management
- [x] RTK Query configured
- [x] GET /api/gallery query wired
- [x] POST /api/gallery mutation wired
- [x] DELETE /api/gallery mutation ready

### Admin / Staff
- [x] Upload modal UI implemented
- [x] Cloudinary upload placeholder integrated
- [x] API payload matches backend contract

### Backend Readiness
- [x] MSSQL schema defined
- [x] Hono routes planned
- [x] No frontend refactor needed after backend integration

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Build for production:
   ```bash
   pnpm build
   ```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
