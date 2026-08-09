'use client';

import React from 'react';
import { Box, Typography, Container, Paper, Link as MuiLink } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface AboutContactProps {
  address?: string;
  phone?: string;
  whatsapp?: string;
  mapUrl?: string;
}

export default function AboutContact({ 
  address = 'القاهرة، مصر',
  phone = '+20 000 000 0000',
  whatsapp = '+20 000 000 0000',
  mapUrl = ''
}: AboutContactProps) {
  
  // Clean phone number for links
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^0-9+]/g, '');

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#ffffff' }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
          gap: { xs: 6, md: 8 },
          alignItems: 'start'
        }}>
          
          {/* Text Section */}
          <Box sx={{ order: { xs: 1, md: 1 }, dir: 'rtl' }}>
            <Box sx={{ mb: 5, textAlign: 'left' }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: '#D97706', 
                  fontWeight: 800, 
                  letterSpacing: 1.5,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 2,
                  mb: 2,
                  direction: 'rtl'
                }}
              >
                <Box component="span" sx={{ width: 25, height: '2px', bgcolor: '#D97706', opacity: 0.5 }} />
                من نحن
                <Box component="span" sx={{ width: 25, height: '2px', bgcolor: '#D97706', opacity: 0.5 }} />
              </Typography>
              
              <Box 
                component="img" 
                src="/logo.png" 
                alt="Nijar Logo" 
                sx={{ 
                  height: { xs: 80, md: 100 }, 
                  mb: 3,
                  filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.15)) drop-shadow(0px 2px 4px rgba(27,58,75,0.1))',
                  display: 'block'
                }} 
              />
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#5A6B72', 
                  lineHeight: 1.8, 
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  textAlign: 'left',
                  maxWidth: '100%',
                  direction: 'rtl'
                }}
              >
                نحن في Nijar نجمع بين الأصالة والحداثة لنقدم لك أرقى المشغولات الخشبية. 
                منذ تأسيسنا ونحن نصنع قطعاً فنية تعكس شغفنا من الخشب والجمال في تفاصيله. 
                سواء كانت قطع أثاث رئيسية أو ديكورات خشبية دقيقة، نستخدم أفضل أنواع الأخشاب 
                لضمان متانة وجودة تعيش معك طويلاً.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <ContactCard 
                icon={<LocationOnIcon />} 
                title="الموقع" 
                subtitle={address} 
              />
              <ContactCard 
                icon={<PhoneIcon />} 
                title="اتصل بنا" 
                subtitle={phone} 
                href={`tel:${cleanPhone}`}
              />
              <ContactCard 
                icon={<WhatsAppIcon />} 
                title="واتساب" 
                subtitle={whatsapp} 
                href={`https://wa.me/${cleanWhatsapp}`}
              />
            </Box>
          </Box>

          {/* Map Section */}
          <Box sx={{ order: { xs: 2, md: 2 }, position: 'relative', height: '100%', minHeight: 450 }}>
            <Paper 
              elevation={0}
              sx={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '24px', 
                overflow: 'hidden',
                bgcolor: '#F7F9FA',
                border: '1px solid rgba(27, 58, 75, 0.08)',
                boxShadow: '0 20px 40px rgba(27,58,75,0.06)',
                position: 'relative'
              }}
            >
              {!mapUrl && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 3 }}>
                  <LocationOnIcon sx={{ fontSize: 48, color: 'rgba(27, 58, 75, 0.2)', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'rgba(27, 58, 75, 0.4)', fontWeight: 700 }}>
                    خريطة الموقع
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(27, 58, 75, 0.3)' }}>
                    سيتم إضافة الموقع قريباً
                  </Typography>
                </Box>
              )}

              {mapUrl && (
                <>
                  <iframe 
                    src={mapUrl} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  
                  {/* Floating Action Button for Map */}
                  <Box 
                    component="a"
                    href={mapUrl.replace('embed', 'viewer')} 
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      position: 'absolute',
                      bottom: 24,
                      right: 24, // Changed from left to right for RTL map
                      bgcolor: '#fff',
                      px: 3,
                      py: 1.5,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <LocationOnIcon sx={{ color: '#D97706' }} />
                    <Typography sx={{ color: '#1B3A4B', fontWeight: 700, fontSize: '0.9rem' }}>
                      فتح في خرائط جوجل
                    </Typography>
                    <OpenInNewIcon sx={{ color: '#5A6B72', fontSize: '1.1rem' }} />
                  </Box>
                </>
              )}
            </Paper>
          </Box>
          
        </Box>
      </Container>
    </Box>
  );
}

// Subcomponent for the elegant contact cards
function ContactCard({ icon, title, subtitle, href }: { icon: React.ReactNode, title: string, subtitle: string, href?: string }) {
  const content = (
    <Paper
      dir="rtl" // Force RTL context at the HTML level
      elevation={0}
      sx={{
        display: 'grid',
        gridTemplateColumns: '54px 1fr', // icon box is 54px, text takes remaining space
        alignItems: 'center',
        gap: 2.5,
        p: 2,
        borderRadius: '16px',
        border: '1px solid rgba(27, 58, 75, 0.1)',
        bgcolor: '#ffffff',
        transition: 'all 0.3s ease',
        textDecoration: 'none',
        width: '100%',
        minWidth: { xs: '100%', md: 380 },
        maxWidth: 450,
        '&:hover': href ? {
          borderColor: '#2E8B9A',
          boxShadow: '0 8px 24px rgba(46, 139, 154, 0.1)',
          transform: 'translateX(-4px)'
        } : {}
      }}
    >
      <Box sx={{ 
        width: 54, 
        height: 54, 
        borderRadius: '14px', 
        bgcolor: '#1B3A4B', 
        color: '#ffffff',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(27,58,75,0.15)'
      }}>
        {React.cloneElement(icon as React.ReactElement, { sx: { fontSize: 26 } } as any)}
      </Box>

      {/* Align text to the left so it touches the icon in the 1fr column */}
      <Box sx={{ textAlign: 'left' }}>
        <Typography variant="caption" sx={{ color: '#D97706', fontWeight: 800, fontSize: '0.85rem', mb: 0.5, display: 'block' }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: '#1B3A4B', fontWeight: 700, fontSize: '1.05rem', direction: href ? 'ltr' : 'rtl', display: 'inline-block' }}>
          {subtitle}
        </Typography>
      </Box>
    </Paper>
  );

  if (href) {
    return (
      <Box component="a" href={href} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none', display: 'block' }}>
        {content}
      </Box>
    );
  }

  return content;
}
