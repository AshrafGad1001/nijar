'use client';

import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WorkCard from './WorkCard';

interface WorkItem {
  _id: string;
  name: string;
  productCode?: string;
  description: string;
  components?: string[];
  price: number | null;
  discountPercentage?: number;
  hasSizes?: boolean;
  sizes?: { name: string; price: number }[];
  image?: { url: string; publicId: string };
  gallery?: { url: string; publicId: string }[];
  slug?: string;
}

interface CategorySectionProps {
  id: string;
  name: string;
  slug?: string;
  image?: { url: string; publicId: string };
  items: WorkItem[];
  whatsappNumber?: string;
  hidePrices?: boolean;
}

export default function CategorySection({ id, name, slug, items, whatsappNumber, hidePrices }: CategorySectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <Box id={id} className="scrollspy-section" sx={{ mb: 6, pt: 4, mt: -4 }}>
      <Box sx={{ mb: 5, mt: 2, px: { xs: 2, md: 3 }, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            fontWeight: 900, 
            color: '#0F172A', 
            fontSize: { xs: '2rem', md: '2.5rem' }, 
            letterSpacing: '-0.5px',
            m: 0 
          }}
        >
          {name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2 }}>
          <Box sx={{ width: 4, height: 4, border: '1px solid rgba(15, 23, 42, 0.2)', transform: 'rotate(45deg)' }} />
          <Box sx={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, rgba(15, 23, 42, 0.2), transparent)' }} />
          <Box sx={{ width: 4, height: 4, border: '1px solid rgba(15, 23, 42, 0.2)', transform: 'rotate(45deg)' }} />
        </Box>
      </Box>
      <Grid container spacing={3}>
        {items.map(item => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id} sx={{ display: 'flex' }}>
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
              hidePrice={hidePrices}
            />
          </Grid>
        ))}
      {items.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '32px',
          border: '1px dashed rgba(15, 23, 42, 0.1)'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', opacity: 0.5 }}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="15"></line>
            <line x1="15" y1="9" x2="9" y2="15"></line>
          </svg>
          <Typography variant="h6" color="#0F172A" sx={{ fontWeight: 800, mb: 1 }}>
            لا توجد منتجات متاحة
          </Typography>
          <Typography variant="body2" color="#64748B" sx={{ fontWeight: 600 }}>
            نعمل على إضافة منتجات جديدة لقسم {name} قريباً.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item._id} sx={{ display: 'flex' }}>
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
                hidePrice={hidePrices}
              />
            </Grid>
          ))}
        </Grid>
      )}
      
      {slug && items.length >= 8 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button 
            component={Link} 
            href={`/category/${slug}`} 
            variant="outlined" 
            endIcon={<ArrowForwardIcon sx={{ transform: 'rotate(180deg)' }} />}
            sx={{ 
              borderRadius: 8, 
              px: 4, 
              py: 1.5,
              borderColor: '#0F172A',
              color: '#0F172A',
              fontWeight: 700,
              '&:hover': {
                bgcolor: 'rgba(15, 23, 42, 0.04)',
                borderColor: '#0F172A',
              }
            }}
          >
            عرض جميع منتجات {name}
          </Button>
        </Box>
      )}
    </Box>
  );
}
