import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Paper, Alert, CircularProgress } from '@mui/material';
import { supabase } from '../utils/supabaseClient';

const SupabaseTester = () => {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [testData, setTestData] = useState('');
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  const testConnection = async () => {
    setStatus('loading');
    setMessage('Testing Supabase connection...');
    
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      // Test connection by fetching server timestamp
      const { data, error } = await supabase.rpc('now');
      
      if (error) throw error;
      
      setStatus('success');
      setMessage(`✅ Connected to Supabase! Server time: ${new Date(data).toLocaleString()}`);
    } catch (error) {
      console.error('Supabase connection error:', error);
      setStatus('error');
      setMessage(`❌ Connection failed: ${error.message}`);
    }
  };

  const fetchCategories = async () => {
    try {
      setStatus('loading');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCategories(data || []);
      setStatus('success');
      setMessage(`Fetched ${data?.length || 0} categories`);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setStatus('error');
      setMessage(`Failed to fetch categories: ${error.message}`);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      setStatus('error');
      setMessage('Category name is required');
      return;
    }

    try {
      setStatus('loading');
      const { data, error } = await supabase
        .from('categories')
        .insert([{ 
          name: newCategory.name, 
          description: newCategory.description,
          is_active: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setStatus('success');
      setMessage('Category added successfully!');
      setNewCategory({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      setStatus('error');
      setMessage(`Failed to add category: ${error.message}`);
    }
  };

  useEffect(() => {
    // Test connection on component mount
    testConnection();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Supabase Connection Tester</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={testConnection}
          disabled={status === 'loading'}
          sx={{ mr: 2 }}
        >
          Test Connection
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={fetchCategories}
          disabled={status === 'loading'}
        >
          Fetch Categories
        </Button>
      </Box>

      {status === 'loading' && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography>Processing...</Typography>
        </Box>
      )}

      {message && (
        <Alert severity={status === 'error' ? 'error' : 'success'} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Add Test Category</Typography>
        <TextField
          label="Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          value={newCategory.description}
          onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />
        <Button 
          variant="contained" 
          onClick={handleAddCategory}
          disabled={status === 'loading'}
        >
          Add Category
        </Button>
      </Box>

      {categories.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>Categories in Database</Typography>
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            {categories.map((cat) => (
              <Box key={cat.id} sx={{ p: 1, borderBottom: '1px solid #eee' }}>
                <Typography><strong>{cat.name}</strong> - {cat.description}</Typography>
                <Typography variant="caption" color="textSecondary">
                  ID: {cat.id} | Created: {new Date(cat.created_at).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default SupabaseTester;
