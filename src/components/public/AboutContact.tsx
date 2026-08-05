'use client';

import React from 'react';
import { Box, Typography, Container, Grid, Paper, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

interface AboutContactProps {
  address?: string;
  phone?: string;
  whatsapp?: string;
  mapUrl?: string;
}

export default function AboutContact({ 
  address = 'القاهرة، مصر (العنوان التفصيلي قريباً)',
  phone = '+20 000 000 0000',
  whatsapp = '+20 000 000 0000',
  mapUrl = ''
}: AboutContactProps) {
  return (
    <Box sx={{ py: 8, bgcolor: '#ffffff' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* About Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#1B3A4B', mb: 3 }}>
                عن ورشة Nijar
              </Typography>
              <Typography variant="body1" sx={{ color: '#5A6B72', lineHeight: 1.8, fontSize: '1.1rem' }}>
                نحن في Nijar نجمع بين الأصالة والحداثة لنقدم لك أرقى المشغولات الخشبية. 
                منذ سنوات ونحن نصنع قطعاً فنية تضفي لمسة من الدفء والجمال على مساحتك، 
                سواء كانت قطع أثاث رئيسية أو ديكورات خشبية دقيقة. نستخدم أفضل أنواع الأخشاب 
                لضمان متانة وجودة تعيش معك طويلاً.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AvatarIcon icon={<LocationOnIcon />} />
                <Typography variant="body1" sx={{ color: '#1B3A4B', fontWeight: 600 }}>
                  {address}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AvatarIcon icon={<PhoneIcon />} />
                <Typography variant="body1" sx={{ color: '#1B3A4B', fontWeight: 600, direction: 'ltr' }}>
                  {phone}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AvatarIcon icon={<WhatsAppIcon />} />
                <Typography variant="body1" sx={{ color: '#1B3A4B', fontWeight: 600, direction: 'ltr' }}>
                  {whatsapp}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Map Section */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                width: '100%', 
                height: '100%', 
                minHeight: 350,
                borderRadius: '24px', 
                overflow: 'hidden',
                bgcolor: '#F7F9FA',
                border: '1px solid rgba(27, 58, 75, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {/* Fallback Placeholder (when no iframe is provided or while loading) */}
              {!mapUrl && (
                <Box sx={{ textAlign: 'center', p: 3, position: 'absolute', zIndex: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 48, color: 'rgba(27, 58, 75, 0.2)', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'rgba(27, 58, 75, 0.4)', fontWeight: 700 }}>
                    خريطة الموقع
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(27, 58, 75, 0.3)' }}>
                    سيتم إضافة الموقع على خرائط جوجل قريباً
                  </Typography>
                </Box>
              )}

              {/* Dynamic Google Maps Iframe */}
              {mapUrl && (
                <iframe 
                  src={mapUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, zIndex: 2, position: 'relative' }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function AvatarIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <Box sx={{ 
      width: 48, 
      height: 48, 
      borderRadius: '50%', 
      bgcolor: 'rgba(46, 139, 154, 0.1)', 
      color: '#2E8B9A',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexShrink: 0
    }}>
      {icon}
    </Box>
  );
}
