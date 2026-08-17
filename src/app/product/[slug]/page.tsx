import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { Box, Container, Typography } from '@mui/material';
import CatalogNavbar from '@/components/public/CatalogNavbar';
import Footer from '@/components/public/Footer';
import ProductClientView from './ProductClientView';
import FeaturedWorksRow from '@/components/public/FeaturedWorksRow';
import { notFound } from 'next/navigation';
import Head from 'next/head';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import BackToTop from '@/components/public/BackToTop';
import ScrollReveal from '@/components/public/ScrollReveal';

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
      cache: 'force-cache',
      next: { tags: ['catalog'] }
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

async function getRelatedProducts(categoryId: string | undefined, currentProductId: string) {
  if (!categoryId) return [];
  
  try {
    const res = await fetch(`${API_URL}/categories/${categoryId}/products`, {
      cache: 'force-cache',
      next: { tags: ['catalog'] }
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    if (!data.success || !data.data) return [];
    
    // Filter out the current product and return items
    return data.data.filter((item: any) => item._id !== currentProductId);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

async function getSettings() {
  try {
    const res = await fetch(`${API_URL}/settings`, {
      cache: 'force-cache',
      next: { tags: ['settings'] }
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

  // Fetch related products using category ID
  const relatedProducts = await getRelatedProducts(product.category?._id, product._id);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F9FAFB' }}>
      {/* Master Sticky Header */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: '#F9FAFB', width: '100%' }}>
        <CatalogNavbar adminName={settings?.adminName} phone={settings?.phone || settings?.whatsapp} />
      </Box>
      
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Breadcrumbs 
            items={[
              { label: 'الكتالوج', href: '/catalog' },
              ...(product.category ? [{ label: product.category.name, href: `/category/${product.category.slug}` }] : []),
              { label: product.name }
            ]} 
          />
          
          <ProductClientView 
            item={product} 
            whatsappNumber={settings?.whatsapp || ''} 
          />
          
          {/* Related Products Section */}
          {relatedProducts.length >= 2 && (
            <Box sx={{ mt: { xs: 6, md: 10 } }}>
              <ScrollReveal delay={0.2}>
                <FeaturedWorksRow 
                  items={relatedProducts} 
                  whatsappNumber={settings?.whatsapp} 
                  title="منتجات قد تعجبك" 
                  subtitle={`استكشف المزيد من ${product.category?.name || 'هذا القسم'}`}
                  hidePrices={product.category?.hidePrices}
                />
              </ScrollReveal>
            </Box>
          )}
        </Container>
      </Box>

      <Footer 
        facebookUrl={settings?.facebookUrl}
        instagramUrl={settings?.instagramUrl}
        tiktokUrl={settings?.tiktokUrl}
        whatsapp={settings?.whatsapp}
      />
      <BackToTop />
    </Box>
  );
}
