import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Grid, Alert, Card } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';
import contactMessageStore from '../utils/contactMessageStore';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    contactMessageStore.addMessage(form);
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
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
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>Contact Us</Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
        
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              required
              type="email"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Message"
              name="message"
              value={form.message}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              minRows={4}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ background: 'linear-gradient(90deg, #b39ddb 0%, #b39ddb 100%)', color: '#fff', fontWeight: 600, fontSize: 16, boxShadow: 2, py: 1.5, mb: 1, mt: 1 }}
            >
              Send Message
            </Button>
            {submitted && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Thank you for contacting us! We'll get back to you soon.
              </Alert>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Contact; 