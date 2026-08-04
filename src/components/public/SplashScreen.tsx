'use client';

import React, { useEffect, useState } from 'react';
import { Box, Fade, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const fillAnimation = keyframes`
  0% {
    background-size: 0% 100%;
  }
  100% {
    background-size: 100% 100%;
  }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.02);
  }
`;

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Start fade out after 2.5 seconds to allow animation to complete
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    // Completely unmount after transition (2.5s + 0.5s fade)
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 3000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <Fade in={isVisible} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999, // ensures it sits above absolutely everything
          backgroundColor: '#0A2947', // Premium dark blue
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ animation: `${floatAnimation} 3s ease-in-out infinite` }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '3.5rem', sm: '5rem', md: '6.5rem' },
              textTransform: 'uppercase',
              letterSpacing: '4px',
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.15)', // Faint outline
              backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #C49A45 100%)', // Fill gradient (White to Gold)
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'left center', // Start filling from left
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              backgroundSize: '0% 100%',
              animation: `${fillAnimation} 2s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
              filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.4))',
              m: 0,
              lineHeight: 1,
            }}
          >
            Nijar
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
}
