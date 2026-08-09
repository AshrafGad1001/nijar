'use client';

import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
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
}

export default function CategorySection({ id, name, slug, items, whatsappNumber }: CategorySectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <Box id={id} className="scrollspy-section" sx={{ mb: 6, pt: 4, mt: -4 }}>
      <Box sx={{ mb: 5, mt: 2, px: { xs: 2, md: 3 } }}>
        <Typography 
          variant="overline" 
          sx={{ 
            color: '#8BA3A6', 
            fontWeight: 700, 
            letterSpacing: '2px', 
            display: 'block',
            mb: 0.5,
            fontSize: '0.85rem'
          }}
        >
          تشكيلة حصرية
        </Typography>
        
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
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Box sx={{ width: 48, height: 4, background: 'linear-gradient(90deg, #C59B5F, #E8D099)', borderRadius: 2 }} />
          <Box sx={{ width: 8, height: 4, bgcolor: '#C59B5F', borderRadius: 2, opacity: 0.6 }} />
          <Box sx={{ width: 4, height: 4, bgcolor: '#C59B5F', borderRadius: '50%', opacity: 0.4 }} />
        </Box>
      </Box>
      <Grid container spacing={3}>
        {items.map(item => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id}>
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
      
      {slug && items.length === 8 && (
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
              borderColor: '#C59B5F',
              color: '#C59B5F',
              fontWeight: 700,
              '&:hover': {
                bgcolor: 'rgba(197, 155, 95, 0.08)',
                borderColor: '#C59B5F',
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
