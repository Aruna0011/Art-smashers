import { supabase } from './supabaseClient';

export async function getAllCategories() {
  let { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  return data;
}

export async function addCategory(category) {
  let { data, error } = await supabase.from('categories').insert([category]);
  if (error) throw error;
  return data[0];
}

export async function updateCategory(id, updates) {
  let { data, error } = await supabase.from('categories').update(updates).eq('id', id);
  if (error) throw error;
  return data[0];
}

export async function deleteCategory(id) {
  let { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
} 