'use client';

import { useState, useEffect } from 'react';
import { compressImage } from '@/lib/imageCompression';
import { TextField, Button, Box, FormControlLabel, Switch } from '@mui/material';

interface CategoryFormProps {
  initialData?: { name: string; imageUrl?: string; hidePrices?: boolean };
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

export default function CategoryForm({ initialData, onSubmit, isLoading }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [hidePrices, setHidePrices] = useState(false);

  useEffect(() => {
    if (initialData) {
      if (initialData.name) setName(initialData.name);
      if (initialData.imageUrl) setPreviewUrl(initialData.imageUrl);
      if (initialData.hidePrices !== undefined) setHidePrices(initialData.hidePrices);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('hidePrices', hidePrices.toString());
    if (imageFile) {
      formData.append('image', imageFile);
    }
    await onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        fullWidth
        margin="normal"
        id="name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Box sx={{ mt: 2, mb: 2 }}>
        <FormControlLabel
          control={<Switch checked={hidePrices} onChange={(e) => setHidePrices(e.target.checked)} />}
          label="إخفاء الأسعار (Hide Prices)"
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button component="label" variant="outlined">
          Upload Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Button>
        {previewUrl && (
          <Box sx={{ mt: 2, position: 'relative', width: '200px', height: '200px' }}>
            <img src={previewUrl} alt="Preview" style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '8px' }} />
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Category'}
        </Button>
      </Box>
    </Box>
  );
}
