import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import {
  ShoppingCart,
  Menu as MenuIcon,
  Palette,
  Home,
  Store,
  Dashboard,
  Person,
  Favorite,
  Email,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { cartStore } from '../utils/cartStore';
import logo from '../assets/logo.png'; // or logo.jpg if that's the file
import userService from '../utils/userService';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    // Load initial cart count
    setCartCount(cartStore.getCount());
    
    // Listen for cart updates
    const handleCartUpdate = (items) => {
      setCartCount(cartStore.getCount());
    };
    
    cartStore.addListener(handleCartUpdate);
    
    return () => {
      cartStore.removeListener(handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    setUser(userService.getCurrentUser());
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Remove wishlist from navItems for desktop (keep for mobile drawer only)
  const navItems = [
    { text: 'Home', path: '/', icon: <Home /> },
    { text: 'Products', path: '/products', icon: <Store /> },
    { text: 'Profile', path: '/profile', icon: <Person /> },
    { text: 'Contact', path: '/contact', icon: <Email /> },
    // Wishlist will be added to the drawer separately
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
        <img src={logo} alt="Art Smashers Logo" style={{ height: 48, marginRight: 0 }} />
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} component={Link} to={item.path}>
            {item.icon}
            <ListItemText primary={item.text} sx={{ ml: 1 }} />
          </ListItem>
        ))}
        <ListItem component={Link} to="/wishlist">
          <Favorite />
          <ListItemText primary="Wishlist" sx={{ ml: 1 }} />
        </ListItem>
        <ListItem component={Link} to="/cart">
          <ShoppingCart />
          <ListItemText primary="Cart" sx={{ ml: 1 }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ background: '#fff', boxShadow: 'none', color: '#111' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img src={logo} alt="Art Smashers Logo" style={{ height: 48, marginRight: 0 }} />
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navItems.filter(item => item.text !== 'Profile').map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: '#111',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <IconButton
            color="inherit"
            onClick={() => navigate('/cart')}
            sx={{ ml: 2 }}
          >
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => navigate('/wishlist')}
            sx={{ ml: 1 }}
          >
            <Favorite />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => navigate('/profile')}
            sx={{ ml: 1 }}
          >
            {user && user.profileImage ? (
              <Avatar src={user.profileImage} sx={{ width: 32, height: 32 }} />
            ) : (
              <Person />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar; 