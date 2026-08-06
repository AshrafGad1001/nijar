'use client';

import React from 'react';
import { Box, Typography, Container, Card, CardActionArea, CardMedia, CardContent, useTheme } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

interface CatalogCategory {
  _id: string;
  name: string;
  image: { url: string; publicId: string };
  displayOrder: number;
}

interface CategoryGridProps {
  categories: CatalogCategory[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const theme = useTheme();

  const handleCategoryClick = (categoryId: string) => {
    const section = document.getElementById(`category-${categoryId}`);
    if (section) {
      const yOffset = -80; // Adjust for navbar height
      const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#F9FAFB' }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, dir: 'rtl' }}>
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

        {/* Grid Section */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: { xs: 3, md: 4 },
            dir: 'rtl'
          }}
        >
          {categories.map((category) => (
            <Card 
              key={category._id}
              elevation={0}
              onClick={() => handleCategoryClick(category._id)}
              sx={{ 
                width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 32px)', lg: 'calc(25% - 32px)' },
                borderRadius: '24px',
                overflow: 'hidden',
                bgcolor: '#ffffff',
                border: '1px solid rgba(27, 58, 75, 0.05)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-12px)',
                  boxShadow: '0 24px 48px -12px rgba(27, 58, 75, 0.15)',
                  borderColor: 'rgba(46, 139, 154, 0.2)',
                  '& .cat-image': {
                    transform: 'scale(1.08)'
                  },
                  '& .btn-arrow': {
                    transform: 'translateX(-4px)'
                  }
                }
              }}
            >
              <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }} disableRipple>
                <Box sx={{ overflow: 'hidden', position: 'relative', pt: '75%' }}>
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
                      transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                  {/* Subtle gradient overlay */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '40%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 100%)',
                    pointerEvents: 'none'
                  }} />
                </Box>
                
                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  p: { xs: 3, md: 4 },
                  pt: { xs: 4, md: 5 } // Extra padding top since we removed the circle icon
                }}>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    sx={{ 
                      color: '#1B3A4B', 
                      fontWeight: 800, 
                      mb: 2,
                      textAlign: 'center',
                      fontSize: { xs: '1.25rem', md: '1.4rem' }
                    }}
                  >
                    {category.name}
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 0.5,
                      px: 2.5,
                      py: 0.75,
                      borderRadius: '100px',
                      border: '1px solid rgba(27, 58, 75, 0.1)',
                      color: '#5A6B72',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: '#2E8B9A',
                        color: '#ffffff',
                        borderColor: '#2E8B9A'
                      }
                    }}
                  >
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
                      عرض افضل القطع
                    </Typography>
                    <KeyboardArrowLeftIcon className="btn-arrow" sx={{ fontSize: '1.1rem', transition: 'transform 0.3s ease' }} />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
