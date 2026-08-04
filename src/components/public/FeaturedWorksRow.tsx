'use client';

import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Image from 'next/image';

interface FeaturedWorkItem {
  _id: string;
  name: string;
  description: string;
  price: number | null;
  hasSizes?: boolean;
  sizes?: { name: string; price: number }[];
  image: { url: string; publicId: string };
}

interface FeaturedWorksRowProps {
  items: FeaturedWorkItem[];
}

export default function FeaturedWorksRow({ items }: FeaturedWorksRowProps) {
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
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  if (!items || items.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, px: { xs: 2, md: 3 } }}>
        <StarIcon sx={{ color: '#2E8B9A', fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#1B3A4B' }}>
          أبرز الأعمال
        </Typography>
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
          gap: 2,
          pt: 2, 
          pb: 2,
          px: { xs: 2, md: 3 },
          scrollSnapType: 'x mandatory',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item) => (
          <Card
            key={item._id}
            sx={{
              minWidth: { xs: 240, sm: 280 },
              maxWidth: { xs: 240, sm: 280 },
              scrollSnapAlign: 'start',
              borderRadius: '24px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              bgcolor: '#FFFFFF',
              color: '#1B3A4B',
              boxShadow: '0 8px 24px rgba(27,58,75, 0.08)',
              border: '1px solid rgba(27,58,75, 0.04)',
              cursor: 'pointer', // Since cards will be clickable later, let's hint it
            }}
          >
            {/* Teal Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: '#2E8B9A',
                color: '#fff',
                px: 1.5,
                py: 0.5,
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                boxShadow: '0 4px 12px rgba(46, 139, 154, 0.3)',
              }}
            >
              أبرز الأعمال <StarIcon sx={{ fontSize: 16, mb: '2px' }} />
            </Box>

            <Box
              sx={{
                width: '100%',
                height: 220,
                position: 'relative',
                bgcolor: '#F7F9FA',
                overflow: 'hidden',
                '& img': {
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                '&:hover img': {
                  transform: 'scale(1.08)'
                }
              }}
            >
              {item.image?.url ? (
                <Image
                  src={item.image.url}
                  alt={item.name}
                  fill
                  sizes="(max-width: 600px) 280px, 280px"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StarIcon sx={{ fontSize: 40, color: 'rgba(0,0,0,0.1)' }} />
                </Box>
              )}
            </Box>

            <CardContent sx={{ pt: 2, pb: '20px !important', flexGrow: 1, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, color: '#1B3A4B' }}>
                {item.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#5A6B72', mb: 2, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.description}
              </Typography>

              {/* Dashed Separator */}
              <Box sx={{ borderTop: '2px dashed #E2E8F0', my: 2, mx: 'auto', width: '100%' }} />

              {/* Price */}
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 0.5, mt: 'auto' }}>
                {item.hasSizes && item.sizes && item.sizes.length > 0 ? (
                  <>
                    <Typography variant="body2" sx={{ color: '#5A6B72' }}>تبدأ من</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#2E8B9A' }}>
                      {Math.min(...item.sizes.map(s => s.price))}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5A6B72', fontWeight: 600 }}>ج.م</Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#2E8B9A' }}>
                      {item.price}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5A6B72', fontWeight: 600 }}>ج.م</Typography>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
