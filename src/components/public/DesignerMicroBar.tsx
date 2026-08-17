'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

interface DesignerMicroBarProps {
  adminName?: string;
  phone?: string;
}

export default function DesignerMicroBar({ adminName, phone }: DesignerMicroBarProps) {
  // Fallback: If either name or phone is missing, don't render the bar at all to save space
  if (!adminName || !phone) return null;

  return null;
}
