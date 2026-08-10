'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

import Image from 'next/image';

// 1. Keyframes for the Hammer Swing
// Swings up, holds, strikes down, bounces slightly, then rests.
const hammerSwing = keyframes`
  0% { transform: rotate(-10deg); }
  25% { transform: rotate(-55deg); }
  40% { transform: rotate(-55deg); }
  45% { transform: rotate(8deg); } 
  50% { transform: rotate(-5deg); }
  55% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
`;

// 2. Keyframes for the Nail Drive
// Drives down exactly when the hammer strikes (45%)
const nailDrive = keyframes`
  0%, 43% { transform: translateY(0); }
  47%, 100% { transform: translateY(16px); }
`;

// 3. Keyframes for the Impact Spark/Shockwave
const sparkExplode = keyframes`
  0%, 43% { transform: scale(0) scaleY(0.2); opacity: 0; }
  45% { transform: scale(1) scaleY(0.2); opacity: 1; }
  65%, 100% { transform: scale(3) scaleY(0.2); opacity: 0; }
`;

// 4. Keyframes for the Logo Reveal
// Fades in and scales slightly after the strike
const logoReveal = keyframes`
  0%, 50% { opacity: 0; transform: translateY(15px) scale(0.90); filter: blur(4px); }
  75%, 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
`;

// 5. Simple fade for reduced motion users
const simpleFadeIn = keyframes`
  0%, 20% { opacity: 0; }
  100% { opacity: 1; }
`;

// 6. Final fade out for the whole screen
const fadeOut = keyframes`
  from { opacity: 1; visibility: visible; }
  to { opacity: 0; visibility: hidden; }
`;

let isFirstMount = true;

export default function SplashScreen() {
  const [shouldMount, setShouldMount] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 1. Session Storage Check: Only show once per session
    const hasShown = sessionStorage.getItem('splashShown');
    
    // React 18 Strict Mode workaround: 
    // In dev mode, useEffect runs twice. The first run sets sessionStorage, 
    // the second run sees it and hides the splash immediately.
    // By tracking isFirstMount globally, we bypass this issue in dev.
    if (hasShown === 'true' && !isFirstMount) {
      setShouldMount(false);
      return;
    }
    
    isFirstMount = false;
    
    // Mark as shown for future navigations in this session
    sessionStorage.setItem('splashShown', 'true');

    // 2. Dynamic Timing: Start fade out after 3.5 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3500);

    // Completely unmount after 4.3s
    const unmountTimer = setTimeout(() => {
      setShouldMount(false);
    }, 4300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!shouldMount) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#F7F9FA', // Off-white to make the logo pop
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        animation: isFadingOut ? `${fadeOut} 0.8s ease forwards` : 'none',
        pointerEvents: isFadingOut ? 'none' : 'auto', 
      }}
    >
      <Box 
        sx={{ 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          // Accessibility: Reduced Motion overrides
          '@media (prefers-reduced-motion: reduce)': {
            '& .complex-anim': { display: 'none' }, // Hide hammer/nail
            '& .logo-reveal': { animation: `${simpleFadeIn} 1.5s ease forwards` } // Simple fade logo
          }
        }}
      >
        {/* Animation Canvas */}
        <Box className="complex-anim" sx={{ position: 'relative', width: 140, height: 100, mb: 4 }}>
          
          {/* Nail */}
          <Box
            sx={{
              position: 'absolute',
              top: 52,
              left: 70,
              marginLeft: '-6px', // Center the 12px width
              animation: `${nailDrive} 4.5s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
            }}
          >
            <svg width="12" height="32" viewBox="0 0 12 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H12V3H0V0Z" fill="#94A3B8" /> {/* Head */}
              <path d="M4 3H8V26L6 32L4 26V3Z" fill="#CBD5E1" /> {/* Body */}
            </svg>
          </Box>

          {/* Impact Spark / Shockwave */}
          <Box
            sx={{
              position: 'absolute',
              top: 52,
              left: 70,
              width: 80,
              height: 80,
              marginLeft: '-40px',
              marginTop: '-40px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(197, 155, 95, 0.8) 0%, rgba(197, 155, 95, 0) 60%)',
              animation: `${sparkExplode} 4.5s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
              transformOrigin: 'center',
            }}
          />

          {/* Hammer */}
          <Box
            sx={{
              position: 'absolute',
              top: 24,
              left: 50,
              // Rotate around the very end of the handle (left side)
              transformOrigin: '0px 32px',
              animation: `${hammerSwing} 4.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
            }}
          >
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Handle */}
              <path d="M0 29 L34 29 L34 35 L0 34 Z" fill="url(#woodGrad)" />
              {/* Leather Grip */}
              <rect x="0" y="28.5" width="22" height="6.5" rx="2" fill="#1E293B" />
              {/* Gold Ring */}
              <rect x="32" y="28" width="4" height="8" rx="1" fill="#E8D099" />
              
              {/* Head Base (Cylinder) */}
              <path d="M36 14 L52 14 L52 50 L36 50 Z" fill="url(#goldGrad)" />
              {/* Head Highlights/3D Effect */}
              <path d="M36 14 L40 14 L40 50 L36 50 Z" fill="#FFF3D4" opacity="0.4" />
              <path d="M48 14 L52 14 L52 50 L48 50 Z" fill="#8C6D43" opacity="0.6" />
              
              {/* Striker Face (Bottom, hits the nail) */}
              <rect x="38" y="50" width="12" height="4" rx="2" fill="#FFF3D4" />
              {/* Top Face */}
              <rect x="38" y="10" width="12" height="4" rx="2" fill="#C59B5F" />

              <defs>
                <linearGradient id="woodGrad" x1="0" y1="29" x2="34" y2="35" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#4E342E" />
                  <stop offset="100%" stopColor="#3E2723" />
                </linearGradient>
                <linearGradient id="goldGrad" x1="36" y1="14" x2="52" y2="50" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#E8D099" />
                  <stop offset="50%" stopColor="#C59B5F" />
                  <stop offset="100%" stopColor="#8C6D43" />
                </linearGradient>
              </defs>
            </svg>
          </Box>
        </Box>

        {/* Brand Logo Reveal */}
        <Box
          className="logo-reveal"
          sx={{
            position: 'relative',
            width: 200,
            height: 100,
            animation: `${logoReveal} 4.5s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
          }}
        >
          <Image 
            src="/logo-product.png" 
            alt="Mohamed Geba Logo" 
            fill 
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>
      </Box>
    </Box>
  );
}
