'use client';

import React from 'react';
import { Box, Typography, Container, Card, CardActionArea, CardMedia, CardContent, useTheme } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Link from 'next/link';

interface CatalogCategory {
  _id: string;
  name: string;
  slug?: string;
  image: { url: string; publicId: string };
  displayOrder: number;
}

interface CategoryGridProps {
  categories: CatalogCategory[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const theme = useTheme();

  return (
    <Box sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 4, md: 6 }, bgcolor: '#F9FAFB' }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 }, dir: 'rtl' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
            <Box component="span" sx={{ width: 40, height: '1px', bgcolor: '#D97706', opacity: 0.6 }} />
            <Box sx={{ 
              width: 8, 
              height: 8, 
              transform: 'rotate(45deg)', 
              border: '1px solid #D97706',
              bgcolor: 'transparent'
            }} />
            <Box component="span" sx={{ width: 40, height: '1px', bgcolor: '#D97706', opacity: 0.6 }} />
          </Box>

          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 900, 
              color: '#1B3A4B', 
              mb: 2,
              fontSize: { xs: '2rem', md: '2.75rem' },
              letterSpacing: '-0.5px'
            }}
          >
            أثاث من الخشب الطبيعي
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#5A6B72',
              maxWidth: '800px',
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.15rem' },
              lineHeight: 1.8,
              fontWeight: 500
            }}
          >
            اكتشف مجموعتنا المختارة بعناية من الأثاث المصنوع من أجود أنواع الخشب الطبيعي.
          </Typography>
        </Box>

        {/* Premium Grid Section */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: 'repeat(2, 1fr)', // 2 columns even on mobile for smaller size
              sm: `repeat(${Math.min(categories.length, 3)}, 1fr)`, 
              md: `repeat(${Math.min(categories.length, 4)}, 1fr)`, 
              lg: `repeat(${Math.min(categories.length, 5)}, 1fr)` // max 5 columns
            }, 
            gap: { xs: 2, md: 3 },
            dir: 'rtl',
            maxWidth: { 
              sm: categories.length < 3 ? `${categories.length * 300}px` : '100%',
              md: categories.length < 4 ? `${categories.length * 280}px` : '100%',
              lg: categories.length < 5 ? `${categories.length * 260}px` : '100%'
            },
            mx: 'auto',
            justifyContent: 'center'
          }}
        >
          {categories.map((category) => (
            <Link key={category._id} href={`/category/${category.slug || category._id}`} passHref style={{ textDecoration: 'none' }}>
              <Card 
                elevation={0}
                sx={{ 
                position: 'relative',
                borderRadius: { xs: '24px', md: '32px' },
                overflow: 'hidden',
                bgcolor: '#0F172A',
                cursor: 'pointer',
                aspectRatio: '4/5', // Slightly less tall than 3/4
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0, left: '-150%',
                  width: '100%', height: '100%',
                  background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 100%)',
                  transform: 'skewX(-25deg)',
                  zIndex: 3,
                  transition: 'none',
                  pointerEvents: 'none'
                },
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 24px 64px rgba(15, 23, 42, 0.08), 0 0 20px rgba(212, 175, 55, 0.15) inset',
                  borderColor: 'rgba(212, 175, 55, 0.6)',
                  '&::before': {
                    left: '200%',
                    transition: 'left 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  },
                  '& .cat-image': {
                    transform: 'scale(1.15)'
                  },
                  '& .cat-glass': {
                    bgcolor: 'rgba(15,23,42,0.6)',
                    backdropFilter: 'blur(16px)',
                    transform: 'translateY(0)',
                    pb: { xs: 2.5, md: 3 },
                    borderTop: '1px solid rgba(212, 175, 55, 0.3)'
                  },
                  '& .cat-action': {
                    opacity: 1,
                    maxHeight: '40px',
                    mt: 1.5,
                    color: '#D4AF37'
                  }
                }
              }}
            >
              <CardActionArea sx={{ height: '100%', width: '100%' }} disableRipple>
                {/* Background Image */}
                <CardMedia
                  className="cat-image"
                  image={category.image?.url || '/placeholder.jpg'}
                  title={category.name}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
                
                {/* Subtle Global Overlay to ensure contrast */}
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0) 100%)',
                    zIndex: 1
                  }} 
                />

                {/* Content Overlay (Glassmorphism on Hover) */}
                <Box className="cat-glass" sx={{ 
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  p: { xs: 1.5, md: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  textAlign: 'center',
                  zIndex: 2,
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  bgcolor: 'rgba(15,23,42,0)',
                  backdropFilter: 'blur(0px)',
                  borderTop: '1px solid rgba(255,255,255,0)',
                  transform: 'translateY(8px)'
                }}>
                  <Typography 
                    variant="h4" 
                    component="h3" 
                    sx={{ 
                      color: '#ffffff', 
                      fontWeight: 800, 
                      textShadow: '0 2px 10px rgba(0,0,0,0.4)',
                      fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem' },
                      letterSpacing: '-0.3px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {category.name}
                  </Typography>
                  
                  {/* Action Link (Expands on hover) */}
                  <Box 
                    className="cat-action"
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      color: 'rgba(255,255,255,0.9)',
                      opacity: 0,
                      maxHeight: '0px',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      تصفح
                    </Typography>
                    <KeyboardArrowLeftIcon sx={{ fontSize: '1rem' }} />
                  </Box>
                  </Box>
                </CardActionArea>
              </Card>
            </Link>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
