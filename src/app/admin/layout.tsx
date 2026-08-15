'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { Box, CircularProgress, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('nijar_token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [pathname, router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Login page gets no sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#F1F5F9' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', bgcolor: '#F1F5F9', zoom: { xs: 1, md: 0.85 } }}>
      <Box 
        component="header" 
        sx={{ 
          display: { xs: 'block', md: 'none' }, 
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          px: 1,
          pt: 1.5,
          pb: 0.5,
          width: '100%',
        }}
      >
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          px: 1,
          py: 0.5,
          minHeight: '52px',
          bgcolor: 'rgba(250, 252, 255, 0.75)', 
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(27, 58, 75, 0.1)', 
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderTop: '1px solid rgba(255, 255, 255, 0.9)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'radial-gradient(rgba(27, 58, 75, 0.2) 2px, transparent 2px)',
            backgroundSize: '24px 24px',
            opacity: 0.8,
            pointerEvents: 'none',
            WebkitMaskImage: 'linear-gradient(90deg, black 0%, transparent 25%, transparent 75%, black 100%)',
            maskImage: 'linear-gradient(90deg, black 0%, transparent 25%, transparent 75%, black 100%)'
          }
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ color: '#1B3A4B', zIndex: 1 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', zIndex: 1, pr: 5 }}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ 
                height: '36px', 
                filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.4)) drop-shadow(0px 2px 4px rgba(27,58,75,0.3))' 
              }} 
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3, md: 4 }, 
            width: { md: `calc(100% - 280px)` },
            minWidth: 0,
            overflowX: 'hidden'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
