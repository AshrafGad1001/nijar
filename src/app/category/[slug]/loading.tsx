import React from 'react';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import CatalogNavbar from '@/components/public/CatalogNavbar';
import Footer from '@/components/public/Footer';

export default function Loading() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CatalogNavbar />
      <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', my: 10 }}>
        <CircularProgress size={60} sx={{ color: '#C59B5F', mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          جاري تحميل المنتجات...
        </Typography>
      </Container>
      <Footer />
    </Box>
  );
}
