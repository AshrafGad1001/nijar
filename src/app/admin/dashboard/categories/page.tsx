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
import { Category } from '@/types';
import Modal from '@/components/ui/Modal';
import CategoryForm from '@/components/admin/CategoryForm';
import SortableItem from '@/components/admin/SortableItem';
import { Box, Typography, Button, Snackbar, Alert, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Tabs, Tab, Switch } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState(0); // 0 = Main, 1 = Standalone
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      showToast('Failed to load categories', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c._id === active.id);
    const newIndex = categories.findIndex((c) => c._id === over.id);
    const newOrder = arrayMove(categories, oldIndex, newIndex);

    setCategories(newOrder);
    setIsSorting(true);

    try {
      await api.put('/categories/reorder', {
        orderedIds: newOrder.map((c) => c._id),
      });
      showToast('Order updated', 'success');
    } catch {
      showToast('Failed to reorder', 'error');
      fetchCategories();
    } finally {
      setIsSorting(false);
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      // Implicitly add isStandalonePiece based on activeTab if we are creating a new one.
      // If editing, it preserves the existing flag or we can force it. We'll enforce the tab context.
      if (!editingCategory) {
        formData.append('isStandalonePiece', (activeTab === 1).toString());
      } else {
        formData.append('isStandalonePiece', (activeTab === 1).toString());
      }

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Category updated successfully', 'success');
      } else {
        await api.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Category added successfully', 'success');
      }
      setShowModal(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || 'Failed to save category';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await api.delete(`/categories/${categoryToDelete}`);
      showToast('Category deleted', 'success');
      fetchCategories();
    } catch {
      showToast('Failed to delete category', 'error');
    } finally {
      setCategoryToDelete(null);
    }
  };

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
        <Box>
          <Typography sx={{ typography: { xs: 'h5', md: 'h4' }, fontWeight: 900, color: '#1B3A4B', letterSpacing: '-0.5px', textAlign: { xs: 'center', sm: 'right' }, mb: 1 }} component="h1">
            التصنيفات
          </Typography>
          <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ minHeight: '36px', '& .MuiTab-root': { minHeight: '36px', py: 0.5, fontWeight: 700 } }}>
            <Tab label="الأقسام الرئيسية" />
            <Tab label="القطع الفردية" />
          </Tabs>
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ py: 1.5, px: 3, borderRadius: 3, fontWeight: 700, boxShadow: '0 8px 16px rgba(44, 30, 22, 0.2)' }}
          startIcon={<AddIcon />}
          onClick={() => { setEditingCategory(null); setShowModal(true); }}
        >
          إضافة تصنيف جديد
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : categories.filter(c => activeTab === 0 ? !c.isStandalonePiece : c.isStandalonePiece).length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <FolderIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary">لا توجد تصنيفات في هذا القسم حالياً.</Typography>
        </Box>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={categories.filter(c => activeTab === 0 ? !c.isStandalonePiece : c.isStandalonePiece).map((c) => c._id)} strategy={verticalListSortingStrategy}>
            <Box sx={{ opacity: isSorting ? 0.7 : 1, pointerEvents: isSorting ? 'none' : 'auto' }}>
              {categories.filter(c => activeTab === 0 ? !c.isStandalonePiece : c.isStandalonePiece).map((category) => (
                <SortableItem key={category._id} id={category._id}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' }, 
                    alignItems: { xs: 'flex-start', sm: 'center' }, 
                    gap: 2, 
                    width: '100%' 
                  }}>
                    {/* Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, width: '100%' }}>
                      {category.image?.url ? (
                        <Box 
                          component="img" 
                          src={category.image.url} 
                          alt={category.name} 
                          sx={{ 
                            width: 64, 
                            height: 64, 
                            borderRadius: '16px', 
                            objectFit: 'cover', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                          }} 
                        />
                      ) : (
                        <Box sx={{ width: 64, height: 64, borderRadius: '16px', bgcolor: 'rgba(27, 58, 75, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FolderIcon sx={{ color: '#1B3A4B' }} />
                        </Box>
                      )}
                      <Box>
                        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#1B3A4B', mb: 0.5 }}>
                          {category.name}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'inline-block', bgcolor: 'rgba(46, 139, 154, 0.1)', color: '#2E8B9A', px: 1.5, py: 0.25, borderRadius: '12px', fontWeight: 700 }}>
                          الترتيب: {category.displayOrder}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                      {/* Quick Toggle for Hide Prices */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(27, 58, 75, 0.05)', px: 1.5, py: 0.5, borderRadius: '12px' }}>
                         <Typography variant="caption" sx={{ fontWeight: 700, color: '#1B3A4B', whiteSpace: 'nowrap' }}>إخفاء السعر</Typography>
                         <Switch 
                           size="small"
                           checked={category.hidePrices || false}
                           onChange={async (e) => {
                             try {
                               const formData = new FormData();
                               formData.append('hidePrices', e.target.checked.toString());
                               formData.append('name', category.name);
                               await api.put(`/categories/${category._id}`, formData);
                               showToast('تم تحديث حالة الأسعار', 'success');
                               fetchCategories();
                             } catch (error) {
                               showToast('فشل التحديث', 'error');
                             }
                           }}
                         />
                      </Box>
                      <Button 
                        size="small" 
                        color="inherit" 
                        onClick={() => { setEditingCategory(category); setShowModal(true); }}
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
                        onClick={() => handleDeleteClick(category._id)}
                        sx={{ 
                          minWidth: '40px', width: '40px', height: '40px', borderRadius: '10px', 
                          bgcolor: 'rgba(239, 68, 68, 0.05)', 
                          color: '#ef4444',
                          '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
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
        onClose={() => { setShowModal(false); setEditingCategory(null); }}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <CategoryForm
          initialData={editingCategory ? { name: editingCategory.name, imageUrl: editingCategory.image?.url } : undefined}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        sx={{ '& .MuiDialog-paper': { borderRadius: 4, p: 1, minWidth: { xs: 300, sm: 400 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'text.primary', textAlign: 'center' }}>
          تأكيد الحذف
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center', fontWeight: 600, color: 'text.secondary', mt: 1 }}>
            هل أنت متأكد أنك تريد حذف هذا التصنيف؟ 
            <br />
            <Typography component="span" sx={{ color: 'error.main', fontWeight: 700, fontSize: '0.85rem' }}>
              سيتم حذف جميع العناصر الموجودة بداخل هذا التصنيف أيضاً.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          <Button 
            onClick={() => setCategoryToDelete(null)} 
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
