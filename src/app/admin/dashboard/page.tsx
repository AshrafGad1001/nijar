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
  const [categoryStats, setCategoryStats] = useState<{ name: string; count: number }[]>([]);
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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 4, md: 6 } }}>
        <Box>
          <Typography sx={{ typography: { xs: 'h5', md: 'h4' }, fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.5px' }}>
            لوحة التحكم
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            مرحباً بعودتك، إليك نظرة عامة على نشاط المعرض
          </Typography>
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

      {/* Bottom Section */}
      <Grid container spacing={4}>
        {/* Categories Overview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              نظرة عامة على التصنيفات
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              توزيع المنتجات داخل كل قسم من أقسام المعرض
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {categoryStats.map((cat, idx) => (
              <Grid size={{ xs: 6, sm: 4 }} key={idx}>
                <Card sx={{ 
                  p: 2.5, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: '#ffffff', 
                  border: '1px solid rgba(27,58,75,0.04)', 
                  borderRadius: '20px', 
                  boxShadow: '0 4px 12px rgba(27,58,75,0.02)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    borderColor: 'primary.main', 
                    boxShadow: '0 8px 24px rgba(27,58,75,0.08)',
                    transform: 'translateY(-4px)'
                  } 
                }}>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', mb: 1 }}>
                    {cat.count}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.secondary', textAlign: 'center' }}>
                    {cat.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Quick Links */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              روابط سريعة
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              الوصول السريع لأهم الإجراءات
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
              borderRadius: '20px',
              border: '1px solid',
              borderColor: 'rgba(0,0,0,0.03)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'secondary.main',
                boxShadow: '0 8px 24px rgba(217, 119, 6, 0.1)',
                '& .hover-icon': { transform: 'translateX(-4px)', color: 'secondary.main' }
              }
            }}
          >
            <Avatar sx={{ bgcolor: 'secondary.main', color: '#fff', width: { xs: 48, md: 60 }, height: { xs: 48, md: 60 }, borderRadius: { xs: 2, md: 3 }, boxShadow: '0 8px 16px rgba(217, 119, 6, 0.25)' }}>
              <DashboardCustomizeOutlinedIcon sx={{ fontSize: { xs: 24, md: 30 } }} />
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
              borderRadius: '20px',
              border: '1px solid',
              borderColor: 'rgba(0,0,0,0.03)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: '0 8px 24px rgba(27, 58, 75, 0.1)',
                '& .hover-icon': { transform: 'translateX(-4px)', color: 'primary.main' }
              }
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', width: { xs: 48, md: 60 }, height: { xs: 48, md: 60 }, borderRadius: { xs: 2, md: 3 }, boxShadow: '0 8px 16px rgba(27, 58, 75, 0.25)' }}>
              <WeekendOutlinedIcon sx={{ fontSize: { xs: 24, md: 30 } }} />
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
