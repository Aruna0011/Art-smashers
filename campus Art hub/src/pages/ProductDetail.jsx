import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Rating,
  TextField,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  IconButton,
  CardMedia,
  Dialog,
  DialogContent,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Favorite,
  Share,
  Star,
  Person,
  Palette,
  CalendarToday,
  LocationOn,
  ArrowBack,
  FavoriteBorder,
  Close,
  ArrowBackIos,
  ArrowForwardIos,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cartStore } from '../utils/cartStore';
import productStore from '../utils/productStore';

// Helper to get the correct image src
const getImageSrc = (img) => {
  if (!img) return '';
  if (img.startsWith('data:') || img.startsWith('http')) return img;
  try {
    return new URL(`../assets/${img}`, import.meta.url).href;
  } catch {
    return img;
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % galleryImages.length);

  useEffect(() => {
    // Wishlist functionality handled in-memory
  }, []);

  useEffect(() => {
    console.log('ProductDetail: Loading product with id:', id);
    const prod = productStore.getProductById(id);
    console.log('ProductDetail: Found product:', prod);
    setProduct(prod);
  }, [id]);

  useEffect(() => {
    if (product) {
      // Use product.images array if available, otherwise fallback to [product.image]
      const images = product.images && product.images.length > 0 ? product.images : [product.image];
      setGalleryImages(images);
      setMainImage(images[0]);
    }
  }, [product]);

  const openModal = (idx) => {
    setModalIndex(idx);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  const prevImage = () => setModalIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  const nextImage = () => setModalIndex((prev) => (prev + 1) % galleryImages.length);

  // Keyboard navigation for modal
  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, galleryImages.length]);

  // Remove hardcoded images from enhancedProduct
  const enhancedProduct = product ? {
    ...product,
    originalPrice: product.price * 1.2, // 20% markup for original price
    specifications: {
      dimensions: '24" x 36" (60cm x 90cm)',
      medium: 'Acrylic on Canvas',
      style: 'Abstract Expressionism',
      year: '2024',
      condition: 'New',
      frame: 'Unframed',
    },
    features: [
      'Hand-painted original artwork',
      'Premium quality canvas',
      'UV resistant acrylic paints',
      'Ready to hang',
      'Certificate of authenticity',
    ],
    inStock: product.stock > 0,
    deliveryTime: '3-5 business days',
    artist: {
      name: 'Campus Artist',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      location: 'University Campus',
      bio: 'A talented artist from our campus community, creating unique and beautiful artworks.',
      joinedDate: '2023',
    },
  } : null;

  const handleAddToCart = () => {
    cartStore.addToCart(enhancedProduct, quantity);
    toast.success(`Added ${quantity} ${enhancedProduct.name} to cart!`);
  };

  const handleWishlist = () => {
    toast.success('Added to wishlist!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: enhancedProduct.name,
        text: `Check out this amazing artwork: ${enhancedProduct.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const isWishlisted = (product) => wishlist.some(item => item.id === product.id);
  const handleAddToWishlist = (product) => {
    let updated = [];
    if (!isWishlisted(product)) {
      updated = [...wishlist, product];
    } else {
      updated = wishlist.filter(item => item.id !== product.id);
    }
    setWishlist(updated);
    // REMOVE localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>
      {!product ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" gutterBottom>
            Product Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            The product you're looking for doesn't exist.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{ mr: 2 }}
          >
            Back to Products
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={4}>
            {/* Product Images */}
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', width: '100%', height: '400px', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden' }}>
                <img
                  src={getImageSrc(galleryImages[currentIndex])}
                  alt={enhancedProduct.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                    display: 'block'
                  }}
                />
                {galleryImages.length > 1 && (
                  <>
                    <IconButton onClick={goToPrev} sx={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', background: '#fff', zIndex: 2 }}>
                      <ArrowBackIos fontSize="small" />
                    </IconButton>
                    <IconButton onClick={goToNext} sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', background: '#fff', zIndex: 2 }}>
                      <ArrowForwardIos fontSize="small" />
                    </IconButton>
                  </>
                )}
                {/* Dots indicator */}
                {galleryImages.length > 1 && (
                  <Box sx={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
                    {galleryImages.map((_, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: idx === currentIndex ? '#8B4513' : '#ccc',
                          transition: 'background 0.2s'
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Product Info */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                  {enhancedProduct.name}
                </Typography>
                <IconButton
                  sx={{ ml: 1, transition: 'background 0.2s' }}
                  onClick={() => handleAddToWishlist(enhancedProduct)}
                  onMouseEnter={e => e.currentTarget.firstChild.style.color = '#e53935'}
                  onMouseLeave={e => e.currentTarget.firstChild.style.color = isWishlisted(enhancedProduct) ? '#e53935' : '#7c4dff'}
                >
                  {isWishlisted(enhancedProduct)
                    ? <Favorite sx={{ color: '#e53935', transition: 'color 0.2s' }} />
                    : <FavoriteBorder sx={{ color: '#7c4dff', transition: 'color 0.2s' }} />
                  }
                </IconButton>
              </Box>
              
              <Chip
                label={enhancedProduct.category}
                sx={{ mb: 2, background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white' }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" color="primary" sx={{ mr: 2 }}>
                  ₹{enhancedProduct.price.toLocaleString()}
                </Typography>
                {enhancedProduct.originalPrice > enhancedProduct.price && (
                  <Typography
                    variant="h6"
                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                  >
                    ₹{enhancedProduct.originalPrice.toLocaleString()}
                  </Typography>
                )}
              </Box>

              {/* Quantity and Actions */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Quantity
                </Typography>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(enhancedProduct.stock, parseInt(e.target.value) || 1)))}
                  inputProps={{ min: 1, max: enhancedProduct.stock }}
                  sx={{ width: 100, mr: 2 }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={!enhancedProduct.inStock}
                  sx={{
                    backgroundColor: '#8B4513',
                    '&:hover': { backgroundColor: '#A0522D' },
                  }}
                >
                  Add to Cart
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
        </>
      )}
    </Container>
  );
};

export default ProductDetail; 