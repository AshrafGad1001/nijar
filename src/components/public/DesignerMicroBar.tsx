'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

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
        height: '30px',
        background: 'linear-gradient(90deg, rgba(27, 58, 75, 0.02) 0%, rgba(27, 58, 75, 0.06) 50%, rgba(27, 58, 75, 0.02) 100%)',
        borderBottom: '1px solid rgba(27, 58, 75, 0.04)',
        display: { xs: 'flex', md: 'none' },
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10,
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: '100%',
          gap: 0.75,
        }}
      >
        <AutoAwesomeOutlinedIcon sx={{ fontSize: 13, color: '#1B3A4B', opacity: 0.8 }} />
        
        <Typography
          sx={{
            fontSize: '11.5px',
            fontWeight: 600,
            color: '#475569',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            letterSpacing: '0.3px'
          }}
        >
          تم التصميم والتطوير بواسطة {adminName}
        </Typography>

        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#94A3B8',
            flexShrink: 0,
            lineHeight: 1,
            transform: 'translateY(-1px)'
          }}
        >
          •
        </Typography>

        <Typography
          component="a"
          href={`tel:${phone}`}
          sx={{
            fontSize: '11.5px',
            fontWeight: 700,
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
