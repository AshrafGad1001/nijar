'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Card, Typography, Button, CircularProgress, Box, Avatar } from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

export default function QRCodeGenerator() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [menuUrl, setMenuUrl] = useState('');

  useEffect(() => {
    const url = `${window.location.origin}/menu`;
    setMenuUrl(url);

    QRCode.toDataURL(url, {
      width: 280,
      margin: 1,
      color: {
        dark: '#1E293B',
        light: '#ffffff'
      }
    })
      .then(url => {
        setQrCodeDataUrl(url);
      })
      .catch(err => {
        console.error('Error generating QR code', err);
      });
  }, []);

  return (
    <Card sx={{ 
      p: { xs: 3, sm: 4, md: 5 }, 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      bgcolor: '#fff', 
      border: '1px solid',
      borderColor: 'rgba(0,0,0,0.03)',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', width: 56, height: 56, mb: 2, boxShadow: '0 8px 16px rgba(44, 30, 22, 0.2)' }}>
        <QrCode2Icon fontSize="medium" />
      </Avatar>
      
      <Typography sx={{ typography: { xs: 'h6', md: 'h5' }, fontWeight: 800, color: 'text.primary', mb: 1 }}>
        باركود المنيو
      </Typography>
      <Typography sx={{ typography: { xs: 'body2', md: 'body1' }, color: 'text.secondary', mb: { xs: 3, md: 4 }, px: { xs: 0, sm: 2 }, lineHeight: 1.6 }}>
        اطبع هذا الباركود وضعه على الطاولات ليتمكن العملاء من مسحه وعرض قائمة الطلبات مباشرة.
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 3, md: 5 }, width: '100%' }}>
        {qrCodeDataUrl ? (
          <Box sx={{ 
            background: '#fff', 
            p: 1.5, 
            borderRadius: 4, 
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            border: '1px solid',
            borderColor: 'rgba(0,0,0,0.05)',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.02)' }
          }}>
            <img src={qrCodeDataUrl} alt="Menu QR Code" style={{ width: '220px', height: '220px', display: 'block', borderRadius: '12px' }} />
          </Box>
        ) : (
          <Box sx={{ width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
            <CircularProgress />
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 'auto', width: '100%', flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button 
          component="a"
          href={menuUrl}
          target="_blank"
          rel="noopener noreferrer" 
          variant="outlined"
          startIcon={<VisibilityOutlinedIcon />}
          fullWidth
          sx={{ 
            borderRadius: 3, 
            fontWeight: 700, 
            borderWidth: 2,
            '&:hover': { borderWidth: 2 }
          }}
        >
          عرض المنيو
        </Button>
        <Button 
          component="a"
          href={qrCodeDataUrl} 
          download="nijar-qr.png"
          variant="contained" 
          color="primary"
          startIcon={<DownloadOutlinedIcon />}
          fullWidth
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          تحميل
        </Button>
      </Box>
    </Card>
  );
}
