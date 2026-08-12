'use client';

import React from 'react';
import { Box, Typography, Button, IconButton, alpha } from '@mui/material';
import Link from 'next/link';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface Bundle {
  _id: string;
  name: string;
  description: string;
  discountPercentage: number;
  slug: string;
  products: any[];
}

interface BundlesRowProps {
  bundles: Bundle[];
}

export default function BundlesRow({ bundles }: BundlesRowProps) {
  if (!bundles || bundles.length === 0) return null;

  return (
    <Box sx={{ mb: 6, position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ 
            bgcolor: 'error.main', 
            color: 'white', 
            p: 1.2, 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
            background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)'
          }}>
            <LocalOfferOutlinedIcon sx={{ fontSize: '1.8rem' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 900, 
              color: '#1E293B', 
              letterSpacing: '-1px',
              display: 'inline-block',
              fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.125rem' }
            }}>
              باكدجات حصرية بخصومات مميزة
              <Box component="span" sx={{ color: '#e53935', ml: 0.5 }}>.</Box>
            </Typography>
          </Box>
        </Box>
      </Box>      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
          gap: { xs: 3, md: 4 }, 
          pt: 2,
          mt: -2,
        }}
      >
        {bundles.map((bundle, index) => {
          // Calculate max 5 images for the "playing card" effect dynamically fanning out
          const displayProducts = bundle.products.slice(0, 5);
          
          // Calculate Prices
          const originalPrice = bundle.products.reduce((acc, p) => {
            if (p.sizes && p.sizes.length > 0) return acc + (p.sizes[0].price || 0);
            return acc + (p.price || 0);
          }, 0);
          const finalPrice = originalPrice - (originalPrice * (bundle.discountPercentage / 100));

          return (
            <ScrollReveal key={bundle._id} delay={index * 0.15} direction="up" distance={60} sx={{ height: '100%', display: 'flex' }}>
              <Box 
                component={Link}
                href={`/bundle/${bundle.slug}`}
              sx={{
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                borderRadius: '24px',
                bgcolor: '#ffffff',
                border: '1px solid rgba(212, 175, 55, 0.5)', // Sharp 1px Gold border
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12), 0 4px 15px rgba(0,0,0,0.06)', // Deep luxury DropShadow
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.5s cubic-bezier(0.2, 0, 0, 1)',
                '&:hover': {
                  transform: 'translateY(-12px)',
                  boxShadow: '0 30px 60px rgba(15, 23, 42, 0.18), 0 8px 25px rgba(212, 175, 55, 0.2)',
                  borderColor: '#D4AF37',
                  '& .cards-container > div': {
                    transform: 'translateY(0) scale(1.05) rotate(0deg) !important',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
                    mx: 0.5,
                    borderColor: '#D4AF37'
                  },
                  '& .cards-container': {
                    justifyContent: 'center'
                  }
                }
              }}
            >
              {/* Discount Badge */}
              <Box sx={{
                position: 'absolute',
                top: 24,
                right: 0,
                zIndex: 10,
                background: 'linear-gradient(135deg, #e53935 0%, #b71c1c 100%)',
                color: 'white',
                px: 2.5,
                py: 0.8,
                borderRadius: '20px 0 0 20px',
                fontWeight: 900,
                fontSize: '0.85rem',
                letterSpacing: '0.5px',
                boxShadow: '-4px 4px 15px rgba(183, 28, 28, 0.4)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRight: 'none',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '50%',
                  height: '100%',
                  background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)',
                  transform: 'skewX(-20deg)',
                  animation: 'shimmer 2.5s infinite'
                },
                '@keyframes shimmer': {
                  '0%': { left: '-100%' },
                  '100%': { left: '200%' }
                }
              }}>
                خصم {bundle.discountPercentage}%
              </Box>

              {/* Savings Bookmark */}
              {originalPrice > finalPrice && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 16,
                  zIndex: 12,
                  background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
                  color: 'white',
                  px: 1.5,
                  pt: 1.5,
                  pb: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  filter: 'drop-shadow(0 8px 12px rgba(6, 78, 59, 0.5))',
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-100%',
                    left: 0,
                    width: '100%',
                    height: '50%',
                    background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.7), transparent)',
                    animation: 'shimmerVertical 2.5s infinite',
                    animationDelay: '1s'
                  },
                  '@keyframes shimmerVertical': {
                    '0%': { top: '-100%' },
                    '100%': { top: '200%' }
                  }
                }}>
                  <LocalOfferOutlinedIcon sx={{ fontSize: '1.2rem', mb: 0.5, color: '#34D399', position: 'relative', zIndex: 2 }} />
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, mb: 0.2, position: 'relative', zIndex: 2 }}>وفر</Typography>
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, direction: 'ltr', position: 'relative', zIndex: 2 }}>
                    {(originalPrice - finalPrice).toLocaleString()}
                  </Typography>
                </Box>
              )}

              {/* Playing Cards Image Area */}
              <Box sx={{ 
                height: 250, 
                background: 'radial-gradient(circle at top, #2C3E50 0%, #172431 100%)', 
                position: 'relative', 
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)',
                }
              }}>
                <Box className="cards-container" sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  {displayProducts.map((prod, index) => {
                    const count = displayProducts.length;
                    const offset = count === 1 ? 0 : index - (count - 1) / 2;
                    const rotation = offset * 12; // 12 degrees spread
                    const translateX = -offset * 35; // 35px overlap step
                    const translateY = Math.abs(offset) * 15;
                    const zIndex = Math.floor(10 - Math.abs(offset));

                    return (
                      <Box 
                        key={prod._id}
                        sx={{
                          position: count > 1 ? 'absolute' : 'relative',
                          width: '135px',
                          height: '170px',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          boxShadow: '0 25px 50px rgba(0,0,0,0.85), 0 10px 20px rgba(0,0,0,0.6)',
                          border: '2px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: count > 1 
                            ? `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotation}deg)` 
                            : 'none',
                          zIndex,
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-150%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
                            transform: 'skewX(-25deg)',
                            animation: 'cardShimmer 4s infinite',
                            animationDelay: `${index * 0.3}s`,
                            pointerEvents: 'none',
                          },
                          '@keyframes cardShimmer': {
                            '0%': { left: '-150%' },
                            '20%': { left: '150%' },
                            '100%': { left: '150%' }
                          }
                        }}
                      >
                        <Box
                          component="img"
                          src={prod.image?.url || '/placeholder.png'}
                          alt={prod.name}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        {bundle.products.length > 5 && index === 4 && (
                          <Box sx={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            bgcolor: 'rgba(0,0,0,0.65)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            backdropFilter: 'blur(2px)'
                          }}>
                            <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '2rem' }}>
                              +{bundle.products.length - 5}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* Bundle Info */}
              <Box sx={{ p: {xs: 3, md: 4}, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 900, 
                  color: '#0F172A', 
                  mb: 2.5, 
                  letterSpacing: '-1px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.06)'
                }}>
                  {bundle.name}
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                  {bundle.products.map((p, index) => (
                    <Box key={p._id || index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ 
                        width: 6, height: 6, 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',
                        flexShrink: 0
                      }} />
                      <Typography variant="body1" sx={{ color: '#475569', fontWeight: 600 }}>
                        {p.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Box sx={{ mt: 'auto', mb: 4, pt: 3, borderTop: '1px dashed rgba(15, 23, 42, 0.1)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      السعر الإجمالي
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#e53935', letterSpacing: '-1.5px' }}>
                      {finalPrice.toLocaleString()} <Box component="span" sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#64748B' }}>ج.م</Box>
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#94A3B8', textDecoration: 'line-through', fontWeight: 500 }}>
                      {originalPrice.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                
                <Box>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                      color: '#ffffff', 
                      borderRadius: '16px',
                      py: 1.8,
                      fontWeight: 900,
                      fontSize: '1.1rem',
                      letterSpacing: '0.5px',
                      boxShadow: '0 8px 25px rgba(15, 23, 42, 0.3)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      position: 'relative',
                      overflow: 'hidden',
                      zIndex: 1,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
                        opacity: 0,
                        zIndex: -1,
                        transition: 'opacity 0.4s ease',
                      },
                      '&:hover': { 
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 30px rgba(212, 175, 55, 0.2)',
                        border: '1px solid rgba(212, 175, 55, 0.8)',
                        color: '#D4AF37', // Text turns gold
                      },
                      '&:hover::before': {
                        opacity: 1, // Subtle gold glow inside
                      },
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    التفاصيل والشراء
                  </Button>
                </Box>
              </Box>
            </Box>
          </ScrollReveal>
        );
        })}
      </Box>
    </Box>
  );
}
