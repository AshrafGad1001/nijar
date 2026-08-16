'use client';

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, ButtonBase, Button } from '@mui/material';
import Image from 'next/image';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

import Link from 'next/link';

interface WorkCardProps {
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
  onClick?: (selectedSizeIndex: number) => void;
  href?: string;
  hidePrice?: boolean;
}

export default function WorkCard({ name, productCode, description, components, price, discountPercentage, hasSizes, sizes, image, gallery, onClick, href, hidePrice }: WorkCardProps) {
  const validSizes = sizes?.filter(s => s.name && s.price > 0) || [];
  
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0);

  const isSizesAvailable = hasSizes && validSizes.length > 0;
  
  const displayPrice = isSizesAvailable 
    ? validSizes[selectedSizeIndex]?.price 
    : price;

  const hasDiscount = Boolean(discountPercentage && discountPercentage > 0 && displayPrice);
  // Remove decimals using Math.round
  const finalPrice = hasDiscount 
    ? Math.round((displayPrice || 0) - ((displayPrice || 0) * (discountPercentage || 0) / 100)) 
    : Math.round(displayPrice || 0);
  
  const originalPrice = Math.round(displayPrice || 0);

  const savedAmount = hasDiscount 
    ? Math.round((displayPrice || 0) * (discountPercentage || 0) / 100) 
    : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(selectedSizeIndex);
    }
  };

  return (
    <Card 
      onClick={onClick ? handleCardClick : undefined}
      sx={{ 
        position: 'relative',
        height: '100%',
        width: '100%', // Ensure it takes full width of grid cell
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '20px',
        overflow: 'hidden',
        bgcolor: '#ffffff',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        textDecoration: 'none',
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
        },
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 24px 64px rgba(15, 23, 42, 0.08)',
          borderColor: 'rgba(15, 23, 42, 0.1)',
          '@media (prefers-reduced-motion: reduce)': {
            transform: 'none',
          },
          '& .MuiCardActionArea-focusHighlight': {
            opacity: 0,
          }
        }
      }}
    >
      {href && !onClick && (
        <Link href={href} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }} />
      )}
      
      {/* IMAGE CONTAINER (Square 1:1) */}
      <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden', bgcolor: '#F8FAFC' }}>
        <Image 
          src={image?.url || '/images/placeholder.webp'} 
          alt={name} 
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
        
        {/* Subtle Overlay on Hover */}
        <Box 
          className="MuiImageBackdrop-root"
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            bgcolor: '#0B131E',
            opacity: 0,
            transition: 'opacity 0.4s ease',
            zIndex: 1,
            '.MuiCard-root:hover &': {
              opacity: 0.05,
            }
          }}
        />

        {/* Discount Badge - Minimalist */}
        {discountPercentage && discountPercentage > 0 && (
          <Box sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: '#E11D48',
            color: '#fff',
            px: 1.5,
            py: 0.5,
            borderRadius: '100px',
            fontWeight: 800,
            fontSize: '0.8rem',
            boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            letterSpacing: '0.5px'
          }}>
            خصم {discountPercentage}%
          </Box>
        )}
      </Box>

      {/* CONTENT */}
      <Box dir="rtl" sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 2.5, sm: 3 }, textAlign: 'start', position: 'relative', zIndex: 2 }}>
        
        {/* Product Code */}
        {productCode && (
          <Typography 
            variant="overline" 
            sx={{ 
              color: '#64748B', 
              fontWeight: 600, 
              fontSize: '0.7rem', 
              letterSpacing: '1.5px',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            كود <span dir="ltr" style={{ color: '#0F172A', fontWeight: 800 }}>{productCode}</span>
          </Typography>
        )}

        {/* Title */}
        <Typography 
          variant="h6" 
          component="h3"
          sx={{ 
            fontWeight: 800, 
            color: '#09101A',
            mb: 1.5,
            fontSize: '1.15rem',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word'
          }}
        >
          {name}
        </Typography>

        {/* Components */}
        {components && components.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ display: 'block', color: '#64748B', fontWeight: 700, mb: 1 }}>
              المكونات:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {components.slice(0, 3).map((comp, idx) => (
                <Typography 
                  key={idx} 
                  variant="body2" 
                  sx={{ 
                    color: '#64748B', 
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    bgcolor: '#F1F5F9',
                    px: 1.2,
                    py: 0.5,
                    borderRadius: '6px'
                  }}
                >
                  {comp}
                </Typography>
              ))}
              {components.length > 3 && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#94A3B8', 
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    bgcolor: '#F8FAFC',
                    px: 1,
                    py: 0.5,
                    borderRadius: '6px'
                  }}
                >
                  +{components.length - 3}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        
        {/* SIZES */}
        {!hidePrice && isSizesAvailable && (
          <Box sx={{ mb: 2, position: 'relative', zIndex: 11 }}>
            <Box sx={{ 
              display: 'flex', 
              bgcolor: '#F1F5F9', 
              borderRadius: '100px', 
              p: 0.5,
              width: '100%'
            }}>
              {validSizes.map((size, index) => {
                const isSelected = index === selectedSizeIndex;
                return (
                  <ButtonBase
                    key={size.name}
                    onClick={(e) => {
                      e.stopPropagation(); 
                      e.preventDefault();
                      setSelectedSizeIndex(index);
                    }}
                    sx={{
                      flex: 1,
                      height: 32,
                      px: 1,
                      borderRadius: '100px', 
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? 800 : 600,
                      bgcolor: isSelected ? '#1877F2' : 'transparent',
                      color: isSelected ? '#ffffff' : '#64748B',
                      boxShadow: isSelected ? '0 4px 12px rgba(24, 119, 242, 0.3)' : 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: isSelected ? '#ffffff' : '#0F172A',
                      }
                    }}
                  >
                    <span dir="ltr">{size.name}</span>
                  </ButtonBase>
                );
              })}
            </Box>
          </Box>
        )}
        
        {/* PRICE AREA */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          justifyContent: 'space-between',
          mt: 'auto', 
          pt: 1.5,
          position: 'relative',
          zIndex: 3
        }}>
          {hidePrice ? (
            <Box
              sx={{
                width: '100%',
                bgcolor: '#0F172A',
                color: '#ffffff',
                borderRadius: '12px',
                py: 1.2,
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                pointerEvents: 'none',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
              }}
            >
              عرض التفاصيل
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Box>
          ) : displayPrice !== null && displayPrice !== undefined ? (
            <>
              {/* Prices */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {hasDiscount && (
                  <Typography 
                    sx={{ 
                      textDecoration: 'line-through', 
                      color: '#94A3B8', 
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      mb: -0.25
                    }}
                  >
                    {originalPrice.toLocaleString('en-US')} ج.م
                  </Typography>
                )}
                <Typography 
                  sx={{ 
                    fontWeight: 900, 
                    color: '#0F172A',
                    fontSize: '1.4rem',
                    lineHeight: 1
                  }}
                >
                  {finalPrice.toLocaleString('en-US')} <Typography component="span" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.85rem', ml: 0.25 }}>ج.م</Typography>
                </Typography>
              </Box>

              {/* Minimal Savings Tag */}
              {hasDiscount && (
                <Box sx={{ 
                  color: '#10B981', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: '6px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  bgcolor: 'rgba(16, 185, 129, 0.1)'
                }}>
                  <LocalOfferOutlinedIcon sx={{ fontSize: 14, transform: 'scaleX(-1)' }} />
                  <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                    وفر {savedAmount.toLocaleString('en-US')}
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <Button
              component="a"
              href="https://wa.me/201097000571" // Fallback whatsapp 
              target="_blank"
              onClick={(e) => { e.stopPropagation(); }}
              sx={{
                width: '100%',
                bgcolor: '#25D366',
                color: '#fff',
                borderRadius: '12px',
                py: 1,
                fontWeight: 800,
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: '#1EBE5D',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(37, 211, 102, 0.3)',
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              تواصل لمعرفة السعر
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
}
