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
  Alert
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import api from '@/lib/api';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
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
    
    // Basic Client-side Validation
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
      
      if (imageFile) {
        formData.append('adminImage', imageFile);
      }

      await api.put('/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // On-demand revalidation trigger
      try {
        await fetch('/api/revalidate?tag=settings');
      } catch (err) {
        console.error('Revalidation failed', err);
      }

      showSnackbar('تم حفظ الإعدادات بنجاح', 'success');
      
      // Dispatch an event so Sidebar can update
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
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
          إعدادات النظام
        </Typography>
        <Typography variant="body1" color="text.secondary">
          تعديل بيانات الحساب ومعلومات التواصل المعروضة في الموقع
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Admin Profile Picture */}
            <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar 
                  src={imagePreview || adminImage?.url || '/Admin-img.jpg'} 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    bgcolor: 'secondary.main',
                    fontSize: '3rem'
                  }}
                >
                  {adminName ? adminName.charAt(0).toUpperCase() : 'A'}
                </Avatar>
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
                      bottom: 0, 
                      right: 0, 
                      bgcolor: 'background.paper',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '&:hover': { bgcolor: 'background.default' }
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>
            </Grid>

            {/* Admin Name */}
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="اسم الإدارة (الاسم المعروض في لوحة التحكم)"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
              />
            </Grid>

            {/* Address */}
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="العنوان التفصيلي"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Grid>

            {/* Phone Number */}
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="رقم الهاتف (مثال: +20 100 000 0000)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                dir="ltr"
              />
            </Grid>

            {/* WhatsApp Number */}
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="رقم الواتساب (مثال: +20 100 000 0000)"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                dir="ltr"
              />
            </Grid>

            <Grid xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{ px: 4, py: 1.5, borderRadius: 2 }}
              >
                {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
