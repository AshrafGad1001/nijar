'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Slide, useTheme } from '@mui/material';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('nijar_cookie_consent');
    if (!consent) {
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('nijar_cookie_consent', 'accepted');
    setShow(false);
    // Dispatch custom event to trigger analytics loading if needed
    window.dispatchEvent(new Event('cookieConsentAccepted'));
  };

  const handleDecline = () => {
    localStorage.setItem('nijar_cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <Slide direction="up" in={show} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 16, md: 32 },
          left: { xs: 16, md: 32 },
          right: { xs: 16, md: 'auto' },
          maxWidth: { md: 400 },
          bgcolor: '#0F172A',
          color: '#F1F5F9',
          p: 2.5,
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 9999,
        }}
      >
        <Typography variant="body2" sx={{ mb: 2.5, lineHeight: 1.6, opacity: 0.9 }}>
          We use cookies to enhance your browsing experience and analyze site traffic.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            onClick={handleDecline}
            sx={{
              color: '#94A3B8',
              bgcolor: 'transparent',
              fontSize: '0.85rem',
              fontWeight: 600,
              px: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#F1F5F9' },
            }}
          >
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            variant="contained"
            sx={{
              bgcolor: '#F8FAFC',
              color: '#0F172A',
              fontWeight: 700,
              fontSize: '0.85rem',
              px: 3,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#E2E8F0', boxShadow: 'none' },
            }}
          >
            Accept
          </Button>
        </Box>
      </Box>
    </Slide>
  );
}
