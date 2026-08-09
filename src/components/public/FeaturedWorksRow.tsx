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
}

interface FeaturedWorksRowProps {
  items: FeaturedWorkItem[];
  whatsappNumber?: string;
}

export default function FeaturedWorksRow({ items, whatsappNumber }: FeaturedWorksRowProps) {
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
          الأكثر مبيعاً
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
          أبرز الأعمال
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Box sx={{ width: 48, height: 4, background: 'linear-gradient(90deg, #C59B5F, #E8D099)', borderRadius: 2 }} />
          <Box sx={{ width: 8, height: 4, bgcolor: '#C59B5F', borderRadius: 2, opacity: 0.6 }} />
          <Box sx={{ width: 4, height: 4, bgcolor: '#C59B5F', borderRadius: '50%', opacity: 0.4 }} />
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
          overflowX: 'auto',
          gap: 3,
          pt: 2, 
          pb: 4,
          px: { xs: 2, md: 3 },
          scrollSnapType: 'x mandatory',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item) => (
          <Link href={`/product/${item.slug || item._id}`} key={item._id} style={{ textDecoration: 'none' }}>
            <Card
              className="featured-card"
              sx={{
                minWidth: { xs: 280, sm: 320 },
                maxWidth: { xs: 280, sm: 320 },
                height: '100%',
                scrollSnapAlign: 'start',
                borderRadius: '24px',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                bgcolor: '#FFFFFF',
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                border: '1px solid rgba(197, 155, 95, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 24px 48px rgba(15, 23, 42, 0.08)',
                  borderColor: 'rgba(197, 155, 95, 0.3)',
                }
              }}
            >
              {/* Gold Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'linear-gradient(135deg, #C59B5F 0%, #A67C43 100%)',
                  color: '#fff',
                  px: 2,
                  py: 0.5,
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  boxShadow: '0 4px 16px rgba(197, 155, 95, 0.4)',
                }}
              >
                <StarIcon sx={{ fontSize: 16, mb: '1px' }} />
                أبرز الأعمال
              </Box>

              {/* Discount Badge */}
              {item.discountPercentage && item.discountPercentage > 0 ? (
                <Box sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  bgcolor: '#EF4444',
                  color: '#fff',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '12px',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  zIndex: 2,
                  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)',
                }}>
                  خصم {item.discountPercentage}%
                </Box>
              ) : null}

              {/* Image Section */}
              <Box
                sx={{
                  width: '100%',
                  height: 260,
                  position: 'relative',
                  bgcolor: '#FAFAF9',
                  overflow: 'hidden',
                  '& img': {
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  },
                  '.featured-card:hover & img': {
                    transform: 'scale(1.06)'
                  }
                }}
              >
                {item.image?.url ? (
                  <Image
                    src={item.image.url}
                    alt={item.name}
                    fill
                    sizes="(max-width: 600px) 320px, 320px"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <StarIcon sx={{ fontSize: 40, color: 'rgba(0,0,0,0.05)' }} />
                  </Box>
                )}
              </Box>

              {/* Content Section */}
              <CardContent sx={{ pt: 2, pb: '16px !important', px: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', textAlign: 'start' }}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 0, color: '#0F172A', fontSize: '1.25rem', letterSpacing: '-0.3px', lineHeight: 1.3 }}>
                  {item.name}
                </Typography>
                
                {/* Product Code */}
                {item.productCode && (
                  <Typography variant="body2" sx={{ color: '#C59B5F', fontWeight: 800, mb: 0.5, mt: 0.5, fontSize: '0.85rem' }}>
                    كود: {item.productCode}
                  </Typography>
                )}

                {/* Components / Description */}
                {item.components && item.components.length > 0 ? (
                  <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, mb: 1, flexGrow: 1, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.components.join(' • ')}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500, mb: 1, flexGrow: 1, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </Typography>
                )}

                {/* Divider */}
                <Box sx={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, rgba(197,155,95,0.2) 0%, rgba(197,155,95,0) 100%)', my: 1.5 }} />

                {/* Price Section */}
                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mt: 'auto' }}>
                  <Box>
                    {Boolean(item.discountPercentage && item.discountPercentage > 0) && (
                      <Typography variant="caption" sx={{ textDecoration: 'line-through', color: '#94A3B8', fontWeight: 700, display: 'block', mb: 0.5 }}>
                        {item.hasSizes && item.sizes && item.sizes.length > 0 
                          ? Math.min(...item.sizes.map(s => s.price)).toLocaleString()
                          : item.price?.toLocaleString()} ج.م
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                      {item.hasSizes && item.sizes && item.sizes.length > 0 && (
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, mr: 0.5 }}>يبدأ من</Typography>
                      )}
                      <Typography variant="h5" sx={{ fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>
                        {item.discountPercentage && item.discountPercentage > 0 
                          ? (item.hasSizes && item.sizes && item.sizes.length > 0
                              ? Math.round((Math.min(...item.sizes.map(s => s.price)) * (1 - item.discountPercentage / 100)) * 100) / 100 
                              : Math.round(((item.price || 0) * (1 - item.discountPercentage / 100)) * 100) / 100).toLocaleString()
                          : (item.hasSizes && item.sizes && item.sizes.length > 0
                              ? Math.min(...item.sizes.map(s => s.price)).toLocaleString()
                              : item.price?.toLocaleString())}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#0F172A', fontWeight: 900 }}>ج.م</Typography>
                    </Box>
                  </Box>
                  
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
          </Link>
        ))}
      </Box>
    </Box>
  );
}
