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
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

interface WorkDetailItem {
  _id: string;
  name: string;
  description: string;
  price: number | null;
  hasSizes?: boolean;
  sizes?: { name: string; price: number; variantDetails?: {
    woodType?: string;
    paintType?: string;
    mechanism?: string;
    handles?: string;
    hinges?: string;
    warranty?: string;
    productionTime?: string;
    dimensions?: { length?: number | null; width?: number | null; height?: number | null; };
  }; }[];
  technicalDetails?: {
    woodType?: string;
    paintType?: string;
    mechanism?: string;
    handles?: string;
    hinges?: string;
    warranty?: string;
    productionTime?: string;
    dimensions?: { length?: number | null; width?: number | null; height?: number | null; };
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

  const activeSpecs = (isSizesAvailable && validSizes[selectedSizeIndex]?.variantDetails) 
    ? validSizes[selectedSizeIndex].variantDetails 
    : (item.technicalDetails || {});

  const formatDimensions = (dims?: { length?: number | null, width?: number | null, height?: number | null } | string) => {
    if (!dims) return null;
    if (typeof dims === 'string') return dims;
    
    const parts = [];
    if (dims.length) parts.push(`طول: ${dims.length} سم`);
    if (dims.width) parts.push(`عرض: ${dims.width} سم`);
    if (dims.height) parts.push(`ارتفاع: ${dims.height} سم`);

    if (parts.length === 3) {
      return `${dims.length} × ${dims.width} × ${dims.height} سم`;
    }
    
    return parts.length > 0 ? parts.join(' | ') : null;
  };
  
  const formattedDimensions = formatDimensions(activeSpecs?.dimensions as any);

  const handleContactClick = () => {
    const priceText = displayPrice ? `\nالسعر: ${displayPrice.toLocaleString()} ج.م` : '';
    const productUrl = typeof window !== 'undefined' ? window.location.href : '';
    const text = `مرحباً، مهتم بطلب هذا المنتج:\n\nالاسم: ${item.name}${item.productCode ? ` (الكود: ${item.productCode})` : ''}${selectedSizeName ? `\nالمقاس: ${selectedSizeName}` : ''}${priceText}\n\nرابط المنتج:\n${productUrl}`;
    
    let cleanWhatsapp = (whatsappNumber || '').replace(/[^0-9]/g, '');
    if (!cleanWhatsapp) {
      cleanWhatsapp = '201000000000'; // Default fallback
    } else if (cleanWhatsapp.startsWith('0')) {
      cleanWhatsapp = '2' + cleanWhatsapp;
    }

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanWhatsapp}&text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderCategorySelection = () => {
    if (!isSizesAvailable) return null;
    return (
      <Box sx={{ width: { xs: '100%', md: 'auto' }, minWidth: { md: '300px' } }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#1B3A4B', mb: 1.5, textAlign: { xs: 'center', md: 'start' } }}>
            اختار الفئة
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            p: 2, 
            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', 
            borderRadius: '16px', 
            border: '1px solid #E2E8F0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', background: 'linear-gradient(to bottom, #2E8B9A, #1B3A4B)' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '10px', bgcolor: '#fff', color: '#1B3A4B', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <TouchAppOutlinedIcon fontSize="small" />
            </Box>
            <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.6, textAlign: 'start' }}>
              السعر والمواصفات بيتغيروا حسب الفئة اللي بتختارها.. قلّب في الفئات واختار اللي يظبط معاك!
            </Typography>
          </Box>
        </Box>
        <Box sx={{ 
          width: '100%', 
          overflowX: 'auto',
          pb: 1, 
          '&::-webkit-scrollbar': { display: 'none' }, 
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          <Box sx={{ 
            display: 'inline-flex', 
            minWidth: { xs: '100%', sm: 'auto' }, 
            p: 0.75, 
            bgcolor: '#F8FAFC', 
            borderRadius: '16px', 
            position: 'relative',
            border: '1px solid #E2E8F0',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
          }}>
          {/* Sliding Pill */}
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 6, 
              bottom: 6, 
              left: `calc(${selectedSizeIndex} * ((100% - 12px) / ${validSizes.length}) + 6px)`,
              width: `calc((100% - 12px) / ${validSizes.length})`, 
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1877F2 0%, #1469D8 100%)', // Facebook Blue Gradient
              boxShadow: '0 4px 15px rgba(24, 119, 242, 0.3)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }} 
          />
          {/* Buttons */}
          {validSizes.map((size, index) => {
            const isSelected = index === selectedSizeIndex;
            return (
              <ButtonBase
                key={size.name}
                onClick={() => setSelectedSizeIndex(index)}
                sx={{
                  zIndex: 1,
                  flex: 1,
                  minWidth: { xs: 0, sm: '120px' },
                  px: { xs: 2, sm: 3 },
                  py: 1.2,
                  borderRadius: '12px',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 900,
                  color: isSelected ? '#ffffff' : '#1B3A4B',
                  transition: 'color 0.4s ease',
                  '&:hover': {
                    color: isSelected ? '#ffffff' : '#1877F2'
                  }
                }}
              >
                {size.name}
              </ButtonBase>
            );
          })}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
      
      {/* Top Section (Flex on Desktop): Category, Title, Description on Right. Sizes on Left. */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between',
        alignItems: { xs: 'center', md: 'flex-start' },
        gap: 4,
        mb: { xs: 4, md: 6 },
        px: { xs: 0, lg: 2 }
      }}>
        {/* Right Side (Text) */}
        <Box sx={{ maxWidth: { xs: '100%', md: '60%' }, mx: { xs: 'auto', md: 0 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
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
            {item.productCode && (
              <Chip 
                label={item.productCode} 
                size="small"
                sx={{ 
                  bgcolor: '#F1F5F9', 
                  color: '#475569', 
                  fontWeight: 700, 
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  height: '24px',
                  dir: 'ltr'
                }} 
              />
            )}
            {item.category?.name && (
              <Typography variant="body2" sx={{ color: '#5A6B72', fontWeight: 600, fontSize: '0.85rem' }}>
                {item.category.name}
              </Typography>
            )}
          </Box>
          <Typography variant="h1" sx={{ fontWeight: 900, color: '#1B3A4B', mb: 1.5, fontSize: { xs: '1.75rem', md: '2.5rem' }, lineHeight: 1.3, textAlign: { xs: 'center', md: 'start' } }}>
            {item.name}
          </Typography>
          <Typography variant="body1" sx={{ color: '#5A6B72', fontSize: { xs: '0.95rem', md: '1.05rem' }, fontWeight: 500, lineHeight: 1.8, textAlign: { xs: 'center', md: 'start' } }}>
            {item.description || "تصميم عصري فاخر مصمم بأجود أنواع الأخشاب والخامات ليدوم طويلاً ويضيف لمسة من الأناقة لمساحتك."}
          </Typography>
        </Box>

        {/* Left Side: Sizes (Category Selection) - Desktop Only */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          {renderCategorySelection()}
        </Box>
      </Box>

      {/* Main Content Layout */}
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
          aspectRatio: { xs: '16/9', md: '4/3', lg: '4/3' },
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

        {/* Left Side (in RTL): Specs & Price */}
        <Box sx={{ 
          flex: 1, 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: { md: 'sticky' },
          top: { md: 100 },
          pl: { lg: 4 } // Extra padding on the left to center it a bit
        }}>
          
          {/* Mobile Only: Category Selection */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4 }}>
            {renderCategorySelection()}
          </Box>

          {/* Technical Details (Active Specs) */}
        {(activeSpecs.woodType || activeSpecs.paintType || activeSpecs.warranty || activeSpecs.dimensions || activeSpecs.productionTime || activeSpecs.mechanism || activeSpecs.handles || activeSpecs.hinges) && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: '#1B3A4B', fontWeight: 900, mb: 2.5, fontSize: '1.2rem' }}>
              المواصفات والخامات
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
              gap: { xs: 1.5, md: 2 } 
            }}>
              
              {formattedDimensions && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: { xs: 1.2, md: 2 }, px: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', transition: 'all 0.3s', '&:hover': { borderColor: '#CBD5E1', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CheckCircleOutlinedIcon sx={{ fontSize: '1.2rem', color: '#2E8B9A' }} />
                    <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700 }}>الأبعاد</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 800, textAlign: 'start', pr: 3.5, dir: 'ltr' }}>{formattedDimensions}</Typography>
                </Box>
              )}

              {activeSpecs.woodType && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: { xs: 1.2, md: 2 }, px: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', transition: 'all 0.3s', '&:hover': { borderColor: '#CBD5E1', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CheckCircleOutlinedIcon sx={{ fontSize: '1.2rem', color: '#2E8B9A' }} />
                    <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700 }}>الخشب</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 800, textAlign: 'start', pr: 3.5 }}>{activeSpecs.woodType}</Typography>
                </Box>
              )}

              {activeSpecs.paintType && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: { xs: 1.2, md: 2 }, px: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', transition: 'all 0.3s', '&:hover': { borderColor: '#CBD5E1', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CheckCircleOutlinedIcon sx={{ fontSize: '1.2rem', color: '#2E8B9A' }} />
                    <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700 }}>الدهان</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 800, textAlign: 'start', pr: 3.5 }}>{activeSpecs.paintType}</Typography>
                </Box>
              )}

              {activeSpecs.mechanism && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: { xs: 1.2, md: 2 }, px: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', transition: 'all 0.3s', '&:hover': { borderColor: '#CBD5E1', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CheckCircleOutlinedIcon sx={{ fontSize: '1.2rem', color: '#2E8B9A' }} />
                    <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700 }}>الميكانزم</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 800, textAlign: 'start', pr: 3.5 }}>{activeSpecs.mechanism}</Typography>
                </Box>
              )}

              {activeSpecs.handles && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: { xs: 1.2, md: 2 }, px: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', transition: 'all 0.3s', '&:hover': { borderColor: '#CBD5E1', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CheckCircleOutlinedIcon sx={{ fontSize: '1.2rem', color: '#2E8B9A' }} />
                    <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700 }}>المقابض</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 800, textAlign: 'start', pr: 3.5 }}>{activeSpecs.handles}</Typography>
                </Box>
              )}

              {activeSpecs.hinges && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: { xs: 1.2, md: 2 }, px: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', transition: 'all 0.3s', '&:hover': { borderColor: '#CBD5E1', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CheckCircleOutlinedIcon sx={{ fontSize: '1.2rem', color: '#2E8B9A' }} />
                    <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700 }}>المفصلات</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 800, textAlign: 'start', pr: 3.5 }}>{activeSpecs.hinges}</Typography>
                </Box>
              )}
              
              {activeSpecs.productionTime && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: { xs: 1.2, md: 2 }, px: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', transition: 'all 0.3s', '&:hover': { borderColor: '#CBD5E1', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CheckCircleOutlinedIcon sx={{ fontSize: '1.2rem', color: '#2E8B9A' }} />
                    <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700 }}>مدة التنفيذ</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 800, textAlign: 'start', pr: 3.5 }}>{activeSpecs.productionTime}</Typography>
                </Box>
              )}
              
              {activeSpecs.warranty && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: { xs: 1.2, md: 2 }, px: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', transition: 'all 0.3s', '&:hover': { borderColor: '#CBD5E1', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CheckCircleOutlinedIcon sx={{ fontSize: '1.2rem', color: '#2E8B9A' }} />
                    <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700 }}>الضمان</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 800, textAlign: 'start', pr: 3.5 }}>{activeSpecs.warranty}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
        
        <Divider sx={{ my: 2.5, opacity: 0.6 }} />



        {/* Price & Action */}
        <Box sx={{ 
          mt: 'auto', 
          p: { xs: 2.5, md: 3 }, 
          bgcolor: '#F8FAFC', 
          borderRadius: '20px', 
          border: '1px solid',
          borderColor: '#E2E8F0',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'column' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 2, md: 2.5 }
        }}>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'center' }, flexShrink: 0 }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 0.5, display: { xs: 'none', md: 'block' } }}>إجمالي السعر</Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              {displayPrice !== null && displayPrice !== undefined ? (
                <>
                  <Typography variant="h2" sx={{ fontWeight: 900, color: '#0F172A', fontSize: { xs: '2.25rem', md: '2.5rem' }, letterSpacing: '-0.5px' }}>
                    {displayPrice.toLocaleString()}
                  </Typography>
                  <Typography component="span" variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.1rem' }}>
                    ج.م
                  </Typography>
                </>
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#0F172A' }}>السعر غير محدد</Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: { xs: '100%', md: 'auto' }, flexGrow: { xs: 1, md: 0 }, minWidth: { md: '280px' } }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleContactClick}
              startIcon={<WhatsAppIcon sx={{ ml: 2, mr: -0.5, fontSize: '1.4rem !important' }} />}
              sx={{ 
                bgcolor: '#25D366',
                color: '#fff',
                py: { xs: 1.2, md: 1.5 },
                fontSize: '1.15rem',
                fontWeight: 800,
                borderRadius: '14px',
                boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: '#1EBE5A',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 28px rgba(37, 211, 102, 0.4)',
                }
              }}
            >
              اطلب عبر الواتساب
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              href={`tel:${whatsappNumber || ''}`}
              startIcon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8, marginRight: -8 }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              }
              sx={{ 
                color: '#1877F2',
                borderColor: '#1877F2',
                bgcolor: '#ffffff',
                py: { xs: 1, md: 1.2 },
                fontSize: '1rem',
                fontWeight: 800,
                borderRadius: '14px',
                borderWidth: '2px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: '#F0F7FF',
                  borderColor: '#1469D8',
                  borderWidth: '2px',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              اتصل بنا للاستفسار
            </Button>
            
            <Box sx={{ 
              mt: 0.5,
              p: 1.2,
              bgcolor: 'rgba(197, 155, 95, 0.04)',
              borderRadius: '10px',
              border: '1px dashed rgba(197, 155, 95, 0.6)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <Typography sx={{ color: '#A67C43', fontWeight: 900, textAlign: 'center', fontSize: '0.85rem', letterSpacing: '0.3px' }}>
                متاح تعديل الخامات والمقاسات بالاتفاق، وقد يختلف السعر.
              </Typography>
            </Box>
          </Box>
        </Box>

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
