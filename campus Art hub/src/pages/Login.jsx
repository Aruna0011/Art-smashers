import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, InputAdornment, IconButton, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock, Email } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import emailService from '../utils/emailService';
import { signIn } from '../utils/supabaseAuth';
import logo from '../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();
    try {
      const result = await signIn({ email: trimmedEmail, password: trimmedPassword });
      setError('');
      if (result && result.user) {
        // Check if user is admin (stored in user metadata or local storage)
        const isAdmin = result.user.isAdmin || result.user.user_metadata?.isAdmin;
        if (isAdmin) {
          localStorage.setItem('adminAuthenticated', 'true');
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTogglePassword = () => setShowPassword((show) => !show);

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotMessage('Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setForgotMessage('Please enter a valid email address');
      return;
    }
    setIsSendingEmail(true);
    setForgotMessage('');
    try {
      const trimmedForgotEmail = forgotEmail.trim();
      const resetLink = `${window.location.origin}/reset-password?token=demo123&email=${trimmedForgotEmail}`;
      await emailService.sendPasswordResetEmail(trimmedForgotEmail, 'Demo User', resetLink);
      setForgotMessage('✅ Password reset email sent successfully! Check your inbox and spam folder.');
    } catch (error) {
      setForgotMessage('❌ Failed to send email. Please try again later or contact support.');
    } finally {
      setIsSendingEmail(false);
      setTimeout(() => {
        setForgotPasswordOpen(false);
        setForgotEmail('');
        setForgotMessage('');
      }, 5000);
    }
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
      {/* Main Login Card */}
      <Card sx={{ 
        maxWidth: 400, 
        width: '90%', 
        borderRadius: 4, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255,255,255,0.95)',
        zIndex: 2
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <img src={logo} alt="Art Smashers Logo" style={{ height: 60, marginBottom: 16 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#6a11cb', mb: 1 }}>
              Welcome Back!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your Art Smashers account
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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

            {/* Remember Me & Forgot Password */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{ '&.Mui-checked': { color: '#6a11cb' } }}
                  />
                }
                label="Remember me"
              />
              <Button
                onClick={() => setForgotPasswordOpen(true)}
                sx={{ color: '#6a11cb', textTransform: 'none' }}
              >
                Forgot Password?
              </Button>
            </Box>

            {/* Login Button */}
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
              Sign In
            </Button>

            {/* Register Link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#6a11cb', textDecoration: 'none', fontWeight: 600 }}>
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', color: '#6a11cb', fontWeight: 600 }}>
          Reset Your Password
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          {forgotMessage && (
            <Alert severity={forgotMessage.includes('✅') ? 'success' : 'error'} sx={{ mb: 2 }}>
              {forgotMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setForgotPasswordOpen(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            onClick={handleForgotPassword}
            variant="contained"
            disabled={isSendingEmail}
            sx={{
              backgroundColor: '#6a11cb',
              '&:hover': { backgroundColor: '#5a0cb8' },
              textTransform: 'none'
            }}
          >
            {isSendingEmail ? <CircularProgress size={20} color="inherit" /> : 'Send Reset Link'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login; 