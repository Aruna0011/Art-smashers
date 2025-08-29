import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Fade,
  TextField,
} from '@mui/material';
import {
  ArrowForward,
  Star,
  ShoppingCart,
  Palette,
  Brush,
  CameraAlt,
  NavigateBefore,
  NavigateNext,
  ArrowBackIos,
  ArrowForwardIos,
  Close,
  Favorite,
} from '@mui/icons-material';
import unifiedService from '../utils/unifiedService';
import cartStore from '../utils/cartStore';
import wishlistStore from '../utils/wishlistStore';
import imageService from '../utils/imageService';
import toast from 'react-hot-toast';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- Dynamic Images from Admin Panel ---
  const [slides, setSlides] = useState([]);
  const [wallImages, setWallImages] = useState([]);
  const [offerImages, setOfferImages] = useState([]);

  // Section titles and descriptions from admin (localStorage)
  const [carouselText, setCarouselText] = useState('');
  const [wallText, setWallText] = useState('');
  const [offerText, setOfferText] = useState('');
  const [wallLabels, setWallLabels] = useState([]);
  const [offerLabels, setOfferLabels] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        // Load images from Supabase (with localStorage fallback)
        const carouselImages = await imageService.getImagesByType('carousel');
        const wallImgs = await imageService.getImagesByType('wall');
        const offerImgs = await imageService.getImagesByType('offer');
        
        setSlides(carouselImages);
        setWallImages(wallImgs);
        setOfferImages(offerImgs);
      } catch (error) {
        console.error('Error loading images:', error);
        // Fallback to localStorage
        const images = JSON.parse(localStorage.getItem('art_hub_image_management') || '[]');
        const carouselImages = images.filter(img => img.type === 'carousel');
        const wallImgs = images.filter(img => img.type === 'wall');
        const offerImgs = images.filter(img => img.type === 'offer');
        setSlides(carouselImages);
        setWallImages(wallImgs);
        setOfferImages(offerImgs);
      }
    };
    loadImages();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const loadImageMeta = async () => {
      const images = JSON.parse(localStorage.getItem('art_hub_image_management') || '[]');
      setCarouselText(images.find(img => img.type === 'carousel' && img.section_text)?.section_text || '');
      setWallText(images.find(img => img.type === 'wall' && img.section_text)?.section_text || '');
      setOfferText(images.find(img => img.type === 'offer' && img.section_text)?.section_text || '');
      setWallLabels(images.filter(img => img.type === 'wall').map(img => img.label || ''));
      setOfferLabels(images.filter(img => img.type === 'offer').map(img => img.label || ''));
    };
    loadImageMeta();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          unifiedService.getAllCategories(),
          unifiedService.getAllProducts()
        ]);
        setCategories(categoriesData);
        setFeaturedProducts(productsData.slice(0, 8)); // Show first 8 products as featured
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Painting': <Palette />,
      'Sculpture': <Brush />,
      'Digital Art': <CameraAlt />,
      'Photography': <CameraAlt />,
      'Pottery': <Brush />,
      'Mixed Media': <Palette />,
    };
    return icons[categoryName] || <Palette />;
  };

  // Helper to get the correct image src
  const getImageSrc = (img) => {
    if (!img) return '';
    if (img.startsWith('data:') || img.startsWith('http')) return img;
    return img.startsWith('/assets/') ? img : `/assets/${img}`;
  };

  return (
    <Box>
      {/* Image Slideshow Hero Section */}
      <Box sx={{
        position: 'relative',
        minHeight: { xs: '25vh', md: '30vh' },
        overflow: 'hidden',
        mb: { xs: 2, md: 3 },
      }}>
        {/* Slides */}
        {slides.length > 0 ? slides.map((slide, index) => (
          <Link
            to="/products"
            key={index}
            style={{ textDecoration: 'none' }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                background: slide.image.startsWith('data:')
                  ? `url(${slide.image}) center/cover no-repeat`
                  : `url(${new URL(`../assets/${slide.image}`, import.meta.url).href}) center/cover no-repeat`,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.3s ease',
                },
              }}
            />
          </Link>
        )) : (
          <Box sx={{ p: 4, textAlign: 'center', color: '#666' }}>
            No carousel images available
          </Box>
        )}
        {/* Removed navigation arrows and dots */}
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Fade in timeout={800}>
          <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom 
            textAlign="center"
            sx={{ 
              fontWeight: 400,
              letterSpacing: 1,
              color: '#444',
              fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.25rem', lg: '1.35rem' },
              mb: { xs: 1, sm: 1.5, md: 2 },
              textTransform: 'none',
            }}
          >
            Product Categories
          </Typography>
        </Fade>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            gap: 2,
            py: 1,
            px: 1,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            justifyContent: { xs: 'flex-start', md: 'center' },
          }}
        >
          {categories.map((category, index) => {
            // Assign a color for each category (cycle through a palette)
            const colors = [
              '#FFD6E0', // pastel pink
              '#FFF5BA', // pastel yellow
              '#D0F4DE', // pastel mint
              '#B5EAD7', // pastel green
              '#b39ddb', // pastel lavender (replaces #C7CEEA)
              '#FFDAC1', // pastel peach
              '#E2F0CB', // pastel light green
              '#B5D8FA', // pastel blue
              '#b39ddb', // pastel lavender (replaces #F3C6E8)
            ];
            const bgColor = colors[index % colors.length];
            return (
              <Link
                to={`/products?category=${encodeURIComponent(category.name)}`}
                key={category.name}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2.5,
                    py: 1.2,
                    borderRadius: '24px',
                    background: bgColor,
                    color: '#222',
                    fontWeight: 500,
                    fontSize: '1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'transform 0.15s',
                    cursor: 'pointer',
                    minWidth: 120,
                    mb: 1,
                    '&:hover': {
                      transform: 'translateY(-2px) scale(1.04)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                    },
                  }}
                >
                  <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>{getCategoryIcon(category.name)}</Box>
                  {category.name}
                </Box>
              </Link>
            );
          })}
        </Box>
      </Container>

      {/* You Can Design Your Wall Section (moved below categories) */}
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          textAlign="center"
          sx={{
            fontWeight: 500,
            letterSpacing: 1,
            color: '#7c4dff',
            fontSize: { xs: '1.15rem', sm: '1.25rem', md: '1.35rem' },
            mb: { xs: 1, sm: 1.5, md: 2 },
            textTransform: 'none',
          }}
        >
          {wallText || 'Design Your Wall with Our Products!'}
        </Typography>
        {/* Optionally, you can add a description field if you want */}
        {/* <Typography
          variant="body1"
          textAlign="center"
          sx={{ color: '#888', mb: 2, fontSize: { xs: '0.98rem', sm: '1.05rem' } }}
        >
          {wallDesc || ''}
        </Typography> */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            gap: 3,
            py: 1,
            px: 1,
            minHeight: 180,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            justifyContent: { xs: 'flex-start', md: 'center' },
          }}
        >
          {wallImages.map((item, idx) => (
            <Box
              key={item.image}
              sx={{
                minWidth: 180,
                maxWidth: 220,
                flex: '0 0 auto',
                background: '#e1bee7', // Default background for wall images
                borderRadius: 4,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                  boxShadow: '0 6px 18px rgba(124,77,255,0.18)',
                },
              }}
            >
              <Box sx={{ width: '100%', height: 120, overflow: 'hidden', background: '#f5f5f5' }}>
                <img
                  src={(() => { try { return new URL(`../assets/${item.image}`, import.meta.url).href; } catch { return new URL('../assets/Handmade.png', import.meta.url).href; } })()}
                  alt={item.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </Box>
              <Box sx={{ p: 1.2, textAlign: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '1rem', color: '#7c4dff' }}>
                  {wallLabels[idx] || item.label || ''}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      {/* What's New Section (Exclusive Offers) */}
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          textAlign="center"
          sx={{
            fontWeight: 400,
            letterSpacing: 1,
            color: '#444',
            background: 'none',
            WebkitBackgroundClip: 'unset',
            WebkitTextFillColor: 'unset',
            fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.25rem', lg: '1.35rem' },
            mb: { xs: 1, sm: 1.5, md: 2 },
            textTransform: 'none',
          }}
        >
          {offerText || 'Exclusive Offers'}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            gap: 2,
            py: 1,
            px: 1,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            justifyContent: { xs: 'flex-start', md: 'center' },
          }}
        >
          {offerImages.map((item, idx) => (
            <Link
              to="/products"
              key={item.image}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Box
              sx={{
                minWidth: 180,
                maxWidth: 220,
                flex: '0 0 auto',
                background: '#fff',
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                transition: 'box-shadow 0.2s',
                  cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 6px 18px rgba(102,126,234,0.18)',
                    transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ width: '100%', height: 100, overflow: 'hidden', background: '#f5f5f5' }}>
                <img
                  src={(() => { try { return new URL(`../assets/${item.image}`, import.meta.url).href; } catch { return new URL('../assets/Handmade.png', import.meta.url).href; } })()}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </Box>
              <Box sx={{ p: 1.2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '1rem', mb: 0.5, color: '#333' }}>
                  {offerLabels[idx] || item.title || ''}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.92rem' }}>
                  {item.desc}
                </Typography>
              </Box>
            </Box>
            </Link>
          ))}
        </Box>
      </Container>
      {/* Our Products Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%)',
        py: { xs: 4, md: 6 }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 1, sm: 1.5, md: 2 } }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 400,
                letterSpacing: 1,
                color: '#444',
                background: 'none',
                WebkitBackgroundClip: 'unset',
                WebkitTextFillColor: 'unset',
                fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.25rem', lg: '1.35rem' },
                textTransform: 'none',
              }}
            >
              Our Products
            </Typography>
            <Box>
              <Typography
                component={Link}
                to="/products"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '0.98rem', sm: '1.05rem', md: '1.12rem' },
                  color: '#667eea',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  ml: 2,
                  '&:hover': { textDecoration: 'underline', color: '#4b5fc0' },
                }}
              >
                See All
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={2} sx={{ mt: { xs: 2, md: 3 } }}>
            {featuredProducts.map((product, index) => (
              <Grid item xs={6} sm={6} md={3} key={product.id}>
                <Grow in timeout={1000 + index * 200}>
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
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={getImageSrc(product.image)}
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
                            background: 'linear-gradient(45deg, #b39ddb, #764ba2)',
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
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 