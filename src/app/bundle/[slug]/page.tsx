import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { Box, Container } from '@mui/material';
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

      <Footer 
        facebookUrl={settings?.facebookUrl}
        instagramUrl={settings?.instagramUrl}
        tiktokUrl={settings?.tiktokUrl}
        whatsapp={settings?.whatsapp}
      />
    </Box>
  );
}
