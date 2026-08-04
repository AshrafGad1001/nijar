'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Product } from '@/types';
import { Box, Typography, Button, Snackbar, Alert, Chip, CircularProgress, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import DeleteIcon from '@mui/icons-material/Delete';

export default function HeroSlidesPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const fetchHeroSlides = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/products/hero-slides');
      setItems(res.data.data);
    } catch (error) {
      console.error('Failed to load hero slides:', error);
      showToast('Failed to load Hero Slides', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroSlides();
  }, [fetchHeroSlides]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRemoveClick = (itemId: string) => {
    setItemToRemove(itemId);
  };

  const confirmRemove = async () => {
    if (!itemToRemove) return;
    try {
      await api.put(`/products/${itemToRemove}`, { isHeroSlide: false });
      showToast('تمت الإزالة بنجاح', 'success');
      fetchHeroSlides();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to remove from Hero Slides', 'error');
    } finally {
      setItemToRemove(null);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SlideshowIcon sx={{ color: '#2E8B9A', fontSize: 32 }} />
            الصور المميزة
          </Typography>
          <Typography variant="body1" color="text.secondary">
            إدارة العناصر في شريط العرض الرئيسي (حد أقصى 10 عناصر)
          </Typography>
        </Box>
        <Chip 
          label={`${items.length} / 10`} 
          color={items.length >= 10 ? 'error' : 'success'} 
          sx={{ fontWeight: 'bold', fontSize: '1.1rem', px: 1 }} 
        />
      </Box>

      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'background.paper', borderRadius: 4, border: '1px dashed #ccc' }}>
          <SlideshowIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">لا توجد عناصر في قائمة الصور المميزة</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {items.map((item) => (
            <Paper
              key={item._id}
              elevation={0}
              sx={{ 
                p: { xs: 1.5, md: 2 }, 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 1, md: 2 },
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'rgba(0,0,0,0.06)',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#2E8B9A',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {/* Top Section: Info & Price */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 1.5, sm: 2 }, width: '100%', mb: { xs: 1.5, sm: 2 } }}>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', sm: 'auto' }, flexGrow: 1 }}>
                    {/* Image */}
                    {item.image?.url ? (
                      <Box component="img" src={item.image.url} alt={item.name} sx={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid', borderColor: 'primary.light', flexShrink: 0 }} />
                    ) : (
                      <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid', borderColor: 'divider', flexShrink: 0 }}>
                        <SlideshowIcon sx={{ color: 'text.secondary' }} />
                      </Box>
                    )}

                    {/* Title & Category */}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', md: '1.15rem' }, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{typeof item.category === 'object' ? (item.category as any).name : 'Category'}</Typography>
                    </Box>
                  </Box>

                  {/* Price / Sizes */}
                  <Box sx={{ minWidth: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'right', sm: 'left' }, display: 'flex', justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                    {item.hasSizes && item.sizes && item.sizes.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                        {item.sizes.map((s: any) => (
                          <Chip key={s.name} label={`${s.name}: ${s.price}`} size="small" sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: 'rgba(27, 58, 75, 0.05)', color: '#1B3A4B' }} />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', px: 1.5, py: 0.5, bgcolor: 'rgba(27, 58, 75, 0.05)', borderRadius: 2, display: 'inline-block' }}>
                        {item.price} ج.م
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Divider */}
                <Box sx={{ height: '1px', bgcolor: 'rgba(0,0,0,0.06)', width: '100%', mb: { xs: 1.5, sm: 2 } }} />

                {/* Bottom Section: Actions */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                  
                  {/* Availability Display */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: item.isAvailable ? 'rgba(46, 125, 50, 0.08)' : 'rgba(0, 0, 0, 0.04)', px: 1.5, py: 0.5, borderRadius: 10 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: item.isAvailable ? 'success.main' : 'text.secondary' }}>
                      {item.isAvailable ? 'متاح' : 'غير متاح'}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      size="small" 
                      color="error" 
                      variant="outlined" 
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemoveClick(item._id)}
                      sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                      إزالة من الصور المميزة
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast?.type} variant="filled" sx={{ width: '100%' }}>
          {toast?.message}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog
        open={!!itemToRemove}
        onClose={() => setItemToRemove(null)}
        sx={{ '& .MuiDialog-paper': { borderRadius: 4, p: 1, minWidth: { xs: 300, sm: 400 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'text.primary', textAlign: 'center' }}>
          تأكيد الإزالة
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center', fontWeight: 600, color: 'text.secondary', mt: 1 }}>
            هل أنت متأكد أنك تريد إزالة هذه القطعة من شريط العرض؟
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          <Button 
            onClick={() => setItemToRemove(null)} 
            sx={{ fontWeight: 700, borderRadius: 2, px: 3, color: 'text.secondary' }}
          >
            إلغاء
          </Button>
          <Button 
            onClick={confirmRemove} 
            variant="contained" 
            color="error" 
            sx={{ fontWeight: 700, borderRadius: 2, px: 3, boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)' }}
          >
            إزالة
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
