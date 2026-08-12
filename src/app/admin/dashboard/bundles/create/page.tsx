'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, 
  Grid, Snackbar, Alert, Switch, FormControlLabel,
  Autocomplete, Checkbox
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CreateBundlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountPercentage: 0,
    isAvailable: true,
    displayOrder: 0,
    products: [] as any[]
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    // Fetch products to select from
    api.get('/products')
      .then(res => setProducts(res.data.data || []))
      .catch(err => console.error('Failed to fetch products', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.products.length < 2) {
      setSnackbar({ open: true, message: 'يجب اختيار منتجين على الأقل', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        products: formData.products.map(p => p._id)
      };

      await api.post('/bundles', payload);
      setSnackbar({ open: true, message: 'تم إنشاء الباكدج بنجاح', severity: 'success' });
      setTimeout(() => {
        router.push('/admin/dashboard/bundles');
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'حدث خطأ أثناء الحفظ';
      setSnackbar({ open: true, message: msg, severity: 'error' });
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 4 }}>إضافة باكدج جديد</Typography>
      
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                label="اسم الباكدج"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="نسبة الخصم (%)"
                name="discountPercentage"
                type="number"
                slotProps={{ htmlInput: { min: 0, max: 99 } }}
                value={formData.discountPercentage}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="وصف الباكدج (اختياري)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                variant="outlined"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Autocomplete
                multiple
                options={products}
                disableCloseOnSelect
                getOptionLabel={(option) => `${option.name} (${option.productCode || 'بدون كود'})`}
                value={formData.products}
                onChange={(e, newValue) => {
                  setFormData(prev => ({ ...prev, products: newValue }));
                }}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.name} {option.productCode && `- ${option.productCode}`} {option.isAvailable ? '' : '(غير متاح)'}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="المنتجات المشمولة في الباكدج" placeholder="اختر المنتجات" required={formData.products.length === 0} />
                )}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                يجب اختيار منتجين على الأقل. سيتم حساب السعر النهائي بناءً على إجمالي المنتجات مخصوماً منه النسبة.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="ترتيب العرض"
                name="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={formData.isAvailable} 
                    onChange={handleSwitchChange} 
                    name="isAvailable" 
                    color="primary"
                  />
                }
                label="متاح للعرض"
              />
            </Grid>

            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                disabled={loading}
                sx={{ px: 5, py: 1.5, fontWeight: 700, borderRadius: 2 }}
              >
                {loading ? 'جاري الحفظ...' : 'حفظ الباكدج'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%', fontWeight: 600 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
