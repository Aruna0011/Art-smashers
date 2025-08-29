import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, Avatar, Button, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Divider, Paper, List, ListItem, ListItemText, ListItemAvatar,
} from '@mui/material';
import {
  Person, ShoppingCart, Edit, Save, Cancel, Visibility, LocalShipping, Payment, LocationOn, Email, Phone, CalendarToday, AttachMoney, PhotoCamera,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllOrders } from '../utils/ordersApi';
import { getSession, signOut } from '../utils/supabaseAuth';
import userService from '../utils/userService';

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userData, setUserData] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (!session || !session.user) {
        navigate('/login');
        return;
      }
      // Get user data from local storage
      const currentUser = JSON.parse(localStorage.getItem('art_hub_current_user'));
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUserData(currentUser);
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (userData) {
      const fetchOrders = async () => {
        try {
          const allOrders = await getAllOrders();
          const userOrders = allOrders.filter(order => 
            order.user_id === userData.id || 
            (order.customer && order.customer.id === userData.id)
          );
          setOrderHistory(userOrders);
        } catch (error) {
          toast.error('Failed to fetch order history: ' + error.message);
        }
      };
      fetchOrders();
    }
  }, [userData]);

  if (!userData) return null;

  const [editData, setEditData] = useState(userData ? { ...userData } : {});

  const handleTabChange = (event, newValue) => setActiveTab(newValue);
  const handleEditProfile = () => {
    setEditData({ ...userData });
    setIsEditing(true);
  };
  const handleImageChange = (e) => {};

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await userService.updateProfile(userData.id, editData);
      setUserData(updatedUser);
      // Update localStorage
      localStorage.setItem('art_hub_current_user', JSON.stringify(updatedUser));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile: ' + error.message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({ ...userData });
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenOrderDialog(true);
  };

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

  const renderProfileInfo = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Profile Information</Typography>
          {!isEditing ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={handleEditProfile}
                sx={{ color: '#8B4513', borderColor: '#8B4513' }}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={async () => {
                  await signOut();
                  localStorage.removeItem('art_hub_current_user');
                  navigate('/login');
                }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveProfile}
                sx={{ backgroundColor: '#8B4513' }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 48,
                  backgroundColor: '#8B4513',
                  margin: '0 auto 16px',
                }}
                src={isEditing ? editData.profileImage : userData.profileImage || ''}
              >
                {(!isEditing && !userData.profileImage && userData && userData.name) ? userData.name.charAt(0) : null}
                {(isEditing && !editData.profileImage && userData && userData.name) ? userData.name.charAt(0) : null}
              </Avatar>
              {isEditing && (
                <Box sx={{ mt: 1 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="profile-image-upload">
                    <IconButton color="primary" aria-label="upload picture" component="span" sx={{ background: '#f3c6e8' }}>
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </Box>
              )}
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{userData && userData.name}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ pl: { md: 4 } }}>
              <TextField
                fullWidth
                label="Full Name"
                value={isEditing ? editData.name : userData && userData.name}
                onChange={e => setEditData({ ...editData, name: e.target.value })}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                value={isEditing ? editData.email : userData && userData.email}
                onChange={e => setEditData({ ...editData, email: e.target.value })}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone"
                value={isEditing ? editData.phone || '' : (userData && userData.phone) || ''}
                onChange={e => setEditData({ ...editData, phone: e.target.value })}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Address"
                value={isEditing ? editData.address || '' : (userData && userData.address) || ''}
                onChange={e => setEditData({ ...editData, address: e.target.value })}
                disabled={!isEditing}
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderOrderHistory = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order History
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderHistory.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{order.id}</Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(order.placedAt || order.date || order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      ₹{order.total.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewOrder(order)}
                      sx={{ color: '#8B4513' }}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account and view your order history
        </Typography>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Profile" icon={<Person />} />
        <Tab label="Orders" icon={<ShoppingCart />} />
      </Tabs>

      {activeTab === 0 && renderProfileInfo()}
      {activeTab === 1 && renderOrderHistory()}

      {/* Order Detail Dialog */}
      <Dialog open={openOrderDialog} onClose={() => setOpenOrderDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Order Details - {selectedOrder?.id}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Order Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemAvatar>
                      <CalendarToday color="primary" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Order Date"
                      secondary={new Date(selectedOrder.placedAt || selectedOrder.date || selectedOrder.created_at).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Payment color="primary" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Payment Method"
                      secondary={selectedOrder.paymentMethod}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <LocalShipping color="primary" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Delivery Date"
                      secondary={selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString() : 'Pending'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <LocationOn color="primary" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Delivery Address"
                      secondary={selectedOrder.address}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Qty</TableCell>
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
                    Total: ₹{selectedOrder.total.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOrderDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile; 