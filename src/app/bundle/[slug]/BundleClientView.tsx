'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, Button, Paper, Grid, Divider, Chip, MenuItem, Select
} from '@mui/material';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

interface Product {
  _id: string;
  name: string;
  productCode: string;
  description: string;
  price: number | null;
  hasSizes: boolean;
  sizes: { name: string; price: number }[];
  image: { url: string };
  category: { name: string };
}

interface Bundle {
  _id: string;
  name: string;
  description: string;
  discountPercentage: number;
  products: Product[];
}

interface Props {
  bundle: Bundle;
  whatsappNumber: string;
}

export default function BundleClientView({ bundle, whatsappNumber }: Props) {
  // Store selected size for each product by product ID
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});

  useEffect(() => {
    // Initialize default sizes (index 0) for products that have sizes
    const initialSizes: Record<string, number> = {};
    bundle.products.forEach(p => {
      if (p.hasSizes && p.sizes && p.sizes.length > 0) {
        initialSizes[p._id] = 0;
      }
    });
    setSelectedSizes(initialSizes);
  }, [bundle]);

  const handleSizeChange = (productId: string, sizeIndex: number) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: sizeIndex }));
  };

  const { totalPrice, discountedPrice, savedAmount } = useMemo(() => {
    let total = 0;
    bundle.products.forEach(p => {
      if (p.hasSizes && p.sizes && p.sizes.length > 0) {
        const selectedIndex = selectedSizes[p._id] !== undefined ? selectedSizes[p._id] : 0;
        total += p.sizes[selectedIndex]?.price || 0;
      } else {
        total += p.price || 0;
      }
    });

    const discount = bundle.discountPercentage || 0;
    const discounted = total - (total * discount / 100);
    const saved = total - discounted;

    return {
      totalPrice: total,
      discountedPrice: discounted,
      savedAmount: saved
    };
  }, [bundle, selectedSizes]);

  const handleContactClick = () => {
    if (!whatsappNumber) {
      alert('عذراً، رقم الواتساب غير متوفر حالياً. يرجى مراجعة إدارة الموقع.');
      return;
    }
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    
    let message = `مرحباً، أريد طلب باكدج: *${bundle.name}*\n\n`;
    message += `تفاصيل المنتجات:\n`;
    
    bundle.products.forEach(p => {
      message += `- ${p.name}`;
      if (p.hasSizes && p.sizes && p.sizes.length > 0) {
        const sizeIndex = selectedSizes[p._id] || 0;
        message += ` (الفئة/المقاس: ${p.sizes[sizeIndex].name})`;
      }
      message += `\n`;
    });

    message += `\nالسعر قبل الخصم: ${totalPrice.toLocaleString()} ج.م\n`;
    message += `السعر النهائي بعد الخصم (${bundle.discountPercentage}%): *${discountedPrice.toLocaleString()} ج.م*\n`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <Grid container spacing={{ xs: 3, md: 5 }}>
      {/* Right Column (Bundle Title & Products) */}
      <Grid size={{ xs: 12, md: 7 }}>
        <Box sx={{ mb: 4 }}>
          <Chip 
            label={`توفير ${bundle.discountPercentage}%`} 
            color="error" 
            sx={{ fontWeight: 800, mb: 2, fontSize: '0.9rem', px: 1 }} 
            icon={<LocalOfferOutlinedIcon />} 
          />
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#0F172A', mb: 2, letterSpacing: '-0.5px' }}>
            {bundle.name}
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', lineHeight: 1.8, fontSize: '1.1rem' }}>
            {bundle.description}
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B3A4B', mb: 3 }}>
          المنتجات المشمولة في الباكدج
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {bundle.products.map(product => (
            <Paper key={product._id} sx={{ 
              p: 2, 
              display: 'flex', 
              gap: 3, 
              borderRadius: '20px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Box sx={{ 
                width: { xs: '100%', sm: 160 }, 
                height: { xs: 200, sm: 160 }, 
                borderRadius: '16px', 
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <Box
                  component="img"
                  src={product.image?.url || '/placeholder.png'}
                  alt={product.name}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 1 }}>
                <Typography variant="caption" sx={{ color: '#C59B5F', fontWeight: 700, mb: 0.5 }}>
                  {product.category?.name || 'منتج'}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E293B', mb: 1 }}>
                  {product.name}
                </Typography>
                
                {product.hasSizes && product.sizes && product.sizes.length > 0 && (
                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 1 }}>
                      اختر المقاس / الفئة:
                    </Typography>
                    <Select
                      size="small"
                      fullWidth
                      value={selectedSizes[product._id] ?? 0}
                      onChange={(e) => handleSizeChange(product._id, Number(e.target.value))}
                      sx={{ 
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(226, 232, 240, 0.8)' }
                      }}
                    >
                      {product.sizes.map((size, index) => (
                        <MenuItem key={index} value={index}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <span>{size.name}</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      </Grid>

      {/* Left Column (Sticky Price Box) */}
      <Grid size={{ xs: 12, md: 5 }}>
        <Box sx={{ position: 'sticky', top: 100 }}>
          <Box sx={{ 
            p: { xs: 3, md: 4 }, 
            background: 'linear-gradient(to bottom right, #ffffff, #F8FAFC)',
            borderRadius: '24px', 
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            <Typography variant="h6" sx={{ color: '#1B3A4B', fontWeight: 900, mb: 1 }}>ملخص الباكدج</Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 600 }}>إجمالي المنتجات ({bundle.products.length})</Typography>
              <Typography variant="body1" sx={{ color: '#1E293B', fontWeight: 700, textDecoration: 'line-through' }}>
                {totalPrice.toLocaleString()} ج.م
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 700 }}>خصم الباكدج</Typography>
              <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 700 }}>
                {bundle.discountPercentage}%-
              </Typography>
            </Box>

            <Divider sx={{ my: 1, opacity: 0.6 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 1 }}>السعر النهائي للباكدج</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h2" sx={{ fontWeight: 900, color: '#0F172A', fontSize: { xs: '2.5rem', md: '3rem' }, letterSpacing: '-1px' }}>
                  {discountedPrice.toLocaleString()}
                </Typography>
                <Typography component="span" variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>ج.م</Typography>
              </Box>
              <Box sx={{ 
                bgcolor: '#E0F2F1', 
                color: '#00897B', 
                px: 2, 
                py: 0.75, 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mt: 1
              }}>
                <LocalOfferOutlinedIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  وفرت {savedAmount.toLocaleString()} ج.م!
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleContactClick}
                startIcon={<WhatsAppIcon sx={{ ml: 1, fontSize: '1.5rem !important' }} />}
                sx={{ 
                  bgcolor: '#38CB6D', // Match user screenshot green
                  color: '#ffffff', 
                  py: 1.5,
                  borderRadius: '16px',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 24px rgba(37, 211, 102, 0.25)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    bgcolor: '#2EB55E',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 28px rgba(37, 211, 102, 0.35)'
                  } 
                }}
              >
                اطلب عبر الواتساب
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  if (whatsappNumber) {
                    const cleanNumber = whatsappNumber.replace(/\D/g, '');
                    window.location.href = `tel:+${cleanNumber}`;
                  }
                }}
                startIcon={<Box component="span" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleX(-1)' }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </Box>}
                sx={{ 
                  bgcolor: '#ffffff', 
                  color: '#1B3A4B', 
                  borderColor: 'rgba(27, 58, 75, 0.2)',
                  borderWidth: '2px',
                  py: 1.5,
                  borderRadius: '16px',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  '&:hover': { 
                    borderColor: '#1B3A4B',
                    bgcolor: 'rgba(27, 58, 75, 0.04)',
                    borderWidth: '2px'
                  } 
                }}
              >
                اتصل بنا للاستفسار
              </Button>
            </Box>

            <Box sx={{ 
              mt: 2, 
              p: 2, 
              borderRadius: '12px', 
              border: '1px dashed #C59B5F', 
              bgcolor: 'rgba(197, 155, 95, 0.05)',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Typography variant="body2" sx={{ color: '#8C6C3F', fontWeight: 800, textAlign: 'center' }}>
                متاح تعديل الخامات والمقاسات بالاتفاق، وقد يختلف السعر.
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2 }}>
              <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: '#64748B' }} />
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>الخصم يطبق على الإجمالي تلقائياً</Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
