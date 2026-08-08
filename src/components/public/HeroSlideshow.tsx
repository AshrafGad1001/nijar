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
  hasSizes?: boolean;
  sizes?: { name: string; price: number }[];
  image: { url: string; publicId: string };
  category: { _id: string; name: string } | string;
}

interface HeroSlideshowProps {
  slides: HeroSlideItem[];
}

const SLIDE_INTERVAL = 2800;

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

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '60vw', sm: '380px', md: '460px' },
        maxHeight: '480px',
        borderRadius: '32px',
        overflow: 'hidden',
        mb: 5,
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
            transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-in-out, transform 4s linear',
          }}
          className="ken-burns-effect"
        />
      ) : (
        <Box sx={{ width: '100%', height: '100%', bgcolor: '#1B3A4B' }} />
      )}

      {/* Subtle Dark Gradient Overlay for the entire slide */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%)',
          pointerEvents: 'none'
        }}
      />

      {/* Premium Minimalist Light Glassmorphism Panel - Horizontal */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 32, md: 32 }, // Lowered slightly on mobile
          right: { xs: 12, md: 32 }, // Physical left in RTL
          left: { xs: 12, md: 'auto' }, // Full width with margin on mobile
          maxWidth: { xs: 'none', md: '700px' },
          bgcolor: 'rgba(255, 255, 255, 0.45)', // More transparent
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '100px', // Pill shape on all screens
          px: { xs: 2, md: 4 },
          py: { xs: 1, md: 2.5 }, // Much thinner on mobile
          color: '#1B3A4B',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 20px rgba(255,255,255,0.3) inset',
          display: 'flex',
          flexDirection: 'row', // ALWAYs horizontal
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 1, md: 3 },
          zIndex: 2,
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            bgcolor: 'rgba(255, 255, 255, 0.55)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.15), 0 0 24px rgba(255,255,255,0.5) inset',
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: { xs: 1, md: 2 }, overflow: 'hidden' }}>
          {categoryName && (
            <Typography
              variant="caption"
              sx={{
                bgcolor: 'rgba(46, 139, 154, 0.15)',
                color: '#1a5d68',
                px: { xs: 1, md: 2 },
                py: { xs: 0.25, md: 0.75 },
                borderRadius: '20px',
                fontWeight: 800,
                fontSize: { xs: '0.65rem', md: '0.8rem' },
                display: 'inline-block',
                letterSpacing: '0.5px',
                border: '1px solid rgba(46, 139, 154, 0.2)',
                whiteSpace: 'nowrap'
              }}
            >
              {categoryName}
            </Typography>
          )}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: '#1B3A4B',
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
              fontSize: { xs: '0.85rem', sm: '1.2rem', md: '1.8rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {slide.name}
          </Typography>
        </Box>

        {/* Divider dot for desktop */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, width: 6, height: 6, borderRadius: '50%', bgcolor: 'rgba(27,58,75,0.3)', flexShrink: 0 }} />

        {displayPrice !== null && displayPrice !== undefined && (
          <Typography
            sx={{
              fontWeight: 800,
              color: '#c26a02', // Darker elegant Gold/Orange
              fontSize: { xs: '0.85rem', md: '1.5rem' },
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {slide.hasSizes ? 'تبدأ من ' : ''}{displayPrice}{' '}
            <Typography component="span" sx={{ fontSize: '0.8em', opacity: 0.9 }}>
              ج.م
            </Typography>
          </Typography>
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
            width: { xs: 32, md: 44 },
            height: { xs: 32, md: 44 },
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.4)', transform: 'scale(1.05)' },
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
              right: { xs: 8, md: 24 }, /* RTL 'right' = Physical Left */
              transform: 'translateY(-50%)',
              width: { xs: 36, md: 52 },
              height: { xs: 36, md: 52 },
              bgcolor: 'rgba(10, 41, 71, 0.4)',
              backdropFilter: 'blur(12px)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: 'rgba(10, 41, 71, 0.8)', transform: 'translateY(-50%) scale(1.1)' },
              transition: 'all 0.3s ease',
              zIndex: 3
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }} />
          </IconButton>
          
          <IconButton
            aria-label="الشريحة التالية"
            onClick={next}
            sx={{
              position: 'absolute',
              top: '50%',
              left: { xs: 8, md: 24 }, /* RTL 'left' = Physical Right */
              transform: 'translateY(-50%)',
              width: { xs: 36, md: 52 },
              height: { xs: 36, md: 52 },
              bgcolor: 'rgba(10, 41, 71, 0.4)',
              backdropFilter: 'blur(12px)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: 'rgba(10, 41, 71, 0.8)', transform: 'translateY(-50%) scale(1.1)' },
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
              bottom: { xs: 12, md: 32 }, // Lowered on mobile to sit below the box
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: { xs: 1, md: 1.5 },
              zIndex: 3,
              bgcolor: 'rgba(0,0,0,0.2)',
              px: { xs: 1.5, md: 2 },
              py: { xs: 0.75, md: 1 },
              borderRadius: '20px',
              backdropFilter: 'blur(8px)'
            }}
          >
            {slides.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setCurrent(idx)}
                sx={{
                  width: idx === current ? { xs: 16, md: 24 } : { xs: 6, md: 10 },
                  height: { xs: 6, md: 10 },
                  borderRadius: '6px',
                  bgcolor: idx === current ? '#4DD0E1' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: idx === current ? '0 0 10px rgba(77, 208, 225, 0.5)' : 'none'
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
