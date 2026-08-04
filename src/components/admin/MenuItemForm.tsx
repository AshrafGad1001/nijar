'use client';

import { useState, useEffect } from 'react';
import { compressImage } from '@/lib/imageCompression';
import { Category } from '@/types';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem as SelectMenuItem, FormControlLabel, Switch, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface MenuItemFormProps {
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
    sizes?: { name: string; price: number }[];
    imageUrl?: string;
    galleryUrls?: string[];
  };
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

export default function MenuItemForm({ categories, initialData, onSubmit, isLoading }: MenuItemFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isHeroSlide, setIsHeroSlide] = useState(false);
  const [hasSizes, setHasSizes] = useState(false);
  
  // Dynamic Sizes Array
  const [sizes, setSizes] = useState<{name: string, price: number | ''}[]>([
    { name: '', price: '' }
  ]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  // Gallery
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

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
        setSizes(initialData.sizes.map(s => ({ name: s.name, price: s.price })));
      } else {
        setSizes([{ name: '', price: '' }]);
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
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    
    let validSizes: any[] = [];
    if (hasSizes) {
      validSizes = sizes.filter(s => s.name.trim() !== '' && s.price !== '' && Number(s.price) > 0);
    } else {
      formData.append('price', String(price));
    }
    
    formData.append('hasSizes', String(hasSizes));
    formData.append('sizes', JSON.stringify(validSizes));
    
    formData.append('category', categoryId);
    formData.append('isAvailable', String(isAvailable));
    formData.append('isBestSeller', String(isBestSeller));
    formData.append('isHeroSlide', String(isHeroSlide));
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    galleryFiles.forEach(file => {
      formData.append('gallery', file);
    });
    
    try {
      await onSubmit(formData);
    } catch (error) {
      if (isBestSeller) setIsBestSeller(false);
      if (isHeroSlide) setIsHeroSlide(false);
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

      <Box sx={{ mt: 2 }}>
        <FormControlLabel 
          control={
            <Switch 
              checked={hasSizes} 
              onChange={(e) => setHasSizes(e.target.checked)} 
            />
          } 
          label="مقاسات متعددة (Multiple Sizes)" 
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
          <Typography variant="subtitle2" sx={{ mb: 2 }}>أدخل المقاسات والأسعار:</Typography>
          
          {sizes.map((size, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
              <TextField
                label="المقاس (مثل: 120x60)"
                size="small"
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
                slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                value={size.price}
                onChange={(e) => {
                  const newSizes = [...sizes];
                  const val = parseFloat(e.target.value);
                  newSizes[index].price = isNaN(val) ? '' : Math.max(0, val);
                  setSizes(newSizes);
                }}
              />
              <IconButton color="error" onClick={() => removeSize(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          
          <Button startIcon={<AddIcon />} onClick={addSize} size="small" variant="outlined">
            إضافة مقاس
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
            <SelectMenuItem key={cat._id || cat.id} value={cat._id || cat.id}>
              {cat.name}
            </SelectMenuItem>
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
        <Button variant="contained" color="primary" type="submit" disabled={isLoading} size="large" fullWidth>
          {isLoading ? 'جاري الحفظ...' : 'حفظ القطعة (Save)'}
        </Button>
      </Box>
    </Box>
  );
}
