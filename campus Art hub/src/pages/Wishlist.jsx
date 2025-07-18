import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, IconButton } from '@mui/material';
import { ShoppingCart, DeleteOutline, FavoriteBorder } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getWishlist, addToWishlist, removeFromWishlist } from '../utils/wishlistApi';

const Wishlist = () => {
  const [wishlist, setWishlistState] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const items = await getWishlist(user.id);
        setWishlistState(items);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      await removeFromWishlist(user.id, id);
      const updated = wishlist.filter(item => item.id !== id);
      setWishlistState(updated);
    }
  };

  const handleAddToCart = (item) => {
    // You can implement your cart logic here
    // For now, just show an alert
    alert(`Added ${item.name} to cart!`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#7c4dff', textAlign: 'center', letterSpacing: 1 }}>
        <FavoriteBorder sx={{ mr: 1, fontSize: 32, verticalAlign: 'middle' }} />
        Your Wishlist
      </Typography>
      {wishlist.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <img src={new URL('../assets/empty_wishlist.png', import.meta.url).href} alt="Empty Wishlist" style={{ width: 180, marginBottom: 24, opacity: 0.7 }} />
          <Typography variant="h6" sx={{ color: '#888', mb: 1 }}>
            No items in your wishlist yet!
          </Typography>
          <Typography variant="body1" sx={{ color: '#aaa' }}>
            Browse products and add your favorites to see them here.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {wishlist.map((item) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: '0 2px 8px rgba(124,77,255,0.08)', overflow: 'hidden', background: '#fff' }}>
                <CardMedia
                  component="img"
                  image={item.image && !item.image.startsWith('http') ? new URL(`../assets/${item.image}`, import.meta.url).href : item.image}
                  alt={item.name}
                  sx={{ height: 120, objectFit: 'contain', background: '#f5f5f5' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem', mb: 1, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7c4dff', fontWeight: 700, mb: 1, fontSize: '0.9rem' }}>
                    ₹{item.price}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ShoppingCart />}
                      sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', borderColor: '#7c4dff', color: '#7c4dff', fontSize: '0.7rem', py: 0.5 }}
                      onClick={() => handleAddToCart(item)}
                    >
                      Add
                    </Button>
                    <IconButton size="small" color="error" onClick={() => handleRemove(item.id)}>
                      <DeleteOutline sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Wishlist; 