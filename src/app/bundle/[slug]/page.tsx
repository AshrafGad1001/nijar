import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { Box, Container, Typography, Grid } from '@mui/material';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import CatalogNavbar from '@/components/public/CatalogNavbar';
import Footer from '@/components/public/Footer';
import BundleClientView from './BundleClientView';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 60;

let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api/v1';
if (typeof window === 'undefined') {
  API_URL = API_URL.replace('localhost', '127.0.0.1');
}

async function getBundle(slug: string) {
  try {
    const res = await fetch(`${API_URL}/catalog/bundles/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch bundle');
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching bundle:', error);
    return null;
  }
}

async function getSettings() {
  try {
    const res = await fetch(`${API_URL}/settings`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    const data = await res.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getBundle(slug);

  if (!bundle) {
    return {
      title: 'الباكدج غير موجود - النجار',
      description: 'هذا الباكدج غير موجود أو تم حذفه.',
    };
  }

  // Use the image of the first product as the main meta image since we don't have a single bundle cover
  const imageUrl = bundle.products?.[0]?.image?.url || '';

  return {
    title: `${bundle.name} | النجار`,
    description: bundle.description || `استفد من خصم ${bundle.discountPercentage}% على ${bundle.name} من النجار.`,
    openGraph: {
      title: `وفر ${bundle.discountPercentage}% على ${bundle.name} | النجار`,
      description: bundle.description || `استفد من خصم ${bundle.discountPercentage}% على ${bundle.name} من النجار.`,
      images: imageUrl ? [imageUrl] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: bundle.name,
      description: bundle.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function BundlePage({ params }: Props) {
  const { slug } = await params;
  
  const [bundle, settings] = await Promise.all([
    getBundle(slug),
    getSettings()
  ]);

  if (!bundle) {
    notFound(); 
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F9FAFB' }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: '#F9FAFB', width: '100%' }}>
        <CatalogNavbar />
      </Box>
      
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <BundleClientView 
            bundle={bundle} 
            whatsappNumber={settings?.whatsapp || ''} 
          />
        </Container>
      </Box>

      {/* Trust & Features Section 
      <Box sx={{ bgcolor: '#ffffff', py: { xs: 6, md: 8 }, borderTop: '1px solid rgba(15, 23, 42, 0.05)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
                <Box sx={{ width: 72, height: 72, borderRadius: '20px', bgcolor: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(45deg)', mb: 1, boxShadow: '0 10px 25px rgba(212, 175, 55, 0.15)' }}>
                  <WorkspacePremiumOutlinedIcon sx={{ fontSize: 32, color: '#D4AF37', transform: 'rotate(-45deg)' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 900, mb: 1 }}>جودة فائقة</Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, lineHeight: 1.7 }}>
                    نستخدم أفضل أنواع الأخشاب والإكسسوارات لضمان المتانة والعمر الطويل.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
                <Box sx={{ width: 72, height: 72, borderRadius: '20px', bgcolor: 'rgba(5, 150, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(45deg)', mb: 1, boxShadow: '0 10px 25px rgba(5, 150, 105, 0.15)' }}>
                  <VerifiedUserOutlinedIcon sx={{ fontSize: 32, color: '#059669', transform: 'rotate(-45deg)' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 900, mb: 1 }}>ضمان 10 سنوات</Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, lineHeight: 1.7 }}>
                    ضمان حقيقي على جميع منتجاتنا يضمن لك راحة البال بعد الشراء.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
                <Box sx={{ width: 72, height: 72, borderRadius: '20px', bgcolor: 'rgba(27, 58, 75, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(45deg)', mb: 1, boxShadow: '0 10px 25px rgba(27, 58, 75, 0.15)' }}>
                  <LocalShippingOutlinedIcon sx={{ fontSize: 32, color: '#1B3A4B', transform: 'rotate(-45deg)' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 900, mb: 1 }}>شحن وتركيب</Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, lineHeight: 1.7 }}>
                    خدمة شحن وتوصيل وتركيب آمنة وموثوقة لجميع المحافظات.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
                <Box sx={{ width: 72, height: 72, borderRadius: '20px', bgcolor: 'rgba(225, 29, 72, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(45deg)', mb: 1, boxShadow: '0 10px 25px rgba(225, 29, 72, 0.15)' }}>
                  <SupportAgentOutlinedIcon sx={{ fontSize: 32, color: '#E11D48', transform: 'rotate(-45deg)' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 900, mb: 1 }}>خدمة عملاء</Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, lineHeight: 1.7 }}>
                    فريق متخصص للرد على استفساراتكم ومتابعة طلباتكم بكل اهتمام.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      */}

      <Footer 
        facebookUrl={settings?.facebookUrl}
        instagramUrl={settings?.instagramUrl}
        tiktokUrl={settings?.tiktokUrl}
        whatsapp={settings?.whatsapp}
      />
    </Box>
  );
}
