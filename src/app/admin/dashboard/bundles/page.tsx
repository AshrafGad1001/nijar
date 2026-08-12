'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Chip,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function BundlesPage() {
  const router = useRouter();
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>عروض الباكدجات</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/dashboard/bundles/create')}
          sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
        >
          إضافة باكدج جديد
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
              <TableCell sx={{ fontWeight: 700 }}>اسم الباكدج</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>المنتجات</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>الخصم</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>الحالة</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>جاري التحميل...</TableCell>
              </TableRow>
            ) : bundles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>لا توجد باكدجات حالياً</TableCell>
              </TableRow>
            ) : (
              bundles.map((bundle) => (
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
                      color="secondary" 
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={bundle.isAvailable ? 'متاح' : 'معطل'} 
                      color={bundle.isAvailable ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => router.push(`/admin/dashboard/bundles/edit/${bundle._id}`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => confirmDelete(bundle._id)}>
                      <DeleteIcon />
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
