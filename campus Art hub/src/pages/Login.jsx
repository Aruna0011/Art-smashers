import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, InputAdornment, IconButton, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock, Email } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import emailService from '../utils/emailService';
import userService from '../utils/userService';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();
    try {
      const user = userService.loginUser(trimmedEmail, trimmedPassword);
      setError('');
      setTimeout(() => {
        if (user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      }, 1000);
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
      const user = userService.checkEmailExists(trimmedForgotEmail);
      if (user) {
        const resetLink = `https://your-art-hub.com/reset-password?token=demo123&email=${trimmedForgotEmail}`;
        await emailService.sendPasswordResetEmail(trimmedForgotEmail, user.name, resetLink);
        setForgotMessage('✅ Password reset email sent successfully! Check your inbox and spam folder.');
      } else {
        setForgotMessage('❌ Email not found in our system. Please check your email address or register a new account.');
      }
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
    <Box sx={{ minHeight: '100vh', width: '100vw', background: 'radial-gradient(circle at 70% 20%, #a259e6 0%, #6a11cb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
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
      {/* Decorative Honey Pot with Bee SVG */}
      <Box sx={{ position: 'absolute', top: 36, right: 48, zIndex: 1 }}>
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
      <Card sx={{ width: 370, maxWidth: '95vw', boxShadow: 8, borderRadius: 3, p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>Login to your account</Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6a11cb', fontWeight: 600, textDecoration: 'none' }}>Sign Up Free!</Link>
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Email address"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="email"
              sx={{ mb: 2 }}
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
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} sx={{ p: 0.5 }} />}
                label={<Typography variant="body2">Remember me</Typography>}
                sx={{ m: 0 }}
              />
              <Button onClick={() => setForgotPasswordOpen(true)} sx={{ color: '#6a11cb', textTransform: 'none', fontSize: 14, p: 0, minWidth: 0 }}>
                Forgot password?
              </Button>
            </Box>
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ background: 'linear-gradient(90deg, #6a11cb 0%, #a259e6 100%)', color: '#fff', fontWeight: 600, fontSize: 16, boxShadow: 2, py: 1.5, mb: 1, mt: 1 }}>
              Login with email
            </Button>
          </Box>
        </Box>
      </Card>
      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', color: '#8B4513' }}>
          Forgot Password
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          {forgotMessage && (
            <Alert severity={forgotMessage.includes('sent') ? 'success' : 'error'} sx={{ mb: 2 }}>
              {forgotMessage}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            margin="normal"
            required
            placeholder="Enter your email address"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setForgotPasswordOpen(false)} color="inherit" disabled={isSendingEmail}>
            Cancel
          </Button>
          <Button 
            onClick={handleForgotPassword} 
            variant="contained"
            disabled={isSendingEmail}
            sx={{ backgroundColor: '#8B4513', '&:hover': { backgroundColor: '#A0522D' } }}
          >
            {isSendingEmail ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login; 