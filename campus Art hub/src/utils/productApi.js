import { supabase } from './supabaseClient';

export async function getAllProducts() {
  let { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data;
}

export async function addProduct(product) {
  let { data, error } = await supabase.from('products').insert([product]);
  if (error) throw error;
  return data[0];
}

export async function updateProduct(id, updates) {
  let { data, error } = await supabase.from('products').update(updates).eq('id', id);
  if (error) throw error;
  return data[0];
}

export async function deleteProduct(id) {
  let { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
} 