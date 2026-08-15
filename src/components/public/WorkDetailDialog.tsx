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
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ForestOutlinedIcon from '@mui/icons-material/ForestOutlined';
import FormatPaintOutlinedIcon from '@mui/icons-material/FormatPaintOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

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
  components?: string[];
  technicalDetails?: {
    woodType?: string;
    paintType?: string;
    mechanism?: string;
    handles?: string;
    hinges?: string;
    warranty?: string;
    productionTime?: string;
    dimensions?: { length?: number | null; width?: number | null; height?: number | null };
  };
}

interface WorkDetailDialogProps {
  open: boolean;
  onClose: () => void;
  item: WorkDetailItem | null;
  initialSizeIndex?: number;
  whatsappNumber?: string;
  bundleContextName?: string;
}

export default function WorkDetailDialog({ open, onClose, item, initialSizeIndex = 0, whatsappNumber, bundleContextName }: WorkDetailDialogProps) {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState<number>(0);

  useEffect(() => {
    if (open) {
      setSelectedSizeIndex(initialSizeIndex);
      setCurrentGalleryIndex(0);
    }
  }, [open, initialSizeIndex]);

  if (!item) return null;

  const isSizesAvailable = item.hasSizes && item.sizes && item.sizes.length > 0;
  const validSizes = isSizesAvailable ? item.sizes!.filter(s => s.name && s.price) : [];

  const currentSpecs = (isSizesAvailable && validSizes[selectedSizeIndex] && (validSizes[selectedSizeIndex] as any).variantDetails && Object.keys((validSizes[selectedSizeIndex] as any).variantDetails).length > 0)
    ? (validSizes[selectedSizeIndex] as any).variantDetails
    : item.technicalDetails;
  
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
    const introText = bundleContextName 
      ? `مرحباً، مهتم بطلب هذا المنتج من ضمن باكدج: *${bundleContextName}*`
      : `مرحباً، مهتم بطلب هذا المنتج:`;
      
    const text = `${introText}\n\nالاسم: ${item.name}${selectedSizeName ? `\nالمقاس: ${selectedSizeName}` : ''}${priceText}\n\nصورة المنتج:\n${item.image?.url || 'لا توجد صورة'}`;
    
    let cleanWhatsapp = (whatsappNumber || '').replace(/[^0-9]/g, '');
    if (!cleanWhatsapp) {
      cleanWhatsapp = '201000000000'; // Default fallback
    } else if (cleanWhatsapp.startsWith('0')) {
      // If it starts with 0 (e.g., 010...), prepend 2 for Egypt's country code
      cleanWhatsapp = '2' + cleanWhatsapp;
    }

    // wa.me is the official shortlink and works best for native app redirection
    const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(text)}`;
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
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          zIndex: 10,
          '&:hover': { bgcolor: '#F8FAFC', transform: 'scale(1.05)' },
          transition: 'all 0.2s'
        }}
      >
        <CloseIcon sx={{ color: '#0F172A' }} />
      </IconButton>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100%', overflowY: { xs: 'auto', md: 'hidden' } }}>
        
        {/* Left Side: Image Gallery */}
        <Box sx={{ 
          width: { xs: '100%', md: '55%' }, 
          bgcolor: '#F7F9FA',
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2.5, md: 3 },
          gap: 2,
          flexShrink: 0
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
          overflowY: { xs: 'visible', md: 'auto' }, // Let mobile scroll naturally with the image
          flexGrow: 1
        }}>
          
          {/* Badge & Title */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ 
              border: '1px solid rgba(212, 175, 55, 0.4)', 
              color: '#D4AF37', 
              px: 2, 
              py: 0.5, 
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 800,
              mb: 2,
              bgcolor: 'rgba(212, 175, 55, 0.05)'
            }}>
              جديد
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#0F172A', mb: 1.5, fontSize: { xs: '1.75rem', md: '2.2rem' }, letterSpacing: '-0.5px' }}>
              {item.name}
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.8 }}>
              {item.description || "تصميم عصري فاخر"}
            </Typography>
          </Box>
          
          {/* Technical Details & Specs List */}
          {(currentSpecs || (item.components && item.components.length > 0)) && (
            <Box sx={{ mb: 4, mt: 1 }}>
              <Typography variant="h5" sx={{ color: '#0F172A', fontWeight: 900, mb: 3 }}>
                المواصفات والخامات
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1.5 
              }}>
                {currentSpecs?.dimensions && (currentSpecs.dimensions.length || currentSpecs.dimensions.width) && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleOutlinedIcon sx={{ color: '#D4AF37', fontSize: '1.2rem' }} />
                      <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.95rem' }}>الأبعاد</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#0F172A', fontWeight: 900, direction: 'rtl' }}>
                      {currentSpecs.dimensions.length && `طول ${currentSpecs.dimensions.length} سم`}
                      {currentSpecs.dimensions.width && (currentSpecs.dimensions.length ? ` - عمق ${currentSpecs.dimensions.width} سم` : `عمق ${currentSpecs.dimensions.width} سم`)}
                      {currentSpecs.dimensions.height && ` - ارتفاع ${currentSpecs.dimensions.height} سم`}
                    </Typography>
                  </Box>
                )}
                {currentSpecs?.woodType && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleOutlinedIcon sx={{ color: '#D4AF37', fontSize: '1.2rem' }} />
                      <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.95rem' }}>الخشب</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#0F172A', fontWeight: 900 }}>{currentSpecs.woodType}</Typography>
                  </Box>
                )}
                {currentSpecs?.paintType && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleOutlinedIcon sx={{ color: '#D4AF37', fontSize: '1.2rem' }} />
                      <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.95rem' }}>الدهان</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#0F172A', fontWeight: 900 }}>{currentSpecs.paintType}</Typography>
                  </Box>
                )}
                {currentSpecs?.mechanism && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleOutlinedIcon sx={{ color: '#D4AF37', fontSize: '1.2rem' }} />
                      <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.95rem' }}>الميكانيزم</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#0F172A', fontWeight: 900 }}>{currentSpecs.mechanism}</Typography>
                  </Box>
                )}
                {currentSpecs?.handles && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleOutlinedIcon sx={{ color: '#D4AF37', fontSize: '1.2rem' }} />
                      <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.95rem' }}>المقابض</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#0F172A', fontWeight: 900 }}>{currentSpecs.handles}</Typography>
                  </Box>
                )}
                {currentSpecs?.hinges && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleOutlinedIcon sx={{ color: '#D4AF37', fontSize: '1.2rem' }} />
                      <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.95rem' }}>المفصلات</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#0F172A', fontWeight: 900 }}>{currentSpecs.hinges}</Typography>
                  </Box>
                )}
                {item.components && item.components.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleOutlinedIcon sx={{ color: '#D4AF37', fontSize: '1.2rem' }} />
                      <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.95rem' }}>مكونات المنتج</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#0F172A', fontWeight: 900 }}>{item.components.join(' - ')}</Typography>
                  </Box>
                )}
                {currentSpecs?.productionTime && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleOutlinedIcon sx={{ color: '#D4AF37', fontSize: '1.2rem' }} />
                      <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.95rem' }}>مدة التنفيذ</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#0F172A', fontWeight: 900 }}>{currentSpecs.productionTime}</Typography>
                  </Box>
                )}
                {currentSpecs?.warranty && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleOutlinedIcon sx={{ color: '#D4AF37', fontSize: '1.2rem' }} />
                      <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.95rem' }}>الضمان</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#0F172A', fontWeight: 900 }}>{currentSpecs.warranty}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
          
          <Divider sx={{ my: 3, opacity: 0.6 }} />

          {/* Sizes */}
          {isSizesAvailable && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ color: '#0F172A', fontWeight: 800, mb: 2 }}>
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
                        bgcolor: isSelected ? '#0F172A' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#64748B',
                        border: isSelected ? '2px solid #D4AF37' : '1.5px solid rgba(15, 23, 42, 0.1)',
                        boxShadow: isSelected ? '0 8px 20px rgba(15, 23, 42, 0.2)' : 'none',
                        transition: 'all 0.2s',
                        dir: 'ltr',
                        '&:hover': {
                          borderColor: isSelected ? '#D4AF37' : '#0F172A',
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
                    <Typography variant="h2" sx={{ fontWeight: 900, color: '#0F172A', fontSize: { xs: '2.5rem', md: '3rem' }, letterSpacing: '-1px' }}>
                      {displayPrice.toLocaleString()}
                    </Typography>
                    <Typography component="span" variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      ج.م
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#0F172A' }}>السعر غير محدد</Typography>
                )}
              </Box>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>
                السعر شامل الضريبة
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleContactClick}
              sx={{ 
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                color: '#ffffff',
                py: 2,
                fontSize: '1rem',
                fontWeight: 900,
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '@media (prefers-reduced-motion: no-preference)': {
                  animation: 'whatsappPulse 2s infinite',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0))',
                  borderRadius: '12px',
                },
                '&:hover': {
                  bgcolor: '#1EBE5A',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 32px rgba(37, 211, 102, 0.4)',
                  animation: 'none',
                  border: '1px solid rgba(212, 175, 55, 0.8)',
                  color: '#D4AF37',
                }
              }}
            >
              طلب عبر الواتساب
            </Button>
            
          </Box>

        </Box>
      </DialogContent>
    </Dialog>
  );
}
