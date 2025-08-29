import React, { useState } from 'react';
import {
  Box, Button, Card, CardContent, Typography, Alert, 
  TextField, Grid, Divider
} from '@mui/material';
import { PlayArrow, CheckCircle, Error } from '@mui/icons-material';
import toast from 'react-hot-toast';
import unifiedService from '../utils/unifiedService';

const AdminTestPanel = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [testCategory, setTestCategory] = useState({
    name: 'Test Category ' + Date.now(),
    description: 'Test category for sync verification',
    image: 'https://via.placeholder.com/300'
  });
  const [testProduct, setTestProduct] = useState({
    name: 'Test Product ' + Date.now(),
    description: 'Test product for sync verification',
    price: 99.99,
    stock: 10,
    category: 'Paintings',
    images: ['https://via.placeholder.com/300'],
    status: 'active'
  });

  const runTest = async (testName, testFunction) => {
    try {
      setTestResults(prev => ({ ...prev, [testName]: { status: 'running' } }));
      const result = await testFunction();
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { status: 'success', result, message: 'Test passed!' } 
      }));
      return result;
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { 
          status: 'error', 
          error: error.message, 
          message: `Test failed: ${error.message}` 
        } 
      }));
      throw error;
    }
  };

  const testEnvironmentVariables = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Environment variables not set');
    }
    
    if (supabaseUrl.includes('your-project-id') || supabaseKey.includes('your-anon-key')) {
      throw new Error('Environment variables contain placeholder values');
    }
    
    return { supabaseUrl: supabaseUrl.substring(0, 30) + '...', keyLength: supabaseKey.length };
  };

  const testSupabaseConnection = async () => {
    const isConfigured = unifiedService.isSupabaseConfigured();
    if (!isConfigured) {
      throw new Error('Supabase not configured in unifiedService');
    }
    return { configured: true };
  };

  const testLoadCategories = async () => {
    const categories = await unifiedService.getAllCategories();
    return { count: categories.length, sample: categories[0] };
  };

  const testLoadProducts = async () => {
    const products = await unifiedService.getAllProducts();
    return { count: products.length, sample: products[0] };
  };

  const testAddCategory = async () => {
    const result = await unifiedService.addCategory(testCategory);
    if (!result || !result.id) {
      throw new Error('Category creation failed - no ID returned');
    }
    return result;
  };

  const testAddProduct = async () => {
    const result = await unifiedService.addProduct(testProduct);
    if (!result || !result.id) {
      throw new Error('Product creation failed - no ID returned');
    }
    return result;
  };

  const testDeleteCategory = async (categoryId) => {
    const result = await unifiedService.deleteCategory(categoryId);
    if (!result) {
      throw new Error('Category deletion failed');
    }
    return { deleted: true };
  };

  const testDeleteProduct = async (productId) => {
    const result = await unifiedService.deleteProduct(productId);
    if (!result) {
      throw new Error('Product deletion failed');
    }
    return { deleted: true };
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});
    
    try {
      // Test 1: Environment Variables
      await runTest('env', testEnvironmentVariables);
      
      // Test 2: Supabase Connection
      await runTest('connection', testSupabaseConnection);
      
      // Test 3: Load Categories
      await runTest('loadCategories', testLoadCategories);
      
      // Test 4: Load Products
      await runTest('loadProducts', testLoadProducts);
      
      // Test 5: Add Category
      const addedCategory = await runTest('addCategory', testAddCategory);
      
      // Test 6: Add Product
      const addedProduct = await runTest('addProduct', testAddProduct);
      
      // Test 7: Delete Product (cleanup)
      await runTest('deleteProduct', () => testDeleteProduct(addedProduct.id));
      
      // Test 8: Delete Category (cleanup)
      await runTest('deleteCategory', () => testDeleteCategory(addedCategory.id));
      
      toast.success('All tests passed! Admin panel is syncing with Supabase correctly.');
      
    } catch (error) {
      toast.error('Some tests failed. Check the results below.');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle color="success" />;
      case 'error': return <Error color="error" />;
      case 'running': return <PlayArrow color="primary" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'running': return 'info';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🧪 Admin Panel Supabase Sync Test
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          This will test if your admin panel can properly sync with Supabase. 
          Make sure you've configured your environment variables first.
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Button 
            variant="contained" 
            onClick={runAllTests} 
            disabled={isRunning}
            startIcon={<PlayArrow />}
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          {Object.entries(testResults).map(([testName, result]) => (
            <Grid item xs={12} key={testName}>
              <Alert 
                severity={getStatusColor(result.status)}
                icon={getStatusIcon(result.status)}
              >
                <Typography variant="subtitle2">
                  {testName.toUpperCase()}: {result.message}
                </Typography>
                {result.result && (
                  <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
                    {JSON.stringify(result.result, null, 2)}
                  </Typography>
                )}
                {result.error && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    Error: {result.error}
                  </Typography>
                )}
              </Alert>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Test Data Configuration
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Test Category Name"
              value={testCategory.name}
              onChange={(e) => setTestCategory({ ...testCategory, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Test Category Description"
              value={testCategory.description}
              onChange={(e) => setTestCategory({ ...testCategory, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Test Product Name"
              value={testProduct.name}
              onChange={(e) => setTestProduct({ ...testProduct, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Test Product Price"
              type="number"
              value={testProduct.price}
              onChange={(e) => setTestProduct({ ...testProduct, price: parseFloat(e.target.value) })}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AdminTestPanel;
