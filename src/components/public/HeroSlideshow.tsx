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

const SLIDE_INTERVAL = 4000;

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
        height: { xs: '55vw', sm: '420px', md: '500px' },
        maxHeight: '560px',
        borderRadius: '24px',
        overflow: 'hidden',
        mb: 4,
        boxShadow: '0 20px 60px rgba(27,58,75,0.25)',
      }}
      onMouseEnter={() => { if (!prefersReducedMotion) setIsPlaying(false); }}
      onMouseLeave={() => { if (!prefersReducedMotion) setIsPlaying(true); }}
    >
      {/* Slide Image */}
      {slide.image?.url ? (
        <Image
          src={slide.image.url}
          alt={slide.name}
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            transition: prefersReducedMotion ? 'none' : 'opacity 0.5s ease',
          }}
        />
      ) : (
        <Box sx={{ width: '100%', height: '100%', bgcolor: '#1B3A4B' }} />
      )}

      {/* Dark Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(27,58,75,0.85) 0%, rgba(27,58,75,0.3) 50%, rgba(0,0,0,0.1) 100%)',
        }}
      />

      {/* Slide Info */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          p: { xs: 2.5, md: 4 },
          color: '#fff',
        }}
      >
        {categoryName && (
          <Typography
            variant="caption"
            sx={{
              bgcolor: 'rgba(46,139,154,0.85)',
              px: 1.5,
              py: 0.5,
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.75rem',
              display: 'inline-block',
              mb: 1,
            }}
          >
            {categoryName}
          </Typography>
        )}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.2,
            mb: 0.5,
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            fontSize: { xs: '1.4rem', md: '2rem' },
          }}
        >
          {slide.name}
        </Typography>
        {displayPrice !== null && displayPrice !== undefined && (
          <Typography
            sx={{
              fontWeight: 800,
              color: '#2E8B9A',
              fontSize: { xs: '1.1rem', md: '1.4rem' },
            }}
          >
            {slide.hasSizes ? 'تبدأ من ' : ''}{displayPrice}{' '}
            <Typography component="span" sx={{ fontSize: '0.8em', opacity: 0.85 }}>
              ج.م
            </Typography>
          </Typography>
        )}
      </Box>

      {/* Controls */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 10, md: 16 },
          left: { xs: 10, md: 16 },
          display: 'flex',
          gap: 1,
        }}
      >
        {/* Play / Pause */}
        <IconButton
          aria-label={isPlaying ? 'إيقاف العرض' : 'تشغيل العرض'}
          onClick={() => setIsPlaying(p => !p)}
          size="small"
          sx={{
            bgcolor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
          }}
        >
          {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
        </IconButton>
      </Box>

      {/* Prev / Next arrows — only if more than 1 slide */}
      {slides.length > 1 && (
        <>
          <IconButton
            aria-label="الشريحة السابقة"
            onClick={prev}
            size="small"
            sx={{
              position: 'absolute',
              top: '50%',
              right: { xs: 8, md: 16 },
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
          <IconButton
            aria-label="الشريحة التالية"
            onClick={next}
            size="small"
            sx={{
              position: 'absolute',
              top: '50%',
              left: { xs: 8, md: 16 },
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          {/* Dot indicators */}
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: 10, md: 16 },
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 0.75,
            }}
          >
            {slides.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setCurrent(idx)}
                sx={{
                  width: idx === current ? 20 : 8,
                  height: 8,
                  borderRadius: '4px',
                  bgcolor: idx === current ? '#2E8B9A' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
