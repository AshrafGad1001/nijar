'use client';

import { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar } from '@mui/material';

export default function MenuNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Snap to top when scrolled down a bit
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ 
      px: isScrolled ? 0 : { xs: 1, sm: 2, md: 2 }, 
      pt: isScrolled ? 0 : { xs: 2, md: 1.5 }, 
      pb: 0, 
      width: '100%', 
      pointerEvents: 'none',
      transition: 'all 0.3s ease-in-out'
    }}>
      <AppBar position="static" sx={{ 
        bgcolor: 'rgba(27, 58, 75, 0.95)', 
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: isScrolled ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 32px rgba(27, 58, 75, 0.25)', 
        borderRadius: isScrolled ? '0px 0px 24px 24px' : '24px', 
        width: '100%',
        maxWidth: isScrolled ? '100%' : '1400px',
        mx: 'auto',
        pointerEvents: 'auto',
        border: '1px solid rgba(255,255,255,0.08)',
        borderTop: isScrolled ? 'none' : '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.3s ease-in-out'
      }}>
        <Toolbar sx={{ justifyContent: 'center', py: 0.5, minHeight: '52px !important' }}>
          <Box 
            component="img" 
            src="/logo.png" 
            alt="Nijar" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            sx={{ 
              height: isScrolled ? 34 : 40, 
              filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))', 
              transition: 'all 0.3s ease-in-out',
              cursor: 'pointer'
            }} 
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
