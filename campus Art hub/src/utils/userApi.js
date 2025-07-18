import { supabase } from './supabaseClient';

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
  let { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
}

export async function updateUser(id, updates) {
  let { data, error } = await supabase.from('users').update(updates).eq('id', id);
  if (error) throw error;
  return data[0];
}

export async function deleteUser(id) {
  let { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
} 