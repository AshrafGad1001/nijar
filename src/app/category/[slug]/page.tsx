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

      {/* Hero Header */}
      <Box sx={{ 
        position: 'relative', 
        bgcolor: '#0F172A',
        color: '#FFFFFF',
        pt: { xs: 5, md: 7 },
        pb: { xs: 5, md: 7 },
        mx: { xs: 2, md: 4 },
        mt: 2,
        borderRadius: '24px',
        overflow: 'hidden',
        textAlign: 'center',
        backgroundImage: category.image?.url ? `linear-gradient(to bottom, rgba(15,23,42,0.4), rgba(15,23,42,0.7)), url(${category.image.url})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" sx={{ 
            fontWeight: 900, 
            mb: 2, 
            fontSize: { xs: '3rem', md: '4rem' },
            color: '#FFFFFF',
            filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.7))',
          }}>
            {category.name}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 4 }}>
            <Box sx={{ width: 40, height: 3, bgcolor: '#3AD671', borderRadius: 2 }} />
            <Box sx={{ width: 8, height: 3, bgcolor: '#3AD671', borderRadius: 2 }} />
          </Box>

          <Link href="/catalog" passHref style={{ textDecoration: 'none' }}>
            <Button 
              startIcon={<ArrowForwardIcon />}
              variant="outlined"
              sx={{ 
                color: '#FFFFFF', 
                borderColor: 'rgba(255,255,255,0.3)',
                borderRadius: '30px',
                px: 3,
                py: 1,
                bgcolor: 'rgba(0,0,0,0.2)',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  bgcolor: '#3AD671',
                  borderColor: '#3AD671',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              العودة للكتالوج
            </Button>
          </Link>
        </Container>
      </Box>

      <Box sx={{ flexGrow: 1, py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
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
