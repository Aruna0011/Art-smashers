import React, { useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, Chip
} from '@mui/material';
import { Add, Edit, Delete, Image as ImageIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import unifiedService from '../utils/unifiedService';
import ImagePicker from '../components/ImagePicker';

// Dynamically import all images from assets folder
const imageModules = import.meta.glob('../../assets/*', { eager: true });
const assetImages = Object.keys(imageModules).map((path) => path.split('/').pop());

const AdminCategoryManager = ({ categories, onCategoriesChange }) => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: '',
    is_active: true
  });

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.name) {
      toast.error('Category name is required');
      return;
    }

    try {
      await unifiedService.addCategory(newCategory);
      toast.success('Category added successfully!');
      setOpenAddDialog(false);
      setNewCategory({
        name: '',
        description: '',
        image: '',
        is_active: true
      });
      onCategoriesChange(); // Refresh categories list
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  // Edit category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setOpenEditDialog(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory.name) {
      toast.error('Category name is required');
      return;
    }

    try {
      await unifiedService.updateCategory(editingCategory.id, editingCategory);
      toast.success('Category updated successfully!');
      setOpenEditDialog(false);
      setEditingCategory(null);
      onCategoriesChange(); // Refresh categories list
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await unifiedService.deleteCategory(categoryId);
        toast.success('Category deleted successfully!');
        onCategoriesChange(); // Refresh categories list
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  return (
    <Box>
      {/* Add Category Button */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Category Management</h3>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAddDialog(true)}>
          Add New Category
        </Button>
      </Box>

      {/* Categories Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description || 'No description'}</TableCell>
                <TableCell>
                  <Chip 
                    label={category.is_active ? 'Active' : 'Inactive'} 
                    color={category.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditCategory(category)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCategory(category.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Category Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Category Image</Typography>
              <ImagePicker
                images={assetImages}
                selected={newCategory.image ? [newCategory.image] : []}
                onSelect={(images) => {
                  setNewCategory({ ...newCategory, image: images[0] || '' });
                }}
                multiple={false}
                uploadText="Select or upload category image"
              />
              {newCategory.image && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Selected Image:
                  </Typography>
                  <img 
                    src={newCategory.image} 
                    alt="Category preview" 
                    style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '8px' }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCategory}>Add Category</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          {editingCategory && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Category Name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Category Image</Typography>
                <ImagePicker
                  images={assetImages}
                  selected={editingCategory.image ? [editingCategory.image] : []}
                  onSelect={(images) => {
                    setEditingCategory({ ...editingCategory, image: images[0] || '' });
                  }}
                  multiple={false}
                  uploadText="Select or upload category image"
                />
                {editingCategory.image && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Selected Image:
                    </Typography>
                    <img 
                      src={editingCategory.image} 
                      alt="Category preview" 
                      style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '8px' }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateCategory}>Update Category</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCategoryManager;
