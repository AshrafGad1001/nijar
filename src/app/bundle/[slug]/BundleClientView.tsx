'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, Button, Paper, Grid, Divider, Chip, MenuItem, Select
} from '@mui/material';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import WorkDetailDialog from '@/components/public/WorkDetailDialog';

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
                {(product as any).dimensions && (
                  <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <StraightenOutlinedIcon sx={{ fontSize: '1rem', color: '#94A3B8' }} />
                    {(product as any).dimensions.length && `طول ${(product as any).dimensions.length} سم`}
                    {(product as any).dimensions.width && ` - عمق ${(product as any).dimensions.width} سم`}
                    {(product as any).dimensions.height && ` - ارتفاع ${(product as any).dimensions.height} سم`}
                  </Typography>
                )}
                
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
                
                <Box sx={{ mt: product.hasSizes ? 2 : 'auto', display: 'flex', justifyContent: 'flex-start' }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    endIcon={<InfoOutlinedIcon sx={{ ml: 0.5 }} />}
                    onClick={() => setSelectedProduct(product)}
                    sx={{ 
                      width: { xs: '100%', sm: 'auto' },
                      fontWeight: 800, 
                      px: 2.5, 
                      py: 0.8,
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                      }
                    }}
                  >
                    عرض التفاصيل
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Grid>

      {/* Left Column (Sticky Price Box) */}
      <Grid size={{ xs: 12, md: 5 }}>
        <Box sx={{ position: 'sticky', top: 100 }}>
          <Box sx={{ 
            p: { xs: 3, md: 4.5 }, 
            bgcolor: '#ffffff',
            borderRadius: '24px', 
            border: '1px solid rgba(15, 23, 42, 0.08)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5
          }}>
            <Typography variant="h5" sx={{ color: '#0F172A', fontWeight: 900, mb: 0.5 }}>ملخص الباكدج</Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 600, fontSize: '1.05rem' }}>إجمالي المنتجات ({bundle.products.length})</Typography>
              <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 700, textDecoration: 'line-through', fontSize: '1.1rem' }}>
                {totalPrice.toLocaleString()} ج.م
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: '#E11D48', fontWeight: 800, fontSize: '1.05rem' }}>خصم الباكدج</Typography>
              <Box sx={{ bgcolor: 'rgba(225, 29, 72, 0.08)', px: 1.5, py: 0.5, borderRadius: '8px' }}>
                <Typography variant="body2" sx={{ color: '#E11D48', fontWeight: 800, fontSize: '1rem', direction: 'ltr' }}>
                  -{bundle.discountPercentage}%
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1, opacity: 0.5 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>السعر النهائي للباكدج</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h1" sx={{ fontWeight: 900, color: '#0F172A', fontSize: { xs: '3rem', md: '3.5rem' }, letterSpacing: '-1.5px' }}>
                  {discountedPrice.toLocaleString()}
                </Typography>
                <Typography component="span" variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>ج.م</Typography>
              </Box>
              <Box sx={{ 
                bgcolor: 'rgba(5, 150, 105, 0.08)', 
                color: '#059669', 
                px: 2.5, 
                py: 1, 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mt: 1.5,
                border: '1px solid rgba(5, 150, 105, 0.2)'
              }}>
                <LocalOfferOutlinedIcon sx={{ fontSize: 20 }} />
                <Typography variant="body1" sx={{ fontWeight: 800 }}>
                  وفرت {savedAmount.toLocaleString()} ج.م!
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleContactClick}
                startIcon={<WhatsAppIcon sx={{ ml: 1, fontSize: '1.6rem !important' }} />}
                sx={{ 
                  bgcolor: '#25D366', 
                  color: '#ffffff', 
                  py: 1.8,
                  borderRadius: '16px',
                  fontWeight: 900,
                  fontSize: '1.15rem',
                  boxShadow: '0 8px 25px rgba(37, 211, 102, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    bgcolor: '#128C7E',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 30px rgba(37, 211, 102, 0.4)'
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
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleX(-1)' }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </Box>}
                sx={{ 
                  bgcolor: '#ffffff', 
                  color: '#0F172A', 
                  borderColor: 'rgba(15, 23, 42, 0.15)',
                  borderWidth: '2px',
                  py: 1.8,
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  '&:hover': { 
                    borderColor: '#0F172A',
                    bgcolor: '#F8FAFC',
                    borderWidth: '2px'
                  } 
                }}
              >
                اتصل بنا للاستفسار
              </Button>
            </Box>

            <Box sx={{ 
              mt: 2, 
              p: 2.5, 
              borderRadius: '16px', 
              border: '1px solid rgba(15, 23, 42, 0.08)', 
              bgcolor: '#F8FAFC',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700, textAlign: 'center', lineHeight: 1.7 }}>
                متاح تعديل الخامات والمقاسات بالاتفاق، وقد يختلف السعر.
              </Typography>
            </Box>
            
          </Box>
        </Box>
      </Grid>

      {/* Product Details Dialog */}
      <WorkDetailDialog
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        item={selectedProduct as any}
        whatsappNumber={whatsappNumber}
        bundleContextName={bundle.name}
      />
    </Grid>
  );
}
