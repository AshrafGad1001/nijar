'use client';

import React, { useState, useEffect } from 'react';
import { Box, ButtonBase } from '@mui/material';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <ButtonBase
      onClick={scrollToTop}
      aria-label="العودة لأعلى الصفحة"
      sx={{
        position: 'fixed',
        bottom: { xs: 24, md: 32 },
        right: { xs: 20, md: 32 },
        width: 44,
        height: 44,
        borderRadius: '12px',
        bgcolor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        color: '#fff',
        zIndex: 1050,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.8)',
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: prefersReducedMotion ? 'opacity 0.01s' : 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
          bgcolor: 'rgba(15, 23, 42, 0.9)',
          transform: isVisible ? 'translateY(-2px) scale(1.05)' : 'translateY(12px) scale(0.8)',
        },
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </ButtonBase>
  );
}
