'use client';

import React, { useState } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
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

interface CatalogCategory {
  _id: string;
  name: string;
  slug?: string;
  image: { url: string; publicId: string };
  displayOrder: number;
  isStandalonePiece?: boolean;
  items: WorkItem[];
}

interface StandalonePiecesSectionProps {
  categories: CatalogCategory[];
}

export default function StandalonePiecesSection({ categories }: StandalonePiecesSectionProps) {
  // Filter only categories marked as standalone pieces
  const standaloneCategories = categories.filter(c => c.isStandalonePiece);

  // If no standalone categories, don't render the section
  if (standaloneCategories.length === 0) return null;

  // State for active tab
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Get items for currently selected category
  const activeCategory = standaloneCategories[activeTab];
  const items = activeCategory ? activeCategory.items : [];

  return (
    <Box 
      className="scrollspy-section" 
      sx={{ 
        mb: 6, 
        pt: { xs: 5, md: 6 }, 
        pb: { xs: 5, md: 6 }, 
        bgcolor: '#0B131E', // Very dark rich blue/black
        background: 'linear-gradient(145deg, #09101A 0%, #111D2B 100%)',
        borderRadius: 0, 
        px: { xs: 2, md: 4 },
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
      }}
    >
      {/* Decorative luxury elements - Platinum/Silver instead of Gold */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, rgba(226, 232, 240, 0.6), transparent)' }} />
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(226, 232, 240, 0.15), transparent)' }} />
      
      {/* Background Subtle glow */}
      <Box sx={{ position: 'absolute', top: '20%', left: '30%', width: '30vw', height: '30vw', bgcolor: 'rgba(255, 255, 255, 0.02)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            fontWeight: 900, 
            color: '#FFFFFF', 
            fontSize: { xs: '1.8rem', md: '2.5rem' }, 
            letterSpacing: '-0.5px',
            m: 0,
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
        >
          قطع تكمّل <Box component="span" sx={{ color: '#94A3B8' }}>بيتك</Box>
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2 }}>
          <Box sx={{ width: 4, height: 4, border: '1px solid rgba(255,255,255,0.4)', transform: 'rotate(45deg)' }} />
          <Box sx={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
          <Box sx={{ width: 4, height: 4, border: '1px solid rgba(255,255,255,0.4)', transform: 'rotate(45deg)' }} />
        </Box>
      </Box>

      {/* Tabs */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'center', 
          alignItems: 'center',
          gap: 1,
          mb: 5, 
          position: 'relative', 
          zIndex: 1,
          p: 0.75,
          bgcolor: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          maxWidth: 'fit-content',
          mx: 'auto'
        }}
      >
        {standaloneCategories.map((cat, index) => {
          const isActive = activeTab === index;
          return (
            <Box
              key={cat._id}
              onClick={(e) => handleTabChange(e, index)}
              sx={{
                position: 'relative',
                cursor: 'pointer',
                fontWeight: 700, 
                fontSize: { xs: '0.85rem', sm: '1rem' },
                color: isActive ? '#09101A' : 'rgba(255, 255, 255, 0.6)',
                px: { xs: 2.5, sm: 3.5 },
                py: { xs: 0.8, sm: 1 },
                userSelect: 'none',
                transition: 'color 0.3s ease',
                zIndex: 1,
                '&:hover': {
                  color: isActive ? '#09101A' : '#FFFFFF',
                }
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="standalone-tabs-pill"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '100px',
                    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)',
                    zIndex: -1
                  }}
                />
              )}
              <Box component="span" sx={{ position: 'relative', zIndex: 1 }}>
                {cat.name}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Grid of Items */}
      {items.length > 0 ? (
        <Grid container spacing={3} sx={{ justifyContent: 'center', position: 'relative', zIndex: 2 }}>
          {items.map(item => (
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
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
            لا توجد منتجات متاحة في هذا القسم حالياً.
          </Typography>
        </Box>
        )}
      </Container>
    </Box>
  );
}
