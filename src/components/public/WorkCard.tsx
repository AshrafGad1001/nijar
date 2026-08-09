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
  const finalPrice = hasDiscount 
    ? Math.round(((displayPrice || 0) - ((displayPrice || 0) * (discountPercentage || 0) / 100)) * 100) / 100 
    : displayPrice;
  const savedAmount = hasDiscount 
    ? Math.round(((displayPrice || 0) * (discountPercentage || 0) / 100) * 100) / 100 
    : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      // If there's an onClick but also href, we might want to prevent default if needed, 
      // but usually we provide one or the other.
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
        borderRadius: '24px',
        overflow: 'hidden',
        bgcolor: '#ffffff',
        border: '1px solid rgba(27,58,75,0.08)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        textDecoration: 'none',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
          '& .MuiCardActionArea-focusHighlight': {
            opacity: 0,
          },
          '& .MuiImageBackdrop-root': {
            opacity: 0.1,
          }
        }
      }}
    >
      {/* IMAGE CONTAINER */}
      <Box sx={{ position: 'relative', pt: '66.67%', overflow: 'hidden' }}>
        <Image 
          src={image?.url || '/images/placeholder.webp'} 
          alt={name} 
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
        <Box 
          className="MuiImageBackdrop-root"
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            bgcolor: '#1B3A4B',
            opacity: 0,
            transition: 'opacity 0.4s ease',
            zIndex: 1
          }}
        />
        
        {/* Watermark Logo - Premium Floating Style */}
        <Box sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 2,
          width: 60,
          height: 40,
          opacity: 0.85,
          filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.4))',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            opacity: 1,
            transform: 'scale(1.05)',
            filter: 'drop-shadow(0px 6px 12px rgba(0,0,0,0.6))',
          }
        }}>
          <Image src="/logo-product.png" alt="MG Logo" fill style={{ objectFit: 'contain' }} />
        </Box>

        {/* Discount Badge */}
        {discountPercentage && discountPercentage > 0 && (
          <Box sx={{
            position: 'absolute',
            top: 16,
            right: 0,
            bgcolor: '#EF4444',
            color: '#fff',
            px: 2,
            py: 0.75,
            borderRadius: '8px 0 0 8px',
            fontWeight: 900,
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            خصم {discountPercentage}%
          </Box>
        )}

        {/* Product Code Badge */}
        {productCode && (
          <Box sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            color: '#1B3A4B',
            px: 2,
            py: 0.75,
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.85rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
            }
          }}>
            <Box component="span" dir="rtl" sx={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 700 }}>
              كود:
            </Box>
            <Box component="span" dir="ltr" sx={{ letterSpacing: '0.5px' }}>
              {productCode}
            </Box>
          </Box>
        )}
      </Box>

      {/* CONTENT (Bottom) */}
      <Box dir="rtl" sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 2.5, sm: 3 }, textAlign: 'start' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 1, gap: 1.5, flexWrap: 'wrap' }}>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              fontWeight: 900, 
              color: '#0f2027', 
              fontSize: '1.3rem', 
              lineHeight: 1.4,
              textShadow: '0 2px 8px rgba(15,32,39,0.1)' 
            }}
          >
            {name}
          </Typography>
        </Box>
        
        {components && components.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3, flexGrow: 1, alignContent: 'flex-start', overflow: 'hidden', maxHeight: '72px' }}>
            {components.map((comp, idx) => (
              <Box key={idx} sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                bgcolor: '#F8FAFC', 
                color: '#334155', 
                px: 1, 
                py: 0.25, 
                borderRadius: '6px', 
                fontSize: '0.8rem', 
                fontWeight: 700,
                border: '1px solid #E2E8F0',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#CBD5E1',
                  bgcolor: '#F1F5F9',
                }
              }}>
                <span style={{ color: '#94A3B8', marginLeft: '4px', marginRight: '2px', fontWeight: 900 }}>-</span>
                {comp}
              </Box>
            ))}
          </Box>
        ) : description && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#475569', 
              fontSize: '0.95rem', 
              fontWeight: 600,
              mb: 3, 
              flexGrow: 1, 
              lineHeight: 1.8,
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden' 
            }}
          >
            {description}
          </Typography>
        )}
        
        {/* PRICE / SIZES AREA - Elevated Box */}
        <Box sx={{ 
          width: '100%', 
          mt: 'auto', 
          p: 1.5, 
          bgcolor: '#f8fafc',
          borderRadius: '16px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8), 0 4px 12px rgba(27,58,75,0.06)',
          border: '1px solid rgba(27,58,75,0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8), 0 6px 16px rgba(27,58,75,0.08)',
            bgcolor: '#ffffff'
          }
        }}>
          {isSizesAvailable ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.75 }}>
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 800, color: '#1B3A4B', opacity: 0.7, mb: 0.25 }}>
                  <SquareFootIcon sx={{ fontSize: 18, color: '#C59B5F' }} /> اختر الفئة
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  bgcolor: '#F3F4F6', 
                  borderRadius: '24px', 
                  p: 0.5,
                  border: '1px solid rgba(0,0,0,0.04)',
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
                          px: 1.5,
                          borderRadius: '20px', 
                          fontSize: '0.85rem',
                          fontWeight: isSelected ? 800 : 700,
                          bgcolor: isSelected ? '#1a73e8' : 'transparent',
                          color: isSelected ? '#fff' : '#4B5563',
                          boxShadow: isSelected ? '0 2px 8px rgba(26,115,232,0.35)' : 'none',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            color: isSelected ? '#fff' : '#1a73e8',
                          }
                        }}
                      >
                        <span dir="ltr">{size.name}</span>
                      </ButtonBase>
                    );
                  })}
                </Box>
              </Box>
              
              {/* Price Box */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: hasDiscount ? 'space-between' : 'center',
                width: '100%',
                p: 1.25,
                borderRadius: '12px',
                border: '1px solid rgba(27, 58, 75, 0.08)',
                bgcolor: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                {/* Right Side: Prices */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: hasDiscount ? 'flex-start' : 'center' }}>
                  {hasDiscount && (
                    <Typography 
                      sx={{ 
                        textDecoration: 'line-through', 
                        color: '#94A3B8', 
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        mb: -0.25
                      }}
                    >
                      {displayPrice} ج.م
                    </Typography>
                  )}
                  <Typography 
                    sx={{ 
                      fontWeight: 900, 
                      color: '#0F172A',
                      fontSize: '1.3rem',
                      lineHeight: 1
                    }}
                  >
                    {finalPrice} <Typography component="span" sx={{ color: '#64748B', fontWeight: 800, fontSize: '0.85rem', ml: 0.25 }}>ج.م</Typography>
                  </Typography>
                </Box>

                {/* Left Side: Savings Badge */}
                {hasDiscount && (
                  <Box sx={{ 
                    background: 'linear-gradient(135deg, #3AD671 0%, #2CB15A 100%)', 
                    color: '#ffffff', 
                    px: 1.5, 
                    py: 0.5, 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
                  }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      وفر {savedAmount.toFixed(0)} ج.م
                    </Typography>
                    <LocalOfferOutlinedIcon sx={{ fontSize: 16, transform: 'scaleX(-1)' }} />
                  </Box>
                )}
              </Box>
            </Box>
          ) : displayPrice !== null && displayPrice !== undefined ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: hasDiscount ? 'space-between' : 'center',
              width: '100%',
              p: 1.5,
              mt: 'auto',
              borderRadius: '16px',
              border: '1px solid rgba(27, 58, 75, 0.08)',
              bgcolor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              {/* Right Side: Prices */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: hasDiscount ? 'flex-start' : 'center' }}>
                {hasDiscount && (
                  <Typography 
                    sx={{ 
                      textDecoration: 'line-through', 
                      color: '#64748B', 
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      mb: 0.5
                    }}
                  >
                    {displayPrice} ج.م
                  </Typography>
                )}
                <Typography 
                  sx={{ 
                    fontWeight: 900, 
                    color: '#2E8B9A',
                    fontSize: '1.4rem',
                    lineHeight: 1
                  }}
                >
                  {finalPrice} <Typography component="span" sx={{ color: '#4a5568', fontWeight: 800, fontSize: '0.9rem' }}>ج.م</Typography>
                </Typography>
              </Box>

              {/* Left Side: Savings Badge */}
              {hasDiscount && (
                <Box sx={{ 
                  bgcolor: 'rgba(58, 214, 113, 0.15)', 
                  color: '#2CB15A', 
                  px: 2, 
                  py: 1, 
                  borderRadius: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.75
                }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                    {savedAmount.toFixed(2)} ج.م
                  </Typography>
                  <LocalOfferOutlinedIcon sx={{ fontSize: 18, transform: 'scaleX(-1)' }} />
                </Box>
              )}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#4a5568', textAlign: 'center' }}>
              السعر عند التواصل
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
