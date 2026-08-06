import React from 'react';
import { Box, Skeleton, Container } from '@mui/material';
import CatalogNavbar from '@/components/public/CatalogNavbar';
import Footer from '@/components/public/Footer';

export default function Loading() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F9FAFB' }}>
      <CatalogNavbar />
      <Box sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            bgcolor: '#fff', 
            borderRadius: { xs: '20px', sm: '32px' }, 
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }
          }}>
            {/* Left Side: Images */}
            <Box sx={{ width: { xs: '100%', md: '55%' }, p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: { xs: '4/3', md: '1/1', lg: '4/3' }, borderRadius: '24px' }} />
              <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'hidden' }}>
                <Skeleton variant="rectangular" width={90} height={90} sx={{ borderRadius: '16px' }} />
                <Skeleton variant="rectangular" width={90} height={90} sx={{ borderRadius: '16px' }} />
                <Skeleton variant="rectangular" width={90} height={90} sx={{ borderRadius: '16px' }} />
              </Box>
            </Box>

            {/* Right Side: Details */}
            <Box sx={{ width: { xs: '100%', md: '45%' }, p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', dir: 'rtl' }}>
              <Skeleton variant="text" width={80} height={30} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="80%" height={60} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={30} sx={{ mb: 4 }} />
              
              <Skeleton variant="rectangular" width="100%" height={2} sx={{ mb: 4 }} />
              
              <Skeleton variant="text" width={120} height={30} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 1.5, mb: 4 }}>
                <Skeleton variant="rectangular" width={100} height={45} sx={{ borderRadius: '30px' }} />
                <Skeleton variant="rectangular" width={100} height={45} sx={{ borderRadius: '30px' }} />
              </Box>

              <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Skeleton variant="text" width={150} height={60} />
                <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: '16px' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width={100} height={30} />
                  <Skeleton variant="text" width={100} height={30} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
