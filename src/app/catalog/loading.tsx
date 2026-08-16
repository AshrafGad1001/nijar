'use client';

import React from 'react';
import { Box, Skeleton, AppBar, Toolbar } from '@mui/material';
import WorkCardSkeleton from '@/components/public/WorkCardSkeleton';

export default function Loading() {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default', 
        display: 'flex', 
        flexDirection: 'column',
        // Anti-flicker trick: delay the appearance of the skeleton by 300ms
        animation: 'fadeIn 0.3s ease-in 0.3s forwards',
        opacity: 0,
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      }}
    >
      {/* Mock Header to match the real page */}
      <Box sx={{ px: { xs: 1, sm: 2, md: 2 }, pt: { xs: 2, md: 1.5 }, pb: 0, position: 'sticky', top: 0, zIndex: 1100, width: '100%' }}>
        <AppBar position="static" sx={{ 
          bgcolor: 'rgba(10, 41, 71, 0.95)', 
          borderRadius: '20px', 
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <Toolbar sx={{ justifyContent: 'center', py: 0.5, minHeight: '52px !important' }}>
            <Skeleton variant="rectangular" width={120} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }} />
          </Toolbar>
        </AppBar>
      </Box>

      {/* Mock Category Chips */}
      <Box sx={{ display: 'flex', overflowX: 'hidden', gap: 1.5, px: { xs: 2, md: 3 }, mt: 2, pb: 2 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rectangular" width={100} height={36} sx={{ borderRadius: '18px', flexShrink: 0 }} />
        ))}
      </Box>

      {/* Mock Categories & Cards */}
      <Box sx={{ px: { xs: 2, md: 3 }, mt: 4 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 3, pb: 2 }}>
          {[1, 2, 3, 4].map((i) => (
             <WorkCardSkeleton key={i} />
          ))}
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 3 }, mt: 4 }}>
        <Skeleton variant="text" width={180} height={40} sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 3, pb: 2 }}>
          {[1, 2, 3, 4].map((i) => (
             <WorkCardSkeleton key={i} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
