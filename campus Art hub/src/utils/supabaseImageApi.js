import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with your actual credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Image management functions for Supabase
export const imageApi = {
  // Upload image to Supabase Storage
  async uploadImage(file, bucket = 'images', folder = 'carousel') {
    if (!supabase) {
      throw new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file');
    }
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);
      
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      
      return { url: publicUrl, path: fileName };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Delete image from Supabase Storage
  async deleteImage(imagePath, bucket = 'images') {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([imagePath]);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // Get all images from a folder
  async getImages(folder = 'carousel', bucket = 'images') {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder);
      
      if (error) throw error;
      
      return data.map(file => ({
        name: file.name,
        path: `${folder}/${file.name}`,
        url: supabase.storage.from(bucket).getPublicUrl(`${folder}/${file.name}`).data.publicUrl
      }));
    } catch (error) {
      console.error('Error getting images:', error);
      throw error;
    }
  },

  // Save image metadata to database
  async saveImageMetadata(imageData) {
    try {
      const { data, error } = await supabase
        .from('image_management')
        .insert([imageData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error saving image metadata:', error);
      throw error;
    }
  },

  // Get all image metadata from database
  async getImageMetadata() {
    try {
      const { data, error } = await supabase
        .from('image_management')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting image metadata:', error);
      return [];
    }
  },

  // Update image metadata
  async updateImageMetadata(id, updates) {
    try {
      const { data, error } = await supabase
        .from('image_management')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating image metadata:', error);
      throw error;
    }
  },

  // Delete image metadata
  async deleteImageMetadata(id) {
    try {
      const { error } = await supabase
        .from('image_management')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting image metadata:', error);
      throw error;
    }
  }
};

export default imageApi;
