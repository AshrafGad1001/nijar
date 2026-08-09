'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  Avatar, 
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Divider,
  InputAdornment
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MapIcon from '@mui/icons-material/Map';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import SvgIcon from '@mui/material/SvgIcon';
import api from '@/lib/api';

const TiktokIcon = (props: any) => (
  <SvgIcon {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
  </SvgIcon>
);

const luxuryInputProps = {
  borderRadius: '16px', 
  bgcolor: '#FAFCFD',
  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.02)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(15, 23, 42, 0.06)',
    borderWidth: '1.5px'
  },
  '&:hover': {
    bgcolor: '#FFFFFF',
    boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
    transform: 'translateY(-2px)'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(197, 155, 95, 0.4)'
  },
  '&.Mui-focused': {
    bgcolor: '#FFFFFF',
    boxShadow: '0 12px 32px rgba(197, 155, 95, 0.15)',
    transform: 'translateY(-2px)'
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#C59B5F',
    borderWidth: '2px'
  }
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [aboutUsText, setAboutUsText] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [adminImage, setAdminImage] = useState<{ url: string; publicId: string } | null>(null);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      const data = res.data.data;
      setAdminName(data.adminName || '');
      setAddress(data.address || '');
      setPhone(data.phone || '');
      setWhatsapp(data.whatsapp || '');
      setMapUrl(data.mapUrl || '');
      setAboutUsText(data.aboutUsText || '');
      setFacebookUrl(data.facebookUrl || '');
      setInstagramUrl(data.instagramUrl || '');
      setTiktokUrl(data.tiktokUrl || '');
      setAdminImage(data.adminImage?.url ? data.adminImage : null);
    } catch (error) {
      console.error('Failed to fetch settings', error);
      showSnackbar('فشل تحميل الإعدادات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminName.trim() || !address.trim() || !phone.trim() || !whatsapp.trim()) {
      showSnackbar('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    if (phone.length < 10 || whatsapp.length < 10) {
      showSnackbar('أرقام الهواتف قصيرة جداً', 'error');
      return;
    }

    const urlRegex = /^https?:\/\/.+/;
    if (facebookUrl && !urlRegex.test(facebookUrl)) {
      showSnackbar('رابط فيسبوك غير صحيح (يجب أن يبدأ بـ http أو https)', 'error');
      return;
    }
    if (instagramUrl && !urlRegex.test(instagramUrl)) {
      showSnackbar('رابط إنستجرام غير صحيح (يجب أن يبدأ بـ http أو https)', 'error');
      return;
    }
    if (tiktokUrl && !urlRegex.test(tiktokUrl)) {
      showSnackbar('رابط تيك توك غير صحيح (يجب أن يبدأ بـ http أو https)', 'error');
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('adminName', adminName);
      formData.append('address', address);
      formData.append('phone', phone);
      formData.append('whatsapp', whatsapp);
      formData.append('mapUrl', mapUrl);
      formData.append('aboutUsText', aboutUsText);
      formData.append('facebookUrl', facebookUrl);
      formData.append('instagramUrl', instagramUrl);
      formData.append('tiktokUrl', tiktokUrl);
      
      if (imageFile) {
        formData.append('adminImage', imageFile);
      }

      await api.put('/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      try {
        await fetch('/api/revalidate?tag=settings');
      } catch (err) {
        console.error('Revalidation failed', err);
      }

      showSnackbar('تم حفظ الإعدادات بنجاح', 'success');
      window.dispatchEvent(new Event('settings-updated'));
      
    } catch (error: any) {
      console.error('Failed to save settings', error);
      showSnackbar(error.response?.data?.message || 'حدث خطأ أثناء حفظ الإعدادات', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#2E8B9A' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4, maxWidth: '1000px', mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: 6, position: 'relative' }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0F172A', mb: 1, letterSpacing: '-0.5px' }}>
          إعدادات النظام
        </Typography>
        <Typography variant="body1" sx={{ color: '#5A6B72', fontSize: '1.1rem' }}>
          تحكم في بيانات الحساب ومعلومات التواصل المعروضة لزوار الموقع بحرية وسهولة
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Box sx={{ width: 48, height: 4, background: 'linear-gradient(90deg, #C59B5F, #E8D099)', borderRadius: 2 }} />
          <Box sx={{ width: 8, height: 4, bgcolor: '#C59B5F', borderRadius: 2, opacity: 0.6 }} />
          <Box sx={{ width: 4, height: 4, bgcolor: '#C59B5F', borderRadius: '50%', opacity: 0.4 }} />
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {/* Profile Picture Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ 
              borderRadius: '32px', 
              boxShadow: '0 24px 64px rgba(15, 23, 42, 0.08), 0 4px 16px rgba(15, 23, 42, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              borderTop: '2px solid #FFFFFF',
              background: 'linear-gradient(145deg, #FFFFFF 0%, #FAFCFD 100%)',
              overflow: 'visible' 
            }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: { xs: 3, sm: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B3A4B', mb: 4, alignSelf: 'flex-start' }}>
                  الصورة الشخصية
                </Typography>
                
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <Box sx={{ 
                    p: 0.5, 
                    borderRadius: '50%', 
                    background: 'linear-gradient(45deg, #C59B5F, #E8D099)',
                    boxShadow: '0 12px 32px rgba(197, 155, 95, 0.35)' 
                  }}>
                    <Avatar 
                      src={imagePreview || adminImage?.url || '/Admin-img.jpg'} 
                      sx={{ 
                        width: 140, 
                        height: 140, 
                        bgcolor: '#F7F9FA',
                        color: '#1B3A4B',
                        fontSize: '3.5rem',
                        fontWeight: 900,
                        border: '4px solid #fff'
                      }}
                    >
                      {adminName ? adminName.charAt(0).toUpperCase() : 'A'}
                    </Avatar>
                  </Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="icon-button-file"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton 
                      color="primary" 
                      aria-label="upload picture" 
                      component="span"
                      sx={{ 
                        position: 'absolute', 
                        bottom: 4, 
                        right: 4, 
                        bgcolor: '#fff',
                        color: '#2E8B9A',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        '&:hover': { bgcolor: '#F7F9FA', transform: 'scale(1.05)' },
                        transition: 'all 0.2s ease',
                        width: 44,
                        height: 44
                      }}
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </Box>
                <Typography variant="caption" sx={{ color: '#5A6B72', textAlign: 'center', mt: 2, display: 'block' }}>
                  يفضل استخدام صورة مربعة بجودة عالية (JPG, PNG)
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Account Details Card */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ 
              borderRadius: '32px', 
              boxShadow: '0 24px 64px rgba(15, 23, 42, 0.08), 0 4px 16px rgba(15, 23, 42, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              borderTop: '2px solid #FFFFFF',
              background: 'linear-gradient(145deg, #FFFFFF 0%, #FAFCFD 100%)',
              height: '100%'
            }}>
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B3A4B', mb: 1 }}>
                  المعلومات الأساسية
                </Typography>
                <Typography variant="body2" sx={{ color: '#5A6B72', mb: 4 }}>
                  هذه المعلومات ستظهر في القائمة الجانبية وقسم التواصل في الموقع العام
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="اسم الإدارة (يعرض في لوحة التحكم)"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      required
                      variant="outlined"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                          sx: luxuryInputProps
                        }
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="العنوان التفصيلي"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      variant="outlined"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlinedIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                          sx: luxuryInputProps
                        }
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="رقم الهاتف (للاتصال المباشر)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      dir="ltr"
                      variant="outlined"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneOutlinedIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                          sx: luxuryInputProps
                        }
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="رقم الواتساب (للمحادثات)"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      required
                      dir="ltr"
                      variant="outlined"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <WhatsAppIcon sx={{ color: '#25D366' }} />
                            </InputAdornment>
                          ),
                          sx: luxuryInputProps
                        }
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="رابط خرائط جوجل (Google Maps Embed URL أو كود iframe)"
                      value={mapUrl}
                      onChange={(e) => {
                        let value = e.target.value;
                        // Automatically extract src if the user pasted the full iframe HTML
                        if (value.includes('<iframe') && value.includes('src="')) {
                          const srcMatch = value.match(/src="([^"]+)"/);
                          if (srcMatch && srcMatch[1]) {
                            value = srcMatch[1];
                          }
                        }
                        setMapUrl(value);
                      }}
                      variant="outlined"
                      dir="ltr"
                      placeholder="<iframe src='https://www.google.com/maps/embed?pb=...' ...> أو الرابط المباشر"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <MapIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                          sx: luxuryInputProps
                        }
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="نبذة عن المعرض (قسم من نحن)"
                      value={aboutUsText}
                      onChange={(e) => {
                        if (e.target.value.length <= 600) {
                          setAboutUsText(e.target.value);
                        }
                      }}
                      required
                      multiline
                      rows={3}
                      variant="outlined"
                      helperText={`${aboutUsText.length} / 600 حرف`}
                      slotProps={{
                        formHelperText: { sx: { textAlign: 'left', dir: 'ltr' } },
                        input: { sx: luxuryInputProps },
                        htmlInput: { maxLength: 600 }
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 4 }} />
                
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B3A4B', mb: 1 }}>
                  وسائل التواصل الاجتماعي
                </Typography>
                <Typography variant="body2" sx={{ color: '#5A6B72', mb: 4 }}>
                  روابط الحسابات الرسمية (تُعرض في أسفل الموقع - الفوتر). يمكنك ترك الحقل فارغاً لإخفاء الأيقونة.
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      label="رابط صفحة فيسبوك"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      variant="outlined"
                      dir="ltr"
                      placeholder="https://facebook.com/..."
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <FacebookIcon sx={{ color: '#1877F2' }} />
                            </InputAdornment>
                          ),
                          sx: luxuryInputProps
                        }
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      label="رابط حساب إنستجرام"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      variant="outlined"
                      dir="ltr"
                      placeholder="https://instagram.com/..."
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <InstagramIcon sx={{ color: '#E4405F' }} />
                            </InputAdornment>
                          ),
                          sx: luxuryInputProps
                        }
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      label="رابط حساب تيك توك"
                      value={tiktokUrl}
                      onChange={(e) => setTiktokUrl(e.target.value)}
                      variant="outlined"
                      dir="ltr"
                      placeholder="https://tiktok.com/@..."
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <TiktokIcon sx={{ color: '#000000' }} />
                            </InputAdornment>
                          ),
                          sx: luxuryInputProps
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 4 }} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{ 
                      px: 6, 
                      py: 2, 
                      borderRadius: 4,
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #0F172A 0%, #1B3A4B 100%)',
                      color: '#FFFFFF',
                      boxShadow: '0 12px 32px rgba(15, 23, 42, 0.25)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '50%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transform: 'skewX(-20deg)',
                        transition: 'all 0.7s ease',
                      },
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.35)',
                      },
                      '&:hover::before': {
                        left: '150%',
                      }
                    }}
                  >
                    {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                  </Button>
                </Box>

              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%', borderRadius: 3, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
