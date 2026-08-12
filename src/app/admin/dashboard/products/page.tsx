'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import api from '@/lib/api';
import { Category, Product } from '@/types';
import { useRouter } from 'next/navigation';
import SortableItem from '@/components/admin/SortableItem';
import { Box, Typography, Button, Snackbar, Alert, IconButton, Stack, Chip, Switch, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WeekendIcon from '@mui/icons-material/Weekend';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isSorting, setIsSorting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [errorDialog, setErrorDialog] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [catRes, itemRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products'),
      ]);
      setCategories(catRes.data.data);
      setItems(itemRes.data.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getCategoryName = (categoryRef: string | Category): string => {
    if (typeof categoryRef === 'object' && categoryRef?.name) return categoryRef.name;
    const cat = categories.find((c) => c._id === categoryRef);
    return cat ? cat.name : 'Unknown';
  };

  const getCategoryId = (categoryRef: string | Category): string => {
    if (typeof categoryRef === 'object') return categoryRef._id;
    return categoryRef;
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = filterCategory ? getCategoryId(item.category) === filterCategory : true;
    const matchesSearch = searchQuery 
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.productCode && item.productCode.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesCategory && matchesSearch;
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredItems.findIndex((i) => i._id === active.id);
    const newIndex = filteredItems.findIndex((i) => i._id === over.id);
    const newOrder = arrayMove(filteredItems, oldIndex, newIndex);

    // Update local state for immediate feedback
    if (filterCategory) {
      setItems((prev) => {
        const others = prev.filter((i) => getCategoryId(i.category) !== filterCategory);
        return [...others, ...newOrder];
      });
    } else {
      setItems(newOrder);
    }

    setIsSorting(true);
    try {
      await api.put('/products/reorder', {
        orderedIds: newOrder.map((i) => i._id),
      });
      showToast('Order updated', 'success');
    } catch {
      showToast('Failed to reorder', 'error');
      fetchData();
    } finally {
      setIsSorting(false);
    }
  };

  const handleToggleAvailability = async (item: Product) => {
    try {
      await api.put(`/products/${item._id}`, { isAvailable: !item.isAvailable });
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, isAvailable: !i.isAvailable } : i))
      );
      showToast(`Item marked as ${!item.isAvailable ? 'available' : 'unavailable'}`, 'success');
    } catch {
      showToast('Failed to update availability', 'error');
    }
  };

  const handleDeleteItem = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/products/${itemToDelete}`);
      showToast('Item deleted', 'success');
      fetchData();
    } catch {
      showToast('Failed to delete item', 'error');
    } finally {
      setItemToDelete(null);
    }
  };



  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {toast ? (
          <Alert severity={toast.type} onClose={() => setToast(null)}>
            {toast.message}
          </Alert>
        ) : <div />}
      </Snackbar>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: { xs: 3, md: 4 } }}>
        <Typography sx={{ typography: { xs: 'h5', md: 'h4' }, fontWeight: 900, color: '#1B3A4B', letterSpacing: '-0.5px', textAlign: { xs: 'center', sm: 'right' } }} component="h1">
          إدارة المنتجات
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ py: 1.5, px: 3, borderRadius: 3, fontWeight: 700, boxShadow: '0 8px 16px rgba(44, 30, 22, 0.2)' }}
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/dashboard/products/add')}
        >
          إضافة منتج جديد
        </Button>
      </Box>

      {/* Search and Category Filters */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        <TextField 
          fullWidth
          placeholder="ابحث بالاسم أو كود المنتج..." 
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
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
          <Chip
          label="الكل"
          onClick={() => setFilterCategory('')}
          color={filterCategory === '' ? 'primary' : 'default'}
          variant={filterCategory === '' ? 'filled' : 'outlined'}
          sx={{ borderRadius: '16px', fontWeight: 600, px: 1, height: 36 }}
          clickable
        />
        {categories.map((cat) => (
          <Chip
            key={cat._id}
            label={cat.name}
            onClick={() => setFilterCategory(cat._id)}
            color={filterCategory === cat._id ? 'primary' : 'default'}
            variant={filterCategory === cat._id ? 'filled' : 'outlined'}
            sx={{ borderRadius: '16px', fontWeight: 600, px: 1, height: 36 }}
            clickable
          />
        ))}
      </Box>
    </Box>

      {/* Items List with DnD */}
      {filteredItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <WeekendIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary">لا يوجد منتجات حالياً.</Typography>
        </Box>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredItems.map((i) => i._id)} strategy={verticalListSortingStrategy}>
            <Box sx={{ opacity: isSorting ? 0.7 : 1, pointerEvents: isSorting ? 'none' : 'auto' }}>
              {filteredItems.map((item) => (
                <SortableItem key={item._id} id={item._id}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 1 }}>
                    {/* Top Section: Info & Price */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 2, sm: 3 }, width: '100%', mb: { xs: 1.5, sm: 2 } }}>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, width: { xs: '100%', sm: 'auto' }, flexGrow: 1 }}>
                        {/* Premium Image Display */}
                        {item.image?.url ? (
                          <Box 
                            component="img" 
                            src={item.image.url} 
                            alt={item.name} 
                            sx={{ 
                              width: { xs: 80, sm: 96 }, 
                              height: { xs: 80, sm: 96 }, 
                              borderRadius: '16px', 
                              objectFit: 'cover', 
                              boxShadow: '0 8px 16px rgba(27, 58, 75, 0.15)',
                              border: '2px solid rgba(255,255,255,0.8)',
                              flexShrink: 0 
                            }} 
                          />
                        ) : (
                          <Box sx={{ 
                            width: { xs: 80, sm: 96 }, 
                            height: { xs: 80, sm: 96 }, 
                            borderRadius: '16px', 
                            bgcolor: 'rgba(27, 58, 75, 0.04)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            border: '1px dashed rgba(27, 58, 75, 0.2)', 
                            flexShrink: 0 
                          }}>
                            <WeekendOutlinedIcon sx={{ color: 'text.secondary', fontSize: 32 }} />
                          </Box>
                        )}

                        {/* Title & Category */}
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 900, color: '#1B3A4B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.name}
                            </Typography>
                            {item.productCode && (
                              <Chip label={item.productCode} size="small" sx={{ height: 20, fontSize: '0.75rem', fontWeight: 800, bgcolor: '#f1f5f9', color: '#64748b' }} />
                            )}
                          </Box>
                          <Chip 
                            label={getCategoryName(item.category)} 
                            size="small" 
                            sx={{ bgcolor: 'rgba(46, 139, 154, 0.1)', color: '#2E8B9A', fontWeight: 800, fontSize: '0.75rem', height: 24 }} 
                          />
                        </Box>
                      </Box>

                      {/* Price / Sizes */}
                      <Box sx={{ minWidth: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'right', sm: 'left' }, display: 'flex', justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                        {item.hasSizes && item.sizes && item.sizes.length > 0 ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                            {item.sizes.map(s => (
                              <Chip 
                                key={s.name} 
                                label={`${s.name}: ${s.price} ج.م`} 
                                size="small" 
                                sx={{ 
                                  fontWeight: 800, 
                                  fontSize: '0.8rem', 
                                  bgcolor: 'rgba(27, 58, 75, 0.06)', 
                                  color: '#1B3A4B',
                                  border: '1px solid rgba(27, 58, 75, 0.08)'
                                }} 
                              />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="h6" sx={{ fontWeight: 900, color: '#2E8B9A', px: 2, py: 1, bgcolor: 'rgba(46, 139, 154, 0.08)', borderRadius: '12px', display: 'inline-block' }}>
                            {item.price} <Typography component="span" variant="caption" sx={{ fontWeight: 800 }}>ج.م</Typography>
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Divider */}
                    <Box sx={{ height: '1px', bgcolor: 'rgba(27, 58, 75, 0.06)', width: '100%', mb: { xs: 1.5, sm: 2 } }} />

                    {/* Bottom Section: Actions */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                      
                      {/* Availability Toggle */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: item.isAvailable ? 'rgba(46, 125, 50, 0.08)' : 'rgba(0, 0, 0, 0.04)', px: 2, py: 0.75, borderRadius: '12px', transition: 'all 0.3s ease' }}>
                        <Switch
                          checked={item.isAvailable}
                          onChange={() => handleToggleAvailability(item)}
                          size="small"
                          color="success"
                          sx={{ ml: -1 }}
                        />
                        <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: item.isAvailable ? 'success.main' : 'text.secondary' }}>
                          {item.isAvailable ? 'متاح للطلب' : 'غير متاح'}
                        </Typography>
                      </Box>

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Button 
                          size="small" 
                          color="inherit" 
                          onClick={() => router.push(`/admin/dashboard/products/edit/${item._id}`)}
                          sx={{ 
                            minWidth: '40px', width: '40px', height: '40px', borderRadius: '10px', 
                            bgcolor: 'rgba(27, 58, 75, 0.05)', 
                            color: '#1B3A4B',
                            '&:hover': { bgcolor: '#1B3A4B', color: '#fff' },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </Button>
                        <Button 
                          size="small" 
                          color="error" 
                          onClick={() => handleDeleteItem(item._id)}
                          sx={{ 
                            minWidth: '40px', width: '40px', height: '40px', borderRadius: '10px', 
                            bgcolor: 'rgba(211, 47, 47, 0.08)', 
                            '&:hover': { bgcolor: 'error.main', color: '#fff' },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </SortableItem>
              ))}
            </Box>
          </SortableContext>
        </DndContext>
      )}



      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        sx={{ '& .MuiDialog-paper': { borderRadius: 4, p: 1, minWidth: { xs: 300, sm: 400 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'text.primary', textAlign: 'center' }}>
          تأكيد الحذف
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center', fontWeight: 600, color: 'text.secondary', mt: 1 }}>
            هل أنت متأكد أنك تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          <Button 
            onClick={() => setItemToDelete(null)} 
            sx={{ fontWeight: 700, borderRadius: 2, px: 3, color: 'text.secondary' }}
          >
            إلغاء
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained" 
            color="error" 
            sx={{ fontWeight: 700, borderRadius: 2, px: 3, boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)' }}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog
        open={!!errorDialog}
        onClose={() => setErrorDialog(null)}
        sx={{ '& .MuiDialog-paper': { borderRadius: 4, p: 1, minWidth: { xs: 300, sm: 400 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'error.main', textAlign: 'center', fontSize: '1.5rem' }}>
          تنبيه!
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center', fontWeight: 600, color: 'text.primary', mt: 1, fontSize: '1.1rem' }}>
            {errorDialog}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button 
            onClick={() => setErrorDialog(null)} 
            variant="contained" 
            color="primary" 
            sx={{ fontWeight: 700, borderRadius: 2, px: 4, boxShadow: '0 4px 12px rgba(44, 30, 22, 0.2)' }}
          >
            حسناً فهمت
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
