import { supabase } from './supabaseClient';

// Product management functions for Supabase
export const productApi = {
  // Get all products
  async getAllProducts() {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Add new product
  async addProduct(product) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update product
  async updateProduct(id, updates) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete product
  async deleteProduct(id) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

export default productApi;
