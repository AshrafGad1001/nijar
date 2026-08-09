'use client';

import { Box, IconButton, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SvgIcon from '@mui/material/SvgIcon';

const TiktokIcon = (props: any) => (
  <SvgIcon {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
  </SvgIcon>
);

interface FooterProps {
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  whatsapp?: string;
}

export default function Footer({ facebookUrl, instagramUrl, tiktokUrl, whatsapp }: FooterProps) {
  const pathname = usePathname();

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box 
      component="footer" 
      dir="rtl"
      sx={{ 
        mt: 'auto',
        width: '100%',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)', 
        borderTop: '2px solid rgba(197, 155, 95, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(circle at center top, rgba(197, 155, 95, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Box sx={{ 
        maxWidth: '1400px',
        mx: 'auto',
        px: { xs: 3, md: 6 }, 
        py: { xs: 6, md: 8 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: { xs: 5, md: 0 },
        position: 'relative',
        zIndex: 1
      }}>

        {/* Right Side (Visual Right in RTL): Brand Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, gap: 3, width: { xs: '100%', md: 'auto' } }}>
          <Link 
            href="/" 
            passHref
            onClick={(e) => {
              if (pathname === '/') {
                scrollToTop(e);
              }
            }}
          >
            <Box 
              component="img" 
              src="/logo.png" 
              alt="Nijar" 
              sx={{ 
                height: { xs: 55, md: 65 }, 
                cursor: 'pointer',
                filter: 'drop-shadow(0px 4px 12px rgba(27,58,75,0.08))',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': { transform: 'scale(1.03)', filter: 'drop-shadow(0px 8px 16px rgba(27,58,75,0.12))' },
                display: 'block',
                mx: { xs: 'auto', md: 0 } // Center logo on mobile
              }} 
            />
          </Link>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' }, width: '100%', flexWrap: 'wrap' }}>
            {facebookUrl && (
              <IconButton component="a" href={facebookUrl} target="_blank" sx={{ color: '#1877F2', bgcolor: '#F8FAFC', '&:hover': { bgcolor: '#1877F2', color: '#fff', transform: 'translateY(-3px)', boxShadow: '0 4px 12px rgba(24,119,242,0.2)' }, transition: 'all 0.3s ease', width: 44, height: 44 }}>
                <FacebookIcon sx={{ fontSize: '1.4rem' }} />
              </IconButton>
            )}
            {instagramUrl && (
              <IconButton component="a" href={instagramUrl} target="_blank" sx={{ color: '#E4405F', bgcolor: '#F8FAFC', '&:hover': { bgcolor: '#E4405F', color: '#fff', transform: 'translateY(-3px)', boxShadow: '0 4px 12px rgba(228,64,95,0.2)' }, transition: 'all 0.3s ease', width: 44, height: 44 }}>
                <InstagramIcon sx={{ fontSize: '1.4rem' }} />
              </IconButton>
            )}
            {tiktokUrl && (
              <IconButton component="a" href={tiktokUrl} target="_blank" sx={{ color: '#000000', bgcolor: '#F8FAFC', '&:hover': { bgcolor: '#000000', color: '#fff', transform: 'translateY(-3px)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }, transition: 'all 0.3s ease', width: 44, height: 44 }}>
                <TiktokIcon sx={{ fontSize: '1.4rem' }} />
              </IconButton>
            )}
            {whatsapp && (
              <IconButton component="a" href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" sx={{ color: '#25D366', bgcolor: '#F8FAFC', '&:hover': { bgcolor: '#25D366', color: '#fff', transform: 'translateY(-3px)', boxShadow: '0 4px 12px rgba(37,211,102,0.2)' }, transition: 'all 0.3s ease', width: 44, height: 44 }}>
                <WhatsAppIcon sx={{ fontSize: '1.4rem' }} />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Divider for Mobile */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(27,58,75,0.1), transparent)' }} />

        {/* Left Side (Visual Left in RTL): Developer Badge */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-end' }, gap: 3, width: { xs: '100%', md: 'auto' } }}>
          {/* Premium Glassmorphic Developer Pill */}
          <Box sx={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2.5,
            p: 1,
            pl: 2.5,
            pr: 1,
            borderRadius: '100px',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(197, 155, 95, 0.15)',
            boxShadow: '0 4px 24px rgba(197, 155, 95, 0.06)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 32px rgba(197, 155, 95, 0.12)',
              borderColor: 'rgba(197, 155, 95, 0.4)'
            }
          }}>
            <Box sx={{ textAlign: 'left', direction: 'ltr', pl: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, display: 'block', mb: -0.2, fontSize: '0.7rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                DEVELOPED BY
              </Typography>
              <Typography variant="subtitle2" sx={{ color: '#0F172A', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.3px' }}>
                Ashraf Gad
              </Typography>
            </Box>
            
            <Box sx={{ width: '1px', height: 24, bgcolor: 'rgba(27,58,75,0.15)' }} />
            
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton component="a" href="https://my-portfolio-frontend-pied-six.vercel.app/" target="_blank" sx={{ color: '#4285F4', width: 36, height: 36, bgcolor: 'rgba(66, 133, 244, 0.05)', '&:hover': { bgcolor: '#4285F4', color: '#fff' } }}>
                <LanguageIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
              <IconButton component="a" href="https://wa.me/+201553585239" target="_blank" sx={{ color: '#25D366', width: 36, height: 36, bgcolor: 'rgba(37, 211, 102, 0.05)', '&:hover': { bgcolor: '#25D366', color: '#fff' } }}>
                <WhatsAppIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
              <IconButton component="a" href="mailto:ashrafmohamedgad214@gmail.com" target="_blank" sx={{ color: '#EA4335', width: 36, height: 36, bgcolor: 'rgba(234, 67, 53, 0.05)', '&:hover': { bgcolor: '#EA4335', color: '#fff' } }}>
                <EmailIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
            </Box>
          </Box>

          <Typography variant="body2" dir="ltr" sx={{ color: '#94A3B8', fontWeight: 500, fontSize: '0.85rem', textAlign: 'center' }}>
            © {new Date().getFullYear()} Nijar. All rights reserved.
          </Typography>
        </Box>

      </Box>
    </Box>
  );
}
