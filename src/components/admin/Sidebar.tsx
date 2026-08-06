'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Avatar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import StarIcon from '@mui/icons-material/Star';
import LogoutIcon from '@mui/icons-material/Logout';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import SettingsIcon from '@mui/icons-material/Settings';
import api from '@/lib/api';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [adminName, setAdminName] = useState('إدارة النظام');
  const [adminImage, setAdminImage] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data && res.data.data) {
        setAdminName(res.data.data.adminName || 'إدارة النظام');
        setAdminImage(res.data.data.adminImage?.url || null);
      }
    } catch (err) {
      console.error('Failed to fetch admin settings for sidebar', err);
    }
  };

  useEffect(() => {
    fetchSettings();
    // Listen for custom event when settings are updated in the SettingsPage
    const handleSettingsUpdated = () => fetchSettings();
    window.addEventListener('settings-updated', handleSettingsUpdated);
    return () => window.removeEventListener('settings-updated', handleSettingsUpdated);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nijar_token');
    router.push('/admin/login');
  };

  const navLinks = [
    { href: '/admin/dashboard', icon: <DashboardIcon />, label: 'لوحة التحكم' },
    { href: '/admin/dashboard/hero-slides', icon: <SlideshowIcon />, label: 'الصور المميزة' },
    { href: '/admin/dashboard/featured-works', icon: <StarIcon />, label: 'أبرز الأعمال' },
    { href: '/admin/dashboard/categories', icon: <FolderIcon />, label: 'التصنيفات' },
    { href: '/admin/dashboard/products', icon: <WeekendOutlinedIcon />, label: 'المنتجات' },
    { href: '/admin/dashboard/settings', icon: <SettingsIcon />, label: 'الإعدادات' },
  ];

  const drawerContent = (
    <>
      <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', mb: 1 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 900, 
            color: 'primary.main', 
            letterSpacing: 1,
            textAlign: 'center'
          }}
        >
          Admin Dashboard
        </Typography>
      </Box>

      <List sx={{ px: 3 }}>
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <ListItem key={link.href} disablePadding sx={{ mb: 1.5 }}>
              <ListItemButton 
                component={Link} 
                href={link.href}
                onClick={onClose} 
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  backgroundColor: active ? 'primary.main' : 'transparent',
                  color: active ? '#fff' : 'text.secondary',
                  boxShadow: active ? '0 8px 20px rgba(44, 30, 22, 0.15)' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: active ? 'primary.main' : 'rgba(0, 0, 0, 0.03)',
                    color: active ? '#fff' : 'primary.main',
                    transform: active ? 'translateY(0)' : 'translateY(-2px)'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 44, 
                  color: 'inherit',
                  transition: 'all 0.2s ease',
                }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography 
                      sx={{ 
                        fontWeight: active ? 700 : 600,
                        fontSize: { xs: '0.85rem', md: '0.95rem' },
                        letterSpacing: '0.2px'
                      }}
                    >
                      {link.label}
                    </Typography>
                  } 
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2, mx: 3, mb: 2, bgcolor: 'background.default', borderRadius: 4, border: '1px solid', borderColor: 'rgba(0,0,0,0.03)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={adminImage || "/Admin-img.jpg"} 
            sx={{ 
              bgcolor: 'secondary.main', 
              color: '#fff',
              width: 44, 
              height: 44, 
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.2)'
            }}
          >
            {adminName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              {adminName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              إدارة النظام
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ px: 3, pb: 4 }}>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              borderRadius: 3,
              py: 1.5,
              color: 'error.main',
              '&:hover': { 
                backgroundColor: 'error.light',
                color: '#fff',
                '& .MuiListItemIcon-root': { color: '#fff' }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 44, color: 'inherit' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary={<Typography sx={{ fontWeight: 700 }}>تسجيل الخروج</Typography>} />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <Box component="nav" sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            backgroundColor: '#FFFFFF',
            borderRight: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            backgroundColor: '#FFFFFF', 
            borderLeft: 'none',
            borderRight: '1px solid rgba(0, 0, 0, 0.05)',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
