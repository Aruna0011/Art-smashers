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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (!userService.validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!userService.validatePassword(formData.password)) {
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
      await registerUser(userData);
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
          <ellipse cx="48" cy="19" rx="2" ry="1.2" fill="#b3e5fc" fillOpacity="0.7"/>
          <ellipse cx="52" cy="19" rx="2" ry="1.2" fill="#b3e5fc" fillOpacity="0.7"/>
        </svg>
      </Box>
      {/* Bee SVG above/right of honey pot */}
      <Box sx={{ position: 'absolute', top: 10, right: 80, zIndex: 3 }}>
        <svg width="38" height="32" viewBox="0 0 38 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="19" cy="20" rx="12" ry="8" fill="#fff" stroke="#222" strokeWidth="1.2"/>
          <ellipse cx="19" cy="24" rx="10" ry="8" fill="#ffe066" stroke="#222" strokeWidth="1.2"/>
          <line x1="9" y1="24" x2="29" y2="24" stroke="#222" strokeWidth="1.2"/>
          <ellipse cx="13" cy="24" rx="2" ry="3" fill="#222"/>
          <ellipse cx="25" cy="24" rx="2" ry="3" fill="#222"/>
          <ellipse cx="15" cy="15" rx="4" ry="2.4" fill="#b3e5fc" fillOpacity="0.7"/>
          <ellipse cx="23" cy="15" rx="4" ry="2.4" fill="#b3e5fc" fillOpacity="0.7"/>
        </svg>
      </Box>
      {/* Snail SVG below/left of honey pot */}
      <Box sx={{ position: 'absolute', top: 80, right: 100, zIndex: 2 }}>
        <svg width="60" height="45" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <Card sx={{ width: 370, maxWidth: '95vw', boxShadow: 8, borderRadius: 3, p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>Create a new account</Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6a11cb', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="name"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><Person /></InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="email"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><Email /></InputAdornment>
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
              autoComplete="new-password"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><Lock /></InputAdornment>
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
            <FormControlLabel
              control={<Checkbox checked={isCampusStudent} onChange={e => setIsCampusStudent(e.target.checked)} color="primary" />}
              label={<Typography variant="body2">I am a campus student</Typography>}
              sx={{ mb: 1, mt: 1 }}
            />
            {isCampusStudent && (
              <Alert severity="info" sx={{ mb: 2, fontWeight: 500, textAlign: 'center' }}>
                Note: The 10% discount is available only for students of Government College for Women, Sector 14, Gurugram.
              </Alert>
            )}
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ background: 'linear-gradient(90deg, #6a11cb 0%, #a259e6 100%)', color: '#fff', fontWeight: 600, fontSize: 16, boxShadow: 2, py: 1.5, mb: 1, mt: 1 }}>
              Register
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Register; 