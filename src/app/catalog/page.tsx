import React from 'react';
import { Box, Container, Typography, IconButton } from '@mui/material';
import CatalogTabs from '@/components/public/CatalogTabs';
import CategorySection from '@/components/public/CategorySection';
import FeaturedWorksRow from '@/components/public/FeaturedWorksRow';
import HeroSlideshow from '@/components/public/HeroSlideshow';
import CatalogNavbar from '@/components/public/CatalogNavbar';
import AboutContact from '@/components/public/AboutContact';
import Footer from '@/components/public/Footer';

interface WorkItem {
  _id: string;
  name: string;
  description: string;
  price: number | null;
  hasSizes?: boolean;
  isBestSeller?: boolean;
  isHeroSlide?: boolean;
  sizes?: { name: string; price: number }[];
  image: { url: string; publicId: string };
  gallery?: { url: string; publicId: string }[];
  category: { _id: string; name: string } | string;
}

interface CatalogCategory {
  _id: string;
  name: string;
  image: { url: string; publicId: string };
  displayOrder: number;
  items: WorkItem[];
}

async function getCatalog(): Promise<{ categories: CatalogCategory[], heroSlides: WorkItem[], settings: any, error: string | null }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const [menuRes, heroRes, settingsRes] = await Promise.all([
      // TODO: (PRODUCTION REMINDER) Restore { next: { revalidate: 60 } } to improve performance
      fetch(`${apiUrl}/catalog`, { cache: 'no-store' }),
      fetch(`${apiUrl}/products/hero-slides`, { cache: 'no-store' }),
      fetch(`${apiUrl}/settings`, { next: { tags: ['settings'] } })
    ]);

    if (!menuRes.ok || !heroRes.ok) {
      return { categories: [], heroSlides: [], settings: null, error: 'حدث خطأ أثناء تحميل الكتالوج. يرجى المحاولة مرة أخرى.' };
    }

    const menuJson = await menuRes.json();
    const heroJson = await heroRes.json();
    const settingsJson = settingsRes.ok ? await settingsRes.json() : { data: null };

    return { 
      categories: menuJson.data || [], 
      heroSlides: heroJson.data || [],
      settings: settingsJson.data || null,
      error: null 
    };
  } catch (error) {
    console.error('Failed to fetch catalog:', error);
    return { categories: [], heroSlides: [], settings: null, error: 'يبدو أن هناك مشكلة في الاتصال بالخادم. يرجى التأكد من اتصالك بالإنترنت والمحاولة لاحقاً.' };
  }
}

export default async function CatalogPage() {
  const { categories, heroSlides, settings, error } = await getCatalog();
  
  // Get best sellers and deduplicate (remove items already present in hero slides)
  const heroSlideIds = new Set(heroSlides.map(slide => slide._id));
  const featuredWorks = categories
    .flatMap(cat => cat.items.filter(item => item.isBestSeller))
    .filter(item => !heroSlideIds.has(item._id));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {/* Master Sticky Header */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: 'background.default', width: '100%' }}>
        <CatalogNavbar />
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 2 } }}>
          {categories.length > 0 && !error && (
            <CatalogTabs menu={categories} />
          )}
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 1, pb: 2, px: { xs: 1, sm: 2, md: 2 }, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {error ? (
          <Box sx={{ my: 10, textAlign: 'center', p: 4, bgcolor: 'rgba(211, 47, 47, 0.05)', borderRadius: '24px', border: '1px solid rgba(211, 47, 47, 0.1)' }}>
            <Typography variant="h6" color="error" sx={{ fontWeight: 800, mb: 2 }}>
              {error}
            </Typography>
            <IconButton component="a" href="/catalog" sx={{ bgcolor: 'error.main', color: '#fff', '&:hover': { bgcolor: 'error.dark' }, p: 1.5 }}>
              <Typography sx={{ fontWeight: 700, px: 2 }}>إعادة المحاولة</Typography>
            </IconButton>
          </Box>
        ) : categories.length === 0 ? (
          <Box sx={{ my: 10, textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 800 }}>
              لا توجد أعمال في الكتالوج حالياً.
            </Typography>
          </Box>
        ) : (
          <>
            {/* Hero Slideshow */}
            {heroSlides.length > 0 && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <HeroSlideshow slides={heroSlides} />
              </Box>
            )}

            {/* Featured Works (Deduplicated) */}
            {featuredWorks.length > 0 && (
              <Box id="best-sellers-section" className="scrollspy-section" sx={{ pt: 2 }}>
                <FeaturedWorksRow items={featuredWorks} />
              </Box>
            )}

            <Box component="main">
              {categories.map(category => (
                <CategorySection
                  key={category._id}
                  id={`category-${category._id}`}
                  name={category.name}
                  image={category.image}
                  items={category.items}
                />
              ))}
            </Box>
          </>
        )}

        <AboutContact 
          address={settings?.address} 
          phone={settings?.phone} 
          whatsapp={settings?.whatsapp} 
        />
        <Footer />
      </Container>
    </Box>
  );
}
