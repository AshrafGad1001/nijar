'use client';

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { Box, SxProps, Theme } from '@mui/material';

export function useInView(options = { threshold: 0.1, rootMargin: '50px' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (ref.current) observer.unobserve(ref.current);
      }
    }, options);
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return { ref, isInView };
}

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number; // Delay in seconds
  duration?: number; // Animation duration in seconds
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'; // Direction to slide from
  distance?: number; // Slide distance in pixels
  useScale?: boolean; // Subtle zoom in effect
  useBlur?: boolean; // Cinematic blur reveal effect
  sx?: SxProps<Theme>;
}

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  distance = 60,
  useScale = true,
  useBlur = true,
  sx = {}
}: ScrollRevealProps) {
  const { ref, isInView } = useInView();

  let transformString = 'none';
  if (!isInView) {
    if (direction === 'up') transformString = `translateY(${distance}px)`;
    if (direction === 'down') transformString = `translateY(-${distance}px)`;
    if (direction === 'left') transformString = `translateX(${distance}px)`; 
    if (direction === 'right') transformString = `translateX(-${distance}px)`;
    
    if (useScale) {
      transformString += transformString === 'none' ? 'scale(0.95)' : ' scale(0.95)';
    }
  } else {
    transformString = direction !== 'none' ? 'translateY(0) translateX(0) scale(1)' : (useScale ? 'scale(1)' : 'none');
  }

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isInView ? 1 : 0,
        transform: transformString,
        filter: (!isInView && useBlur) ? 'blur(10px)' : 'blur(0px)',
        transition: `opacity ${duration}s ease ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, filter ${duration}s ease ${delay}s`,
        width: '100%',
        ...sx
      }}
    >
      {children}
    </Box>
  );
}
