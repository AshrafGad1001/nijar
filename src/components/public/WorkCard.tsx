'use client';

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, ButtonBase } from '@mui/material';
import Image from 'next/image';
import SquareFootIcon from '@mui/icons-material/SquareFoot';

import Link from 'next/link';

interface WorkCardProps {
  name: string;
  description: string;
  price: number | null;
  hasSizes?: boolean;
  sizes?: { name: string; price: number }[];
  image?: { url: string; publicId: string };
  gallery?: { url: string; publicId: string }[];
  onClick?: (selectedSizeIndex: number) => void;
  href?: string;
}

export default function WorkCard({ name, description, price, hasSizes, sizes, image, gallery, onClick, href }: WorkCardProps) {
  const validSizes = sizes?.filter(s => s.name && s.price > 0) || [];
  
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0);

  const isSizesAvailable = hasSizes && validSizes.length > 0;
  
  const displayPrice = isSizesAvailable 
    ? validSizes[selectedSizeIndex]?.price 
    : price;

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
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '24px',
      background: '#ffffff',
      boxShadow: '0 8px 32px rgba(27, 58, 75, 0.05)',
      border: '1px solid rgba(27, 58, 75, 0.04)',
      p: 0,
      overflow: 'hidden',
      height: '100%',
      cursor: (onClick || href) ? 'pointer' : 'default',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 16px 48px rgba(27, 58, 75, 0.12)',
        borderColor: 'rgba(27, 58, 75, 0.08)',
        '& .card-image': {
          transform: 'scale(1.08)'
        }
      }
    }}>
      {/* IMAGE (Top) */}
      {image?.url && (
        <Box sx={{ 
          width: '100%', 
          aspectRatio: { xs: '4/3', sm: '1/1', md: '4/3' },
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#f4f6f8',
          borderBottom: '1px solid rgba(0,0,0,0.03)'
        }}>
          <Image 
            src={image.url} 
            alt={name} 
            fill
            className="card-image"
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
          />
        </Box>
      )}

      {/* CONTENT (Bottom) */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 2.5, sm: 3 } }}>
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            fontWeight: 900, 
            color: '#0f2027', 
            mb: 1, 
            fontSize: '1.3rem', 
            lineHeight: 1.4,
            textShadow: '0 2px 8px rgba(15,32,39,0.1)' // Premium text shadow
          }}
        >
          {name}
        </Typography>
        
        {description && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#4a5568', 
              fontSize: '0.95rem', 
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
        
        {/* PRICE / SIZES AREA - Elevated Box */}
        <Box sx={{ 
          width: '100%', 
          mt: 'auto', 
          p: 2, 
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
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 800, color: '#1B3A4B', opacity: 0.7 }}>
                <SquareFootIcon sx={{ fontSize: 16 }} /> اختر المقاس
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
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
                          minWidth: 'auto',
                          height: 32,
                          px: 1.5,
                          borderRadius: '8px', 
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? 800 : 600,
                          bgcolor: isSelected ? '#1B3A4B' : 'rgba(27, 58, 75, 0.04)',
                          color: isSelected ? '#fff' : '#1B3A4B',
                          border: isSelected ? '1px solid #1B3A4B' : '1px solid transparent',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: isSelected ? '#1B3A4B' : 'rgba(27, 58, 75, 0.08)',
                          }
                        }}
                      >
                        <span dir="ltr">{size.name}</span>
                        {/* <span style={{ marginLeft: '4px', fontSize: '0.7rem', opacity: 0.8 }}>سم</span> */}
                      </ButtonBase>
                    );
                  })}
                </Box>
                <Typography 
                  variant="h6" 
                  key={displayPrice}
                  sx={{ 
                    fontWeight: 900, 
                    color: '#2E8B9A',
                    fontSize: '1.25rem',
                    textShadow: '0 1px 2px rgba(46,139,154,0.1)'
                  }}
                >
                  {displayPrice} <Typography component="span" variant="caption" sx={{ color: '#4a5568', fontWeight: 700, ml: 0.5 }}>ج.م</Typography>
                </Typography>
              </Box>
            </Box>
          ) : displayPrice !== null && displayPrice !== undefined ? (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#1B3A4B', opacity: 0.7 }}>
                السعر:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#2E8B9A', fontSize: '1.4rem', textShadow: '0 1px 2px rgba(46,139,154,0.1)' }}>
                {displayPrice} <Typography component="span" variant="caption" sx={{ color: '#4a5568', fontWeight: 700, ml: 0.5 }}>ج.م</Typography>
              </Typography>
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
