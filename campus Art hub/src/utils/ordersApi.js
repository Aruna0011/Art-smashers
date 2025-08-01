import { supabase } from './supabaseClient';

// Fallback order data for when Supabase is not configured
const fallbackOrders = [
  {
    id: 1,
    userId: 2,
    userName: "John Doe",
    userEmail: "john@example.com",
    items: [
      { id: 1, name: "Abstract Sunset", price: 2500, quantity: 1 }
    ],
    total: 2500,
    status: "pending",
    paymentMethod: "cod",
    address: "Campus Address",
    createdAt: "2024-01-15T00:00:00.000Z"
  },
  {
    id: 2,
    userId: 2,
    userName: "John Doe",
    userEmail: "john@example.com",
    items: [
      { id: 2, name: "Modern Sculpture", price: 5000, quantity: 1 }
    ],
    total: 5000,
    status: "delivered",
    paymentMethod: "upi",
    address: "Campus Address",
    createdAt: "2024-01-10T00:00:00.000Z"
  }
];

export async function getAllOrders() {
  try {
    let { data, error } = await supabase.from('orders').select('*');
    if (error) throw error;
    return data || fallbackOrders;
  } catch (error) {
    console.error('Supabase getAllOrders error:', error);
    // Return fallback data if Supabase is not configured
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const localOrders = JSON.parse(localStorage.getItem('art_hub_orders') || '[]');
      return localOrders.length > 0 ? localOrders : fallbackOrders;
    }
    throw error;
  }
}

export async function updateOrder(id, updates) {
  try {
    let { data, error } = await supabase.from('orders').update(updates).eq('id', id);
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Supabase updateOrder error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const orders = JSON.parse(localStorage.getItem('art_hub_orders') || '[]');
      const orderIndex = orders.findIndex(o => o.id === id);
      if (orderIndex !== -1) {
        orders[orderIndex] = { ...orders[orderIndex], ...updates };
        localStorage.setItem('art_hub_orders', JSON.stringify(orders));
        return orders[orderIndex];
      }
    }
    throw error;
  }
}

export async function createOrder(orderData) {
  try {
    let { data, error } = await supabase.from('orders').insert([orderData]);
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Supabase createOrder error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const orders = JSON.parse(localStorage.getItem('art_hub_orders') || '[]');
      const newOrder = { ...orderData, id: Date.now() };
      orders.push(newOrder);
      localStorage.setItem('art_hub_orders', JSON.stringify(orders));
      return newOrder;
    }
    throw error;
  }
} 