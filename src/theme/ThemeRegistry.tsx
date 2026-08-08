'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import theme from './theme';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            'input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
            'input[type=number]': {
              MozAppearance: 'textfield',
            },
          }}
        />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
