'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, Typography, CircularProgress, IconButton, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ErrorIcon from '@mui/icons-material/Error';
import ProductForm from '@/components/admin/ProductForm';
import api from '@/lib/api';
import { Category, Product } from '@/types';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [productData, setProductData] = useState<Product | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [catRes, productRes] = await Promise.all([
        api.get('/categories'),
        api.get(`/products/${id}`)
      ]);
      
      setCategories(catRes.data.data);
      setProductData(productRes.data.data);
      
    } catch (err: any) {
      console.error('Failed to load edit data:', err);
      // Check if it's a 404
      if (err.response?.status === 404) {
        setError('المنتج غير موجود أو تم حذفه مسبقاً.');
      } else {
        setError('حدث خطأ أثناء جلب بيانات المنتج. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchInitialData();
    }
  }, [id, fetchInitialData]);

  const handleFormSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      await api.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Redirect back on success
      router.push('/admin/dashboard/products');
    } catch (err: any) {
      throw err; // ProductForm catches this
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: 2 }}>
        <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
        <Typography variant="h6" color="text.secondary">جاري جلب تفاصيل المنتج...</Typography>
      </Box>
    );
  }

  if (error || !productData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: 3 }}>
        <ErrorIcon sx={{ fontSize: 80, color: 'error.main', opacity: 0.8 }} />
        <Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold' }}>
          {error || 'حدث خطأ غير معروف'}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => router.push('/admin/dashboard/products')}
          sx={{ px: 4, py: 1.5, borderRadius: 2 }}
        >
          العودة لقائمة المنتجات
        </Button>
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
          تعديل منتج: {productData.name}
        </Typography>
      </Box>
      
      <Box sx={{ bgcolor: '#fff', p: { xs: 2, md: 4 }, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <ProductForm
          categories={categories}
          initialData={{
            name: productData.name,
            description: productData.description,
            price: productData.price,
            category: typeof productData.category === 'object' ? (productData.category as any)._id : productData.category,
            isAvailable: productData.isAvailable,
            isBestSeller: (productData as any).isBestSeller,
            isHeroSlide: (productData as any).isHeroSlide,
            hasSizes: productData.hasSizes,
            sizes: productData.sizes as any,
            technicalDetails: productData.technicalDetails,
            imageUrl: productData.image?.url,
            galleryUrls: productData.gallery?.map(g => g.url) || [],
          }}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </Box>
    </Box>
  );
}
