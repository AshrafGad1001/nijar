'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Product } from '@/types';
import { Box, Typography, Button, Snackbar, Alert, Grid, Card, CardMedia, CardContent, CardActions, Chip, CircularProgress, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';

export default function BestSellersPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const fetchBestSellers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/products/featured-works');
      setItems(res.data.data);
    } catch (error) {
      console.error('Failed to load best sellers:', error);
      showToast('Failed to load Best Sellers', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBestSellers();
  }, [fetchBestSellers]);

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
      await api.put(`/products/${itemToRemove}`, { isBestSeller: false });
      showToast('تمت الإزالة بنجاح', 'success');
      fetchBestSellers();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to remove from Best Sellers', 'error');
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
            <StarIcon sx={{ color: 'warning.main', fontSize: 32 }} />
            أبرز الأعمال
          </Typography>
          <Typography variant="body1" color="text.secondary">
            إدارة العناصر المميزة (حد أقصى 10 عناصر)
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
          <StarIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">لا توجد عناصر في قائمة أبرز الأعمال</Typography>
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
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' }, 
                gap: 2,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'rgba(27, 58, 75, 0.05)',
                boxShadow: '0 10px 40px -10px rgba(27, 58, 75, 0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 16px 40px -8px rgba(27, 58, 75, 0.12)'
                }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: 2, 
                width: '100%' 
              }}>
                {/* Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, width: '100%' }}>
                  {item.image?.url ? (
                    <Box 
                      component="img" 
                      src={item.image.url} 
                      alt={item.name} 
                      sx={{ 
                        width: 64, 
                        height: 64, 
                        borderRadius: '16px', 
                        objectFit: 'cover', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }} 
                    />
                  ) : (
                    <Box sx={{ width: 64, height: 64, borderRadius: '16px', bgcolor: 'rgba(27, 58, 75, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <StarIcon sx={{ color: '#1B3A4B' }} />
                    </Box>
                  )}
                  <Box>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#1B3A4B', mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: { xs: '200px', sm: '100%' } }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'inline-block', bgcolor: 'rgba(46, 139, 154, 0.1)', color: '#2E8B9A', px: 1.5, py: 0.25, borderRadius: '12px', fontWeight: 700 }}>
                      {typeof item.category === 'object' ? (item.category as any).name : 'تصنيف'}
                    </Typography>
                    <Box component="span" sx={{ display: 'inline-block', ml: 1, px: 1.5, py: 0.25, borderRadius: '12px', fontWeight: 700, fontSize: '0.75rem', bgcolor: item.isAvailable ? 'rgba(46, 125, 50, 0.08)' : 'rgba(211, 47, 47, 0.08)', color: item.isAvailable ? 'success.main' : 'error.main' }}>
                      {item.isAvailable ? 'متاح' : 'غير متاح'}
                    </Box>
                  </Box>
                </Box>

                {/* Price / Sizes & Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-start' } }}>
                  <Box sx={{ textAlign: 'right' }}>
                    {item.hasSizes && item.sizes && item.sizes.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'flex-end', maxWidth: '180px' }}>
                        {item.sizes.map((s: any) => (
                          <Chip key={s.name} label={`${s.name}: ${s.price}`} size="small" sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: 'rgba(10, 41, 71, 0.05)', color: '#0A2947' }} />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B3A4B', display: 'inline-block' }}>
                        {item.price} <Typography component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 700 }}>ج.م</Typography>
                      </Typography>
                    )}
                  </Box>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleRemoveClick(item._id)}
                    sx={{ 
                      minWidth: '40px', width: '40px', height: '40px', borderRadius: '10px', 
                      bgcolor: 'rgba(239, 68, 68, 0.05)', 
                      color: '#ef4444',
                      '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
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
            هل أنت متأكد أنك تريد إزالة هذا القطعة من قائمة أبرز الأعمال؟
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
