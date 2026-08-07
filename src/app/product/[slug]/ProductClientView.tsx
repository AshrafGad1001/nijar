'use client';

import React, { useState } from 'react';
import { Box, Typography, ButtonBase, Button, Divider, Chip, Modal } from '@mui/material';
import Image from 'next/image';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import ForestOutlinedIcon from '@mui/icons-material/ForestOutlined';
import FormatPaintOutlinedIcon from '@mui/icons-material/FormatPaintOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

interface WorkDetailItem {
  _id: string;
  name: string;
  description: string;
  price: number | null;
  hasSizes?: boolean;
  sizes?: { name: string; price: number; variantDetails?: {
    woodType?: string;
    paintType?: string;
    hardware?: string;
    material?: string;
    dimensions?: string;
  }; }[];
  technicalDetails?: {
    woodType?: string;
    paintType?: string;
    warranty?: string;
    dimensions?: string;
    productionTime?: string;
  };
  image?: { url: string; publicId: string };
  gallery?: { url: string; publicId: string }[];
  isBestSeller?: boolean;
  category?: { name: string };
}

interface ProductClientViewProps {
  item: WorkDetailItem;
  whatsappNumber: string;
}

export default function ProductClientView({ item, whatsappNumber }: ProductClientViewProps) {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState<number>(0);
  
  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const carouselImages = [];
  if (item.image?.url) carouselImages.push(item.image.url);
  if (item.gallery && item.gallery.length > 0) {
    item.gallery.forEach(img => carouselImages.push(img.url));
  }

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentGalleryIndex(prev => prev === 0 ? carouselImages.length - 1 : prev - 1);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentGalleryIndex(prev => prev === carouselImages.length - 1 ? 0 : prev + 1);
  };

  // Swipe Handlers
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNext(); // Next image on left swipe
    if (isRightSwipe) handlePrev(); // Prev image on right swipe
  };

  const validSizes = item.sizes?.filter(s => s.name && s.price > 0) || [];
  const isSizesAvailable = item.hasSizes && validSizes.length > 0;
  
  const displayPrice = isSizesAvailable 
    ? validSizes[selectedSizeIndex]?.price 
    : item.price;

  const selectedSizeName = isSizesAvailable ? validSizes[selectedSizeIndex]?.name : '';

  const baseSpecs = item.technicalDetails || {};
  const variantSpecs = (isSizesAvailable && validSizes[selectedSizeIndex]?.variantDetails) || {};

  const mergedSpecs = {
    woodType: variantSpecs.woodType || baseSpecs.woodType,
    paintType: variantSpecs.paintType || baseSpecs.paintType,
    warranty: baseSpecs.warranty,
    dimensions: variantSpecs.dimensions || baseSpecs.dimensions,
    productionTime: baseSpecs.productionTime,
    hardware: variantSpecs.hardware,
    material: variantSpecs.material
  };

  const handleContactClick = () => {
    const priceText = displayPrice ? `\nالسعر: ${displayPrice.toLocaleString()} ج.م` : '';
    const productUrl = typeof window !== 'undefined' ? window.location.href : '';
    const text = `مرحباً، مهتم بطلب هذا المنتج:\n\nالاسم: ${item.name}${selectedSizeName ? `\nالمقاس: ${selectedSizeName}` : ''}${priceText}\n\nرابط المنتج:\n${productUrl}`;
    
    let cleanWhatsapp = (whatsappNumber || '').replace(/[^0-9]/g, '');
    if (!cleanWhatsapp) {
      cleanWhatsapp = '201000000000'; // Default fallback
    } else if (cleanWhatsapp.startsWith('0')) {
      cleanWhatsapp = '2' + cleanWhatsapp;
    }

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanWhatsapp}&text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },
      gap: { xs: 3, lg: 5 },
      alignItems: 'flex-start'
    }}>
      
      {/* Right Side (in RTL): Image Gallery */}
      <Box sx={{ 
        width: { xs: '100%', md: '55%', lg: '55%' }, 
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5
      }}>
        {/* Main Large Image */}
        <Box 
          onClick={() => setIsLightboxOpen(true)}
          sx={{ 
          position: 'relative',
          width: '100%',
          aspectRatio: { xs: '4/3', md: '4/3', lg: '4/3' },
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          bgcolor: '#fff',
          cursor: 'pointer',
          '&:hover .nav-btn': {
            opacity: 1
          }
        }}>
          {carouselImages.length > 0 ? (
            <>
              <Image 
                src={carouselImages[currentGalleryIndex]}
                alt={`${item.name}`}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 55vw"
                style={{ objectFit: 'cover' }}
              />
              
              {/* Image Navigation Pill */}
              {carouselImages.length > 1 && (
                <Box 
                  dir="ltr"
                  sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: 'rgba(30, 30, 30, 0.75)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  px: 1,
                  py: 0.5,
                  gap: 1.5,
                  color: '#fff',
                  zIndex: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  {/* Left Button (Next in RTL) */}
                  <ButtonBase 
                    onClick={(e) => { e.stopPropagation(); setCurrentGalleryIndex(prev => prev === carouselImages.length - 1 ? 0 : prev + 1); }}
                    sx={{ p: 0.75, borderRadius: '50%', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                  >
                    {/* Points Left */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </ButtonBase>
                  
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', minWidth: '35px', textAlign: 'center', letterSpacing: '1px' }}>
                    {currentGalleryIndex + 1}/{carouselImages.length}
                  </Typography>

                  {/* Right Button (Previous in RTL) */}
                  <ButtonBase 
                    onClick={(e) => { e.stopPropagation(); setCurrentGalleryIndex(prev => prev === 0 ? carouselImages.length - 1 : prev - 1); }}
                    sx={{ p: 0.75, borderRadius: '50%', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                  >
                    {/* Points Right */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </ButtonBase>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F3F4F6' }}>
              <Typography color="text.secondary">لا توجد صورة</Typography>
            </Box>
          )}
        </Box>

        {/* Thumbnails */}
        {carouselImages.length > 1 && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1.5, 
            overflowX: 'auto', 
            pb: 1,
            '&::-webkit-scrollbar': { height: '5px' },
            '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
            '&::-webkit-scrollbar-thumb': { background: '#ddd', borderRadius: '4px' },
            '&::-webkit-scrollbar-thumb:hover': { background: '#ccc' },
          }}>
            {carouselImages.map((img, idx) => (
              <Box
                key={idx}
                onClick={() => {
                  setCurrentGalleryIndex(idx);
                  setIsLightboxOpen(true);
                }}
                sx={{
                  width: { xs: 70, md: 80 },
                  height: { xs: 70, md: 80 },
                  flexShrink: 0,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: idx === currentGalleryIndex ? '2.5px solid #2E8B9A' : '1.5px solid transparent',
                  boxShadow: idx === currentGalleryIndex ? '0 4px 12px rgba(46, 139, 154, 0.2)' : '0 2px 6px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease-in-out',
                  opacity: idx === currentGalleryIndex ? 1 : 0.6,
                  '&:hover': { opacity: 1, transform: 'translateY(-2px)' }
                }}
              >
                <Image src={img} alt={`thumb-${idx}`} fill style={{ objectFit: 'cover' }} />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Left Side (in RTL): Product Details */}
      <Box sx={{ 
        width: { xs: '100%', md: '45%', lg: '45%' }, 
        display: 'flex',
        flexDirection: 'column',
        dir: 'rtl',
        position: { md: 'sticky' },
        top: { md: 100 },
        pl: { lg: 4 } // Extra padding on the left to center it a bit
      }}>
        
        {/* Category & Title */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Chip 
              label="جديد" 
              size="small"
              sx={{ 
                bgcolor: 'rgba(197, 155, 95, 0.1)', 
                color: '#C59B5F', 
                fontWeight: 700, 
                borderRadius: '6px',
                fontSize: '0.75rem',
                height: '24px'
              }} 
            />
            {item.category?.name && (
              <Typography variant="body2" sx={{ color: '#5A6B72', fontWeight: 600, fontSize: '0.85rem' }}>
                {item.category.name}
              </Typography>
            )}
          </Box>
          <Typography variant="h1" sx={{ fontWeight: 900, color: '#1B3A4B', mb: 1.5, fontSize: { xs: '1.75rem', md: '2rem' }, lineHeight: 1.3 }}>
            {item.name}
          </Typography>
          <Typography variant="body1" sx={{ color: '#5A6B72', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.7 }}>
            {item.description || "تصميم عصري فاخر مصمم بأجود أنواع الأخشاب والخامات ليدوم طويلاً ويضيف لمسة من الأناقة لمساحتك."}
          </Typography>
        </Box>
        
        {/* Technical Details (Merged Specs) */}
        {(mergedSpecs.woodType || mergedSpecs.paintType || mergedSpecs.warranty || mergedSpecs.dimensions || mergedSpecs.productionTime || mergedSpecs.hardware || mergedSpecs.material) && (
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#1B3A4B', fontWeight: 800, mb: 1.5 }}>
              المواصفات الفنية
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
              gap: 1.5 
            }}>
              {mergedSpecs.woodType && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <ForestOutlinedIcon sx={{ color: '#2E8B9A', fontSize: '1.2rem' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#5A6B72', fontSize: '0.8rem' }}>{mergedSpecs.woodType}</Typography>
                </Box>
              )}
              {mergedSpecs.paintType && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <FormatPaintOutlinedIcon sx={{ color: '#2E8B9A', fontSize: '1.2rem' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#5A6B72', fontSize: '0.8rem' }}>{mergedSpecs.paintType}</Typography>
                </Box>
              )}
              {mergedSpecs.material && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#5A6B72', fontSize: '0.8rem' }}>الخامات: {mergedSpecs.material}</Typography>
                </Box>
              )}
              {mergedSpecs.hardware && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#5A6B72', fontSize: '0.8rem' }}>إكسسوار: {mergedSpecs.hardware}</Typography>
                </Box>
              )}
              {mergedSpecs.dimensions && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <StraightenOutlinedIcon sx={{ color: '#2E8B9A', fontSize: '1.2rem' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#5A6B72', fontSize: '0.8rem' }}>{mergedSpecs.dimensions}</Typography>
                </Box>
              )}
              {mergedSpecs.productionTime && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <AccessTimeOutlinedIcon sx={{ color: '#2E8B9A', fontSize: '1.2rem' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#5A6B72', fontSize: '0.8rem' }}>{mergedSpecs.productionTime}</Typography>
                </Box>
              )}
              {mergedSpecs.warranty && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <VerifiedUserOutlinedIcon sx={{ color: '#2E8B9A', fontSize: '1.2rem' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#5A6B72', fontSize: '0.8rem' }}>{mergedSpecs.warranty}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
        
        <Divider sx={{ my: 2.5, opacity: 0.6 }} />

        {/* Sizes */}
        {isSizesAvailable && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: '#1B3A4B' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
                <path d="M8 16L16 8" />
                <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
              </svg>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '1rem', mt: 0.5 }}>
                اختر المقاس
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {validSizes.map((size, index) => {
                const isSelected = index === selectedSizeIndex;
                return (
                  <ButtonBase
                    key={size.name}
                    onClick={() => setSelectedSizeIndex(index)}
                    sx={{
                      px: 2.5,
                      py: 1,
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      bgcolor: isSelected ? '#1B3A4B' : '#fff',
                      color: isSelected ? '#fff' : '#1B3A4B',
                      border: isSelected ? '2px solid #1B3A4B' : '1.5px solid #E5E7EB',
                      boxShadow: isSelected ? '0 4px 12px rgba(27, 58, 75, 0.15)' : 'none',
                      transition: 'all 0.2s',
                      dir: 'ltr',
                      '&:hover': {
                        borderColor: '#1B3A4B',
                        bgcolor: isSelected ? '#1B3A4B' : 'rgba(27, 58, 75, 0.02)'
                      }
                    }}
                  >
                    {size.name}
                  </ButtonBase>
                );
              })}
            </Box>

          </Box>
        )}

        {/* Price & Action */}
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              {displayPrice !== null && displayPrice !== undefined ? (
                <>
                  <Typography variant="h2" sx={{ fontWeight: 900, color: '#1B3A4B', fontSize: { xs: '2rem', md: '2.25rem' } }}>
                    {displayPrice.toLocaleString()}
                  </Typography>
                  <Typography component="span" variant="h6" sx={{ fontWeight: 800, color: '#1B3A4B', fontSize: '1rem' }}>
                    ج.م
                  </Typography>
                </>
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#1B3A4B' }}>السعر غير محدد</Typography>
              )}
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleContactClick}
            startIcon={<WhatsAppIcon sx={{ ml: 1, mr: -1, fontSize: '1.25rem !important' }} />}
            sx={{ 
              bgcolor: '#25D366', // Official WhatsApp Color
              color: '#fff',
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 800,
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(37, 211, 102, 0.25)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#1EBE5A',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(37, 211, 102, 0.3)',
              }
            }}
          >
            طلب عبر الواتساب
          </Button>
        </Box>

      </Box>

      {/* Lightbox Modal */}
      <Modal 
        open={isLightboxOpen} 
        onClose={() => setIsLightboxOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(16px)',
            }
          }
        }}
      >
        <Box 
          sx={{ position: 'relative', width: '100vw', height: '100vh', outline: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEndHandler}
        >
          {/* Close Button (Moved to Top Left) */}
          <ButtonBase
            onClick={() => setIsLightboxOpen(false)}
            sx={{
              position: 'absolute',
              top: { xs: 16, md: 32 },
              left: { xs: 16, md: 32 },
              color: '#fff',
              p: 1,
              zIndex: 10,
              opacity: 0.6,
              transition: 'all 0.3s',
              '&:hover': { opacity: 1, transform: 'rotate(90deg)' }
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </ButtonBase>

          {/* Button with 'left' sx -> Renders on Physical RIGHT in RTL */}
          <ButtonBase
            onClick={handleNext}
            sx={{
              position: 'absolute',
              left: { xs: 8, md: 40 },
              color: '#fff',
              p: 2,
              zIndex: 10,
              opacity: 0.6,
              transition: 'all 0.3s',
              '&:hover': { opacity: 1, transform: 'scale(1.1)' }
            }}
          >
            {/* Points Right */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </ButtonBase>

          {/* Button with 'right' sx -> Renders on Physical LEFT in RTL */}
          <ButtonBase
            onClick={handlePrev}
            sx={{
              position: 'absolute',
              right: { xs: 8, md: 40 },
              color: '#fff',
              p: 2,
              zIndex: 10,
              opacity: 0.6,
              transition: 'all 0.3s',
              '&:hover': { opacity: 1, transform: 'scale(1.1)' }
            }}
          >
            {/* Points Left */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </ButtonBase>

          {/* Main Image */}
          <Box sx={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: { xs: '95vw', md: '85vw', lg: '1100px' },
            aspectRatio: '4/3',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 0 60px rgba(0, 0, 0, 0.8), 0 0 100px rgba(255, 255, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.15)',
            transform: 'scale(0.9)',
            animation: 'premiumPopup 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards',
            '@keyframes premiumPopup': {
              '0%': { opacity: 0, transform: 'scale(0.95)' },
              '100%': { opacity: 1, transform: 'scale(1)' }
            }
          }}>
            <Image 
              src={carouselImages[currentGalleryIndex]}
              alt={`${item.name} - Lightbox`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 900px) 100vw, 1100px"
              priority
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
