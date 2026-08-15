# Nijar E-commerce & Catalog Platform (Frontend)

A premium, high-performance web application designed for a luxury furniture and woodworking catalog. Built with Next.js and Material UI, this platform emphasizes aesthetic excellence, dynamic rendering, and seamless user experience.

## Architecture & Technologies

- **Framework:** Next.js (App Router, Server Components)
- **Language:** TypeScript
- **Styling:** Material UI (MUI v5) combined with custom CSS modules and tokens for a tailored "Quiet Luxury" aesthetic.
- **Form Validation:** Zod and React Hook Form
- **State Management:** React Context API and standard hooks
- **Deployment Capability:** Fully static and dynamic hybrid rendering via Vercel/Next.js

## Core Features

- **Premium UI/UX:** A bespoke visual language featuring deep slate backgrounds, gold accents, smooth micro-animations, and responsive design tailored for luxury catalog browsing.
- **Dynamic Catalog System:** Server-Side Generation (SSG) and Incremental Static Regeneration (ISR) ensure optimal loading speeds while keeping inventory data fresh.
- **Secure Admin Dashboard:** A fully protected administrative interface utilizing Next.js Middleware and strictly enforced HttpOnly cookies for session management.
- **Advanced SEO & Analytics:** Dynamic `generateMetadata` integration for all product pages, coupled with a conditional cookie consent system controlling Google Analytics and Facebook Pixel tracking.
- **Accessibility:** Respects user preferences such as `prefers-reduced-motion` for complex animations.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- Running instance of the Nijar Backend API

### Environment Variables
Create a `.env.local` file in the root directory. Refer to `.env.production.example` for required keys:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GA_ID=your_google_analytics_id_here
NEXT_PUBLIC_FB_PIXEL_ID=your_facebook_pixel_id_here
```

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

### Building for Production

To create an optimized production build:
```bash
npm run build
```
Once the build completes, start the production server:
```bash
npm run start
```

## Security Implementation

The application leverages secure, client-transparent authentication. Access tokens are not stored in `localStorage` or `sessionStorage`. Instead, they are managed securely by the backend using HttpOnly cookies, mitigating XSS vulnerabilities. The `middleware.ts` file acts as a robust gatekeeper, intercepting administrative routes and validating active sessions prior to rendering.

## Customization

The project relies on a centralized theme configuration defined in `src/theme/ThemeRegistry.tsx` and custom global styles in `src/app/globals.css`. Colors, typography, and foundational spacing variables can be quickly adjusted to meet evolving brand guidelines.
