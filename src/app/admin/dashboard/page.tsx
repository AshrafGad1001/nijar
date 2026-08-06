'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Category, Product } from '@/types';
import QRCodeGenerator from '@/components/admin/QRCodeGenerator';
import { Grid, Card, Typography, CircularProgress, Box, IconButton, Button, Avatar } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({ categories: 0, items: 0, available: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [catRes, itemRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products'),
        ]);
        const categories: Category[] = catRes.data.data;
        const items: Product[] = itemRes.data.data;
        setStats({
          categories: categories.length,
          items: items.length,
          available: items.filter((i) => i.isAvailable).length,
        });
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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 4, md: 6 } }}>
        <Box>
          <Typography sx={{ typography: { xs: 'h5', md: 'h4' }, fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.5px' }}>
            لوحة التحكم
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            مرحباً بعودتك، إليك نظرة عامة على نشاط المعرض 🛋️✨
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: { xs: 4, md: 6 } }}>
        {statCards.map((stat, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
            <Card sx={{ 
              p: { xs: 2, md: 3 }, 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: '#fff', 
              border: '1px solid',
              borderColor: 'rgba(0,0,0,0.03)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2.5 } }}>
                <Avatar sx={{ 
                  bgcolor: stat.color, 
                  color: '#fff', 
                  width: { xs: 44, md: 56 }, 
                  height: { xs: 44, md: 56 }, 
                  borderRadius: { xs: 2, md: 3 }, 
                  boxShadow: `0 8px 16px ${stat.color}40`,
                }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography sx={{ typography: { xs: 'h6', md: 'h4' }, fontWeight: 800, color: 'text.primary', lineHeight: 1, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'subtitle2', md: 'subtitle1' }, fontWeight: 700, color: 'text.primary' }}>
                    {stat.label}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'caption', md: 'caption' }, color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                    {stat.subtitle}
                  </Typography>
                </Box>
              </Box>
              <IconButton size="small" sx={{ 
                bgcolor: 'background.default',
                '&:hover': { bgcolor: 'primary.main', color: '#fff' }
              }}>
                <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 2, md: 1 } }}>
          <QRCodeGenerator />
        </Grid>
        
        <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 1, md: 2 } }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              روابط سريعة
            </Typography>
          </Box>
          
          <Card 
            component={Link} 
            href="/admin/dashboard/categories"
            sx={{ 
              p: { xs: 2, md: 3 }, 
              mb: 3,
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 2, md: 3 },
              bgcolor: '#fff', 
              textDecoration: 'none',
              border: '1px solid',
              borderColor: 'rgba(0,0,0,0.03)',
              '&:hover .hover-icon': { transform: 'translateX(-4px)', color: 'primary.main' }
            }}
          >
            <Avatar sx={{ bgcolor: 'secondary.main', color: '#fff', width: { xs: 48, md: 64 }, height: { xs: 48, md: 64 }, borderRadius: { xs: 2, md: 3 }, boxShadow: '0 8px 16px rgba(217, 119, 6, 0.25)' }}>
              <DashboardCustomizeOutlinedIcon sx={{ fontSize: { xs: 24, md: 35 } }} />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ typography: { xs: 'subtitle1', md: 'h6' }, fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                إدارة التصنيفات
              </Typography>
              <Typography sx={{ typography: { xs: 'caption', md: 'body2' }, color: 'text.secondary', fontWeight: 500 }}>
                إضافة، تعديل أو ترتيب الأقسام داخل الكتالوج
              </Typography>
            </Box>
            <ArrowBackIosNewIcon className="hover-icon" sx={{ color: 'text.disabled', transition: 'all 0.2s ease', fontSize: { xs: 16, md: 24 } }} />
          </Card>

          <Card 
            component={Link} 
            href="/admin/dashboard/products"
            sx={{ 
              p: { xs: 2, md: 3 }, 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 2, md: 3 },
              bgcolor: '#fff', 
              textDecoration: 'none',
              border: '1px solid',
              borderColor: 'rgba(0,0,0,0.03)',
              '&:hover .hover-icon': { transform: 'translateX(-4px)', color: 'primary.main' }
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', width: { xs: 48, md: 64 }, height: { xs: 48, md: 64 }, borderRadius: { xs: 2, md: 3 }, boxShadow: '0 8px 16px rgba(27, 58, 75, 0.25)' }}>
              <WeekendOutlinedIcon sx={{ fontSize: { xs: 24, md: 35 } }} />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ typography: { xs: 'subtitle1', md: 'h6' }, fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                إدارة المنتجات
              </Typography>
              <Typography sx={{ typography: { xs: 'caption', md: 'body2' }, color: 'text.secondary', fontWeight: 500 }}>
                التحكم في المعروضات، الأسعار، والتوافر
              </Typography>
            </Box>
            <ArrowBackIosNewIcon className="hover-icon" sx={{ color: 'text.disabled', transition: 'all 0.2s ease', fontSize: { xs: 16, md: 24 } }} />
          </Card>

        </Grid>
      </Grid>
    </Box>
  );
}
