'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, IconButton, Typography, Box, ButtonBase, Button, Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

interface WorkDetailItem {
  _id: string;
  name: string;
  description: string;
  price: number | null;
  hasSizes?: boolean;
  sizes?: { name: string; price: number }[];
  image?: { url: string; publicId: string };
  gallery?: { url: string; publicId: string }[];
  isBestSeller?: boolean;
}

interface WorkDetailDialogProps {
  open: boolean;
  onClose: () => void;
  item: WorkDetailItem | null;
  initialSizeIndex?: number;
  whatsappNumber?: string;
}

export default function WorkDetailDialog({ open, onClose, item, initialSizeIndex = 0, whatsappNumber }: WorkDetailDialogProps) {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState<number>(0);

  useEffect(() => {
    if (open) {
      setSelectedSizeIndex(initialSizeIndex);
      setCurrentGalleryIndex(0);
    }
  }, [open, initialSizeIndex]);

  if (!item) return null;

  const validSizes = item.sizes?.filter(s => s.name && s.price > 0) || [];
  const isSizesAvailable = item.hasSizes && validSizes.length > 0;
  
  const displayPrice = isSizesAvailable 
    ? validSizes[selectedSizeIndex]?.price 
    : item.price;

  const selectedSizeName = isSizesAvailable ? validSizes[selectedSizeIndex]?.name : '';

  const carouselImages = [];
  if (item.image?.url) carouselImages.push(item.image.url);
  if (item.gallery && item.gallery.length > 0) {
    item.gallery.forEach(img => carouselImages.push(img.url));
  }

  const handleContactClick = () => {
    const priceText = displayPrice ? `\nالسعر: ${displayPrice.toLocaleString()} ج.م` : '';
    const text = `مرحباً، مهتم بطلب هذا المنتج:\n\nالاسم: ${item.name}${selectedSizeName ? `\nالمقاس: ${selectedSizeName}` : ''}${priceText}\n\nصورة المنتج:\n${item.image?.url || 'لا توجد صورة'}`;
    
    let cleanWhatsapp = (whatsappNumber || '').replace(/[^0-9]/g, '');
    if (!cleanWhatsapp) {
      cleanWhatsapp = '201000000000'; // Default fallback
    } else if (cleanWhatsapp.startsWith('0')) {
      // If it starts with 0 (e.g., 010...), prepend 2 for Egypt's country code
      cleanWhatsapp = '2' + cleanWhatsapp;
    }

    // api.whatsapp.com is much more reliable than wa.me for both mobile and web
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanWhatsapp}&text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg" // Increased for a more spacious layout
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: '20px 20px 0 0', sm: '32px' },
            m: { xs: 0, sm: 2, md: 4 },
            position: { xs: 'fixed', sm: 'relative' },
            bottom: { xs: 0, sm: 'auto' },
            width: '100%',
            maxHeight: { xs: '92vh', sm: '90vh' },
            overflow: 'hidden',
            bgcolor: '#ffffff'
          }
        }
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          bgcolor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 10,
          '&:hover': { bgcolor: '#f5f5f5' }
        }}
      >
        <CloseIcon sx={{ color: '#1B3A4B' }} />
      </IconButton>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100%' }}>
        
        {/* Left Side: Image Gallery */}
        <Box sx={{ 
          width: { xs: '100%', md: '55%' }, 
          bgcolor: '#F7F9FA',
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2, md: 3 },
          gap: 2
        }}>
          {/* Main Large Image */}
          <Box sx={{ 
            position: 'relative',
            width: '100%',
            aspectRatio: { xs: '4/3', md: '1/1', lg: '4/3' },
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(0,0,0,0.06)'
          }}>
            {carouselImages.length > 0 ? (
              <Image 
                src={carouselImages[currentGalleryIndex]}
                alt={`${item.name}`}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}>
              {carouselImages.map((img, idx) => (
                <Box
                  key={idx}
                  onClick={() => setCurrentGalleryIndex(idx)}
                  sx={{
                    width: { xs: 70, md: 90 },
                    height: { xs: 70, md: 90 },
                    flexShrink: 0,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: idx === currentGalleryIndex ? '2.5px solid #C59B5F' : '2px solid transparent',
                    boxShadow: idx === currentGalleryIndex ? '0 4px 12px rgba(197, 155, 95, 0.3)' : '0 4px 12px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s',
                    opacity: idx === currentGalleryIndex ? 1 : 0.6,
                    '&:hover': { opacity: 1 }
                  }}
                >
                  <Image src={img} alt={`thumb-${idx}`} fill style={{ objectFit: 'cover' }} />
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Right Side: Product Details */}
        <Box sx={{ 
          width: { xs: '100%', md: '45%' }, 
          p: { xs: 3, md: 5 },
          display: 'flex',
          flexDirection: 'column',
          dir: 'rtl',
          overflowY: 'auto'
        }}>
          
          {/* Badge & Title */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ 
              border: '1.5px solid #C59B5F', 
              color: '#C59B5F', 
              px: 2, 
              py: 0.5, 
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              mb: 2
            }}>
              جديد
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#1B3A4B', mb: 1, fontSize: { xs: '1.75rem', md: '2.2rem' } }}>
              {item.name}
            </Typography>
            <Typography variant="body1" sx={{ color: '#5A6B72', fontSize: '1.05rem', fontWeight: 500 }}>
              {item.description || "تصميم عصري فاخر"}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 3, opacity: 0.6 }} />

          {/* Sizes */}
          {isSizesAvailable && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ color: '#1B3A4B', fontWeight: 800, mb: 2 }}>
                المقاسات المتاحة
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {validSizes.map((size, index) => {
                  const isSelected = index === selectedSizeIndex;
                  return (
                    <ButtonBase
                      key={size.name}
                      onClick={() => setSelectedSizeIndex(index)}
                      sx={{
                        px: 3,
                        py: 1.25,
                        borderRadius: '30px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        bgcolor: isSelected ? '#1B3A4B' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#5A6B72',
                        border: isSelected ? '2px solid #C59B5F' : '1.5px solid rgba(27, 58, 75, 0.15)',
                        boxShadow: isSelected ? '0 8px 20px rgba(27, 58, 75, 0.2)' : 'none',
                        transition: 'all 0.2s',
                        dir: 'ltr',
                        '&:hover': {
                          borderColor: isSelected ? '#C59B5F' : '#1B3A4B',
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

          {/* Price & Add to Cart */}
          <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                {displayPrice !== null && displayPrice !== undefined ? (
                  <>
                    <Typography variant="h2" sx={{ fontWeight: 900, color: '#1B3A4B', fontSize: { xs: '2.5rem', md: '3rem' } }}>
                      {displayPrice.toLocaleString()}
                    </Typography>
                    <Typography component="span" variant="h5" sx={{ fontWeight: 800, color: '#1B3A4B' }}>
                      ج.م
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#1B3A4B' }}>السعر غير محدد</Typography>
                )}
              </Box>
              <Typography variant="body2" sx={{ color: '#5A6B72', fontWeight: 600 }}>
                السعر شامل الضريبة
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleContactClick}
              sx={{ 
                bgcolor: { xs: '#1B3A4B', md: '#C59B5F' }, 
                color: '#fff',
                py: 2,
                fontSize: '1.15rem',
                fontWeight: 800,
                borderRadius: '16px',
                boxShadow: { 
                  xs: '0 12px 32px rgba(27, 58, 75, 0.25)', 
                  md: '0 12px 32px rgba(197, 155, 95, 0.3)' 
                },
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: { xs: '#122835', md: '#B38B50' },
                  transform: 'translateY(-2px)'
                }
              }}
            >
              طلب عبر الواتساب
            </Button>
            
            {/* Footer Features */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, px: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#5A6B72' }}>
                <VerifiedUserOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>ضمان 5 سنوات</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#5A6B72' }}>
                <LocalShippingOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>توصيل مجاني</Typography>
              </Box>
            </Box>
          </Box>

        </Box>
      </DialogContent>
    </Dialog>
  );
}
