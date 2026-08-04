'use client';

import { Box, IconButton, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';

export default function Footer() {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto',
        mb: 2,
        px: { xs: 2, md: 4 }, 
        py: { xs: 4, md: 5 },
        bgcolor: '#1B3A4B', 
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3.5,
        boxShadow: '0 8px 32px rgba(27, 58, 75, 0.25)', 
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Background Elements */}
      <Box sx={{ position: 'absolute', top: -50, left: -50, width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.02)', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: -50, right: -50, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.02)', zIndex: 0 }} />

      {/* Main Content Layout */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1, 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: { xs: 4, md: 0 }
      }}>

        {/* Right Side (Visual Right in RTL): Developer Info */}
        <Box sx={{ 
          order: { xs: 2, md: 1 },
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: { xs: 'center', md: 'flex-start' }, 
          gap: 1.5, 
          bgcolor: '#fff',
          p: 2.5,
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
        }}>
          <Typography variant="caption" sx={{ color: '#1B3A4B', fontWeight: 900, letterSpacing: 0.5, fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
            Developed By AshrafGad
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <IconButton component="a" href="https://my-portfolio-frontend-pied-six.vercel.app/" target="_blank" sx={{ color: '#4285F4', bgcolor: 'rgba(66, 133, 244, 0.1)', '&:hover': { bgcolor: '#4285F4', color: '#fff', transform: 'translateY(-2px)' }, transition: 'all 0.2s', width: 38, height: 38 }}>
              <LanguageIcon fontSize="small" />
            </IconButton>
            <IconButton component="a" href="https://wa.me/+201553585239" target="_blank" sx={{ color: '#25D366', bgcolor: 'rgba(37, 211, 102, 0.1)', '&:hover': { bgcolor: '#25D366', color: '#fff', transform: 'translateY(-2px)' }, transition: 'all 0.2s', width: 38, height: 38 }}>
              <WhatsAppIcon fontSize="small" />
            </IconButton>
            <IconButton component="a" href="mailto:ashrafmohamedgad214@gmail.com" target="_blank" sx={{ color: '#EA4335', bgcolor: 'rgba(234, 67, 53, 0.1)', '&:hover': { bgcolor: '#EA4335', color: '#fff', transform: 'translateY(-2px)' }, transition: 'all 0.2s', width: 38, height: 38 }}>
              <EmailIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Divider for Mobile Only */}
        <Box sx={{ order: { xs: 1, md: 2 }, display: { xs: 'block', md: 'none' }, width: '100%', maxWidth: 300, height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)' }} />

        {/* Left Side (Visual Left in RTL): Cafe Info */}
        <Box sx={{ order: { xs: 0, md: 3 }, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-end' }, gap: 2.5 }}>
          {/* Clickable Logo */}
          <Box 
            component="img" 
            src="/logo.png" 
            alt="Nijar" 
            onClick={scrollToTop}
            sx={{ 
              height: 52, 
              cursor: 'pointer',
              filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.5))',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' }
            }} 
          />
          <Typography variant="body2" dir="ltr" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
            © {new Date().getFullYear()} Nijar. All rights reserved.
          </Typography>
          {/* Cafe Social Icons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton component="a" href="https://www.facebook.com/share/1Ebbei8Ysr/?mibextid=wwXIfr" target="_blank" sx={{ color: '#1877F2', bgcolor: '#fff', '&:hover': { bgcolor: '#f0f2f5', transform: 'scale(1.1)' }, transition: 'all 0.2s', width: 40, height: 40, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              <FacebookIcon fontSize="small" />
            </IconButton>
            <IconButton component="a" href="https://www.instagram.com/nijar?igsh=MTBmMWZpOG1oYWd2bA%3D%3D&utm_source=qr" target="_blank" sx={{ color: '#E4405F', bgcolor: '#fff', '&:hover': { bgcolor: '#fcf1f3', transform: 'scale(1.1)' }, transition: 'all 0.2s', width: 40, height: 40, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              <InstagramIcon fontSize="small" />
            </IconButton>
            <IconButton component="a" href="https://wa.me/+201023321047" target="_blank" sx={{ color: '#25D366', bgcolor: '#fff', '&:hover': { bgcolor: '#f0fcf4', transform: 'scale(1.1)' }, transition: 'all 0.2s', width: 40, height: 40, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              <WhatsAppIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

      </Box>

    </Box>
  );
}
