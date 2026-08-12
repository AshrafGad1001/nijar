'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Chip,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function BundlesPage() {
  const router = useRouter();
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [bundleToDelete, setBundleToDelete] = useState<string | null>(null);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bundles');
      setBundles(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch bundles:', err);
      setSnackbar({ open: true, message: 'فشل تحميل الباكدجات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setBundleToDelete(id);
    setDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!bundleToDelete) return;
    try {
      await api.delete(`/bundles/${bundleToDelete}`);
      setSnackbar({ open: true, message: 'تم حذف الباكدج بنجاح', severity: 'success' });
      fetchBundles();
    } catch (err) {
      setSnackbar({ open: true, message: 'حدث خطأ أثناء الحذف', severity: 'error' });
    } finally {
      setDeleteDialog(false);
      setBundleToDelete(null);
    }
  };

  const filteredBundles = bundles.filter(bundle => 
    bundle.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1B3A4B', letterSpacing: '-0.5px' }}>عروض الباكدجات</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/dashboard/bundles/create')}
          sx={{ borderRadius: 3, px: 3, py: 1.5, fontWeight: 700, boxShadow: '0 8px 16px rgba(44, 30, 22, 0.2)' }}
        >
          إضافة باكدج جديد
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField 
          fullWidth
          placeholder="ابحث عن باكدج بالاسم..." 
          variant="outlined" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            sx: { bgcolor: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(27, 58, 75, 0.05)', '& fieldset': { borderColor: 'rgba(0,0,0,0.05)' } }
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(27, 58, 75, 0.08)', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(27, 58, 75, 0.02)' }}>
              <TableCell sx={{ fontWeight: 800, color: '#1B3A4B', py: 2.5 }}>اسم الباكدج</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#1B3A4B', py: 2.5 }}>المنتجات</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#1B3A4B', py: 2.5 }}>الخصم</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#1B3A4B', py: 2.5 }}>الحالة</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#1B3A4B', py: 2.5 }} align="center">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>جاري التحميل...</TableCell>
              </TableRow>
            ) : filteredBundles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>لا توجد باكدجات حالياً</TableCell>
              </TableRow>
            ) : (
              filteredBundles.map((bundle) => (
                <TableRow key={bundle._id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>{bundle.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {bundle.products?.length || 0} منتجات
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${bundle.discountPercentage}%`} 
                      size="small" 
                      sx={{ fontWeight: 800, bgcolor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={bundle.isAvailable ? 'متاح' : 'معطل'} 
                      size="small"
                      sx={{ 
                        fontWeight: 700, 
                        bgcolor: bundle.isAvailable ? 'rgba(46, 139, 154, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                        color: bundle.isAvailable ? '#2E8B9A' : '#ef4444' 
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      onClick={() => router.push(`/admin/dashboard/bundles/edit/${bundle._id}`)}
                      sx={{ bgcolor: 'rgba(27, 58, 75, 0.05)', color: '#1B3A4B', mr: 1, '&:hover': { bgcolor: 'rgba(27, 58, 75, 0.1)' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      onClick={() => confirmDelete(bundle._id)}
                      sx={{ bgcolor: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} dir="rtl">
        <DialogTitle sx={{ fontWeight: 700 }}>تأكيد الحذف</DialogTitle>
        <DialogContent>هل أنت متأكد أنك تريد حذف هذا الباكدج نهائياً؟</DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialog(false)} color="inherit">إلغاء</Button>
          <Button onClick={handleDelete} color="error" variant="contained" sx={{ fontWeight: 700 }}>حذف</Button>
        </DialogActions>
      </Dialog>

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
