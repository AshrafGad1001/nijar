'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Image from 'next/image';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface HeroSlideItem {
  _id: string;
  name: string;
  description: string;
  price: number | null;
  discountPercentage?: number;
  hasSizes?: boolean;
  sizes?: { name: string; price: number }[];
  image: { url: string; publicId: string };
  category: { _id: string; name: string } | string;
}

interface HeroSlideshowProps {
  slides: HeroSlideItem[];
}

const SLIDE_INTERVAL = 2000;

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    setIsPlaying(!mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) setIsPlaying(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying || prefersReducedMotion || slides.length <= 1) return;
    intervalRef.current = setInterval(next, SLIDE_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, prefersReducedMotion, next, slides.length]);

  if (!slides || slides.length === 0) return null;

  const slide = slides[current];
  const categoryName = typeof slide.category === 'object' ? slide.category.name : '';
  const displayPrice = slide.hasSizes && slide.sizes && slide.sizes.length > 0
    ? Math.min(...slide.sizes.map(s => s.price))
    : slide.price;
    
  const hasDiscount = Boolean(slide.discountPercentage && slide.discountPercentage > 0 && displayPrice);
  const finalPrice = hasDiscount 
    ? Math.round(((displayPrice || 0) * (1 - (slide.discountPercentage || 0) / 100)) * 100) / 100 
    : displayPrice;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '55vw', sm: '250px', md: '280px', lg: '320px' },
        maxHeight: '340px',
        borderRadius: '24px',
        overflow: 'hidden',
        mb: { xs: 2, md: 0 },
        boxShadow: '0 24px 60px rgba(10,41,71,0.15)',
      }}
      onMouseEnter={() => { if (!prefersReducedMotion) setIsPlaying(false); }}
      onMouseLeave={() => { if (!prefersReducedMotion) setIsPlaying(true); }}
    >
      {/* Slide Image */}
      {slide.image?.url ? (
        <Image
          key={slide._id} // helps with re-render animations if any
          src={slide.image.url}
          alt={slide.name}
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            transition: prefersReducedMotion ? 'none' : 'opacity 0.4s ease-in-out, transform 4s linear',
          }}
          className="ken-burns-effect"
        />
      ) : (
        <Box sx={{ width: '100%', height: '100%', bgcolor: '#1B3A4B' }} />
      )}

      {/* Cinematic Vignette Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Cinematic Bottom Gradient and Content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          pt: 16,
          pb: { xs: 5, md: 6 },
          px: { xs: 6, md: 10 },
          background: 'linear-gradient(to top, rgba(15, 32, 39, 0.95) 0%, rgba(27, 58, 75, 0.7) 50%, transparent 100%)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'flex-end' },
          justifyContent: 'space-between',
          gap: 2,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
          {categoryName && (
            <Box sx={{
              display: 'inline-flex',
              alignItems: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              px: 2,
              py: 0.5,
              borderRadius: '20px',
            }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#FCD34D', // Premium Gold
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                {categoryName}
              </Typography>
            </Box>
          )}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.2,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              textShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            {slide.name}
          </Typography>
        </Box>

        {displayPrice !== null && displayPrice !== undefined && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
            {hasDiscount && (
              <Typography
                sx={{
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: { xs: '0.85rem', md: '1.1rem' },
                  textDecoration: 'line-through',
                  mb: 0.25
                }}
              >
                {slide.hasSizes ? 'تبدأ من ' : ''}{displayPrice} ج.م
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  color: '#C59B5F', // Premium Gold
                  fontSize: { xs: '1.25rem', md: '2rem' },
                  textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                  lineHeight: 1
                }}
              >
                {!hasDiscount && slide.hasSizes ? 'تبدأ من ' : ''}{finalPrice}{' '}
                <Typography component="span" sx={{ fontSize: '0.6em', opacity: 0.9 }}>
                  ج.م
                </Typography>
              </Typography>
              {hasDiscount && (
                <Box sx={{
                  bgcolor: '#EF4444',
                  color: '#fff',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '6px',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                }}>
                  خصم {slide.discountPercentage}%
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Controls Container */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 12, md: 32 },
          left: { xs: 12, md: 32 },
          display: 'flex',
          gap: 1.5,
          zIndex: 3
        }}
      >
        {/* Play / Pause */}
        <IconButton
          aria-label={isPlaying ? 'إيقاف العرض' : 'تشغيل العرض'}
          onClick={() => setIsPlaying(p => !p)}
          sx={{
            width: { xs: 36, md: 48 },
            height: { xs: 36, md: 48 },
            bgcolor: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(12px)',
            color: '#C59B5F',
            border: '1px solid rgba(197, 155, 95, 0.3)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.5)', borderColor: '#C59B5F', color: '#ffffff', transform: 'scale(1.05)' },
            transition: 'all 0.2s ease'
          }}
        >
          {isPlaying ? <PauseIcon fontSize="small" sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }} /> : <PlayArrowIcon fontSize="small" sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }} />}
        </IconButton>
      </Box>

      {/* Prev / Next arrows — only if more than 1 slide */}
      {slides.length > 1 && (
        <>
          <IconButton
            aria-label="الشريحة السابقة"
            onClick={prev}
            sx={{
              position: 'absolute',
              top: '50%',
              right: { xs: 6, md: 24 },
              transform: 'translateY(-50%)',
              width: { xs: 32, md: 56 },
              height: { xs: 32, md: 56 },
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              color: '#C59B5F',
              border: '1px solid rgba(197, 155, 95, 0.3)',
              '&:hover': { 
                bgcolor: 'rgba(255, 255, 255, 0.15)', 
                borderColor: 'rgba(197, 155, 95, 0.5)', 
                color: '#ffffff', 
                transform: 'translateY(-50%) scale(1.1)' 
              },
              transition: 'all 0.3s ease',
              zIndex: 3
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 300 }} />
          </IconButton>
          
          <IconButton
            aria-label="الشريحة التالية"
            onClick={next}
            sx={{
              position: 'absolute',
              top: '50%',
              left: { xs: 6, md: 24 },
              transform: 'translateY(-50%)',
              width: { xs: 32, md: 56 },
              height: { xs: 32, md: 56 },
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              color: '#C59B5F',
              border: '1px solid rgba(197, 155, 95, 0.3)',
              '&:hover': { 
                bgcolor: 'rgba(255, 255, 255, 0.15)', 
                borderColor: 'rgba(197, 155, 95, 0.5)', 
                color: '#ffffff', 
                transform: 'translateY(-50%) scale(1.1)' 
              },
              transition: 'all 0.3s ease',
              zIndex: 3
            }}
          >
            <ChevronRightIcon sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }} />
          </IconButton>

          {/* Dot indicators */}
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: 12, md: 20 },
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: { xs: 1, md: 1.5 },
              zIndex: 3,
              bgcolor: 'rgba(0,0,0,0.2)',
              px: { xs: 2, md: 2.5 },
              py: { xs: 1, md: 1.25 },
              borderRadius: '24px',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            {slides.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setCurrent(idx)}
                sx={{
                  width: idx === current ? { xs: 24, md: 40 } : { xs: 10, md: 16 },
                  height: 3,
                  borderRadius: '2px',
                  bgcolor: idx === current ? '#C59B5F' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: idx === current ? '0 0 10px rgba(197, 155, 95, 0.4)' : 'none'
                }}
              />
            ))}
          </Box>
        </>
      )}
      
      {/* Global styles for Ken Burns animation */}
      <style dangerouslySetInnerHTML={{__html: `
        .ken-burns-effect {
          animation: kenBurns 20s ease-out infinite alternate;
        }
        @keyframes kenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
      `}} />
    </Box>
  );
}
