import React from 'react';
import { Box, Container, Typography, IconButton, Button } from '@mui/material';
import CategoryGrid from '@/components/public/CategoryGrid';
import CategorySection from '@/components/public/CategorySection';
import FeaturedWorksRow from '@/components/public/FeaturedWorksRow';
import HeroSlideshow from '@/components/public/HeroSlideshow';
import BundlesRow from '@/components/public/BundlesRow';
import StandalonePiecesSection from '@/components/public/StandalonePiecesSection';
import CatalogNavbar from '@/components/public/CatalogNavbar';
import AboutContact from '@/components/public/AboutContact';
import Footer from '@/components/public/Footer';
import HomeFloatingWhatsApp from '@/components/public/HomeFloatingWhatsApp';
import ScrollReveal from '@/components/public/ScrollReveal';
import BackToTop from '@/components/public/BackToTop';

export const revalidate = 60; // Fallback: automatically clear cache every 60 seconds

interface WorkItem {
  _id: string;
  name: string;
  description: string;
  components?: string[];
  price: number | null;
  discountPercentage?: number;
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
  slug?: string;
  image: { url: string; publicId: string };
  displayOrder: number;
  isStandalonePiece?: boolean;
  hidePrices?: boolean;
  items: WorkItem[];
}

async function getCatalog(): Promise<{ categories: CatalogCategory[], heroSlides: WorkItem[], bundles: any[], settings: any, error: string | null }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const [menuRes, heroRes, bundlesRes, settingsRes] = await Promise.all([
      fetch(`${apiUrl}/catalog`, { cache: 'force-cache', next: { tags: ['catalog'] } }),
      fetch(`${apiUrl}/products/hero-slides`, { cache: 'force-cache', next: { tags: ['hero-slides'] } }),
      fetch(`${apiUrl}/catalog/bundles`, { cache: 'force-cache', next: { tags: ['bundles'] } }),
      fetch(`${apiUrl}/settings`, { cache: 'force-cache', next: { tags: ['settings'] } })
    ]);

    if (!menuRes.ok || !heroRes.ok) {
      return { categories: [], heroSlides: [], bundles: [], settings: null, error: 'حدث خطأ أثناء تحميل الكتالوج. يرجى المحاولة مرة أخرى.' };
    }

    const menuJson = await menuRes.json();
    const heroJson = await heroRes.json();
    const bundlesJson = bundlesRes.ok ? await bundlesRes.json() : { data: [] };
    const settingsJson = settingsRes.ok ? await settingsRes.json() : { data: null };

    return { 
      categories: menuJson.data || [], 
      heroSlides: heroJson.data || [],
      bundles: bundlesJson.data || [],
      settings: settingsJson.data || null,
      error: null 
    };
  } catch (error) {
    console.error('Failed to fetch catalog:', error);
    return { categories: [], heroSlides: [], bundles: [], settings: null, error: 'يبدو أن هناك مشكلة في الاتصال بالخادم. يرجى التأكد من اتصالك بالإنترنت والمحاولة لاحقاً.' };
  }
}

export default async function CatalogPage() {
  const { categories, heroSlides, bundles, settings, error } = await getCatalog();
  
  // Get best sellers and deduplicate (remove items already present in hero slides)
  const featuredWorks = categories
    .flatMap(cat => cat.items
      .filter(item => item.isBestSeller)
      .map(item => ({
        ...item,
        category: {
          _id: cat._id,
          name: cat.name,
          hidePrices: cat.hidePrices
        }
      }))
    );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {/* Master Sticky Header */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: 'background.default', width: '100%' }}>
        <CatalogNavbar adminName={settings?.adminName} phone={settings?.phone || settings?.whatsapp} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {error ? (
          <Container maxWidth="md">
            <Box sx={{ 
              my: 12, 
              textAlign: 'center', 
              p: { xs: 4, md: 6 }, 
              bgcolor: '#ffffff', 
              borderRadius: '32px', 
              border: '1px solid rgba(211, 47, 47, 0.1)',
              boxShadow: '0 24px 48px rgba(211, 47, 47, 0.08), 0 0 0 4px rgba(211, 47, 47, 0.02)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Subtle background glow */}
              <Box sx={{
                position: 'absolute',
                top: '-50%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(211,47,47,0.05) 0%, rgba(255,255,255,0) 70%)',
                zIndex: 0,
                pointerEvents: 'none'
              }} />
              
              <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(211, 47, 47, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 3
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#1B3A4B', mb: 1.5 }}>
                  عذراً، حدث خطأ ما!
                </Typography>
                <Typography variant="body1" sx={{ color: '#5A6B72', mb: 4, maxWidth: '500px', lineHeight: 1.8 }}>
                  {error}
                </Typography>
                <Button 
                  component="a" 
                  href="/catalog" 
                  variant="contained"
                  sx={{ 
                    bgcolor: '#D32F2F', 
                    color: '#fff', 
                    px: 4, 
                    py: 1.5, 
                    borderRadius: '16px',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    boxShadow: '0 8px 24px rgba(211, 47, 47, 0.25)',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      bgcolor: '#B71C1C',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 28px rgba(211, 47, 47, 0.35)'
                    } 
                  }}
                  startIcon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8, marginRight: -8 }}>
                      <polyline points="1 4 1 10 7 10"></polyline>
                      <polyline points="23 20 23 14 17 14"></polyline>
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                    </svg>
                  }
                >
                  إعادة المحاولة
                </Button>
              </Box>
            </Box>
          </Container>
        ) : categories.length === 0 ? (
          <Container maxWidth="lg">
            <Box sx={{ my: 10, textAlign: 'center', p: 4 }}>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 800 }}>
                لا توجد أعمال في الكتالوج حالياً.
              </Typography>
            </Box>
          </Container>
        ) : (
          <>
            <Container maxWidth="lg" sx={{ pt: 1, pb: 0, px: { xs: 1, sm: 2, md: 2 } }}>
              {/* Hero Slideshow OR Featured Works fallback */}
              {heroSlides.length > 0 ? (
                <Box sx={{ mt: 1, mb: 0 }}>
                  <HeroSlideshow slides={heroSlides} />
                </Box>
              ) : featuredWorks.length > 0 ? (
                <Box id="best-sellers-section-top" className="scrollspy-section" sx={{ pt: 2, pb: 2 }}>
                  <ScrollReveal delay={0.1}>
                    <FeaturedWorksRow items={featuredWorks} whatsappNumber={settings?.whatsapp} />
                  </ScrollReveal>
                </Box>
              ) : null}
            </Container>

            {/* Grid Categories Section */}
            <CategoryGrid categories={categories.filter(c => !c.isStandalonePiece)} />

            <Container maxWidth="lg" sx={{ pt: 2, pb: 2, px: { xs: 1, sm: 2, md: 2 } }}>
              
              {/* Bundles Section */}
              {bundles.length > 0 && (
                <ScrollReveal delay={0.1}>
                  <BundlesRow bundles={bundles} />
                </ScrollReveal>
              )}
            </Container>

            {/* Standalone Pieces Section - Full Width */}
            <Box id="standalone-pieces-section" sx={{ width: '100%' }}>
              <StandalonePiecesSection categories={categories} />
            </Box>

            <Container maxWidth="lg" sx={{ pt: 2, pb: 2, px: { xs: 1, sm: 2, md: 2 } }}>
              {/* Featured Works (Deduplicated) - Renders here ONLY if Hero Slides exist */}
              {heroSlides.length > 0 && featuredWorks.length > 0 && (
                <Box id="best-sellers-section" className="scrollspy-section" sx={{ pt: 2 }}>
                  <ScrollReveal delay={0.1}>
                    <FeaturedWorksRow items={featuredWorks} whatsappNumber={settings?.whatsapp} />
                  </ScrollReveal>
                </Box>
              )}

            <Box component="main">
              {categories.filter(c => !c.isStandalonePiece).map((category, index) => (
                <ScrollReveal key={category._id} delay={0.1 + (index % 3) * 0.1}>
                  <CategorySection
                    id={`category-${category._id}`}
                    name={category.name}
                    slug={category.slug}
                    image={category.image}
                    items={category.items.slice(0, 8)}
                    whatsappNumber={settings?.whatsapp}
                    hidePrices={category.hidePrices}
                  />
                </ScrollReveal>
              ))}
            </Box>
            </Container>
          </>
        )}

        <AboutContact 
          address={settings?.address} 
          phone={settings?.phone} 
          whatsapp={settings?.whatsapp} 
          mapUrl={settings?.mapUrl}
          aboutUsText={settings?.aboutUsText}
        />
        <Footer 
          facebookUrl={settings?.facebookUrl}
          instagramUrl={settings?.instagramUrl}
          tiktokUrl={settings?.tiktokUrl}
          whatsapp={settings?.whatsapp}
        />
        <HomeFloatingWhatsApp whatsappNumber={settings?.whatsapp} />
        <BackToTop />
      </Box>
    </Box>
  );
}
