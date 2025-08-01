import { supabase } from './supabaseClient';

// Fallback user data for when Supabase is not configured
const fallbackUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@campusarthub.com",
    phone: "+91 98765 43210",
    address: "Campus Address",
    isAdmin: true,
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 98765 43211",
    address: "Student Address",
    isAdmin: false,
    createdAt: "2024-01-02T00:00:00.000Z"
  }
];

export async function registerUser(userData) {
  // Check if email already exists
  let { data: existing, error: checkError } = await supabase.from('users').select('*').eq('email', userData.email);
  if (checkError) throw checkError;
  if (existing && existing.length > 0) throw new Error('Email already registered. Please use a different email or login.');

  // Insert new user
  let { data, error } = await supabase.from('users').insert([userData]);
  if (error) throw error;
  return data[0];
}

export async function loginUser(email, password) {
  let { data, error } = await supabase.from('users').select('*').eq('email', email).eq('password', password);
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Invalid email or password');
  return data[0];
}

export async function getAllUsers() {
  try {
    let { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data || fallbackUsers;
  } catch (error) {
    console.error('Supabase getAllUsers error:', error);
    // Return fallback data if Supabase is not configured
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const localUsers = JSON.parse(localStorage.getItem('art_hub_users') || '[]');
      return localUsers.length > 0 ? localUsers : fallbackUsers;
    }
    throw error;
  }
}

export async function updateUser(id, updates) {
  try {
    let { data, error } = await supabase.from('users').update(updates).eq('id', id);
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Supabase updateUser error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const users = JSON.parse(localStorage.getItem('art_hub_users') || '[]');
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('art_hub_users', JSON.stringify(users));
        return users[userIndex];
      }
    }
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    let { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Supabase deleteUser error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const users = JSON.parse(localStorage.getItem('art_hub_users') || '[]');
      const filteredUsers = users.filter(u => u.id !== id);
      localStorage.setItem('art_hub_users', JSON.stringify(filteredUsers));
    } else {
      throw error;
    }
  }
} 