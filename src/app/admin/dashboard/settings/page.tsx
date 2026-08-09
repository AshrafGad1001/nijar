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
import api from '@/lib/api';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [aboutUsText, setAboutUsText] = useState('');
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

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('adminName', adminName);
      formData.append('address', address);
      formData.append('phone', phone);
      formData.append('whatsapp', whatsapp);
      formData.append('mapUrl', mapUrl);
      formData.append('aboutUsText', aboutUsText);
      
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1B3A4B', mb: 1 }}>
          إعدادات النظام
        </Typography>
        <Typography variant="body1" sx={{ color: '#5A6B72' }}>
          تحكم في بيانات الحساب ومعلومات التواصل المعروضة لزوار الموقع بحرية وسهولة
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {/* Profile Picture Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ 
              borderRadius: '24px', 
              boxShadow: '0 12px 40px rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.05)',
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
                    background: 'linear-gradient(45deg, #2E8B9A, #1B3A4B)',
                    boxShadow: '0 8px 24px rgba(46, 139, 154, 0.25)' 
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
              borderRadius: '24px', 
              boxShadow: '0 12px 40px rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.05)',
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
                  <Grid size={{ xs: 12 }}>
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
                          sx: { borderRadius: 3, bgcolor: '#F9FAFB' }
                        }
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
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
                          sx: { borderRadius: 3, bgcolor: '#F9FAFB' }
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
                          sx: { borderRadius: 3, bgcolor: '#F9FAFB' }
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
                          sx: { borderRadius: 3, bgcolor: '#F9FAFB' }
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
                          sx: { borderRadius: 3, bgcolor: '#F9FAFB' }
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
                      rows={4}
                      variant="outlined"
                      helperText={`${aboutUsText.length} / 600 حرف`}
                      FormHelperTextProps={{
                        sx: { textAlign: 'left', dir: 'ltr' }
                      }}
                      slotProps={{
                        input: {
                          sx: { borderRadius: 3, bgcolor: '#F9FAFB' }
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
                      px: 5, 
                      py: 1.5, 
                      borderRadius: 3,
                      fontSize: '1rem',
                      fontWeight: 700,
                      background: 'linear-gradient(90deg, #1B3A4B 0%, #2E8B9A 100%)',
                      boxShadow: '0 8px 24px rgba(46, 139, 154, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(46, 139, 154, 0.4)',
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
