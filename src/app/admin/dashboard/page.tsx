'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Category, Product } from '@/types';
import QRCodeGenerator from '@/components/admin/QRCodeGenerator';
import { Grid, Card, Typography, CircularProgress, Box, IconButton, Button, Avatar, Autocomplete, TextField, InputAdornment } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [stats, setStats] = useState({ categories: 0, items: 0, available: 0 });
  const [categoryStats, setCategoryStats] = useState<{ name: string; count: number }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [catRes, itemRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products'),
        ]);
        const categories: Category[] = catRes.data.data;
        const items: Product[] = itemRes.data.data;
        
        setProducts(items);
        
        setStats({
          categories: categories.length,
          items: items.length,
          available: items.filter((i) => i.isAvailable).length,
        });

        const catCounts: Record<string, { name: string; count: number }> = {};
        categories.forEach(c => {
          catCounts[c._id] = { name: c.name, count: 0 };
        });
        
        items.forEach(item => {
          // Handle both populated and unpopulated category references
          const catId = typeof item.category === 'object' ? item.category._id : item.category;
          if (catId && catCounts[catId as string]) {
            catCounts[catId as string].count++;
          }
        });
        
        setCategoryStats(Object.values(catCounts));

      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, height: '80vh', alignItems: 'center' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const statCards = [
    { label: 'عناصر متاحة', subtitle: 'إجمالي المتاح للطلب', value: stats.available, icon: <CheckCircleOutlinedIcon sx={{ fontSize: { xs: 24, md: 32 } }} />, color: 'success.main' },
    { label: 'المنتجات', subtitle: 'كافة قطع الأثاث والمعروضات', value: stats.items, icon: <WeekendOutlinedIcon sx={{ fontSize: { xs: 24, md: 32 } }} />, color: 'primary.main' },
    { label: 'التصنيفات', subtitle: 'إجمالي الأقسام بالكتالوج', value: stats.categories, icon: <DashboardCustomizeOutlinedIcon sx={{ fontSize: { xs: 24, md: 32 } }} />, color: 'secondary.main' },
  ];

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Header & Prominent Search */}
      <Box sx={{ mb: { xs: 4, md: 5 } }}>
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography sx={{ typography: { xs: 'h5', md: 'h4' }, fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.5px' }}>
            لوحة التحكم
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            مرحباً بعودتك، إليك نظرة عامة على نشاط المعرض
          </Typography>
        </Box>
        
        {/* Full-width Search Section */}
        <Box sx={{ 
          p: { xs: 3, md: 4 }, 
          bgcolor: '#1B3A4B', 
          borderRadius: '24px', 
          boxShadow: '0 20px 40px rgba(27, 58, 75, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle background decorations */}
          <Box sx={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', bottom: -50, right: -50, width: 250, height: 250, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
          
          <Typography sx={{ fontWeight: 800, color: '#ffffff', fontSize: { xs: '1.2rem', md: '1.5rem' }, zIndex: 1 }}>
            البحث السريع عن المنتجات
          </Typography>
          
          <Autocomplete
            options={products}
            getOptionLabel={(option) => `${option.name} ${option.productCode ? `(${option.productCode})` : ''}`}
            filterOptions={(options, state) => {
              return options.filter(o => 
                o.name.toLowerCase().includes(state.inputValue.toLowerCase()) || 
                (o.productCode && o.productCode.toLowerCase().includes(state.inputValue.toLowerCase()))
              );
            }}
            onChange={(event, newValue) => {
              if (newValue) {
                router.push(`/admin/dashboard/products/edit/${newValue._id}`);
              }
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                placeholder="ابحث هنا باستخدام اسم المنتج أو الكود الخاص به..." 
                variant="outlined" 
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#1B3A4B', fontSize: '1.8rem', ml: 1 }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            sx={{ 
              width: '100%', 
              zIndex: 1,
              '& .MuiOutlinedInput-root': { 
                bgcolor: '#fff',
                borderRadius: '16px',
                py: { xs: 0.5, md: 1 },
                px: 2,
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: '2px solid #D4AF37' }
              }
            }}
          />
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: { xs: 4, md: 6 } }}>
        {statCards.map((stat, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
            <Card sx={{ 
              p: { xs: 3, md: 3.5 }, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'flex-start',
              bgcolor: '#fff', 
              borderRadius: '24px',
              border: '1px solid',
              borderColor: 'rgba(0,0,0,0.04)',
              boxShadow: '0 8px 32px rgba(27,58,75,0.04)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(27,58,75,0.08)',
                borderColor: stat.color
              }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ 
                  bgcolor: stat.color, 
                  color: '#fff', 
                  width: { xs: 50, md: 56 }, 
                  height: { xs: 50, md: 56 }, 
                  borderRadius: '16px', 
                  boxShadow: `0 8px 16px ${stat.color}40`,
                }}>
                  {stat.icon}
                </Avatar>
                <Typography sx={{ typography: { xs: 'h4', md: 'h3' }, fontWeight: 900, color: 'text.primary', lineHeight: 1 }}>
                  {stat.value}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ typography: { xs: 'h6', md: 'h6' }, fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                  {stat.label}
                </Typography>
                <Typography sx={{ typography: 'body2', color: 'text.secondary', fontWeight: 600 }}>
                  {stat.subtitle}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>


    </Box>
  );
}
