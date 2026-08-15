import type { Metadata, Viewport } from "next";

import ThemeRegistry from '@/theme/ThemeRegistry';
import SplashScreen from '@/components/public/SplashScreen';
import CookieConsent from '@/components/public/CookieConsent';
import Analytics from '@/components/public/Analytics';
import { Almarai, Cairo } from 'next/font/google';

const almarai = Almarai({ subsets: ['arabic'], weight: ['300', '400', '700', '800'] });
const cairo = Cairo({ subsets: ['latin', 'arabic'] });

export const metadata: Metadata = {
  title: "Nijar | ورشة النجار",
  description: "أرقى المشغولات الخشبية والديكورات الحديثة بأجود أنواع الأخشاب الطبيعية.",
  keywords: ["أثاث", "نجارة", "ديكورات خشبية", "خشب طبيعي", "ورشة النجار", "أثاث منزلي"],
  openGraph: {
    title: "Nijar | ورشة النجار",
    description: "أرقى المشغولات الخشبية والديكورات الحديثة بأجود أنواع الأخشاب الطبيعية.",
    url: "https://nijar.com", // This will be updated in production via env variables typically
    siteName: "Nijar",
    locale: "ar_EG",
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#F7F9FA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes whatsappPulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); }
            70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
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
