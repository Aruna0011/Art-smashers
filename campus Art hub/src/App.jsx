import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import ScrollToTop from './components/ScrollToTop';
import ResetPassword from './pages/ResetPassword';
import Contact from './pages/Contact';
import UserProtectedRoute from './components/UserProtectedRoute';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea', // Beautiful purple-blue
    },
    secondary: {
      main: '#764ba2', // Deep purple
    },
    background: {
      default: '#f8f9ff', // Light blue tint
    },
    success: {
      main: '#4ECDC4', // Teal
    },
    warning: {
      main: '#FF6B6B', // Coral
    },
    info: {
      main: '#45B7D1', // Sky blue
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function AppContent() {
  const location = useLocation();
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* All other routes are protected for registered users */}
              <Route path="/products" element={
                <UserProtectedRoute>
                  <Products />
                </UserProtectedRoute>
              } />
              <Route path="/product/:id" element={
                <UserProtectedRoute>
                  <ProductDetail />
                </UserProtectedRoute>
              } />
              <Route path="/cart" element={
                <UserProtectedRoute>
                  <Cart />
                </UserProtectedRoute>
              } />
              <Route path="/checkout" element={
                <UserProtectedRoute>
                  <Checkout />
                </UserProtectedRoute>
              } />
              <Route path="/profile" element={
                <UserProtectedRoute>
                  <UserProfile />
                </UserProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <UserProtectedRoute>
                  <Wishlist />
                </UserProtectedRoute>
              } />
              <Route path="/contact" element={
                <UserProtectedRoute>
                  <Contact />
                </UserProtectedRoute>
              } />
            </Routes>
          </Box>
          {location.pathname !== '/checkout' && <Footer />}
          <ScrollToTop />
        </Box>
      );
    }

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

export default App;
