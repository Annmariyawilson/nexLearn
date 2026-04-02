# NexLearn - Advanced Next.js 15+ Examination Platform

NexLearn is a premium, high-performance examination platform built as part of a front-end machine test. It features a robust JWT authentication flow, deep state management, and a high-fidelity exam dashboard with real-time tracking and automated status updates.

## 🚀 Key Features
- **OTP-Based Authentication**: Seamless identity verification via SMS OTP flow.
- **Dynamic Profile Creation**: Forced profile setup for new users with mandatory image uploads and validation.
- **Advanced Exam Interface**: A real-time MCQ environment with:
  - Time-remaining synchronized countdown.
  - Interactive question palette (Attended, Review, Marked statuses).
  - Modal-based comprehensive reading support.
- **End-to-End JWT Security**: Middleware-protected private routes with automated token refresh via Axios interceptors.
- **Responsive "Glassmorphism" UI**: Pixel-perfect implementation of provided design assets using Tailwind 4.
- **Deep Result Analysis**: Automated score calculation and performance breakdown.

## 🛠️ Technical Stack
- **Framework**: Next.js 15.2.2 (App Router)
- **State Management**: Redux Toolkit (RTK)
- **Validation**: Zod + React Hook Form
- **API Client**: Axios with interceptors
- **Styling**: Tailwind CSS 4 + Headless UI patterns
- **Data Integrity**: TypeScript (Strict Mode)

## 📁 Architecture Decisions

### 1. CORS & Security (API Proxy)
To bypass CORS restrictions while maintaining production-standard security, the application uses **Next.js API Route Handlers** (`src/app/api/...`) as a local proxy. This allows sensitive headers (like `Authorization`) to be forwarded securely from the server-side, shielding the upstream API backend.

### 2. JWT Strategy & Lifecycle
- **Storage**: Tokens are stored in **both** encrypted `cookies` (for SSR/Middleware protection) and `localStorage` (for fast client-side hydration).
- **Auto-Refresh**: Implemented a thread-safe Axios interceptor that catches 401 errors, uses the `refresh_token` to get a new session, and transparently retries failed requests without user intervention.

### 3. Question Normalization
The upstream API uses irregular naming conventions (`question_id` vs `id`). I implemented a normalization layer in `src/lib/api.ts` that standardizes every question and option into a consistent `number | string` format before they enter the Redux store, preventing runtime crashes.

### 4. Accessibility (a11y)
The application leverages semantic HTML5 tags and leverages ARIA roles for modal dialogs and interactive palette indicators to ensure the platform is usable for all learners.

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 20+

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=/api
REMOTE_API_BASE_URL=https://nexlearn.noviindusdemosites.in
```

### 4. Run Development
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---
© 2026 NexLearn Machine Test - Developed by Akshat# nexLearn
