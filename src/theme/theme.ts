import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: {
      main: '#1B3A4B', // Deep Navy - كحلي داكن أساسي
      light: '#2E5468',
      dark: '#0F2530',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2E8B9A', // Teal - تركواز
      light: '#4FA8B6',
      dark: '#1F6873',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981', // Crisp modern green
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: '#F7F9FA', // Very clean, soft off-white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1B3A4B',
      secondary: '#5A6B72',
    },
  },
  typography: {
    fontFamily: '"Almarai", "Cairo", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, color: '#1B3A4B' },
    h2: { fontWeight: 700, color: '#1B3A4B' },
    h3: { fontWeight: 700, color: '#1B3A4B' },
    h4: { fontWeight: 700, color: '#1B3A4B', letterSpacing: '-0.5px' },
    h5: { fontWeight: 600, color: '#1B3A4B' },
    h6: { fontWeight: 600, color: '#1B3A4B' },
    subtitle1: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(27,58,75,0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 10px 40px rgba(27,58,75,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 20px 40px rgba(27,58,75,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid rgba(27,58,75,0.06)',
          boxShadow: '4px 0 24px rgba(27,58,75,0.04)',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
