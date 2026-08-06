import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { Box, Container, Typography } from '@mui/material';
import CatalogNavbar from '@/components/public/CatalogNavbar';
import Footer from '@/components/public/Footer';
import ProductClientView from './ProductClientView';
import { notFound } from 'next/navigation';
import Head from 'next/head';

interface Props {
  params: Promise<{ slug: string }>;
}

// Ensure SSR/ISR caching correctly
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api/v1';
if (typeof window === 'undefined') {
  API_URL = API_URL.replace('localhost', '127.0.0.1');
}

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${API_URL}/catalog/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch product');
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
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

// Generate Dynamic Metadata for SEO
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'المنتج غير موجود - النجار',
      description: 'هذا المنتج غير موجود أو تم حذفه.',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const imageUrl = product.image?.url || '';

  return {
    title: `${product.name} | النجار`,
    description: product.description || `اشتري ${product.name} بأفضل سعر من النجار.`,
    openGraph: {
      title: `${product.name} | النجار`,
      description: product.description || `اشتري ${product.name} بأفضل سعر من النجار.`,
      images: imageUrl ? [imageUrl, ...previousImages] : previousImages,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || `اشتري ${product.name} بأفضل سعر من النجار.`,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  
  // Fetch product and settings in parallel
  const [product, settings] = await Promise.all([
    getProduct(slug),
    getSettings()
  ]);

  if (!product) {
    notFound(); // Triggers not-found.tsx
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F9FAFB' }}>
      <CatalogNavbar />
      
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <ProductClientView 
            item={product} 
            whatsappNumber={settings?.whatsapp || ''} 
          />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
