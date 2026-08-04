'use client';

import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import WorkCard from './WorkCard';
import WorkDetailDialog from './WorkDetailDialog';

interface WorkItem {
  _id: string;
  name: string;
  description: string;
  price: number | null;
  hasSizes?: boolean;
  sizes?: { name: string; price: number }[];
  image?: { url: string; publicId: string };
  gallery?: { url: string; publicId: string }[];
}

interface CategorySectionProps {
  id: string;
  name: string;
  image?: { url: string; publicId: string };
  items: WorkItem[];
}

export default function CategorySection({ id, name, items }: CategorySectionProps) {
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [initialSizeIndex, setInitialSizeIndex] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleCardClick = (item: WorkItem, sizeIndex: number) => {
    setSelectedItem(item);
    setInitialSizeIndex(sizeIndex);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    // Add small delay before clearing item to allow exit animation to finish smoothly
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <Box id={id} className="scrollspy-section" sx={{ mb: 6, pt: 4, mt: -4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4, mt: 2 }}>
        <Box sx={{ borderLeft: '4px solid #2E8B9A', pl: 2 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 900, color: '#1B3A4B', m: 0 }}>
            {name}
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={3}>
        {items.map(item => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id}>
            <WorkCard 
              name={item.name}
              description={item.description}
              price={item.price}
              hasSizes={item.hasSizes}
              sizes={item.sizes}
              image={item.image}
              gallery={item.gallery}
              onClick={(sizeIndex) => handleCardClick(item, sizeIndex)}
            />
          </Grid>
        ))}
      </Grid>

      <WorkDetailDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        item={selectedItem}
        initialSizeIndex={initialSizeIndex}
      />
    </Box>
  );
}
