import type { Metadata, Viewport } from "next";

import ThemeRegistry from '@/theme/ThemeRegistry';
import SplashScreen from '@/components/public/SplashScreen';
import CookieConsent from '@/components/public/CookieConsent';
import Analytics from '@/components/public/Analytics';
import { Almarai, Cairo } from 'next/font/google';

const almarai = Almarai({ subsets: ['arabic'], weight: ['300', '400', '700', '800'] });
const cairo = Cairo({ subsets: ['latin', 'arabic'] });

export const metadata: Metadata = {
  title: "Mohamed Geba",
  description: "أرقى المشغولات الخشبية والديكورات الحديثة بأجود أنواع الأخشاب الطبيعية.",
  keywords: ["أثاث", "نجارة", "ديكورات خشبية", "خشب طبيعي", "ورشة النجار", "أثاث منزلي", "Mohamed Geba"],
  openGraph: {
    title: "Mohamed Geba",
    description: "أرقى المشغولات الخشبية والديكورات الحديثة بأجود أنواع الأخشاب الطبيعية.",
    url: "https://nijar.com", // This will be updated in production via env variables typically
    siteName: "Mohamed Geba",
    locale: "ar_EG",
    type: "website",
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23D4AF37" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M8 2h8M12 22l-2-2M12 22l2-2"/></svg>',
  },
};

export const viewport: Viewport = {
  colorScheme: "light only" as any, // "light only" tells forced dark mode browsers to back off
  themeColor: "#F7F9FA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning style={{ colorScheme: 'light' }}>
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          @media (prefers-reduced-motion: no-preference) {
            @keyframes kenBurns {
              0% { transform: scale(1) translateZ(0); }
              100% { transform: scale(1.05) translateZ(0); }
            }
            .ken-burns-effect {
              animation: kenBurns 10s ease-out forwards;
              will-change: transform;
            }
            
            @keyframes whatsappPulse {
              0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); }
              70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
              100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
            }
          }
        `}} />
        <script dangerouslySetInnerHTML={{__html: `
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
              for(let registration of registrations) {
                registration.unregister();
              }
            });
          }
        `}} />
      </head>
      <body suppressHydrationWarning className={`${almarai.className} ${cairo.className}`} style={{ margin: 0, padding: 0, backgroundColor: '#F7F9FA' }}>
        <ThemeRegistry>
          <SplashScreen />
          {children}
          <CookieConsent />
          <Analytics />
        </ThemeRegistry>
      </body>
    </html>
  );
}
