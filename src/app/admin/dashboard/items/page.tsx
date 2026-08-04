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
import { Category, MenuItem } from '@/types';
import Modal from '@/components/ui/Modal';
import MenuItemForm from '@/components/admin/MenuItemForm';
import SortableItem from '@/components/admin/SortableItem';
import { Box, Typography, Button, Snackbar, Alert, IconButton, Stack, Chip, Switch, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';

export default function MenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [catRes, itemRes] = await Promise.all([
        api.get('/categories'),
        api.get('/items'),
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

  const filteredItems = filterCategory
    ? items.filter((item) => getCategoryId(item.category) === filterCategory)
    : items;

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
      await api.put('/items/reorder', {
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

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await api.put(`/items/${item._id}`, { isAvailable: !item.isAvailable });
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
      await api.delete(`/items/${itemToDelete}`);
      showToast('Item deleted', 'success');
      fetchData();
    } catch {
      showToast('Failed to delete item', 'error');
    } finally {
      setItemToDelete(null);
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      if (editingItem) {
        await api.put(`/items/${editingItem._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Item updated successfully', 'success');
      } else {
        await api.post('/items', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Item added successfully', 'success');
      }
      setShowModal(false);
      setEditingItem(null);
      fetchData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || 'Failed to save item';
      showToast(errorMessage, 'error');
      throw error; // Re-throw to let form handle UI reverts
    } finally {
      setIsSubmitting(false);
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
        <Typography sx={{ typography: { xs: 'h5', md: 'h4' }, fontWeight: 800, color: 'text.primary', textAlign: { xs: 'center', sm: 'right' } }} component="h1">
          قطع الأخشاب
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ py: 1.5, px: 3, borderRadius: 3, fontWeight: 700, boxShadow: '0 8px 16px rgba(44, 30, 22, 0.2)' }}
          startIcon={<AddIcon />}
          onClick={() => { setEditingItem(null); setShowModal(true); }}
        >
          إضافة قطعة جديد
        </Button>
      </Box>

      {/* Category Filters */}
      <Box sx={{ display: 'flex', mb: 4, flexWrap: 'wrap', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
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

      {/* Items List with DnD */}
      {filteredItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <LocalCafeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary">No items found.</Typography>
        </Box>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredItems.map((i) => i._id)} strategy={verticalListSortingStrategy}>
            <Box sx={{ opacity: isSorting ? 0.7 : 1, pointerEvents: isSorting ? 'none' : 'auto' }}>
              {filteredItems.map((item) => (
                <SortableItem key={item._id} id={item._id}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    {/* Top Section: Info & Price */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 1.5, sm: 2 }, width: '100%', mb: { xs: 1.5, sm: 2 } }}>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', sm: 'auto' }, flexGrow: 1 }}>
                        {/* Image */}
                        {item.image?.url ? (
                          <Box component="img" src={item.image.url} alt={item.name} sx={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid', borderColor: 'primary.light', flexShrink: 0 }} />
                        ) : (
                          <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid', borderColor: 'divider', flexShrink: 0 }}>
                            <LocalCafeOutlinedIcon sx={{ color: 'text.secondary' }} />
                          </Box>
                        )}

                        {/* Title & Category */}
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', md: '1.15rem' }, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{getCategoryName(item.category)}</Typography>
                        </Box>
                      </Box>

                      {/* Price / Sizes */}
                      <Box sx={{ minWidth: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'right', sm: 'left' }, display: 'flex', justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                        {item.hasSizes && item.sizes && item.sizes.length > 0 ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                            {item.sizes.map(s => (
                              <Chip key={s.name} label={`${s.name}: ${s.price}`} size="small" sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: 'rgba(10, 41, 71, 0.05)', color: '#0A2947' }} />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', px: 1.5, py: 0.5, bgcolor: 'rgba(10, 41, 71, 0.05)', borderRadius: 2, display: 'inline-block' }}>
                            {item.price} ج.م
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Divider */}
                    <Box sx={{ height: '1px', bgcolor: 'rgba(0,0,0,0.06)', width: '100%', mb: { xs: 1.5, sm: 2 } }} />

                    {/* Bottom Section: Actions */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                      
                      {/* Availability Toggle */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: item.isAvailable ? 'rgba(46, 125, 50, 0.08)' : 'rgba(0, 0, 0, 0.04)', px: 1.5, py: 0.5, borderRadius: 10, transition: 'all 0.2s' }}>
                        <Switch
                          checked={item.isAvailable}
                          onChange={() => handleToggleAvailability(item)}
                          size="small"
                          color="success"
                          sx={{ ml: -1 }}
                        />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: item.isAvailable ? 'success.main' : 'text.secondary' }}>
                          {item.isAvailable ? 'متاح' : 'غير متاح'}
                        </Typography>
                      </Box>

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          color="inherit" 
                          onClick={() => { setEditingItem(item); setShowModal(true); }}
                          sx={{ minWidth: '40px', width: '40px', height: '40px', borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.04)', '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' } }}
                        >
                          <EditIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </Button>
                        <Button 
                          size="small" 
                          color="error" 
                          onClick={() => handleDeleteItem(item._id)}
                          sx={{ minWidth: '40px', width: '40px', height: '40px', borderRadius: '50%', bgcolor: 'rgba(211, 47, 47, 0.08)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.15)' } }}
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

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingItem(null); }}
        title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
      >
        <MenuItemForm
          categories={categories}
          initialData={editingItem ? {
            name: editingItem.name,
            description: editingItem.description,
            price: editingItem.price,
            category: getCategoryId(editingItem.category),
            isAvailable: editingItem.isAvailable,
            hasSizes: editingItem.hasSizes,
            sizes: editingItem.sizes,
            imageUrl: editingItem.image?.url,
          } : undefined}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </Modal>

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
            هل أنت متأكد أنك تريد حذف هذا القطعة؟ لا يمكن التراجع عن هذا الإجراء.
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
    </Box>
  );
}
