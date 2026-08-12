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
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
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
    { href: '/admin/dashboard/bundles', icon: <CardGiftcardIcon />, label: 'الباكدجات' },
    { href: '/admin/dashboard/settings', icon: <SettingsIcon />, label: 'الإعدادات' },
  ];

  const drawerContent = (
    <>
      <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', mb: 1 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 900, 
            color: '#FFFFFF', 
            letterSpacing: 1,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          Nijar <Typography component="span" sx={{ color: '#D4AF37', fontWeight: 900, fontSize: 'inherit' }}>Admin</Typography>
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
                  backgroundColor: active ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                  color: active ? '#D4AF37' : '#94A3B8',
                  boxShadow: active ? '0 8px 20px rgba(0, 0, 0, 0.2)' : 'none',
                  border: active ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: active ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: active ? '#D4AF37' : '#FFFFFF',
                    transform: active ? 'translateY(0)' : 'translateY(-2px)'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 44, 
                  color: 'inherit',
                  transition: 'all 0.3s ease',
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

      <Box sx={{ p: 2, mx: 3, mb: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 4, border: '1px solid', borderColor: 'rgba(255,255,255,0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={adminImage || "/Admin-img.jpg"} 
            sx={{ 
              bgcolor: '#1B3A4B', 
              color: '#D4AF37',
              width: 44, 
              height: 44, 
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}
          >
            {adminName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
              {adminName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
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
              color: '#ef4444',
              transition: 'all 0.3s ease',
              '&:hover': { 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                transform: 'translateY(-2px)'
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
            backgroundColor: '#0F172A',
            borderRight: 'none',
            boxShadow: '4px 0 24px rgba(0,0,0,0.3)'
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
            backgroundColor: '#0F172A', 
            borderLeft: 'none',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '4px 0 40px rgba(0,0,0,0.15)'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
