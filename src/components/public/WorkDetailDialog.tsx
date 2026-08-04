'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, IconButton, Typography, Box, ButtonBase, Button 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface WorkDetailItem {
  _id: string;
  name: string;
  description: string;
  price: number | null;
  hasSizes?: boolean;
  sizes?: { name: string; price: number }[];
  image?: { url: string; publicId: string };
  gallery?: { url: string; publicId: string }[];
}

interface WorkDetailDialogProps {
  open: boolean;
  onClose: () => void;
  item: WorkDetailItem | null;
  initialSizeIndex?: number;
}

export default function WorkDetailDialog({ open, onClose, item, initialSizeIndex = 0 }: WorkDetailDialogProps) {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState<number>(0);

  // Sync initial size from card when opened
  useEffect(() => {
    if (open) {
      setSelectedSizeIndex(initialSizeIndex);
      setCurrentGalleryIndex(0); // Reset gallery
    }
  }, [open, initialSizeIndex]);

  if (!item) return null;

  const validSizes = item.sizes?.filter(s => s.name && s.price > 0) || [];
  const isSizesAvailable = item.hasSizes && validSizes.length > 0;
  
  const displayPrice = isSizesAvailable 
    ? validSizes[selectedSizeIndex]?.price 
    : item.price;

  const selectedSizeName = isSizesAvailable ? validSizes[selectedSizeIndex]?.name : '';

  // Combine cover image and gallery into one array for the carousel
  const carouselImages = [];
  if (item.image?.url) carouselImages.push(item.image.url);
  if (item.gallery && item.gallery.length > 0) {
    item.gallery.forEach(img => carouselImages.push(img.url));
  }

  const nextImage = () => setCurrentGalleryIndex(p => (p + 1) % carouselImages.length);
  const prevImage = () => setCurrentGalleryIndex(p => (p - 1 + carouselImages.length) % carouselImages.length);

  // WhatsApp Pre-filled message
  const handleContactClick = () => {
    const text = `مرحباً، مهتم بـ ${item.name}${selectedSizeName ? ` - مقاس ${selectedSizeName}` : ''}`;
    const phoneNumber = '201000000000'; // TODO: Replace with actual phone number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: '20px 20px 0 0', sm: '24px' },
          m: { xs: 0, sm: 2 },
          position: { xs: 'absolute', sm: 'relative' },
          bottom: { xs: 0, sm: 'auto' },
          width: '100%',
          maxHeight: { xs: '90vh', sm: 'auto' },
          overflow: 'hidden'
        }
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          bgcolor: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 10,
          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
        }}
      >
        <CloseIcon sx={{ color: '#1B3A4B' }} />
      </IconButton>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        
        {/* Left Side: Image Carousel */}
        <Box sx={{ 
          width: { xs: '100%', md: '50%' }, 
          bgcolor: '#F7F9FA',
          position: 'relative',
          minHeight: { xs: '300px', md: '450px' }
        }}>
          {carouselImages.length > 0 ? (
            <>
              <Image 
                src={carouselImages[currentGalleryIndex]}
                alt={`${item.name} - ${currentGalleryIndex}`}
                fill
                priority={currentGalleryIndex === 0}
                loading={currentGalleryIndex === 0 ? "eager" : "lazy"}
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
              
              {/* Carousel Controls */}
              {carouselImages.length > 1 && (
                <>
                  <IconButton
                    onClick={prevImage}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      right: 8,
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255,255,255,0.5)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                  <IconButton
                    onClick={nextImage}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: 8,
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255,255,255,0.5)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                  
                  {/* Dots */}
                  <Box sx={{ 
                    position: 'absolute', bottom: 16, left: 0, right: 0, 
                    display: 'flex', justifyContent: 'center', gap: 1 
                  }}>
                    {carouselImages.map((_, idx) => (
                      <Box 
                        key={idx}
                        onClick={() => setCurrentGalleryIndex(idx)}
                        sx={{ 
                          width: idx === currentGalleryIndex ? 20 : 8,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: idx === currentGalleryIndex ? '#2E8B9A' : 'rgba(255,255,255,0.6)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </>
          ) : (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">لا توجد صورة</Typography>
            </Box>
          )}
        </Box>

        {/* Right Side: Info & Actions */}
        <Box sx={{ 
          width: { xs: '100%', md: '50%' }, 
          p: { xs: 3, md: 4 },
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1B3A4B', mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
            {item.name}
          </Typography>
          
          <Typography variant="body1" sx={{ color: '#5A6B72', mb: 3, lineHeight: 1.7 }}>
            {item.description}
          </Typography>

          {isSizesAvailable && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#1B3A4B', fontWeight: 700, mb: 1.5 }}>
                اختر المقاس:
              </Typography>
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
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: isSelected ? 800 : 600,
                        bgcolor: isSelected ? '#1B3A4B' : 'transparent',
                        color: isSelected ? '#fff' : '#1B3A4B',
                        border: isSelected ? '1px solid #1B3A4B' : '1px solid rgba(27, 58, 75, 0.2)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: isSelected ? '#1B3A4B' : 'rgba(27, 58, 75, 0.04)',
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

          <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#5A6B72', fontWeight: 600 }}>السعر:</Typography>
              {displayPrice !== null && displayPrice !== undefined ? (
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#2E8B9A' }}>
                  {displayPrice} <Typography component="span" variant="body1" sx={{ fontWeight: 600, color: '#5A6B72' }}>ج.م</Typography>
                </Typography>
              ) : (
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>غير محدد</Typography>
              )}
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleContactClick}
              startIcon={<WhatsAppIcon />}
              sx={{ 
                bgcolor: '#25D366', 
                color: '#fff',
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(37, 211, 102, 0.25)',
                '&:hover': {
                  bgcolor: '#128C7E',
                  boxShadow: '0 12px 32px rgba(37, 211, 102, 0.35)',
                }
              }}
            >
              تواصل للطلب
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
