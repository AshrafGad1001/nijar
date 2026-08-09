import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import Link from 'next/link';
import CatalogNavbar from '@/components/public/CatalogNavbar';
import Footer from '@/components/public/Footer';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function NotFound() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CatalogNavbar />
      <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', my: 10 }}>
        <WarningAmberIcon sx={{ fontSize: 80, color: '#FFB020', mb: 3 }} />
        <Typography variant="h4" color="text.primary" sx={{ fontWeight: 700 }} gutterBottom>
          عذراً، القسم غير موجود
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          الرابط الذي تحاول الوصول إليه غير صحيح أو تم حذف هذا القسم.
        </Typography>
        <Link href="/catalog" passHref style={{ textDecoration: 'none' }}>
          <Button variant="contained" sx={{ borderRadius: 2 }}>
            العودة للكتالوج
          </Button>
        </Link>
      </Container>
      <Footer />
    </Box>
  );
}
