import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Pagination,
  InputAdornment,
  Fade,
  Grow,
  Slide,
  Zoom,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  Favorite,
  FilterList,
  Palette,
  Brush,
  CameraAlt,
  Terrain,
  ViewInAr,
  AutoAwesome,
  FavoriteBorder,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { getAllProducts } from '../utils/productApi';
import { getAllCategories } from '../utils/categoryApi';
import { supabase } from '../utils/supabaseClient';

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Load products and categories from store
    const loadData = async () => {
      const allProducts = await getAllProducts();
      const allCategories = await getAllCategories();
      setProducts(allProducts);
      setCategories(allCategories);
      setLoading(false);
    };
    loadData();

    // --- Real-time subscriptions ---
    const categorySub = supabase
      .channel('categories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, loadData)
      .subscribe();
    const productSub = supabase
      .channel('products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, loadData)
      .subscribe();
    return () => {
      supabase.removeChannel(categorySub);
      supabase.removeChannel(productSub);
    };
  }, []);

  useEffect(() => {
    try {
      setWishlist(JSON.parse(localStorage.getItem('wishlist')) || []);
    } catch {
      setWishlist([]);
    }
  }, []);

  // Read category filter from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    if (categoryFromUrl) {
      setCategoryFilter(categoryFromUrl);
      // Reset to first page when filtering
      setPage(1);
    }
  }, [location.search]);

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Painting': <Palette />,
      'Pottery': <Brush />,
      'Digital Art': <ViewInAr />,
      'Sculpture': <Terrain />,
      'Photography': <CameraAlt />,
      'Mixed Media': <AutoAwesome />,
    };
    return icons[categoryName] || <AutoAwesome />;
  };

  const filterCategories = [
    { value: 'all', label: 'All Categories', icon: <AutoAwesome /> },
    ...categories.map(cat => ({
      value: cat.name,
      label: cat.name,
      icon: getCategoryIcon(cat.name)
    }))
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const productsPerPage = 12; // Show 12 products per page on all devices
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (page - 1) * productsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const getCategoryColor = (category) => {
    const colors = {
      'Painting': '#b39ddb',
      'Pottery': '#4ECDC4',
      'Digital Art': '#45B7D1',
      'Sculpture': '#96CEB4',
      'Photography': '#FFEAA7',
      'Mixed Media': '#DDA0DD',
    };
    return colors[category] || '#b39ddb';
  };

  const getGradientBackground = (category) => {
    const gradients = {
      'Painting': 'linear-gradient(135deg, #b39ddb 0%, #b39ddb 100%)',
      'Pottery': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'Digital Art': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Sculpture': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'Photography': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'Mixed Media': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    };
    return gradients[category] || 'linear-gradient(135deg, #b39ddb 0%, #b39ddb 100%)';
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
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4">Loading beautiful artworks...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Filters with Animation */}
        <Slide direction="up" in timeout={800}>
          <Paper 
            elevation={8}
            sx={{ 
              mb: 4, 
              p: 3, 
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, alignItems: 'center', width: '100%' }}>
              <TextField
                fullWidth
                placeholder="Search artworks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#667eea' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  flex: 1,
                  maxWidth: 320,
                  minWidth: 120,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
              <FormControl fullWidth sx={{ flex: '0 0 160px', maxWidth: 160, minWidth: 100 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      '&:hover': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                >
                  {filterCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {category.icon}
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Slide>
        {/* Products Grid with Beautiful Animations */}
        <Grid container spacing={2}>
          {displayedProducts.map((product, index) => (
            <Grid 
              item 
              xs={6} 
              sm={4} 
              md={4} 
              lg={3} 
              key={product.id}
            >
              <Grow in timeout={500 + index * 100}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      '& .product-image': {
                        transform: 'scale(1.1)',
                      },
                    },
                  }}
                >
                  {/* Wishlist Button */}
                  <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, background: '#fff', boxShadow: '0 2px 8px rgba(124,77,255,0.08)', transition: 'background 0.2s' }}
                    onClick={() => handleAddToWishlist(product)}
                    onMouseEnter={e => e.currentTarget.firstChild.style.color = '#e53935'}
                    onMouseLeave={e => e.currentTarget.firstChild.style.color = isWishlisted(product) ? '#e53935' : '#7c4dff'}
                  >
                    {isWishlisted(product)
                      ? <Favorite sx={{ color: '#e53935', transition: 'color 0.2s' }} />
                      : <FavoriteBorder sx={{ color: '#7c4dff', transition: 'color 0.2s' }} />
                    }
                  </IconButton>
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      image={product.image && (product.image.startsWith('data:') || product.image.startsWith('http'))
                        ? product.image
                        : new URL(`../assets/${product.image}`, import.meta.url).href}
                      alt={product.name}
                      className="product-image"
                      sx={{
                        transition: 'transform 0.3s ease',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        width: '100%',
                        height: isMobile ? '120px' : '200px',
                        minHeight: isMobile ? '120px' : '200px',
                        maxHeight: isMobile ? '120px' : '200px',
                        backgroundColor: '#f5f5f5',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: { xs: 1, md: 2 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Typography variant={ 'h6'} gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', md: '1rem' } }}>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography 
                        variant="h5"
                        color="primary" 
                        sx={{ 
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontSize: { xs: '1rem', md: '1.25rem' }
                        }}
                      >
                        ₹{product.price.toLocaleString()}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        component={Link}
                        to={`/product/${product.id}`}
                        sx={{ 
                          color: '#667eea',
                          borderColor: '#667eea',
                          borderRadius: 2,
                          px: { xs: 1, md: 2 },
                          fontSize: { xs: '0.7rem', md: 'inherit' },
                          '&:hover': {
                            background: '#667eea',
                            color: 'white',
                            borderColor: '#667eea',
                          }
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* Pagination with Animation */}
        {totalPages > 1 && (
          <Zoom in timeout={1000}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    margin: '0 4px',
                    '&.Mui-selected': {
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: 'white',
                    },
                  },
                }}
              />
            </Box>
          </Zoom>
        )}

        {/* No Results with Animation */}
        {filteredProducts.length === 0 && (
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography 
                variant="h4" 
                color="text.secondary" 
                gutterBottom
                sx={{ fontWeight: 300 }}
              >
                No artworks found
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ opacity: 0.8 }}
              >
                Try adjusting your search criteria or explore different categories
              </Typography>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default Products; 