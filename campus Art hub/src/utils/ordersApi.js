import { supabase } from './supabaseClient';

export async function getOrders(userId) {
  let { data, error } = await supabase.from('orders').select('*').eq('user_id', userId).order('placed_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addOrder(order) {
  let { data, error } = await supabase.from('orders').insert([order]);
  if (error) throw error;
  return data[0];
}

export async function updateOrder(orderId, updates) {
  let { data, error } = await supabase.from('orders').update(updates).eq('id', orderId);
  if (error) throw error;
  return data[0];
}

export async function getAllOrders() {
  let { data, error } = await supabase.from('orders').select('*').order('placed_at', { ascending: false });
  if (error) throw error;
  return data;
} 