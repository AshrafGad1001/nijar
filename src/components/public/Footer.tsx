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
  
  let cleanWhatsapp = '';
  if (whatsapp) {
    cleanWhatsapp = whatsapp.replace(/\D/g, '');
    if (cleanWhatsapp.startsWith('0')) cleanWhatsapp = '2' + cleanWhatsapp;
  }

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
      {/* Social Media Strip - Premium Redesign */}
      <Box sx={{ 
        background: 'linear-gradient(90deg, #09101A 0%, #152238 50%, #09101A 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        py: { xs: 3.5, md: 4 }, 
        px: { xs: 3, md: 6 }, 
        position: 'relative', 
        zIndex: 2,
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Decorative Gold lines */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.8), transparent)' }} />
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)' }} />
        
        {/* Subtle Background Glow */}
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Box sx={{ maxWidth: '1400px', mx: 'auto', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: { xs: 3, sm: 2 }, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 4, height: 32, background: 'linear-gradient(to bottom, #D4AF37, #E8D099)', borderRadius: 2 }} />
            <Typography variant="h5" sx={{ 
              color: '#ffffff', 
              fontWeight: 900, 
              letterSpacing: '-0.5px',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              fontSize: { xs: '1.4rem', md: '1.6rem' }
            }}>
              تابعنا على السوشيال ميديا
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: { xs: 2, md: 2.5 } }}>
            {facebookUrl && (
              <IconButton 
                component="a" 
                href={facebookUrl} 
                target="_blank" 
                sx={{ 
                  color: '#fff', 
                  bgcolor: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                  width: { xs: 48, md: 54 }, 
                  height: { xs: 48, md: 54 },
                  '&:hover': { 
                    bgcolor: '#1877F2', 
                    color: '#fff', 
                    transform: 'translateY(-5px) scale(1.1)', 
                    boxShadow: '0 10px 25px rgba(24, 119, 242, 0.5)',
                    borderColor: '#1877F2'
                  } 
                }}>
                <FacebookIcon sx={{ fontSize: { xs: '1.6rem', md: '1.9rem' } }} />
              </IconButton>
            )}
            {instagramUrl && (
              <IconButton 
                component="a" 
                href={instagramUrl} 
                target="_blank" 
                sx={{ 
                  color: '#fff', 
                  bgcolor: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                  width: { xs: 48, md: 54 }, 
                  height: { xs: 48, md: 54 },
                  '&:hover': { 
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', 
                    color: '#fff', 
                    transform: 'translateY(-5px) scale(1.1)', 
                    boxShadow: '0 10px 25px rgba(228, 64, 95, 0.5)',
                    borderColor: 'transparent'
                  } 
                }}>
                <InstagramIcon sx={{ fontSize: { xs: '1.6rem', md: '1.9rem' } }} />
              </IconButton>
            )}
            {tiktokUrl && (
              <IconButton 
                component="a" 
                href={tiktokUrl} 
                target="_blank" 
                sx={{ 
                  color: '#fff', 
                  bgcolor: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                  width: { xs: 48, md: 54 }, 
                  height: { xs: 48, md: 54 },
                  '&:hover': { 
                    bgcolor: '#000000', 
                    color: '#fff', 
                    transform: 'translateY(-5px) scale(1.1)', 
                    boxShadow: '0 10px 25px rgba(255, 255, 255, 0.3)',
                    borderColor: '#fff'
                  } 
                }}>
                <TiktokIcon sx={{ fontSize: { xs: '1.6rem', md: '1.9rem' } }} />
              </IconButton>
            )}
            {cleanWhatsapp && (
              <IconButton 
                component="a" 
                href={`https://wa.me/${cleanWhatsapp}`} 
                target="_blank" 
                sx={{ 
                  color: '#fff', 
                  bgcolor: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                  width: { xs: 48, md: 54 }, 
                  height: { xs: 48, md: 54 },
                  '&:hover': { 
                    bgcolor: '#25D366', 
                    color: '#fff', 
                    transform: 'translateY(-5px) scale(1.1)', 
                    boxShadow: '0 10px 25px rgba(37, 211, 102, 0.5)',
                    borderColor: '#25D366'
                  } 
                }}>
                <WhatsAppIcon sx={{ fontSize: { xs: '1.6rem', md: '1.9rem' } }} />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

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
