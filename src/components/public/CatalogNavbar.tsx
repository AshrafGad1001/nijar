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
      px: isScrolled ? 0 : { xs: 2, sm: 3, md: 3 }, 
      pt: isScrolled ? 0 : { xs: 1.5, md: 2 }, 
      pb: 0, 
      width: '100%', 
      pointerEvents: 'none',
      transition: 'all 0.3s ease-in-out'
    }}>
      <AppBar position="static" sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.6)', 
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        boxShadow: isScrolled 
          ? '0 24px 64px rgba(15, 23, 42, 0.08)' 
          : '0 12px 40px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 1)', 
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
      }}>
        <Toolbar sx={{ justifyContent: 'center', py: 0, minHeight: { xs: '48px', md: '56px' } }}>
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
                height: { xs: isScrolled ? 36 : 42, md: isScrolled ? 50 : 60 }, 
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
