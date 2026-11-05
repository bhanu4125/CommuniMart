# CommuniMart 🏘️🛒
### Hyperlocal Gated Community Marketplace & Social Exchange

> Built with **React 18 (Vite) + TypeScript + Tailwind CSS + Framer Motion + TanStack Query + Zustand** on the frontend, and **Node.js + Express (Modular MVC) + MongoDB (Mongoose) + Socket.io** on the backend.

---

## 🌟 Overview & Mission

**CommuniMart** is a production-grade, hyper-polished community marketplace crafted exclusively for residents of a gated residential society (**Green Meadows Gated Community**). It solves the unique domestic challenges of gated living:
1. **Safety & Privacy**: Verified residents only; flat/villa numbers are protected with privacy masking toggles until order confirmation.
2. **Circular Economy & Decluttering**: Pre-loved household goods, power tools, kids toys, and books stay within the society instead of going to landfills.
3. **Hyperlocal Micro-Commerce**: Fresh home bakes, weekend meals, and services (pet sitting, ICSE tutoring, car detailing) offered by verified neighbors.
4. **Zero-Friction Logistics**: Society handover options — Doorstep drop, Security Gate 1 drop-box, or Flat pickup.
5. **Direct UPI QR Integration**: Dynamic UPI payment links and instant QR generation (`upi://pay?pa=...`) alongside Society Escrow.

---

## 📐 Architecture & Monorepo Layout

```text
/mart
├── package.json               # Monorepo scripts (dev, seed, build, start)
├── README.md
├── server/                    # Node.js + Express TypeScript MVC
│   ├── src/
│   │   ├── config/            # MongoDB connection & environment
│   │   ├── models/            # User, Product, Order, Message, Notice
│   │   ├── modules/
│   │   │   ├── auth/          # Resident onboarding, JWT in HttpOnly cookies, privacy masking
│   │   │   ├── products/      # Catalog, fuzzy search, block/category filters, availability toggle
│   │   │   ├── orders/        # 4-stage lifecycle, UPI reference, neighbor reviews & badges
│   │   │   ├── chat/          # Real-time resident messenger & quick replies
│   │   │   ├── notices/       # Community notice board & urgent borrow requests
│   │   │   └── admin/         # Committee dashboard, resident verification approvals
│   │   ├── middleware/        # JWT auth, RBAC, rate limiter, error handler
│   │   ├── socket/            # Socket.io real-time engine (chat, pings, status updates)
│   │   ├── scripts/           # Comprehensive seed script (10 residents, 26 items)
│   │   ├── types/             # Shared TypeScript domain contracts
│   │   ├── app.ts             # Express application setup (Helmet, CORS, cookie-parser)
│   │   └── index.ts           # Server bootstrap & WebSocket listener
└── client/                    # React 18+ (Vite) + TypeScript + Tailwind
    ├── src/
    │   ├── components/        # Navbar, BottomNav, ProductCard, ProductDrawer,
    │   │                      # CheckoutModal (UPI QR), OrderTrackingCard, ReviewModal,
    │   │                      # CreateListingModal, NoticeModal, ChatDrawer
    │   ├── pages/             # MarketplacePage, NoticesPage, OrdersPage, MessagesPage, AdminPage
    │   ├── context/           # SocketContext (live messaging & neighbor pings)
    │   ├── stores/            # useAuthStore (Zustand state + 1-click resident switcher)
    │   ├── lib/               # api.ts (Axios), sound.ts (Web Audio API synthesis), utils.ts
    │   └── types/             # Frontend interfaces matching backend contracts
```

---

## 🎨 Scandinavian UX/UI Design System

- **Palette**: Warm residential zinc base (`#fafafa` / `#18181b` dark mode) accented with **Emerald Teal** (`#0f766e` / `#14b8a6`) for tranquility and **Warm Amber** (`#f59e0b`) for alerts, ratings, and urgency.
- **Card Styling**: Frosted glassmorphism (`backdrop-blur-md bg-white/85 dark:bg-zinc-900/85 border border-zinc-200/80 shadow-sm`).
- **Framer Motion Micro-Interactions**:
  - Spring physics (`stiffness: 300, damping: 25`) on card hovers, taps, and drawer transitions.
  - Floating sticky bottom navigation bar with fluid active-tab pill animations for mobile.
  - Pulsing indicator rings for real-time item availability pings.
  - Confetti burst on order placement (`canvas-confetti`).
- **Audio Feedback**: Built-in Web Audio API sound synthesis (clicks, pings, and pleasant celebration chimes) with an instant on/off toggle in the navbar.

---

## 🚀 Quickstart & Commands

### 1. Install Dependencies
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Populate Database (Seed Script)
Populates 10 residents across 4 society blocks (`Tower A`, `Tower B`, `Tower C`, `Villa Grove`), 26 realistic products across 8 categories, 4 community notices, and active orders:
```bash
npm run seed
```

### 3. Run Dev Server
Runs both server (`http://localhost:5000`) and client (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 👤 Pre-Seeded Resident Personas for Testing

You can use the **1-Click Resident Switcher** in the top navigation bar to test the application from different resident perspectives:

1. **Priya Sharma** (`Tower A-402`) — **Verified Seller & Baker**
   - *Badges*: "Trusted Baker", "Prompt Handover", "Verified Resident"
   - *Listings*: Artisanal Country Sourdough Batard, Babka loaf
2. **Vikram Malhotra** (`Tower B-101`) — **Committee Lead & Admin**
   - *Role*: `committee_admin` (Access to Admin Verification Panel)
   - *Listings*: Weekend Hyderabadi Dum Biryani, ICSE Physics Tutoring
3. **Karan Mehra** (`Tower C-302`) — **Electronics Resident**
   - *Listings*: Bose QuietComfort 45, LG 4K Monitor
4. **Sneha Patel** (`Tower A-303`) — **New Resident (Pending Approval)**
   - Test committee approval workflow from Vikram's Admin panel!
