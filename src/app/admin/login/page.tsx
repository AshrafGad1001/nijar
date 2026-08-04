'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Container, Box, Paper, Typography, TextField, Button, Alert, InputAdornment, IconButton, CircularProgress, Avatar } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple clicks
    setError('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('nijar_token', data.token);
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f7f9', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Decor */}
      <Box sx={{ position: 'absolute', top: '-10%', left: '-5%', width: '30vw', height: '30vw', borderRadius: '50%', bgcolor: 'rgba(10, 41, 71, 0.03)', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '40vw', height: '40vw', borderRadius: '50%', bgcolor: 'rgba(10, 41, 71, 0.03)', zIndex: 0 }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 64, height: 64, mb: 2, boxShadow: '0 8px 16px rgba(10, 41, 71, 0.2)' }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 900, color: 'primary.main', mb: 1, letterSpacing: '-0.5px' }}>
              Nijar
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
              Admin Dashboard Login
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontWeight: 500 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nijar.com"
              required
              autoComplete="email"
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              margin="normal"
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
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
                py: 1.5, 
                borderRadius: 2.5, 
                fontSize: '1.1rem', 
                fontWeight: 800,
                textTransform: 'none',
                boxShadow: '0 8px 20px rgba(10, 41, 71, 0.25)',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 24px rgba(10, 41, 71, 0.3)',
                }
              }}
            >
              {isLoading ? <CircularProgress size={26} color="inherit" /> : 'Sign In'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
