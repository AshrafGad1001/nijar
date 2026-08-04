'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Avatar } from '@mui/material';

interface CatalogTabsProps {
  menu: Array<{
    _id: string;
    name: string;
    image: { url: string; publicId: string };
  }>;
}

export default function CatalogTabs({ menu }: CatalogTabsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const isScrollingRef = useRef(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-center the active tab in the horizontal scroll container
  useEffect(() => {
    if (!tabsContainerRef.current) return;
    const container = tabsContainerRef.current;
    
    const activeTab = document.getElementById(`tab-${activeCategory}`);
    if (activeTab) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      
      const containerCenter = containerRect.left + containerRect.width / 2;
      const tabCenter = tabRect.left + tabRect.width / 2;
      
      const scrollOffset = tabCenter - containerCenter;

      if (Math.abs(scrollOffset) > 5) {
        container.scrollBy({
          left: scrollOffset,
          behavior: 'smooth'
        });
      }
    }
  }, [activeCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const mostVisible = visibleEntries.reduce((prev, curr) => 
            curr.intersectionRatio > prev.intersectionRatio ? curr : prev
          );
          
          const id = mostVisible.target.id;
          if (id && id.startsWith('category-')) {
            setActiveCategory(id.replace('category-', ''));
          } else if (id === 'best-sellers-section') {
            setActiveCategory('all');
          }
        }
      },
      { rootMargin: '-100px 0px -50% 0px', threshold: 0 }
    );

    document.querySelectorAll('.scrollspy-section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [menu]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    isScrollingRef.current = true;
    
    if (categoryId === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => { isScrollingRef.current = false; }, 1000);
      return;
    }

    const section = document.getElementById(`category-${categoryId}`);
    if (section) {
      const yOffset = -140; 
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
      setTimeout(() => { isScrollingRef.current = false; }, 1000);
    }
  };

  if (menu.length === 0) return null;

  return (
    <Box 
      ref={tabsContainerRef}
      sx={{ 
        display: 'flex',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        gap: 1.5,
        pt: 1.5,
        pb: 1.5,
        px: { xs: 2, md: 3 },
        bgcolor: 'transparent',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        mb: 4
      }}
    >
      <Box
        id="tab-all"
        onClick={() => handleCategoryClick('all')}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          height: 36,
          cursor: 'pointer',
          px: 1.5,
          borderRadius: '18px', 
          bgcolor: activeCategory === 'all' ? '#1B3A4B' : '#fff',
          color: activeCategory === 'all' ? '#fff' : '#1B3A4B',
          border: '1px solid',
          borderColor: activeCategory === 'all' ? '#1B3A4B' : 'rgba(0,0,0,0.06)',
          boxShadow: activeCategory === 'all' ? '0 4px 12px rgba(27, 58, 75, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            bgcolor: activeCategory === 'all' ? '#1B3A4B' : '#f8f9fa',
            transform: 'translateY(-2px)',
            boxShadow: activeCategory === 'all' ? '0 6px 16px rgba(27, 58, 75, 0.4)' : '0 4px 12px rgba(0,0,0,0.08)',
          }
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: activeCategory === 'all' ? 800 : 700, fontSize: '13px' }}>
          الكل
        </Typography>
      </Box>

      {menu.map(category => (
        <Box
          id={`tab-${category._id}`}
          key={category._id}
          onClick={() => handleCategoryClick(category._id)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            height: 36,
            gap: 0.5,
            cursor: 'pointer',
            px: 1,
            borderRadius: '18px',
            bgcolor: activeCategory === category._id ? '#1B3A4B' : '#fff',
            color: activeCategory === category._id ? '#fff' : '#1B3A4B',
            border: '1px solid',
            borderColor: activeCategory === category._id ? '#1B3A4B' : 'rgba(0,0,0,0.06)',
            boxShadow: activeCategory === category._id ? '0 4px 12px rgba(27, 58, 75, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: activeCategory === category._id ? '#1B3A4B' : '#f8f9fa',
              transform: 'translateY(-2px)',
              boxShadow: activeCategory === category._id ? '0 6px 16px rgba(27, 58, 75, 0.4)' : '0 4px 12px rgba(0,0,0,0.08)',
            }
          }}
        >
          {category.image?.url && (
            <Avatar 
              src={category.image.url}
              sx={{ 
                width: 18,
                height: 18,
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
              }}
            />
          )}
          <Typography variant="body2" sx={{ fontWeight: activeCategory === category._id ? 800 : 700, fontSize: '13px' }}>
            {category.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
