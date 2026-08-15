'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Container, Box, Paper, Typography, TextField, Button, Alert, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return; 
    setError('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('nijar_token', data.token);
      router.replace('/admin/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: '#F8FAFC', // Premium light background
        backgroundImage: 'radial-gradient(circle at 50% 0%, #FFFFFF 0%, #F1F5F9 100%)',
        position: 'relative', 
        overflow: 'hidden',
        px: 2
      }}
    >
      
      {/* Premium Background Decor */}
      <Box sx={{ position: 'absolute', top: '-20%', left: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)', zIndex: 0, filter: 'blur(40px)' }} />
      <Box sx={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(27, 58, 75, 0.05) 0%, transparent 70%)', zIndex: 0, filter: 'blur(60px)' }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1, p: 0 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, sm: 5 }, 
            borderRadius: { xs: 4, sm: 6 }, 
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 1)',
            boxShadow: '0 20px 50px rgba(10, 25, 41, 0.06), 0 0 0 1px rgba(10, 25, 41, 0.02)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Subtle gold line at the top */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5, mt: 1 }}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ 
                height: '75px', 
                marginBottom: '16px',
                filter: 'drop-shadow(0px 8px 16px rgba(10, 25, 41, 0.15))' 
              }} 
            />
            <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 600, letterSpacing: '0.5px' }}>
              تسجيل الدخول للوحة التحكم
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              variant="filled"
              sx={{ 
                mb: 4, 
                borderRadius: 3, 
                fontWeight: 600,
                bgcolor: '#FEF2F2',
                color: '#B91C1C',
                border: '1px solid #FCA5A5',
                '& .MuiAlert-icon': { color: '#EF4444' }
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} dir="rtl">
            <Typography sx={{ color: '#334155', mb: 1, ml: 1, fontWeight: 700, fontSize: '0.9rem' }}>البريد الإلكتروني</Typography>
            <TextField
              fullWidth
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
              sx={{ 
                mb: 3, 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 3,
                  bgcolor: '#F8FAFC',
                  color: '#0F172A',
                  transition: 'all 0.3s ease',
                  '& fieldset': { borderColor: '#E2E8F0' },
                  '&:hover fieldset': { borderColor: '#CBD5E1' },
                  '&.Mui-focused fieldset': { borderColor: '#1B3A4B', borderWidth: '2px' },
                  '&.Mui-focused': { bgcolor: '#FFFFFF', boxShadow: '0 4px 12px rgba(27, 58, 75, 0.08)' }
                },
                '& .MuiInputBase-input': {
                  py: 1.8,
                  px: 2,
                }
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ ml: 1, mr: -1 }}>
                      <EmailOutlinedIcon sx={{ color: '#94A3B8' }} />
                    </InputAdornment>
                  )
                }
              }}
            />

            <Typography sx={{ color: '#334155', mb: 1, ml: 1, fontWeight: 700, fontSize: '0.9rem' }}>كلمة المرور</Typography>
            <TextField
              fullWidth
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              sx={{ 
                mb: 5, 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 3,
                  bgcolor: '#F8FAFC',
                  color: '#0F172A',
                  transition: 'all 0.3s ease',
                  '& fieldset': { borderColor: '#E2E8F0' },
                  '&:hover fieldset': { borderColor: '#CBD5E1' },
                  '&.Mui-focused fieldset': { borderColor: '#1B3A4B', borderWidth: '2px' },
                  '&.Mui-focused': { bgcolor: '#FFFFFF', boxShadow: '0 4px 12px rgba(27, 58, 75, 0.08)' }
                },
                '& .MuiInputBase-input': {
                  py: 1.8,
                  px: 2,
                  letterSpacing: showPassword ? 'normal' : '0.2em'
                }
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ ml: 1, mr: -1 }}>
                      <HttpsOutlinedIcon sx={{ color: '#94A3B8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: '#94A3B8', mr: 0.5, '&:hover': { color: '#1B3A4B', bgcolor: 'rgba(27, 58, 75, 0.05)' } }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ 
                py: 1.8, 
                borderRadius: 3, 
                fontSize: '1.15rem', 
                fontWeight: 800,
                letterSpacing: '0.5px',
                bgcolor: '#1B3A4B',
                color: '#FFFFFF',
                boxShadow: '0 8px 20px rgba(27, 58, 75, 0.25)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: '#122633',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 25px rgba(27, 58, 75, 0.35)',
                },
                '&:disabled': {
                  bgcolor: '#E2E8F0',
                  color: '#94A3B8',
                }
              }}
            >
              {isLoading ? <CircularProgress size={28} sx={{ color: '#FFFFFF' }} /> : 'تسجيل الدخول'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
