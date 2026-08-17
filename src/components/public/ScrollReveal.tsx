'use client';

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export default function ScrollReveal({ children, delay = 0, direction = 'up' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, render children immediately without animation
  if (shouldReduceMotion) {
    return <div>{children}</div>;
  }

  const directionOffset = {
    up: { x: 0, y: 30 },
    down: { x: 0, y: -30 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
  };

  const offset = directionOffset[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: offset.x, y: offset.y }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
