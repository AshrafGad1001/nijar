import React from 'react';
import { Box, Container, Typography, Grid, Button } from '@mui/material';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WorkCard from '@/components/public/WorkCard';
import CatalogNavbar from '@/components/public/CatalogNavbar';
import Footer from '@/components/public/Footer';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { Metadata } from 'next';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function getCategoryData(slug: string) {
  try {
    const res = await fetch(`${apiUrl}/categories/${slug}/products`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch category products');
    }
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error fetching category data:', error);
    return null;
  }
}

async function getSettings() {
  try {
    const res = await fetch(`${apiUrl}/settings`, { next: { tags: ['settings'] } });
    if (!res.ok) return { data: null };
    return await res.json();
  } catch (error) {
    return { data: null };
  }
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getCategoryData(resolvedParams.slug);
  
  if (!data || !data.category) {
    return {
      title: 'قسم غير موجود - النجار',
      description: 'هذا القسم غير موجود',
    };
  }

  return {
    title: `${data.category.name} | أثاث النجار`,
    description: `تصفح أحدث منتجات ${data.category.name} من أثاث النجار. تصاميم عصرية بجودة عالية.`,
    openGraph: {
      title: `${data.category.name} | أثاث النجار`,
      description: `تصفح أحدث منتجات ${data.category.name} من أثاث النجار.`,
      images: data.category.image?.url ? [data.category.image.url] : [],
    }
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const [data, settingsRes] = await Promise.all([
    getCategoryData(resolvedParams.slug),
    getSettings()
  ]);

  if (!data || !data.category) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CatalogNavbar />
        <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', my: 10 }}>
          <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 700 }}>
            عذراً، القسم المطلوب غير موجود
          </Typography>
          <Link href="/catalog" passHref style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ mt: 4, borderRadius: 2 }}>
              العودة للكتالوج
            </Button>
          </Link>
        </Container>
        <Footer 
          facebookUrl={settingsRes.data?.facebookUrl}
          instagramUrl={settingsRes.data?.instagramUrl}
          tiktokUrl={settingsRes.data?.tiktokUrl}
          whatsapp={settingsRes.data?.whatsapp}
        />
      </Box>
    );
  }

  const { category, data: products } = data;
  const settings = settingsRes.data;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1100, width: '100%' }}>
        <CatalogNavbar />
      </Box>

      {/* Hero Header - Sleek Compact Design */}
      <Box sx={{ 
        position: 'relative', 
        bgcolor: '#0F172A',
        color: '#FFFFFF',
        pt: { xs: 4, md: 5 },
        pb: { xs: 4, md: 5 },
        mx: { xs: 2, md: 4 },
        mt: 2,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: category.image?.url ? `url(${category.image.url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(90deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 100%)',
          zIndex: 1,
        }
      }}>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 3
          }}>
            {/* Title Section */}
            <Box>
              <Typography variant="h2" sx={{ 
                fontWeight: 900, 
                mb: 1.5, 
                fontSize: { xs: '2rem', md: '3rem' },
                color: '#FFFFFF',
                textShadow: '0px 2px 8px rgba(0,0,0,0.5)',
                lineHeight: 1.2
              }}>
                {category.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 40, height: 4, bgcolor: '#3AD671', borderRadius: 2 }} />
                <Box sx={{ width: 12, height: 4, bgcolor: '#3AD671', borderRadius: 2 }} />
              </Box>
            </Box>

            {/* Action Section */}
            <Link href="/catalog" passHref style={{ textDecoration: 'none' }}>
              <Button 
                startIcon={<ArrowForwardIcon />}
                variant="outlined"
                sx={{ 
                  color: '#FFFFFF',
                  borderColor: 'rgba(255,255,255,0.4)',
                  borderRadius: '30px',
                  px: 4,
                  py: 1,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  backdropFilter: 'blur(8px)',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    bgcolor: '#3AD671',
                    borderColor: '#3AD671',
                    color: '#FFFFFF',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                العودة للكتالوج
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      <Box sx={{ flexGrow: 1, pt: { xs: 4, md: 5 }, pb: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          
          {/* 3D Isometric Cube Divider */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 5, md: 7 }, opacity: 0.9 }}>
            <svg width="100%" height="24" viewBox="0 0 300 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '350px' }}>
              {/* Fading Lines */}
              <path d="M0 12H133" stroke="url(#lineGrad1)" strokeWidth="1.5" />
              <path d="M167 12H300" stroke="url(#lineGrad2)" strokeWidth="1.5" />
              
              {/* 3D Isometric Cube */}
              <g transform="translate(0, 0)">
                {/* Top Face (Highlight) */}
                <path d="M150 2 L159 7 L150 12 L141 7 Z" fill="#E8D099" />
                {/* Right Face (Base Gold) */}
                <path d="M150 12 L159 7 L159 17 L150 22 Z" fill="#C59B5F" />
                {/* Left Face (Brand Green) */}
                <path d="M141 7 L150 12 L150 22 L141 17 Z" fill="#3AD671" />
              </g>

              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="lineGrad1" x1="0" y1="12" x2="133" y2="12" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#C59B5F" stopOpacity="0" />
                  <stop offset="100%" stopColor="#C59B5F" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="lineGrad2" x1="167" y1="12" x2="300" y2="12" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#C59B5F" stopOpacity="1" />
                  <stop offset="100%" stopColor="#C59B5F" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </Box>
          {!products || products.length === 0 ? (
            // Empty State
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              textAlign: 'center',
              py: 10,
              bgcolor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px dashed rgba(15,23,42,0.1)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
            }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                bgcolor: '#F1F5F9', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 3
              }}>
                <InboxOutlinedIcon sx={{ fontSize: 40, color: '#94A3B8' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
                لا توجد منتجات حالياً
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748B', maxWidth: 400 }}>
                لم يتم إضافة أي منتجات إلى قسم "{category.name}" بعد. يرجى التحقق لاحقاً.
              </Typography>
            </Box>
          ) : (
            // Products Grid
            <Grid container spacing={3} sx={{ dir: 'rtl' }}>
              {products.map((item: any) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item._id}>
                  <WorkCard 
                    name={item.name}
                    productCode={item.productCode}
                    description={item.description}
                    components={item.components}
                    price={item.price}
                    discountPercentage={item.discountPercentage}
                    hasSizes={item.hasSizes}
                    sizes={item.sizes}
                    image={item.image}
                    gallery={item.gallery}
                    href={`/product/${item.slug || item._id}`}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <Footer 
        facebookUrl={settings?.facebookUrl}
        instagramUrl={settings?.instagramUrl}
        tiktokUrl={settings?.tiktokUrl}
        whatsapp={settings?.whatsapp}
      />
    </Box>
  );
}
