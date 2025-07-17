import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Divider,
  Chip,
  Paper,
  Alert,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  ArrowBack,
  LocalShipping,
  Payment,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cartStore } from '../utils/cartStore';
import { productStore } from '../utils/productStore';
import userService from '../utils/userService';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Always sync cart items with latest product stock
    const items = cartStore.loadFromStorage();
    // For each item, if quantity > product stock, reduce to stock
    const updatedItems = items.map(item => {
      const product = productStore.getProductById(item.id);
      const stock = product ? product.stock : 1;
      if (item.quantity > stock) {
        cartStore.updateQuantity(item.id, stock);
        return { ...item, quantity: stock };
      }
      return item;
    });
    setCartItems(updatedItems);

    // Listen for cart updates
    const handleCartUpdate = (items) => {
      // Same logic: auto-reduce if quantity > stock
      const updated = items.map(item => {
        const product = productStore.getProductById(item.id);
        const stock = product ? product.stock : 1;
        if (item.quantity > stock) {
          cartStore.updateQuantity(item.id, stock);
          return { ...item, quantity: stock };
        }
        return item;
      });
      setCartItems(updated);
    };
    cartStore.addListener(handleCartUpdate);
    return () => {
      cartStore.removeListener(handleCartUpdate);
    };
  }, []);

  const updateQuantity = (id, newQuantity) => {
    // Get the product's stock
    const product = productStore.getProductById(id);
    const stock = product ? product.stock : 1;
    if (newQuantity < 1) return;
    if (newQuantity > stock) return;
    cartStore.updateQuantity(id, newQuantity);
  };

  const removeItem = (id) => {
    cartStore.removeFromCart(id);
    toast.success('Item removed from cart');
  };

  const currentUser = userService.getCurrentUser();
  const isCampusStudent = currentUser && currentUser.isCampusStudent;

  // Calculate discounted subtotal if campus student
  const subtotal = cartStore.getTotal();
  const discount = isCampusStudent ? Math.round(subtotal * 0.10) : 0;
  const discountedSubtotal = subtotal - discount;
  const deliveryFee = subtotal > 0 ? 0 : 0; // Free delivery
  const total = discountedSubtotal + deliveryFee;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added any artworks to your cart yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/products"
            sx={{
              backgroundColor: '#8B4513',
              '&:hover': { backgroundColor: '#A0522D' },
            }}
          >
            Start Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4">
          Shopping Cart ({cartItems.length} items)
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
          <Typography variant="h6" gutterBottom>
            Cart Items
          </Typography>
          {cartItems.map((item) => {
            const originalPrice = item.price;
            const discountedPrice = isCampusStudent ? Math.round(originalPrice * 0.9) : originalPrice;
            return (
              <Card key={item.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <CardMedia
                        component="img"
                        height="120"
                        image={item.image && !item.image.startsWith('http') ? new URL(`../assets/${item.image}`, import.meta.url).href : item.image}
                        alt={item.name}
                        sx={{
                          borderRadius: 1,
                          width: 120,
                          height: 120,
                          objectFit: 'contain',
                          background: '#f8f8fa',
                          border: '1px solid #eee',
                          p: 1,
                          display: 'block',
                          mx: 'auto',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>
                        {item.name}
                      </Typography>
                      {item.artist && (typeof item.artist === 'string' ? (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          by {item.artist}
                        </Typography>
                      ) : (item.artist && item.artist.name ? (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          by {item.artist.name}
                        </Typography>
                      ) : null))}
                      {isCampusStudent ? (
                        <>
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            ₹{originalPrice.toLocaleString()}
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            ₹{discountedPrice.toLocaleString()} <Chip label="Campus 10% Off" color="success" size="small" sx={{ ml: 1 }} />
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="h6" color="primary">
                          ₹{originalPrice.toLocaleString()}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Remove />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          onChange={(e) => {
                            // Get the product's stock
                            const product = productStore.getProductById(item.id);
                            const stock = product ? product.stock : 1;
                            let val = parseInt(e.target.value) || 1;
                            if (val < 1) val = 1;
                            if (val > stock) val = stock;
                            updateQuantity(item.id, val);
                          }}
                          inputProps={{ min: 1, max: (productStore.getProductById(item.id)?.stock || 1), style: { textAlign: 'center' } }}
                          sx={{ width: 60 }}
                          size="small"
                        />
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (productStore.getProductById(item.id)?.stock || 1)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => removeItem(item.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} lg={4}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography sx={isCampusStudent ? { textDecoration: 'line-through', color: '#888' } : {}}>
                  ₹{subtotal.toLocaleString()}
                </Typography>
              </Box>
              {isCampusStudent && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Campus Discount (10%)</Typography>
                  <Typography color="success.main">-₹{discount.toLocaleString()}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Delivery Fee</Typography>
                <Typography color="success.main">
                  {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  ₹{total.toLocaleString()}
                </Typography>
              </Box>
            </Box>
            {isCampusStudent && (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Campus Student Discount Applied! Enjoy 10% off and free delivery within campus.
                </Typography>
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Payment />}
              onClick={handleCheckout}
              sx={{
                backgroundColor: '#8B4513',
                '&:hover': { backgroundColor: '#A0522D' },
                mb: 2,
              }}
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="outlined"
              fullWidth
              component={Link}
              to="/products"
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 