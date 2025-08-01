import React, { useState } from 'react';
import { Box, Card, TextField, Button, Typography, Alert, InputAdornment, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock, Email } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../utils/supabaseAuth';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isCampusStudent, setIsCampusStudent] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 6 characters long');
      return;
    }
    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: '+91 00000 00000',
        address: 'Address not provided',
        isCampusStudent: isCampusStudent
      };
      await signUp(userData);
      setError('');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTogglePassword = () => setShowPassword((show) => !show);

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', background: 'radial-gradient(circle at 70% 20%, #b39ddb 0%, #b39ddb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* Decorative Snail SVG (top center) */}
      <Box sx={{ position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 1, display: { xs: 'none', sm: 'none', md: 'block' } }}>
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
      {/* Decorative Honey Pot with Bee SVG (top right) */}
      <Box sx={{ position: 'absolute', top: 36, right: 48, zIndex: 1, display: { xs: 'none', sm: 'none', md: 'block' } }}>
        <svg width="64" height="60" viewBox="0 0 64 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Honey pot */}
          <ellipse cx="32" cy="48" rx="18" ry="10" fill="#e0a800" stroke="#b8860b" strokeWidth="2"/>
          <rect x="18" y="32" width="28" height="18" rx="9" fill="#ffe066" stroke="#b8860b" strokeWidth="2"/>
          <ellipse cx="32" cy="32" rx="14" ry="6" fill="#ffe066" stroke="#b8860b" strokeWidth="2"/>
          {/* Honey drip */}
          <path d="M32 38 Q34 44 32 48 Q30 44 32 38" fill="#ffd700" stroke="#b8860b" strokeWidth="1"/>
          {/* Bee */}
          <ellipse cx="50" cy="20" rx="6" ry="4" fill="#fff" stroke="#222" strokeWidth="1.2"/>
          <ellipse cx="50" cy="24" rx="5" ry="4" fill="#ffe066" stroke="#222" strokeWidth="1.2"/>
          <line x1="45" y1="24" x2="55" y2="24" stroke="#222" strokeWidth="1.2"/>
          <ellipse cx="47" cy="24" rx="1" ry="1.5" fill="#222"/>
          <ellipse cx="53" cy="24" rx="1" ry="1.5" fill="#222"/>
          {/* Bee wings */}
          <ellipse cx="48" cy="18" rx="3" ry="2" fill="#fff" stroke="#222" strokeWidth="0.8"/>
          <ellipse cx="52" cy="18" rx="3" ry="2" fill="#fff" stroke="#222" strokeWidth="0.8"/>
        </svg>
      </Box>
      {/* Main Register Card */}
      <Card sx={{ 
        maxWidth: 450, 
        width: '90%', 
        borderRadius: 4, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255,255,255,0.95)',
        zIndex: 2
      }}>
        <Box sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#6a11cb', mb: 1 }}>
              Join Art Smashers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your account to start exploring amazing artworks
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Register Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#6a11cb' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#6a11cb' }} />
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
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#6a11cb' }} />
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

            {/* Campus Student Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCampusStudent}
                  onChange={(e) => setIsCampusStudent(e.target.checked)}
                  sx={{ '&.Mui-checked': { color: '#6a11cb' } }}
                />
              }
              label="I am a campus student"
              sx={{ mb: 3 }}
            />

            {/* Register Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                backgroundColor: '#6a11cb',
                '&:hover': { backgroundColor: '#5a0cb8' },
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              Create Account
            </Button>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#6a11cb', textDecoration: 'none', fontWeight: 600 }}>
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Register; 