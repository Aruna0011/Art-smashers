import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Box, Card, CardContent, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { resetPassword } from '../utils/supabaseAuth';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Parse token and email from query params
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const email = params.get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!email || !token) {
      setError('Invalid or expired reset link. Please request a new one.');
      return;
    }
    setLoading(true);
    try {
      // In a real app, verify token on backend. Here, just update password for the user.
      const updated = await resetPassword(email, password, token);
      if (updated) {
        setSuccess('Password reset successful! You can now log in.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', justifyContent: 'center' }}>
        <Card sx={{ width: '100%', maxWidth: 400, boxShadow: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>Reset Password</Typography>
            <Typography variant="body2" align="center" sx={{ mb: 2 }}>
              Enter your new password below.
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                margin="normal"
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, backgroundColor: '#8B4513', '&:hover': { backgroundColor: '#A0522D' } }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Reset Password'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ResetPassword; 