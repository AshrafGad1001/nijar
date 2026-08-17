'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface DesignerMicroBarProps {
  adminName?: string;
  phone?: string;
}

export default function DesignerMicroBar({ adminName, phone }: DesignerMicroBarProps) {
  // Fallback: If either name or phone is missing, don't render the bar at all to save space
  if (!adminName || !phone) return null;

  return (
    <Box
      sx={{
        height: '28px',
        bgcolor: 'rgba(27, 58, 75, 0.04)',
        borderBottom: '1px solid rgba(27, 58, 75, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: '100%',
          gap: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#64748B',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          تصميم وتنفيذ: {adminName}
        </Typography>

        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#64748B',
            flexShrink: 0, // Ensure the separator doesn't shrink
          }}
        >
          |
        </Typography>

        <Typography
          component="a"
          href={`tel:${phone}`}
          sx={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#1B3A4B',
            textDecoration: 'none',
            flexShrink: 0, // CRITICAL: Never truncate the phone number
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#142A38',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            },
          }}
          dir="ltr"
        >
          {phone}
        </Typography>
      </Box>
    </Box>
  );
}
