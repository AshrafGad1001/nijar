'use client';

import { useState, useEffect } from 'react';
import { compressImage } from '@/lib/imageCompression';
import { Category } from '@/types';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Typography, IconButton, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import api from '@/lib/api';

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    name: string;
    description: string;
    price: number | null;
    category: string;
    isAvailable: boolean;
    isBestSeller?: boolean;
    isHeroSlide?: boolean;
    hasSizes?: boolean;
    sizes?: { name: string; price: number; hardwareNote?: string; materialNote?: string; }[];
    technicalDetails?: { woodType?: string; paintType?: string; warranty?: string; dimensions?: string; productionTime?: string; };
    imageUrl?: string;
    galleryUrls?: string[];
  };
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

export default function ProductForm({ categories, initialData, onSubmit, isLoading }: ProductFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isHeroSlide, setIsHeroSlide] = useState(false);
  const [hasSizes, setHasSizes] = useState(false);
  
  // Dynamic Sizes Array
  const [sizes, setSizes] = useState<{name: string, price: number | '', variantDetails?: { woodType?: string, paintType?: string, hardware?: string, material?: string, dimensions?: string }}[]>([
    { name: '', price: '' }
  ]);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [activeVariantIndex, setActiveVariantIndex] = useState<number | null>(null);

  // Technical Details
  const [woodType, setWoodType] = useState('');
  const [paintType, setPaintType] = useState('');
  const [warranty, setWarranty] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [productionTime, setProductionTime] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  // Gallery
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  
  // Progress
  const [uploadProgress, setUploadProgress] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setPrice(initialData.price || '');
      setCategoryId(initialData.category || '');
      setIsAvailable(initialData.isAvailable ?? true);
      setIsBestSeller(initialData.isBestSeller ?? false);
      setIsHeroSlide(initialData.isHeroSlide ?? false);
      setHasSizes(initialData.hasSizes ?? false);
      if (initialData.sizes && initialData.sizes.length > 0) {
        setSizes(initialData.sizes.map(s => ({ name: s.name, price: s.price, variantDetails: (s as any).variantDetails || undefined })));
      } else {
        setSizes([{ name: '', price: '' }]);
      }
      if (initialData.technicalDetails) {
        setWoodType(initialData.technicalDetails.woodType || '');
        setPaintType(initialData.technicalDetails.paintType || '');
        setWarranty(initialData.technicalDetails.warranty || '');
        setDimensions(initialData.technicalDetails.dimensions || '');
        setProductionTime(initialData.technicalDetails.productionTime || '');
      }
      if (initialData.imageUrl) setPreviewUrl(initialData.imageUrl);
      if (initialData.galleryUrls) setGalleryPreviews(initialData.galleryUrls);
    }
  }, [initialData]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedFile = await compressImage(file);
        setImageFile(compressedFile);
        setPreviewUrl(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      try {
        // Enforce max 10 images limit (combining existing and new)
        const currentCount = galleryPreviews.length;
        const newFiles = Array.from(files).slice(0, 10 - currentCount);
        
        const compressedFiles = await Promise.all(
          newFiles.map(file => compressImage(file))
        );
        
        setGalleryFiles(prev => [...prev, ...compressedFiles]);
        
        const newPreviews = compressedFiles.map(file => URL.createObjectURL(file));
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
      } catch (error) {
        console.error('Error compressing gallery images:', error);
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    // If it's a newly added file, remove it from the file array
    // Since we combine existing URLs and new files in the preview, we need to handle this carefully.
    // For simplicity in this iteration, if editing, we only append new files and can't easily remove existing ones without backend support.
    // Let's just reset the entire gallery selection if they want to change newly added files.
    const newPreviews = [...galleryPreviews];
    newPreviews.splice(index, 1);
    setGalleryPreviews(newPreviews);
    
    // Approximation for file removal
    if (index >= (initialData?.galleryUrls?.length || 0)) {
      const fileIndex = index - (initialData?.galleryUrls?.length || 0);
      const newFiles = [...galleryFiles];
      newFiles.splice(fileIndex, 1);
      setGalleryFiles(newFiles);
    }
  };

  const addSize = () => {
    setSizes([...sizes, { name: '', price: '' }]);
  };

  const removeSize = (index: number) => {
    const newSizes = [...sizes];
    newSizes.splice(index, 1);
    if (newSizes.length === 0) {
      newSizes.push({ name: '', price: '' });
    }
    setSizes(newSizes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let uploadedImage = null;
      let uploadedGallery: any[] = [];

      // 1. Upload Cover Image sequentially
      if (imageFile) {
        setUploadProgress('جاري رفع صورة الغلاف...');
        const imgData = new FormData();
        imgData.append('file', imageFile);
        imgData.append('folder', 'nijar/items');
        const res = await api.post('/products/upload-image', imgData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data?.success) {
          uploadedImage = res.data.data;
        }
      }

      // 2. Upload Gallery Images sequentially
      for (let i = 0; i < galleryFiles.length; i++) {
        setUploadProgress(`جاري رفع صور المعرض (${i + 1} من ${galleryFiles.length})...`);
        const file = galleryFiles[i];
        const gData = new FormData();
        gData.append('file', file);
        gData.append('folder', 'nijar/gallery');
        const res = await api.post('/products/upload-image', gData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data?.success) {
          uploadedGallery.push(res.data.data);
        }
      }
      
      setUploadProgress('جاري حفظ بيانات القطعة...');

      // 3. Prepare Final Payload (FormData with text fields only for images)
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      
      let validSizes: any[] = [];
      if (hasSizes) {
        validSizes = sizes.filter(s => s.name.trim() !== '' && s.price !== '' && Number(s.price) > 0).map(s => ({
          name: s.name,
          price: Number(s.price),
          variantDetails: s.variantDetails
        }));
      } else {
        formData.append('price', String(price));
      }
      
      const technicalDetails = {
        woodType: woodType.trim(),
        paintType: paintType.trim(),
        warranty: warranty.trim(),
        dimensions: dimensions.trim(),
        productionTime: productionTime.trim()
      };
      
      formData.append('hasSizes', String(hasSizes));
      formData.append('sizes', JSON.stringify(validSizes));
      formData.append('technicalDetails', JSON.stringify(technicalDetails));
      
      formData.append('category', categoryId);
      formData.append('isAvailable', String(isAvailable));
      formData.append('isBestSeller', String(isBestSeller));
      formData.append('isHeroSlide', String(isHeroSlide));
      
      if (uploadedImage) {
        formData.append('image', JSON.stringify(uploadedImage));
      }
      
      if (uploadedGallery.length > 0) {
        formData.append('gallery', JSON.stringify(uploadedGallery));
      }

      await onSubmit(formData);
    } catch (error) {
      // Revert states if necessary but DO NOT re-throw to prevent Next.js runtime error screens.
      if (isBestSeller) setIsBestSeller(false);
      if (isHeroSlide) setIsHeroSlide(false);
    } finally {
      setUploadProgress('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        fullWidth
        margin="normal"
        id="name"
        label="الاسم (Name)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        id="description"
        label="الوصف (Description)"
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <Accordion sx={{ mt: 2, mb: 2, border: '1px solid rgba(0,0,0,0.12)', boxShadow: 'none' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>المواصفات العامة للمنتج (اختياري)</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="نوع الخشب (مثال: زان أحمر)" value={woodType} onChange={(e) => setWoodType(e.target.value)} fullWidth size="small" />
          <TextField label="نوع الدهان (مثال: بولي يوريثان مطفي)" value={paintType} onChange={(e) => setPaintType(e.target.value)} fullWidth size="small" />
          <TextField label="الضمان (مثال: ٣ سنوات)" value={warranty} onChange={(e) => setWarranty(e.target.value)} fullWidth size="small" />
          <TextField label="الأبعاد العامة (اتركه فارغاً إذا كانت المقاسات تختلف حسب الفئة)" value={dimensions} onChange={(e) => setDimensions(e.target.value)} fullWidth size="small" />
          <TextField label="مدة التنفيذ (مثال: ١٥ يوم عمل)" value={productionTime} onChange={(e) => setProductionTime(e.target.value)} fullWidth size="small" />
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 2 }}>
        <FormControlLabel 
          control={
            <Switch 
              checked={hasSizes} 
              onChange={(e) => setHasSizes(e.target.checked)} 
            />
          } 
          label="فئات/مقاسات متعددة (Variants)" 
        />
      </Box>

      {!hasSizes ? (
        <TextField
          fullWidth
          margin="normal"
          id="price"
          label="السعر الأساسي (Price)"
          type="number"
          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
          value={price}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setPrice(isNaN(val) ? '' : Math.max(0, val));
          }}
          required={!hasSizes}
        />
      ) : (
        <Box sx={{ mt: 1, mb: 2, p: 2, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>أدخل الفئات والأسعار:</Typography>
          
          {sizes.map((size, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 1, bgcolor: '#f9f9f9' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="الفئة / المقاس (مثل: 120x60 أو فئة ممتازة)"
                  size="small"
                  fullWidth
                  value={size.name}
                  onChange={(e) => {
                    const newSizes = [...sizes];
                    newSizes[index].name = e.target.value;
                    setSizes(newSizes);
                  }}
                />
                <TextField
                  label="السعر"
                  type="number"
                  size="small"
                  sx={{ width: '150px' }}
                  slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                  value={size.price}
                  onChange={(e) => {
                    const newSizes = [...sizes];
                    const val = parseFloat(e.target.value);
                    newSizes[index].price = isNaN(val) ? '' : Math.max(0, val);
                    setSizes(newSizes);
                  }}
                />
                <IconButton color="primary" onClick={() => {
                  setActiveVariantIndex(index);
                  setIsVariantDialogOpen(true);
                }} title="تخصيص مواصفات الفئة">
                  <SettingsOutlinedIcon />
                </IconButton>
                <IconButton color="error" onClick={() => removeSize(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
                />
              </Box>
            </Box>
          ))}
          
          <Button startIcon={<AddIcon />} onClick={addSize} size="small" variant="outlined">
            إضافة فئة/مقاس
          </Button>
        </Box>
      )}

      <FormControl fullWidth margin="normal" required>
        <InputLabel id="category-label">التصنيف (Category)</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          value={categoryId}
          label="التصنيف (Category)"
          onChange={(e) => setCategoryId(e.target.value as string)}
        >
          {categories.map((cat: any) => (
            <MenuItem key={cat._id || cat.id} value={cat._id || cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <FormControlLabel 
          control={<Switch checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />} 
          label="متاح (Available)" 
        />
        <FormControlLabel 
          control={<Switch checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} color="warning" />} 
          label={<Typography sx={{ fontWeight: 'bold', color: isBestSeller ? 'warning.main' : 'inherit' }}>أبرز الأعمال</Typography>} 
        />
        <FormControlLabel 
          control={<Switch checked={isHeroSlide} onChange={(e) => setIsHeroSlide(e.target.checked)} color="info" />} 
          label={<Typography sx={{ fontWeight: 'bold', color: isHeroSlide ? 'info.main' : 'inherit' }}>شريط العرض (Hero Slide)</Typography>} 
        />
      </Box>

      {/* Cover Image Upload */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>صورة الغلاف (Cover Image)</Typography>
        <Button component="label" variant="outlined">
          رفع الصورة
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </Button>
        {previewUrl && (
          <Box sx={{ mt: 2, position: 'relative', width: '200px', height: '200px' }}>
            <img src={previewUrl} alt="Preview" style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '8px' }} />
          </Box>
        )}
      </Box>

      {/* Gallery Upload */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>معرض الصور (Gallery - حد أقصى 10 صور)</Typography>
        <Button component="label" variant="outlined" disabled={galleryPreviews.length >= 10}>
          رفع صور إضافية
          <input type="file" accept="image/*" multiple hidden onChange={handleGalleryChange} />
        </Button>
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
          ملاحظة: حجم الصورة الواحدة يجب ألا يتجاوز 2MB
        </Typography>
        
        {galleryPreviews.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {galleryPreviews.map((url, idx) => (
              <Box key={idx} sx={{ position: 'relative', width: '100px', height: '100px' }}>
                <img src={url} alt={`Gallery ${idx}`} style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '8px' }} />
                <IconButton 
                  size="small" 
                  sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                  onClick={() => removeGalleryImage(idx)}
                >
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 5 }}>
        <Button variant="contained" color="primary" type="submit" disabled={isLoading || !!uploadProgress} size="large" fullWidth>
          {uploadProgress || (isLoading ? 'جاري الحفظ...' : 'حفظ القطعة (Save)')}
        </Button>
      </Box>

      <Dialog open={isVariantDialogOpen} onClose={() => setIsVariantDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>تخصيص مواصفات الفئة: {activeVariantIndex !== null ? sizes[activeVariantIndex]?.name : ''}</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            أدخل المواصفات الخاصة بهذه الفئة فقط. اترك الحقل فارغاً لوراثة المواصفات العامة للمنتج.
          </Typography>
          <TextField
            label="نوع الخشب"
            size="small"
            fullWidth
            value={activeVariantIndex !== null ? (sizes[activeVariantIndex]?.variantDetails?.woodType || '') : ''}
            onChange={(e) => {
              if (activeVariantIndex === null) return;
              const newSizes = [...sizes];
              if (!newSizes[activeVariantIndex].variantDetails) newSizes[activeVariantIndex].variantDetails = {};
              newSizes[activeVariantIndex].variantDetails!.woodType = e.target.value;
              setSizes(newSizes);
            }}
          />
          <TextField
            label="نوع الدهان"
            size="small"
            fullWidth
            value={activeVariantIndex !== null ? (sizes[activeVariantIndex]?.variantDetails?.paintType || '') : ''}
            onChange={(e) => {
              if (activeVariantIndex === null) return;
              const newSizes = [...sizes];
              if (!newSizes[activeVariantIndex].variantDetails) newSizes[activeVariantIndex].variantDetails = {};
              newSizes[activeVariantIndex].variantDetails!.paintType = e.target.value;
              setSizes(newSizes);
            }}
          />
          <TextField
            label="تفاصيل الخامات"
            size="small"
            fullWidth
            value={activeVariantIndex !== null ? (sizes[activeVariantIndex]?.variantDetails?.material || '') : ''}
            onChange={(e) => {
              if (activeVariantIndex === null) return;
              const newSizes = [...sizes];
              if (!newSizes[activeVariantIndex].variantDetails) newSizes[activeVariantIndex].variantDetails = {};
              newSizes[activeVariantIndex].variantDetails!.material = e.target.value;
              setSizes(newSizes);
            }}
          />
          <TextField
            label="الإكسسوارات"
            size="small"
            fullWidth
            value={activeVariantIndex !== null ? (sizes[activeVariantIndex]?.variantDetails?.hardware || '') : ''}
            onChange={(e) => {
              if (activeVariantIndex === null) return;
              const newSizes = [...sizes];
              if (!newSizes[activeVariantIndex].variantDetails) newSizes[activeVariantIndex].variantDetails = {};
              newSizes[activeVariantIndex].variantDetails!.hardware = e.target.value;
              setSizes(newSizes);
            }}
          />
          <TextField
            label="الأبعاد (للفئة)"
            size="small"
            fullWidth
            value={activeVariantIndex !== null ? (sizes[activeVariantIndex]?.variantDetails?.dimensions || '') : ''}
            onChange={(e) => {
              if (activeVariantIndex === null) return;
              const newSizes = [...sizes];
              if (!newSizes[activeVariantIndex].variantDetails) newSizes[activeVariantIndex].variantDetails = {};
              newSizes[activeVariantIndex].variantDetails!.dimensions = e.target.value;
              setSizes(newSizes);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsVariantDialogOpen(false)} variant="contained">تم</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
