'use client';

import { Box, Card, Skeleton } from '@mui/material';

export default function WorkCardSkeleton() {
  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        overflow: 'hidden',
        bgcolor: '#ffffff',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
      }}
    >
      {/* IMAGE CONTAINER (Square 1:1) */}
      <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden', bgcolor: '#F8FAFC' }}>
        <Skeleton 
          variant="rectangular" 
          animation="wave"
          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </Box>

      {/* CONTENT */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 2.5, sm: 3 } }}>
        {/* Title */}
        <Skeleton variant="text" animation="wave" width="80%" height={28} sx={{ mb: 1, borderRadius: 1 }} />
        <Skeleton variant="text" animation="wave" width="60%" height={28} sx={{ mb: 2, borderRadius: 1 }} />

        {/* Sizes/Tags Area (Optional but good to occupy space) */}
        <Skeleton variant="rectangular" animation="wave" width="100%" height={32} sx={{ mb: 2, borderRadius: '100px' }} />

        {/* PRICE AREA */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mt: 'auto', pt: 1.5 }}>
          <Box>
            <Skeleton variant="text" animation="wave" width={60} height={20} sx={{ mb: 0.5, borderRadius: 1 }} />
            <Skeleton variant="text" animation="wave" width={100} height={32} sx={{ borderRadius: 1 }} />
          </Box>
          <Skeleton variant="circular" animation="wave" width={42} height={42} />
        </Box>
      </Box>
    </Card>
  );
}
