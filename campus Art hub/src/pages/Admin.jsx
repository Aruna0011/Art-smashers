import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Badge,
} from '@mui/material';
import toast from 'react-hot-toast';
import {
  People,
  ShoppingCart,
  Inventory,
  AttachMoney,
  TrendingUp,
  Edit,
  Delete,
  Visibility,
  Add,
  Dashboard,
  LocalShipping,
  Payment,
  Logout,
  Category,
  Image,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../utils/productApi';
import { getAllCategories, addCategory, updateCategory, deleteCategory } from '../utils/categoryApi';
import { getAllUsers, updateUser, deleteUser } from '../utils/userApi';
import { getAllOrders, updateOrder } from '../utils/ordersApi';
import { uploadProductImage } from '../utils/imageUpload';
import { getSession } from '../utils/supabaseAuth';
import { supabase } from '../utils/supabaseClient';

// Dynamically import all images from assets folder
const imageModules = import.meta.glob('../assets/*', { eager: true });
const assetImages = Object.keys(imageModules).map((path) => path.split('/').pop());
const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [openEditProductDialog, setOpenEditProductDialog] = useState(false);
  const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openEditCategoryDialog, setOpenEditCategoryDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProductData, setEditingProductData] = useState({ images: [] });
  const [editingCategoryData, setEditingCategoryData] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    images: [], // Array of image URLs or base64
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: '',
  });
  // Add image management states here
  // Remove file upload logic for image management and use dropdowns instead
  // Get all asset images
  const assetImages = Object.keys(imageModules).map((path) => path.split('/').pop());

  // State for selected images (filenames)
  const [carouselImages, setCarouselImages] = useState([]);
  const [wallImages, setWallImages] = useState([]);
  const [offerImages, setOfferImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      const { data, error } = await supabase.from('images').select('*').order('order', { ascending: true });
      if (!error && data) {
        setCarouselImages(data.filter(img => img.type === 'carousel'));
        setWallImages(data.filter(img => img.type === 'wall'));
        setOfferImages(data.filter(img => img.type === 'offer'));
      }
    };
    loadImages();

    // Real-time subscription for images
    const imageSub = supabase
      .channel('images')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'images' }, loadImages)
      .subscribe();
    return () => {
      supabase.removeChannel(imageSub);
    };
  }, []);

  // Add search state for each image dropdown section
  const [carouselSearch, setCarouselSearch] = useState('');
  const [wallSearch, setWallSearch] = useState('');
  const [offerSearch, setOfferSearch] = useState('');

  // Add search state for product and category dialogs
  const [productImageSearch, setProductImageSearch] = useState('');
  const [categoryImageSearch, setCategoryImageSearch] = useState('');
  const [editCategoryImageSearch, setEditCategoryImageSearch] = useState('');

  // Add state for image links and section texts
  const [carouselLinks, setCarouselLinks] = useState([]);
  const [wallLinks, setWallLinks] = useState([]);
  const [offerLinks, setOfferLinks] = useState([]);
  const [carouselText, setCarouselText] = useState('');
  const [wallText, setWallText] = useState('');
  const [offerText, setOfferText] = useState('');
  const [wallLabels, setWallLabels] = useState([]);
  const [offerLabels, setOfferLabels] = useState([]);

  useEffect(() => {
    const loadImageMeta = async () => {
      const { data, error } = await supabase.from('images').select('*');
      if (!error && data) {
        setCarouselLinks(data.filter(img => img.type === 'carousel').map(img => img.link || ''));
        setWallLinks(data.filter(img => img.type === 'wall').map(img => img.link || ''));
        setOfferLinks(data.filter(img => img.type === 'offer').map(img => img.link || ''));
        setCarouselText(data.find(img => img.type === 'carousel' && img.text) ? data.find(img => img.type === 'carousel' && img.text).text : '');
        setWallText(data.find(img => img.type === 'wall' && img.text) ? data.find(img => img.type === 'wall' && img.text).text : '');
        setOfferText(data.find(img => img.type === 'offer' && img.text) ? data.find(img => img.type === 'offer' && img.text).text : '');
        setWallLabels(data.filter(img => img.type === 'wall').map(img => img.label || ''));
        setOfferLabels(data.filter(img => img.type === 'offer').map(img => img.label || ''));
      }
    };
    loadImageMeta();
    const imageMetaSub = supabase
      .channel('images')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'images' }, loadImageMeta)
      .subscribe();
    return () => {
      supabase.removeChannel(imageMetaSub);
    };
  }, []);

  // Handlers for dropdown selection
  // Update handleSelectImage to update image in Supabase
  const handleSelectImage = async (type, idx, value) => {
    let images = type === 'carousel' ? carouselImages : type === 'wall' ? wallImages : offerImages;
    const imageToUpdate = images[idx];
    if (imageToUpdate && imageToUpdate.id) {
      try {
        await updateImage(imageToUpdate.id, { image: value });
        toast.success('Image updated!');
      } catch (error) {
        toast.error('Failed to update image: ' + (error.message || error));
      }
    }
  };
  // Add these helper functions for image CRUD
  const addImage = async (imageData) => {
    const { error } = await supabase.from('images').insert([imageData]);
    if (error) throw error;
  };
  const updateImage = async (id, updates) => {
    const { error } = await supabase.from('images').update(updates).eq('id', id);
    if (error) throw error;
  };
  const deleteImage = async (id) => {
    const { error } = await supabase.from('images').delete().eq('id', id);
    if (error) throw error;
  };
  // Update handleAddImageSlot to insert a new image in Supabase
  const handleAddImageSlot = async (type) => {
    try {
      const defaultImage = assetImages[0];
      await addImage({ type, image: defaultImage, label: '', description: '', order: 0 });
      toast.success('Image added!');
    } catch (error) {
      toast.error('Failed to add image: ' + (error.message || error));
    }
  };
  // Update handleRemoveImageSlot to delete image from Supabase
  const handleRemoveImageSlot = async (type, idx) => {
    try {
      const images = type === 'carousel' ? carouselImages : type === 'wall' ? wallImages : offerImages;
      const imageToDelete = images[idx];
      if (imageToDelete && imageToDelete.id) {
        await deleteImage(imageToDelete.id);
        toast.success('Image deleted!');
      }
    } catch (error) {
      toast.error('Failed to delete image: ' + (error.message || error));
    }
  };
  // Update handleLabelChange, handleLinkChange, handleSectionTextChange to update image in Supabase
  const handleLabelChange = async (type, idx, value) => {
    try {
      const images = type === 'wall' ? wallImages : offerImages;
      const imageToUpdate = images[idx];
      if (imageToUpdate && imageToUpdate.id) {
        await updateImage(imageToUpdate.id, { label: value });
        toast.success('Label updated!');
      }
    } catch (error) {
      toast.error('Failed to update label: ' + (error.message || error));
    }
  };
  const handleLinkChange = async (type, idx, value) => {
    try {
      const images = type === 'carousel' ? carouselImages : type === 'wall' ? wallImages : offerImages;
      const imageToUpdate = images[idx];
      if (imageToUpdate && imageToUpdate.id) {
        await updateImage(imageToUpdate.id, { link: value });
        toast.success('Link updated!');
      }
    } catch (error) {
      toast.error('Failed to update link: ' + (error.message || error));
    }
  };
  const handleSectionTextChange = async (type, value) => {
    try {
      // Update all images of this type with the new section text
      const images = type === 'carousel' ? carouselImages : type === 'wall' ? wallImages : offerImages;
      await Promise.all(images.map(img => img.id && updateImage(img.id, { text: value })));
      if (type === 'carousel') setCarouselText(value);
      if (type === 'wall') setWallText(value);
      if (type === 'offer') setOfferText(value);
      toast.success('Section text updated!');
    } catch (error) {
      toast.error('Failed to update section text: ' + (error.message || error));
    }
  };

  // Remove the hardcoded orders array.
  // Add state for orders and load from orderStore:
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const loadOrders = async () => {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
      console.log('Loaded orders:', allOrders);
    };
    
    loadOrders();
    
    // Listen for updates
    const handleStorageChange = () => {
      console.log('Storage changed, reloading data');
      loadOrders();
    };
    
    const handleCategoriesUpdate = () => {
      console.log('Categories updated');
      loadOrders();
    };
    
    const handleProductsUpdate = () => {
      console.log('Products updated event received in admin');
      loadOrders();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    window.addEventListener('productsUpdated', handleProductsUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, []);

  // Update product counts when products change
  useEffect(() => {
    // No longer needed as product counts are managed by Supabase
  }, [orders]); // Changed from products to orders

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenOrderDialog(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditingProductData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      description: product.description,
      images: product.images || [], // Initialize with existing images
    });
    setOpenEditProductDialog(true);
  };

  const handleAddProduct = () => {
    console.log('Add product button clicked'); // Debug log
    setOpenAddProductDialog(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const success = await deleteProduct(productId);
        if (success) {
          toast.success('Product deleted successfully!');
        } else {
          toast.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Supabase error (delete product):', error);
        toast.error('Supabase error: ' + (error.message || error));
      }
    }
  };

  const handleSaveProduct = async () => {
    // Validate required fields
    if (!editingProductData.name || !editingProductData.category || !editingProductData.price || !editingProductData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Update product in store
      const success = await updateProduct(editingProduct.id, {
        ...editingProductData,
        price: Number(editingProductData.price),
        stock: Number(editingProductData.stock),
        images: editingProductData.images || editingProduct.images, // Use edited images or keep existing
      });
      
      if (success) {
        toast.success('Product updated successfully!');
        setOpenEditProductDialog(false);
        setEditingProduct(null);
        setEditingProductData({});
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      console.error('Supabase error (update product):', error);
      toast.error('Supabase error: ' + (error.message || error));
    }
  };

  const handleAddNewProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
        toast.error('Please fill in all required fields');
        return;
      }
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        images: newProduct.images || [],
      };
      const addedProduct = await addProduct(productData);
      if (addedProduct) {
        toast.success('Product added successfully!');
        setOpenAddProductDialog(false);
        setNewProduct({ name: '', category: '', price: '', stock: '', description: '', images: [] });
        setSelectedImage(null);
        setImagePreview('');
      } else {
        toast.error('Failed to add product');
      }
    } catch (error) {
      console.error('Supabase error (add product):', error);
      toast.error('Supabase error: ' + (error.message || error));
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/admin-login');
    } catch (error) {
      toast.error('Error during logout');
    }
  };

  // Category management functions
  const handleAddCategory = () => {
    setOpenCategoryDialog(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditingCategoryData({
      name: category.name,
      description: category.description,
      image: category.image || '',
    });
    setOpenEditCategoryDialog(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    // Check if category has products
    const productsInCategory = products.filter(product => product.category === (await getAllCategories()).find(cat => cat.id === categoryId)?.name);
    
    if (productsInCategory.length > 0) {
      toast.error(`Cannot delete category. It has ${productsInCategory.length} products. Please reassign or delete products first.`);
      return;
    }

    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const success = await deleteCategory(categoryId);
        if (success) {
          toast.success('Category deleted successfully!');
        } else {
          toast.error('Failed to delete category');
        }
      } catch (error) {
        console.error('Supabase error (delete category):', error);
        toast.error('Supabase error: ' + (error.message || error));
      }
    }
  };

  const handleSaveCategory = async () => {
    if (!editingCategoryData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    // Check if name already exists (excluding current category)
    const nameExists = (await getAllCategories()).some(cat => 
      cat.name.toLowerCase() === editingCategoryData.name.toLowerCase() && cat.id !== editingCategory.id
    );

    if (nameExists) {
      toast.error('Category name already exists');
      return;
    }

    try {
      // Update category in store
      const updatedCategory = await updateCategory(editingCategory.id, editingCategoryData);
      
      if (updatedCategory) {
        // Update products that use this category in Supabase
        const updatedProducts = products.filter(product => product.category === editingCategory.name);
        await Promise.all(updatedProducts.map(product =>
          supabase.from('products').update({ category: editingCategoryData.name }).eq('id', product.id)
        ));
        toast.success('Category updated successfully!');
        setOpenEditCategoryDialog(false);
        setEditingCategory(null);
        setEditingCategoryData({});
      } else {
        toast.error('Failed to update category');
      }
    } catch (error) {
      console.error('Supabase error (update category):', error);
      toast.error('Supabase error: ' + (error.message || error));
    }
  };

  const handleAddNewCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    // Check if name already exists
    const nameExists = (await getAllCategories()).some(cat => 
      cat.name.toLowerCase() === newCategory.name.toLowerCase()
    );

    if (nameExists) {
      toast.error('Category name already exists');
      return;
    }

    try {
      const addedCategory = await addCategory({
        name: newCategory.name,
        description: newCategory.description,
        image: newCategory.image || '',
      });

      if (addedCategory) {
        toast.success('Category added successfully!');
        setOpenCategoryDialog(false);
        setNewCategory({ name: '', description: '', image: '' });
      } else {
        toast.error('Failed to add category');
      }
    } catch (error) {
      console.error('Supabase error (add category):', error);
      toast.error('Supabase error: ' + (error.message || error));
    }
  };

  // Image upload functions
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const validImages = files.filter(file => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024);
    if (validImages.length !== files.length) {
      toast.error('Some files are not valid images or are too large (max 5MB)');
    }
    Promise.all(validImages.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    })).then(async images => {
      const uploadedUrls = await Promise.all(images.map(async (imageUrl) => {
        const url = await uploadProductImage(imageUrl);
        return url;
      }));
      setNewProduct(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    });
  };

  const handleRemoveImage = (idx) => {
    setNewProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleImageUploadEdit = (event) => {
    const files = Array.from(event.target.files);
    const validImages = files.filter(file => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024);
    if (validImages.length !== files.length) {
      toast.error('Some files are not valid images or are too large (max 5MB)');
    }
    Promise.all(validImages.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    })).then(async images => {
      const uploadedUrls = await Promise.all(images.map(async (imageUrl) => {
        const url = await uploadProductImage(imageUrl);
        return url;
      }));
      setEditingProductData(prev => ({ ...prev, images: [...(prev.images || []), ...uploadedUrls] }));
    });
  };

  const handleRemoveImageEdit = (idx) => {
    setEditingProductData(prev => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== idx) }));
  };

  // Add this function to reset products
  const handleResetProducts = () => {
    if (window.confirm('Are you sure you want to reset all products to default? This will remove all custom products.')) {
      // productStore.resetToDefaults(); // Removed
      // Reload products after reset
      setTimeout(() => {
        // const allProducts = productStore.getAllProducts(); // Removed
        // setProducts(allProducts);
        toast.success(`Products reset to default! Found ${products.length} default products.`); // Assuming products state holds default products
      }, 100);
    }
  };

  // Function to handle saving order status
  const handleSaveOrderStatus = async (orderId, newStatus) => {
    if (!orderId) return;
    try {
      const updatedOrder = await updateOrder(orderId, { status: newStatus });
      if (updatedOrder) {
        setOrders(orders.map(order => order.id === orderId ? updatedOrder : order));
        toast.success('Order status updated successfully!');
      } else {
        toast.error('Failed to update order status');
      }
    } catch (e) {
      toast.error('Error updating order status');
    }
  };

  // Function to handle deleting an order
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const success = await deleteOrder(orderId); // Assuming deleteOrder is in ordersApi.js
        if (success) {
          setOrders(orders.filter(order => order.id !== orderId));
          toast.success('Order deleted successfully!');
        } else {
          toast.error('Failed to delete order');
        }
      } catch (error) {
        console.error('Supabase error (delete order):', error);
        toast.error('Supabase error: ' + (error.message || error));
      }
    }
  };

  const renderDashboard = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ backgroundColor: '#8B4513', color: 'white', minWidth: 0 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <People sx={{ fontSize: 32, mr: 1 }} />
              <Box>
                <Typography variant="h5">{Array.from(new Set(orders.map(order => order.customer && order.customer.email).filter(Boolean))).length}</Typography>
                <Typography variant="body2">Total Clients</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ backgroundColor: '#D2691E', color: 'white', minWidth: 0 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingCart sx={{ fontSize: 32, mr: 1 }} />
              <Box>
                <Typography variant="h5">{orders.length}</Typography>
                <Typography variant="body2">Total Orders</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ backgroundColor: '#228B22', color: 'white', minWidth: 0 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoney sx={{ fontSize: 32, mr: 1 }} />
              <Box>
                <Typography variant="h5">₹{orders.filter(order => order.status === 'delivered').reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()}</Typography>
                <Typography variant="body2">Total Revenue</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ backgroundColor: '#4169E1', color: 'white', minWidth: 0 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Inventory sx={{ fontSize: 32, mr: 1 }} />
              <Box>
                <Typography variant="h5">{products.length}</Typography>
                <Typography variant="body2">Total Products</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ backgroundColor: '#6a11cb', color: 'white', minWidth: 0 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Category sx={{ fontSize: 32, mr: 1 }} />
              <Box>
                <Typography variant="h5">{categories.length}</Typography>
                <Typography variant="body2">Total Categories</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderOrders = () => {
    const users = userService.getAllUsers();
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Management
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Transaction UPI ID</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, idx) => {
                  const user = users.find(u => u.email === (order.customer?.email || order.clientEmail));
                  return (
                    <TableRow key={order.id || idx}>
                      <TableCell>{order.placedAt ? new Date(order.placedAt).toLocaleString() : '-'}</TableCell>
                      <TableCell>{order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : '-'}</TableCell>
                      <TableCell>{order.customer ? order.customer.email : '-'}</TableCell>
                      <TableCell>
                        {order.items && order.items.map((item, i) => (
                          <div key={i}>{item.name} (x{item.quantity})</div>
                        ))}
                      </TableCell>
                      <TableCell>₹{order.total ? order.total.toLocaleString() : '-'}</TableCell>
                      <TableCell>{order.paymentMethod ? order.paymentMethod.toUpperCase() : '-'}</TableCell>
                      <TableCell>
                        <Chip label={order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'} color={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'error' : 'warning'} size="small" />
                      </TableCell>
                      <TableCell>
                        {order.paymentMethod === 'upi' && order.upiTransactionId ? (
                          <Chip label={order.upiTransactionId} color="success" size="small" />
                        ) : (
                          <Chip label="" color="default" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => {
                          setEditingOrder(order);
                          setEditingOrderStatus(order.status || 'pending');
                          setOpenEditOrderDialog(true);
                        }}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteOrder(order.id)} color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  const renderProducts = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Product Management</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              onClick={async () => {
                const refreshedProducts = await getAllProducts();
                setProducts(refreshedProducts);
                setCategories(await getAllCategories());
                toast.success(`Data refreshed! Found ${refreshedProducts.length} products`);
              }}
            >
              Refresh
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={handleAddProduct}>
              Add New Product
            </Button>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Sold</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary">No products found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{product.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={product.category} size="small" />
                    </TableCell>
                    <TableCell>₹{product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.sold}</TableCell>
                    <TableCell>
                      <Chip
                        label={product.status}
                        color={product.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditProduct(product)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={async () => {
                        await handleDeleteProduct(product.id);
                        setProducts(await getAllProducts());
                      }}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderCategories = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Category Management</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              onClick={async () => {
                setCategories(await getAllCategories());
                toast.success('Categories refreshed!');
              }}
            >
              Refresh
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={handleAddCategory}>
              Add New Category
            </Button>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Products Count</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {category.image && (
                      <img src={new URL(`../assets/${category.image}`, import.meta.url).href} alt={category.name} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {category.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={category.productCount} 
                      color={category.productCount > 0 ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditCategory(category)}
                        sx={{ color: '#8B4513' }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={async () => {
                          await handleDeleteCategory(category.id);
                          setCategories(await getAllCategories());
                        }}
                        sx={{ color: '#D2691E' }}
                        disabled={category.productCount > 0}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderImageDropdownSection = (label, type, images, setImages, search, setSearch, links, setLinks, sectionText, setSectionText, labels, setLabels) => (
    <Card sx={{
      p: 3,
      maxWidth: 600,
      minHeight: 420,
      width: '100%',
      flex: '1 1 500px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      boxShadow: 'none',
      border: '1px solid #eee',
      borderRadius: 3,
      background: '#fafbfc',
      mb: 2
    }}>
      <CardContent sx={{ p: 0 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#6a11cb', fontWeight: 700, fontSize: '1.12rem', mb: 2 }}>{label}</Typography>
        <TextField
          size="small"
          placeholder="Section text (shown below section on homepage)"
          value={sectionText}
          onChange={e => handleSectionTextChange(type, e.target.value)}
          sx={{ mb: 2, width: '100%' }}
        />
        <TextField
          size="small"
          placeholder="Search images..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2, width: '100%' }}
        />
        {images.map((img, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            <FormControl fullWidth size="small" sx={{ mr: 1 }}>
              <InputLabel>Select Image</InputLabel>
              <Select
                value={img.image}
                label="Select Image"
                onChange={e => handleSelectImage(type, idx, e.target.value)}
                MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
              >
                {assetImages.filter(asset => asset.toLowerCase().includes(search.toLowerCase())).map(asset => (
                  <MenuItem key={asset} value={asset}>{asset}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ width: 60, height: 44, ml: 1, borderRadius: 2, overflow: 'hidden', border: '1px solid #eee', background: '#fff' }}>
              <img src={new URL(`../assets/${img.image}`, import.meta.url).href} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
            <TextField
              size="small"
              placeholder="Label (e.g. Abstract Painting)"
              value={labels[idx] || ''}
              onChange={e => handleLabelChange(type, idx, e.target.value)}
              sx={{ width: 160, ml: 1 }}
            />
            <TextField
              size="small"
              placeholder="Link (e.g. /category/landscape)"
              value={links[idx] || ''}
              onChange={e => handleLinkChange(type, idx, e.target.value)}
              sx={{ width: 180, ml: 1 }}
            />
            <IconButton size="small" sx={{ ml: 1, background: '#fff', border: '1px solid #eee' }} onClick={() => handleRemoveImageSlot(type, idx)} disabled={images.length <= 1}>
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        ))}
        <Button variant="outlined" size="small" sx={{ mt: 2, fontSize: '1rem', width: 180 }} onClick={() => handleAddImageSlot(type)}>
          Add Image Slot
        </Button>
      </CardContent>
    </Card>
  );

  const renderImageManagement = () => (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
        {renderImageDropdownSection('Carousel/Slider Images (Below Navbar)', 'carousel', carouselImages, setCarouselImages, carouselSearch, setCarouselSearch, carouselLinks, setCarouselLinks, carouselText, setCarouselText, [], () => {})}
        {renderImageDropdownSection('Design Your Wall With Our Products Images', 'wall', wallImages, setWallImages, wallSearch, setWallSearch, wallLinks, setWallLinks, wallText, setWallText, wallLabels, setWallLabels)}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
        {renderImageDropdownSection('Exclusive Offers Images', 'offer', offerImages, setOfferImages, offerSearch, setOfferSearch, offerLinks, setOfferLinks, offerText, setOfferText, offerLabels, setOfferLabels)}
      </Box>
    </Box>
  );

  // Clear all users from localStorage when admin panel loads
  useEffect(() => {
    localStorage.removeItem('users');
  }, []);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingUserData, setEditingUserData] = useState({});
  const [refreshClients, setRefreshClients] = useState(0);

  const filteredUsers = userService.getAllUsers().filter(user => {
    if (!user.email || !user.name) return false;
    const emailLower = user.email.toLowerCase();
    const nameLower = user.name.toLowerCase();
    return !emailLower.startsWith('test@') && !nameLower.includes('test');
  });
  const messages = contactMessageStore.getAllMessages();

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditingUserData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
    setEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      await updateUser(editingUser.id, editingUserData);
      setEditDialogOpen(false);
      setEditingUser(null);
      setEditingUserData({});
      setRefreshClients(r => r + 1);
      toast.success('Client updated successfully!');
    } catch (e) {
      toast.error('Failed to update client');
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteUser(user.id);
        setRefreshClients(r => r + 1);
        toast.success('Client deleted successfully!');
      } catch (error) {
        console.error('Supabase error (delete user):', error);
        toast.error('Supabase error: ' + (error.message || error));
      }
    }
  };

  // force re-render on refreshClients
  useEffect(() => {}, [refreshClients]);

  const ADMIN_EMAIL = 'arunaarya0011@gmail.com'; // Set to your actual admin email
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoadingAdmin(false);
    }
    checkAdmin();
  }, []);

  if (loadingAdmin) return null;
  if (!isAdmin) {
    navigate('/admin-login');
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Dashboard sx={{ mr: 2, fontSize: { xs: 24, md: 32 }, color: '#8B4513' }} />
          <Typography variant="h4" sx={{ fontSize: { xs: '1.3rem', md: '2.125rem' } }}>
            Admin Dashboard
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{ color: '#8B4513', borderColor: '#8B4513', fontSize: { xs: '0.85rem', md: '1rem' }, px: { xs: 1.5, md: 3 }, py: { xs: 0.5, md: 1 } }}
        >
          Logout
        </Button>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        <Tab label="Dashboard" icon={<Dashboard />} />
        <Tab label="Orders" icon={<ShoppingCart />} />
        <Tab label="Products" icon={<Inventory />} />
        <Tab label="Categories" icon={<Category />} />
        <Tab label="Image Management" icon={<Image />} />
        <Tab label="Clients" icon={<People />} />
      </Tabs>

      {activeTab === 0 && (
        <>
          {renderDashboard()}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Orders
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Customer</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt)).slice(0, 5).map((order, idx) => (
                          <TableRow key={order.id || idx}>
                            <TableCell>{order.placedAt ? new Date(order.placedAt).toLocaleString() : '-'}</TableCell>
                            <TableCell>{order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : '-'}</TableCell>
                            <TableCell>₹{order.total ? order.total.toLocaleString() : '-'}</TableCell>
                            <TableCell>
                              <Chip label={order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'} color={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'error' : 'warning'} size="small" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Status Summary
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>Pending Orders</Typography>
                      <Chip label={orders.filter(order => order.status === 'pending' || !order.status).length} color="warning" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>Delivered Orders</Typography>
                      <Chip label={orders.filter(order => order.status === 'delivered').length} color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>Total Revenue</Typography>
                      <Typography variant="h6" color="primary">
                        ₹{orders.filter(order => order.status === 'delivered').reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
      {activeTab === 1 && renderOrders()}
      {activeTab === 2 && renderProducts()}
      {activeTab === 3 && renderCategories()}
      {activeTab === 4 && renderImageManagement()}
      {activeTab === 5 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Client Management</Typography>
              <Button variant="contained" startIcon={<Add />} onClick={() => setEditDialogOpen(true)}>
                Add New Client
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || '-'}</TableCell>
                      <TableCell>{user.address || '-'}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditUser(user)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteUser(user)} color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={openOrderDialog} onClose={() => setOpenOrderDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Client Information</Typography>
                <Typography><strong>Name:</strong> {selectedOrder.clientName}</Typography>
                <Typography><strong>Email:</strong> {selectedOrder.clientEmail}</Typography>
                <Typography><strong>Address:</strong> {selectedOrder.address}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Order Information</Typography>
                <Typography><strong>Order Date:</strong> {selectedOrder.placedAt ? new Date(selectedOrder.placedAt).toLocaleString() : '-'}</Typography>
                <Typography><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</Typography>
                <Typography><strong>Status:</strong> 
                  <Chip label={selectedOrder.status ? selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) : 'Pending'} color={selectedOrder.status === 'delivered' ? 'success' : selectedOrder.status === 'cancelled' ? 'error' : 'warning'} sx={{ ml: 1 }} />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Products</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.price}</TableCell>
                          <TableCell>₹{item.price * item.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Typography variant="h6">
                    Total Amount: ₹{selectedOrder.total ? selectedOrder.total.toLocaleString() : '0'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOrderDialog(false)}>Close</Button>
          <Button variant="contained">Update Status</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={openEditProductDialog} onClose={() => {
        setOpenEditProductDialog(false);
        setEditingProduct(null);
        setEditingProductData({});
      }} maxWidth="md" fullWidth>
        <DialogTitle>Edit Product - {editingProduct?.name}</DialogTitle>
        <DialogContent>
          {editingProduct && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={editingProductData.name || ''}
                  onChange={(e) => setEditingProductData({ ...editingProductData, name: e.target.value })}
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select 
                    value={editingProductData.category || ''} 
                    label="Category"
                    onChange={(e) => setEditingProductData({ ...editingProductData, category: e.target.value })}
                  >
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <MenuItem key={category.id} value={category.name}>
                          {category.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No categories available</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price"
                  value={editingProductData.price || ''}
                  onChange={(e) => setEditingProductData({ ...editingProductData, price: e.target.value })}
                  type="number"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Stock"
                  value={editingProductData.stock || ''}
                  onChange={(e) => setEditingProductData({ ...editingProductData, stock: e.target.value })}
                  type="number"
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select 
                    value={editingProductData.status || 'active'} 
                    label="Status"
                    onChange={(e) => setEditingProductData({ ...editingProductData, status: e.target.value })}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={editingProductData.description || ''}
                  onChange={(e) => setEditingProductData({ ...editingProductData, description: e.target.value })}
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Product Image
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">Product Images</Typography>
                  <ImagePicker
                    images={assetImages}
                    selected={editingProductData.images || []}
                    onSelect={async imgs => {
                      const uploadedUrls = await Promise.all(imgs.map(async (imageUrl) => {
                        const url = await uploadProductImage(imageUrl);
                        return url;
                      }));
                      setEditingProductData({ ...editingProductData, images: uploadedUrls });
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditProductDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProduct}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog 
        open={openAddProductDialog} 
        onClose={() => {
          setOpenAddProductDialog(false);
          setNewProduct({
            name: '',
            category: '',
            price: '',
            stock: '',
            description: '',
            images: [],
          });
          setSelectedImage(null);
          setImagePreview('');
        }} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select 
                  value={newProduct.category} 
                  label="Category"
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No categories available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                type="number"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                type="number"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Product Image
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Product Images</Typography>
                <ImagePicker
                  images={assetImages}
                  selected={newProduct.images}
                  onSelect={async imgs => {
                    const uploadedUrls = await Promise.all(imgs.map(async (imageUrl) => {
                      const url = await uploadProductImage(imageUrl);
                      return url;
                    }));
                    setNewProduct({ ...newProduct, images: uploadedUrls });
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenAddProductDialog(false);
            setNewProduct({
              name: '',
              category: '',
              price: '',
              stock: '',
              description: '',
              images: [],
            });
            setSelectedImage(null);
            setImagePreview('');
          }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddNewProduct}>Add Product</Button>
        </DialogActions>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Category Image</Typography>
                <ImagePicker
                  images={assetImages}
                  selected={newCategory.image ? [newCategory.image] : []}
                  onSelect={async imgs => {
                    const uploadedUrls = await Promise.all(imgs.map(async (imageUrl) => {
                      const url = await uploadProductImage(imageUrl);
                      return url;
                    }));
                    setNewCategory({ ...newCategory, image: uploadedUrls[0] || '' });
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddNewCategory}>Add Category</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={openEditCategoryDialog} onClose={() => setOpenEditCategoryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Category - {editingCategory?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category Name"
                value={editingCategoryData.name || ''}
                onChange={(e) => setEditingCategoryData({ ...editingCategoryData, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                value={editingCategoryData.description || ''}
                onChange={(e) => setEditingCategoryData({ ...editingCategoryData, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Category Image</Typography>
                <ImagePicker
                  images={assetImages}
                  selected={editingCategoryData.image ? [editingCategoryData.image] : []}
                  onSelect={async imgs => {
                    const uploadedUrls = await Promise.all(imgs.map(async (imageUrl) => {
                      const url = await uploadProductImage(imageUrl);
                      return url;
                    }));
                    setEditingCategoryData({ ...editingCategoryData, image: uploadedUrls[0] || '' });
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditCategoryDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCategory}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Order Status Dialog */}
      <Dialog open={openEditOrderDialog} onClose={() => setOpenEditOrderDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Order Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={editingOrderStatus}
              label="Status"
              onChange={e => setEditingOrderStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditOrderDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => handleSaveOrderStatus(editingOrder?.id, editingOrderStatus)}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Client - {editingUser?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={editingUserData.name || ''}
                onChange={(e) => setEditingUserData({ ...editingUserData, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                value={editingUserData.email || ''}
                onChange={(e) => setEditingUserData({ ...editingUserData, email: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone"
                value={editingUserData.phone || ''}
                onChange={(e) => setEditingUserData({ ...editingUserData, phone: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Address"
                value={editingUserData.address || ''}
                onChange={(e) => setEditingUserData({ ...editingUserData, address: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUser}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin; 