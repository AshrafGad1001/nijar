'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ProductForm from '@/components/admin/ProductForm';
import api from '@/lib/api';
import { Category } from '@/types';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      alert('فشل تحميل التصنيفات');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleFormSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Redirect back on success
      router.push('/admin/dashboard/products');
    } catch (error: any) {
      const apiMsg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || '';
      let displayMessage = 'حدث خطأ غير متوقع أثناء حفظ المنتج.';
      
      if (apiMsg.includes('E11000') || apiMsg.includes('duplicate')) {
        displayMessage = 'عذراً، اسم المنتج موجود بالفعل في النظام. يرجى اختيار اسم مختلف.';
      } else if (apiMsg) {
        displayMessage = apiMsg;
      }
      
      alert(displayMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <IconButton 
          onClick={() => router.push('/admin/dashboard/products')}
          sx={{ bgcolor: 'rgba(0,0,0,0.05)', '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' } }}
        >
          <ArrowForwardIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'text.primary' }}>
          إضافة منتج جديد
        </Typography>
      </Box>
      
      <Box sx={{ bgcolor: '#fff', p: { xs: 2, md: 4 }, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <ProductForm
          categories={categories}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </Box>
    </Box>
  );
}
