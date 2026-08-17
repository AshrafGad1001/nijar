'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Visual Breadcrumbs */}
      <Box
        component="nav"
        aria-label="مسار التنقل"
        dir="rtl"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
          mb: { xs: 2, md: 3 },
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              {isLast ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#0F172A',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  {item.label}
                </Typography>
              ) : (
                <Link
                  href={item.href || '/'}
                  style={{ textDecoration: 'none' }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#94A3B8',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      transition: 'color 0.2s ease',
                      '&:hover': { color: '#0F172A' },
                    }}
                  >
                    {item.label}
                  </Typography>
                </Link>
              )}

              {/* Separator */}
              {!isLast && (
                <Typography
                  variant="body2"
                  sx={{ color: '#CBD5E1', fontSize: '0.75rem', mx: 0.5, userSelect: 'none' }}
                >
                  ‹
                </Typography>
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </>
  );
}
