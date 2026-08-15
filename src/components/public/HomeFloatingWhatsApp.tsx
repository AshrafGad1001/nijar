'use client';

import React from 'react';
import { Box, IconButton, keyframes } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
  }
`;

interface HomeFloatingWhatsAppProps {
  whatsappNumber?: string;
}

export default function HomeFloatingWhatsApp({ whatsappNumber }: HomeFloatingWhatsAppProps) {
  if (!whatsappNumber) return null;

  // Clean phone number for links
  let cleanWhatsapp = whatsappNumber.replace(/\D/g, '');
  if (cleanWhatsapp.startsWith('0')) {
    cleanWhatsapp = '2' + cleanWhatsapp;
  }

  const defaultMessage = 'مرحباً، أتواصل معكم من خلال موقعكم وأود الاستفسار عن منتجاتكم المعروضة.';
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 20, md: 32 },
        right: { xs: 20, md: 32 },
        zIndex: 9999,
      }}
    >
      <IconButton
        component="a"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر الواتساب"
        sx={{
          bgcolor: '#25D366',
          color: '#ffffff',
          width: { xs: 56, md: 64 },
          height: { xs: 56, md: 64 },
          boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: '#128C7E',
            transform: 'scale(1.05) translateY(-4px)',
            boxShadow: '0 6px 20px rgba(37, 211, 102, 0.6)',
          },
          // Pulse animation with respects to prefers-reduced-motion
          animation: `${pulseAnimation} 2s infinite`,
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
          },
        }}
      >
        <WhatsAppIcon sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }} />
      </IconButton>
    </Box>
  );
}
