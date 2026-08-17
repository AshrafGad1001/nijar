# Nijar (النجار) - Luxury Furniture E-commerce Platform

A bespoke, high-performance web application designed exclusively for a luxury furniture and woodworking brand. Built with **Next.js (App Router)** and **Material UI**, this platform emphasizes aesthetic excellence, dynamic rendering, and a seamless, "Quiet Luxury" user experience.

![Nijar Platform](public/logo.png)

## ✨ Core Features & Visual Polish

- **Bespoke UI/UX:** A custom visual language featuring deep slate backgrounds, glassmorphism elements, soft micro-animations, and a fully responsive grid system tailored for catalog browsing.
- **Scroll Reveal Animations:** Smooth, framer-motion powered fade-ups that respect user preferences (`prefers-reduced-motion`).
- **Next-Gen Image Optimization:** Integrated Next.js `<Image>` with native `placeholder="blur"` and Base64 blurDataURLs for a premium loading experience akin to top-tier luxury brands.
- **Dynamic Catalog & Performance:** Blazing fast load times utilizing **Server-Side Generation (SSG)** and **Incremental Static Regeneration (ISR)**. The catalog stays perfectly synced with the backend via a secure On-Demand Revalidation system.
- **Secure Admin Dashboard:** A fully protected administrative interface utilizing Next.js Middleware and strictly enforced `HttpOnly` cookies. No tokens are stored in `localStorage`.
- **Advanced SEO Architecture:** Dynamic `generateMetadata`, JSON-LD Schema implementations (like Breadcrumbs), and comprehensive OpenGraph tags for every product and category.

## 🛠️ Architecture & Technologies

- **Framework:** Next.js 14+ (App Router, Server & Client Components)
- **Language:** TypeScript (Strict Mode)
- **Styling & Components:** Material UI (MUI v5) combined with custom CSS modules, Framer Motion, and Emotion.
- **Form Management:** Zod validation schemas coupled with React Hook Form.
- **State & Data Fetching:** SWR for client-side data, native `fetch` with Next.js caching for Server Components.
- **Bundler:** Turbopack for ultra-fast local development.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.17 or higher)
- Running instance of the **Nijar Backend API**

### Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
REVALIDATION_TOKEN=your_secure_secret_token
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_FB_PIXEL_ID=your_facebook_pixel_id
```

### Installation

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/AshrafGad1001/nijar.git
   cd nijar
   npm install
   ```

2. Start the development server (using Turbopack):
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

### Building for Production

To create an optimized production build:
```bash
npm run build
```
Start the production server:
```bash
npm run start
```

## 🔒 Security Implementation

The application leverages secure, client-transparent authentication. Access tokens are strictly managed by the backend using `HttpOnly` cookies to mitigate XSS vulnerabilities. The `middleware.ts` file acts as a robust edge gatekeeper, intercepting administrative routes and validating active sessions prior to rendering.

## 🎨 Theming & Customization

The project relies on a centralized theme configuration defined in `src/theme/ThemeRegistry.tsx` and custom global styles in `src/app/globals.css`. The design deliberately avoids generic aesthetics, focusing instead on carefully curated typography (Almarai/Cairo) and harmonious spatial layouts.

---
*Crafted with precision for the modern luxury web.*
