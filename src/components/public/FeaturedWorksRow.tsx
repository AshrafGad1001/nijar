'use client';

import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Image from 'next/image';
import Link from 'next/link';

interface FeaturedWorkItem {
  _id: string;
  name: string;
  productCode?: string;
  description: string;
  components?: string[];
  price: number | null;
  discountPercentage?: number;
  hasSizes?: boolean;
  sizes?: { name: string; price: number }[];
  image: { url: string; publicId: string };
  gallery?: { url: string; publicId: string }[];
  slug?: string;
  category?: any;
}

interface FeaturedWorksRowProps {
  items: FeaturedWorkItem[];
  whatsappNumber?: string;
  title?: string;
  subtitle?: string;
  hidePrices?: boolean;
}

export default function FeaturedWorksRow({ items, whatsappNumber, title = "أبرز الأعمال", subtitle = "الأكثر مبيعاً", hidePrices }: FeaturedWorksRowProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (!scrollContainerRef.current || isPaused) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (Math.abs(scrollLeft) >= maxScroll - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  if (!items || items.length === 0) return null;

  return (
    <Box sx={{ mb: 6 }}>
      {/* Premium Header */}
      <Box sx={{ mb: 5, mt: 2, px: { xs: 2, md: 3 } }}>
        <Typography 
          variant="overline" 
          sx={{ 
            color: '#8BA3A6', 
            fontWeight: 700, 
            letterSpacing: '2px', 
            display: 'block',
            mb: 0.5,
            fontSize: '0.85rem'
          }}
        >
          {subtitle}
        </Typography>
        
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 900, 
            color: '#0F172A', 
            fontSize: { xs: '2rem', md: '2.5rem' }, 
            letterSpacing: '-0.5px',
            m: 0 
          }}
        >
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Box sx={{ width: 48, height: 4, background: 'linear-gradient(90deg, #D4AF37, #E8D099)', borderRadius: 2 }} />
          <Box sx={{ width: 8, height: 4, bgcolor: '#D4AF37', borderRadius: 2, opacity: 0.6 }} />
          <Box sx={{ width: 4, height: 4, bgcolor: '#D4AF37', borderRadius: '50%', opacity: 0.4 }} />
        </Box>
      </Box>

      {/* Horizontal Scroll Container */}
      <Box
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          pb: 4,
          pt: 1,
          px: 1,
          alignItems: 'stretch',
          scrollSnapType: 'x mandatory',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item) => (
          <Card
            key={item._id}
            className="featured-card"
            sx={{
              minWidth: { xs: 280, sm: 320 },
              maxWidth: { xs: 280, sm: 320 },
              height: 'auto',
              scrollSnapAlign: 'start',
              borderRadius: '24px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              bgcolor: '#FFFFFF',
              boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
              border: '1px solid rgba(15, 23, 42, 0.04)',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
              },
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 24px 64px rgba(15, 23, 42, 0.08)',
                borderColor: 'rgba(15, 23, 42, 0.1)',
                '@media (prefers-reduced-motion: reduce)': {
                  transform: 'none',
                }
              }
            }}
          >
            <Link href={`/product/${item.slug || item._id}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }} />
            
            {/* Premium Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                color: '#fff',
                px: 2,
                py: 0.5,
                borderRadius: '100px',
                fontWeight: 800,
                fontSize: '0.8rem',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                letterSpacing: '1px'
              }}
            >
              <StarIcon sx={{ fontSize: 14, mr: 0.5, color: '#F1F5F9' }} />
              مميز
            </Box>

            {/* Discount Badge */}
            {item.discountPercentage && item.discountPercentage > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  background: '#E11D48',
                  color: '#fff',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '100px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                خصم {item.discountPercentage}%
              </Box>
            )}

            {/* Image */}
            <Box sx={{ position: 'relative', aspectRatio: '1 / 1', width: '100%', overflow: 'hidden', bgcolor: '#F8FAFC' }}>
              {item.image?.url ? (
                <Image
                  src={item.image.url}
                  alt={item.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 600px) 280px, 320px"
                />
              ) : (
                <Box sx={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.disabled">لا توجد صورة</Typography>
                </Box>
              )}
            </Box>

            {/* Content */}
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3, pt: 2.5, textAlign: 'start', position: 'relative', zIndex: 2 }}>
              
              {/* Product Code */}
              {item.productCode && (
                <Typography 
                  variant="overline" 
                  sx={{ 
                    color: '#64748B', 
                    fontWeight: 600, 
                    fontSize: '0.7rem', 
                    letterSpacing: '1.5px',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  كود <span dir="ltr" style={{ color: '#0F172A', fontWeight: 800 }}>{item.productCode}</span>
                </Typography>
              )}

              <Typography variant="h6" sx={{ fontWeight: 800, color: '#09101A', mb: 1.5, fontSize: '1.15rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', wordBreak: 'break-word' }}>
                {item.name}
              </Typography>
              
              {item.components && item.components.length > 0 && (
                <Box sx={{ mb: 1, flexGrow: 1 }}>
                  <Typography variant="caption" sx={{ display: 'block', color: '#64748B', fontWeight: 700, mb: 0.5 }}>
                    المكونات:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.components.join(' • ')}
                  </Typography>
                </Box>
              )}

              {/* Price Section */}
              <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative', zIndex: 3, mt: 'auto', pt: 1.5 }}>
                {(hidePrices || item.category?.hidePrices) ? (
                  <Box
                    sx={{
                      flexGrow: 1,
                      mr: 2,
                      bgcolor: '#0F172A',
                      color: '#ffffff',
                      borderRadius: '12px',
                      py: 1,
                      px: 2,
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      pointerEvents: 'none',
                      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
                    }}
                  >
                    عرض التفاصيل
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)' }}>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Box>
                ) : (
                  <Box>
                    {Boolean(item.discountPercentage && item.discountPercentage > 0) && (
                      <Typography variant="caption" sx={{ textDecoration: 'line-through', color: '#94A3B8', fontWeight: 700, display: 'block', mb: 0.5 }}>
                        {item.hasSizes && item.sizes && item.sizes.length > 0 
                          ? Math.round(Math.min(...item.sizes.map(s => s.price))).toLocaleString()
                          : Math.round(item.price || 0).toLocaleString()} ج.م
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                      {item.hasSizes && item.sizes && item.sizes.length > 0 && (
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, mr: 0.5 }}>يبدأ من</Typography>
                      )}
                      <Typography variant="h5" sx={{ fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>
                        {item.discountPercentage && item.discountPercentage > 0 
                          ? (item.hasSizes && item.sizes && item.sizes.length > 0
                              ? Math.round(Math.min(...item.sizes.map(s => s.price)) * (1 - item.discountPercentage / 100)).toLocaleString()
                              : Math.round((item.price || 0) * (1 - item.discountPercentage / 100)).toLocaleString())
                          : (item.hasSizes && item.sizes && item.sizes.length > 0
                              ? Math.round(Math.min(...item.sizes.map(s => s.price))).toLocaleString()
                              : Math.round(item.price || 0).toLocaleString())}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#0F172A', fontWeight: 900 }}>ج.م</Typography>
                    </Box>
                  </Box>
                )}
                
                {/* Arrow Icon */}
                <Box sx={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: '50%', 
                  bgcolor: '#F8FAFC', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#C59B5F',
                  transition: 'all 0.3s ease',
                  border: '1px solid #F1F5F9',
                  '.featured-card:hover &': {
                    bgcolor: 'rgba(197, 155, 95, 0.1)',
                    borderColor: 'rgba(197, 155, 95, 0.2)',
                    transform: 'translateX(-4px)',
                  }
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)' }}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
