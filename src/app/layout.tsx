import type { Metadata } from "next";

import ThemeRegistry from '@/theme/ThemeRegistry';
import { Almarai, Cairo } from 'next/font/google';

const almarai = Almarai({ subsets: ['arabic'], weight: ['300', '400', '700', '800'] });
const cairo = Cairo({ subsets: ['latin', 'arabic'] });

import SplashScreen from '@/components/public/SplashScreen';

export const metadata: Metadata = {
  title: "Nijar | Restaurant Menu",
  description: "Browse our delicious menu at Nijar. Fresh ingredients, amazing flavors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${almarai.className} ${cairo.className}`} style={{ margin: 0, padding: 0 }}>
        <ThemeRegistry>
          <SplashScreen />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
