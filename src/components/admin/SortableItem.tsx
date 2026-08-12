'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, IconButton } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export default function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto' as const,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Paper
        elevation={0}
        sx={{ 
          p: { xs: 1.5, md: 2 }, 
          mb: { xs: 1.5, md: 2 }, 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, md: 2 },
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'rgba(27, 58, 75, 0.05)',
          boxShadow: isDragging ? '0 24px 48px rgba(27,58,75,0.15)' : '0 10px 40px -10px rgba(27, 58, 75, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: isDragging ? 'none' : 'translateY(-2px)',
            boxShadow: isDragging ? '0 24px 48px rgba(27,58,75,0.15)' : '0 16px 40px -8px rgba(27, 58, 75, 0.12)'
          },
          bgcolor: '#fff',
          overflow: 'hidden'
        }}
      >
        <IconButton
          {...attributes}
          {...listeners}
          sx={{ cursor: 'grab', color: 'text.disabled', '&:hover': { color: 'text.primary', bgcolor: 'rgba(0,0,0,0.04)' } }}
          aria-label="Drag to reorder"
          size="small"
        >
          <DragIndicatorIcon />
        </IconButton>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {children}
        </div>
      </Paper>
    </div>
  );
}
