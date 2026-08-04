import type { Metadata } from "next";

import ThemeRegistry from '@/theme/ThemeRegistry';
import { Almarai, Cairo } from 'next/font/google';

const almarai = Almarai({ subsets: ['arabic'], weight: ['300', '400', '700', '800'] });
const cairo = Cairo({ subsets: ['latin', 'arabic'] });

import SplashScreen from '@/components/public/SplashScreen';

export const metadata: Metadata = {
  title: "Nijar | ورشة النجار",
  description: "أرقى المشغولات الخشبية والديكورات الحديثة",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="theme-color" content="#F7F9FA" />
      </head>
      <body suppressHydrationWarning className={`${almarai.className} ${cairo.className}`} style={{ margin: 0, padding: 0, backgroundColor: '#F7F9FA' }}>
        <ThemeRegistry>
          <SplashScreen />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
