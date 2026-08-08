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
    productCode?: string;
    name: string;
    description: string;
    price: number | null;
    category: string;
    isAvailable: boolean;
    isBestSeller?: boolean;
    isHeroSlide?: boolean;
    hasSizes?: boolean;
    sizes?: { name: string; price: number; variantDetails?: { woodType?: string; paintType?: string; mechanism?: string; handles?: string; hinges?: string; warranty?: string; productionTime?: string; dimensions?: { length?: number | null; width?: number | null; height?: number | null; }; } }[];
    technicalDetails?: { woodType?: string; paintType?: string; mechanism?: string; handles?: string; hinges?: string; warranty?: string; dimensions?: { length?: number | null; width?: number | null; height?: number | null; }; productionTime?: string; };
    imageUrl?: string;
    galleryUrls?: string[];
  };
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

export default function ProductForm({ categories, initialData, onSubmit, isLoading }: ProductFormProps) {
  const [productCode, setProductCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isHeroSlide, setIsHeroSlide] = useState(false);
  const [hasSizes, setHasSizes] = useState(false);
  const [errorDialog, setErrorDialog] = useState<{isOpen: boolean, message: string}>({isOpen: false, message: ''});
  
  // Dynamic Sizes Array
  const [sizes, setSizes] = useState<{name: string, price: number | '', variantDetails?: { woodType?: string, paintType?: string, mechanism?: string, handles?: string, hinges?: string, warranty?: string, productionTime?: string, dimensions?: { length?: number | null, width?: number | null, height?: number | null } }}[]>([
    { name: '', price: '' }
  ]);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [activeVariantIndex, setActiveVariantIndex] = useState<number | null>(null);

  // Technical Details
  const [woodType, setWoodType] = useState('');
  const [paintType, setPaintType] = useState('');
  const [mechanism, setMechanism] = useState('');
  const [handles, setHandles] = useState('');
  const [hinges, setHinges] = useState('');
  const [warranty, setWarranty] = useState('');
  const [dimensions, setDimensions] = useState<{length: number | '', width: number | '', height: number | ''}>({length: '', width: '', height: ''});
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
      setProductCode(initialData.productCode || '');
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
        setMechanism(initialData.technicalDetails.mechanism || '');
        setHandles(initialData.technicalDetails.handles || '');
        setHinges(initialData.technicalDetails.hinges || '');
        setWarranty(initialData.technicalDetails.warranty || '');
        setDimensions({
          length: initialData.technicalDetails.dimensions?.length ?? '',
          width: initialData.technicalDetails.dimensions?.width ?? '',
          height: initialData.technicalDetails.dimensions?.height ?? '',
        });
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
      formData.append('productCode', productCode);
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
        mechanism: mechanism.trim(),
        handles: handles.trim(),
        hinges: hinges.trim(),
        warranty: warranty.trim(),
        dimensions: {
          length: dimensions.length === '' ? null : Number(dimensions.length),
          width: dimensions.width === '' ? null : Number(dimensions.width),
          height: dimensions.height === '' ? null : Number(dimensions.height)
        },
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
    } catch (error: any) {
      // Revert states if necessary but DO NOT re-throw to prevent Next.js runtime error screens.
      if (isBestSeller) setIsBestSeller(false);
      if (isHeroSlide) setIsHeroSlide(false);
      
      const apiMsg = error?.response?.data?.errors?.[0]?.msg || error?.response?.data?.message || '';
      let displayMessage = 'حدث خطأ غير متوقع أثناء الحفظ. يرجى مراجعة البيانات والمحاولة مرة أخرى.';
      
      if (apiMsg.includes('E11000') || apiMsg.includes('duplicate')) {
        displayMessage = 'عذراً، اسم المنتج موجود بالفعل في النظام. يرجى اختيار اسم مختلف.';
      } else if (apiMsg) {
        displayMessage = apiMsg;
      } else if (error.message) {
        displayMessage = error.message;
      }
      
      setErrorDialog({ isOpen: true, message: displayMessage });
    } finally {
      setUploadProgress('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        fullWidth
        margin="normal"
        id="productCode"
        label="كود المنتج (Product Code) *"
        value={productCode}
        onChange={(e) => {
          const val = e.target.value.toUpperCase().replace(/\s/g, ''); // Uppercase and remove spaces instantly
          setProductCode(val);
        }}
        slotProps={{ htmlInput: { pattern: '^[A-Z0-9\\-]{3,15}$', title: 'يجب أن يحتوي الكود على حروف وأرقام إنجليزية وعلامة - فقط، وبطول 3 إلى 15 حرف', dir: 'ltr' } }}
        required
        placeholder="e.g. MG-4024"
        helperText="الكود يجب أن يكون فريداً لكل منتج. مسموح بـ A-Z, 0-9, وعلامة (-)."
      />

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

      {!hasSizes && (
        <Accordion sx={{ mt: 2, mb: 2, border: '1px solid rgba(0,0,0,0.12)', boxShadow: 'none' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>المواصفات الفنية للمنتج</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="نوع الخشب (مثال: زان أحمر)" value={woodType} onChange={(e) => setWoodType(e.target.value)} fullWidth size="small" />
            <TextField label="نوع الدهان (مثال: بولي يوريثان مطفي)" value={paintType} onChange={(e) => setPaintType(e.target.value)} fullWidth size="small" />
            <TextField label="الميكانزم (مثال: ميكانزم إيطالي)" value={mechanism} onChange={(e) => setMechanism(e.target.value)} fullWidth size="small" />
            <TextField label="المقابض (مثال: مقابض بلت إن معدنية)" value={handles} onChange={(e) => setHandles(e.target.value)} fullWidth size="small" />
            <TextField label="المفصلات (مثال: سوفت كلوز تركي)" value={hinges} onChange={(e) => setHinges(e.target.value)} fullWidth size="small" />
            <TextField label="الضمان (مثال: ٣ سنوات)" value={warranty} onChange={(e) => setWarranty(e.target.value)} fullWidth size="small" />
            <TextField label="مدة التنفيذ (مثال: ١٥ يوم عمل)" value={productionTime} onChange={(e) => setProductionTime(e.target.value)} fullWidth size="small" />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField 
                label="الطول (سم)" 
                type="number"
                slotProps={{ htmlInput: { min: 0 } }}
                value={dimensions.length} 
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setDimensions({ ...dimensions, length: isNaN(val) ? '' : Math.max(0, val) });
                }} 
                fullWidth size="small" 
              />
              <TextField 
                label="العرض (سم)" 
                type="number"
                slotProps={{ htmlInput: { min: 0 } }}
                value={dimensions.width} 
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setDimensions({ ...dimensions, width: isNaN(val) ? '' : Math.max(0, val) });
                }} 
                fullWidth size="small" 
              />
              <TextField 
                label="الارتفاع (سم)" 
                type="number"
                slotProps={{ htmlInput: { min: 0 } }}
                value={dimensions.height} 
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setDimensions({ ...dimensions, height: isNaN(val) ? '' : Math.max(0, val) });
                }} 
                fullWidth size="small" 
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

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
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => {
                    setActiveVariantIndex(index);
                    setIsVariantDialogOpen(true);
                  }} 
                  startIcon={<SettingsOutlinedIcon />}
                  sx={{ 
                    whiteSpace: 'nowrap', 
                    minWidth: 'max-content',
                    height: '40px',
                    px: 2,
                    borderRadius: 2
                  }}
                >
                  تحديد المواصفات
                </Button>
                <IconButton color="error" onClick={() => removeSize(index)}>
                  <DeleteIcon />
                </IconButton>
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
            أدخل المواصفات الخاصة بهذه الفئة (لا يتم الوراثة من المواصفات العامة).
          </Typography>
          <TextField label="نوع الخشب" size="small" fullWidth value={activeVariantIndex !== null ? (sizes[activeVariantIndex]?.variantDetails?.woodType || '') : ''} onChange={(e) => {
            if (activeVariantIndex === null) return;
            const newSizes = [...sizes];
            if (!newSizes[activeVariantIndex].variantDetails) newSizes[activeVariantIndex].variantDetails = {};
            newSizes[activeVariantIndex].variantDetails!.woodType = e.target.value;
            setSizes(newSizes);
          }} />
          <TextField label="نوع الدهان" size="small" fullWidth value={activeVariantIndex !== null ? (sizes[activeVariantIndex]?.variantDetails?.paintType || '') : ''} onChange={(e) => {
            if (activeVariantIndex === null) return;
            const newSizes = [...sizes];
            if (!newSizes[activeVariantIndex].variantDetails) newSizes[activeVariantIndex].variantDetails = {};
            newSizes[activeVariantIndex].variantDetails!.paintType = e.target.value;
            setSizes(newSizes);
          }} />
          <TextField label="الميكانزم" size="small" fullWidth value={activeVariantIndex !== null ? (sizes[activeVariantIndex]?.variantDetails?.mechanism || '') : ''} onChange={(e) => {
            if (activeVariantIndex === null) return;
            const newSizes = [...sizes];
            if (!newSizes[activeVariantIndex].variantDetails) newSizes[activeVariantIndex].variantDetails = {};
            newSizes[activeVariantIndex].variantDetails!.mechanism = e.target.value;
            setSizes(newSizes);
          }} />
          <TextField label="المقابض" size="small" fullWidth value={activeVariantIndex !== null ? (sizes[activeVariantIndex]?.variantDetails?.handles || '') : ''} onChange={(e) => {
            if (activeVariantIndex === null) return;
            const newSizes = [...sizes];
            if (!newSizes[activeVariantIndex].variantDetails) newSizes[activeVariantIndex].variantDetails = {};
            newSizes[activeVariantIndex].variantDetails!.handles = e.target.value;
            setSizes(newSizes);
          }} />
          <TextField label="المفصلات" size="small" fullWidth value={activeVariantIndex !== null ? (sizes[activeVariantIndex]?.variantDetails?.hinges || '') : ''} onChange={(e) => {
            if (activeVariantIndex === null) return;
            const newSizes = [...sizes];
            if (!newSizes[activeVariantIndex].variantDetails) newSizes[activeVariantIndex].variantDetails = {};
            newSizes[activeVariantIndex].variantDetails!.hinges = e.target.value;
            setSizes(newSizes);
          }} />
          <TextField label="الضمان" size="small" fullWidth value={activeVariantIndex !== null ? (sizes[activeVariantIndex]?.variantDetails?.warranty || '') : ''} onChange={(e) => {
            if (activeVariantIndex === null) return;
            const newSizes = [...sizes];
            if (!newSizes[activeVariantIndex].variantDetails) newSizes[activeVariantIndex].variantDetails = {};
            newSizes[activeVariantIndex].variantDetails!.warranty = e.target.value;
            setSizes(newSizes);
          }} />
          <TextField label="مدة التنفيذ" size="small" fullWidth value={activeVariantIndex !== null ? (sizes[activeVariantIndex]?.variantDetails?.productionTime || '') : ''} onChange={(e) => {
            if (activeVariantIndex === null) return;
            const newSizes = [...sizes];
            if (!newSizes[activeVariantIndex].variantDetails) newSizes[activeVariantIndex].variantDetails = {};
            newSizes[activeVariantIndex].variantDetails!.productionTime = e.target.value;
            setSizes(newSizes);
          }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="الطول (سم)" type="number" slotProps={{ htmlInput: { min: 0 } }} size="small" fullWidth value={activeVariantIndex !== null ? (sizes[activeVariantIndex]?.variantDetails?.dimensions?.length ?? '') : ''} onChange={(e) => {
              if (activeVariantIndex === null) return;
              const newSizes = [...sizes];
              if (!newSizes[activeVariantIndex].variantDetails) newSizes[activeVariantIndex].variantDetails = {};
              if (!newSizes[activeVariantIndex].variantDetails!.dimensions) newSizes[activeVariantIndex].variantDetails!.dimensions = {};
              const val = parseFloat(e.target.value);
              newSizes[activeVariantIndex].variantDetails!.dimensions!.length = isNaN(val) ? null : Math.max(0, val);
              setSizes(newSizes);
            }} />
            <TextField label="العرض (سم)" type="number" slotProps={{ htmlInput: { min: 0 } }} size="small" fullWidth value={activeVariantIndex !== null ? (sizes[activeVariantIndex]?.variantDetails?.dimensions?.width ?? '') : ''} onChange={(e) => {
              if (activeVariantIndex === null) return;
              const newSizes = [...sizes];
              if (!newSizes[activeVariantIndex].variantDetails) newSizes[activeVariantIndex].variantDetails = {};
              if (!newSizes[activeVariantIndex].variantDetails!.dimensions) newSizes[activeVariantIndex].variantDetails!.dimensions = {};
              const val = parseFloat(e.target.value);
              newSizes[activeVariantIndex].variantDetails!.dimensions!.width = isNaN(val) ? null : Math.max(0, val);
              setSizes(newSizes);
            }} />
            <TextField label="الارتفاع (سم)" type="number" slotProps={{ htmlInput: { min: 0 } }} size="small" fullWidth value={activeVariantIndex !== null ? (sizes[activeVariantIndex]?.variantDetails?.dimensions?.height ?? '') : ''} onChange={(e) => {
              if (activeVariantIndex === null) return;
              const newSizes = [...sizes];
              if (!newSizes[activeVariantIndex].variantDetails) newSizes[activeVariantIndex].variantDetails = {};
              if (!newSizes[activeVariantIndex].variantDetails!.dimensions) newSizes[activeVariantIndex].variantDetails!.dimensions = {};
              const val = parseFloat(e.target.value);
              newSizes[activeVariantIndex].variantDetails!.dimensions!.height = isNaN(val) ? null : Math.max(0, val);
              setSizes(newSizes);
            }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsVariantDialogOpen(false)} variant="contained">تم</Button>
        </DialogActions>
      </Dialog>

      {/* Generic Error Dialog */}
      <Dialog open={errorDialog.isOpen} onClose={() => setErrorDialog({ isOpen: false, message: '' })} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>تنبيه</DialogTitle>
        <DialogContent>
          <Typography>{errorDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog({ isOpen: false, message: '' })} color="primary" variant="contained">
            حسناً
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
