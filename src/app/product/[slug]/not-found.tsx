import React from 'react';
import { Box, Typography } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import Link from 'next/link';
import CatalogNavbar from '@/components/public/CatalogNavbar';
import Footer from '@/components/public/Footer';

export default function NotFound() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CatalogNavbar settings={null} />
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 3,
        textAlign: 'center',
        bgcolor: '#F9FAFB'
      }}>
        <WarningAmberRoundedIcon sx={{ fontSize: 80, color: '#D97706', mb: 3 }} />
        <Typography variant="h2" sx={{ fontWeight: 900, color: '#1B3A4B', mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
          عذراً، المنتج غير موجود
        </Typography>
        <Typography variant="body1" sx={{ color: '#5A6B72', mb: 4, fontSize: '1.2rem', maxWidth: '600px' }}>
          قد يكون تم حذف هذا المنتج أو أن الرابط غير صحيح.
        </Typography>
        <Link href="/catalog" style={{ textDecoration: 'none' }}>
          <Box sx={{ 
            bgcolor: '#1B3A4B', 
            color: '#fff', 
            px: 4, 
            py: 1.5, 
            borderRadius: '12px',
            fontWeight: 700,
            transition: 'all 0.3s',
            boxShadow: '0 8px 24px rgba(27, 58, 75, 0.2)',
            display: 'inline-block'
          }}>
            العودة للكتالوج
          </Box>
        </Link>
      </Box>
      <Footer />
    </Box>
  );
}
