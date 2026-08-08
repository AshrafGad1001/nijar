'use client';

import { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CatalogNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

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
        bgcolor: 'rgba(250, 252, 255, 0.75)', 
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        boxShadow: isScrolled 
          ? '0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(27, 58, 75, 0.1)' 
          : '0 30px 60px -15px rgba(0, 0, 0, 0.25), 0 12px 24px rgba(27, 58, 75, 0.12), inset 0 1px 0 rgba(255, 255, 255, 1)', 
        borderRadius: isScrolled ? '0px 0px 24px 24px' : '24px', 
        width: '100%',
        maxWidth: isScrolled ? '100%' : '1400px',
        mx: 'auto',
        pointerEvents: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        borderTop: isScrolled ? 'none' : '1px solid rgba(255, 255, 255, 0.9)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(rgba(27, 58, 75, 0.2) 2px, transparent 2px)',
          backgroundSize: '24px 24px',
          opacity: 0.8,
          pointerEvents: 'none',
          WebkitMaskImage: 'linear-gradient(90deg, black 0%, transparent 25%, transparent 75%, black 100%)',
          maskImage: 'linear-gradient(90deg, black 0%, transparent 25%, transparent 75%, black 100%)'
        }
      }}>
        <Toolbar sx={{ justifyContent: 'center', py: 0.5, minHeight: '52px !important' }}>
          <Link 
            href="/" 
            passHref 
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <Box 
              component="img" 
              src="/logo.png" 
              alt="Nijar" 
              sx={{ 
                height: isScrolled ? 40 : 46, 
                filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.4)) drop-shadow(0px 2px 4px rgba(27,58,75,0.3))', 
                transition: 'all 0.3s ease-in-out',
                cursor: 'pointer',
                display: 'block'
              }} 
            />
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
