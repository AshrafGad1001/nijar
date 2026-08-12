'use client';

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, ButtonBase } from '@mui/material';
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
}

export default function WorkCard({ name, productCode, description, components, price, discountPercentage, hasSizes, sizes, image, gallery, onClick, href }: WorkCardProps) {
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

  const cardContent = (
    <Card 
      onClick={onClick ? handleCardClick : undefined}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '20px',
        overflow: 'hidden',
        bgcolor: '#ffffff',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        textDecoration: 'none',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
          borderColor: 'rgba(197, 155, 95, 0.2)', // subtle gold border on hover
          '& .MuiCardActionArea-focusHighlight': {
            opacity: 0,
          }
        }
      }}
    >
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
            bgcolor: '#E11D48', // Elegant deep red
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
      <Box dir="rtl" sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 2.5, sm: 3 }, textAlign: 'start' }}>
        
        {/* Product Code */}
        {productCode && (
          <Typography 
            variant="overline" 
            sx={{ 
              color: '#94A3B8', 
              fontWeight: 700, 
              fontSize: '0.75rem', 
              letterSpacing: '1px',
              mb: 0.5,
              display: 'block'
            }}
          >
            كود: <span dir="ltr">{productCode}</span>
          </Typography>
        )}

        {/* Title */}
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            fontWeight: 900, 
            color: '#0F172A', 
            fontSize: '1.25rem', 
            lineHeight: 1.4,
            mb: 1
          }}
        >
          {name}
        </Typography>
        
        {/* Components / Description */}
        {components && components.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3, flexGrow: 1, alignContent: 'flex-start' }}>
            {components.map((comp, idx) => (
              <Box key={idx} sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                color: '#64748B', 
                fontSize: '0.85rem', 
                fontWeight: 600,
              }}>
                <span style={{ color: '#CBD5E1', margin: '0 4px' }}>•</span>
                {comp}
              </Box>
            ))}
          </Box>
        ) : description && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748B', 
              fontSize: '0.9rem', 
              fontWeight: 500,
              mb: 3, 
              flexGrow: 1, 
              lineHeight: 1.6,
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden' 
            }}
          >
            {description}
          </Typography>
        )}
        
        {/* SIZES */}
        {isSizesAvailable && (
          <Box sx={{ mb: 2 }}>
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
          pt: 2,
          borderTop: '1px solid rgba(0,0,0,0.04)'
        }}>
          {displayPrice !== null && displayPrice !== undefined ? (
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
                  color: '#10B981', // Elegant green
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
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#94A3B8', width: '100%' }}>
              السعر عند التواصل
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
