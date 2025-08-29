import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signIn } from '../utils/supabaseAuth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const trimmedEmail = formData.email.trim();
      const trimmedPassword = formData.password.trim();
      
      const result = await signIn({ email: trimmedEmail, password: trimmedPassword });
      
      console.log('Login result:', result);
      
      if (result && result.user) {
        console.log('User logged in:', result.user);
        console.log('Is admin?', result.user.is_admin);
        
        // Force navigate to admin regardless of admin status
        toast.success('Login successful! Welcome to Admin Panel');
        setTimeout(() => {
          navigate('/admin');
        }, 100);
      } else if (result && result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        setError('Invalid email or password');
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
      toast.error(error.message || 'Login failed. Please try again.');
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', background: 'radial-gradient(circle at 70% 20%, #b39ddb 0%, #b39ddb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* Decorative Snail SVG */}
      <Box sx={{ position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="40" cy="40" rx="24" ry="16" fill="#f7e06e" stroke="#bfa900" strokeWidth="2"/>
          <circle cx="56" cy="40" r="12" fill="#f7b36e" stroke="#bfa900" strokeWidth="2"/>
          <circle cx="62" cy="32" r="4" fill="#fff" stroke="#bfa900" strokeWidth="1.5"/>
          <circle cx="62" cy="32" r="1.5" fill="#333"/>
          <rect x="60" y="20" width="2" height="10" rx="1" fill="#bfa900"/>
          <rect x="66" y="20" width="2" height="10" rx="1" fill="#bfa900"/>
          <circle cx="61" cy="20" r="1.5" fill="#333"/>
          <circle cx="67" cy="20" r="1.5" fill="#333"/>
        </svg>
      </Box>
      {/* Decorative Pastel Circles */}
      <Box sx={{ position: 'absolute', top: 80, left: 40, zIndex: 0 }}>
        <svg width="48" height="48"><circle cx="24" cy="24" r="24" fill="#b39ddb" fillOpacity="0.5"/></svg>
      </Box>
      <Box sx={{ position: 'absolute', bottom: 60, right: 60, zIndex: 0 }}>
        <svg width="36" height="36"><circle cx="18" cy="18" r="18" fill="#81d4fa" fillOpacity="0.5"/></svg>
      </Box>
      <Box sx={{ position: 'absolute', bottom: 120, left: 80, zIndex: 0 }}>
        <svg width="32" height="32"><circle cx="16" cy="16" r="16" fill="#aed581" fillOpacity="0.5"/></svg>
      </Box>
      {/* Decorative Wavy Line */}
      <Box sx={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <svg width="180" height="32" viewBox="0 0 180 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 16 Q 30 0, 60 16 T 120 16 T 180 16" stroke="#fff59d" strokeWidth="4" fill="none" opacity="0.5"/>
        </svg>
      </Box>
      <Card sx={{ width: 370, maxWidth: '95vw', boxShadow: 8, borderRadius: 3, p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>Admin Login</Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
            Enter your credentials to access the admin panel
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="email"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="current-password"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(90deg, #b39ddb 0%, #b39ddb 100%)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                boxShadow: 2,
                py: 1.5,
                mb: 1,
                mt: 1,
              }}
            >
              Login to Admin Panel
            </Button>
          </Box>
        </Box>
      </Card>
      {/* Back to Home */}
      <Box sx={{ textAlign: 'center', mt: 3, position: 'absolute', left: 0, right: 0, bottom: 24 }}>
        <Button
          variant="text"
          onClick={() => navigate('/')}
          sx={{ color: '#8B4513' }}
        >
          ← Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default AdminLogin; 